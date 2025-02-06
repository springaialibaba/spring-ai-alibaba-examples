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

import com.alibaba.cloud.ai.application.annotation.UserIp;
import com.alibaba.cloud.ai.application.entity.result.Result;
import com.alibaba.cloud.ai.application.service.SAAChatService;
import com.alibaba.cloud.ai.application.utils.ValidText;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@Tag(name = "Chat APIs")
@RequestMapping("/api/v1/")
public class SAAChatController {

	@Resource
	private SAAChatService chatService;

	@UserIp
	@GetMapping("/chat/{prompt}")
	@Operation(summary = "DashScope Flux Chat")
	public Flux<Result<String>> chat(
			@PathVariable("prompt") String prompt,
			HttpServletResponse response
	) {

		if (!ValidText.isValidate(prompt)) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return Flux.just(Result.failed("No chat prompt provided"));
		}

		response.setCharacterEncoding("UTF-8");

		return chatService.chat(prompt).map(Result::success);
	}
}
