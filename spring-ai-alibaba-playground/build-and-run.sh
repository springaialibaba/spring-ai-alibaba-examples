#!/bin/bash
set -e

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# 打印错误
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 清理旧容器
if docker ps -a | grep -q spring-ai-alibaba-playground; then
    print_message "清理旧容器..."
    docker stop spring-ai-alibaba-playground || true
    docker rm spring-ai-alibaba-playground || true
fi

# 构建项目
print_message "开始构建项目..."
~/Software/apache-maven-3.9.9/bin/mvn clean install -DskipTests || { print_error "Maven构建失败"; exit 1; }

# 构建Docker镜像
print_message "构建Docker镜像..."
docker build -t spring-ai-alibaba-playground . || { print_error "Docker构建失败"; exit 1; }

# 运行容器
print_message "启动容器..."
docker run -d -p 8080:8080 \
  -v "$(pwd)/src/main/resources/mcp-libs:/app/mcp-libs" \
  -v "$(pwd)/src/main/resources/rag/markdown:/app/rag/markdown" \
  -v "$(pwd)/src/main/resources:/app/src/main/resources" \
  -v "$(pwd)/logs:/app/logs" \
  --name spring-ai-alibaba-playground \
  spring-ai-alibaba-playground

# 检查容器是否成功启动
if [ $? -eq 0 ]; then
    print_message "应用已成功启动，请访问 http://localhost:8080"
    print_message "Swagger API文档：http://localhost:8080/doc.html"
else
    print_error "容器启动失败，请检查日志"
    exit 1
fi
