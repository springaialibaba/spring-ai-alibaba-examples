package com.alibaba.cloud.ai.example.chat.ollama.vo;

import com.alibaba.cloud.ai.example.chat.ollama.constants.PromotConstant;

public class ChatRequestVO {

    /**
     * prompt
     */
    private String prompt = PromotConstant.DEFAULT_PROMPT;

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}
