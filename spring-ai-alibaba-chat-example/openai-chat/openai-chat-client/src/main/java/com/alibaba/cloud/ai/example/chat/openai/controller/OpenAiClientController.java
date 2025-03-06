package com.alibaba.cloud.ai.example.chat.openai.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.ai.openai.OpenAiChatOptions;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;
import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_RETRIEVE_SIZE_KEY;

/**
* @Author: wst
* @Date: 2024-12-16
*/

@RestController
@RequestMapping("/openai/chat-client")
public class OpenAiClientController {

	private static final String DEFAULT_PROMPT = "你好，介绍下你自己！";

	private final ChatClient openAiChatClient;

	private final ChatModel chatModel;

	public OpenAiClientController(ChatModel chatModel) {

		this.chatModel = chatModel;

		// 构造时，可以设置 ChatClient 的参数
		// {@link org.springframework.ai.chat.client.ChatClient};
		this.openAiChatClient = ChatClient.builder(chatModel)
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
						OpenAiChatOptions.builder()
								.topP(0.7)
								.build()
				)
				.build();
	}

	// 也可以使用如下的方式注入 ChatClient
	// public OpenAIChatClientController(ChatClient.Builder chatClientBuilder) {
	//
	//  	this.openAiChatClient = chatClientBuilder.build();
	// }

	/**
	 * ChatClient 简单调用
	 */
	@GetMapping("/simple/chat")
	public String simpleChat() {

		return openAiChatClient.prompt(DEFAULT_PROMPT).call().content();
	}

	/**
	 * ChatClient 流式调用
	 */
	@GetMapping("/stream/chat")
	public Flux<String> streamChat(HttpServletResponse response) {

		response.setCharacterEncoding("UTF-8");
		return openAiChatClient.prompt(DEFAULT_PROMPT).stream().content();
	}

}
