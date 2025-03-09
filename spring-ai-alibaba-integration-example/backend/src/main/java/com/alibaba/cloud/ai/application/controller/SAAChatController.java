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
import com.alibaba.cloud.ai.application.utils.ValidText;
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
@RequestMapping("/api/v1/")
public class SAAChatController {

	private final SAAChatService chatService;

	private final SAABaseService baseService;

	public SAAChatController(SAAChatService chatService, SAABaseService baseService) {
		this.chatService = chatService;
		this.baseService = baseService;
	}

	/**
	 * 发送指定参数获得模型响应。
	 * 1. 发送 prompt 为空时，返回错误信息。
	 * 2. 发送模型时，允许为空，当参数有值且在模型配置列表中，调用对应模型。如不存在返回错误。
	 * 	  模型参数为空时，设置默认模型。qwen-plus
	 * 3. chatId 聊天记忆，由前端传递，为 Object 类型，不能重复
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

		// 接口限流在审计平台中配置

		if (!ValidText.isValidate(prompt)) {

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
			model = "qwen-plus";
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

		// 接口限流在审计平台中配置

		if (!ValidText.isValidate(prompt)) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return Flux.just("No chat prompt provided");
		}

		return chatService.deepThinkingChat(chatId, model, prompt);
	}

}
