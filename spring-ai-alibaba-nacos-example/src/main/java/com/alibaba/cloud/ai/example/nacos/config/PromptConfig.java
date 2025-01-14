package com.alibaba.cloud.ai.example.nacos.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.cloud.context.config.annotation.RefreshScope;

/**
 * @author : huangzhen
 */
@Component
@RefreshScope
@ConfigurationProperties(prefix = "prompt")
public class PromptConfig {
    private String welcome;
    private String goodbye;
    private String error;

    public String getWelcome() {
        return welcome;
    }

    public void setWelcome(String welcome) {
        this.welcome = welcome;
    }

    public String getGoodbye() {
        return goodbye;
    }

    public void setGoodbye(String goodbye) {
        this.goodbye = goodbye;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}