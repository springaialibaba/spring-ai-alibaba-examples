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

package com.alibaba.example.translate.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

/**
 * @author huangzhen
 */
@RestController
@RequestMapping("/api/translate")
public class TranslateController {

    private final ChatClient chatClient;

    @Autowired
    public TranslateController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }


    @PostMapping("/file")
    public ResponseEntity<TranslateResponse> translateFile(
            @RequestPart("file") MultipartFile file,
            @RequestPart("targetLang") String targetLang) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new TranslateResponse("上传文件不能为空"));
            }
            if (targetLang == null || targetLang.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new TranslateResponse("目标语言必须指定"));
            }
            String fileContent = new String(file.getBytes(), StandardCharsets.UTF_8);

            // 创建翻译提示模板，移除源语言
            String prompt = String.format(
                    "将以下文本翻译成%s，不要解释，直接返回翻译结果：%s",
                    targetLang,
                    fileContent
            );

            String translatedText = chatClient.prompt(prompt).call().content();

            return ResponseEntity.ok(new TranslateResponse(translatedText));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new TranslateResponse("翻译失败: " + e.getMessage()));
        }
    }

}
