package com.alibaba.cloud.ai.application.service;

import com.alibaba.cloud.ai.application.advisor.ReasoningContentAdvisor;
import com.alibaba.cloud.ai.application.rag.core.IQSSearchEngine;
import com.alibaba.cloud.ai.application.rag.data.DataClean;
import com.alibaba.cloud.ai.application.rag.WebSearchRetriever;
import com.alibaba.cloud.ai.application.rag.join.ConcatenationDocumentJoiner;
import com.alibaba.cloud.ai.application.rag.prompt.CustomContextQueryAugmenter;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.rag.postretrieval.ranking.DocumentRanker;
import org.springframework.ai.rag.preretrieval.query.expansion.QueryExpander;
import org.springframework.ai.rag.preretrieval.query.transformation.QueryTransformer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Service
public class SAAWebSearchService {

	private final ChatClient chatClient;

	private final SimpleLoggerAdvisor simpleLoggerAdvisor;

	private final ReasoningContentAdvisor reasoningContentAdvisor;

	private final QueryTransformer queryTransformer;

	private final QueryExpander queryExpander;

	private final PromptTemplate queryArgumentPromptTemplate;

	private final WebSearchRetriever webSearchRetriever;

	// It works better here with DeepSeek-R1
	private static final String DEFAULT_WEB_SEARCH_MODEL = "deepseek-r1";

	public SAAWebSearchService(
			ChatClient.Builder chatClientBuilder,
			QueryTransformer queryTransformer,
			QueryExpander queryExpander,
			IQSSearchEngine searchEngine,
			DataClean dataCleaner,
			DocumentRanker documentRanker,
			@Qualifier("queryArgumentPromptTemplate") PromptTemplate queryArgumentPromptTemplate
	) {

		this.queryTransformer = queryTransformer;
		this.queryExpander = queryExpander;
		this.queryArgumentPromptTemplate = queryArgumentPromptTemplate;

		// reasoning content for DeepSeek-r1 is integrated into the output
		this.reasoningContentAdvisor = new ReasoningContentAdvisor(1);

		// Build chatClient
		this.chatClient = chatClientBuilder
				.defaultOptions(
						DashScopeChatOptions.builder()
								.withModel(DEFAULT_WEB_SEARCH_MODEL)
								// stream 模式下是否开启增量输出
								.withIncrementalOutput(true)
								.build())
				.build();

		// 日志
		this.simpleLoggerAdvisor = new SimpleLoggerAdvisor(100);

		this.webSearchRetriever = WebSearchRetriever.builder()
				.searchEngine(searchEngine)
				.dataCleaner(dataCleaner)
				.maxResults(2)
				.enableRanker(true)
				.documentRanker(documentRanker)
				.build();
	}

	//Handle user input
	public Flux<String> chat(String prompt) {

		return chatClient.prompt()
				.advisors(
					createRetrievalAugmentationAdvisor(),
					reasoningContentAdvisor,
					simpleLoggerAdvisor
				).user(prompt)
				.stream()
				.content();
	}

	private RetrievalAugmentationAdvisor createRetrievalAugmentationAdvisor() {

		return RetrievalAugmentationAdvisor.builder()
				.documentRetriever(webSearchRetriever)
				.queryTransformers(queryTransformer)
				.queryAugmenter(
						new CustomContextQueryAugmenter(
								queryArgumentPromptTemplate,
								null,
								true)
				).queryExpander(queryExpander)
				.documentJoiner(new ConcatenationDocumentJoiner())
				.build();
	}

}
