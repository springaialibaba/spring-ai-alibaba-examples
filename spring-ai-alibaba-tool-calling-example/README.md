# Tool Calling Example

Demonstrate four approaches to ToolCalling with four distinct examples here:
- TimeController : Methods as Tools
- AddressController : Methods as Tools - MethodToolCallback
- BaiduTranslateController : Function as Tools - Function Name
- WeatherController : Function as Tools - FunctionCallBack

More available tools can be found on [this documentation](https://java2ai.com/docs/1.0.0-M5.1/integrations/tools/). For mcp style tools please check [spring-ai-alibaba-mcp-example](../spring-ai-alibaba-mcp-example).

For more detail information: [spring-ai-tools](https://docs.spring.io/spring-ai/reference/api/tools.html)

## How to Run
Baidu translation API access document: https://api.fanyi.baidu.com/product/113

Baidu Map API document: https://lbs.baidu.com/faq/api

Access document of weather forecast API: https://www.weatherapi.com/docs/

```yaml
spring:
  ai:
    alibaba:
      toolcalling:
        baidu:
          translate:
            enabled: true
            app-id: ${BAIDU_TRANSLATE_APP_ID}
            secret-key: ${BAIDU_TRANSLATE_SECRET_KEY}
          map:
            apiKey: ${BAIDU_MAP_API_KEY}

        time:
          enabled: true

        weather:
          enabled: true
          api-key: ${WEATHER_API_KEY}

    dashscope:
      api-key: ${AI_DASHSCOPE_API_KEY}

```
