package com.alibaba.mem0.example.controller;

import com.alibaba.example.chatmemory.mem0.MemZeroChatMemoryAdvisor;
import com.alibaba.example.chatmemory.mem0.MemZeroServerRequest;
import com.alibaba.example.chatmemory.mem0.MemZeroServerResp;
import com.alibaba.example.chatmemory.mem0.MemZeroServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static com.alibaba.example.chatmemory.mem0.MemZeroChatMemoryAdvisor.USER_ID;


/**
 * @author morain.miao
 * @date 2025/06/23 11:54
 * @description mem0的一些应用
 */
@RestController
@RequestMapping("/advisor/memory/mem0")
public class MemZeroMemoryController {
    private static final Logger logger = LoggerFactory.getLogger(MemZeroMemoryController.class);

    private final ChatClient chatClient;
    private final VectorStore store;
    private final MemZeroServiceClient memZeroServiceClient;

    public MemZeroMemoryController(ChatClient.Builder builder, VectorStore store, MemZeroServiceClient memZeroServiceClient) {
        this.store = store;
        this.memZeroServiceClient = memZeroServiceClient;
        this.chatClient = builder
                .defaultAdvisors(
                        MemZeroChatMemoryAdvisor.builder(store).build()
                )
                .build();
    }

    @GetMapping("/call")
    public String call(@RequestParam(value = "message", defaultValue = "你好，我是万能的喵，我爱玩三角洲行动") String message,
                       @RequestParam(value = "user_id", defaultValue = "miao") String userId
    ) {
        return chatClient.prompt(message)
                .advisors(
                        a -> a.params(Map.of(USER_ID, userId))
                )
                .call().content();
    }

    @GetMapping("/messages")
    public List<Document> messages(
            @RequestParam(value = "query", defaultValue = "我的爱好是什么？") String query,
            @RequestParam(value = "user_id", defaultValue = "miao") String userId) {
        MemZeroServerRequest.SearchRequest searchRequest = MemZeroServerRequest.SearchRequest.builder().query(query).userId(userId).build();
        return store.similaritySearch(searchRequest);
    }

    @GetMapping("/test")
    public void test(){
        //TODO mem0目前仅支持用户短期记忆，agent的短期记忆和长期记忆有bug。At: 2025-08-22 00:26:05
        // https://github.com/mem0ai/mem0/issues/3349

        // 用户短期记忆
//        memZeroServiceClient.addMemory(
//                MemZeroServerRequest.MemoryCreate.builder()
//                        .userId("test1")
//                        .runId("trip-planning-2025")
//                        .messages(List.of(
//                                new MemZeroServerRequest.Message("user", "I'm planning a trip to Japan next month."),
//                                new MemZeroServerRequest.Message("assistant", "That's exciting, Alex! A trip to Japan next month sounds wonderful. Would you like some recommendations for vegetarian-friendly restaurants in Japan?"),
//                                new MemZeroServerRequest.Message("user", "Yes, please! Especially in Tokyo."),
//                                new MemZeroServerRequest.Message("assistant", "Great! I'll remember that you're interested in vegetarian restaurants in Tokyo for your upcoming trip. I'll prepare a list for you in our next interaction."))
//                        )
//                        .build());
//        logger.info("用户短期记忆保存成功");
        // agent的长期记忆
//        memZeroServiceClient.addMemory(
//                MemZeroServerRequest.MemoryCreate.builder()
//                        .agentId("agent1")
//                        .messages(List.of(
//                                new MemZeroServerRequest.Message("system", "You are an AI tutor with a personality. Give yourself a name for the user."),
//                                new MemZeroServerRequest.Message("assistant", "Understood. I'm an AI tutor with a personality. My name is Alice."))
//                        )
//                        .build());
//        logger.info("agent的长期记忆保存成功");
        //用户和agent的长期记忆
//        memZeroServiceClient.addMemory(
//                MemZeroServerRequest.MemoryCreate.builder()
//                        .agentId("agent2")
//                        .userId("test2")
//                        .messages(List.of(
//                                new MemZeroServerRequest.Message("user", "I'm travelling to San Francisco"),
//                                new MemZeroServerRequest.Message("assistant", "That's great! I'm going to Dubai next month."))
//                        )
//                        .build());
//        logger.info("用户和agent的长期记忆保存成功");


        // 测试agent的短期记忆
//        memZeroServiceClient.addMemory(
//                MemZeroServerRequest.MemoryCreate.builder()
//                        .agentId("agent1")
//                        .runId("trip-planning-2026")
//                        .messages(List.of(
//                                new MemZeroServerRequest.Message("system", "You are an AI tutor with a personality. Give yourself a name for the user."),
//                                new MemZeroServerRequest.Message("assistant", "Understood. I'm an AI tutor with a personality. My name is Alice."))
//                        )
//                        .build());
//        logger.info("agent的短期记忆保存成功");
//
//        logger.info("allMemories: {}", memZeroServiceClient.getAllMemories("test", null, null));
//        logger.info("allMemories: {}", memZeroServiceClient.getAllMemories(null, "123", null));
//        logger.info("allMemories: {}", memZeroServiceClient.getAllMemories(null, null, "qwen"));
//        logger.info("allMemories: {}", memZeroServiceClient.getAllMemories("test", "123", "qwen"));
//        MemZeroServerResp allMemories = memZeroServiceClient.getAllMemories("test", null, null);
//        Map<String, Object> memory = memZeroServiceClient.updateMemory(allMemories.getResults().stream().findFirst().get().getId(), Map.of("memory", "我是测试同学，我不喜欢敲代码"));
//        logger.info("updateMemory: {}", memory);
//        List<Map<String, Object>> memoryHistory = memZeroServiceClient.getMemoryHistory(allMemories.getResults().stream().findFirst().get().getId());
//        logger.info("memoryHistory: {}", memoryHistory);
//
//        memZeroServiceClient.deleteMemory(allMemories.getResults().stream().findFirst().get().getId());
//        memZeroServiceClient.deleteAllMemories("test", null, null);


    }
}
