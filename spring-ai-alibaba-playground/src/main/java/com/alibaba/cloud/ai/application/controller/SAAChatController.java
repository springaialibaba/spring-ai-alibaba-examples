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

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.alibaba.cloud.ai.application.annotation.UserIp;
import com.alibaba.cloud.ai.application.service.SAABaseService;
import com.alibaba.cloud.ai.application.service.SAAChatService;
import com.alibaba.cloud.ai.application.utils.ValidUtils;
import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@Tag(name = "Chat APIs")
@RequestMapping("/api/v1")
public class SAAChatController {

	private final SAAChatService chatService;

	private final SAABaseService baseService;

	public SAAChatController(SAAChatService chatService, SAABaseService baseService) {
		this.chatService = chatService;
		this.baseService = baseService;
	}

	/**
	 * Send the specified parameters to get the model response.
	 * 1. When the send prompt is empty, an error message is returned.
	 * 2. When sending a model, it is allowed to be empty, and when the parameter has a value and
	 * 	  is in the model configuration list, the corresponding model is called. If there is no return error.
	 * 	  If the model parameter is empty, set the default model. qwen-plus
	 * 3. The chatId chat memory, passed by the front-end, is of type Object and cannot be repeated
	 */
	@UserIp
	@GetMapping("/chat")
	@Operation(summary = "DashScope Flux Chat")
	public Flux<String> chat(
			@RequestParam("prompt") String prompt,
			HttpServletResponse response,
			@RequestHeader(value = "model", required = false) String model,
			@RequestHeader(value = "chatId", required = false) String chatId
	) {

		// Interface throttling is configured in the audit platform
		if (!ValidUtils.isValidate(prompt)) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return Flux.just("No chat prompt provided");
		}

		Set<Map<String, String>> dashScope = baseService.getDashScope();
		List<String> modelName = dashScope.stream()
				.flatMap(map -> map.keySet().stream().map(map::get))
				.distinct()
				.toList();

		if (StringUtils.hasText(model)) {
			if (!modelName.contains(model)) {
				return Flux.just("Input model not support.");
			}
		}
		else {
			model = DashScopeApi.ChatModel.QWEN_PLUS.getModel();
		}

		response.setCharacterEncoding("UTF-8");

		if (!StringUtils.hasText(chatId)) {
			chatId = "spring-ai-alibaba-playground";
		}

		return chatService.chat(chatId, model, prompt);
	}

	@GetMapping("/deep-thinking/chat")
	public Flux<String> deepThinkingChat(
			@RequestParam("prompt") String prompt,
			HttpServletResponse response,
			@RequestHeader(value = "model", required = false) String model,
			@RequestHeader(value = "chatId", required = false) String chatId
	) {

		if (!ValidUtils.isValidate(prompt)) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return Flux.just("No chat prompt provided");
		}

		return chatService.deepThinkingChat(chatId, model, prompt);
	}

}
