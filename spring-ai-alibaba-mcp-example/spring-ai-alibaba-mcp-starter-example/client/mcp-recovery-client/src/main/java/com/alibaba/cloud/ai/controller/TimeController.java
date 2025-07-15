package com.alibaba.cloud.ai.controller;

import com.alibaba.cloud.ai.mcp.client.McpSyncRecovery;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yingzi
 * @since 2025/7/15
 */
@RestController
@RequestMapping("/time")
public class TimeController {

    private final ChatClient chatClient;

    private final McpSyncRecovery mcpSyncRecovery;

    public TimeController(ChatClient.Builder chatClientBuilder, McpSyncRecovery mcpSyncRecovery) {
        chatClient = chatClientBuilder
                .build();
        this.mcpSyncRecovery = mcpSyncRecovery;
    }

    @GetMapping("/chat")
    public String chatTime(@RequestParam(value = "query", defaultValue = "请告诉我现在北京时间几点了") String query) {
        return chatClient.prompt(query)
                .toolCallbacks(mcpSyncRecovery.getToolCallback())
                .call()
                .content();
    }
}
