# Spring AI MCP + Nacos 示例项目

本项目是一个基于 [spring-ai-alibaba-mcp-nacos-dynamic-server](https://github.com/spring-projects/spring-ai-alibaba) 的简单示例，展示如何构建一个动态的mcp server提供服务。

## 🧩 主要依赖

```xml
<!-- Dynamic Mcp Server -->
<dependency>
  <groupId>com.alibaba.cloud.ai</groupId>
  <artifactId>spring-ai-alibaba-mcp-dynamic-server</artifactId>
  <version>1.0.0-M6.2-SNAPSHOT</version>
</dependency>

        <!-- MCP Server (WebMVC) -->
<dependency>
<groupId>com.alibaba.cloud.ai</groupId>
<artifactId>spring-ai-alibaba-starter</artifactId>
<version>${spring-ai-alibaba.version}</version>
</dependency>
```

---

## 🚀 快速开始

### 1. 启动 Nacos 服务

请确保你已经本地或远程启动了 [Nacos 服务器]

### 2. 配置 application.yml

```yaml
spring:
  application:
    name: spring-ai-alibaba-nacos-dynamic-mcp-server-example
  ai:
    mcp:
      server:
        name: dynamic-mcp-server
        version: 1.0.0
    dashscope:
      api-key: ${AI_DASHSCOPE_API_KEY}
      chat:
        options:
          model: qwen-max-latest

    alibaba:
      mcp:
        nacos:
          enabled: true
          server-addr:
          service-namespace: public
          service-group: DEFAULT_GROUP
          username:
          password:

server:
  port: 8081


```

### 3. 启动应用

```bash
mvn spring-boot:run
```

或使用 IDE 运行 `Application.java`。

---

---

## 📡 Nacos 注册效果

---

## 🚧 后续开发计划（TODO）


## 📎 参考资料

---
