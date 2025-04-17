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

package com.alibaba.cloud.ai.application.config.rag;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.markdown.MarkdownDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */
public class VectorStoreInitializer {

	private final Logger logger = LoggerFactory.getLogger(VectorStoreInitializer.class);

	public void init(VectorStore vectorStore) throws Exception {
		List<MarkdownDocumentReader> markdownDocumentReaderList = loadMarkdownDocuments();

		int size = 0;
		if (markdownDocumentReaderList.isEmpty()) {
			logger.warn("No markdown documents found in the directory.");
			return;
		}

		logger.debug("Start to load markdown documents into vector store......");
		for (MarkdownDocumentReader markdownDocumentReader : markdownDocumentReaderList) {
			List<Document> documents = new TokenTextSplitter(2000, 1024, 10, 10000, true).transform(markdownDocumentReader.get());
			size += documents.size();

			// 拆分 documents 列表为最大 25 个元素的子列表
			for (int i = 0; i < documents.size(); i += 25) {
				int end = Math.min(i + 25, documents.size());
				List<Document> subList = documents.subList(i, end);
				vectorStore.add(subList);
			}
		}
		logger.debug("Load markdown documents into vector store successfully. Load {} documents.", size);
	}

	private List<MarkdownDocumentReader> loadMarkdownDocuments() throws IOException, URISyntaxException {

		List<MarkdownDocumentReader> readers;
		Path markdownDir = Paths.get(getClass().getClassLoader().getResource("rag/markdown").toURI());

		try (Stream<Path> paths = Files.walk(markdownDir)) {
			readers = paths.filter(Files::isRegularFile)
					.filter(path -> path.toString().endsWith(".md"))
					.map(path -> {
						String fileName = path.getFileName().toString();
						String classpathPath = "classpath:rag/markdown/" + fileName;
						return new MarkdownDocumentReader(classpathPath);
					})
					.collect(Collectors.toList());
		}

		return readers;
	}

}
