/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.alibaba.cloud.ai.application.controller;

import com.alibaba.cloud.ai.application.service.SAAWebSearchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 *
 * The deepseek-r1 model is used by default, which works better.
 */

@RestController
@Tag(name = "Web Search APIs")
@RequestMapping("/api/v1")
public class SAAWebSearchController {

	private final SAAWebSearchService webSearch;

	public SAAWebSearchController(SAAWebSearchService webSearch) {
		this.webSearch = webSearch;
	}

	@PostMapping("/search")
	public Flux<String> search(
			HttpServletResponse response,
			@Validated @RequestBody String prompt
	) {

		response.setCharacterEncoding("UTF-8");
		return webSearch.chat(prompt);
	}

}
