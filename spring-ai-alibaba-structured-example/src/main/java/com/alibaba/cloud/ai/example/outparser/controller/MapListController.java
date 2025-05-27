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
package com.alibaba.cloud.ai.example.outparser.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.ListOutputConverter;
import org.springframework.ai.converter.MapOutputConverter;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/map-list")
public class MapListController {

    private static final Logger log = LoggerFactory.getLogger(BeanController.class);

    private final ChatClient chatClient;
    private final MapOutputConverter mapConverter;
    private final ListOutputConverter listConverter;

    public MapListController(ChatClient.Builder builder) {
        // map转换器
        this.mapConverter = new MapOutputConverter();
        // list转换器
        this.listConverter = new ListOutputConverter(new DefaultConversionService());

        this.chatClient = builder
                .build();
    }

    @GetMapping("/chatMap")
    public Map<String, Object> chatMap(@RequestParam(value = "query", defaultValue = "请为我描述下影子的特性") String query) {
        String promptUserSpec = """
                format: key为描述的东西，value为对应的值
                outputExample: {format};
                """;
        String format = mapConverter.getFormat();
        log.info("map format: {}",format);

        String result = chatClient.prompt(query)
                .user(u -> u.text(promptUserSpec)
                        .param("format", format))
                .call().content();
        log.info("result: {}", result);
        assert result != null;
        Map<String, Object> convert = null;
        try {
            convert = mapConverter.convert(result);
            log.info("反序列成功，convert: {}", convert);
        } catch (Exception e) {
            log.error("反序列化失败");
        }
        return convert;
    }

    @GetMapping("/chatList")
    public List<String> chatList(@RequestParam(value = "query", defaultValue = "请为我描述下影子的特性") String query) {
        String promptUserSpec = """
                format: value为对应的值
                outputExample: {format};
                """;
        String format = listConverter.getFormat();
        log.info("list format: {}",format);

        String result = chatClient.prompt(query)
                .user(u -> u.text(promptUserSpec)
                        .param("format", format))
                .call().content();
        log.info("result: {}", result);
        assert result != null;
        List<String> convert = null;
        try {
            convert = listConverter.convert(result);
            log.info("反序列成功，convert: {}", convert);
        } catch (Exception e) {
            log.error("反序列化失败");
        }
        return convert;
    }
}
