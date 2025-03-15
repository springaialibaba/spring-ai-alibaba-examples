# Spring AI MCP WebFlux 服务器示例

## 项目简介

本项目是一个基于Spring AI框架的Model Context Protocol (MCP) WebFlux服务器示例。它展示了如何构建一个支持WebFlux和STDIO两种通信方式的MCP服务器，提供天气查询和空气质量信息等工具服务。

## 主要功能

- 支持WebFlux和STDIO两种通信方式
- 提供天气预报查询服务（基于OpenMeteo API）
- 提供空气质量信息查询服务（模拟数据）
- 支持响应式编程模型
- 支持工具函数的动态注册和调用

## 技术栈

- Java 17+
- Spring Boot 3.x
- Spring WebFlux
- Spring AI MCP Server
- OpenMeteo API
- Maven

## 项目结构

```
starter-webflux-server/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/springframework/ai/mcp/sample/server/
│   │   │       ├── McpServerApplication.java     # 应用程序入口
│   │   │       └── OpenMeteoService.java         # 天气服务实现
│   │   └── resources/
│   │       └── application.properties            # 应用配置
│   └── test/
│       └── java/
│           └── org/springframework/ai/mcp/sample/client/
│               ├── ClientStdio.java              # STDIO客户端测试
│               ├── ClientSse.java                # SSE客户端测试
│               └── SampleClient.java             # 通用客户端测试
└── pom.xml                                       # Maven配置
```

## 核心组件

### McpServerApplication

应用程序的主入口类，负责：
- 配置Spring Boot应用
- 注册天气工具服务
- 初始化MCP服务器

### OpenMeteoService

提供两个主要工具服务：
1. `getWeatherForecastByLocation`: 获取指定位置的天气预报
   - 支持当前天气和未来7天预报
   - 包含温度、湿度、风向、降水量等信息
   - 使用OpenMeteo免费API

2. `getAirQuality`: 获取指定位置的空气质量信息
   - 提供欧洲AQI和美国AQI两种标准
   - 包含PM10、PM2.5、CO、NO2、SO2、O3等污染物数据
   - 目前使用模拟数据（可扩展为真实API）

## 配置说明

### 服务器配置

在`application.properties`中：

```properties
# 服务器配置
spring.ai.mcp.server.name=my-weather-server
spring.ai.mcp.server.version=0.0.1

# 使用STDIO传输时的配置
spring.main.banner-mode=off
# logging.pattern.console=
```

### WebFlux客户端配置

在客户端的`application.properties`中：

```properties
# 基本配置
server.port=8888
spring.application.name=mcp
spring.main.web-application-type=none

# API密钥配置
spring.ai.dashscope.api-key=${DASH_SCOPE_API_KEY}

# SSE连接配置
spring.ai.mcp.client.sse.connections.server1.url=http://localhost:8080

# 调试日志
logging.level.io.modelcontextprotocol.client=DEBUG
logging.level.io.modelcontextprotocol.spec=DEBUG

# 编码配置
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true
spring.mandatory-file-encoding=UTF-8

# 用户输入配置
ai.user.input=北京的天气如何？
```

## 使用方法

### 1. 编译项目

```bash
mvn clean package -DskipTests
```

### 2. 启动服务器

#### 作为Web服务器启动

```bash
mvn spring-boot:run
```

服务器将在 http://localhost:8080 启动。

#### 作为STDIO服务器启动

```bash
java -Dspring.ai.mcp.server.stdio=true \
     -Dspring.main.web-application-type=none \
     -Dlogging.pattern.console= \
     -jar target/mcp-starter-webflux-server-0.0.1-SNAPSHOT.jar
```

### 3. 客户端示例

#### WebFlux客户端

```java
// 配置WebFlux客户端
var transport = new WebFluxSseClientTransport(
    WebClient.builder().baseUrl("http://localhost:8080")
);

// 创建聊天客户端
var chatClient = chatClientBuilder
    .defaultTools(tools)
    .build();

// 发送问题并获取回答
System.out.println("\n>>> QUESTION: " + userInput);
System.out.println("\n>>> ASSISTANT: " + chatClient.prompt(userInput).call().content());
```

#### STDIO客户端

```java
var stdioParams = ServerParameters.builder("java")
    .args("-Dspring.ai.mcp.server.stdio=true",
          "-Dspring.main.web-application-type=none",
          "-Dlogging.pattern.console=",
          "-jar",
          "target/mcp-starter-webflux-server-0.0.1-SNAPSHOT.jar")
    .build();

var transport = new StdioClientTransport(stdioParams);
new SampleClient(transport).run();
```

## 工具调用示例

### 获取天气预报

```java
CallToolResult weatherResult = client.callTool(
    new CallToolRequest("getWeatherForecastByLocation",
        Map.of("latitude", "39.9042", "longitude", "116.4074"))
);
```

### 获取空气质量信息

```java
CallToolResult airQualityResult = client.callTool(
    new CallToolRequest("getAirQuality",
        Map.of("latitude", "39.9042", "longitude", "116.4074"))
);
```

## 注意事项

1. OpenMeteo API是免费的，无需API密钥
2. 空气质量数据目前使用模拟数据，实际应用中应替换为真实API
3. 使用STDIO传输时，必须禁用控制台日志和banner
4. 默认作为WebFlux服务器运行，支持HTTP通信
5. 客户端需要正确配置SSE连接URL
6. 确保环境变量`DASH_SCOPE_API_KEY`已正确设置

## 扩展开发

如需添加新的工具服务：

1. 创建新的服务类
2. 使用`@Tool`注解标记方法
3. 在`McpServerApplication`中注册服务

示例：

```java
@Service
public class MyNewService {
    @Tool(description = "新工具描述")
    public String myNewTool(String input) {
        // 实现工具逻辑
        return "处理结果: " + input;
    }
}

// 在McpServerApplication中注册
@Bean
public ToolCallbackProvider myTools(MyNewService myNewService) {
    return MethodToolCallbackProvider.builder()
        .toolObjects(myNewService)
        .build();
}
```

## 许可证

Apache License 2.0 