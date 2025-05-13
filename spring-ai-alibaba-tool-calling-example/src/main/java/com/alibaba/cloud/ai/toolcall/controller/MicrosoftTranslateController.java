package com.alibaba.cloud.ai.toolcall.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/microsoft/translate")
public class MicrosoftTranslateController {

    private final ChatClient dashScopeChatClient;


    public MicrosoftTranslateController(ChatClient.Builder chatClientBuilder) {
        this.dashScopeChatClient = chatClientBuilder.build();
    }

    /**
     * 无工具版
     */
    @GetMapping("/chat")
    public String simpleChat(@RequestParam(value = "query", defaultValue = "帮我把以下内容翻译成英文：你好，世界。") String query) {
        return dashScopeChatClient.prompt(query).call().content();
    }

    /**
     * 调用工具版 - function
     */
    @GetMapping("/chat-tool-function")
    public String chatTranslateFunction(@RequestParam(value = "query", defaultValue = "帮我把以下内容翻译成英文：你好，世界。") String query) {
        return dashScopeChatClient.prompt(query).tools("microSoftTranslateFunction").call().content();
    }

}
