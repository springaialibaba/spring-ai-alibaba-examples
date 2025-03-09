package com.alibaba.cloud.ai.example.rag.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.preretrieval.query.transformation.RewriteQueryTransformer;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 *
 * RewriteQueryTransformer 使用示例
 * https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html#_rewritequerytransformer
 */

@RestController
@RequestMapping("/module-rag")
public class ModuleRAGRewriteController {

	private final ChatClient chatClient;

	private final RetrievalAugmentationAdvisor retrievalAugmentationAdvisor;

	public ModuleRAGRewriteController(
			ChatClient.Builder chatClientBuilder,
			VectorStore vectorStore
	) {

		this.chatClient = chatClientBuilder.build();

		var documentRetriever = VectorStoreDocumentRetriever.builder()
				.vectorStore(vectorStore)
				.similarityThreshold(0.50)
				.build();

		var queryTransformer = RewriteQueryTransformer.builder()
				.chatClientBuilder(chatClientBuilder.build().mutate())
				.targetSearchSystem("vector store")
				.build();

		this.retrievalAugmentationAdvisor = RetrievalAugmentationAdvisor.builder()
				.documentRetriever(documentRetriever)
				.queryTransformers(queryTransformer)
				.build();
	}

	@PostMapping("/rag/rewrite")
	public String rag(@RequestBody String prompt) {

		return chatClient.prompt()
				.advisors(retrievalAugmentationAdvisor)
				.user(prompt)
				.call()
				.content();
	}
}
