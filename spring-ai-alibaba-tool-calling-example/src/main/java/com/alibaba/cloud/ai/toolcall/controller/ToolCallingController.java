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

package com.alibaba.cloud.ai.toolcall.controller;

import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tool")
public class ToolCallingController {

	private static final String DEFAULT_PROMPT = "你是一个博学的智能聊天助手，请根据用户提问回答！";

	private final ChatClient dashScopeChatClient;

	// 也可以使用如下的方式注入 ChatClient
	 public ToolCallingController(ChatClient.Builder chatClientBuilder) {
	  	this.dashScopeChatClient = chatClientBuilder
				.defaultSystem(DEFAULT_PROMPT)
				 // 实现 Chat Memory 的 Advisor
				 // 在使用 Chat Memory 时，需要指定对话 ID，以便 Spring AI 处理上下文。
				 .defaultAdvisors(
						 new MessageChatMemoryAdvisor(new InMemoryChatMemory())
				 )
				.defaultTools("baiduTranslateFunction")
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

	/**
	 * ChatClient 简单调用
	 */
	@GetMapping("/translate")
	public String simpleChat(@RequestParam(value = "query", defaultValue = "帮我把以下内容翻译成英文：你好，世界。")String query) {
		return dashScopeChatClient.prompt(query).tools("baiduTranslateFunction").call().content();
	}

}
