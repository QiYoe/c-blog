---
head:
  - - meta
    - name: description
      content: 前端代码风格规范
  - - meta
    - name: keywords
      content: 前端代码风格规范 Lint-staged
---

# Lint-staged

## 前置知识

`lint-staged` 是一个前端文件过滤工具，它仅过滤 `Git` 代码暂存区文件。当 `git commit` 时，`pre-commit` 钩子会启动，执行 `lint-staged` 命令。

::: tip
`lint-staged` 仅仅是一个文件过滤工具，不涉及代码格式化！！！
:::

## 安装

```shell
npm install lint-staged -D
# or
yarn add lint-staged -D
```

## 配置

在 `.husky` 文件夹下创建 `lintstagedrc.js` 文件：
```js
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['eslint --fix', 'prettier --write', 'stylelint --fix'],
  '*.{scss,less,styl,html}': ['stylelint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
};
```

在 `.husky` 文件夹下的 `pre-commit` 中添加：
```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

[ -n "$CI" ] && exit 0

# Format and submit code according to lintstagedrc.js configuration
npm run lint:lint-staged
# 以上命令 "lint-staged -c ./.husky/lintstagedrc.js"
```

## 相关配套工具

这里是所需的格式化工具

### Prettier

`prettier` 是对全量的代码进行格式化。将代码解析为 `AST` ，然后重新组装，目的是最终输出风格统一的代码。而 `eslint` 只是对有问题的地方进行格式化修改，不改动源代码风格

#### 安装

```shell
npm install -D prettier
# or
yarn add -D prettier
```

#### 配置

项目根目录下添加 `prettier.config.js` :
```js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  trailingComma: 'es5',
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  arrowParens: 'always',
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
  rangeStart: 0,
};
```

项目根目录下添加 `.prettierignore` :
```tex
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

在 `.husky` 文件夹下的 `pre-commit` 中添加：
```shell
...
npm run lint:pretty
# 以上命令 "pretty-quick --staged"
```

::: tip
`pretty-quick` 的作用是在更改的文件中运行 `prettier`
:::

在 package.json 文件中添加命令：
```json
"scripts": {
  ...
  "lint:prettier": "prettier --write  \"docs/**/*.{js,json,tsx,css,less,scss,vue,html,md}\""
}
```
**项目提交前可以先运行此命令**

### Eslint

`eslint` 主要作用是代码规则校验，是代码更加一致并避免错误。

#### 安装

```shell
npm install -D eslint eslint-config-prettier eslint-define-config eslint-plugin-prettier
# or
yarn add -D eslint eslint-config-prettier eslint-define-config eslint-plugin-prettier
```

#### 配置

项目根目录下添加 `eslintrc.js` :
```js
module.exports = {
  // @ts-check
const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    // 'plugin:jest/recommended',
  ],
  rules: {
    'vue/script-setup-uses-vars': 'error',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/custom-event-name-casing': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'space-before-function-paren': 'off',

    'vue/attributes-order': 'off',
    'vue/one-component-per-file': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
});
```

项目根目录下添加 `eslintignore` :
```tex
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
Dockerfile
```

在 `package.json` 文件中添加命令：
```json
"scripts": {
  ...
  "lint:eslint": "eslint --cache --max-warnings 0  \"{docs,mock}/**/*.{vue,ts,tsx}\" --fix"
}
```

**项目提交前可以先运行此命令**

### Stylelint

通过定义一系列的编码风格规则帮助我们避免在样式表中出现错误。

#### 安装

```shell
npm install -D stylelint stylelint-config-prettier stylelint-config-standard stylelint-order
# or
yarn add -D stylelint stylelint-config-prettier stylelint-config-standard stylelint-order
```

#### 配置

项目根目录下添加 `stylelint.config.js` :
```js
module.exports = {
  root: true,
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
        ],
      },
    ],
    'no-empty-source': null,
    'named-grid-areas-no-invalid': null,
    'unicode-bom': 'never',
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    // 'declaration-block-trailing-semicolon': 'always',
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports',
        },
        {
          type: 'at-rule',
          name: 'media',
        },
        'rules',
      ],
      { severity: 'warning' },
    ],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
