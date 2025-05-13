# 运行阶段
FROM registry.cn-hangzhou.aliyuncs.com/jast-docker/openjdk:17-slim

# 设置工作目录
WORKDIR /app

# 安装Node.js和npm (用于前端构建，如果需要)
RUN apt-get update && \
    apt-get install -y curl gnupg wget && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    # 验证安装
    node --version && \
    npm --version

# 从构建阶段复制构建好的jar
COPY target/app.jar ./app.jar

# 创建需要挂载的目录
RUN mkdir -p /app/resources/mcp-libs \
    /app/resources/rag/markdown \
    /app/resources/db \
    /app/logs

# 声明挂载点
VOLUME ["/app/resources/mcp-libs", "/app/src/main/resources", "/app/resources/rag/markdown", "/app/logs"]

# 设置环境变量
ENV BAIDU_TRANSLATE_APP_ID=${BAIDU_TRANSLATE_APP_ID} \
    BAIDU_TRANSLATE_SECRET_KEY=${BAIDU_TRANSLATE_SECRET_KEY} \
    BAIDU_MAP_API_KEY=${BAIDU_MAP_API_KEY} \
    AI_DASHSCOPE_API_KEY=${AI_DASHSCOPE_API_KEY} \
    TZ=Asia/Shanghai

# 暴露应用端口
EXPOSE 8080

# 启动命令，添加JVM优化参数
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://localhost:8080/actuator/health || exit 1 
