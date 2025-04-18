/*
 * Copyright 2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.alibaba.example.translate;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatModel;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;

/**
 * @author : huangzhen
 * @author : Makoto
 */
@SpringBootApplication
public class TranslateApplication {
    public static void main(String[] args) {
        SpringApplication.run(TranslateApplication.class, args);
    }

    @Bean
    public ChatClient chatClient(OllamaChatModel ollamaChatModel) {
        return ChatClient.builder(ollamaChatModel)
                .defaultAdvisors(new SimpleLoggerAdvisor())
                .build();
    }
    
    @Bean
    public ChatModel dashScopeChatModel(@Value("${spring.ai.dashscope.api-key:#{null}}") String apiKey) {
        DashScopeChatOptions options = DashScopeChatOptions.builder()
                .withModel(DashScopeApi.ChatModel.QWEN_PLUS.getModel())
                .build();

        DashScopeApi dashScopeApi = new DashScopeApi(apiKey);
        return new DashScopeChatModel(dashScopeApi, options);
    }
}
