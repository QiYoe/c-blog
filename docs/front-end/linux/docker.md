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

容器：简单地说，容器就是机器上与主机上的所有其他进程隔离的另一个进程。这种隔离利用了内核namespaces 和 cgroups(control Group 控制组)，这些特性在 Linux 中已经存在很长时间了。

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

下载[官网示例项目](https://github.com/docker/getting-started/tree/master/app)。在项目根目录中添加Dockerfile(创建镜像)文件：
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
# 让我们使用之前使用的相同命令构建镜像的更新版本。
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

现在我们已经建立了一个镜像，让我们分享它！要共享 Docker 镜像，必须使用 Docker 注册表。默认的注册表是 dockerhub，我们使用的所有镜像都来自这个注册表。

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

当容器运行时，它使用镜像中的各个层作为其文件系统。每个容器还有自己的“scratch space”来创建/更新/删除文件。在另一个容器中不会看到任何更改，即使它们使用的是相同的镜像。

为了实际看到这一点，我们将启动两个容器，并在每个容器中创建一个文件。您将看到，在一个容器中创建的文件在另一个容器中不可用。
```bash
# 启动一个 ubuntu 容器，它将创建一个名为/data.txt 的文件，该文件的随机数在1到10000之间。
docker run -d ubuntu sh -c "shuf -i 1-10000 -n 1 -o /data.txt && tail -f /dev/null"
# 第一部分选择一个随机数并将其写入/data.txt--&&--第二个命令只是监视一个文件，以保持容器运行。

# 验证我们可以通过执行到容器中来查看输出。为此，打开 Dashboard 并单击运行 ubuntu 镜像的容器的第一个操作。
# 你会看到一个终端正在 ubuntu 容器中运行一个 shell。运行以下命令查看/data.txt 文件的内容。然后再次关闭这个终端。
cat /data.txt
# 或者直接命令行运行
# ps
# docker exec <container-id> cat /data.txt

# 现在，让我们启动另一个 ubuntu 容器(相同的镜像) ，我们将看到我们没有相同的文件。
docker run -it ubuntu ls /
# 看！那里没有 data.txt 文件！这是因为它被写入到只有第一个容器的scratch space。

# 移除第一个容器
docker rm -f <container-id>
```

在前面的实验中，我们看到每个容器在每次启动时都从镜像定义开始。虽然容器可以创建、更新和删除文件，但当容器被移除并且所有更改都隔离到该容器时，这些更改将丢失。通过volumes，我们可以改变这一切。

volumes提供了将容器的特定文件系统路径连接回主机的能力。如果挂载了容器中的目录，那么在主机上也可以看到该目录中的更改。如果我们在容器重新启动时挂载相同的目录，我们会看到相同的文件。

volumes主要有两种类型，我们最终将同时使用这两种类型，但是我们将从命名卷(named volumes)开始。

默认情况下，todo 应用程序在/etc/todos/todo.db 的 SQLite 数据库中存储数据。如果你不熟悉 SQLite，不用担心！它只是一个关系数据库文件夹，其中所有的数据存储在一个单一的文件中。虽然这对于大规模应用程序来说不是最好的，但是对于小型演示程序来说是可行的。稍后我们将讨论将其切换到不同的数据库引擎。

由于数据库是一个单独的文件，如果我们能够将该文件持久化到主机上，并使其可用于下一个容器，那么它应该能够从上一个文件中断的地方继续下去。通过创建一个卷并将其附加到存储数据的目录(通常称为“挂载”) ，我们可以保存数据。当我们的容器写入 todo.db 文件时，它将在卷中被持久化到主机。

如前所述，我们将使用一个命名的卷(named volume)。可以将指定的卷(volume)看作是一个数据桶。Docker 维护磁盘上的物理位置，您只需记住卷的名称。每次使用卷(volume)时，Docker 都会确保提供了正确的数据。

```bash
# 使用 docker volume Create 命令创建卷
docker volume create todo-db

# 在 Dashboard 中再次停止并删除 todo app 容器(或使用 docker rm-f < id >) ，因为它仍然在运行，而不使用持久卷。
docker rm-f < id >

# 启动 todo 应用程序容器，但添加-v 标志来指定卷挂载。我们将使用指定的卷并将其挂载到/etc/todos，它将捕获在路径中创建的所有文件。
docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started

# 一旦容器启动，打开应用程序并添加一些项目到你的待办事项列表。

# 停止并移除 todo 应用程序的容器。使用 Dashboard 或 docker ps 获取 ID，然后 docker rm-f < ID > 删除它。
docker rm -f <id>

# 使用上面的相同命令启动一个新容器。

# 打开应用程序。你应该看到你的项目仍然在你的清单！

# 继续前进，并删除容器当您完成检查您的列表。

# 当使用命名卷时，可以使用 docker volume inspect 命令查看Docker 实际上在哪里存储数据
docker volume inspect todo-db
# 挂载点是数据存储在磁盘上的实际位置。请注意，在大多数机器上，您需要具有从主机访问此目录的根访问权限。但是，它就在那里！
```

### Use bind mounts(挂载)

在前一章中，我们讨论并使用了一个命名卷来保存数据库中的数据。如果我们只是想存储数据，命名卷是很好的，因为我们不必担心数据存储在哪里。

使用绑定装载，我们可以控制主机上的精确装载点。我们可以使用它来持久化数据，但是它通常用于向容器中提供额外的数据。在处理应用程序时，我们可以使用 bind mount 将源代码挂载到容器中，让容器查看代码更改、响应，并让我们立即查看更改。

对于基于 node 的应用程序，nodemon 是一个很好的工具，可以监视文件更改，然后重新启动应用程序。在大多数其他语言和框架中也有类似的工具。

绑定挂载和命名卷是 Docker 引擎附带的两种主要卷类型。但是，额外的卷驱动程序可用于支持其他用例(SFTP、 Ceph、 NetApp、 S3等)。

| | Named Volumes	| Bind Mounts |
| - | - | - |
| Host Location	| Docker chooses	| You control |
| Mount Example (using -v)	| my-volume:/usr/local/data	| /path/to/ data:/usr/local/data |
| Populates(填充) new volume with container contents	| Yes | No |
| Supports Volume Drivers | Yes | No |

为了运行容器以支持开发工作流，我们将执行以下操作:
- 将源代码挂载到容器中
- 安装所有依赖项，包括“ dev”依赖项
- 启动 nodemon 监视文件系统的更改

```bash
# 确保没有运行任何之前的getting-started启动容器。

# 运行以下命令，之后我们将解释发生了什么:
docker run -dp 3000:3000 \
  -w /app -v "$(pwd):/app" \
  node:12-alpine \
  sh -c "yarn install && yarn run dev"
# 如果你正在使用 PowerShell，那么使用下面的命令:
docker run -dp 3000:3000 `
  -w /app -v "$(pwd):/app" `
  node:12-alpine `
  sh -c "yarn install && yarn run dev"
# -dp 3000:3000 -和以前一样。在分离(背景)模式下运行并创建一个端口映射
# -w /app -设定「工作目录」或指令运行的工作目录
# -v "$(pwd):/app" -将工作目录从容器中的主机挂载到/app目录
# node:12-alpine -要使用的镜像。注意，这是来自 Dockerfile 的为我们的app的基本镜像
# sh -c "yarn install && yarn run dev" -启动一个 shell 使用sh (alpine doesn’t have bash),开始了nodemon

# 查看日志
docker logs -f <container-id>
# 查看完日志后，按 Ctrl + c 退出

# 现在，让我们改变一下这个应用程序。在 src/static/js/app.js 文件中，让我们将“ Add Item”按钮更改为只说“ Add”。这个更改将在第109行:
- {submitting ? 'Adding...' : 'Add Item'}
+ {submitting ? 'Adding...' : 'Add'}

# 只需刷新页面(或打开页面) ，你就会立即看到浏览器中反映的变化。Node 服务器重新启动可能需要几秒钟，因此如果出现错误，只需尝试几秒钟后刷新。

# 你可以自由地做任何其他你想做的改变。完成后，停止容器并使用 docker build-t getting-started .构建新镜像。
docker build -t getting-started .
```

对于本地开发设置，使用绑定挂载是非常常见的。优点是开发机器不需要安装所有的构建工具和环境。使用一个 docker 运行命令，就可以拉动开发环境并准备运行。我们将在以后的步骤中讨论 Docker Compose，因为这将有助于简化命令(我们已经获得了很多标志)。

### Multi container apps

到目前为止，我们一直在使用单容器应用程序。但是，我们现在想要将 MySQL 添加到应用程序堆栈中。经常会出现这样的问题: “ MySQL 将在哪里运行？把它安装在同一个容器里，还是分开运行?”一般来说，每个容器都应该做好一件事。原因如下:
- 您有可能必须以不同于数据库的方式扩展 api 和前端
- 单独的容器使您可以独立地对版本进行版本和更新
- 虽然您可以在本地对数据库使用容器，但是您可能希望在生产环境中对数据库使用托管服务。那么，你不会希望将数据库引擎与应用程序一起发布
- 运行多个进程将需要一个进程管理器(容器只启动一个进程) ，这增加了容器启动/关闭的复杂性

请记住，默认情况下，容器是独立运行的，不知道同一台机器上的其他进程或容器的任何信息。那么，我们如何允许一个容器与另一个容器通话呢？答案是建立network。现在，你不必是一个网络工程师(万岁!).记住这条规则... ..。

:::warning 注意
如果两个容器在同一个网络上，它们可以互相通信，如果不是，它们就不能通信。
:::

在网络上放置容器有两种方法: 1)在开始时分配它; 2)连接现有的容器。现在，我们将首先创建网络并在启动时附加 MySQL 容器。

```bash
# 创建网络。
docker network create todo-app

# 启动一个 MySQL 容器并将其附加到网络上。我们还将定义一些环境变量，数据库将使用这些环境变量来初始化数据库
docker run -d \
  --network todo-app --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:5.7
# 如果您正在使用 PowerShell，那么使用这个命令。
docker run -d `
  --network todo-app --network-alias mysql `
  -v todo-mysql-data:/var/lib/mysql `
  -e MYSQL_ROOT_PASSWORD=secret `
  -e MYSQL_DATABASE=todos `
  mysql:5.7
# 您会注意到，我们在这里使用了一个名为 todo-MySQL-data 的卷，并将其挂载到/var/lib/MySQL，这是 MySQL 存储数据的地方。但是，我们从未运行过 docker volume create 命令。Docker 意识到我们想要使用一个命名卷，并自动为我们创建一个。

# 要确认数据库已经建立并运行，请连接到数据库并验证其连接。
docker exec -it <mysql-container-id> mysql -u root -p

# 当密码提示出现时，键入 secret。在 MySQL shell 中，列出数据库并验证是否看到 todos 数据库。
mysql> SHOW DATABASES;
```

现在我们知道 MySQL 已经启动并运行了，让我们使用它吧！但问题是... 怎么做？如果我们在同一个网络上运行另一个容器，我们如何找到容器(记住每个容器都有自己的 IP 地址) ？

为了解决这个问题，我们将使用 [nicolaka/netshoot](https://github.com/nicolaka/netshoot) 容器，它提供了许多工具，这些工具对于故障排除或调试网络问题非常有用。

```bash
# 使用 nicolaka/netshoot 镜像启动一个新容器，确保它连接到同一个网络。

docker run -it --network todo-app nicolaka/netshoot

# 在容器内部，我们将使用 dig 命令，这是一个有用的 DNS 工具。我们将查找主机名 mysql 的 IP 地址。
dig mysql
```

在“ ANSWER SECTION”中，您将看到 mysql 的 a 记录解析为172.23.0.2(您的 IP 地址很可能具有不同的值)。虽然 mysql 通常不是一个有效的主机名，但 Docker 可以将其解析为具有该网络别名的容器的 IP 地址(还记得我们前面使用的 -- network-alias 标志吗?).

这意味着... 我们的应用程序只需要连接到一个名为 mysql 的主机，它就会与数据库通话！没有比这更简单的了！

这个 todo 应用程序支持设置一些环境变量来指定 MySQL 连接设置，它们是:
- `MYSQL_HOST` -运行的 MySQL 服务器的主机名
- `MYSQL_USER` -用于连接的用户名
- `MYSQL_PASSWORD` -连接所需的密码
- `MYSQL_DB` -连接后要使用的数据库

解释了所有这些之后，让我们开始我们的开发准备容器！
```bash
# 我们将指定上面的每个环境变量，并将容器连接到我们的应用程序网络。
docker run -dp 3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:12-alpine \
  sh -c "yarn install && yarn run dev"
# 如果您正在使用 PowerShell，那么使用这个命令。
docker run -dp 3000:3000 `
  -w /app -v "$(pwd):/app" `
  --network todo-app `
  -e MYSQL_HOST=mysql `
  -e MYSQL_USER=root `
  -e MYSQL_PASSWORD=secret `
  -e MYSQL_DB=todos `
  node:12-alpine `
  sh -c "yarn install && yarn run dev"

# 查看容器的日志
docker logs < container-id >

# 在你的浏览器中打开应用程序，在你的待办事项列表中添加一些项目。

# 连接到 mysql 数据库，并证明这些项目正被写入数据库。记住，密码是保密的。
docker exec -it <mysql-container-id> mysql -p todos

# 在 mysql shell 中，运行以下命令:
mysql> select * from todo_items;
```
如果你快速浏览一下 Docker Dashboard，你会发现我们有两个正在运行的应用程序容器。但是，并没有真正的迹象表明他们被集中在一个单一的应用程序中。我们很快就会知道如何让它变得更好！

### Use Docker Compose

Dockercompose 是一个开发用于帮助定义和共享多容器应用程序的工具。通过 Compose，我们可以创建一个 YAML 文件来定义服务，并且只需一个命令，就可以将所有东西旋转或拆卸。

使用 Compose 的最大优点是，您可以在文件中定义应用程序堆栈，将其保存在项目仓库的根目录(现在是版本控制)中，并且很容易让其他人为您的项目贡献内容。有人只需要克隆你的回购和启动撰写应用程序。事实上，您可能会在 GitHub/GitLab 上看到相当多的项目正在这样做。

如果您为 Windows 或 Mac 安装了 Docker 桌面/工具箱，那么您已经有了 Docker Compose！Play-with-Docker 实例也已经安装了 dockercompose。如果您使用的是 Linux 机器，则需要安装 dockercompose。

```bash
# 安装后，您应该能够运行以下命令并查看版本信息。
docker-compose version
```

- Create the Compose file:

```yaml
# 在 app 项目的根目录下，创建一个名为 docker-compose.yml 的文件。

# 在撰写文件中，我们将从定义模式版本开始。在大多数情况下，最好使用最新支持的版本。您可以查看当前模式版本的 Compose 文件引用和兼容性矩阵。
version: "3.7"

# 接下来，我们将定义要作为应用程序的一部分运行的服务(或容器)列表。
version: "3.7"

services:
```

现在，我们开始每次将一个服务迁移到compose文件中。

- Define the app service

```bash
# 记住，这是我们用来定义应用程序容器的命令。
docker run -dp 3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:12-alpine \
  sh -c "yarn install && yarn run dev"
# 如果您正在使用 PowerShell，那么使用这个命令。
docker run -dp 3000:3000 `
  -w /app -v "$(pwd):/app" `
  --network todo-app `
  -e MYSQL_HOST=mysql `
  -e MYSQL_USER=root `
  -e MYSQL_PASSWORD=secret `
  -e MYSQL_DB=todos `
  node:12-alpine `
  sh -c "yarn install && yarn run dev"
```

```yaml
# 首先，让我们为容器定义服务条目和镜像。我们可以为这项服务选择任何名称。该名称将自动成为网络别名，这在定义 MySQL 服务时非常有用。
version: "3.7"
services:
  app:
    image: node:12-alpine

# 通常，您将在镜像定义附近看到该命令，尽管不要求排序。所以，让我们继续前进，并把它移到我们的文件。
version: "3.7"
services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"

# 让我们通过定义服务的端口来迁移命令的-p 3000:3000部分。这里我们将使用简短的语法，但是还有一个更加冗长的长语法可用。
version: "3.7"
services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000

# 接下来，我们将使用 working_dir 和 volumes 定义来迁移工作目录文件(-w/app)和卷映射(-v“ $(pwd):/app”)。卷也有短语法和长语法。
# Docker Compose volume definitions的一个优点是我们可以使用工作目录的相对路径。
version: "3.7"
services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app

# 最后，我们需要使用环境键来迁移环境变量定义。
version: "3.7"
services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos
```

```bash
# 现在，是时候定义 MySQL 服务了:
docker run -d \
  --network todo-app --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:5.7
# 如果您正在使用 PowerShell，那么使用这个命令。
docker run -d `
  --network todo-app --network-alias mysql `
  -v todo-mysql-data:/var/lib/mysql `
  -e MYSQL_ROOT_PASSWORD=secret `
  -e MYSQL_DATABASE=todos `
  mysql:5.7
```



```yaml
# 我们将首先定义新的服务并将其命名为 mysql，这样它就会自动获得网络别名。我们将继续并指定要使用的镜像。
version: "3.7"
services:
  app:
    # The app service definition
  mysql:
    image: mysql:5.7

# 接下来，我们将定义卷映射。当用 docker 运行容器时，将自动创建指定的卷。但是，在使用 Compose 运行的时候就不会发生这种情况。我们需要在顶级卷: 节中定义卷，然后在服务配置中指定挂载点。通过只提供卷名，就可以使用默认选项。不过还有更多的选择。
version: "3.7"
services:
  app:
    # The app service definition
  mysql:
    image: mysql:5.7
    volumes:
      - todo-mysql-data:/var/lib/mysql
volumes:
  todo-mysql-data:

# 最后，我们只需要指定环境变量。
version: "3.7"
services:
  app:
    # The app service definition
  mysql:
    image: mysql:5.7
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos
volumes:
  todo-mysql-data:
```

此时，我们的完整 docker-compose. yml 应该是这样的:

```yaml
version: "3.7"

services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:5.7
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

现在我们有了 `docker-compose.yml` 文件，就可以启动它了！

```bash
# 确保没有其他的 app/db 副本首先运行(docker ps 和 docker rm-f < ids >)。

# 使用 docker-compose up 命令启动应用程序堆栈。我们将添加-d 标志来运行后台的所有内容。
docker-compose up -d
# 您会注意到，卷是创建以及网络！默认情况下，Docker Compose 会自动为应用程序堆栈创建一个网络(这就是为什么我们没有在 Compose 文件中定义一个网络)。

# 查看日志 -f follows
docker-compose logs -f
# 您将看到来自每个服务的日志交叉存储到单个流中。当您想要观察与时间相关的问题时，这是非常有用的。-f 标志“follows”日志，因此将在生成时给出实时输出。

# 查看特定服务的日志
docker-compose logs -f app
# 服务名显示在行首(通常是彩色的) ，以帮助区分消息。如果要查看特定服务的日志，可以将服务名添加到 logs 命令的末尾(例如，docker-compose logs-f app)。

# 在这一点上，你应该能够打开你的应用程序，看到它运行。嘿！我们只剩下一个命令了！
```
:::warning 注意
当应用程序启动时，它实际上是坐着等待 MySQL 启动并准备好，然后再尝试连接到它。在启动另一个容器之前，Docker 没有任何内置支持来等待另一个容器完全启动、运行和准备就绪。对于基于节点的项目，可以使用等待端口依赖项。其他语言/框架也有类似的项目。
:::

当你准备撕毁它所有，只需运行 `docker-compose down` 或击中 Docker Dashboard 的垃圾桶为整个应用程序。容器将停止，网络将被删除。

:::warning 注意
Removing Volumes
默认情况下，在运行 docker-compose 时，撰写文件中的已命名卷不会被删除。如果要删除卷，则需要添加 -- volume 标志。
当你删除应用程序堆栈时，Docker Dashboard 不会删除卷。
:::

一旦被拆除，您可以切换到另一个项目，运行 docker-compose up 并准备为该项目做出贡献！没有比这更简单的了！

### Image-building best practices

当您已经构建了一个镜像时，最好使用 docker scan 命令对其进行扫描以发现安全漏洞。与 snyder 合作提供漏洞扫描服务。

```bash
# 例如，要扫描本教程前面创建的 getting-started 镜像，只需键入
docker scan getting-started
```

你知道你可以看到是什么构成了一个镜像吗？使用 docker image history 命令，您可以看到用于在镜像中创建每个图层的命令。

```bash
# 使用 docker image history 命令查看教程前面创建的 getting-started 镜像中的图层。
docker image history getting-started
# 每行代表镜像中的一个图层。使用这个，您还可以快速查看每个图层的大小，帮助诊断大镜像。

# 您将注意到有几行被截断了。如果添加 --no-trunk 标志，就会得到完整的输出
docker image history --no-trunc getting-started
```

让我们看看我们再次使用的 Dockerfile..。

```dockerfile
# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

回到镜像历史输出，我们可以看到 Dockerfile 中的每个命令都成为镜像中的一个新层。您可能还记得，当我们对镜像进行更改时，必须重新安装纱线依赖项。有办法解决这个问题吗？每次构建时都围绕着相同的依赖关系发布并没有多大意义，对吧？

为了解决这个问题，我们需要重新构造 Dockerfile 来帮助支持依赖项的缓存。对于基于 node 的应用程序，这些依赖项在 package.json 文件中定义。那么，如果我们首先只复制这个文件，安装依赖项，然后复制到其他所有文件中，又会怎样呢？然后，只有在 package.json 发生更改时，我们才重新创建对纱线的依赖关系。有意义吗？

1. 首先将 Dockerfile 更新到 `package.json` 中，安装依赖项，然后将其他所有内容复制到 `package.json` 中。
```dockerfile
# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD ["node", "src/index.js"]
```
2. 在与 Dockerfile 相同的文件夹中创建一个名为 `.dockerignore` 的文件，其内容如下。
```dockerfile
node_modules
```
3. 使用 `docker Build` 构建一个新的镜像。
```bash
docker build -t getting-started .
```
4. 现在，对 `src/static/index.html` 文件进行修改(比如将 < title > 改为“ The Awesome Todo App”)。
5. 现在使用 `docker build -t getting-started .` 构建镜像。再一次。这一次，您的输出应该看起来有些不同。

在构建 React 应用程序时，我们需要一个 Node 环境来编译 JS 代码(通常是 JSX)、 SASS 样式表，以及更多的静态 HTML、 JS 和 CSS。如果我们不进行服务器端渲染，我们甚至不需要生产构建所需的 Node 环境。为什么不将静态资源装运到静态 nginx 容器中呢？

```dockerfile
# syntax=docker/dockerfile:1
FROM node:12 AS build
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```
这里，我们使用一个 node: 12 image 来执行构建(最大化层缓存) ，然后将输出复制到 nginx 容器中

## Language-specific guides (New)

### Node.js

让我们创建一个简单的 Node.js 应用程序作为示例。在本地计算机中创建一个名为 node-docker 的目录，并按照下面的步骤创建一个简单的 REST API。

```bash
cd [path to your node-docker directory]
npm init -y
npm add ronin-server ronin-mocks
# touch server.js
type nul>server.js
```
现在，让我们添加一些代码来处理 REST 请求。我们将使用一个模拟服务器，这样我们就可以专注于对应用程序进行 Dockerizing。

在 IDE 中打开这个工作目录文件，并将下面的代码添加到 server.js 文件中。
```js
const ronin = require( 'ronin-server' )
const mocks = require( 'ronin-mocks' )

const server = ronin.server()

server.use( '/', mocks.server( server.Router(), false, true ) )
server.start()
```
这个模拟服务器名为 Ronin.js，默认情况下会在端口8000上监听。您可以向根(/)端点发出 POST 请求，发送到服务器的任何 JSON 结构都将保存在内存中。您还可以向相同的端点发送 GET 请求，并接收您以前张贴的 JSON 对象数组。

让我们启动应用程序，并确保它正常运行。打开你的终端，导航到你创建的工作目录。

```bash
node server.js
```
为了测试应用程序是否正常工作，我们首先将一些 JSON 发布到 API，然后发出 GET 请求，查看数据是否已经保存。打开一个新的终端并运行以下 curl 命令:
```bash
curl --request POST --url http://localhost:8000/test --header 'content-type: application/json' --data '{"msg": "testing" }'

curl http://localhost:8000/test
```

切换回运行服务器的终端。现在您应该可以在服务器日志中看到以下请求。
```bash
2020-XX-31T16:35:08:4260  INFO: POST /test
2020-XX-31T16:35:21:3560  INFO: GET /test
```
Dockerfile 是一个文本文档，其中包含用户可以在命令行上调用的所有命令来组装镜像。当我们告诉 Docker 通过执行 Docker build 命令来构建我们的镜像时，Docker 读取这些指令并逐个执行它们，最后创建一个 Docker 镜像。

让我们逐步了解为应用程序创建 Dockerfile 的过程。在你的工作目录文件夹的根目录下，创建一个名为 Dockerfile 的文件，并在文本编辑器中打开这个文件。

要添加到 Dockerfile 的第一行是 # syntax parser 指令。虽然这个指令是可选的，但它指示 Docker 构建器在解析 Dockerfile 时使用什么语法，并允许使用 BuildKit 的旧版本在开始构建之前升级解析器。解析器指令必须出现在 Dockerfile 中的任何其他注释、空格或 Dockerfile 指令之前，应该是 Dockerfiles 的第一行。

要添加到 Dockerfile 的第一行是 # syntax parser 指令。虽然这个指令是可选的，但它指示 Docker 构建器在解析 Dockerfile 时使用什么语法，并允许使用 BuildKit 的旧版本在开始构建之前升级解析器。解析器指令必须出现在 Dockerfile 中的任何其他注释、空格或 Dockerfile 指令之前，应该是 Dockerfiles 的第一行。
```dockerfile
# syntax=docker/dockerfile:1
```
我们建议使用 docker/dockerfile: 1，它总是指向版本1语法的最新版本。BuildKit 会在构建之前自动检查语法更新，确保您使用的是最新版本。

接下来，我们需要在 Dockerfile 中添加一行，告诉 Docker 我们希望为应用程序使用什么基本镜像。
```dockerfile
# syntax=docker/dockerfile:1

FROM node:12.18.1
```
当我们使用 FROM 命令时，我们告诉 Docker 在我们的镜像中包含来自节点的所有功能: 12.18.1 image

`NODE _ env` 环境变量指定了应用程序运行的环境(通常是开发或生产环境)。要提高性能，最简单的方法之一就是将 `node_env` 设置为 `production` 。
```dockerfile
ENV NODE_ENV=production
```
为了在运行剩下的命令时让事情变得更简单，让我们创建一个工作目录。这指示 Docker 使用此路径作为所有后续命令的默认位置。这样我们就不必输入完整的文件路径，而是可以使用基于工作目录的相对路径。
```dockerfile
WORKDIR /app
```
在运行 `npm install` 之前，我们需要获得 `package.json` 和 `package-lock`。把 json 文件放进我们的镜像里。我们使用 COPY 命令来实现这一点。`COPY` 命令有两个参数。第一个参数告诉 Docker 希望将哪些文件复制到镜像中。第二个参数告诉 Docker 您希望将该文件复制到何处。我们会复制 `package.json` 和 `package-lock` 。将 json 文件输入我们的工作目录 `/app`。
```dockerfile
COPY ["package.json", "package-lock.json*", "./"]
```
一旦我们在镜像中有了` package.json` 文件，我们就可以使用 `RUN` 命令执行命令 npm install。这与我们在机器上本地运行 npm install 的工作方式完全相同，但是这次这些 Node 模块将被安装到镜像中的 `node_modules` 目录中。
```dockerfile
RUN npm install --production
```
现在，我们有了一个基于节点版本12.18.1的镜像，并且我们已经安装了依赖项。接下来我们需要做的是将源代码添加到镜像中。我们将使用 COPY 命令，就像我们对上面的 `package.json` 文件所做的那样。
```dockerfile
COPY . .
```
复制命令获取工作目录中的所有文件并将它们复制到镜像中。现在，我们所要做的就是告诉 Docker 当镜像在容器中运行时，我们要运行什么命令。我们使用 CMD 命令完成此操作。
```dockerfile
CMD [ "node", "server.js" ]
```
下面是完整的 Dockerfile。
```dockerfile
# syntax=docker/dockerfile:1

FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "server.js" ]
```

Create a .dockerignore file:

要在构建上下文中使用文件，Dockerfile 引用指令中指定的文件，例如 COPY 指令。若要提高生成的性能，请通过添加 `.dockerignore` 文件移到上下文目录。若要改进上下文加载时间，请创建。文件中添加 `node_modules` 目录。
```dockerfile
node_modules
```
现在我们已经创建了 Dockerfile，让我们来构建我们的镜像。为此，我们使用 `docker build` 命令。Build 命令可以选择使用 `--tag` 标志。标记用于设置镜像的名称和格式为`“name: tag”`的可选标记。为了简化问题，我们暂时不使用可选的“标记”。如果没有传递标记，Docker 将使用“latest”作为其默认标记。您将在构建输出的最后一行中看到这一点。

让我们构建第一个 Docker 镜像。

```bash
docker build --tag node-docker .
```

查看本地图片:
```bash
docker images
```
镜像由清单和层列表组成。简单地说，“标签”指向这些工件的组合。您可以为一个镜像设置多个标记。让我们为构建的镜像创建第二个标记，并查看其图层。

要为上面构建的镜像创建新标记，请运行以下命令。
```bash
docker tag node-docker:latest node-docker:v1.0.0
```
Docker 标记命令为镜像创建一个新标记。它不会创建一个新的镜像。标记指向相同的镜像，只是引用镜像的另一种方式。

移除刚才创建的标记。为此，我们将使用 `rmi` 命令。rmi 命令代表“remove image”。
```bash
docker rmi node-docker:v1.0.0
```
请注意，Docker 的回复告诉我们，镜像没有被删除，只是“未标记”。通过运行 images 命令来验证这一点。

容器是一个正常的操作系统进程，除了这个进程是独立的，并且有自己的文件系统、自己的网络和独立于主机的独立进程树。

要在容器中运行映像，我们使用 docker run 命令。Docker run 命令需要一个参数，即图像名称。让我们开始我们的图像，并确保它正确运行。在终端中执行以下命令。
```bash
docker run node-docker

# 为了发布容器的端口，我们将在 docker run 命令上使用 -- publish 标志(简称-p)。--publish 命令的格式是[ host port ] : [ container port ]。因此，如果我们希望将容器内的 port 8000暴露到容器外的 port 3000，我们将传递3000:8000到 --publish 标志。
# docker run --publish 8000:8000 node-docker
```
运行此命令时，您将注意到没有返回到命令提示符。这是因为我们的应用程序是一个 REST 服务器，它将在循环中运行，等待传入的请求，而不将控制返回到操作系统，直到容器停止。

让我们打开一个新的终端，然后使用 curl 命令向服务器发出 GET 请求。
```bash
curl --request POST \
  --url http://localhost:8000/test \
  --header 'content-type: application/json' \
  --data '{
	"msg": "testing"
}'
```

到目前为止，这是很好的，但是我们的示例应用程序是一个 web 服务器，我们不应该让我们的终端连接到容器。Docker 可以在分离模式或后台运行容器。为此，我们可以使用 --detach 或简称-d。docker尔将启动您的容器与以前相同，但这一次将“分离”从容器和返回到终端提示符。
```bash
docker run -d -p 8000:8000 node-docker
```
docker在背景中启动我们的容器，并在码头上打印容器 ID。

同样，让我们确保容器正常运行。
```bash
curl --request POST \
  --url http://localhost:8000/test \
  --header 'content-type: application/json' \
  --data '{
	"msg": "testing"
}'
```
您可能想知道我们集装箱的名字是从哪里来的。由于在启动容器时没有为它提供名称，因此 Docker 生成了一个随机名称。我们马上就能解决这个问题，但首先我们需要停下集装箱。要停止容器，运行 docker stop 命令，这样做可以停止容器。您将需要传递容器的名称，或者您可以使用容器 id。

```bash
docker stop [container name | container id]
```
可以启动、停止和重新启动 Docker 容器。当我们停止一个容器时，它不会被删除，但是状态会被更改为停止，并且容器内的进程会被停止。当我们运行 `docker ps` 命令时，默认输出是只显示正在运行的容器。如果我们传递 `--all` 或简称 `-a`，我们将看到系统上的所有容器，无论它们是停止还是启动。
```bash
docker ps -a
```

让我们重新启动刚刚停止的容器。找到我们刚刚停止的容器的名称，并在 restart 命令中替换下面的容器名称。

```bash
docker restart wonderful_kalam
```

要删除容器，只需运行传递容器名称的 `docker rm` 命令。可以在一个命令中将多个容器名传递给该命令。
```bash
docker rm wonderful_kalam agitated_moser goofy_khayyam
```

要命名一个容器，我们只需要将 -- name 标志传递给 run 命令。
```bash
docker run -d -p 8000:8000 --name rest-server node-docker
```

在容器中运行 MongoDB 之前，我们希望创建几个卷，Docker 可以管理这些卷来存储持久化数据和配置。让我们使用 docker 提供的托管卷特性，而不是使用绑定挂载。

现在让我们创建卷，一个用于数据，一个用于 MongoDB 的配置。
```bash
docker volume create mongodb
docker volume create mongodb_config
```

现在，我们将创建一个网络，我们的应用程序和数据库将使用这个网络相互通信。这个网络被称为用户定义的网桥网络，它提供了一个很好的 DNS 查找服务，我们可以在创建连接字符串时使用它。
```bash
docker network create mongodb
```

现在我们可以在容器中运行 MongoDB，并附加到我们上面创建的卷和网络。Docker 将从 Hub 中提取映像并在本地运行它。
```bash
docker run -it --rm -d -v mongodb:/data/db \
  -v mongodb_config:/data/configdb -p 27017:27017 \
  --network mongodb \
  --name mongodb \
  mongo
