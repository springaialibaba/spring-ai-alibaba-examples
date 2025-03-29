# Spring AI Alibaba Observability Example

## Introduction

### 配置

1. 配置 [resources](observability-example/src/main/resources) 下的对应环境参数设置。

### 启动项目

启动以下任意一个项目，并执行 controller 中的 `chat` 接口，即可在控制台中查看观测信息：

1. [observationhandler-example](observationhandler-example): 获取模型组件运行过程中的可观测信息。
    - **关键代码**: [CustomerObservationHandler.java](observationhandler-example/src/main/java/com/alibaba/cloud/ai/observationhandlerexample/observationHandler/CustomerObservationHandler.java)

2. [observability-example](observability-example): 将所有可观测信息以 OTLP 规范打印出来。
    - **关键代码**: com.alibaba.cloud.ai.example.observability.exporter.oltp.OtlpFileSpanExporter.export

## 参考文档

- [Spring AI Observability](https://docs.spring.io/spring-ai/reference/1.0/observability/index.html)
- [OpenTelemetry Java Examples](https://github.com/open-telemetry/opentelemetry-java-examples)