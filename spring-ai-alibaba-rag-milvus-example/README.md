# Spring AI Alibaba Example

这个项目展示了如何使用 Spring AI Alibaba 集成 Milvus 进行向量搜索。

## Quick Start

- JDK 17
- Milvus (Docker Compose)

1. 通过 Docker Compose 安装 Milvus。
   - docker-compose的yml文件见目录/spring-ai-alibaba-examples/docker-compose/milvus/docker-compose.yml
   - 详细安装文档见地址：https://milvus.io/docs/install_standalone-docker-compose.md
2. 启动 Milvus。
3. 创建 collection
4. 打开 Milvus 向量检索。
5. 修改 application.yml 中的配置。
6. 运行本项目

其中Milvus的配置如下：
注意：不同版本Milvus的配置略有不同，Milvus2.3.0版本才原生支持 Cosine 距离，请根据实际情况调整

截图是Attu的WebPortal界面 (Milvus GUI)，介绍地址见：https://github.com/zilliztech/attu

![img.png](img.png)
