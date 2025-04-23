/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.alibaba.ai.examples.controller.client;

import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * @author liu-657667
 * @author <a href="mailto:liu-657667@qq.com">liu-657667</a>
 */

@RestController
@RequestMapping("/more-platform-and-more-model-chat-client")
public class MorePlatformAndMoreModelChatClientController {

    private final ChatClient chatClient;

    private final ChatModel dashScopeChatModel;

    private final ChatModel ollamaChatModel;

    private final ChatModel openAIChatModel;

    private final Set<String> modelList = Set.of(
            "deepseek-r1",
            "deepseek-v3",
            "qwen-plus",
            "qwen-max"
    );
    private final Set<String> ollamaModelList = Set.of("deepseek-r1:1.5b");
    private final Set<String> openaiModelList = Set.of("gpt-4.1");

    Map<String, Set<String>> modelMap = Map.of(
            "dashscope", modelList,
            "ollama", ollamaModelList,
            "openai", openaiModelList
    );

    public MorePlatformAndMoreModelChatClientController(
            @Qualifier("dashscopeChatModel") ChatModel dashScopeChatModel,
            @Qualifier("ollamaChatModel") ChatModel ollamaChatModel,
            @Qualifier("openAiChatModel") ChatModel openAIChatModel
    ) {

        this.dashScopeChatModel = dashScopeChatModel;
        this.ollamaChatModel = ollamaChatModel;
        this.openAIChatModel = openAIChatModel;

        // 默认使用 DashScopeChatModel 构建
        this.chatClient = ChatClient.builder(dashScopeChatModel).build();
    }

    @GetMapping
    public Flux<String> stream(
            @RequestParam("prompt") String prompt,
            @RequestHeader(value = "platform", required = false) String platform,
            @RequestHeader(value = "models", required = false) String models
    ) {

        if (!StringUtils.hasText(platform)) {
            return Flux.just("platform not exist");
        }

        if (CollectionUtils.isEmpty(modelMap.get(platform)) || !modelMap.get(platform).contains(models)) {
            return Flux.just("model not exist");
        }

        if (Objects.equals("dashscope", platform)) {
            System.out.println("命中 dashscope ......");
            return chatClient.prompt(prompt).options(
                    DashScopeChatOptions.builder()
                            .withModel(models)
                            .build()
            ).stream().content();
        }

        if (Objects.equals("ollama", platform)) {
            System.out.println("命中 ollama ......");
            return ChatClient.builder(ollamaChatModel).build()
                    .prompt(
                            new Prompt(prompt, ChatOptions.builder().model(models).build())
                    )
                    .stream().content();
        }

        if (Objects.equals("openai", platform)) {
            System.out.println("命中 openai ......");
            return ChatClient.builder(openAIChatModel).build()
                    .prompt(
                            new Prompt(prompt, ChatOptions.builder().model(models).build())
                    )
                    .stream().content();
        }

        return Flux.just("platform not exist");
    }

}
