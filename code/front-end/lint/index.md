---
head:
  - - meta
    - name: description
      content: 前端代码风格规范
  - - meta
    - name: keywords
      content: 前端代码风格规范 介绍
---

# 介绍

## 目的

代码风格和性格一样，每个程序员都有自己的特点，但对于大家协同开发的项目，还是需要力求代码风格的一致性，以减少Bug，方便互相修改，短时间内能上手，在这条路上诞生了许许多多的工具。本系列主要介绍目前主流的前端代码格式化的工具。

## 适用

该系列规范主要是利用 `git hook` 钩子来触发的, 也就是说只适用于 `Git`

## 学习顺序

1. [Husky](./husky)
2. [Commitlint](./commitlint)
3. [Commitizen](./commitizen)
4. [Lint-staged](./lint-staged)

::: warning
本系列所有 `npm` 包都为局部安装。这是为了保证团队所有人都可以统一使用要求和简便环境安装
:::
