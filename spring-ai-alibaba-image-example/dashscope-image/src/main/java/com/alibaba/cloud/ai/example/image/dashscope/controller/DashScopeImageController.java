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

package com.alibaba.cloud.ai.example.image.dashscope.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@RequestMapping("/example")
public class DashScopeImageController {

	private final ImageModel imageModel;

	private static final String DEFAULT_PROMPT = "为人工智能生成一张富有科技感的图片！";

	public DashScopeImageController(ImageModel imageModel) {
		this.imageModel = imageModel;
	}

	@GetMapping("/image")
	public void image(HttpServletResponse response) {

		ImageResponse imageResponse = imageModel.call(new ImagePrompt(DEFAULT_PROMPT));
		String imageUrl = imageResponse.getResult().getOutput().getUrl();

		try {
			URL url = URI.create(imageUrl).toURL();
			InputStream in = url.openStream();

			response.setHeader("Content-Type", MediaType.IMAGE_PNG_VALUE);
			response.getOutputStream().write(in.readAllBytes());
			response.getOutputStream().flush();
		} catch (IOException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

}
