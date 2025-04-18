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

package com.alibaba.cloud.ai.example.dcg.controller;

import com.alibaba.cloud.ai.example.dcg.service.ClassificationAssistant;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

/**
 * 字段分类分级接口
 * Author: yhong
 * Date: 2025/4/12
 */
@RestController
@RequestMapping("/api/classify")
public class ClassificationController {

    private final ClassificationAssistant assistant;

    public ClassificationController(ClassificationAssistant assistant) {
        this.assistant = assistant;
    }

    /**
     * 查询字段的分类分级信息（GET方式）
     * 示例：GET /api/classify?field=身份证号
     */
    @GetMapping
    public String classify(@RequestParam("field") String fieldName, @RequestParam(value = "chatId", required = true) String chatId) {
        return assistant.classify(fieldName, chatId);
    }

    /**
     * 查询字段的分类分级信息（流式返回）
     * @param fieldName
     * @param chatId
     * @return
     */
    @RequestMapping(path="/chat/field", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chat(@RequestParam("field") String fieldName, @RequestParam(value = "chatId", required = true) String chatId) {
        return assistant.streamClassify(fieldName, chatId);
    }

}
