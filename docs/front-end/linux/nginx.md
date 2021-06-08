---
title: Nginx配置详解
head:
  - - meta
    - name: description
      content: Nginx配置详解
  - - meta
    - name: keywords
      content: Linux Nginx Nginx配置
---

## 为什么Nginx？

[Ngonx官网](http://nginx.org/en/)

Nginx时轻量级Web服务器，它不仅时一个高性能的HTTP和反向代理服务器，同时也是一个IMAP/POPS/SMTP代理服务器

## 安装

### CentOS

安装编译环境

```bash
sudo yum install yum-utils
```

要设置 yum 存储库，请创建具有以下内容的命名文件：/etc/yum.repos.d/nginx.repo

```bash
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

默认情况下，使用稳定 nginx 封装的存储库。如果您想使用主线 nginx 封装，请运行以下命令：

```bash
sudo yum-config-manager --enable nginx-mainline
```

要安装 nginx，运行以下命令：

```bash
sudo yum install nginx
```

当提示接受 GPG 密钥时，请验证指纹是否匹配（如果匹配）接受该密钥。`573B FD6B 3D8F BC64 1079 A6AB ABF5 BD82 7BD9 BF62`

### Ubuntu

安装编译环境

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release
```

要为稳定版 nginx 包设置合适的存储库，运行以下命令：

```bash
echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

如果您想使用主线 nginx 包，请运行以下命令：

```bash
echo "deb http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

设置存储库固定，以优选我们的包，而不是分配提供的包：

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx
```

接下来，导入官方nginx签名密钥，以便apt可以验证包装的真实性。获取密钥：

```bash
curl -o /tmp/nginx_signing.key https://nginx.org/keys/nginx_signing.key
```

验证下载的文件是否包含正确的密钥：

```bash
gpg --dry-run --quiet --import --import-options show-only /tmp/nginx_signing.key
```

输出应包含以下完整密钥：573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62

```bash
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

最后，将密钥移动到恰当可信的密钥存储（请注意"asc"文件扩展更改）：

```bash
sudo mv /tmp/nginx_signing.key /etc/apt/trusted.gpg.d/nginx_signing.asc
```

要安装 nginx，运行以下命令：

```bash
sudo apt update
sudo apt install nginx
```

### 从源构建nginx

```bash
./configure --sbin-path=/usr/local/nginx/nginx \
--conf-path=/usr/local/nginx/nginx.conf \
--pid-path=/usr/local/nginx/nginx.pid \
--with-http_gzip_static_module \
--with-http_stub_status_module \
--with-file-aio \
--with-http_realip_module \
--with-http_ssl_module \
--with-pcre=/usr/local/src/pcre2-10.37 \
--with-zlib=/usr/local/src/zlib-1.2.11 \
--with-openssl=/usr/local/src/openssl-1.1.1k

make install
```

### 启动

确保系统的 80 端口没被其他程序占用，运行/usr/local/nginx/nginx 命令来启动 Nginx

```bash
netstat -ano|grep 80
```

如果查不到结果后执行，有结果则忽略此步骤（ubuntu下必须用sudo启动，不然只能在前台运行）

```bash
sudo /usr/local/nginx/nginx
```

打开浏览器访问此机器的 IP，如果浏览器出现 Welcome to nginx! 则表示 Nginx 已经安装并运行成功

到这里nginx就安装完成了，如果只是处理静态html就不用继续安装了
