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


package com.alibaba.cloud.ai.example.rag.controller;

import com.alibaba.cloud.ai.advisor.RetrievalRerankAdvisor;
import com.alibaba.cloud.ai.model.RerankModel;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.document.DocumentReader;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @author WANG, ZHEN
 * @since 1.0.0-M3
 */
@RestController
@RequestMapping("/ai")
public class RagPgVectorController {

    @Value("classpath:/prompts/system-qa.st")
    private Resource systemResource;

    @Value("classpath:/data/spring_ai_alibaba_quickstart.pdf")
    private Resource springAiResource;

    private final VectorStore vectorStore;
    private final ChatModel chatModel;
    private final RerankModel rerankModel;

    public RagPgVectorController(VectorStore vectorStore, ChatModel chatModel, RerankModel rerankModel) {
        this.vectorStore = vectorStore;
        this.chatModel = chatModel;
        this.rerankModel = rerankModel;
    }

    @GetMapping("/rag/importDocument")
    public void importDocument() {
        // 1. parse document
        DocumentReader reader = new PagePdfDocumentReader(springAiResource);
        List<Document> documents = reader.get();

        // 1.2 use local file
        // FileSystemResource fileSystemResource = new FileSystemResource("D:\\file.pdf");
        // DocumentReader reader = new PagePdfDocumentReader(fileSystemResource);

        // 2. split trunks
        List<Document> splitDocuments = new TokenTextSplitter().apply(documents);

        // 3. create embedding and store to vector store
        vectorStore.add(splitDocuments);
    }

    /**
     * Receive any long text, split it and write it into a vector store
     */
    @GetMapping("/rag/importText")
    public ResponseEntity<String> insertText(@RequestParam("text") String text) {
        // 1.parameter verification
        if (!StringUtils.hasText(text)) {
            return ResponseEntity.badRequest().body("Please enter text");
        }
        // 2.parse document
        List<Document> documents = List.of(new Document(text));

        // 3.Splitting Text
        List<Document> splitDocuments = new TokenTextSplitter().apply(documents);

        // 4.create embedding and store to vector store
        vectorStore.add(splitDocuments);
        // 5.return success prompt
        String msg = String.format("successfully inserted %d text fragments into vector store", splitDocuments.size());
        return ResponseEntity.ok(msg);
    }

    /**
     * read and write multiple files and write it into a vector store
     * @param file
     * @return
     */
    @PostMapping(value = "/rag/importFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> insertFiles( @RequestPart(value = "file", required = false) MultipartFile file) {
        // 1. file verification
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("必须上传非空的文件");
        }
        // 2. parse files
        List<Document> docs = new TikaDocumentReader(file.getResource()).get();

        // 3. Splitting Text
        List<Document> splitDocs = new TokenTextSplitter().apply(docs);

        // 4. create embedding and store to vector store
        vectorStore.add(splitDocs);

        // 5.return success prompt
        String msg = String.format("successfully inserted %d text fragments into vector store", splitDocs.size());
        return ResponseEntity.ok(msg);
    }


    @GetMapping(value = "/rag", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ChatResponse> generate(@RequestParam(value = "message",
            defaultValue = "how to get start with spring ai alibaba?") String message) throws IOException {
        SearchRequest searchRequest = SearchRequest.builder().topK(2).build();
        String promptTemplate = systemResource.getContentAsString(StandardCharsets.UTF_8);

        return ChatClient.builder(chatModel)
                .defaultAdvisors(new RetrievalRerankAdvisor(vectorStore, rerankModel, searchRequest, promptTemplate, 0.1))
                .build()
                .prompt()
                .user(message)
                .stream()
                .chatResponse();
    }

    /**
     * read and write multiple files and write it into a vector store
     * @param file
     * @return
     */
    @PostMapping(value = "/rag/importFileV2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> importFileV2(@RequestPart(value = "file", required = false) MultipartFile file) {
        // 1. file verification
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("必须上传非空的文件");
        }
        // 2. parse files
        List<Document> docs = new TikaDocumentReader(file.getResource()).get();

        // 3. Splitting Text
        List<Document> splitDocs = new TokenTextSplitter().apply(docs);

        String fileId = UUID.randomUUID().toString();
        for (Document doc : splitDocs) {
            doc.getMetadata().put("fileId", fileId);
        }

        // 4. create embedding and store to vector store
        vectorStore.add(splitDocs);

        // 5.return success prompt
        String msg = String.format("successfully inserted %d text fragments into vector store," +
                " fileId: %s", splitDocs.size(), fileId);
        return ResponseEntity.ok(msg);
    }

    /**
     * search the vector store
     * @param message
     * @param fileId
     * @return
     * @throws IOException
     */
    @GetMapping(value = "/rag/searchV2")
    public  Flux<String> search(@RequestParam(value = "message",
            defaultValue = "what is blibaba?") String message,
                                         @RequestParam(value = "fileId", required = true)
                                         String fileId) throws IOException {

        FilterExpressionBuilder b = new FilterExpressionBuilder();
        Filter.Expression expression = b.eq("fileId", fileId).build();

        SearchRequest searchRequest = SearchRequest.builder().topK(1).filterExpression(expression).build();
        String promptTemplate = systemResource.getContentAsString(StandardCharsets.UTF_8);

        return ChatClient.builder(chatModel)
                .defaultAdvisors(new RetrievalRerankAdvisor(vectorStore, rerankModel, searchRequest, promptTemplate, 0.1))
                .build()
                .prompt()
                .user(message)
                .stream()
                .content();
    }

    @PostMapping(value = "/rag/deleteFilesV2")
    public ResponseEntity<String> deleteFiles(@RequestParam(value = "fileId", required = false) String fileId) {
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        Filter.Expression expression = b.eq("fileId", fileId).build();
        vectorStore.delete(expression);
        return ResponseEntity.ok("successfully deleted");
    }

}
