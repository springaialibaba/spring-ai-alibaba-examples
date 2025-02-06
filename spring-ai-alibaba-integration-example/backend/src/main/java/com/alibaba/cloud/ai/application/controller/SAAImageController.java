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
import com.alibaba.cloud.ai.application.utils.ValidText;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

	@Resource
	private SAAImageService imageService;

	@UserIp
	@PostMapping("/image2text")
	@Operation(summary = "DashScope Image Recognition")
	public Flux<Result<String>> image2text(@RequestParam("image") MultipartFile image) {

		if (image.isEmpty()) {
			return Flux.just(Result.failed("No image file provided"));
		}

		return imageService.image2Text(image).map(Result::success);
	}

	@UserIp
	@GetMapping("/text2Image/{prompt}")
	@Operation(summary = "DashScope Image Generation")
	public Result<Void> text2Image(
			@PathVariable("prompt") String prompt,
			HttpServletResponse response
	) {

		if (!ValidText.isValidate(prompt)) {
			return Result.failed("No prompt provided");
		}

		imageService.text2Image(prompt, response);

		return Result.success();
	}

}
