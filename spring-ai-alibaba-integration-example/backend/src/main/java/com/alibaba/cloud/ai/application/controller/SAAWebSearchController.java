package com.alibaba.cloud.ai.application.controller;

import com.alibaba.cloud.ai.application.service.SAAWebSearchService;
import com.alibaba.cloud.ai.application.utils.ValidText;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 *
 * 默认使用 deepseek-r1 模型，效果更好。
 */

@RestController
@Tag(name = "Web Search APIs")
@RequestMapping("/api/v1/")
public class SAAWebSearchController {

	private final SAAWebSearchService webSearch;

	public SAAWebSearchController(SAAWebSearchService webSearch) {
		this.webSearch = webSearch;
	}

	@GetMapping("/search")
	public Flux<String> search(
			@RequestParam(value = "query") String query,
			HttpServletResponse response
	) {

		if (!ValidText.isValidate(query)) {
			return Flux.just("Invalid query");
		}

		response.setCharacterEncoding("UTF-8");

		return webSearch.chat(query);
	}

}
