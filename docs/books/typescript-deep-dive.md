---
title: 深入理解 TypeScript
head:
  - - meta
    - name: description
      content: TypeScript 深入理解 TS
  - - meta
    - name: keywords
      content: TypeScript 深入理解 TS
---

## TypeScript 项目

### 编译上下文

编译上下文算是一个比较花哨的术语，可以用它来给文件分组，告诉 TypeScript 哪些文件是有效的，哪些是无效的。除了有效文件所携带信息外，编译上下文还包含有正在被使用的编译选项的信息。定义这种逻辑分组，一个比较好的方式是使用 `tsconfig.json` 文件。

#### tsconfig.json

##### 基础

开始使用 `tsconfig.json` 是一件比较容易的事，你仅仅需要写下：
```json
{}
```

例如，在项目的根目录下创建一个空 JSON 文件。通过这种方式，TypeScript 将 会把此目录和子目录下的所有 .ts 文件作为编译上下文的一部分，它还会包含一部分默认的编译选项。

##### 编译选项

你可以通过 `compilerOptions` 来定制你的编译选项：
```json
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```

关于这些（或者更多）编译选项，稍后将会讨论。

##### TypeScript 编译

好的 IDE 支持对 TypeScript 的即时编译。但是，如果你想在使用 `tsconfig.json` 时从命令行手动运行 TypeScript 编译器，你可以通过以下方式：

运行 tsc，它会在当前目录或者是父级目录寻找 `tsconfig.json` 文件。
运行 `tsc -p ./path-to-project-directory` 。当然，这个路径可以是绝对路径，也可以是相对于当前目录的相对路径。
你甚至可以使用 `tsc -w` 来启用 TypeScript 编译器的观测模式，在检测到文件改动之后，它将重新编译。

#### 制定文件

你也可以显式指定需要编译的文件：
```json
{
  "files": [
    "./some/file.ts"
  ]
}
```

你还可以使用 `include` 和 `exclude` 选项来指定需要包含的文件和排除的文件：
```json
{
  "include": [
    "./folder"
  ],
  "exclude": [
    "./folder/**/*.spec.ts",
    "./folder/someSubFolder"
  ]
}
```

:::tip
使用 `globs`：`**/*` （一个示例用法：`some/folder/**/*`）意味着匹配所有的文件夹和所有文件（扩展名为 `.ts/.tsx`，当开启了 `allowJs: true` 选项时，扩展名可以是 `.js/.jsx`）。
:::

### 声明空间

在 TypeScript 里存在两种声明空间：类型声明空间与变量声明空间。下文将分别讨论这两个概念。

#### 类型声明空间

类型声明空间包含用来当做类型注解的内容，例如下面的类型声明：
```ts
class Foo {}
interface Bar {}
type Bas = {};
```

你可以将 `Foo`, `Bar`, `Bas` 作为类型注解使用，示例如下：
```ts
class Foo {}
interface Bar {}
type Bas = {};
```

注意，尽管你定义了 interface Bar，却并不能够把它作为一个变量来使用，因为它没有定义在变量声明空间中。
```ts
interface Bar {}
const bar = Bar; // Error: "cannot find name 'Bar'"
```

出现错误提示： `cannot find name 'Bar'` 的原因是名称 `Bar` 并未定义在变量声明空间。这将带领我们进入下一个主题 -- 变量声明空间。

#### 变量声明空间

变量声明空间包含可用作变量的内容，在上文中 `Class Foo` 提供了一个类型 `Foo` 到类型声明空间，此外它同样提供了一个变量 Foo 到变量声明空间，如下所示：
```ts
class Foo {}
const someVar = Foo;
const someOtherVar = 123;
```

这很棒，尤其是当你想把一个类来当做变量传递时。

:::warning
我们并不能把一些如 `interface` 定义的内容当作变量使用。
:::

与此相似，一些用 `var` 声明的变量，也只能在变量声明空间使用，不能用作类型注解。
```ts
const foo = 123;
let bar: foo; // ERROR: "cannot find name 'foo'"
```

提示 `ERROR: "cannot find name 'foo'"` 原因是，名称 foo 没有定义在类型声明空间里。

### 模块

#### 全局模块

#### 文件模块

#### 文件模块详情

##### 澄清: commonjs, amd, esmodules, others

##### ES 模块语法

##### 模块路径

##### 什么是 place

##### 重写类型的动态查找

##### import/require 仅仅是道路类型

#### global.d.ts

### 命名空间

### 动态导入表达式

## TypeScript 类型系统

### 概览

### 从JavaScript 迁移

### @types

### 环境声明

### 接口

### 枚举

### lib.d.ts

### 函数

### 可调用的

### 类型断言

### Freshness

### 类型保护

### 字面量类型

### readonly

### 范型

### 类型推断

### 类型兼容性

### Never

### 辨析联合类型

### 索引签名

### 流动的类型

### 异常处理

### 混合

### ThisType

## JSX

### 支持 JSX

### React JSX

### 非 React JSX

## TypeScript 错误提示

### 解读 Errors

### 常见的 Error

## TIPs

### 基于字符串的枚举

### 名义化类型

### 状态函数

### Bind 是有害的

### 柯里化

### 范型的实例化类型

### 对象字面量的惰性初始化

### 类是有用的

### export default 被认为是有害的

### 减少 setter 属性的使用

### 创建数组

### 谨慎使用 --outFile

### TypeScript 中的静态构造函数

### 单例模式

### 函数参数

### Truthy

### 构建切换

### 类型安全的 Event Emitter

### Reflect Metadata

### 协变与逆变

### infer

## TypeScript 编译原理

### 概览

### 程序

### 抽象语法树

### 扫描器

### 解析器

### 绑定器

### 检查器

### 发射器

## TypeScript FAQs

### 一些常见的「bug」并不是 bug

### 一些常见的 Feature 需求

### 类型系统的行为

### 函数

### 类

### 范型

### 模块

### 枚举

### 类型守卫

### JSX 和 React

### 一些不能按预期工作的代码

### 命令行的行为

### tsconfig.json 的行为




























<cite>[-- 《深入理解 TypeScript》](https://jkchao.github.io/typescript-book-chinese/project/compilationContext.html#tsconfig-json)</cite>
