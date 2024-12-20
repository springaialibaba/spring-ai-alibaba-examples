# 贡献说明

作为一个 Example 项目，我们希望您在提交代码时遵守以下规则：

1. 提交的 Example 必须是完整的，包含必要的 README.md 和**方法参数**注释说明；
2. 在提交 PR 之后，自己阅览所提的 PR 确保没有基础问题，例如代码格式，错别字，是否包含 **License Header** 等；
3. 如果提交的 Example 需要使用到本地模型，可以使用 Docker/Docker Compose 等工具提供；
4. 给每个 Example 选择合适的 module；
5. 如果每个模型的 Example 示例都类似，可以不用拆分二级目录的模型名；
6. 如果要在项目使用 json 序列化工具，推荐使用 jackson；
7. 如果要在项目中使用工具类，推荐使用 Apache Common Utils 或者 Spring 相关工具类。

## Spring AI Alibaba Example 的项目结构

在此 Example 项目中，我们按照功能的方式组合模块，力求将每个 Example 的功能模块化，方便大家查找和使用。
一个基本的模块示例如下：

```text
|-spring-ai-alibaba-chat-example
|-- dashscope-chat
|----dashscope-chat-model
|------ src
|------ README.md
|------ pom.xml
|----dashscope-chat-client
|------ src
|------ README.md
|------ pom.xml
|-- ollama-chat
|----ollama-chat-model
|------ src
|------ README.md
|------ pom.xml
|----ollama-chat-client
|------ src
|------ README.md
|------ pom.xml
|-- ...... (other LLMs)
|- ......(other Examples)
```
