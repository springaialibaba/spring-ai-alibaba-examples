package com.alibaba.cloud.ai.toolcall.controller;

import com.alibaba.cloud.ai.toolcall.component.baidutranslate.BaidutranslateProperties;
import com.alibaba.cloud.ai.toolcall.component.baidutranslate.method.BaidutranslateTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/translate")
public class TranslateController {

    private final ChatClient dashScopeChatClient;
    private final BaidutranslateProperties baidutranslateProperties;


    public TranslateController(ChatClient.Builder chatClientBuilder, BaidutranslateProperties baidutranslateProperties) {
        this.dashScopeChatClient = chatClientBuilder.build();
        this.baidutranslateProperties = baidutranslateProperties;
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
        return dashScopeChatClient.prompt(query).tools("baiduTranslateFunction").call().content();
    }

    /**
     * 调用工具版 - method
     */
    @GetMapping("/chat-tool-method")
    public String chatTranslateMethod(@RequestParam(value = "query", defaultValue = "帮我把以下内容翻译成英文：你好，世界。") String query) {
        // 从配置文件中，获取，自动加载
        return dashScopeChatClient.prompt(query).tools(new BaidutranslateTools(baidutranslateProperties)).call().content();
    }

}
