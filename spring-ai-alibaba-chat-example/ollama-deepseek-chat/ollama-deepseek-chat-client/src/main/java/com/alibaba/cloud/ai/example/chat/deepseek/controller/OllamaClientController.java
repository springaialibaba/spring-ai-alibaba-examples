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

package com.alibaba.cloud.ai.example.chat.deepseek.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@RequestMapping("/ollama/chat-client")
public class OllamaClientController {

	private static final String DEFAULT_PROMPT = "你好，介绍下你自己！请用中文回答。";

	private final ChatClient ollamaiChatClient;


	public OllamaClientController(@Qualifier("ollamaChatModel") ChatModel chatModel) {
		// 构造时，可以设置 ChatClient 的参数
//		 {@link org.springframework.ai.chat.client.ChatClient};
		this.ollamaiChatClient = ChatClient.builder(chatModel)
				// 实现 Chat Memory 的 Advisor
				// 在使用 Chat Memory 时，需要指定对话 ID，以便 Spring AI 处理上下文。
				.defaultAdvisors(
						new MessageChatMemoryAdvisor(new InMemoryChatMemory())
				)
				// 实现 Logger 的 Advisor
				.defaultAdvisors(
						new SimpleLoggerAdvisor()
				)
				// 设置 ChatClient 中 ChatModel 的 Options 参数
				.defaultOptions(
						OllamaOptions.builder()
								.topP(0.7)
								.build()
				)
				.build();
	}

	/**
	 * ChatClient 简单调用
	 */
	@GetMapping("/simple/chat")
	public String simpleChat() {

		return ollamaiChatClient.prompt(DEFAULT_PROMPT).messages().call().content();
	}

	/**
	 * ChatClient 流式调用
	 */
	@GetMapping("/stream/chat")
	public Flux<String> streamChat(HttpServletResponse response) {

		response.setCharacterEncoding("UTF-8");
		return ollamaiChatClient.prompt(DEFAULT_PROMPT).stream().content();
	}

}
