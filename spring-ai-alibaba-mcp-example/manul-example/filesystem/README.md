# Spring AI 智能体通过 MCP 集成本地文件数据

这里我们提供一个示例智能体应用，这个智能体可以通过 MCP 查询或更新本地文件系统，并以文件系统中的数据作为上下文与模型交互。此示例演示如何使用模型上下文协议（MCP）将 Spring AI 与本地文件系统进行集成。

## 运行示例
### 前提条件
1. 安装 npx (Node Package eXecute):
首先确保本地机器安装了 [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)，然后运行如下命令：

```bash
npm install -g npx
```

2. 下载示例源码

```bash
git clone https://github.com/springaialibaba/spring-ai-alibaba-examples.git
cd spring-ai-alibaba-examples/spring-ai-alibaba-mcp-example/filesystem
```

3. 设置环境变量

```bash
# 通义大模型 Dashscope API-KEY
export AI_DASHSCOPE_API_KEY=${your-api-key-here}
```

4. 构建示例

```bash
./mvnw clean install
```


### 运行示例应用
运行示例，智能体将向模型发起提问（源码中包含预置问题，可通过源码查看），可通过控制台查看输出结果。

```bash
./mvnw spring-boot:run
```

> 如果您是在 IDE 中运行示例，并且遇到 filesystem mcp server 返回的文件访问权限问题，请确保指定当前进程工作目录为 spring-ai-alibaba-mcp-example/filesystem 目录。

## 示例架构（源码说明）
前文中我们讲解了 Spring AI 与 MCP 集成的基础架构，在接下来的示例中，我们将用到以下关键组件：

1. **MCP Client**，与 MCP 集成的关键，提供了与本地文件系统进行交互的能力。
2. **Function Callbacks**，Spring AI MCP 的 function calling 声明方式。
3. **Chat Client**，Spring AI 关键组件，用于 LLM 模型交互、智能体代理。

### 声明 ChatClient
```java
// List<McpFunctionCallback> functionCallbacks;
var chatClient = chatClientBuilder.defaultFunctions(functionCallbacks).build();
```

和开发之前的 Spring AI 应用一样，我们先定义一个 ChatClient Bean，用于与大模型交互的代理。需要注意的是，我们为 ChatClient 注入的 functions 是通过 MCP 组件（McpFunctionCallback）创建的。

接下来让我们具体看一下 McpFunctionCallback 是怎么使用的。

### 声明 MCP Function Callbacks
以下代码段通过 `mcpClient` 与 MCP server 交互，将 MCP 工具通过 McpFunctionCallback 适配为标准的 Spring AI function。

1. 发现 MCP server 中可用的工具 tool（Spring AI 中叫做 function） 列表
2. 依次将每个 tool 转换成 Spring AI function callback
3. 最终我们会将这些 McpFunctionCallback 注册到 ChatClient 使用



```java
@Bean
public List<McpFunctionCallback> functionCallbacks(McpSyncClient mcpClient) {
    return mcpClient.listTools(null)
            .tools()
            .stream()
            .map(tool -> new McpFunctionCallback(mcpClient, tool))
            .toList();
}
```



可以看出，ChatClient 与模型交互的过程是没有变化的，模型在需要的时候告知 ChatClient 去做函数调用，只不过 Spring AI 通过 McpFunctionCallback 将实际的函数调用过程委托给了 MCP，通过标准的 MCP 协议与本地文件系统交互:

+ 在与大模交互的过程中，ChatClient 处理相关的 function calls 请求
+ ChatClient 调用 MCP 工具（通过 McpClient）
+ McpClient 与 MCP server（即 filesystem）交互

### 初始化 McpClient
该智能体应用使用同步 MCP 客户端与本地运行的文件系统 MCP server 通信：



```java
@Bean(destroyMethod = "close")
public McpSyncClient mcpClient() {
    var stdioParams = ServerParameters.builder("npx")
            .args("-y", "@modelcontextprotocol/server-filesystem", "path))
            .build(); // 1

    var mcpClient = McpClient.sync(new StdioServerTransport(stdioParams),
            Duration.ofSeconds(10), new ObjectMapper()); //2

    var init = mcpClient.initialize(); // 3
    System.out.println("MCP Initialized: " + init);

    return mcpClient;
}
```



在以上代码中：

1. 配置 MCP server 启动命令与参数
2. 初始化 McpClient：关联 MCP server、指定超时时间等
3. Spring AI 会使用 `npx -y @modelcontextprotocol/server-filesystem "/path/to/file"` 在本地机器创建一个独立的子进程（代表本地 Mcp server），Spring AI 与 McpClient 通信，McpClient 进而通过与 Mcp server 的连接操作本地文件。