```

项目根目录下添加 `.stylelintignore` :
```tex
/dist/*
/public/*
public/*
```

### 其他一些通用文件配置

`.gitignore` :
```txt
.DS_Store
node_modules
dist
.npmrc
.cache

yarn.lock
package-lock.json

tests/server/static
tests/server/static/upload
test/unit/coverage
test/e2e/reports

.local
# local env files
.env.local
.env.*.local
.eslintcache

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
selenium-debug.log
pnpm-debug.log*

# Editor directories and files
.idea
# .vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

根目录下 `.vscode` 文件夹下 `.extensios.json` :
```json
{
  "recommendations": [
    "octref.vetur",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "esbenp.prettier-vscode",
    "mrmlnc.vscode-less",
    "lokalise.i18n-ally",
    "antfu.iconify",
    "mikestead.dotenv",
    "heybourn.headwind"
  ]
}
```

根目录下 `.vscode` 文件夹下 `.launch.json` :
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3100",
      "webRoot": "${workspaceFolder}/docs",
      "sourceMaps": true
    },
  ]
}
```

根目录下 `.vscode` 文件夹下 `.settings.json` :
```json
{
  "typescript.tsdk": "./node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "volar.tsPlugin": true,
  "volar.tsPluginStatus": false,
  //===========================================
  //============= Editor ======================
  //===========================================
  "explorer.openEditors.visible": 0,
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "diffEditor.ignoreTrimWhitespace": false,
  //===========================================
  //============= Other =======================
  //===========================================
  "breadcrumbs.enabled": true,
  "open-in-browser.default": "chrome",
  //===========================================
  //============= files =======================
  //===========================================
  "files.eol": "\n",
  "search.exclude": {
    "**/node_modules": true,
    "**/*.log": true,
    "**/*.log*": true,
    "**/bower_components": true,
    "**/dist": true,
    "**/elehukouben": true,
    "**/.git": true,
    "**/.gitignore": true,
    "**/.svn": true,
    "**/.DS_Store": true,
    "**/.idea": true,
    "**/.vscode": false,
    "**/yarn.lock": true,
    "**/tmp": true,
    "out": true,
    "dist": true,
    "node_modules": true,
    "CHANGELOG.md": true,
    "examples": true,
    "res": true,
    "screenshots": true,
    "yarn-error.log": true,
    "**/.yarn": true
  },
  "files.exclude": {
    "**/.cache": true,
    "**/.editorconfig": true,
    "**/.eslintcache": true,
    "**/bower_components": true,
    "**/.idea": true,
    "**/tmp": true,
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true
  },
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/.vscode/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/bower_components/**": true,
    "**/dist/**": true,
    "**/yarn.lock": true
  },
  "stylelint.enable": true,
  "stylelint.packageManager": "yarn",
  "liveServer.settings.donotShowInfoMsg": true,
  "telemetry.enableCrashReporter": false,
  "workbench.settings.enableNaturalLanguageSearch": false,
  "path-intellisense.mappings": {
    "/@/": "${workspaceRoot}/docs"
  },
  "prettier.requireConfig": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "workbench.sideBar.location": "left",
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": false
    }
  },
  "i18n-ally.localesPaths": ["src/locales/lang"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sortKeys": true,
  "i18n-ally.namespace": true,
  "i18n-ally.pathMatcher": "{locale}/{namespaces}.{ext}",
  "i18n-ally.enabledParsers": ["ts"],
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "zh-CN",
  "i18n-ally.enabledFrameworks": ["vue", "react"],
  "cSpell.words": [
    "vben",
    "windi",
    "browserslist",
    "tailwindcss",
    "esnext",
    "antv",
    "tinymce",
    "qrcode",
    "sider",
    "pinia",
    "sider",
    "nprogress",
    "INTLIFY",
    "stylelint",
    "esno",
    "vitejs",
    "sortablejs",
    "mockjs",
    "codemirror",
    "iconify",
    "commitlint",
    "vditor",
    "echarts",
    "cropperjs",
    "logicflow",
    "vueuse",
    "zxcvbn",
    "lintstagedrc",
    "brotli",
    "tailwindcss",
    "sider"
  ]
}
```

## 验证

```shell
git add .
git pull
git commit -m 'test: 测试前端代码规范功能'
```

如果确保了自己的代码确实没问题，而却报错始终成功不了，则可以添加 `--no-verify`:
```shell
git commit -m 'test: 测试前端代码规范功能' --no-verify
```
