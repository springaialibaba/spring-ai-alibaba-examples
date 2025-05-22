本示例是MCP Server多节点注册在Nacos中，建立稳定性连接

1. MCP Server多节点注册在Nacos中
2. MCP Client建立1-N连接
3. 根据sync、async模式提供clints自动注入
```java
    @Autowired
    private List<LoadbalancedMcpSyncClient> loadbalancedMcpSyncClients;
```
or
```java
    @Autowired
    private List<LoadbalancedMcpAsyncClient> loadbalancedMcpAsyncClients;
```
4. 提供ToolCallbackProvider
```java
@Qualifier("loadbalancedSyncMcpToolCallbacks") ToolCallbackProvider tools
```
or
```java
@Qualifier("loadbalancedMcpAsyncToolCallbacks") ToolCallbackProvider tools

```



### application.yml配置
```yaml
spring:
  application:
    name: mcp-client-webflux
  ai:
    openai:
      api-key: ${DASHSCOPE_API_KEY}
      base-url: https://dashscope.aliyuncs.com/compatible-mode
      chat:
        options:
          model: qwen-max
    alibaba:
      mcp:
        nacos:
          enabled: true
          server-addr: 127.0.0.1:8848
          username: nacos
          password: nacos
          registry:
            service-namespace: 9ba5f1aa-b37d-493b-9057-72918a40ef35
            service-group: mcp-server

        client:
          sse:
            connections:
              server1: mcp-server-provider # MCP Server服务名称
    mcp:
      client:
        enabled: true
        name: mcp-client-webflux
        version: 0.0.1
        initialized: true
        request-timeout: 600s

        nacos-enabled: true

        type: sync
        toolcallback:
          enabled: true
        root-change-notification: true

```
