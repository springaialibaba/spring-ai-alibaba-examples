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

package com.alibaba.cloud.ai.application.controller;

import com.alibaba.cloud.ai.application.annotation.UserIp;
import com.alibaba.cloud.ai.application.entity.result.Result;
import com.alibaba.cloud.ai.application.service.SAAImageService;
import com.alibaba.cloud.ai.application.utils.ValidUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@RestController
@Tag(name = "Image APIs")
@RequestMapping("/api/v1/")
public class SAAImageController {

	private static final String DEFAULT_IMAGE_STYLE = "摄影写实";

	private final SAAImageService imageService;

	public SAAImageController(SAAImageService imageService) {
		this.imageService = imageService;
	}

	/**
	 * Image Recognition
	 * prompt can be empty
	 */
	@UserIp
	@PostMapping("/image2text")
	@Operation(summary = "DashScope Image Recognition")
	public Flux<String> image2text(
			@RequestParam(value = "prompt", required = false) String prompt,
			@RequestParam("image") MultipartFile image
	) {

		if (image.isEmpty()) {
			return Flux.just("No image file provided");
		}

		if (!StringUtils.hasText(prompt)) {
			prompt = "Describe this image in one sentence";
		}

		Flux<String> res;
		try {
			 res = imageService.image2Text(prompt, image);
		} catch (Exception e) {
			return Flux.just(e.getMessage());
		}

		return res;
	}

	@UserIp
	@GetMapping("/text2image")
	@Operation(summary = "DashScope Image Generation")
	public Result<Void> text2Image(
			@RequestParam("prompt") String prompt,
			@RequestParam(value = "style", required = false) String style,
			@RequestParam(value = "resolution", required = false) String resolution,
			HttpServletResponse response
	) {

		if (!ValidUtils.isValidate(prompt)) {
			return Result.failed("No prompt provided");
		}

		if (!StringUtils.hasText(resolution)) {
			// Either width or height should be between 512 and 1440.
			resolution = "1080*1080";
		}

		if (!StringUtils.hasText(style)) {
			style = DEFAULT_IMAGE_STYLE;
		}

		imageService.text2Image(prompt, resolution, style, response);

		return Result.success();
	}

}
