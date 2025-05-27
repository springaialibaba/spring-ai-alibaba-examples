package com.alibaba.cloud.ai.application.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.alibaba.cloud.ai.application.exception.SAAAppException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Service
public class SAASummarizerService {

	private static final Logger logger = LoggerFactory.getLogger(SAASummarizerService.class);

	private final ChatClient chatClient;

	public SAASummarizerService(
			ChatModel chatModel,
			@Qualifier("summarizerPromptTemplate") PromptTemplate docsSummaryPromptTemplate
	) {

		this.chatClient = ChatClient.builder(chatModel)
				.defaultSystem(
						docsSummaryPromptTemplate.getTemplate()
				).defaultAdvisors(
						new MessageChatMemoryAdvisor(new InMemoryChatMemory()),
						new SimpleLoggerAdvisor()
				).build();
	}

	public Flux<String> summary(MultipartFile file, String url, String chatId) {

		String text = getText(url, file);
		if (!StringUtils.hasText(text)) {
			return Flux.error(new SAAAppException("Invalid file content"));
		}

		return chatClient.prompt()
				.user("Summarize the document")
				.advisors(memoryAdvisor -> memoryAdvisor
						.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatId)
						.param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 1)
				).user(text)
				.stream().content();
	}

	private String getText(String url, MultipartFile file) {

		if (Objects.nonNull(file)) {

			logger.debug("Reading file content form MultipartFile");
			List<Document> documents = new TikaDocumentReader(file.getResource()).get();
			return documents.stream()
					.map(Document::getFormattedContent)
					.collect(Collectors.joining("\n\n"));
		}

		logger.info("url not impl");
		// logger.debug("Reading file content form URL");
		// if (!UrlValidator.isValidUrl(url)) {
		// 	logger.error("Invalid URL");
		// 	throw new SAAAppException("Invalid URL");
		// }
		//
		// CrawlerFirecrawlProperties crawlerFirecrawlProperties = new CrawlerFirecrawlProperties();
		// crawlerFirecrawlProperties.setToken("122222");
		// CrawlerJinaProperties jinaProperties = new CrawlerJinaProperties();
		// jinaProperties.setToken(jinaToken);
		// CrawlerJinaServiceImpl jinaService = new CrawlerJinaServiceImpl(jinaProperties, objectMapper);
		// String text = jinaService.run(url);
		//
		// if (StringUtils.hasText(text)) {
		// 	return text;
		// }

		return "";
	}

}
