package com.alibaba.cloud.ai.application.utils.rag;

import com.alibaba.cloud.ai.application.service.SAARagService;
import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.embedding.DashScopeEmbeddingModel;
import com.alibaba.cloud.ai.dashscope.embedding.DashScopeEmbeddingOptions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.InsertReq;
import jakarta.annotation.Resource;
import org.springframework.ai.document.MetadataMode;
import org.springframework.ai.vectorstore.milvus.MilvusVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author 北极星
 */
@SpringBootTest
public class MilvusTest {

    @Autowired
    MilvusVectorStore milvusVectorStore;

    public MilvusTest (MilvusVectorStore milvusVectorStore) {
        this.milvusVectorStore = milvusVectorStore;
    }

    @Resource
    SAARagService ragService;

    public void testWithRag () {

        String[] data = new String[]{"""
        1. 使用SpringAIAlibaba创建一个Spring Boot项目，并添加spring-ai-alibaba-starter依赖。
        """, """
        在SpringAIAlibaba项目的pom.xml中添加Spring Milestone和Snapshot存储库。
        """, """
        通过SpringAIAlibaba申请阿里云通义API Key，在application.yml中进行配置。
        """, """
        使用SpringAIAlibaba的ChatClient和Prompt功能实现对话模型。
        """, """
        使用SpringAIAlibaba的TongYiChatModel和TongYiImagesModel实现聊天和图片服务。
        """};

        ragService.createCollectionSchema();
        ragService.loadCollection();
        List list = ragService.embeddingDataSet(List.of(data));
        ragService.bulkDataSetIntoVector(List.of(data),list);
    }
}