`1`

好了，现在我们有了一个正在运行的 MongoDB，让我们更新 server.js 来使用 MongoDB 而不是内存中的数据存储。
```js
const ronin     = require( 'ronin-server' )
const mocks     = require( 'ronin-mocks' )
const database  = require( 'ronin-database' )
const server = ronin.server()

database.connect( process.env.CONNECTIONSTRING )
server.use( '/', mocks.server( server.Router(), false, false ) )
server.start()
```

我们添加了 ronin-database 模块，并更新了连接到数据库的代码，并将内存中的标志设置为 false。我们现在需要重建我们的形象，以便它包含我们的变化。

首先，让我们使用 npm 将 ronin-database 模块添加到应用程序中。
```bash
npm install ronin-database
```

现在我们可以建立我们的形象了。
```bash
docker build --tag node-docker .
```

现在，我们来检查一下我们的集装箱。但是这次我们需要设置 CONNECTIONSTRING 环境变量，这样我们的应用程序就知道使用什么连接字符串来访问数据库。我们将在 docker run 命令中执行此操作。
```bash
docker run \
  -it --rm -d \
  --network mongodb \
  --name rest-server \
  -p 8000:8000 \
  -e CONNECTIONSTRING=mongodb://mongodb:27017/yoda_notes \
  node-docker
```

