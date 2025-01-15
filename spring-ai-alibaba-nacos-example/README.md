# Spring AI Alibaba Nacos Example

This project demonstrates the integration of Spring Boot with Alibaba Nacos for configuration management and service discovery, along with AI capabilities using the Spring AI library.

## Prerequisites

- Java 17
- Maven
- Nacos Server
- Deepseek API Key

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/springaialibaba/spring-ai-alibaba-examples.git
   cd spring-ai-alibaba-nacos-example
   ```

2. **Configure Nacos Server:**

   Ensure that the Nacos server is running and accessible. Set the `NACOS_SERVER_ADDR` environment variable to the address of your Nacos server.

3. **Configure Deepseek API Key:**

   Set the `DEEPSEEK_API_KEY` environment variable with your Deepseek API key.

4. **Build the project:**

   ```sh
   mvn clean install
   ```

## Running the Application

To run the application, use the following command:

```sh
mvn spring-boot:run
```

The application will start on port `10010`.

## Endpoints

### Joke Prompt

- **URL:** `/joke`
- **Method:** `GET`
- **Description:** Returns a joke message configured in Nacos.

## Configuration

The application uses the following configuration files:

- `application.yml`: Main configuration file.
- `prompt-config.yaml`: Contains prompt-related configurations.

### prompt-config.yaml

```yaml
prompt:
   joke: "讲个笑话"
```
## Testing Endpoints

To test the `/joke` endpoint using `curl`, you can use the following command:

```sh
curl http://localhost:10010/joke
```

## Modifying `prompt-config.yaml`

To modify the `prompt-config.yaml` file, update the `joke` message as needed. For example:

```yaml
prompt:
   joke: "使用海盗的声音讲个笑话"
```

After modifying the `prompt-config.yaml` file, you can test the changes without restarting the application:

```sh
curl http://localhost:10010/joke
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../LICENSE) file for details.
