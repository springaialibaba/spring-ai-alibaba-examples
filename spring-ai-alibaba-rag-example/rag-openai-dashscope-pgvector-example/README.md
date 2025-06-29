# MXY RAG Server

基于Spring AI的RAG（检索增强生成）服务器，使用阿里云通义千问模型（OpenAI兼容模式）。

## 特性

- 智能问答：基于知识库的RAG问答
- 多格式支持：PDF、Word、TXT等文档
- 向量存储：PostgreSQL + pgvector
- 流式响应：支持实时对话
- 阿里云模型：通义千问 + text-embedding-v3

## 技术栈

- Spring Boot 3.4.5 + Spring AI 1.0.0
- Java 17
- PostgreSQL + pgvector
- 阿里云通义千问（OpenAI兼容模式）

## 快速开始

### 1. 环境准备

```bash
# 设置API Key
set AI_DASHSCOPE_API_KEY=your_api_key

# 确保PostgreSQL已安装pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. 配置数据库

修改 `application.yaml` 中的数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/springai
    username: postgres
    password: postgres
```

### 3. 启动应用

```bash
mvn spring-boot:run
```

应用启动在 `http://localhost:9000`

## API接口

### 上传文档
```http
POST /api/v1/knowledge-base/upload-file
Content-Type: multipart/form-data

file=@document.pdf
```

### 插入文本
```http
POST /api/v1/knowledge-base/insert-text
Content-Type: application/x-www-form-urlencoded

content=文本内容
```

### 智能问答
```http
POST /api/v1/knowledge-base/chat
Content-Type: application/x-www-form-urlencoded

query=你的问题&topK=5
```

### 流式问答
```http
POST /api/v1/knowledge-base/chat-stream
Content-Type: application/x-www-form-urlencoded

query=你的问题&topK=5
```

### 相似性搜索
```http
GET /api/v1/knowledge-base/search?query=搜索内容&topK=5
```

## 模型配置

- **Chat模型**: qwen-plus-latest（阿里云通义千问）
- **嵌入模型**: text-embedding-v3（1024维）
- **调用方式**: OpenAI兼容模式
- **API地址**: https://dashscope.aliyuncs.com/compatible-mode

## 注意事项

1. 需要阿里云DashScope API Key
2. PostgreSQL需安装pgvector扩展
3. 默认支持最大10MB文件上传
4. 向量维度固定为1024维
