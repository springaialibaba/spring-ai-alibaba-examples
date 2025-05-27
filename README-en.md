# Spring AI Alibaba Examples

> Examples for Spring AI Alibaba.

English | [中文](./README.md)

## Introduction

This repository contains numerous examples to demonstrate the usage of Spring AI Alibaba from basic to advanced levels and best practices for AI projects.
For more detailed information, please refer to the README.md in each sub-project and the [Spring AI Alibaba official website](https://java2ai.com).

## How to Contribute

We welcome contributions in any form, including but not limited to:

- Usage examples of Spring AI Alibaba;
- Usage of Spring AI Alibaba API;
- Usage examples of Spring AI;
- Best practices for AI projects, etc.

This project repository is under construction, please read the [Roadmap.md](./Roadmap-en.md) for more information.

## Integrated Features and Models

| Category | Options                                |
|----------|----------------------------------------|
| Chat     | DashScope, OpenAI, ark (Volcano Ark), ollama, ZhiPuAI, moonshot |
| RAG      | ES, milvus, pgvector                   |
| Multimodal | ark (Volcano Ark), Dashscope        |
| Image    | Dashscope, OpenAI                      |
| Audio    | DashScope                              |
| Development Ecosystem | MCP, Nacos, Higress, Kong, Observability, Prompt templates, Function calling, Integration examples, Structured output |

## Project Structure

In this Example project, we organize modules by functionality, aiming to modularize each Example for easy discovery and use.
A basic module example is as follows:

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