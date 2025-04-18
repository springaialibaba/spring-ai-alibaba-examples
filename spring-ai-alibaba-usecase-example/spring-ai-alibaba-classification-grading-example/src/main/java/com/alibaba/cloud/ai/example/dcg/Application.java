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

package com.alibaba.cloud.ai.example.dcg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;

@SpringBootApplication
public class Application {

	private static final Logger logger = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		new SpringApplicationBuilder(Application.class).run(args);
	}

	/**
	 * 向量化知识初始化（用于 RAG）
	 */
	@Bean
	CommandLineRunner vectorIngestRunner(
			@Value("${rag.source:classpath:rag/rag_friendly_classification.txt}") Resource ragSource,
			EmbeddingModel embeddingModel,
			VectorStore classificationVectorStore
	) {
		return args -> {
			logger.info("🔄 正在向量化加载分类分级知识库...");
			var chunks = new TokenTextSplitter().transform(new TextReader(ragSource).read());
			classificationVectorStore.write(chunks);

			// 测试：相似性搜索一条
			var results = classificationVectorStore.similaritySearch("人事档案数据");
			results.forEach(doc -> logger.info("🔍 相似知识片段: {}", doc.getText()));
		};
	}

	/**
	 * 分类分级向量存储，用于后续 RAG 检索
	 */
	@Bean
	@Primary
	public VectorStore classificationVectorStore(EmbeddingModel embeddingModel) {
		return SimpleVectorStore.builder(embeddingModel).build();
	}

	/**
	 * 多轮对话记忆容器（基于内存）
	 */
	@Bean
	public ChatMemory chatMemory() {
		return new InMemoryChatMemory();
	}

}