让我们测试一下我们的应用程序是否已连接到数据库，并且能够添加注释。
```bash
curl --request POST \
  --url http://localhost:8000/notes \
  --header 'content-type: application/json' \
  --data '{
    "name": "this is a note",
    "text": "this is a note that I wanted to take while I was working on writing a blog post.",
    "owner": "peter"
  }'
```

在本节中，我们将创建一个 Compose 文件，用一个命令启动 node-docker 和 MongoDB。我们还将设置 Compose 文件以调试模式启动节点 docker，以便将调试器连接到正在运行的节点进程。

在 IDE 或文本编辑器中打开 notes-service 并创建一个名为 `docker-compose.dev.yml`.将下面的命令复制并粘贴到文件中。
```yaml
version: '3.8'

services:
  notes:
    build:
    context: .
    ports:
    - 8000:8000
    - 9229:9229
    environment:
    - SERVER_PORT=8000
    - CONNECTIONSTRING=mongodb://mongo:27017/notes
    volumes:
    - ./:/app
    command: npm run debug

  mongo:
    image: mongo:4.2.8
    ports:
    - 27017:27017
    volumes:
    - mongodb:/data/db
    - mongodb_config:/data/configdb
volumes:
  mongodb:
  mongodb_config:
```

这个撰写文件非常方便，因为我们不必键入所有参数传递给 dockerrun 命令。我们可以在 Compose 文件中以声明方式完成此操作。

