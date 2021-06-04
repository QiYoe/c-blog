---
title: SwaggerHub使用教程
head:
  - - meta
    - name: description
      content: SwaggerHub使用详细教程
  - - meta
    - name: keywords
      content: swaggerhub swagger-ui swagger RESTful
---

## RESTful API是什么

三句话：

- 看Url就知道要什么
- 看http method就知道干什么
- 看http status code就知道结果如何

举例：

- GET：用来获取资源
- POST：用来新建资源（也可以用于更新资源）。比如：POST `http://api.com/friends/id`——添加好友
- PUT：用来更新资源
- DELETE：用来删除资源。比如：DELETE `http://api.com/friends/id`——删除某人的好友 （在http parameter指定好友id）
- UPDATE：`http://api.qc.com/friends/id/profile`——更新个人资料

## SwaggerHub是什么

Swagger 是一个规范且完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务（可以简单理解为接口文档）。

## SwaggerHub使用

::: warning
Swagger需要Spring Boot来启动，暂停更新...
:::

## swagger-ui

在[官网首页](https://swagger.io/tools/swagger-ui/download/)找到`swagger ui`，点击然后进入github下载[swagger项目](https://github.com/swagger-api/swagger-ui)
