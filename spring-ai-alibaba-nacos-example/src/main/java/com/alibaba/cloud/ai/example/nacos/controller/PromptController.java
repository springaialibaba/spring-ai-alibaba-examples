package com.alibaba.cloud.ai.example.nacos.controller;

import com.alibaba.cloud.ai.example.nacos.config.PromptConfig;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : huangzhen
 */
@RestController
public class PromptController {

    @Autowired
    private PromptConfig promptConfig;

    @Autowired
    private ChatClient chatClient;

    @GetMapping("/welcome")
    public String getWelcomePrompt() {
        return chatClient.prompt(new Prompt(promptConfig.getWelcome())).call().content();
    }

}