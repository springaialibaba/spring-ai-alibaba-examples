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

package com.alibaba.cloud.ai.application.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.util.List;
import java.util.Objects;

import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatModel;
import com.alibaba.cloud.ai.dashscope.chat.MessageFormat;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.model.Media;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Service
public class SAAImageService {

	private final ImageModel imageModel;

	private final ChatClient daschScopeChatClient;

	public SAAImageService(ImageModel imageModel, ChatModel chatModel) {

		this.imageModel = imageModel;
		this.daschScopeChatClient = ChatClient
				.builder(chatModel)
				.build();
	}

	public Flux<String> image2Text(MultipartFile file) {

		UserMessage message = new UserMessage(
				"解释图片中的内容",
				new Media(
						MimeTypeUtils.IMAGE_PNG,
						new FileSystemResource(Objects.requireNonNull(file.getOriginalFilename()))
				)
		);
		message.getMetadata().put(DashScopeChatModel.MESSAGE_FORMAT, MessageFormat.IMAGE);

		List<ChatResponse> response = daschScopeChatClient.prompt(
				new Prompt(message)
		).stream().chatResponse().collectList().block();

		StringBuilder result = new StringBuilder();
		if (response != null) {
			for (ChatResponse chatResponse : response) {
				String outputContent = chatResponse.getResult().getOutput().getContent();
				result.append(outputContent).append("\n");
			}
		}

		return Flux.just(result.toString());
	}

	public void text2Image(String prompt, HttpServletResponse response) {

		ImageResponse imageResponse = imageModel.call(new ImagePrompt(prompt));
		String imageUrl = imageResponse.getResult().getOutput().getUrl();

		try {
			URL url = URI.create(imageUrl).toURL();
			InputStream in = url.openStream();

			response.setHeader("Content-Type", MediaType.IMAGE_PNG_VALUE);
			response.getOutputStream().write(in.readAllBytes());
			response.getOutputStream().flush();
		}
		catch (IOException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

}
