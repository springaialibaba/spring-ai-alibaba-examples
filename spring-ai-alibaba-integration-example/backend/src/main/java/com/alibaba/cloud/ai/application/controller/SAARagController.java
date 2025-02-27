package com.alibaba.cloud.ai.application.controller;

import com.alibaba.cloud.ai.application.entity.result.Result;
import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatModel;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.milvus.MilvusVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.UUID;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

/**
 * @author 北极星
 */
@RestController
@RequestMapping("/rag/")
public class SAARagController {

    private final ChatClient chatClient;

    @Autowired
    private final MilvusVectorStore vectorStore;

    public SAARagController (MilvusVectorStore vectorStore) {
        this.vectorStore = vectorStore;

        this.chatClient =
                ChatClient.builder(new DashScopeChatModel(new DashScopeApi(System.getenv(
                        "AI_DASH_SCOPE_API_KEY"))))
                // 实现 Chat Memory 的 Advisor
                // 在使用 Chat Memory 时，需要指定对话 ID，以便 Spring AI 处理上下文。
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                // 实现 Logger 的 Advisor
                .defaultAdvisors(new SimpleLoggerAdvisor())
                // 设置 ChatClient 中 ChatModel 的 Options 参数
                .defaultOptions(DashScopeChatOptions.builder()
                        .withTopP(0.7)
                        .build())
                .build();
    }

    @GetMapping("query")
    public Flux<Result<String>> rag (@RequestParam(value = "prompt", required = true) String prompt) {
        Advisor qaAdvisor = RetrievalAugmentationAdvisor.builder()
                .documentRetriever(VectorStoreDocumentRetriever.builder()
                        .similarityThreshold(0.50)
                        .vectorStore(vectorStore)
                        .build())
                .build();

        return chatClient.prompt()
                .advisors(spec -> spec.param(CHAT_MEMORY_CONVERSATION_ID_KEY, UUID.randomUUID().toString())
                        .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))
                .advisors(qaAdvisor)
                .user(prompt)
                .call()
                .responseEntity(Flux.class)
                .getEntity()
                .map(Result::success);
    }
}
