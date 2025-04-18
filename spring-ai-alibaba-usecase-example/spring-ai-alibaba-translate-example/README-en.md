# Spring AI Alibaba Translate Example

English | [中文](README.md)

This project demonstrates the integration of Spring Boot with AI capabilities using Spring AI and Spring AI Alibaba libraries to perform text translation, leveraging various model providers such as Ollama and DashScope.

## Prerequisites

- Java 17
- Maven
- For Ollama models: Ollama service (configured with the appropriate base URL and model)
- For DashScope models: Valid DashScope API Key

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/springaialibaba/spring-ai-alibaba-examples.git
   cd spring-ai-alibaba-translate-example
   ```

2. **Configure model services:**
   Set the following environment variables:
   - For Ollama:
     - `OLLAMA_BASE_URL`: The base URL of your Ollama server
     - `OLLAMA_MODEL`: The model to be used for translation
   - For DashScope:
     - `AI_DASHSCOPE_API_KEY`: Your DashScope API Key

3. **Build the project:**
   ```sh
   mvn clean install
   ```

## Running the Application

To run the application, use the following command:
```sh
mvn spring-boot:run
```

The application will start on port `8080`.

## API Endpoints

### 1. File Translation (Ollama model)

- **URL:** `/api/translate/file`
- **Method:** `POST`
- **Description:** Translates the content of the uploaded file to the specified target language.

#### Request Parameters
- **file:** The file to be translated (multipart/form-data)
- **targetLang:** The target language for translation (e.g., "Chinese")

#### Response
```json
{
  "translatedText": "你好，世界！"
}
```

### 2. DashScope Translation Services

#### 2.1 Basic Translation

- **URL:** `/api/dashscope/translate/simple`
- **Method:** `GET`
- **Description:** Translate text using DashScope model

#### Request Parameters
- **text:** The text to be translated
- **sourceLanguage:** Source language (default: "中文" - Chinese)
- **targetLanguage:** Target language (default: "英文" - English)

#### Response
```json
{
  "translatedText": "Hello, World!"
}
```

#### 2.2 Streaming Translation

- **URL:** `/api/dashscope/translate/stream`
- **Method:** `GET`
- **Description:** Stream translation text using DashScope model, supporting real-time typewriter effect

#### Request Parameters
- **text:** The text to be translated
- **sourceLanguage:** Source language (default: "中文" - Chinese)
- **targetLanguage:** Target language (default: "英文" - English)

#### Response
Streaming text response

#### 2.3 Custom Parameters Translation

- **URL:** `/api/dashscope/translate/custom`
- **Method:** `GET`
- **Description:** Use DashScope translation with custom model parameters

#### Request Parameters
- **text:** The text to be translated
- **sourceLanguage:** Source language (default: "中文" - Chinese)
- **targetLanguage:** Target language (default: "英文" - English)

#### Response
```json
{
  "translatedText": "Hello, World!"
}
```

## Configuration

The application uses the following configuration file:

- `application.yml`: Main configuration file, including Ollama and DashScope model configurations

## Testing Endpoints

### Testing File Translation

To test the `/api/translate/file` endpoint using `curl`, you can use the following command:

```sh
curl -X POST http://localhost:8080/api/translate/file \
-F "file=@/path/to/your/file.txt" \
-F "targetLang=Chinese"
```

### Testing DashScope Translation

```sh
curl "http://localhost:8080/api/dashscope/translate/simple?text=你好，世界！&sourceLanguage=中文&targetLanguage=英文"
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../../LICENSE) file for details. 