/*
* Copyright 2024 the original author or authors.
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

package com.alibaba.cloud.ai.example.rag.knowledge;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * Title Cloud rag controller.<br>
 * Description Cloud rag controller.<br>
 *
 * @author yuanci.ytb
 * @since 1.0.0-M2
 */

@RestController
@RequestMapping("/ai")
public class CloudRagController {

	private final RagService cloudRagService;

	public CloudRagController(RagService cloudRagService) {
		this.cloudRagService = cloudRagService;
	}

	@GetMapping("/bailian/knowledge/importDocument")
	public void importDocument() {
		cloudRagService.importDocuments();
	}

	@GetMapping("/bailian/knowledge/generate")
	public Flux<String> generate(@RequestParam(value = "message",
			defaultValue = "你好，请问你的知识库文档主要是关于什么内容的?") String message) {
		return cloudRagService.retrieve(message).map(x -> x.getResult().getOutput().getText());
	}

}
