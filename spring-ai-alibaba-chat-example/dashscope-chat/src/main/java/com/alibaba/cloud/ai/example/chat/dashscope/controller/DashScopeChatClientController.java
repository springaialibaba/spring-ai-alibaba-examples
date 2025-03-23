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

package com.alibaba.cloud.ai.example.chat.dashscope.controller;

import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@RequestMapping("/client")
public class DashScopeChatClientController {

	private static final String DEFAULT_PROMPT = "你好，介绍下你自己！";

	private final ChatClient dashScopeChatClient;

	public DashScopeChatClientController(ChatModel chatModel) {

		// 构造时，可以设置 ChatClient 的参数
		// {@link org.springframework.ai.chat.client.ChatClient};
		this.dashScopeChatClient = ChatClient.builder(chatModel)
				// 实现 Logger 的 Advisor
				.defaultAdvisors(
						new SimpleLoggerAdvisor()
				)
				// 设置 ChatClient 中 ChatModel 的 Options 参数
				.defaultOptions(
						DashScopeChatOptions.builder()
								.withTopP(0.7)
								.build()
				)
				.build();
	}

	// 也可以使用如下的方式注入 ChatClient
	// public DashScopeChatClientController(ChatClient.Builder chatClientBuilder) {
	//
	//  	this.dashScopeChatClient = chatClientBuilder.build();
	// }

	/**
	 * ChatClient 简单调用
	 */
	@GetMapping("/simple/chat")
	public String simpleChat() {

		return dashScopeChatClient.prompt(DEFAULT_PROMPT).call().content();
	}

	/**
	 * ChatClient 流式调用
	 */
	@GetMapping("/stream/chat")
	public Flux<String> streamChat(HttpServletResponse response) {

		response.setCharacterEncoding("UTF-8");
		return dashScopeChatClient.prompt(DEFAULT_PROMPT).stream().content();
	}

}
