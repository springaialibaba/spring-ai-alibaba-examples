package com.alibaba.cloud.ai.application.controller;

import com.alibaba.cloud.ai.application.annotation.UserIp;
import com.alibaba.cloud.ai.application.service.SAASummarizerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */


@RestController
@RequestMapping("/api/v1")
@Tag(name = "Docs Summarize APIs")
public class SAASummarizerController {

	private final SAASummarizerService docsSummaryService;

	public SAASummarizerController(SAASummarizerService docsSummaryService) {
		this.docsSummaryService = docsSummaryService;
	}

	@UserIp
	@Operation(summary = "Docs summary")
	@PostMapping("/summarizer")
	public Flux<String> summary(
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam(value = "url", required = false) String url,
			@RequestHeader(value = "chatId", required = false) String chatId,
			HttpServletResponse response
	) {

		if (!StringUtils.hasText(chatId)) {
			chatId = "spring-ai-alibaba-docs-summary";
		}

		response.setCharacterEncoding("UTF-8");

		return docsSummaryService.summary(file, url, chatId);
	}

}
