# Spring AI MCP 客户端示例

由于 [streamable http](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) 方案的 MCP java sdk 实现还在开发中，因此该示例仓库中包含如下两个仓库的定制源码：

1. [MCP java-sdk](https://github.com/modelcontextprotocol/java-sdk/)，在项目 `io.modelcontextprotocol` 包。
2. [Spring AI](https://github.com/spring-projects/spring-ai/)，在项目 `org.springframework.ai.mcp.client.autoconfigure` 包。

示例集成了支持 MCP Streamable HTTP 协议实现的 Higress 网关，该实现还有很多限制，如不支持 GET 请求、不支持 session-id 管理等。

## 如何运行
运行前，请先 `export DASH_SCOPE_API_KEY=xxx`
