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

 package com.alibaba.cloud.ai.example.stream;

 import jakarta.servlet.http.HttpServletResponse;
 import reactor.core.publisher.Flux;
 import org.springframework.web.bind.annotation.GetMapping;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;
 import org.springframework.ai.chat.client.ChatClient;
 import org.springframework.ai.converter.BeanOutputConverter;
 import org.springframework.core.ParameterizedTypeReference;
 import java.util.Objects;
 import java.util.stream.Collectors;
 
 /**
	* @author Carbon
	*/
 @RestController
 @RequestMapping("/stream")
 public class StreamToBeanController {
 
		 private final ChatClient chatClient;
 
		 public StreamToBeanController(ChatClient.Builder builder) {
				 this.chatClient = builder.build();
		 }
 
		 /**
			* @return StreamToBeanEntity
			*/
		 @GetMapping("/play")
		 public StreamToBeanEntity simpleChat(HttpServletResponse response) {
				 response.setCharacterEncoding("UTF-8");
 
				 var converter = new BeanOutputConverter<>(new ParameterizedTypeReference<StreamToBeanEntity>() {});
 
				 Flux<String> flux = this.chatClient.prompt()
								 .user(u -> u.text("""
												 requirement: 请用大概120字，为计算机的发展历史写一首现代诗;
												 format: 以纯文本输出json，请不要包含任何多余的文字——包括markdown格式;
												 outputExample: {
														 "title": {title},
														 "author": {author},
														 "date": {date},
														 "content": {content}
												 };
												 """))
								 .stream()
								 .content();
 
				 String result = Objects.requireNonNull(flux.collectList().block()).stream()
								 .collect(Collectors.joining("\n"));
 
				 result = result.replaceAll("\\n", "").replaceAll("\\s+", " ").replaceAll("\"\\s*:", "\":").replaceAll(":\\s*\"", ":\"");
 
				 System.out.println("JSON: " + result);
 
				 return converter.convert(result);
		 }
 }