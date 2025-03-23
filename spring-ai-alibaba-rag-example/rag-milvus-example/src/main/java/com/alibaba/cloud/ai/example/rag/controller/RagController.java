/*
 * Copyright 2025 the original author or authors.
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

package com.alibaba.cloud.ai.example.rag.controller;

import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class RagController {

    private final VectorStore vectorStore;

    private final ChatClient chatClient;

    public RagController(VectorStore vectorStore, ChatClient chatClient) {
        this.vectorStore = vectorStore;
        this.chatClient = chatClient;
    }

    // 历史消息列表
    private static List<Message> historyMessage = new ArrayList<>();

    // 历史消息列表的最大长度
    private final static int maxLen = 10;

    @GetMapping(value = "/chat")
    public Flux<String> generation(
            @RequestParam("prompt") String userInput,
            HttpServletResponse response
    ) {

        response.setCharacterEncoding("UTF-8");

        // 发起聊天请求并处理响应
        Flux<String> resp = chatClient.prompt()
                .messages(historyMessage)
                .user(userInput)
                .advisors(new QuestionAnswerAdvisor(
                        vectorStore,
                        SearchRequest.builder().build())
                ).stream()
                .content();

        // 用户输入的文本是 UserMessage
        historyMessage.add(new UserMessage(userInput));

        // 发给 AI 前对历史消息对列的长度进行检查
        if (historyMessage.size() > maxLen) {
            historyMessage = historyMessage.subList(historyMessage.size() - maxLen - 1, historyMessage.size());
        }

        return resp;
    }

    /**
     * 向量数据查询测试
     */
    @GetMapping("/select")
    public List<Document> search() {

        return vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query("SpringAIAlibaba")
                        .topK("SpringAIAlibaba".length()
                        ).build());
    }

}
