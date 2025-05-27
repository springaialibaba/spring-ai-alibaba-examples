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

package com.alibaba.cloud.ai.application.service;

import com.alibaba.cloud.ai.dashscope.api.DashScopeResponseFormat;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Service
public class SAAFunctionService {

	private final ChatClient chatClient;

	public SAAFunctionService(ChatModel chatModel) {

		this.chatClient = ChatClient.builder(chatModel).build();
	}

	public Flux<String> chat(String chatId, String model, String chatPrompt) {

		return chatClient.prompt()
				.options(DashScopeChatOptions.builder()
						.withModel(model)
						.withTemperature(0.8)
						.withResponseFormat(DashScopeResponseFormat.builder()
								.type(DashScopeResponseFormat.Type.TEXT)
								.build())
						.build())
				.user(chatPrompt)
				.advisors(memoryAdvisor -> memoryAdvisor.param(
								CHAT_MEMORY_CONVERSATION_ID_KEY,
								chatId
						).param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 100)
				).tools(
						"baiduTranslateFunction",
						"baiDuMapGetAddressInformationFunction"
				).stream()
				.content();
	}

}
