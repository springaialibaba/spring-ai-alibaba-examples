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
import com.alibaba.cloud.ai.application.service.SAAAudioService;
import com.alibaba.cloud.ai.application.utils.ValidText;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import reactor.core.publisher.Flux;

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
@Tag(name = "Audio APIs")
@RequestMapping("/api/v1/")
public class SAAAudioController {

	private final SAAAudioService audioService;

	public SAAAudioController(SAAAudioService audioService) {
		this.audioService = audioService;
	}

	/**
	 * used to convert audio to text output
	 */
	@UserIp
	@PostMapping("/audio2text")
	@Operation(summary = "DashScope Audio Transcription")
	public Flux<Result<String>> audioToText(
			@RequestParam("audio") MultipartFile audio
	) {

		if (audio.isEmpty()) {
			return Flux.just(Result.failed("No audio file provided"));
		}

		Flux<Result<String>> res;
		try {
			res = audioService.audio2text(audio).map(Result::success);
		} catch (Exception e) {
			return Flux.just(Result.failed("Failed to transcribe audio: " + e.getMessage()));
		}

		return res;
	}

	/**
	 * used to convert text into speech output
	 */
	@UserIp
	@GetMapping("/text2audio")
	@Operation(summary = "DashScope Speech Synthesis")
	public Result<byte[]> textToAudio(
			@RequestParam("prompt") String prompt
	) {

		if (!ValidText.isValidate(prompt)) {
			return Result.failed("No chat prompt provided");
		}

		byte[] audioData = audioService.text2audio(prompt);

		// test to verify that the audio data is empty
		// try (FileOutputStream fos = new FileOutputStream("tmp/audio/test-audio.wav")) {
		// 	fos.write(audioData);
		// } catch (IOException e) {
		// 	return Result.failed("Test save audio file: " + e.getMessage());
		// }

		return Result.success(audioData);
	}

}
