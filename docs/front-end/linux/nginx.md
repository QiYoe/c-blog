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



## NGINX命令及配置

### 介绍

本指南描述了如何启动和停止 nginx，以及重新加载其配置，解释了配置文件的结构，并描述了如何设置 nginx 以提供静态内容，如何将 nginx 配置为代理服务器，以及如何将其与 FastCGI 应用程序连接

### nginx配置文件存放目录

- /usr/local/nginx/conf/nginx.conf
- /etc/nginx/nginx.conf
- /usr/local/nginx.conf  `默认存放目录`

### 启动、停止和重载配置

```bash
# 启动
nginx

# nginx -s signal
# signal:使用参数调用可执行文件控制nginx

# 快速关闭
nginx -s stop

# 优雅关闭
nginx -s quit

# 重载配置文件
nginx -s reload

# 重新打开日志文件
nginx -s reopen

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