我们公开 `port 9229`，以便附加调试器。我们还将本地源代码映射到正在运行的容器中，这样我们就可以在文本编辑器中进行更改，并将这些更改提取到容器中

使用 Compose 文件的另一个非常酷的特性是，我们设置了服务解析来使用服务名称。所以我们现在可以在连接字符串中使用`“mongo”`。我们使用 mongo 的原因是，我们在 Compose 文件中将 MongoDB 服务命名为“mongo”。

要在调试模式下启动应用程序，我们需要在 `package.json` 文件中添加一行代码来告诉 npm 如何在调试模式下启动应用程序。

打开 package.json 文件，在 scripts 部分添加以下行:
```json
"debug": "nodemon --inspect=0.0.0.0:9229 server.js"
```

如你所见，我们将使用 nodemon。Nodemon 以调试模式启动服务器，并监视已更改的文件，然后重新启动服务器。让我们在终端中运行以下命令，将 nodemon 安装到我们的项目目录中。
```bash
npm install nodemon
```

让我们启动应用程序并确认它正常运行。
```bash
docker-compose -f docker-compose.dev.yml up --build
```

我们传递 `--build` 标志，这样 Docker 将编译我们的映像，然后启动它。

现在让我们测试一下 API 端点，运行下面的 curl 命令:
```bash
curl --request GET --url http://localhost:8000/notes
```

