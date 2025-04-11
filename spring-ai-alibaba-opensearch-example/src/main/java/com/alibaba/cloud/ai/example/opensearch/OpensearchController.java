package com.alibaba.cloud.ai.example.opensearch;

import jdk.internal.vm.annotation.ReservedStackAccess;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.JsonReader;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author 北极星
 */
@RestController
public class OpensearchController {

    @Autowired
    VectorStore vectorStore;

    @GetMapping("/load/documents")
    public void load(String sourceFile) {
        JsonReader jsonReader = new JsonReader(new FileSystemResource(sourceFile),
                "price", "name", "shortDescription", "description", "tags");
        List<Document> documents = jsonReader.get();
        this.vectorStore.add(documents);
    }

    @GetMapping("/delete/documents")
    public void deleteDocuments(){
        // Create test documents with different metadata
        Document bgDocument = new Document("The World is Big",
                Map.of("country", "Bulgaria"));
        Document nlDocument = new Document("The World is Big",
                Map.of("country", "Netherlands"));

        // Add documents to the store
        vectorStore.add(List.of(bgDocument, nlDocument));

        // Delete documents from Bulgaria using filter expression
        Filter.Expression filterExpression = new Filter.Expression(
                Filter.ExpressionType.EQ,
                new Filter.Key("country"),
                new Filter.Value("Bulgaria")
        );
        vectorStore.delete(filterExpression);
    }
}
