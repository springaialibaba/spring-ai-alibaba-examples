package com.alibaba.cloud.ai.toolcall.controller;

import com.alibaba.cloud.ai.toolcall.component.weather.WeatherProperties;
import com.alibaba.cloud.ai.toolcall.component.weather.method.WeatherTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final ChatClient dashScopeChatClient;

    private final WeatherProperties weatherProperties;

    public WeatherController(ChatClient.Builder chatClientBuilder, WeatherProperties weatherProperties) {
        this.dashScopeChatClient = chatClientBuilder.build();
        this.weatherProperties = weatherProperties;
    }

    /**
     * 无工具版
     */
    @GetMapping("/chat")
    public String simpleChat(@RequestParam(value = "query", defaultValue = "请告诉我北京1天以后的天气") String query) {
        return dashScopeChatClient.prompt(query).call().content();
    }

    /**
     * 调用工具版 - function
     */
    @GetMapping("/chat-tool-function")
    public String chatTranslateFunction(@RequestParam(value = "query", defaultValue = "请告诉我北京1天以后的天气") String query) {
        return dashScopeChatClient.prompt(query).tools("getWeatherFunction").call().content();
    }

    /**
     * 调用工具版 - method
     */
    @GetMapping("/chat-tool-method")
    public String chatTranslateMethod(@RequestParam(value = "query", defaultValue = "请告诉我北京1天以后的天气") String query) {
        return dashScopeChatClient.prompt(query).tools(new WeatherTools(weatherProperties)).call().content();
    }
}
