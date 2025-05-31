package com.alibaba.example.graph.conf;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;

import java.util.List;

@Configuration
class VectorStoreConfig {
    /**
     * Define a default VectorStore bean so that the KnowledgeRetrievalNode can get it
     */

    @Value("${rag.source:classpath:data/manual.txt}")
    Resource ragSource;

    @Bean
    @Primary
    public VectorStore customVectorStore(EmbeddingModel embeddingModel) {

        var chunks = new TokenTextSplitter().transform(new TextReader(ragSource).read());

        SimpleVectorStore vectorStore = SimpleVectorStore.builder(embeddingModel).build();

        vectorStore.write(chunks);
        return vectorStore;
    }
}
