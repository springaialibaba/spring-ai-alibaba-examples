# Spring AI Alibaba Examples

> Spring AI Alibaba Example 示例。

[English](./README-en.md) | 中文

## 介绍

此仓库中包含许多 Example 来介绍 Spring AI Alibaba 从基础到高级的各种用法和 AI 项目的最佳实践。
更详细的介绍介绍请参阅每个子项目中的 README.md 和 [Spring AI Alibaba 官网](https://java2ai.com)。

## 如何参与

我们欢迎任何形式的贡献，包括但不限于：

- Spring AI Alibaba 的使用示例；
- Spring AI Alibaba API 的使用；
- Spring AI 的使用示例；
- AI 项目的最佳实践 等。

此项目仓库正在建设中，请阅读 [Roadmap.md](./Roadmap-zh.md) 了解更多信息。

## 已集成的功能模型

| Category | Options                                |
|----------|----------------------------------------|
| Chat     | DashScope, OpenAI, ark（火山方舟）, ollama, ZhiPuAI, moonshot（月之暗面） |
| RAG      | ES, milvus, pgvector                   |
| 多模态    | ark（火山方舟）, Dashscope              |
| Image    | Dashscope, OpenAI                      |
| Audio    | DashScope                              |
| 开发生态  | MCP，Nacos，Higress，Kong，可观测，Prompt 模版，函数调用，集成示例，结构化输出 |

## 项目结构

在此 Example 项目中，我们按照功能的方式组合模块，力求将每个 Example 的功能模块化，方便大家查找和使用。
一个基本的模块示例如下：

```text
|-spring-ai-alibaba-chat-example
|-- dashscope
|----chat-model
|------ src
|------ README.md
|------ pom.xml
|----chat-client
|------ src
|------ README.md
|------ pom.xml
|-- ollama
|----chat-model
|------ src
|------ README.md
|------ pom.xml
|----chat-client
|------ src
|------ README.md
|------ pom.xml
|-- ...... (other LLMs)
|- ......(other Examples)
```
