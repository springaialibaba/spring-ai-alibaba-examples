# Spring AI Alibaba observability example

This example demonstrates how to integrate **Spring AI Alibaba** with **Aliyun ARMS** for application observability via
 the **Aliyun Java Agent**.

## Getting Started

### Prerequisites
1. [Access ARMS license key](https://arms.console.aliyun.com/?spm=5176.8140086.J_5253785160.6.7d95be45Cyqfbr#/intgr/integrations?menu=server-app&showIntgrDetail=true&intgrId=apm-java&name=Java+%E5%BA%94%E7%94%A8%E7%9B%91%E6%8E%A7&pageType=console&tab=startIntgr&version=0.0.1): Activate the service and obtain the ARMS license key.
2. Prepare java agent: Download *aliyun-java-agent*.jar (We have prepared it [in this project](./src/javaagent/AliyunJavaAgent)).
   If you wish to obtain the latest version of the java agent or receive more support, please submit a [ticket](https://smartservice.console.aliyun.com/service/create-ticket) to contact us.
3. Build this project.
4. [Run the application](#local-run) jar with several extra java properties.
5. Startup verification: When you see "Started ObservabilityApplication in xxx seconds" in the command line, it indicates that the startup was successful.
6. Call your service
    ```bash
   curl --location 'http://localhost:8080/joke'
   ```
7. [Check the monitor view](https://arms.console.aliyun.com/#/llm/list/cn-hangzhou?from=now-15m&to=now&refresh=off): 
   After you call the service, you can see the corresponding data being collected in the ARMS console, which will take
   about one minute. If it is a newly integrated application, you may need to wait an additional minute to allow 
   resources to be initialized.

### Local Run
```bash
mvn clean package -Dmvn.test.skip=true

export AI_DASHSCOPE_API_KEY=${AI_DASHSCOPE_API_KEY}

java \
  -javaagent:./src/javaagent/AliyunJavaAgent/aliyun-java-agent.jar \
  -Darms.licenseKey=${ARMS_LICENSE_KEY} \
  -Darms.appName=${ARMS_APP_NAME} \
  -Daliyun.javaagent.regionId=${ARMS_REGION_ID} \
  -jar ./target/observability-example-0.0.1-SNAPSHOT.jar
```
