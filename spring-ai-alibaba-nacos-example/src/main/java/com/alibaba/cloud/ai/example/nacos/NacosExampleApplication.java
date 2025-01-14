package com.alibaba.cloud.ai.example.nacos;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * @author : huangzhen
 */
@SpringBootApplication
public class NacosExampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosExampleApplication.class, args);
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }
}