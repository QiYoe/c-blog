---
title: 阿里云域名
head:
  - - meta
    - name: description
      content: 阿里云域名购买、解析、使用详细教程
  - - meta
    - name: keywords
      content: 阿里云 域名 解析 备案 CNAME
---

## 为什么用域名？

哈，当然是为了日后可以搭建后端框架啊。先学习学习😄

## 阿里云域名流程

### 购买域名

没啥好说，先来个套餐（域名+ECS云服务器）

### 备案

阿里云控制台上有备案选项。我的域名记得备案了一周😔

### 创建CNAME文件

项目根目录下创建CNAME文件，文件内容为你的域名，比如我的就是`qiyoe.cn`

### github pages

如果上面步骤成功，pages则会出现以下内容

::: tip
√ Your site is published at `https://qiyoe.cn/`
:::

### 域名解析

打开`域名控制台`，选择域名`解析`，添加记录值

1、设置主机记录www，记录类型为A，记录值是IP。其中IP是Github Pages服务器指定的IP地址，访问该IP地址即表示访问Github Pages。

2、设置主机记录www，记录类型为A，记录值是IP。同上。

3、设置主机记录@，记录类型为CNAME，记录值是`Github-Name.github.io.`。表示将`https://xxx.com`这个主域名映射`xxx.github.io`。  
  注意在这里千万不要忘记记录值中.io后面还有一个点.！

::: warning
域名解析得花个一两天吧（反正我的是）
:::
