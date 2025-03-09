package com.alibaba.cloud.ai.example.rag.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@RequestMapping("/module-rag")
public class ModuleRAGBasicController {

	private final ChatClient chatClient;
	private final RetrievalAugmentationAdvisor retrievalAugmentationAdvisor;

	public ModuleRAGBasicController(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {

		this.chatClient = chatClientBuilder.build();
		this.retrievalAugmentationAdvisor = RetrievalAugmentationAdvisor.builder()
				.documentRetriever(VectorStoreDocumentRetriever.builder()
						.similarityThreshold(0.50)
						.vectorStore(vectorStore)
						.build()
				).build();
	}

	@GetMapping("/rag/basic")
	public String chatWithDocument(@RequestParam("prompt") String prompt) {

		return chatClient.prompt()
				.advisors(retrievalAugmentationAdvisor)
				.user(prompt)
				.call()
				.content();
	}

}
