# Spring AI Alibaba Playground Docker部署指南

本指南提供使用Docker部署Spring AI Alibaba Playground项目的详细说明。

## 系统要求

- Docker 20.10.0或更高版本
- Maven 3.8+（用于本地构建）
- JDK 17
- 至少2GB可用内存

## 部署选项

### 选项1：使用自动化脚本（推荐）

项目提供了一个自动化脚本，可以简化构建和部署过程：

```bash
# 添加执行权限
chmod +x build-and-run.sh

# 运行脚本
./build-and-run.sh
```

该脚本将：
1. 清理旧的容器（如果存在）
2. 使用Maven构建项目
3. 构建Docker镜像
4. 创建必要的目录
5. 启动容器并挂载所需的卷

### 选项2：手动构建和部署

如果您希望手动控制部署过程，可以按照以下步骤操作：

#### 1. 本地构建项目

```bash
# 清理并打包项目，跳过测试以加速构建
mvn clean install -DskipTests
```

#### 2. 构建Docker镜像

```bash
# 构建Docker镜像
docker build -t spring-ai-alibaba-playground .
```

#### 3. 创建必要的目录

```bash
mkdir -p logs
mkdir -p src/main/resources/db
mkdir -p src/main/resources/mcp-libs
mkdir -p src/main/resources/rag/markdown
```

#### 4. 运行容器

Linux/macOS:
```bash
docker run -d -p 8080:8080 \
  -v "$(pwd)/src/main/resources/mcp-libs:/app/mcp-libs" \
  -v "$(pwd)/src/main/resources/rag/markdown:/app/rag/markdown" \
  -v "$(pwd)/src/main/resources:/app/src/main/resources" \
  -v "$(pwd)/logs:/app/logs" \
  --name spring-ai-alibaba-playground \
  spring-ai-alibaba-playground
```

Windows (PowerShell):
```powershell
docker run -d -p 8080:8080 `
  -v "$($PWD)/src/main/resources/mcp-libs:/app/mcp-libs" `
  -v "$($PWD)/src/main/resources/rag/markdown:/app/rag/markdown" `
  -v "$($PWD)/src/main/resources:/app/src/main/resources" `
  -v "$($PWD)/logs:/app/logs" `
  --name spring-ai-alibaba-playground `
  spring-ai-alibaba-playground
```

## 环境变量配置

您可以通过环境变量自定义应用程序的行为：

```bash
# 基础配置
-e SPRING_PROFILES_ACTIVE=prod \  # 激活的配置文件，可选：dev或prod

# API密钥配置（按需设置）
-e BAIDU_TRANSLATE_APP_ID=your_app_id \
-e BAIDU_TRANSLATE_SECRET_KEY=your_secret_key \
-e BAIDU_MAP_API_KEY=your_api_key \
-e AI_DASHSCOPE_API_KEY=your_api_key
```

## 访问应用

- 浏览器访问：`http://localhost:8080`
- Swagger API文档：`http://localhost:8080/doc.html`

## 容器管理

```bash
# 查看容器日志
docker logs spring-ai-alibaba-playground

# 停止容器
docker stop spring-ai-alibaba-playground

# 启动已停止的容器
docker start spring-ai-alibaba-playground

# 移除容器
docker rm spring-ai-alibaba-playground

# 强制重建并重启
./build-and-run.sh
```

## 故障排除

### 常见问题

1. **数据库错误**：确保 `src/main/resources/db` 目录下存在 `saa.db` 文件。

2. **9411 端口错误**：这是 Zipkin 服务未启动导致的，不影响应用的正常使用。

3. **容器无法启动**：检查日志 `docker logs spring-ai-alibaba-playground` 查找错误原因。 
