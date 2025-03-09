package com.alibaba.cloud.ai.example.rag.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 *
 * RAG memory 使用示例
 */

@RestController
@RequestMapping("/module-rag")
public class ModuleRAGMemoryController {

	private final ChatClient chatClient;

	private final MessageChatMemoryAdvisor chatMemoryAdvisor;

	private final RetrievalAugmentationAdvisor retrievalAugmentationAdvisor;

	public ModuleRAGMemoryController(
			ChatClient.Builder chatClientBuilder,
			ChatMemory chatMemory,
			VectorStore vectorStore
	) {

		this.chatClient = chatClientBuilder.build();
		this.chatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory)
				.build();

		this.retrievalAugmentationAdvisor = RetrievalAugmentationAdvisor.builder()
				.documentRetriever(VectorStoreDocumentRetriever.builder()
						.similarityThreshold(0.50)
						.vectorStore(vectorStore)
						.build())
				.build();
	}

	@PostMapping("/rag/memory/{chatId}")
	public String chatWithDocument(
			@RequestBody String prompt,
			@PathVariable("chatId") String conversationId
	) {

		return chatClient.prompt()
				.advisors(chatMemoryAdvisor, retrievalAugmentationAdvisor)
				.advisors(advisors -> advisors.param(
						AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY, conversationId))
				.user(prompt)
				.call()
				.content();
	}

}
