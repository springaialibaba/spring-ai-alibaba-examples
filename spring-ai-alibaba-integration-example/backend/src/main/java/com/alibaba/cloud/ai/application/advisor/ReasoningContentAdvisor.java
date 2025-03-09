package com.alibaba.cloud.ai.application.advisor;

import java.util.List;
import java.util.Objects;

import org.jetbrains.annotations.NotNull;

import org.springframework.ai.chat.client.advisor.api.AdvisedRequest;
import org.springframework.ai.chat.client.advisor.api.AdvisedResponse;
import org.springframework.ai.chat.client.advisor.api.BaseAdvisor;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.util.StringUtils;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 * 将 deepseek-r1 的 reasoning content 整合到输出中
 */

public class ReasoningContentAdvisor implements BaseAdvisor {

	private final int order;

	public ReasoningContentAdvisor(Integer order) {
		this.order = order != null ? order : 0;
	}

	@NotNull
	@Override
	public AdvisedRequest before(@NotNull AdvisedRequest request) {

		return request;
	}

	@NotNull
	@Override
	public AdvisedResponse after(AdvisedResponse advisedResponse) {

		ChatResponse resp = advisedResponse.response();
		if (Objects.isNull(resp)) {

			return advisedResponse;
		}

		String reasoningContent = resp.getMetadata().get("reasoning_content");
		if (StringUtils.hasText(reasoningContent)) {
			List<Generation> thinkGenerations = resp.getResults().stream()
					.map(generation -> {
						AssistantMessage output = generation.getOutput();
						// 将 think 思维链的内容整合到原始的输出中
						// 将在 spring ai alibaba 1.0.0-M6.1 中发布，暂时无法体验。
						AssistantMessage thinkAssistantMessage = new AssistantMessage(
									String.format("<think>%s</think>", reasoningContent) + output.getContent(),
								output.getMetadata(),
								output.getToolCalls(),
								output.getMedia()
						);
						return new Generation(thinkAssistantMessage, generation.getMetadata());
					}).toList();

			ChatResponse thinkChatResp = ChatResponse.builder().from(resp).generations(thinkGenerations).build();
			return AdvisedResponse.from(advisedResponse).response(thinkChatResp).build();

		}

		return advisedResponse;
	}

	@Override
	public int getOrder() {

		return this.order;
	}

}
