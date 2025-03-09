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
package com.alibaba.cloud.ai.functioncalling;

import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;

/**
 * @author 北极星
 */
public class MicroSoftTranslateTest {

    private static final Logger log = LoggerFactory.getLogger(MicroSoftTranslateTest.class);

    private final ChatClient chatClient;

    public MicroSoftTranslateTest (@NotNull ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    /**
     * 微软翻译
     *
     * @link <a href="https://api.cognitive.microsofttranslator.com"/a>
     * 版本号 version 3.0
     * ApplicationYml spring.ai.alibaba.functioncalling.microsofttranslate 传入 api-key
     */
    @Test
    protected void microSoftTranslateFunctionCallingTest () {
        String text = "你好，spring-ai-alibaba!";

        String ans = chatClient.prompt().functions("microSoftTranslateFunction").user(text).call().content();
        log.info("translated text -> : ${}", ans);
    }
}
