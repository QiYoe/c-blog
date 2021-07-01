---
title: Docker配置详解
head:
  - - meta
    - name: description
      content: Docker配置详解
  - - meta
    - name: keywords
      content: Linux Ubuntu CentOS Docker Docker配置
---

## 为什么Docker？

[docker官网](https://docs.docker.com/get-started/overview/)

Docker 是一个用于开发、发布和运行应用程序的开放平台。通过利用 Docker 的快速发布、测试和部署代码的方法，可以显著减少编写代码和在生产环境中运行代码之间的延迟。

## Getting Started

官网下载[docker客户端](https://docs.docker.com/docker-for-windows/install/)

容器：简单地说，容器就是机器上与主机上的所有其他进程隔离的另一个进程。这种隔离利用了内核namespaces 和 cgroups，这些特性在 Linux 中已经存在很长时间了。

镜像：在运行容器时，它使用一个独立的文件系统。这个自定义文件系统是由容器镜像提供的。由于镜像包含容器的文件系统，因此它必须包含运行应用程序所需的所有内容——所有的依赖项、配置、脚本、二进制文件等。镜像还包含容器的其他配置，如环境变量、要运行的默认命令和其他元数据。

### Getting started

命令行运行：
```bash
docker run -d -p 80:80 docker/getting-started
# -d  以分离模式(在后台)运行容器
# -p 80:80  将主机的80端口映射到容器的80端口
# docker/getting-started  使用镜像
# 缩写： docker run -dp 80:80 docker/getting-started
```

### Sample application

下载[官网示例项目](https://github.com/docker/getting-started/tree/master/app)。在项目根目录中添加Dockerfile文件：
```dockerfile
FROM node:12-alpine
RUN apk add --no-cache python g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

命令行运行：
```bash
docker build -t getting-started .
# 该命令使用 Dockerfile 构建一个新的容器镜像，从node: 12-alpine 开始下载镜像。下载镜像之后，我们在应用程序中复制镜像，并使用yarn安装应用程序的依赖项。CMD 指令指定从此镜像启动容器时运行的默认命令。
# 最后,-t 标志标记我们的镜像。可以将其简单地看作是最终镜像的可读名称。
# 在 Docker build 命令的末尾告诉 Docker 应该在工作目录文件中寻找 Dockerfile。

# 使用 docker run 命令启动容器，并指定我们刚刚创建的镜像的名称:
docker run -dp 3000:3000 getting-started
```

### Update the application

在 src/static/js/app.js 文件中，更新第56行以使用新的空白文本：
```html
-  <p className="text-center">No items yet! Add one above!</p>
+  <p className="text-center">You have no todo items yet! Add one above!</p>
```
```bash
# 让我们使用之前使用的相同命令构建映像的更新版本。
docker build -t getting-started .

# 让我们使用更新的代码启动一个新容器。
docker run -dp 3000:3000 getting-started
```
:::danger 报错
我们无法启动新容器，因为旧容器还在运转。这是一个问题，因为容器使用主机的端口3000，并且机器上只有一个进程(包括容器)可以侦听特定的端口。为了解决这个问题，我们需要移除旧的容器。
:::

移除旧容器：
- Remove a container using the CLI

```bash
# 使用 docker ps 命令获取容器的 ID。
docker ps

# 使用 docker stop 命令停止容器。
docker stop <the-container-id>

# 一旦容器停止，您可以使用 dockerrm 命令删除它。
docker rm <the-container-id>
```
- Remove a container using the Docker Dashboard

1. 打开仪表板，鼠标悬停在应用程序容器上，你会看到一组动作按钮出现在右边。
2. 单击垃圾桶图标删除容器。
3. 确认移除，你就完成了！

现在，开始更新你的应用程序。
```bash
docker run -dp 3000:3000 getting-started
```
在你的浏览器上刷新http://localhost:3000，你就会看到更新的帮助文本！

### Share the application

现在我们已经建立了一个镜像，让我们分享它！要共享 Docker 映像，必须使用 Docker 注册表。默认的注册表是 dockerhub，我们使用的所有镜像都来自这个注册表。

创建名为`getting-started`的仓库。。。

推送镜像：
```bash
# 使用命令登录到 Docker Hub。
docker login -u YOUR-USER-NAME

# 使用 `docker tag` 命令为刚开始使用的`getting-started`镜像命名。一定要用你的 Docker ID 替换掉 `YOUR-USER-NAME`。
docker tag getting-started YOUR-USER-NAME/getting-started

# push。如果要从 dockerhub 复制值，可以删除 tagname 部分，因为我们没有向镜像名称添加标记。如果不指定标记，Docker 将使用名为 latest 的标记。
docker push YOUR-USER-NAME/getting-started
```

在[Play with Docker](https://labs.play-with-docker.com/)点击`ADD NEW INSTANCE`选项，在终端中，启动刚刚推出的应用程序。
```bash
docker run -dp 3000:3000 YOUR-USER-NAME/getting-started
```

### Persist the DB(持久化数据库)







































































