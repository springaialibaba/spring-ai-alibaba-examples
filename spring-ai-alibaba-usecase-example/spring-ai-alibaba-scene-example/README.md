# Spring AI Alibaba 集成示例

## Introduction
本示例项目展示了如何使用 Spring AI Alibaba 实现同时询问多个模型并接受多个模型运行结果的功能。该项目设计为一个独立且可移植的运行示例，包含了前端和后端的实现，您可以直接使用或参考此项目，将 Spring AI Alibaba 集成到您的项目中。

## 快速开始

### 克隆项目
```bash
git clone <repository-url>
cd spring-ai-alibaba-scene-example
```

### 前端设置
进入前端目录并安装依赖：
```bash
cd frontend
pnpm install
```

启动开发服务器：
```bash
pnpm dev
```

访问地址：
[http://localhost:5173](http://localhost:5173)

### 后端设置
1、src/main/resources/application.yml 中配置对应模型参数

2、启动：src/main/java/com/alibaba/example/multimodelchat/MultiModelChatApplication.java

## 其他信息
// 可以在这里添加关于项目的其他信息，如贡献指南、许可证等。

