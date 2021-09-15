---
title: Commitizen
head:
  - - meta
    - name: description
      content: 前端代码风格规范之Commitizen
  - - meta
    - name: keywords
      content: 前端代码风格规范 commitizen
---

## 前置知识

有了 `Commitlint` 之后，我们就可以规范 `commit` 的信息校验了。 `Commitizen` 可以令这种校验体验感更佳。

[commitizen 官方文档](http://commitizen.github.io/cz-cli/)

## 安装

```shell
npm install -D commitizen
# or
yarn add commitizen -D
```

之后终端运行：
```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
# or
npx commitizen init cz-conventional-changelog --yarn --dev --exact
```

在 `package.json` 文件中添加命令：
```js
"scripts": {
  ...
  "cz": "cz"
}
```

::: info
如果安装了 `husky`：
- 命令命名为 `commit` ，运行此命令的时候 `npm` 和 `husky` 会自动运行名为 `precommit` 的脚本 2 次
- 命令命名为其他，如 `cz` ，运行此命令的时候 `npm` 只会自动运行名为 `prexxx` 的脚本
:::
## 验证

终端运行：
```shell
git add .

yarn cz
# or
npm cz
```

## 设置中文

cz-conventional-changelog 出来的选项都是英文，对于开始使用的新手来说不太方便。这里是[中文版](https://github.com/z649319834/cz-conventional-changelog-zh)的
