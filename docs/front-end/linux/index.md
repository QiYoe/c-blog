---
title: Linux启动Nginx服务
head:
  - - meta
    - name: description
      content: Linux启动Nginx服务详细教程
  - - meta
    - name: keywords
      content: Linux Nginx Ubuntu CentOs 建站
---

## 启动linux系统

### windows下安装linux

- windows有内置的linux系统，如何安装，请自行百度
- 安装神器工具：xshell和xftp（请自行百度下载破解版`非破解版收费😔`）
- 确认安装的是Ubuntu还是CentOS：
  - xshell运行`yum -help`：有结果就是CentOS
    - 查看CentOS版本`cat /etc/redhat-release`
  - xshell运行`apt -help`：有结果就是Ubuntu

::: warning
要说明的一点是Ubuntu是界面操作模式，而CentOS是命令行操作模式
:::

### 虚拟机安装linux系统

安装Ubuntu或是CentOS镜像（请自行百度下载镜像）

**以下是windows下的`CentOS`系统讲解**

## 安装Nginx

- 离线安装[官网下载](http://nginx.org/packages/)
  - `http://nginx.org/packages/centos/7/x86_64/RPMS/`（我的CentOS是7版本），然后选择一个rpm文件下载（我一般都习惯下载最新版或是次最新版）
  - 运行这个命令`sudo yum install -y 你的rpm包`
- 在线安装：请自行百度

## 启动Nginx

启动Nginx并设置开机启动

``` bash
sudo service nginx start
#或者
sudo systemctl start nginx.service
sudo systemctl enable nginx.service
```

## 配置nginx.config

## 传输文件

## 验证配置是否成功
