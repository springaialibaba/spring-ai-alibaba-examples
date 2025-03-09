package com.alibaba.example.summarizer.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 总结文件文本内容
 */

@RestController
public class SummaryController {

	@Value("classpath:/text-summarize.st")
	private Resource summarizeTemplate;

	private final ChatClient chatClient;

	private static final String DEFAULT_SUMMARY_PROMPT = "总结文本";

	public SummaryController(ChatClient.Builder chatClientBuilder) {
		this.chatClient = chatClientBuilder.build();
	}

	@PostMapping(path = "/summarize", produces = "text/plain")
	public String summarize(@RequestParam("file") MultipartFile file) {

		List<Document> documents = new TikaDocumentReader(file.getResource()).get();

		String documentText = documents.stream()
				.map(Document::getFormattedContent)
				.collect(Collectors.joining("\n\n"));

		return chatClient.prompt()
				.user(DEFAULT_SUMMARY_PROMPT)
				.system(systemSpec ->
						systemSpec.text(summarizeTemplate).param("document", documentText)
				).call()
				.content();
	}

}
