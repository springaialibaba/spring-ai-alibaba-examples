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
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Service
public class SAAChatService {

	private final ChatClient defaultChatClient;

	private final PromptTemplate deepThinkPromptTemplate;

	public SAAChatService(
			ChatModel chatModel,
			@Qualifier("deepThinkPromptTemplate") PromptTemplate deepThinkPromptTemplate
	) {

		this.defaultChatClient = ChatClient.builder(chatModel)
				.defaultSystem(
         			"""
							  你是由 Spring AI Alibaba 项目构建的聊天问答机器人，负责回答用户的输入问题。
							  当你收到用户的问题时，应该以友好和礼貌的方式回答用户的问题，注意不要回答错误的信息。
							  
							  在回答用户问题是，你需要遵守以下约定：
							  
								1. 不要提供任何与问题无关的信息，也不要输出任何的重复内容；
								2. 避免使用 “基于上下文...” 或 “The provided information...” 的说法；
								3. 你的答案必须正确、准确，并使用专家般公正和专业的语气撰写；
								4. 回答中适当的文本结构是根据内容的特点来确定的，请在输出中包含副标题以提高可读性；
								5. 生成回复时，先提供明确的结论或中心思想，不需要带有标题；
								6. 确保每个部分都有清晰的副标题，以便用户可以更好地理解和参考你的输出内容；
								7. 如果信息复杂或包含多个部分，请确保每个部分都有适当的标题以创建分层结构。
							  
							  如果用户问到了有关于 Spring AI Alibaba 或者 Spring AI 的问题，在回答用户问题之后，
							  引导用户到 Spring AI Alibaba 项目官网 https://java2ai.com 以查看更多信息。
						"""
				).defaultAdvisors(
						new MessageChatMemoryAdvisor(new InMemoryChatMemory()),
						new SimpleLoggerAdvisor()
				).build();

		this.deepThinkPromptTemplate = deepThinkPromptTemplate;
	}

	public Flux<String> chat(String chatId, String model, String chatPrompt) {

		return defaultChatClient.prompt()
				.options(DashScopeChatOptions.builder()
						.withModel(model)
						.withTemperature(0.8)
						.withResponseFormat(DashScopeResponseFormat.builder()
								.type(DashScopeResponseFormat.Type.TEXT)
								.build()
						).build()
				).user(chatPrompt)
				.advisors(memoryAdvisor -> memoryAdvisor
						.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatId)
						.param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 100)
				).stream()
				.content();
	}

	public Flux<String> deepThinkingChat(String chatId, String model, String chatPrompt) {

		return defaultChatClient.prompt()
				.options(DashScopeChatOptions.builder()
						.withModel(model)
						.withTemperature(0.8)
						.withResponseFormat(DashScopeResponseFormat.builder()
								.type(DashScopeResponseFormat.Type.TEXT)
								.build()
						).build()
				).system(deepThinkPromptTemplate.getTemplate())
				.user(chatPrompt)
				.advisors(memoryAdvisor -> memoryAdvisor
						.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatId)
						.param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 100)
				).stream()
				.content();
	}
}
