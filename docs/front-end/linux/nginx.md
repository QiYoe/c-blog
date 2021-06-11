---
title: Nginx配置详解
head:
  - - meta
    - name: description
      content: Nginx配置详解
  - - meta
    - name: keywords
      content: Linux Ubuntu CentOS Nginx Nginx配置
---

## 为什么Nginx？

[Nginx官网](http://nginx.org/en/)

[Nginx文档官网](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)

官方版：Nginx时轻量级Web服务器，它不仅时一个高性能的HTTP和反向代理服务器，同时也是一个IMAP/POPS/SMTP代理服务器。

通俗版：轻量、简单、流行

## 安装

### CentOS（安装nginx预生成包版）

两种安装方式：

- Installing a Prebuilt CentOS/RHEL Package from an OS Repository（使用yum更新源安装）

```bash
# 安装 EPEL 存储库
sudo yum install epel-release

# 更新存储库
sudo yum update

# 安装 NGINX 开放源码
sudo yum install nginx

# 验证安装
sudo nginx -v
```

- Installing a Prebuilt CentOS/RHEL Package from the Official NGINX Repository（源码直接编译之后安装）

```bash
# 通过在/etc/yum.repop.d 中创建 nginx.repo 文件，为 CentOS 设置 yum 存储库，例如使用 vi
sudo vi /etc/yum.repos.d/nginx.repo

# 在 nginx.repo 中添加以下行
[nginx]
name=nginx repo
baseurl=https://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1

# 保存更改并退出 vi (按 ESC 并在提示符处:键入 wq)

# 更新存储库
sudo yum update

# 启动NGINX
sudo nginx

# 确认 NGINX 开放源码已经启动并运行
curl -I 127.0.0.1
```

### Ubuntu（安装nginx预生成包版）

两种安装方式：

- Installing a Prebuilt Ubuntu Package from an Ubuntu Repository（使用apt-get更新源安装）

```bash
# 更新 Ubuntu 存储库
sudo apt-get update

# 安装软件包
sudo apt-get install nginx

# 验证安装
sudo nginx -v
```

- Installing a Prebuilt Ubuntu Package from the Official NGINX Repository（源码直接编译之后安装）

要为稳定版 nginx 包设置合适的存储库，运行以下命令：

```bash
# 下载用于签署 NGINX 包和存储库的密钥，并将其添加到 apt 程序的密钥环
sudo wget https://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key

# 编辑/etc/apt/source.list 文件，例如使用 vi
sudo vi /etc/apt/sources.list

# 添加这些行 Source.list 来命名可以获得 NGINX 开放源码的存储库
deb https://nginx.org/packages/mainline/ubuntu/ trusty nginx
deb-src https://nginx.org/packages/mainline/ubuntu/ trusty nginx

# 保存更改并退出 vi (按 ESC 并在提示符处:键入 wq)

# 安装 NGINX 开放源码
sudo apt-get install nginx

# 启动 NGINX
sudo nginx

# 确认 NGINX 开放源码已经启动并运行
curl -I 127.0.0.1
```

### 从源代码编译和安装（更灵活，安装操作也更繁琐，但后面使用非常便利）

```bash
# 安装依赖库

## PCRE-支持 NGINX 核心和重写模块所需的正则表达式
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.44.tar.gz
tar -zxf pcre-8.44.tar.gz
cd pcre-8.44
./configure
make
sudo make install

## Zlib-支持头部压缩。 NGINX Gzip 模块要求
wget http://zlib.net/zlib-1.2.11.tar.gz
tar -zxf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure
make
sudo make install

## OpenSSL-支持 HTTPS 协议。 NGINX SSL 模块和其他模块要求的
wget http://www.openssl.org/source/openssl-1.1.1g.tar.gz
tar -zxf openssl-1.1.1g.tar.gz
cd openssl-1.1.1g
./Configure darwin64-x86_64-cc --prefix=/usr
make
sudo make install

# 下载NGINX源码
wget https://nginx.org/download/nginx-1.19.0.tar.gz
tar zxf nginx-1.19.0.tar.gz
cd nginx-1.19.0

# 配置构建选项
./configure
--sbin-path=/usr/local/nginx/nginx
--conf-path=/usr/local/nginx/nginx.conf
--pid-path=/usr/local/nginx/nginx.pid
--with-pcre=../pcre-8.44
--with-zlib=../zlib-1.2.11
--with-http_ssl_module
--with-stream
--with-mail=dynamic
--add-module=/usr/build/nginx-rtmp-module
--add-dynamic-module=/usr/build/3party_module

# 编译并安装构建
make
sudo make install

# --prefix=<PATH> NGINX 文件的目录。默认值:/usr/local/nginx
# --sbin-path=<PATH> 可执行文件的名称。仅在安装过程中使用。默认值:<prefix>/sbin/nginx
# --conf-path=<PATH> NGINX 配置文件的名称。默认值:<prefix>conf/nginx.conf
# --pid-path=<PATH> NGINX 进程ID文件。默认值:<prefix>/logs/nginx.pid
# --with-pcre=<PATH> PCRE 库的源路径，该库需要在位置指令和重写模块中进行常规表达式支持。（支持location、rewrite功能）
# --with-zlib=<PATH> zlib 库的源路径，支持Gzip模块
# -- with-mail 启用邮件代理功能
# -- with-mail=dynamic 启用邮件代理功能，将其编译为一个单独的动态模块
# -- with-stream 开启TCP、UDP代理功能
# -- with-stream=dynamic 开启TCP、UDP代理功能，将其编译为一个单独的动态模块
# --with-http_ssl_module 支持HTTPS支持。需要SSL库，比如OpenSSL
# --add-module=<PATH> 静态链接模块：在编译时构建在 NGINX 开源中，并静态链接到 NGINX 二进制文件
# --add-dynamic-module=<PATH> 动态链接模块：运行时动态加载到 NGINX 开放源码
# with对应without：禁用模块

# 启动NGINX
nginx
```

## 在Docker上部署NGINX

### 在Docker上运行NGINX

```bash
# 启动运行在容器中的 NGINX 实例，使用缺省的 NGINX 配置，并执行以下命令
docker run --name mynginx1 -p 80:80 -d nginx
# mynginx1 是基于 NGINX 映像创建的容器的名称
# -d 选项指定容器以分离模式运行: 容器继续运行，直到停止，但不响应命令行上运行的命令
# -p 第一个参数指定 Docker 主机中的端口（nginx端口），第二个参数映射到容器中公开的端口（客户端端口）
# 该命令返回容器 ID 的长格式: fcd1fb01b14557c7c9d991238f2558ae2704d129cf9fb97bb4fadf673a58580d。这种形式的 ID 用于日志文件的名称。

# 验证容器是否已经创建并且正在使用
docker ps
```

### 管理内容和配置文件

- 在Doker主机上维护内容和配置文件

在创建容器时，可以将 Docker 主机上的本地目录挂载到容器中的目录中。NGINX 映像使用默认的 NGINX 配置，它使用/usr/share/NGINX/html 作为容器的根目录，并将配置文件放入/etc/NGINX 中。对于Docker主机内容在本地目录/var/www 中、配置文件在/var/nginx/conf 中的 Docker 主机，运行以下命令：

```bash
docker run --name mynginx2 --mount type=bind,source=/var/www,target=/usr/share/nginx/html,readonly --mount source=/var/nginx/conf,target=/etc/nginx/conf,readonly -p 80:80 -d nginx
```

对 Docker 主机上的本地目录/var/www 和/var/nginx/conf 中的文件所做的任何更改都反映在容器中的目录/usr/share/nginx/html 和/etc/nginx 中。Readonly 选项意味着只能在 Docker 主机上更改这些目录，而不能从容器内更改

- 从 Docker 主机复制内容和配置文件

在容器创建期间，Docker 可以从 Docker 主机上的本地目录复制内容和配置文件。一旦创建了一个容器，文件将通过在文件更改时创建一个新容器或通过修改容器中的文件来维护。

复制文件的一个简单方法是创建一个 Dockerfile，其中包含在基于 NGINX 映像生成新的 Docker 映像期间运行的命令。对于 Dockerfile 中的 file-COPY (COPY)命令，本地目录路径相对于 Dockerfile 所在的构建上下文。

假设内容目录是`content`，配置文件目录是 `conf`，这两个子目录都是 Dockerfile 所在的目录。NGINX 映像在`/etc/NGINX/conf.d` 目录中有缺省的 NGINX 配置文件，包括 `default.conf`。要只使用 Docker 主机上的配置文件，请使用 RUN 命令删除默认文件:

```bash
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY content /usr/share/nginx/html
COPY conf /etc/nginx
```

通过在 Dockerfile 所在的目录中运行命令创建 NGINX 映像。句号(".")在命令的末尾将工作目录文件定义为构建上下文，其中包含 Dockerfile 和要复制的目录:

```bash
docker build -t mynginx_image1 .
```

基于 mynginx image1映像创建一个容器 mynginx3:

```bash
docker run --name mynginx3 -p 80:80 -d mynginx_image1
```

- 在容器中维护内容和配置文件

由于 SSH 不能用于访问 NGINX 容器，因此要直接编辑内容或配置文件，您需要创建一个具有 shell 访问权限的辅助容器。要让 helper 容器能够访问这些文件，创建一个新的映像，其中包含为映像定义的适当的 Docker 数据卷:

```bash
# 复制 nginx 内容和配置文件，用 Dockerfile 定义映像的音量:
FROM nginx
COPY content /usr/share/nginx/html
COPY conf /etc/nginx
VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

# 通过运行以下命令创建新的 NGINX 映像:
docker build -t mynginx_image2 .

# 基于 mynginx image2映像创建一个 NGINX 容器 mynginx4:
docker run --name mynginx4 -p 80:80 -d mynginx_image2

# 启动一个带有 shell 的 helper 容器 mynginx4文件，提供对我们刚刚创建的 mynginx4容器的内容和配置目录的访问:
docker run -i -t --volumes-from mynginx4 --name mynginx4_files debian /bin/bash
# 新的mynginx4_files帮助器容器在前台运行，带有一个持久的标准输入(-i选项)和一个tty (-t选项)。mynginx4中定义的所有卷都作为helper容器中的本地目录挂载。
# debian参数意味着帮助容器使用来自Docker Hub的debian映像。因为NGINX映像也使用Debian，所以最有效的方法是使用Debian作为辅助容器，而不是让Docker加载另一个操作系统
# /bin/bash参数意味着bash shell在helper容器中运行，显示一个shell提示符，您可以根据需要使用该提示符修改文件

# 要启动和停止容器，请运行以下命令:
docker start mynginx4_files
docker stop mynginx4_files

# 要退出 shell 但保持容器运行，请按 Ctrl + p，然后按 Ctrl + q 组合键恢复对正在运行的容器的 shell 访问，运行以下命令:
docker attach mynginx4_files

# 要退出 shell 并终止容器，请运行 exit 命令。
```

### 管理日志

- 使用默认日志记录

默认情况下，NGINX 映像配置为向 Docker 日志收集器发送 NGINX 访问日志和错误日志。这是通过将它们链接到 stdout 和 stderr 来实现的: 然后将来自这两个日志的所有消息写入文件/var/lib/docker/containers/container-ID/container-ID-json。登录 Docker 主机。Container-ID 是创建容器时返回的长形式 ID。要显示长表单 ID，请运行以下命令:

```bash
docker inspect --format '{{ .Id }}' container-name
```

可以使用 Docker 命令行和 Docker 引擎 API 提取日志消息:

```bash
# 要从命令行提取日志消息，请运行以下命令:
docker logs container-name

# 要使用 Docker Remote API 提取日志消息，请使用 Docker Unix sock 发送一个 GET 请求:
curl --unix-sock /var/run/docker-sock http://localhost/containers/container-name/logs?stdout=1&stderr=1
# 若要在输出中只包含访问日志消息，请只包含 stdout = 1。要将输出限制为错误日志消息，只包含 stderr = 1
```

- 使用定制的日志记录

如果希望为某些配置块(如服务器{}和位置{})以不同的方式配置日志记录，请为容器中存储日志文件的目录定义 Docker 卷，创建一个帮助容器来访问日志文件，并使用任何日志记录工具。要实现这一点，请创建一个新映像，其中包含日志文件的卷或卷。

```bash
# 例如，为了配置 NGINX 将日志文件存储在/var/log/NGINX/log 中，在 Dockerfile 中添加该目录的 VOLUME 定义(前提是内容和配置文件在容器中进行管理) :
FROM nginx
COPY content /usr/share/nginx/html
COPY conf /etc/nginx
VOLUME /var/log/nginx/log
# 然后，您可以创建一个映像，并使用它创建一个 NGINX 容器和一个可以访问日志目录的 helper 容器。助手容器可以安装任何所需的日志记录工具。
```

### 控制 NGINX

由于不能直接访问 NGINX 容器的命令行，因此不能直接将 NGINX 命令发送到容器。相反，信号可以通过 Docker kill 命令发送到容器

```bash
# 要重新加载 NGINX 配置，请向 Docker 发送 HUP 信号:
docker kill -s HUP container-name

# 要重新启动 NGINX，运行以下命令重新启动容器:
docker restart container-name
```

## 基本功能

### Master and Worker Processes

NGINX 有一个主进程和一个或多个辅助进程。如果启用了缓存，缓存加载器和缓存管理器进程也会在启动时运行。

主进程的主要目的是读取和评估配置文件，以及维护辅助进程。

辅助进程执行请求的实际处理。NGINX 依靠依赖于操作系统的机制在工作进程之间有效地分配请求。辅助进程的数量由 nginx.conf 配置文件中的 worker _ processes 指令定义，可以设置为固定数量，也可以配置为自动调整可用 CPU 内核的数量。

### 控制 NGINX 命令

要重新加载配置，可以停止或重新启动 NGINX，或者向主进程发送信号。可以通过运行带有-s 参数的 NGINX 命令(调用 NGINX 可执行文件)来发送信号。

```bash
nginx -s <SIGNAL>
```

其中 < signal > 可以是以下任何一个:

- quit – 优雅关闭
- reload – 重新加载配置文件
- reopen – 重新打开日志文件
- stop – 立即关闭(快速关闭)

Kill 实用程序也可用于直接向主进程发送信号。默认情况下，主进程的进程 ID 被写入 nginx.pid 文件，该文件位于/usr/local/nginx/logs 或/var/run 目录中。

### 创建 NGINX 配置文件

默认情况下，配置文件名为 NGINX.conf。它通常是/usr/local/nginx/conf、/etc/nginx 或/usr/local/etc/nginx 之一

- Directives

配置文件由指令及其参数组成。简单(单行)指令的每个末尾都有一个分号。其他指令充当“容器”，将相关指令组合在一起，并用花括号括起来({}) ; 这些指令通常称为块。下面是一些简单指令的例子。

```bash
user             nobody;
error_log        logs/error.log notice;
worker_processes 1;
```

- 特定功能的配置文件

为了使配置更易于维护，我们建议您将其分割为一组特定于特性的文件，存储在/etc/nginx/conf.d 目录中，并使用 nginx.conf 主文件中的头文件文件来引用特定于特性的文件的内容。

```bash
include conf.d/http;
include conf.d/stream;
include conf.d/exchange-enhanced;
```

- Contexts(称为上下文)

一些顶级指令(称为上下文)将适用于不同流量类型的指令组合在一起:

- events – 一般连接处理
- http - HTTP 传输
- mail - 邮件通信
- stream - TCP 和 UDP 通信

置于这些Contexts之外的指令被认为是`main context`

```bash
user nobody; # a directive in the 'main' context

events {
  # configuration of connection processing
}

http {
  # Configuration specific to HTTP and affecting all virtual servers  

  server {
    # configuration of HTTP virtual server 1       
    location /one {
      # configuration for processing URIs starting with '/one'
    }
    location /two {
      # configuration for processing URIs starting with '/two'
    }
  } 
  
  server {
    # configuration of HTTP virtual server 2
  }
}

stream {
  # Configuration specific to TCP/UDP and affecting all virtual servers
  server {
    # configuration of TCP virtual server 1 
  }
}
```

## HTTP Load Balancing（负载均衡）

### Overview（概览）

负载均衡指的是在多个后端服务器之间有效地分配网络流量

跨多个应用程序实例的负载平衡是一种常用的技术，用于优化资源利用率、最大化吞吐量、减少延迟并确保容错配置。

### Proxying HTTP Traffic to a Group of Servers

要开始使用 NGINX Open Source 来平衡一组服务器的 HTTP 流量，首先需要使用`upstream`指令定义该组。该指令被放置在 http 上下文中。

例如，下面的配置定义了一个名为 backend 的组，由三个服务器配置组成(可以在三个以上的实际服务器中解析) :

```bash
http {
  upstream backend {
    server backend1.example.com weight=5; # 运行同一应用程序的实例
    server backend2.example.com; # 运行同一应用程序的实例
    server 192.0.0.1 backup; # 备份服务器
  }

  server {
    location / {
      proxy_pass http://backend;
    }
  }
  # NGINX 上运行的虚拟服务器将所有请求传递给前面例子中定义的备份服务器
}
# 因为在upstream中没有指定负载平衡算法，所以 NGINX 使用默认算法 Round Robin:
```

### 选择负载平衡方法

NGINX 开源支持四种负载平衡方法:

- Round Robin - 请求均匀地分布在服务器上，并考虑服务器权重。默认情况下使用此方法(没有启用它的指令)

```bash
upstream backend {
  # no load balancing method is specified for Round Robin
  server backend1.example.com;
  server backend2.example.com;
}
```

- Least Connections - 最少的连接——向服务器发送的请求中活动连接的数量最少，同样要考虑服务器权重:

```bash
upstream backend {
  least_conn;
  server backend1.example.com;
  server backend2.example.com;
}
```

- IP Hash - 发送请求的服务器是由客户端 IP 地址决定的。在这种情况下，使用 IPv4地址的前三个八位元组或整个 IPv6地址来计算散列值。该方法保证来自相同地址的请求到达相同的服务器，除非它不可用。

```bash
upstream backend {
  ip_hash;
  server backend1.example.com;
  server backend2.example.com;

  # 如果某个服务器需要暂时从负载平衡旋转中删除，可以用 down 参数对其进行标记，以便保留当前客户端 IP 地址的散列。由此服务器处理的请求将自动发送到组中的下一个服务器:
  server backend3.example.com down;

}
```

- Hash - 请求是从用户定义的关键，可以是一个文本字符串，变量，或一个组合确定。例如，密钥可能是一个成对的源 IP 地址和端口，或者是一个 URI，如下例所示:

```bash
upstream backend {
  hash $request_uri consistent;
  server backend1.example.com;
  server backend2.example.com;
}
```

Hash 指令的可选的 consistent 参数启用 ketama consistent-hash 负载平衡。根据用户定义的散列键值，请求均匀地分布在所有上游服务器上。如果将上游服务器添加到上游组或从上游组移除，则只需重新映射少量密钥，从而在负载平衡缓存服务器或其他累积状态的应用程序的情况下，最大限度地减少缓存丢失。

### Server Weights

默认情况下，NGINX 使用 Round Robin 方法根据请求的权重在组中的服务器之间分发请求。服务器指令的 weight 参数设置服务器的权重; 默认值是1:

```bash
upstream backend {
  server backend1.example.com weight=5;
  server backend2.example.com;
  server 192.0.0.1 backup;
}

# 在本例中， backend1.example.com 服务器的权重为5; 其他两个服务器的默认权重为1，但 IP 地址为192.0.0.1的服务器被标记为备份服务器，除非其他两个服务器都不可用，否则不会接收请求。使用这种权重配置，每6个请求中，5个发送到 backend1.example.com ，1个发送到 backend2.example.com。
```

## TCP and UDP Load Balancing

### 配置反向代理

首先，您需要配置反向代理，以便 NGINX Open Source 可以将客户机的 TCP 连接或 UDP 数据报转发到upstream组或代理服务器

打开 NGINX 配置文件并执行以下步骤:

```bash
# 创建一个顶级 stream {} 块:
stream {
  # 为 stream {}上下文中的每个虚拟服务器定义一个或多个 server {} 配置块
  # 在每个服务器的 server {}配置块中，包含 listen 指令来定义服务器侦听的 IP 地址和/或端口
  # 使用 proxy_ pass 指令来定义被代理的服务器或者服务器转发流量的upstream组
  server {
    # TCP 是 stream 上下文的默认协议，所以 listen 指令没有 TCP 参数
    listen 12345;
    #TCP traffic will be forwarded to the "stream_backend" upstream group
    proxy_pass stream_backend;
    # ...
  }

  server {
    # 对于 UDP 流量，还包括 UDP 参数
    listen 53 udp;
    #TCP traffic will be forwarded to the specified server
    proxy_pass backend.example.com:12346;
    # ...
  }

  server {
    listen     53 udp;
    #UDP traffic will be forwarded to the "dns_servers" upstream group
    proxy_pass dns_servers;
  }

  server {
    # 如果代理服务器有多个网络接口，您可以选择配置 NGINX，使其在连接到上游服务器时使用特定的源 IP 地址。如果 NGINX 后面的代理服务器配置为接受来自特定 IP 网络或 IP 地址范围的连接，这可能会很有用
    listen     127.0.0.1:12345;
    proxy_pass backend.example.com:12345;
    # 包括 proxy _ bind 指令和适当网络接口的 IP 地址
    proxy_bind 127.0.0.1:12345;
    # 还可以选择调整两个内存缓冲区的大小，NGINX 可以在这两个缓冲区中放置来自客户端和上游连接的数据。如果数据量很小，可以减少缓冲区，从而节省内存资源。如果存在大量数据，则可以增加缓冲区大小，以减少套接字读/写操作的数量。一旦在一个连接上接收到数据，NGINX 就会读取数据并通过另一个连接将其转发。缓冲区由 proxy _ buffer _ size 指令控制
    proxy_buffer_size 16k;
  }
  # ...
}
```

### Configuring TCP or UDP Load Balancing

```bash
# 创建一组服务器，或者一个负载均衡的上游组。在upsteam{}上下文中定义一个或多个upsteam {}配置块，并设置上游组的名称，例如，TCP 服务器的 stream_backend 和 UDP 服务器的 dns_servers
stream {
  # 确保 proxy_pass 指令引用了上游组的名称，就像上面为反向代理配置的那些指令一样
  upstream stream_backend {
    # 用上游服务器填充上游组。在上游{}块中，为每个上游服务器添加一个服务器指令，指定它的 IP 地址或主机名(可以解析为多个 IP 地址)和一个必需的端口号。请注意，您没有为每个服务器定义协议，因为这是通过您在服务器块中的 listen 指令上包含的参数为整个上游组定义的，该参数是您前面创建的
    server backend1.example.com:12345;
    server backend2.example.com:12345;
    server backend3.example.com:12346;
    # ...
  }

  upstream dns_servers {
    server 192.168.136.130:53;
    server 192.168.136.131:53;
    # ...
  }

  # ...
}
```

配置上游组使用的负载平衡方法:

- Round Robin - 默认情况下，NGINX 使用 Round Robin 算法来平衡负载流量，并将其顺序指向配置的上游组中的服务器
- Least Connections - 最少连接-NGINX 选择当前活动连接数较少的服务器
- Hash - Hash-NGINX 基于用户定义的密钥选择服务器，例如，源 IP 地址($remote_addr)
- Random - 每个连接将被传递到一个随机选择的服务器。如果指定了这个`two`参数，首先，NGINX 随机选择两个服务器并考虑服务器权重，然后使用指定的方法选择其中一个服务器:
  - least_conn - 活动连接的最少数量
- 对于每个上游服务器，可以选择指定特定于服务器的参数，包括最大连接数、服务器重量等

```bash
upstream stream_backend {
  hash   $remote_addr consistent;
  server backend1.example.com:12345 weight=5;
  server backend2.example.com:12345;
  server backend3.example.com:12346 max_conns=3;
}
upstream dns_servers {
  least_conn;
  server 192.168.136.130:53;
  server 192.168.136.131:53;
  # ...
}
```

- 另一种方法是代理流量到单个服务器，而不是上游组。如果您通过主机名识别服务器，并配置主机名以解析为多个 IP 地址，那么 NGINX 负载使用 Round Robin 算法平衡 IP 地址之间的流量。在这种情况下，您必须在 proxy _ pass 指令中指定服务器端口号，并且不能在 IP 地址或主机名之前指定协议

```bash
stream {
  # ...
  server {
    listen     12345;
    proxy_pass backend.example.com:12345;
  }
}
```

### Example of TCP and UDP Load-Balancing Configuration

```bash
stream {
  upstream stream_backend {
    least_conn;
    server backend1.example.com:12345 weight=5;
    server backend2.example.com:12345 max_fails=2 fail_timeout=30s;
    server backend3.example.com:12345 max_conns=3;
  }
  
  upstream dns_servers {
    least_conn;
    server 192.168.136.130:53;
    server 192.168.136.131:53;
    server 192.168.136.132:53;
  }
  
  server {
    # 服务器监听端口12345，并将所有 TCP 连接代理到上游服务器的 stream _ backend 组。注意，在流模块的上下文中定义的 proxy _ pass 指令不能包含协议
    listen        12345;
    proxy_pass    stream_backend;
    proxy_timeout 3s;
    proxy_connect_timeout 1s;
  }
  
  server {
    # 服务器监听端口53，并将所有 UDP 数据报(listen 指令的 UDP 参数)代理到名为 dns _ servers 的上游组。如果未指定 udp 参数，套接字将侦听 TCP 连接。
    listen     53 udp;
    proxy_pass dns_servers;
  }
  
  server {
    # 虚拟服务器监听端口12346并将 TCP 连接代理到 backend4.example.com 服务器，该服务器可以解析几个 IP 地址，这些 IP 地址通过 Round Robin 方法实现负载平衡
    listen     12346;
    proxy_pass backend4.example.com:12346;
  }
}
```

## HTTP Health Checks

### Introduction

NGINX 可以不断地测试上游服务器，避免出现故障的服务器，并优雅地将恢复的服务器添加到负载平衡组中。

### Passive Health Checks（被动健康检查）

对于被动健康检查，NGINX 会在事务发生时进行监视，并尝试恢复失败的连接。如果事务仍然不能恢复，NGINX 开放源码将服务器标记为不可用，并暂时停止向它发送请求，直到它再次被标记为活动

- fail_timeout - 设置服务器被标记为不可用的时间，以及服务器被标记为不可用的时间(默认为10秒)
- max_fails - 服务器被标记为不可用(默认为1次尝试)

在下面的例子中，如果 NGINX 无法向服务器发送请求，或者在30秒内3次没有收到服务器的响应，它将服务器标记为30秒内不可用:

```bash
upstream backend {
  server backend1.example.com;
  server backend2.example.com max_fails=3 fail_timeout=30s;
}
```

最近恢复的服务器很容易被连接压垮，这可能导致服务器再次被标记为不可用。缓慢启动允许上游服务器逐渐恢复其重量从零到其名义值后，它已恢复或成为可用。这可以通过上游服务器指令的 slow _ start 参数来完成

```bash
upstream backend {
  server backend1.example.com slow_start=30s;
  server backend2.example.com;
  server 192.0.0.1 backup;
}
```

:::warning 提醒
注意，如果组中只有一个服务器，fail_timeout 和 max_fails 参数将被忽略，服务器永远不会被标记为不可用。
:::

### TCP Health Checks

```bash
stream {
  #...
  upstream stream_backend {
    server backend1.example.com:12345 weight=5;
    server backend2.example.com:12345 max_fails=2 fail_timeout=30s;
    server backend3.example.com:12345 max_conns=3;
  }
  #...
  server {
    listen     12345;
    proxy_pass stream_backend;
  }
}
```

### UDP Health Checks

```bash
stream {
  #...
  upstream dns_upstream {
    server 192.168.136.130:53 fail_timeout=60s;
    server 192.168.136.131:53 fail_timeout=60s;
    server 192.168.136.132:53 fail_timeout=60s;
  }
  #...
  server {
    listen          53 udp;
    proxy_pass      dns_upstream;
    proxy_timeout   1s;
    proxy_responses 1;
    error_log       logs/dns.log;
  }
  #...
}
```

```bash

# 获得所有正在运行的 nginx 进程的列表
ps -ax | grep nginx

# 默认情况下，nginx 主进程的进程 ID 写入到目录
# killnginx.pid/usr/local/nginx/logs/var/run
kill -s QUIT 1628
```

### 读取静态文件

```nginx
server {
  location / {      # 路由
    root /data/www; # 静态文件存放目录
  }

  location /images/ {
    root /data;
  }
}
```

这已经是一个在标准端口80上侦听的服务器的工作配置，并且可以在本地机器上访问

### 设置一个简单的代理服务器

```nginx
server {
  location / {
    proxy_pass http://localhost:8080/;  # 80端口代理到http://localhost:8080/
  }

  location ~ \.(gif|jpg|png)$ {
    root /data/images;
  }
}
```