我们将使用 Chrome 浏览器附带的调试器。在你的电脑上打开 Chrome，然后在地址栏输入以下内容。
```http
about:inspect
```

单击 `Open devilded DevTools for Node` 链接。这将打开连接到容器中正在运行的 Node.js 进程的 DevTools。

让我们更改源代码，然后设置一个断点。在现有 `server.use()` 语句之上添加以下代码，并保存文件。
```js
server.use( '/foo', (req, res) => {
  return res.json({ "foo": "bar" })
})
```

如果您查看运行 Compose 应用程序的终端，您将看到 nodemon 注意到了这些更改并重新加载了应用程序。

返回到 chromedevtools 并在包含 `return res.json ({“ foo”: “ bar”})` 语句的行上设置断点，然后运行以下 curl 命令触发断点。
```bash
curl --request GET --url http://localhost:8000/foo
```

您应该已经看到代码在断点处停止，现在可以像通常一样使用调试器了。您可以检查和监视变量、设置条件断点、视图堆栈跟踪等。

让我们在应用程序中的./test 目录中定义一个 Mocha 测试。
```bash
mkdir -p test
```

将下面的代码保存到 `./test/test.js` 中。
```js
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

让我们构建我们的 Docker 映像，并确认一切正常运行。运行以下命令在容器中生成并运行 Docker 映像。
```bash
docker-compose -f docker-compose.dev.yml up --build
```

现在，让我们通过 post 一个 JSON 有效负载来测试我们的应用程序，然后发出一个 http get 请求，以确保正确地保存了 JSON。
```bash
curl --request POST \
  --url http://localhost:8000/test \
  --header 'content-type: application/json' \
  --data '{
    "msg": "testing"
  }'
