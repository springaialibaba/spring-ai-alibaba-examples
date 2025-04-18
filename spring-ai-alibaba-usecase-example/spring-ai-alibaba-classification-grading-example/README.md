# 数据分类分级智能体示例程序

本模块是基于 Spring AI Alibaba ChatClient API 和 DashScope 模型的数据分类分级智能体示例，接入了向量检索和对话记忆能力，用于对用户输入的字段名进行分类分级推理。

## 📅 功能特性

- 支持 Spring AI ChatClient API 核心能力
- 接入 DashScope Qwen 系列大模型进行分类分级理解
- 集成 VectorStore 支持上下文检索能力 (RAG)
- 集成 ChatMemory 实现对话记忆功能
- 支持接口化的 classify(String fieldName) 方法

## 🔧 项目结构

```
|- classification-assistant
|-- src
|   |-- main
|   |   |-- java/com/alibaba/cloud/ai/example/dcg/service/ClassificationAssistant.java
|   |   |-- resources/
|   |-- test
|-- README.md
|-- pom.xml
```

## ✨ 使用方法

### 1. 基础环境

- JDK 17+
- DashScope API Key

### 2. application.yml 配置

```yaml
spring:
  ai:
    dashscope:
      api-key: <你的APIKey>
```

### 3. 代码示例

```java
@Autowired
private ClassificationAssistant assistant;

String result = assistant.classify("专利交底书");
System.out.println(result);
```

方法会自动调用 ChatClient，合成向量检索结果 (retrieved_docs) 和 ChatMemory，并传递用户输入字段，进行数据分类分级理解。



## 🚀 扩展提示

- 可以点开 ChatClient 的 function calling 功能，使用更复杂的处理逻辑
- 你可以维护一套 RAG 矩阵文档控制检索范围，实现更精精的分类
- 通过 PromptAdvisor 优化 Prompt 模板表达

## 📚 License

本项目遵循 [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)。

