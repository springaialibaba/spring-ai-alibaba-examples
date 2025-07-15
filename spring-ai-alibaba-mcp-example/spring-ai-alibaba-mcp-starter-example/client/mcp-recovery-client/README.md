MCP在建立SSE连接时，Client端和Server端再一段时间没有数据传输时会字段断开。Spring Ai Alibaba提供了自动重连机制
- 利用一个线程定期去ping MCP Server端，将断开的Server服务名记录到延时队列中
- 另一个线程异步去获取延时队列中的服务名，重新建立SSE连接

### 快速上手
依赖项
```xml
        <dependency>
            <groupId>com.alibaba.cloud.ai</groupId>
            <artifactId>spring-ai-alibaba-starter-mcp-recovery-client</artifactId>
            <version>${spring-ai-alibaba.version}</version>
        </dependency>
```
配置项

```yaml
spring:
    mcp:
      client:
        enabled: false # 可关闭原先的MCP Client 
        sse:
          connections:
            server1:
              url: http://localhost:19000 # 本地

    alibaba:
      mcp:
        recovery:
          enabled: true
          delay: 5s # 定期ping MCP Server端的间隔时间
          stop: 10s # 断开连接的的最大等待时间
```
注入依赖
- SYNC -> McpSyncRecovery
- ASYNC -> McpAsyncRecovery