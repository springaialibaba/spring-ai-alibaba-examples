# Spring AI Alibaba Module RAG 使用示例

## 1. 简介

Spring AI Module RAG: https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html#modules

Spring AI implements a Modular RAG architecture inspired by the concept of modularity detailed in the paper "Modular RAG: Transforming RAG Systems into LEGO-like Reconfigurable Frameworks".

## 2. 组成部分

### 2.1 Pre-Retrieval

> 增强和转换用户输入，使其更有效地执行检索任务，解决格式不正确的查询、query 语义不清晰、或不受支持的语言等。

1. QueryAugmenter 查询增强：使用附加的上下文数据信息增强用户 query，提供大模型回答问题时的必要上下文信息；
2. QueryTransformer：查询改写：因为用户的输入通常是片面的，关键信息较少，不便于大模型理解和回答问题。因此需要使用 prompt 调优手段或者大模型改写用户 query；
3. QueryExpander：查询扩展：将用户 query 扩展为多个语义不同的变体以获得不同视角，有助于检索额外的上下文信息并增加找到相关结果的机会。

### 2.2 Retrieval

> 负责查询向量存储等数据系统并检索和用户 query 相关性最高的 Document。

1. DocumentRetriever：检索器，根据 QueryExpander 使用不同的数据源进行检索，例如 搜索引擎、向量存储、数据库或知识图等；
2. DocumentJoiner：将从多个 query 和从多个数据源检索到的 Document 合并为一个 Document 集合；

### 2.3 Post-Retrieval

> 负责处理检索到的 Document 以获得最佳的输出结果，解决模型中的*中间丢失*和上下文长度限制等。

1. DocumentRanker：根据 Document 和用户 query 的相关性对 Document 进行排序和排名；
2. DocumentSelector：用于从检索到的 Document 列表中删除不相关或冗余文档；
3. DocumentCompressor：用于压缩每个 Document，减少检索到的信息中的噪音和冗余。

### 2.4 生成

生成用户 Query 对应的大模型输出。

## 3. 启动示例

在启动示例之前，您本地应该有一个可以正常使用的 ES.

### Basic

### Compression

无 Compression 时

```shell
curl -X POST http://127.0.0.1:10014/module-rag/rag/memory/123 \
    -d '{"prompt": "Who are the characters going on an adventure in the North Pole?"}'

output:

I'm sorry, but I don't have the information needed to answer your question. Could you please provide more details or clarify your query? If it's outside my current knowledge base, I may not be able to assist accurately. Let me know how else I can help!
```

```shell
curl -X POST http://127.0.0.1:10014/module-rag/rag/memory/123 \
    -d '{"prompt": "What places do they visit?"}'

output:

I understand. Here's how I would respond:

---

I'm sorry, but I don't have specific information about the characters going on an adventure in the North Pole. Could you provide more context or
 details? If it's from a particular story, book, or game, letting me know might help me assist you better. Otherwise, I might not be able to provide an accurate answer. Let me know if there's anything else I can help with!

---

Is this response appropriate for your needs?
```

有 Compression 时

```shell
curl -X POST http://127.0.0.1:10014/module-rag/rag/compression/123 \
    -d '{"prompt": "Who are the characters going on an adventure in the North Pole?"}'
    
output:
Understood. Here's a polite and clear response for the user:

---

I'm sorry, but I don't have the specific information about the characters going on an adventure in the North Pole. If this is from a particular 
story, book, or other source, providing more details might help me assist you better. Otherwise, I may not be able to provide an accurate answer. Let me know if there's anything else I can help with!

---

Is this appropriate for your needs?
```

```shell
curl -X POST http://127.0.0.1:10014/module-rag/rag/compression/123 \
    -d '{"prompt": "What places do they visit?"}'
 
output:
Certainly! Here’s a polite response to inform the user that the query is outside my knowledge base:

---

I'm sorry, but I don't have the specific information about the characters going on an adventure in the North Pole. If this is from a particular 
story, book, or other source, providing more details might help me assist you better. Otherwise, I may not be able to provide an accurate answer. Let me know if there's anything else I can help with!

---

Or, more directly:

---

I'm sorry, but I don't have the information needed to answer your question about the characters going on an adventure in the North Pole. If you 
can provide more context or specify the source, I'd be happy to try assisting further. Otherwise, I may not be able to provide an accurate answer. Let me know if there's anything else I can help with!

---

Is this suitable for your needs?
```

其他接口类似。
