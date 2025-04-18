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

package com.alibaba.cloud.ai.toolcall.controller;

import com.alibaba.cloud.ai.toolcalling.baidumap.MapSearchService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yHong
 * @version 1.0
 * @since 2025/4/18 10:41
 */
@RestController
@RequestMapping("/address")
public class AddressController {
    private final ChatClient dashScopeChatClient;

    public AddressController(ChatClient chatClient) {
        this.dashScopeChatClient = chatClient;
    }

    @GetMapping("/chat")
    public String chatWithBaiduMap(@RequestParam(value = "address", defaultValue = "北京") String address,
                                   @RequestParam(value = "facilityType", defaultValue = "bank") String facilityType) throws JsonProcessingException {
        MapSearchService.Request query = new MapSearchService.Request(address, facilityType);
        return dashScopeChatClient.prompt(new ObjectMapper().writeValueAsString(query)).tools("baiDuMapGetAddressInformationFunction").call().content();
    }

}