```

现在，对同一端点执行 GET 请求，以确保正确保存和检索 JSON 有效负载。
```bash
curl http://localhost:8000/test
```

运行以下命令安装 Mocha 并将其添加到开发者依赖项中:
```bash
npm install --save-dev mocha
```

好了，现在我们知道应用程序运行正常，让我们尝试在容器中运行测试。我们将使用与上面使用的同一个 docker run 命令，但是这一次，我们将使用 npm run 测试覆盖容器中的 CMD。这将调用 package.json 文件中“ script”部分下的命令。见下文。
```json
{
...
  "scripts": {
    "test": "mocha ./**/*.js",
    "start": "nodemon --inspect=0.0.0.0:9229 server.js"
  },
...
}
```

下面是启动容器和运行测试的 Docker 命令:
```bash
docker-compose -f docker-compose.dev.yml run notes npm run test
```

除了在命令上运行测试外，我们还可以使用多阶段 Dockerfile 在构建映像时运行测试。下面的 Dockerfile 将运行我们的测试并构建我们的生产映像。
```dockerfile
# syntax=docker/dockerfile:1
FROM node:14.15.4 as base

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base as test
RUN npm ci
COPY . .
CMD [ "npm", "run", "test" ]

FROM base as prod
RUN npm ci --production
COPY . .
CMD [ "node", "server.js" ]
```

我们首先添加一个标签 `as base` 到 `FROM node: 14.15.4` 语句。这允许我们在其他构建阶段中引用这个构建阶段。接下来我们添加一个新的构建阶段，标记为 test。我们将使用这个阶段来运行测试。

现在让我们重新构建映像并运行测试。我们将运行与上面相同的 docker build 命令，但是这次我们将添加 `--target test` 标志，以便我们专门运行测试构建阶段。
```bash
docker build -t node-docker --target test .
```

现在已经构建了测试映像，我们可以在容器中运行它，看看我们的测试是否通过。
```bash
docker run -it --rm -p 8000:8000 node-docker
```

这很好，但是目前我们必须运行两个 docker 命令来构建和运行我们的测试。我们可以通过在测试阶段使用 RUN 语句代替 CMD 语句来稍微改进这一点。CMD 语句不会在构建映像期间执行，而是在容器中运行映像时执行。使用 RUN 语句时，我们的测试将在构建映像期间运行，并在构建失败时停止构建。
```dockerfile
# syntax=docker/dockerfile:1
FROM node:14.15.4 as base

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base as test
RUN npm ci
COPY . .
RUN npm run test

FROM base as prod
RUN npm ci --production
COPY . .
CMD [ "node", "server.js" ]
```

现在要运行我们的测试，我们只需要像上面那样运行 docker build 命令。
```bash
docker build -t node-docker --target test .
```

### Python





















































