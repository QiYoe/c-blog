---
head:
  - - meta
    - name: description
      content: 前端代码风格规范之Commitlint
  - - meta
    - name: keywords
      content: 前端代码风格规范 commitlint
---

# Commitlint

## 前置知识

有了 Husky 之后，我们就需要代码提交规范和校验了。

[commitlint 包](https://www.npmjs.com/package/@commitlint/config-conventional)

[commitlint 官方文档](https://commitlint.js.org/#/reference-rules)

同时配套的还有一个有意思的工具：
[gitmoji](https://gitmoji.dev/)

## 安装

```shell
npm install -D @commitlint/config-conventional @commitlint/cli
# or
yarn add @commitlint/config-conventional @commitlint/cli -D
```

之后项目根目录创建 `commitlint.config.js` 文件：
```js
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [ 'feat', 'fix', 'perf', 'style', 'docs', 'test', 'refactor', 'build', 'ci', 'chore', 'revert', 'wip', 'workflow', 'types', 'release',
      ],
    ],
  },
};
```

## 验证

终端运行：
```shell
git add .
git commit -m 'test: test commitlint' 
```

::: tip
接下来这一节 [Commitizen](./commitizen) 是和此节配套的。但这一节实际上已经足够，[Commitizen](./commitizen) 只是令此节内容人机交互性体验更强
:::
