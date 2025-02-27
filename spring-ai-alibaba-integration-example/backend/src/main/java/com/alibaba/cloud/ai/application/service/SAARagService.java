package com.alibaba.cloud.ai.application.service;

import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.embedding.DashScopeEmbeddingModel;
import com.alibaba.cloud.ai.dashscope.embedding.DashScopeEmbeddingOptions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.milvus.client.MilvusServiceClient;
import io.milvus.param.collection.LoadCollectionParam;
import io.milvus.param.dml.InsertParam;
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import org.springframework.ai.document.MetadataMode;
import org.springframework.ai.vectorstore.milvus.MilvusVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author 北极星
 */
@Service
public class SAARagService {

    @Autowired
    MilvusServiceClient client;

    public SAARagService (MilvusVectorStore milvusVectorStore) {
        Optional<MilvusServiceClient> nativeClient = milvusVectorStore.getNativeClient();
        if (nativeClient.isPresent()) {
            this.client = nativeClient.get();
        }
    }

    public List prepareData () {

        // 识别文档
        //        MarkdownDocumentParser markdownDocumentParser = new MarkdownDocumentParser();

        // 文档分块
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
        return Arrays.stream(data)
                .toList();
    }

    /**************************************
     * 离线
     *************************************/
    public CreateCollectionReq.CollectionSchema createCollectionSchema () {
        CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder()
                .enableDynamicField(true)
                .build();
        schema.addField(AddFieldReq.builder()
                .fieldName("id")
                .dataType(io.milvus.v2.common.DataType.Int64)
                .isPrimaryKey(Boolean.TRUE)
                .autoID(false)
                .build());
        schema.addField(AddFieldReq.builder()
                .fieldName("asq_text")
                .dataType(DataType.String)
                .build());
        schema.addField(AddFieldReq.builder()
                .fieldName("binary_vector")
                .dataType(io.milvus.v2.common.DataType.BinaryVector)
                .dimension(512)
                .build());
        return schema;
    }

    public void loadCollection () {
        LoadCollectionParam loadCollectionParam = LoadCollectionParam.newBuilder()
                .withCollectionName("spring-ai-alibaba-plg-ground")
                .build();
        client.loadCollection(loadCollectionParam);
    }

    public List<float[]> embeddingDataSet (List<String> list) {

        var dashScopeApi = new DashScopeApi("sk-7a74bd9492b24f6f835a03e01affe294");
        var embeddingModel = new DashScopeEmbeddingModel(dashScopeApi, MetadataMode.EMBED,
                DashScopeEmbeddingOptions.builder()
                .withModel("multimodal-embedding-v1")
                .build());
        List<float[]> embedList = embeddingModel.embed(list);

        return Collections.unmodifiableList(embedList);
    }

    // 取get(0)
    public boolean bulkDataSetIntoVector (List<String> dataList, List<Float[]> embedList) {
        List<JsonObject> vectorList = new ArrayList<>();
        for (String jsonObject : dataList) {
            JsonObject vector = new JsonObject();
            vector.add("asq_vector", new Gson().toJsonTree(embedList.get(0)));
            vector.addProperty("id", dataList.indexOf(jsonObject));
            vector.addProperty("asq_text", dataList.get(dataList.indexOf(jsonObject)));
            vectorList.add(vector);
        }

        InsertParam insertParam = InsertParam.newBuilder()
                .withCollectionName("spring_ai_alibaba_plg_ground")
                .withRows(vectorList)
                .build();
        return client.insert(insertParam)
                .getStatus()
                .intValue() > 0;
    }

    /**************************************
     * 在线
     *************************************/
}
