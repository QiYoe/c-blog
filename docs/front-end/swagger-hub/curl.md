---
title: Curl
head:
  - - meta
    - name: description
      content: Curl学习日志
  - - meta
    - name: keywords
      content: Curl swaggerhub swagger-ui swagger
---

:::tip 提示
以下内容源于[**<u>阮一峰 curl的用法指南</u>**](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)。但由于阮老师久未更新此篇，因此有许多命令已经不适用。本篇是curl的最新版-7.78.0，用以日常使用查看!
:::

不带有任何参数时，curl 就是发出 GET 请求。

```bash
$ curl https://www.baidu.com
```

上面命令向www.baidu.com发出 GET 请求，服务器返回的内容会在命令行输出。

## -A



