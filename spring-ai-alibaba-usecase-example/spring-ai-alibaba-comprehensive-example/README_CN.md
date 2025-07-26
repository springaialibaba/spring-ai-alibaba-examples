# Chat AI Demo - 智能对话平台

🌐 **语言版本**: [English](README_EN.md) | [中文](#chinese)

---

## 🚀 项目概述

Chat AI Demo 是一个基于 Spring AI Alibaba 构建的综合性AI对话平台，展示了多种AI应用场景，包括智能对话、文档分析和政府采购数据爬取等功能。

## ✨ 核心特性

- **🎯 多场景聊天**：基础聊天、游戏聊天、客服聊天、PDF文档聊天
- **🖼️ 多模态支持**：文本+图片输入能力
- **🛠️ 工具调用**：客服场景中的课程查询和预约功能
- **📚 RAG知识库**：PDF文档上传和智能问答
- **🧠 聊天记忆**：多轮对话上下文保持
- **🗄️ 向量存储**：支持Milvus向量数据库
- **🕷️ 网页爬虫**：政府采购数据爬取和AI分析
- **📊 图数据库**：Neo4j集成支持复杂数据关系

## 🏗️ 技术栈

**后端技术：**
- Spring Boot 3.5.3
- Spring AI Alibaba 1.0.0.2
- 阿里云DashScope（通义千问）
- MySQL + MyBatis Plus
- Neo4j 图数据库
- Milvus 向量数据库
- WebMagic 网页爬虫

**前端技术：**
- Vue.js 3
- TypeScript
- Vite
- Naive UI
- Heroicons

## 🔧 环境配置

### 1. 环境变量设置

在启动项目前，需要设置以下环境变量：

```bash
# 阿里云DashScope API密钥
export DASHSCOPE_API_KEY=your_dashscope_api_key

# MySQL数据库密码
export MYSQL_PASSWORD=your_mysql_password

# Neo4j数据库密码
export NEO4J_PASSWORD=your_neo4j_password
```

### 2. 获取DashScope API Key

1. 访问 [阿里云DashScope控制台](https://dashscope.console.aliyun.com/)
2. 注册账号并开通服务
3. 在API Key管理页面创建新的API Key
4. 将API Key设置为环境变量 `DASHSCOPE_API_KEY`

### 3. 数据库配置

**MySQL数据库：**
创建数据库 `chatAiDemo`，并执行 `sql.txt` 中的SQL脚本。

**Milvus向量数据库：**
确保Milvus服务运行,修改 `application.yaml` 中的配置。

**Neo4j图数据库：**
配置Neo4j连接信息，修改 `application.yaml` 中的配置。

## 🚀 项目启动

### 后端启动

```bash
# 编译项目
mvn clean compile

# 启动项目
mvn spring-boot:run
```

### 前端启动

```bash
cd chatAiDemo-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📡 API接口

### 聊天相关接口
- `POST /ai/chat` - 基础聊天（支持多模态）
  - 参数：`prompt`（提问内容）, `chatId`（会话ID）, `files`（可选，多模态文件）
- `POST /ai/game` - 游戏场景聊天
  - 参数：`prompt`（提问内容）, `chatId`（会话ID）
- `POST /ai/service` - 客服聊天
  - 参数：`prompt`（提问内容）, `chatId`（会话ID）
- `POST /ai/pdf/chat` - PDF文档聊天
  - 参数：`prompt`（提问内容）, `chatId`（会话ID）
- `POST /ai/pdf/upload/{chatId}` - 上传PDF文件
  - 参数：`file`（PDF文件）

### 采购爬虫接口
- `POST /procurement/crawl/start` - 启动爬虫任务
  - 参数：`url`（可选，起始URL）
- `POST /procurement/crawl/single` - 爬取单个页面
  - 参数：`url`（页面URL）
- `GET /procurement/projects` - 获取所有项目
- `GET /procurement/projects/search` - 搜索项目
  - 参数：`keyword`（搜索关键词）
- `POST /procurement/analyze` - AI分析
  - 参数：`content`（待分析内容）

## 🎯 应用场景

### 1. AI智能对话
支持多模态交互的智能对话机器人，功能包括：
- 文本和图片处理
- 上下文感知回复
- 实时流式响应

### 2. 情感模拟器
情感交互和沟通技巧提升：
- 情感分析
- 互动游戏
- 技能提升

### 3. 智能客服助手
24小时专业咨询服务：
- 课程查询系统
- 预约预订功能
- 即时响应

### 4. PDF智能分析
文档上传和智能问答：
- PDF文档解析
- 基于向量的搜索
- 上下文感知回答

### 5. 采购数据爬虫
政府采购数据分析：
- 自动化网页爬取
- AI驱动的内容分析
- 图数据库存储
- 智能分类

## 🔄 从Spring AI迁移说明

本项目已从原生Spring AI迁移到Spring AI Alibaba，主要变更包括：

1. **依赖更新**：使用 `spring-ai-alibaba-starter-dashscope` 替代 `spring-ai-starter-model-openai`
2. **配置变更**：使用 `spring.ai.dashscope` 配置替代 `spring.ai.openai`
3. **模型类更新**：使用 `DashScopeChatModel` 和 `DashScopeEmbeddingModel`
4. **API Key变更**：使用DashScope API Key替代OpenAI API Key

## 🤝 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目链接: [https://github.com/touhouqing/chatAiDemo](https://github.com/touhouqing/chatAiDemo)
- 问题反馈: [https://github.com/touhouqing/chatAiDemo/issues](https://github.com/touhouqing/chatAiDemo/issues)

## 🙏 致谢

- [Spring AI Alibaba](https://github.com/alibaba/spring-ai-alibaba)
- [阿里云DashScope](https://dashscope.console.aliyun.com/)
- [Vue.js](https://vuejs.org/)
- [Milvus](https://milvus.io/)
- [Neo4j](https://neo4j.com/)
