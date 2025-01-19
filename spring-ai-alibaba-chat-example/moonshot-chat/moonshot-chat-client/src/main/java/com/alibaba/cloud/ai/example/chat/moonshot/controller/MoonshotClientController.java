package com.alibaba.cloud.ai.example.chat.moonshot.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.moonshot.MoonshotChatOptions;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * @author kuilz
 * @date 2025/1/19
 */
@RestController
@RequestMapping("/moonshot/chat-client")
public class MoonshotClientController {
    private static final String DEFAULT_PROMPT = "你好，介绍下你自己吧。";

    private final ChatClient moonshotChatClient;

    public MoonshotClientController(ChatClient.Builder chatClientBuilder) {
        this.moonshotChatClient = chatClientBuilder
                // 设置Advisors
                .defaultAdvisors(
                        new MessageChatMemoryAdvisor(new InMemoryChatMemory()),
                        new SimpleLoggerAdvisor()
                )
                // 设置Options
                .defaultOptions(
                        MoonshotChatOptions.builder()
                                .withTopP(0.8)
                                .withTemperature(0.8)
                                .build()
                )
                .build();
    }

    /**
     * ChatClient 简单调用
     */
    @GetMapping("/simple/chat")
    public String simpleChat() {
        return moonshotChatClient.prompt(DEFAULT_PROMPT).call().content();
    }

    /**
     * ChatClient 流式调用
     */
    @GetMapping("/stream/chat")
    public Flux<String> streamChat(HttpServletResponse response) {
        response.setCharacterEncoding("UTF-8");
        return moonshotChatClient.prompt(DEFAULT_PROMPT).stream().content();
    }
}