# Spring AI Alibaba Translate Example

[English](README-en.md) | 中文

本项目演示了如何使用 Spring AI 和 Spring AI Alibaba 库集成多种大模型提供翻译服务，支持 Ollama 和 DashScope 等多种模型提供商。

## 先决条件

- Java 17
- Maven
- 对于 Ollama 模型：Ollama 服务 (配置好相应的基础 URL 和模型)
- 对于 DashScope 模型：有效的 DashScope API Key

## 设置

1. **克隆仓库:**
   ```sh
   git clone https://github.com/springaialibaba/spring-ai-alibaba-examples.git
   cd spring-ai-alibaba-translate-example
   ```

2. **配置模型服务:**
   设置以下环境变量:
   - 对于 Ollama:
     - `OLLAMA_BASE_URL`: Ollama 服务器的基础 URL
     - `OLLAMA_MODEL`: 用于翻译的模型名称
   - 对于 DashScope:
     - `AI_DASHSCOPE_API_KEY`: 你的 DashScope API Key

3. **构建项目:**
   ```sh
   mvn clean install
   ```

## 运行应用

使用以下命令运行应用:
```sh
mvn spring-boot:run
```

应用将在 `8080` 端口启动.

## API 端点

### 1. 文件翻译 (Ollama 模型)

- **URL:** `/api/translate/file`
- **方法:** `POST`
- **描述:** 翻译上传文件的内容到指定的目标语言

#### 请求参数
- **file:** 要翻译的文件 (multipart/form-data)
- **targetLang:** 翻译的目标语言 (例如 "Chinese")

#### 响应
```json
{
  "translatedText": "你好，世界！"
}
```

### 2. DashScope 翻译服务

#### 2.1 基础翻译

- **URL:** `/api/dashscope/translate/simple`
- **方法:** `GET`
- **描述:** 使用 DashScope 模型翻译文本

#### 请求参数
- **text:** 要翻译的文本
- **sourceLanguage:** 源语言 (默认: "中文")
- **targetLanguage:** 目标语言 (默认: "英文")

#### 响应
```json
{
  "translatedText": "Hello, World!"
}
```

#### 2.2 流式翻译

- **URL:** `/api/dashscope/translate/stream`
- **方法:** `GET`
- **描述:** 使用 DashScope 模型的流式翻译文本，支持打字机效果的实时显示

#### 请求参数
- **text:** 要翻译的文本
- **sourceLanguage:** 源语言 (默认: "中文")
- **targetLanguage:** 目标语言 (默认: "英文")

#### 响应
流式文本响应

#### 2.3 自定义参数翻译

- **URL:** `/api/dashscope/translate/custom`
- **方法:** `GET`
- **描述:** 使用自定义模型参数的 DashScope 翻译

#### 请求参数
- **text:** 要翻译的文本
- **sourceLanguage:** 源语言 (默认: "中文")
- **targetLanguage:** 目标语言 (默认: "英文")

#### 响应
```json
{
  "translatedText": "Hello, World!"
}
```

## 配置

应用使用以下配置文件:

- `application.yml`: 主配置文件，包含 Ollama 和 DashScope 等模型配置

## 测试端点

### 测试文件翻译

使用以下 `curl` 命令测试 `/api/translate/file` 端点:

```sh
curl -X POST http://localhost:8080/api/translate/file \
-F "file=@/path/to/your/file.txt" \
-F "targetLang=Chinese"
```

### 测试 DashScope 翻译

```sh
curl "http://localhost:8080/api/dashscope/translate/simple?text=你好，世界！&sourceLanguage=中文&targetLanguage=英文"
```

## 许可证

本项目基于 Apache License 2.0 许可证。详情请参阅 [LICENSE](../../LICENSE) 文件。
