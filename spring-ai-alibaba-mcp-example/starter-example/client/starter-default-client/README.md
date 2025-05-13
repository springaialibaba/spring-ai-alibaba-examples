# Spring AI MCP 客户端示例

## 项目简介

本项目是 Spring AI 框架下基于 MCP (Model Context Protocol) 协议的客户端示例程序。通过本示例，您可以了解如何使用 Spring AI 构建一个与 MCP 服务端通信的客户端应用程序，实现模型调用和工具函数调用。

## 主要功能

- 通过 MCP 协议与服务端建立通信
- 支持标准输入输出 (STDIO) 方式的连接
- 实现基本的聊天问答功能
- 支持自定义工具调用（以天气查询为例）
- 集成阿里云 DashScope API 作为 LLM 服务提供者

## 技术栈

- Java 17+
- Spring Boot 3.x
- Spring AI 框架
- MCP (Model Context Protocol) 通信协议
- Maven 构建系统

## 配置说明

### 主要配置文件

1. **application.properties**：
    - 应用基本配置
    - API 密钥配置
    - 日志级别设置
    - 编码设置
    - 服务端连接配置

2. **mcp-servers-config.json**：
    - 配置 MCP 服务器连接
    - 服务端命令及参数设置

### 关键配置项

- `spring.ai.dashscope.api-key`：阿里云 DashScope API 密钥，通过环境变量 `DASH_SCOPE_API_KEY` 设置
- `spring.ai.mcp.client.stdio.servers-configuration`：MCP 服务器配置文件位置
- `ai.user.input`：测试用的用户输入问题

## 使用方法

### 环境准备

1. 确保已安装 JDK 17 或更高版本
2. 确保已安装 Maven
3. 获取阿里云 DashScope API 密钥

### 编译运行

1. 编译服务端：
   ```bash
   cd spring-ai-alibaba-mcp-example/starter-example/server/starter-stdio-server
   mvn clean package
   ```

2. 编译客户端：
   ```bash
   cd spring-ai-alibaba-mcp-example/starter-example/client/starter-default-client
   mvn clean package
   ```

3. 设置 API 密钥：
   ```bash
   export DASH_SCOPE_API_KEY=您的密钥
   ```

4. 运行客户端：
   ```bash
   mvn spring-boot:run
   ```

### 自定义问题

您可以通过修改 `application.properties` 文件中的 `ai.user.input` 属性来自定义问题：

```properties
ai.user.input=您想问的问题
```

或者修改 `Application.java` 文件直接硬编码问题：

```java
private String userInput = "您的问题";
```

## 问题排查

### 常见问题

1. **401 错误**：检查 `DASH_SCOPE_API_KEY` 环境变量是否正确设置
2. **中文乱码**：检查编码设置，可通过 JVM 参数 `-Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8` 解决
3. **找不到服务端 JAR**：检查 `mcp-servers-config.json` 中的路径配置是否正确

### 调试技巧

- 启用 DEBUG 级别日志观察请求响应
- 检查服务端是否正常启动并监听请求
- 使用绝对路径避免路径解析问题

## 代码结构

- `src/main/java/org/springframework/ai/mcp/samples/client/`：Java 源代码
    - `Application.java`：应用程序入口和主要逻辑
- `src/main/resources/`：配置文件目录
    - `application.properties`：应用配置
    - `mcp-servers-config.json`：MCP 服务器配置

## 注意事项

- API 密钥不应硬编码到配置文件中，应使用环境变量或安全的配置管理工具
- 生产环境中应适当配置超时和重试策略
- 服务端 JAR 路径应根据实际部署环境调整

## 参考资料

- [Spring AI 官方文档](https://docs.spring.io/spring-ai/reference/)
- [阿里云 DashScope API 文档](https://help.aliyun.com/document_detail/2400395.html)
- [MCP 协议规范](https://modelcontextprotocol.ai/)
