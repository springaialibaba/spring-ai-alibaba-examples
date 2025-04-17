# Spring AI Alibaba Playground

## 项目启动

Spring AI Alibaba Playground 被设计为一个独立的项目，这意味你需要使用 IDE 单独打开此目录或者在 IDE 中设置对应的工作路径：

![Run](./images/run.png)

> ***因为项目中使用到了 spring ai alibaba 未发布的功能，因此需要 clone 项目 `mvn install` 本地安装，才能正常启动。***

需要配置 dev 配置文件中的相关 key，使用到的相关 key 有：
  - `百度翻译 appId 和 secretKey` Tool Call 时使用
  - `百度地图 api key` Tool Call 时使用
  - `阿里云灵积平台 key` 大模型服务
  - `阿里云 IQS 服务 apikey` 联网搜索使用

其他配置项：

1. 如果项目启动时出现数据库相关错误，需要手动在 resources 目录下的 db 创建 saa.db 文件；
2. 如果访问接口时，报 9411 端口相关错误，这是 zipkin 服务未启动原因，不影响接口调用；
3. swagger 接口：http://localhost:8080/doc.html；
4. ~~如果服务启动时报 McpClient 相关错误，需要在 resources 目录下将 mcp-servers-config.json 中的 jar 改为本机的绝对路径；~~，playground 中已经做了增强处理，改为使用 Yaml 配置；
5. 点击启动类启动项目，项目启动之后，浏览器访问 http://localhost:8080 查看前端页面；

## 项目打包

> 需要配置 mcp-libs 目录，可能会引起错误。

```shell
mvn clean install -DskipTests

java -jar ./target/app.jar
```

PS: 此项目正在开发中......
