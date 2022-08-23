---
head:
  - - meta
    - name: description
      content: 前端代码风格规范之Husky
  - - meta
    - name: keywords
      content: 前端代码风格规范 husky
---

# Husky

## 前置知识

在代码被提交到 `Git` 仓库之前，我们可以做一些预检查或者格式化。具体的做法就是利用 `Git` 提交钩子，当使用钩子时便会触发某些格式化操作。

[husky 包](https://www.npmjs.com/package/husky)

[husky 官方文档](https://typicode.github.io/husky/#/?id=create-a-hook)

## 安装

```sh
npm install husky -D
# or
yarn add husky -D
```

## 配置

在 `package.json` 文件中添加命令：
```json
"scripts": {
  ...
  "prepare": "husky install",
  "test": ""
}
```

然后运行此命令（启用 `Git` 钩子）：
```shell
npm prepare
# or
yarn prepare
```

最后创建一个 `hook`（钩子）:
```shell
npx husky add .husky/pre-commit "npm test"
```

::: tip
这里也可以如此添加（推荐使用此种，方便我们接下来的整套流程演示）：
```shell
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
# or
yarn husky add .husky/commit-msg 'yarn commitlint --edit $1'
```
:::

## 验证

运行：
```shell
git add .
git commit -m 'test husky'
```

便会运行 `test` 命令，同时 `commit`

::: tip
在 Windows 上使用 `Git Bash` 时，`Git` 钩子可能会失败。如果 Windows 上有用户，强烈建议添加以下变通方法:
1. 创建 `.husky/common.sh`:
```shell
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash and Yarn
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi
```

2. 把它放在 `Yarn` 用来运行命令的地方:
```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

yarn ...
```
:::

::: tip
主要是配合一些格式化的命令，如 `pretty` 、 `commitlint` 等
:::
