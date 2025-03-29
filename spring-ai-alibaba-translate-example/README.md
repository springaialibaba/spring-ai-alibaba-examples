# Spring AI Alibaba Translate Example

This project demonstrates the integration of Spring Boot with AI capabilities using the Spring AI library to perform text translation, leveraging Ollama as the AI provider.

## Prerequisites

- Java 17
- Maven
- Ollama (configured with the appropriate base URL and model)

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/springaialibaba/spring-ai-alibaba-examples.git
   cd spring-ai-alibaba-translate-example
   ```

2. **Configure Ollama:**
   Set the following environment variables:
   - `OLLAMA_BASE_URL`: The base URL of your Ollama server.
   - `OLLAMA_MODEL`: The model to be used for translation.

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

## Endpoints

### Translate File

- **URL:** `/api/translate/file`
- **Method:** `POST`
- **Description:** Translates the content of the uploaded file to the specified target language.

#### Request Parameters
- **file:** The file to be translated (multipart/form-data).
- **targetLang:** The target language for translation (e.g., "Chinese").

#### Response
```json
{
  "translatedText": "你好，世界！"
}
```

## Configuration

The application uses the following configuration file:

- `application.yml`: Main configuration file.

## Testing Endpoints

To test the `/api/translate/file` endpoint using `curl`, you can use the following command:

```sh
curl -X POST http://localhost:8080/api/translate/file \
-F "file=@/path/to/your/file.txt" \
-F "targetLang=Chinese"
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../LICENSE) file for details.
