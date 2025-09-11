# Spring AI Alibaba MCP Config Example

## 项目介绍

Spring AI Alibaba MCP Config Example是一个演示读取MCP服务配置的示例项目。

## 版本要求

1. Nacos: 3.0.1+
2. spring ai alibaba: 1.0.0.3-SNAPSHOT+

## 功能特性

- 从配置文件（application.yml）中读取
- 从 Nacos 配置中心读取

## 快速开始

### 从配置文件中读取

配置 application.yml，举例：

```yml
spring:
  ai:
    alibaba:
      mcp:
        router:
          enabled: true  # 启用MCP路由
          discovery-type: nacos  # 服务发现类型
          services:  # 服务列表
            - name: weather-service  # 服务名称
              description: "天气查询服务"
              protocol: "http"
              version: "1.0.0"
              endpoint: "http://localhost:8080/weather"  # 服务端点
              enabled: true  # 是否启用该服务
              tags:  # 服务标签
                - "weather"
                - "api"
```
运行程序，即可从配置文件中读取 MCP 服务配置信息。

### 从 Nacos 配置中心读取

1. 启动 Nacos 服务

2. 注册 MCP 服务

   注册 MCP 服务，服务名称为 `weather-service`，服务版本为 `1.0.0`，服务端点为 `http://localhost:8080/weather`，服务标签为 `weather,api`。

3. 运行程序

   运行程序，即可从 Nacos 配置中心读取 MCP 服务配置信息。
