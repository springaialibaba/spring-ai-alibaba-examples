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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.concurrent.CountDownLatch;

import com.alibaba.cloud.ai.application.exception.SAAAIException;
import com.alibaba.cloud.ai.application.exception.SAAAppException;
import com.alibaba.cloud.ai.dashscope.audio.DashScopeAudioTranscriptionOptions;
import com.alibaba.cloud.ai.dashscope.audio.synthesis.SpeechSynthesisModel;
import com.alibaba.cloud.ai.dashscope.audio.synthesis.SpeechSynthesisPrompt;
import com.alibaba.cloud.ai.dashscope.audio.synthesis.SpeechSynthesisResponse;
import com.alibaba.cloud.ai.dashscope.audio.transcription.AudioTranscriptionModel;
import reactor.core.publisher.Flux;

import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Service
public class SAAAudioService {

	private final AudioTranscriptionModel transcriptionModel;

	private final SpeechSynthesisModel speechSynthesisModel;

	public SAAAudioService(AudioTranscriptionModel transcriptionModel, SpeechSynthesisModel speechSynthesisModel) {

		this.transcriptionModel = transcriptionModel;
		this.speechSynthesisModel = speechSynthesisModel;
	}

	/**
	 * 将文本转为语音
	 */
	public byte[] text2audio(String text) {

		Flux<SpeechSynthesisResponse> response = speechSynthesisModel.stream(
				new SpeechSynthesisPrompt(text)
		);

		CountDownLatch latch = new CountDownLatch(1);
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

		try {
			response.doFinally(
					signal -> latch.countDown()
			).subscribe(synthesisResponse -> {

				ByteBuffer byteBuffer = synthesisResponse.getResult().getOutput().getAudio();
				byte[] bytes = new byte[byteBuffer.remaining()];
				byteBuffer.get(bytes);

				try {
					outputStream.write(bytes);
				}
				catch (IOException e) {
					throw new SAAAIException("Error writing to output stream " + e.getMessage());
				}
			});

			latch.await();
		}
		catch (InterruptedException e) {
			throw new SAAAppException("Operation interrupted. " + e.getMessage());
		}

		return outputStream.toByteArray();
	}

	/**
	 * 将语音转为文本
	 */
	public Flux<String> audio2text(MultipartFile audio) {

		CountDownLatch latch = new CountDownLatch(1);
		StringBuilder stringBuilder = new StringBuilder();

		File tempFile;
		try {
			tempFile = File.createTempFile("audio", ".pcm");
			audio.transferTo(tempFile);
		}
		catch (IOException e) {
			throw new SAAAppException("Failed to create temporary file " + e.getMessage());
		}

		Flux<AudioTranscriptionResponse> response = transcriptionModel.stream(
				new AudioTranscriptionPrompt(
						new FileSystemResource(tempFile),
						DashScopeAudioTranscriptionOptions.builder()
								.withModel("paraformer-realtime-v2")
								.withSampleRate(16000)
								.withFormat(DashScopeAudioTranscriptionOptions.AudioFormat.PCM)
								.withDisfluencyRemovalEnabled(false)
								.build()
				)
		);

		response.doFinally(signal -> latch.countDown())
				.subscribe(resp -> stringBuilder.append(resp.getResult().getOutput()).append("\n"));

		try {
			latch.await();
		}
		catch (InterruptedException e) {
			throw new SAAAIException("Transcription was interrupted " + e.getMessage());
		}
		finally {
			tempFile.delete();
		}

		return Flux.just(stringBuilder.toString());
	}

}
