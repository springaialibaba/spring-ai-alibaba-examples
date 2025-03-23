# Tool Calling Example

This example showcases the use of Baidu Translate Tool.

More available tools can be found on [this documentation](https://java2ai.com/docs/1.0.0-M5.1/integrations/tools/). For mcp style tools please check [spring-ai-alibaba-mcp-example](../spring-ai-alibaba-mcp-example).


## How to Run
In order to run this example, you need to register and the tokens from Baidu Translate platform first by following [this instruction](https://api.fanyi.baidu.com/).

Once you are all set with Baidu Translate platform, [get the appId and secretKey](](BAIDU_TRANSLATE_APP_ID).) from the platform and set the environments as defined in application.yml.

```yaml
spring:
  ai:
    alibaba:
      toolcalling:
        baidutranslate:
          enabled: true
          app;-id: ${BAIDU_TRANSLATE_APP_ID}
          secret-key: ${BAIDU_TRANSLATE_SECRET_KEY}
```
