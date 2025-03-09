# pagvector

此文件夹中用于存放一些 pgvector 服务常用的 Docker Compose 启动文件。

- postgres16版本同时安装age和pgvector [DockerFile](./postgres16-age/DockerFile)

执行以下命令启动 pg：

```shell
docker compose up -d --build
```