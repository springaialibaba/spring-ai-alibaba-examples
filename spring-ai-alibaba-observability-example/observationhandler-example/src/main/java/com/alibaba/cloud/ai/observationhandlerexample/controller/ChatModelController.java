package com.alibaba.cloud.ai.observationhandlerexample.controller;

import com.alibaba.cloud.ai.observationhandlerexample.observationHandler.CustomerObservationHandler;
import io.micrometer.observation.ObservationRegistry;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: XiaoYunTao
 * @Date: 2024/12/31
 */
@RestController
@RequestMapping("/chat")
public class ChatModelController {

    @RequestMapping(value = "test", method = RequestMethod.GET)
    public String add(String message) {
        ObservationRegistry registry = ObservationRegistry.create();
        registry.observationConfig().observationHandler(new CustomerObservationHandler());
        OllamaChatModel ollamaChatModel = new OllamaChatModel(
                new OllamaApi(),
                new OllamaOptions().withModel("qwen2.5"),
                null,
                null,
                registry);
        return ollamaChatModel.call(message);
    }
}
