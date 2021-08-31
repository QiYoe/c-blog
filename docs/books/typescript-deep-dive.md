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

在默认情况下，当你开始在一个新的 TypeScript 文件中写下代码时，它处于全局命名空间中。如在 foo.ts 里的以下代码。
```ts
const foo = 123;
```

如果你在相同的项目里创建了一个新的文件 bar.ts，TypeScript 类型系统将会允许你使用变量 foo，就好像它在全局可用一样：
```ts
const bar = foo; // allowed
```

毋庸置疑，使用全局变量空间是危险的，因为它会与文件内的代码命名冲突。我们推荐使用下文中将要提到的文件模块。

#### 文件模块

文件模块也被称为外部模块。如果在你的 TypeScript 文件的根级别位置含有 `import` 或者 `export`，那么它会在这个文件中创建一个本地的作用域。因此，我们需要把上文 `foo.ts` 改成如下方式（注意 `export` 用法）：
```ts
export const foo = 123;
```

在全局命名空间里，我们不再有 `foo`，这可以通过创建一个新文件 `bar.ts` 来证明：
```ts
const bar = foo; // ERROR: "cannot find name 'foo'"
```

如果你想在 `bar.ts` 里使用来自 `foo.ts` 的内容，你必须显式地导入它，更新后的 `bar.ts` 如下所示。
```ts
import { foo } from './foo';
const bar = foo; // allow
```

在 `bar.ts` 文件里使用 `import` 时，它不仅允许你使用从其他文件导入的内容，还会将此文件 `bar.ts` 标记为一个模块，文件内定义的声明也不会“污染”全局命名空间

#### 文件模块详情

文件模块拥有强大的功能和较强的可用性。下面我们来讨论它的功能及一些用法。

##### 澄清: commonjs, amd, esmodules, others

首先，我们需要澄清这些模块系统的不一致性。我将会提供给你我当前的建议，以及消除一些你的顾虑。

你可以根据不同的 `module` 选项来把 TypeScript 编译成不同的 JavaScript 模块类型，这有一些你可以忽略的东西：
- AMD：不要使用它，它仅能在浏览器工作；
- SystemJS：这是一个好的实验，已经被 ES 模块替代；
- ES 模块：它并没有准备好。

使用 `module: commonjs` 选项来替代这些模式，将会是一个好的主意。

怎么书写 TypeScript 模块呢？，这也是一件让人困惑的事。在今天我们应该这么做：

- 放弃使用 `import/require` 语法即 `import foo = require('foo')` 写法
- 推荐使用 ES 模块语法

这很酷，接下来，让我们看看 ES 模块语法。

:::tip
使用 `module: commonjs` 选项以及使用 ES 模块语法导入、导出、编写模块。
:::

##### ES 模块语法

- 使用 `export` 关键字导出一个变量或类型
```ts
// foo.ts
export const someVar = 123;
export type someType = {
  foo: string;
};
```

- `export` 的写法除了上面这种，还有另外一种：
```ts
// foo.ts
const someVar = 123;
type someType = {
  type: string;
};

export { someVar, someType };
```

- 你也可以用重命名变量的方式导出：
```ts
// foo.ts
const someVar = 123;
export { someVar as aDifferentName };
```

- 使用 `import` 关键字导入一个变量或者是一个类型：
```ts
// bar.ts
import { someVar, someType } from './foo';
```

- 通过重命名的方式导入变量或者类型：
```ts
// bar.ts
import { someVar as aDifferentName } from './foo';
```

- 除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面：
```ts
// bar.ts
import * as foo from './foo';
// 你可以使用 `foo.someVar` 和 `foo.someType` 以及其他任何从 `foo` 导出的变量或者类型
```

- 只导入模块：
```ts
import 'core-js'; // 一个普通的 polyfill 库
```

- 从其他模块导入后整体导出：
```ts
export * from './foo';
```

- 从其他模块导入后，部分导出：
```ts
export { someVar } from './foo';
```

- 通过重命名，部分导出从另一个模块导入的项目：
```ts
export { someVar as aDifferentName } from './foo';
```

###### 默认导入／导出

我并不喜欢用默认导出，虽然有默认导出的语法：
- 使用 export default
  - 在一个变量之前（不需要使用 let/const/var）；
  - 在一个函数之前；
  - 在一个类之前。
```ts
// some var
export default (someVar = 123);

// some function
export default function someFunction() {}

// some class
export default class someClass {}
```

- 导入使用 `import someName from 'someModule'` 语法（你可以根据需要为导入命名）：
```ts
import someLocalNameForThisFile from './foo';
```

##### 模块路径

:::tip
如果你需要使用 `moduleResolution: node` 选项，你应该将此选项放入你的配置文件中。如果你使用了 `module: commonjs` 选项， `moduleResolution: node` 将会默认开启。
:::

这里存在两种截然不同的模块：
- 相对模块路径（路径以 `.` 开头，例如：`./someFile` 或者 `../../someFolder/someFile` 等）；
- 其他动态查找模块（如：`core-js`，`typestyle`，`react` 或者甚至是 `react/core` 等）。

它们的主要区别在于系统如何解析模块。

:::tip
我将会使用一个概念性术语，`place` -- 将在提及查找模式后解释它。
:::

###### 相对模块路径

这很简单，仅仅是按照相对路径来就可以了：
- 如果文件 `bar.ts` 中含有 `import * as foo from './foo'`，那么 `foo` 文件必须与 `bar.ts` 文件存在于相同的文件夹下
- 如果文件 `bar.ts` 中含有 `import * as foo from '../foo'`，那么 `foo` 文件所存在的地方必须是 `bar.ts` 的上一级目录；
- 如果文件 `bar.ts` 中含有 `import * as foo from '../someFolder/foo'`，那么 `foo` 文件所在的文件夹 someFolder 必须与 `bar.ts` 文件所在文件夹在相同的目录下。

你还可以思考一下其他相对路径导入的场景。😃

###### 动态查找

当导入路径不是相对路径时，模块解析将会模仿 [Node 模块解析策略](https://nodejs.org/api/modules.html#modules_all_together)，下面我将给出一个简单例子：
- 当你使用 `import * as foo from 'foo'`，将会按如下顺序查找模块：
  - `./node_modules/foo`
  - `../node_modules/foo`
  - `../../node_modules/foo`
  - 直到系统的根目录
- 当你使用 `import * as foo from 'something/foo'`，将会按照如下顺序查找内容
  - `./node_modules/something/foo`
  - `../node_modules/something/foo`
  - `../../node_modules/something/foo`
  - 直到系统的根目录

##### 什么是 `place`

当我提及被检查的 `place` 时，我想表达的是在这个 `place` 上，TypeScript 将会检查以下内容（例如一个 `foo` 的 `place`）：
- 如果这个 `place` 表示一个文件，如：`foo.ts`，欢呼！
- 否则，如果这个 `place` 是一个文件夹，并且存在一个文件 `foo/index.ts`，欢呼！
- 否则，如果这个 `place` 是一个文件夹，并且存在一个 `foo/package.json` 文件，在该文件中指定 `types` 的文件存在，那么就欢呼！
- 否则，如果这个 `place` 是一个文件夹，并且存在一个 `package.json` 文件，在该文件中指定 `main` 的文件存在，那么就欢呼！

从文件类型上来说，我实际上是指 `.ts`， `.d.ts` 或者 `.js`

就是这样，现在你已经是一个模块查找专家（这并不是一个小小的成功）。

##### 重写类型的动态查找

在你的项目里，你可以通过 `declare module 'somePath'` 声明一个全局模块的方式，来解决查找模块路径的问题。
```ts
// global.d.ts
declare module 'foo' {
  // some variable declarations
  export var bar: number;
}
```

接着 ：
```ts
// anyOtherTsFileInYourProject.ts
import * as foo from 'foo';
// TypeScript 将假设（在没有做其他查找的情况下）
// foo 是 { bar: number }
```

##### import/require 仅仅是导入类型

以下导入语法：
```ts
import foo = require('foo');
```

它实际上只做了两件事：
- 导入 foo 模块的所有类型信息；
- 确定 foo 模块运行时的依赖关系。

你可以选择仅加载类型信息，而没有运行时的依赖关系。在继续之前，你可能需要重新阅读本书 [声明空间部分](#声明空间)。

如果你没有把导入的名称当做变量声明空间来用，在编译成 JavaScript 时，导入的模块将会被完全移除。这最好用例子来解释，下面我们将会给出一些示例。

###### 例子 1
```ts
import foo = require('foo');
```

将会编译成 JavaScript：
```js
```

这是正确的，一个没有被使用的空文件。

###### 例子 2
```ts
import foo = require('foo');
var bar: foo;
```

将会被编译成：
```js
let bar;
```

这是因为 foo （或者其他任何属性如：`foo.bas`）没有被当做一个变量使用。

###### 例子 3
```ts
import foo = require('foo');
const bar = foo;
```

将会被编译成（假设是 commonjs）：
```js
const foo = require('foo');
const bar = foo;
```

这是因为 `foo` 被当做变量使用了。

###### 使用例子：懒加载

类型推断需要提前完成，这意味着，如果你想在 `bar` 文件里，使用从其他文件 `foo` 导出的类型，你将不得不这么做：
```ts
import foo = require('foo');
let bar: foo.SomeType;
```

然而，在某些情景下，你只想在需要时加载模块 `foo`，此时你需要仅在类型注解中使用导入的模块名称，而**不**是在变量中使用。在编译成 JavaScript 时，这些将会被移除。接着，你可以手动导入你需要的模块。

作为一个例子，考虑以下基于 `commonjs` 的代码，我们仅在一个函数内导入 `foo` 模块：
```ts
import foo = require('foo');

export function loadFoo() {
  // 这是懒加载 foo，原始的加载仅仅用来做类型注解
  const _foo: typeof foo = require('foo');
  // 现在，你可以使用 `_foo` 替代 `foo` 来作为一个变量使用
}
```

一个同样简单的 `amd` 模块（使用 requirejs）：
```ts
import foo = require('foo');

export function loadFoo() {
  // 这是懒加载 foo，原始的加载仅仅用来做类型注解
  require(['foo'], (_foo: typeof foo) => {
    // 现在，你可以使用 `_foo` 替代 `foo` 来作为一个变量使用
  });
}
```

这些通常在以下情景使用：
- 在 web app 里， 当你在特定路由上加载 JavaScript 时；
- 在 node 应用里，当你只想加载特定模块，用来加快启动速度时。

###### 使用例子：打破循环依赖

类似于懒加载的使用用例，某些模块加载器（commonjs/node 和 amd/requirejs）不能很好的处理循环依赖。在这种情况下，一方面我们使用延迟加载代码，并在另一方面预先加载模块是很实用的。

###### 使用例子：确保导入

当你加载一个模块，只是想引入其附加的作用（如：模块可能会注册一些像 [CodeMirror addons](https://codemirror.net/doc/manual.html#addons)）时，然而，如果你仅仅是 `import/require` （导入）一些并没有与你的模块或者模块加载器有任何依赖的 JavaScript 代码，（如：webpack），经过 TypeScript 编译后，这些将会被完全忽视。在这种情况下，你可以使用一个 `ensureImport` 变量，来确保编译的 JavaScript 依赖与模块。如：
```ts
import foo = require('./foo');
import bar = require('./bar');
import bas = require('./bas');

const ensureImport: any = foo || bar || bas;
```

#### global.d.ts

在上文中，当我们讨论文件模块时，比较了全局变量与文件模块，并且我们推荐使用基于文件的模块，而不是选择污染全局命名空间。

然而，如果你的团队里有 TypeScript 初学者，你可以提供他们一个 `global.d.ts` 文件，用来将一些接口或者类型放入全局命名空间里，这些定义的接口和类型能在你的所有 TypeScript 代码里使用。

:::tip
对于任何需要编译成 `JavaScript` 的代码，我们强烈建议你放入文件模块里。
:::

- `global.d.ts` 是一种扩充 `lib.d.ts` 很好的方式，如果你需要的话。
- 当你从 `JS` 迁移到 `TS` 时，定义 `declare module "some-library-you-dont-care-to-get-defs-for"` 能让你快速开始。

### 命名空间

在 JavaScript 使用命名空间时， 这有一个常用的、方便的语法：
```js
(function(something) {
  something.foo = 123;
})(something || (something = {}));
```

`something || (something = {})` 允许匿名函数 `function (something) {}` 向现有对象添加内容，或者创建一个新对象，然后向该对象添加内容。这意味着你可以拥有两个由某些边界拆成的块。
```js
(function(something) {
  something.foo = 123;
})(something || (something = {}));

console.log(something);
// { foo: 123 }

(function(something) {
  something.bar = 456;
})(something || (something = {}));

console.log(something); // { foo: 123, bar: 456 }
```

在确保创建的变量不会泄漏至全局命名空间时，这种方式在 JavaScript 中很常见。当基于文件模块使用时，你无须担心这点，但是该模式仍然适用于一组函数的逻辑分组。因此 TypeScript 提供了 `namespace` 关键字来描述这种分组，如下所示。
```ts
namespace Utility {
  export function log(msg) {
    console.log(msg);
  }
  export function error(msg) {
    console.log(msg);
  }
}

// usage
Utility.log('Call me');
Utility.error('maybe');
```

`namespace` 关键字编译后的 JavaScript 代码，与我们早些时候看到的 JavaScript 代码一样。
```js
var Utility;
(function (Utility) {
  // 添加属性至 Utility
})(Utility || Utility = {});
```

值得注意的一点是，命名空间是支持嵌套的。因此，你可以做一些类似于在 `Utility` 命名空间下嵌套一个命名空间 `Messaging` 的事情。

对于大多数项目，我们建议使用外部模块和命名空间，来快速演示和移植旧的 JavaScript 代码。

### 动态导入表达式

动态导入表达式是 ECMAScript 的一个新功能，它允许你在程序的任意位置异步加载一个模块，TC39 JavaScript 委员会有一个提案，目前处于第四阶段，它被称为 [import() proposal for JavaScript](https://github.com/tc39/proposal-dynamic-import)。

此外，**webpack** bundler 有一个 `Code Splitting` 功能，它能允许你将代码拆分为许多块，这些块在将来可被异步下载。因此，你可以在程序中首先提供一个最小的程序启动包，并在将来异步加载其他模块。

这很自然就会让人想到（如果我们工作在 webpack dev 的工作流程中）[TypeScript 2.4 dynamic import expressions](https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#dynamic-import-expressions) 将会把你最终生成的 JavaScript 代码自动分割成很多块。但是这似乎并不容易实现，因为它依赖于我们正在使用的 `tsconfig.json` 配置文件。

webpack 实现代码分割的方式有两种：使用 `import()` （首选，ECMAScript 的提案）和 `require.ensure()` （最后考虑，webpack 具体实现）。因此，我们期望 TypeScript 的输出是保留 `import()` 语句，而不是将其转化为其他任何代码。

让我们来看一个例子，在这个例子中，我们演示了如何配置 webpack 和 TypeScript 2.4 +。

在下面的代码中，我希望懒加载 `moment` 库，同时我也希望使用代码分割的功能，这意味 `moment` 会被分割到一个单独的 JavaScript 文件，当它被使用时，会被异步加载。
```ts
import(/* webpackChunkName: "momentjs" */ 'moment')
  .then(moment => {
    // 懒加载的模块拥有所有的类型，并且能够按期工作
    // 类型检查会工作，代码引用也会工作  :100:
    const time = moment().format();
    console.log('TypeScript >= 2.4.0 Dynamic Import Expression:');
    console.log(time);
  })
  .catch(err => {
    console.log('Failed to load moment', err);
  });
```

这是 `tsconfig.json` 的配置文件：
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "lib": [
      "dom",
      "es5",
      "scripthost",
      "es2015.promise"
    ],
    "jsx": "react",
    "declaration": false,
    "sourceMap": true,
    "outDir": "./dist/js",
    "strict": true,
    "moduleResolution": "node",
    "typeRoots": [
      "./node_modules/@types"
    ],
    "types": [
      "node",
      "react",
      "react-dom"
    ]
  }
}
```

:::danger
- 使用 `"module": "esnext"` 选项：TypeScript 保留 `import()` 语句，该语句用于 Webpack Code Splitting。
- 进一步了解有关信息，推荐阅读这篇文章：[Dynamic Import Expressions and webpack 2 Code Splitting integration with TypeScript 2.4](https://blog.josequinto.com/2017/06/29/dynamic-import-expressions-and-webpack-code-splitting-integration-with-typescript-2-4/).
:::

## TypeScript 类型系统

### 概览

#### TypeScript 类型系统

TypeScript 类型系统的主要功能。以下是一些关键点：
- TypeScript 的类型系统被设计为可选的，因此，你的 JavaScript 就是 TypeScript;
- TypeScript 不会阻止 JavaScript 的运行，即使存在类型错误也不例外，这能让你的 JavaScript 逐步迁移至 TypeScript。

现在让我们开始学习 TypeScript 类型系统的语法吧，在这一章节中，你将能给你的代码加上类型注解，并且能看到它的益处。这将为我们进一步了解类型系统做铺垫。

#### 基本注解

如前文所提及，类型注解使用 `:TypeAnnotation` 语法。在类型声明空间中可用的任何内容都可以用作类型注解。

在下面这个例子中，使用了变量、函数参数以及函数返回值的类型注解：
```ts
const num: number = 123;
function identity(num: number): number {
  return num;
}
```

#### 原始类型

JavaScript 原始类型也同样适应于 TypeScript 的类型系统，因此 `string`、`number`、`boolean` 也可以被用作类型注解：
```ts
let num: number;
let str: string;
let bool: boolean;

num = 123;
num = 123.456;
num = '123'; // Error

str = '123';
str = 123; // Error

bool = true;
bool = false;
bool = 'false'; // Error
```

#### 数组

TypeScript 为数组提供了专用的类型语法，因此你可以很轻易的注解数组。它使用后缀 `[]`， 接着你可以根据需要补充任何有效的类型注解（如：`:boolean[]`）。它能让你安全的使用任何有关数组的操作，而且它也能防止一些类似于赋值错误类型给成员的行为。如下所示：
```ts
let boolArray: boolean[];

boolArray = [true, false];
console.log(boolArray[0]); // true
console.log(boolArray.length); // 2

boolArray[1] = true;
boolArray = [false, false];

boolArray[0] = 'false'; // Error
boolArray = 'false'; // Error
boolArray = [true, 'false']; // Error
```

#### 接口

接口是 TypeScript 的一个核心知识，它能合并众多类型声明至一个类型声明：
```ts
interface Name {
  first: string;
  second: string;
}

let name: Name;
name = {
  first: 'John',
  second: 'Doe'
};

name = {
  // Error: 'Second is missing'
  first: 'John'
};

name = {
  // Error: 'Second is the wrong type'
  first: 'John',
  second: 1337
};
```

在这里，我们把类型注解：`first: string` + `second: string` 合并到了一个新的类型注解 `Name` 里，这样能强制对每个成员进行类型检查。接口在 TypeScript 拥有强大的力量，稍后，我们将会用一个内容专门阐述如何更好的使用它。

#### 内联类型注解

与创建一个接口不同，你可以使用内联注解语法注解任何内容：`:{ /*Structure*/ }`：
```ts
let name: {
  first: string;
  second: string;
};

name = {
  first: 'John',
  second: 'Doe'
};

name = {
  // Error: 'Second is missing'
  first: 'John'
};

name = {
  // Error: 'Second is the wrong type'
  first: 'John',
  second: 1337
};
```

内联类型能为你快速的提供一个类型注解。它可以帮助你省去为类型起名的麻烦（你可能会使用一个很糟糕的名称）。然而，如果你发现需要多次使用相同的内联注解时，那么考虑把它重构为一个接口（或者是 `type alias`，它会在接下来的部分提到）是一个不错的主意。

#### 特殊类型

除了被提到的一些原始类型，在 TypeScript 中，还存在一些特殊的类型，它们是 `any`、 `null`、 `undefined` 以及 `void`。

##### any

`any` 类型在 TypeScript 类型系统中占有特殊的地位。它提供给你一个类型系统的「后门」,TypeScript 将会把类型检查关闭。在类型系统里 `any` 能够兼容所有的类型（包括它自己）。因此，所有类型都能被赋值给它，它也能被赋值给其他任何类型。以下有一个证明例子：
```ts
let power: any;

// 赋值任意类型
power = '123';
power = 123;

// 它也兼容任何类型
let num: number;
power = num;
num = power;
```

当你把 JavaScript 迁移至 TypeScript 时，你将会经常性使用 `any`。但你必须减少对它的依赖，因为你需要确保类型安全。当使用 `any` 时，你基本上是在告诉 TypeScript 编译器不要进行任何的类型检查。

##### null 和 undefined

在类型系统中，JavaScript 中的 null 和 undefined 字面量和其他被标注了 `any` 类型的变量一样，都能被赋值给任意类型的变量，如下例子所示：
```ts
// strictNullChecks: false

let num: number;
let str: string;

// 这些类型能被赋予
num = null;
str = undefined;
```

##### void

使用 `:void` 来表示一个函数没有一个返回值
```ts
function log(message: string): void {
  console.log(message);
}
```

#### 范型

在计算机科学中，许多算法和数据结构并不会依赖于对象的实际类型。但是，你仍然会想在每个变量里强制提供约束。例如：在一个函数中，它接受一个列表，并且返回这个列表的反向排序，这里的约束是指传入至函数的参数与函数的返回值：
```ts
function reverse<T>(items: T[]): T[] {
  const toreturn = [];
  for (let i = items.length - 1; i >= 0; i--) {
    toreturn.push(items[i]);
  }
  return toreturn;
}

const sample = [1, 2, 3];
let reversed = reverse(sample);

console.log(reversed); // 3, 2, 1

// Safety
reversed[0] = '1'; // Error
reversed = ['1', '2']; // Error

reversed[0] = 1; // ok
reversed = [1, 2]; // ok
```

在上个例子中，函数 `reverse` 接受一个类型为 `T`（注意在 `reverse<T>` 中的类型参数） 的数组（`items: T[]`），返回值为类型 `T` 的一个数组（注意：`T[]`），函数 `reverse` 的返回值类型与它接受的参数的类型一样。当你传入 `const sample = [1, 2, 3]` 时，TypeScript 能推断出 `reverse` 为 `number[]` 类型，从而能给你类型安全。与此相似，当你传入一个类型为 `string[]` 类型的数组时，TypeScript 能推断 `reverse` 为 `string[]` 类型，如下例子所示：
```ts
const strArr = ['1', '2'];
let reversedStrs = reverse(strArr);

reversedStrs = [1, 2]; // Error
```

事实上，JavaScript 数组已经拥有了 reverse 的方法，TypeScript 也确实使用了泛型来定义其结构：
```ts
interface Array<T> {
  reverse(): T[];
}
```

意味着，当你在数组上调用 `.reverse` 方法时，将会获得类型安全：
```ts
let numArr = [1, 2];
let reversedNums = numArr.reverse();

reversedNums = ['1', '2']; // Error
```

当稍后在 [环境声明](#环境声明) 章节中提及 `lib.d.ts` 时，我们会讨论更多关于 `Array<T>` 的信息。

#### 联合类型

在 JavaScript 中，你可能希望属性为多种类型之一，如字符串或者数组。这正是 TypeScript 中联合类型能派上用场的地方（它使用 `|` 作为标记，如 `string | number`）。关于联合类型，一个常见的用例是一个可以接受字符串数组或单个字符串的函数：
```ts
function formatCommandline(command: string[] | string) {
  let line = '';
  if (typeof command === 'string') {
    line = command.trim();
  } else {
    line = command.join(' ').trim();
  }

  // Do stuff with line: string
}
```

#### 交叉类型

在 JavaScript 中， `extend` 是一种非常常见的模式，在这种模式中，你可以从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能。交叉类型可以让你安全的使用此种模式：
```ts
function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: 'hello' }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

#### 元组类型

JavaScript 并不支持元组，开发者们通常只能使用数组来表示元组。而 TypeScript 支持它，开发者可以使用 `:[typeofmember1, typeofmember2]` 的形式，为元组添加类型注解，元组可以包含任意数量的成员，示例：
```ts
let nameNumber: [string, number];

// Ok
nameNumber = ['Jenny', 221345];

// Error
nameNumber = ['Jenny', '221345'];
```

将其与 TypeScript 中的解构一起使用：
```ts
let nameNumber: [string, number];
nameNumber = ['Jenny', 322134];

const [name, num] = nameNumber;
```

#### 类型别名

TypeScript 提供了为类型注解设置别名的便捷语法，你可以使用 `type SomeName = someValidTypeAnnotation` 来创建别名：
```ts
type StrOrNum = string | number;

// 使用
let sample: StrOrNum;
sample = 123;
sample = '123';

// 会检查类型
sample = true; // Error
```

与接口不同，你可以为任意的类型注解提供类型别名（在联合类型和交叉类型中比较实用），下面是一些能让你熟悉类型别名语法的示例。
```ts
type Text = string | { text: string };
type Coordinates = [number, number];
type Callback = (data: string) => void;
```

:::tip
- 如果你需要使用类型注解的层次结构，请使用接口。它能使用 `implements` 和 `extends`
- 为一个简单的对象类型（如上面例子中的 Coordinates）使用类型别名，只需要给它一个语义化的名字即可。另外，当你想给联合类型和交叉类型提供一个语义化的名称时，一个类型别名将会是一个好的选择。
:::

#### 最后

现在你已经能够为你的大部分 JavaScript 代码添加类型注解，接着，让我们深入了解 TypeScript 的类型系统吧。

### 从JavaScript 迁移

首先，假设如下：
- 你了解 JavaScript；
- 你了解在项目中常用的方式和构建工具（如：webpack）。

有了以上假设，一般来说，将 JavaScript 代码迁移至 TypeScript 包括以下步骤：
- 添加一个 `tsconfig.json` 文件；
- 把文件扩展名从 `.js` 改成 `.ts`，开始使用 `any` 来减少错误；
- 开始在 TypeScript 中写代码，尽可能的减少 `any` 的使用；
- 回到旧代码，开始添加类型注解，并修复已识别的错误；
- 为第三方 JavaScript 代码定义环境声明。

让我们进一步讨论其中的几个关键点。

记住：所有的 JavaScript 代码都是有效的 TypeScript 代码。这意味着，如果让 TypeScript 编译器编译 TypeScript 里的 JavaScript 代码，编译后的结果将会与原始的 JavaScript 代码一模一样。也就是说，把文件扩展名从 `.js` 改成 `.ts` 将不会造成任何负面的影响。

#### 减少错误

代码被迁移至 TypeScript 后，TypeScript 将会立即对你的代码进行类型检查，你的 JavaScript 代码可能并不像想象中那样整齐了，因此你可能会收到一些报错信息。这时，可以使用 any 来解决大部分的报错问题：
```ts
let foo = 123;
let bar = 'hey';

bar = foo; // Error: 不能把 number 类型赋值给 string 类型
```

虽然这些错误是有效的，并且在大多数情况下，根据这些错误所推断出的信息比代码库的不同部分的原始作者想象的更好，但是你的重点是在逐步更新旧代码库的同时，用 TypeScript 编写新代码。在这里，你可以使用类型断言来减少此错误：
```ts
let foo = 123;
let bar = 'hey';

bar = foo as any; // ok
```

从另一方面来说，你可能想用 any 用作类型注解：
```ts
function foo() {
  return 1;
}

let bar = 'hey';
bar = foo(); // Error: 不能把一个 number 类型赋值给 string 类型
```

减少这种错误：
```ts
function foo(): any {
  // 添加 'any'
  return 1;
}

let bar = 'hey';
bar = foo();
```

:::info
使用此种方式来减少错误是危险的，但是它允许你将注意力转移到你的新 TypeScript 代码错误上。当你进行下一步前，最好要留下 `// TODO` 的注释。
:::

#### 第三方代码

你可以将你的 JavaScript 代码改成 TypeScript 代码，但是你不能让整个世界都使用 TypeScript。这正是 TypeScript 环境声明支持的地方。我建议你以创建一个 `vendor.d.ts` 文件作为开始（`.d.ts` 文件扩展名指定这个文件是一个声明文件），然后我向文件里添加东西。或者，你也可以创建一个针对于特定库的声明文件，如为 jquery 创建 `jquery.d.ts` 文件。
:::tip
几乎排名前 90% 的 JavaScript 库的声明文件存在于 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 仓库里，在创建自己定义的声明文件之前，我们建议你先去仓库中寻找是否有对应的声明文件。尽管如此，创建一个声明文件这种快速但不好的方式是减小使用 TypeScript 初始阻力的重要步骤
:::

根据 `jquery` 的使用，你可以非常简单快速的为它创建一个定义：
```ts
declare var $: any;
```

有时，你可能想在某些内容（如 `jQuery`）上添加显式的注解，并且你会在类型声明空间中使用它。你可以通过 type 关键字快速的实现它：
```ts
declare type JQuery = any;
declare var $: JQuery;
```

这提供给你一个更清晰的使用模式。

一个高质量的 jquery.d.ts 已经在 DefinitelyTyped 中存在。现在你已经知道如何在使用第三方 JavaScript 模块时，快速克服从 JavaScript 至 TypeScript 的阻力了。在接下去的章节，我们将会讨论环境声明。

#### 第三方的 NPM 模块

与全局变量声明相似，你可以快速的定义一个全局模块，如：对于 jquery，如果你想把它作为一个模块来使用（[NPM(https://www.npmjs.com/package/jquery)]），可以自己通过以下方式实现：
```ts
declare module 'jquery';
```

然后你就可以在必要时导入它：
```ts
import * as $ from 'jquery';
```

:::tip
再一次说明，一个高质量的 `jquery.d.ts` 已经在 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 中存在，但是可能在你的包里没有，那么，你现在有一个简单快速的方式来继续迁移。
:::

#### 额外的非 JavaScript 资源

在 TypeScript 中，甚至可以允许你导入任何文件，例如 `.css` 文件（如果你使用的是 webpack 样式加载器或 css 模块），你只要添加如下代码（放在 `global.d.ts`）：
```ts
import * as $ from 'jquery';
```

现在你可以使用 `import * as foo from './some/file.css'`。

与此相似，如果你想使用 html 模版（例如：angular），你可以：
```ts
declare module '*.html';
```

### @types

毫无疑问，[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 是 TypeScript 最大的优势之一，社区已经记录了 90% 的顶级 JavaScript 库。

这意味着，你可以非常高效地使用这些库，而无须在单独的窗口打开相应文档以确保输入的正确性。

#### 使用 `@types`

你可以通过 `npm` 来安装使用 `@types`，例如为 `jquery` 添加声明文件：
```shell
npm install @types/jquery --save-dev
```

`@types` 支持全局和模块类型定义。

##### 全局 `@types`

默认情况下，TypeScript 会自动包含支持全局使用的任何声明定义。例如，对于 jquery，你应该能够在项目中开始全局使用 `$`。

##### 模块 `@types`

安装完之后，不需要特别的配置，你就可以像使用模块一样使用它：
```ts
import * as $ from 'jquery';

// 现在你可以此模块中任意使用$了 :)
```

#### 控制全局

可以看出，对于某些团队而言，拥有允许全局使用的定义是一个问题。因此，你可以通过配置 `tsconfig.json` 的 `compilerOptions.types` 选项，引入有意义的类型：
```json
{
  "compilerOptions": {
    "types" : [
      "jquery"
    ]
  }
}
```

如上例所示，通过配置 `compilerOptions.types: [ "jquery" ]` 后，只允许使用 `jquery` 的 `@types` 包，即使这个人安装了另一个声明文件，比如 `npm install @types/node`，它的全局变量（例如 `process`）也不会泄漏到你的代码中，直到你将它们添加到 `tsconfig.json` 类型选项。

### 环境声明

> TypeScript 的设计目标之一是让你在 TypeScript 中安全、轻松地使用现有的 JavaScript 库，TypeScript 通过声明文件来做到这一点

环境声明允许你安全地使用现有的 JavaScript 库，并且能让你的 JavaScript、CoffeeScript 或者其他需要编译成 JavaScript 的语言逐步迁移至 TypeScript。

学习为第三方 JavaScript 库编写环境声明，是一种为 TypeScript 写注解比较好的实践方式

#### 声明文件

你可以通过 declare 关键字来告诉 TypeScript，你正在试图表述一个其他地方已经存在的代码，如：写在 JavaScript、CoffeeScript 或者是像浏览器和 Node.js 运行环境里的代码：
```ts
foo = 123; // Error: 'foo' is not defined
```

和：
```ts
declare var foo: any;
foo = 123; // allow
```

你可以选择把这些声明放入 `.ts` 或者 `.d.ts` 里。在你实际的项目里，我们强烈建议你应该把声明放入独立的 .`d.ts` 里（可以从一个命名为 `global.d.ts` 或者 `vendor.d.ts` 文件开始）。

如果一个文件有扩展名 `.d.ts`，这意味着每个根级别的声明都必须以 `declare` 关键字作为前缀。这有利于让开发者清楚的知道，在这里 TypeScript 将不会把它编译成任何代码，同时开发者需要确保这些在编译时存在。

:::tip
- 环境声明就好像你与编译器之间的一个约定，如果在编译时它们不存在，但是你却使用了它们，程序将会在没有警告的情况下中断。
- 环境声明就好像是一个文档。如果源文件更新了，你应该同步更新。所以，当你在运行时有新的行为时，如果没有去更新环境声明，编译器将会报错。
:::

#### 变量

当你想告诉 TypeScript 编辑器关于 process 变量时，你可以这么做：
```ts
declare let process: any;
```

:::tip
你并不需要为 `process` 做这些，因为这已经存在于社区维护的 [`node.d.ts`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/index.d.ts)
:::

这允许你使用 `process`，并能成功通过 TypeScript 的编译：
```ts
process.exit();
```

我们推荐尽可能的使用接口，例如：
```ts
interface Process {
  exit(code?: number): void;
}

declare let process: Process;
```

因为这允许其他人扩充这些全局变量，并且会告诉 TypeScript 有关于这些声明的修改。例如：考虑到以下情况，我们添加一个 `exitWithLogging` 函数至 `process`：
```ts
interface Process {
  exitWithLogging(code?: number): void;
}

process.exitWithLogging = function() {
  console.log('exiting');
  process.exit.apply(process, arguments);
};
```

接下来，让我们更详细的了解接口。

### 接口

接口运行时的影响为 0。在 TypeScript 接口中有很多方式来声明变量的结构。

下面两个是等效的声明, 示例 A 使用内联注解，示例 B 使用接口形式：
```ts
// 示例 A
declare const myPoint: { x: number; y: number };

// 示例 B
interface Point {
  x: number;
  y: number;
}
declare const myPoint: Point;
```

示例 B 的好处在于，如果有人创建了一个基于 `myPoint` 的库来添加新成员, 那么他可以轻松将此成员添加到 `myPoint` 的现有声明中:
```ts
// Lib a.d.ts
interface Point {
  x: number,
  y: number
}
declare const myPoint: Point

// Lib b.d.ts
interface Point {
  z: number
}

// Your code
myPoint.z // Allowed!
```

TypeScript 接口是开放式的，这是 TypeScript 的一个重要原则，它允许你使用接口来模仿 JavaScript 的可扩展性。

#### 类可以实现接口

如果你希望在类中使用必须要被遵循的接口（类）或别人定义的对象结构，可以使用 `implements` 关键字来确保其兼容性：
```ts
interface Point {
  x: number;
  y: number;
}

class MyPoint implements Point {
  x: number;
  y: number; // Same as Point
}
```

基本上，在 `implements`（实现） 存在的情况下，该外部 `Point` 接口的任何更改都将导致代码库中的编译错误，因此可以轻松地使其保持同步：
```ts
interface Point {
  x: number;
  y: number;
  z: number; // New member
}

class MyPoint implements Point {
  // ERROR : missing member `z`
  x: number;
  y: number;
}

```

注意，`implements` 限制了类实例的结构，如下所示:
```ts
let foo: Point = new MyPoint();
```

但像 `foo: Point = MyPoint` 这样的代码，与其并不是一回事。

#### 注意

##### 并非每个接口都是很容易实现的

接口旨在声明 JavaScript 中可能存在的任意结构。

思考以下例子，可以使用 `new` 调用某些内容：
```ts
interface Crazy {
  new (): {
    hello: number;
  };
}
```

你可能会有下面这样的代码：
```ts
class CrazyClass implements Crazy {
  constructor() {
    return { hello: 123 };
  }
}

// Because
const crazy = new CrazyClass(); // crazy would be { hello:123 }

// 运行报错，因为TS类型检查不会对constructor检查，只会检查和实例相关的属性和方法
```

:::tip 正常运行
```ts
interface Crazy {
  new (): {
    hello: number;
  };
}
interface ICrazyClass {
  hello: number;
}
class CrazyClass implements Crazy {
  hello: number
  constructor() {
    this.hello = 123
  }
}

function ct1(ct: Crazy) {
  return new ct()
}

// Because
const crazy = ct1(CrazyClass);
```
:::

你可以使用接口声明所有“疯狂的”的 JavaScript 代码，甚至可以安全地在 TypeScript 中使用它们。但这并不意味着你可以使用 TypeScript 类来实现它们。

### 枚举

枚举是组织收集有关联变量的一种方式，许多程序语言（如：c/c#/Java）都有枚举数据类型。下面是定义一个 TypeScript 枚举类型的方式：
```ts
enum CardSuit {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// 简单的使用枚举类型
let Card = CardSuit.Clubs;

// 类型安全
Card = 'not a member of card suit'; // Error: string 不能赋值给 `CardSuit` 类型
```

这些枚举类型的值都是数字类型，因此它们被称为数字类型枚举。

#### 数字类型枚举与数字类型

数字类型枚举，允许我们将数字类型或者其他任何与数字类型兼容的类型赋值给枚举类型的实例。
```ts
enum Color {
  Red,
  Green,
  Blue
}

let col = Color.Red;
col = 0; // 有效的，这也是 Color.Red
```

#### 数字类型枚举与自负床类型

在我们继续深入学习枚举类型之前，先来看看它编译的 JavaScript 吧，以下是一个简单的 TypeScript 枚举类型：
```ts
enum Tristate {
  False,
  True,
  Unknown
}
```

其被编译成 JavaScript 后如下所示：
```ts
var Tristate;
(function(Tristate) {
  Tristate[(Tristate['False'] = 0)] = 'False';
  Tristate[(Tristate['True'] = 1)] = 'True';
  Tristate[(Tristate['Unknown'] = 2)] = 'Unknown';
})(Tristate || (Tristate = {}));
```

先让我们聚焦 `Tristate[Tristate['False'] = 0] = 'False'` 这行代码，其中 `Tristate['False'] = 0`的意思是将 `Tristate` 对象里的 `False` 成员值设置为 `0`。注意，JavaScript 赋值运算符返回的值是被赋予的值（在此例子中是 `0`），因此下一次 JavaScript 运行时执行的代码是 `Tristate[0] = 'False'`。意味着你可以使用 `Tristate` 变量来把字符串枚举类型改造成一个数字或者是数字类型的枚举类型，如下所示：
```ts
enum Tristate {
  False,
  True,
  Unknown
}

console.log(Tristate[0]); // 'False'
console.log(Tristate['False']); // 0
console.log(Tristate[Tristate.False]); // 'False' because `Tristate.False == 0`
```

#### 改变与数字枚举关联的数字

默认情况下，第一个枚举值是 `0`，然后每个后续值依次递增 1：
```ts
enum Color {
  Red, // 0
  Green, // 1
  Blue // 2
}
```

但是，你可以通过特定的赋值来改变给任何枚举成员关联的数字，如下例子，我们从 3 开始依次递增：
```ts
enum Color {
  DarkRed = 3, // 3
  DarkGreen, // 4
  DarkBlue // 5
}
```

:::tip
我通常用 `= 1` 初始化，因为在枚举类型值里，它能让你做一个安全可靠的检查。
:::

#### 使用数字类型作为标志

枚举的一个很好用途是使用枚举作为标志。这些标志允许你检查一组条件中的某个条件是否为真。考虑如下代码例子，我们有一组关于 animals 的属性：
```ts
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1,
  EatsFish    = 1 << 2,
  Endangered  = 1 << 3
}
```

在这里，我们使用了左移的位运算符，将数字 `1` 的二进制向左移动位置得到数字 `0001`、`0010`、`0100` 和 `1000`（换成十进制结果是：1, 2, 4, 8）。当你在使用这种标记的时候，这些位运算符 `|` (或)、`&` （和）、`~ `（非）将会是你最好的朋友：
```ts
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1
}

interface Animal {
  flags: AnimalFlags;
  [key: string]: any;
}

function printAnimalAbilities(animal: Animal) {
  var animalFlags = animal.flags;
  if (animalFlags & AnimalFlags.HasClaws) {
    console.log('animal has claws');
  }
  if (animalFlags & AnimalFlags.CanFly) {
    console.log('animal can fly');
  }
  if (animalFlags == AnimalFlags.None) {
    console.log('nothing');
  }
}

var animal = { flags: AnimalFlags.None };
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws;
printAnimalAbilities(animal); // animal has claws
animal.flags &= ~AnimalFlags.HasClaws;
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal has claws, animal can fly
```

在这里：
- 我们使用 `|=` 来添加一个标志；
- 组合使用 `&=` 和 `~` 来清理一个标志；
- `|` 来合并标志。

```ts
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1,
  EatsFish    = 1 << 2,
  Endangered  = 1 << 3,

  EndangeredFlyingClawedFishEating = HasClaws | CanFly | EatsFish | Endangered
}
```

#### 字符串枚举

在上文中，我们只看到了数字类型的枚举，实际上，枚举类型的值，也可以是字符串类型。
```ts
export enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card'
}
```

这些可以更容易被处理和调试，因为它们提供有意义/可调试的字符串。

你可以使用它们用于简单的字符串比较：
```ts
// Where `someStringFromBackend` will be '' | 'passport_visa' | 'passport' ... etc.
const someStringFromBackend: string = "passport"
const value = someStringFromBackend as EvidenceTypeEnum;

// Sample use in code
if (value === EvidenceTypeEnum.PASSPORT) {
  console.log('You provided a passport');
  console.log(value); // `passport`
}
```

#### 常量枚举

```ts
enum Tristate {
  False,
  True,
  Unknown
}

const lie = Tristate.False;
```

`const lie = Tristate.False` 会被编译成 JavaScript `let lie = Tristate.False` (是的，编译后与编译前，几乎相同)。这意味着在运行执行时，它将会查找变量 `Tristate` 和 `Tristate.False`。在此处获得性能提升的一个小技巧是使用常量枚举：
```ts
const enum Tristate {
  False,
  True,
  Unknown
}

const lie = Tristate.False;
```

将会被编译成：
```ts
let lie = 0;
```

编译器将会：
- 内联枚举的任何用法（`0` 而不是 `Tristate.False`）；
- 不会为枚举类型编译成任何 JavaScript（在这个例子中，运行时没有 `Tristate` 变量），因为它使用内联语法。

##### 常量枚举 `preserveConstEnums` 选项

使用内联语法对性能有明显的提升作用。运行时没有 `Tristate` 变量的事实，是因为编译器帮助你把一些在运行时没有用到的不编译成 JavaScript。然而，你可能想让编译器仍然把枚举类型编译成 JavaScript，用于如上例子中从字符串到数字，或者是从数字到字符串的查找。在这种情景下，你可以使用编译选项 `--preserveConstEnums`，它会编译出 `var Tristate` 的定义，因此你在运行时，手动使用 `Tristate['False']` 和 `Tristate[0]`。并且这不会以任何方式影响内联。

#### 有静态方法的枚举

你可以使用 `enum` + `namespace` 的声明的方式向枚举类型添加静态方法。如下例所示，我们将静态成员 `isBusinessDay` 添加到枚举上：
```ts
enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

namespace Weekday {
  export function isBusinessDay(day: Weekday) {
    switch (day) {
      case Weekday.Saturday:
      case Weekday.Sunday:
        return false;
      default:
        return true;
    }
  }
}

const mon = Weekday.Monday;
const sun = Weekday.Sunday;

console.log(Weekday.isBusinessDay(mon)); // true
console.log(Weekday.isBusinessDay(sun));
```

#### 开放式枚举

:::tip
你只有在不使用模块时，开放式的枚举才有意义，你应该使用模块，因此这部分在文章最后。
:::

让我们再一次看看编译成 JavaScript 的枚举是什么样子：
```ts
var Tristate;
(function(Tristate) {
  Tristate[(Tristate['False'] = 0)] = 'False';
  Tristate[(Tristate['True'] = 1)] = 'True';
  Tristate[(Tristate['Unknown'] = 2)] = 'Unknown';
})(Tristate || (Tristate = {}));
```

我们已经解释了 `Tristate[Tristate['False'] = 0] = 'False'` 部分，现在我们来看看包裹函数 `(function (Tristate) { /* code here */})(Tristate || (Tristate = {}))`，特别是 `(Tristate || (Tristate = {}))` 部分。这捕获了一个局部变量 `TriState`，它要么指向已经定义的 `TriState` 值，要么使用一个新的空对象来初始化它。

这意味着你可以跨多个文件拆分（和扩展）枚举定义，如下所示，你可以把 `Color` 的定义拆分至两个块中：
```ts
enum Color {
  Red,
  Green,
  Blue
}

enum Color {
  DarkRed = 3,
  DarkGreen,
  DarkBlue
}
```

:::tip
你应该在枚举的延续块中，重新初始化第一个成员（此处为 `DarkRed = 3`），使生成的代码不破坏先前定义的值（即0、1...等值）。如果您仍然不这样做，TypeScript 将会发出警告（错误信息：`In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.`）。
:::

### `lib.d.ts`

当你安装 `TypeScript` 时，会顺带安装一个 `lib.d.ts` 声明文件。这个文件包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明。
- 它自动包含在 `TypeScript` 项目的编译上下文中；
- 它能让你快速开始书写经过类型检查的 JavaScript 代码。

你可以通过指定 `--noLib` 的编译器命令行标志（或者在 `tsconfig.json` 中指定选项 `noLib: true`）从上下文中排除此文件。

#### 使用例子

看如下例子：
```ts
const foo = 123;
const bar = foo.toString();
```

这段代码的类型检查正常，因为 `lib.d.ts` 为所有 JavaScript 对象定义了 `toString` 方法。

如果你在 `noLib` 选项下，使用相同的代码，这将会出现类型检查错误：
```ts
const foo = 123;
const bar = foo.toString(); // Error: 属性 toString 不存在类型 number 上
```

现在你已经理解了 `lib.d.ts` 的重要性，至于它的内容是怎么样的，我们接下来将会解释。

#### 观察 `lib.d.ts` 的内容

`lib.d.ts` 的内容主要是一些变量声明（如：`window`、`document`、`math`）和一些类似的接口声明（如：`Window`、`Document`、`Math`）。

寻找代码类型（如：`Math.floor`）的最简单方式是使用 IDE 的 `F12`（跳转到定义）。

让我们来看一个变量声明的示例，如 `window` 被定义为：
```ts
declare var window: Window;
```

这只是一个简单的 `declare var`，后面跟一个变量名称（`window`）和一个用来类型注解的接口（`Window`），这些变量通常指向一些全局的接口，例如，以下是 `Window` 接口的一小部分：
```ts
interface Window
  extends EventTarget,
    WindowTimers,
    WindowSessionStorage,
    WindowLocalStorage,
    WindowConsole,
    GlobalEventHandlers,
    IDBEnvironment,
    WindowBase64 {
  animationStartTime: number;
  applicationCache: ApplicationCache;
  clientInformation: Navigator;
  closed: boolean;
  crypto: Crypto;
  // so on and so forth...
}
```

你可以在这些接口里看到大量的类型信息，当你不使用 TypeScript 时，你需要将它们保存在你的大脑里。现在你可以使用 `intellisense` 之类东西，从而可以减少对知识的记忆。

使用这些全局变量是有利的。在不更改 `lib.d.ts` 的情况下，它可以让你添加额外的属性。接下来，我们将介绍这些概念。

#### 修改原始类型

在 TypeScript 中，接口是开放式的，这意味着当你想使用不存在的成员时，只需要将它们添加至 `lib.d.ts` 中的接口声明中即可，TypeScript 将会自动接收它。注意，你需要在[全局模块](#全局模块)中做这些修改，以使这些接口与 `lib.d.ts` 相关联。我们推荐你创建一个称为 `global.d.ts` 的特殊文件。

这里有我们需要添加至 `Window`，`Math`，`Date` 的一些例子：

##### Window

仅仅是添加至 `Window` 接口：
```ts
interface Window {
  helloWorld(): void;
}
```

这将允许你以类型安全的形式使用它：
```ts
// Add it at runtime
window.helloWorld = () => console.log('hello world');

// Call it
window.helloWorld();

// 滥用会导致错误
window.helloWorld('gracius'); // Error: 提供的参数与目标不匹配
```

##### Math

全局变量 `Math` 在 `lib.d.ts` 中被定义为：
```ts
/** An intrinsic object that provides basic mathematics functionality and constants. */
declare var Math: Math;
```

即变量 Math 是 Math 的一个实例，Math 接口被定义为：
```ts
interface Math {
  E: number;
  LN10: number;
  // others ...
}
```

当你想在 `Math` 全局变量上添加你需要的属性时，你只需要把它添加到 `Math` 的全局接口上即可，例如：在[seedrandom Project](https://www.npmjs.com/package/seedrandom)项目里，它添加了 `seedrandom` 函数至全局的 `Math` 对象上，这很容易被声明：
```ts
interface Math {
  seedrandom(seed?: string): void;
}
```

你可以像下面一样使用它：
```ts
Math.seedrandom();

Math.seedrandom('Any string you want');
```

##### Date

如果你在 `lib.d.ts` 中寻找 `Date` 定义的声明，你将会找到如下代码：
```ts
declare var Date: DateConstructor;
```

接口 `DateConstructor` 与上文中 `Math` 和 `Window` 接口一样，它涵盖了可以使用的 `Date` 全局变量的成员（如：`Date.now()`）。除此之外，它还包含了可以让你创建 `Date` 实例的构造函数签名（如：`new Date()`）。`DateConstructor` 接口的一部分代码如下所示：
```ts
interface DateConstructor {
  new (): Date;
  // 一些其他的构造函数签名

  now(): number;

  // 其他成员函数
}
```

在 [datejs](https://github.com/abritinthebay/datejs) 里，它在 Date 的全局变量以及 Date 实例上同时添加了成员，因此这个库的 TypeScript 定义看起来像如下所示（社区已经[定义](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/datejs/index.d.ts)好了）：
```ts
// DateJS 公开的静态方法
interface DateConstructor {
  /** Gets a date that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM) */
  today(): Date;
  // ... so on and so forth
}

// DateJS 公开的实例方法
interface Date {
  /** Adds the specified number of milliseconds to this instance. */
  addMilliseconds(milliseconds: number): Date;
  // ... so on and so forth
}
```

这允许你在类型安全的情况下做：
```ts
const today = Date.today();
const todayAfter1second = today.addMilliseconds(1000);
```

##### string

如果你在 `lib.d.ts` 里寻找 `string`，你将会找到与 `Date` 相类似的内容（全局变量 `String`，StringConstructor 接口，`String` 接口）。但值得注意的是，`String` 接口也会影响字符串字面量，如下所示：
```ts
interface String {
  endsWith(suffix: string): boolean;
}

String.prototype.endsWith = function(suffix: string): boolean {
  const str: string = this;
  return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
};

console.log('foo bar'.endsWith('bas')); // false
console.log('foo bas'.endsWith('bas')); // true
```

##### 终极 string

基于可维护性，我们推荐创建一个 `global.d.ts` 文件。然而，如果你愿意，你可以通过使用 `declare global { /* global namespace */ }`，从文件模块中进入全局命名空间：
```ts
// 确保是模块
export {};

declare global {
  interface String {
    endsWith(suffix: string): boolean;
  }
}

String.prototype.endsWith = function(suffix: string): boolean {
  const str: string = this;
  return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
};

console.log('foo bar'.endsWith('bas')); // false
console.log('foo bas'.endsWith('bas')); // true
```

#### 使用你自己定义的 lib.d.ts

正如上文所说，使用 `--noLib` 编译选项会导致 TypeScript 排除自动包含的 `lib.d.ts` 文件。为什么这个功能是有效的，我例举了一些常见原因：
- 运行的 JavaScript 环境与基于标准浏览器运行时环境有很大不同；
- 你希望在代码里严格的控制全局变量，例如：`lib.d.ts` 将 `item` 定义为全局变量，你不希望它泄漏到你的代码里。

一旦你排除了默认的 `lib.d.ts` 文件，你就可以在编译上下文中包含一个命名相似的文件，TypeScript 将提取该文件进行类型检查。

:::tip
小心使用 `--noLib` 选项，一旦你使用了它，当你把你的项目分享给其他人时，它们也将被迫使用 `--noLib` 选项，更糟糕的是，如果将这些代码放入你的项目中，你可能需要将它们移植到基于你的代码的 `lib` 中。
:::

#### 编译目标对 `lib.d.ts` 的影响

设置编译目标为 `es6` 时，能导致 `lib.d.ts` 包含更多像 Promise 现代（es6）内容的环境声明。编译器目标的这种作用，改变了代码的环境，这对某些人来说是理想的，但是这对另外一些人来说造成了困扰，因为它将编译出的代码与环境混为一谈。

当你想对环境进行更细粒的控制时，你应该使用我们接下来将要讨论的 `--lib` 选项。

#### `--lib` 选项

有时，你想要解耦编译目标（即生成的 JavaScript 版本）和环境库支持之间的关系。例如对于 Promise，你的编译目标是 `--target es5`，但是你仍然想使用它，这时，你可以使用 `lib` 对它进行控制。

:::tip
使用 --lib 选项可以将任何 lib 与 --target 解耦。
:::

你可以通过命令行或者在 `tsconfig.json` 中提供此选项（推荐）：

##### 命令行

```shell
tsc --target es5 --lib dom,es6
```

##### config.json

```json
"compilerOptions": {
  "lib": ["dom", "es6"]
}
```

`lib` 分类如下：
- JavaScript 功能
  - es5
  - es6
  - es2015
  - es7
  - es2016
  - es2017
  - esnext
- 运行环境
  - dom
  - dom.iterable
  - webworker
  - scripthost
- ESNext 功能选项
  - es2015.core
  - es2015.collection
  - es2015.generator
  - es2015.iterable
  - es2015.promise
  - es2015.proxy
  - es2015.reflect
  - es2015.symbol
  - es2015.symbol.wellknown
  - es2016.array.include
  - es2017.object
  - es2017.sharedmemory
  - esnext.asynciterable

:::tip
`--lib` 选项提供非常精细的控制，因此你最有可能从运行环境与 JavaScript 功能类别中分别选择一项，如果你没有指定 `--lib`，则会导入默认库：

- `--target` 选项为 es5 时，会导入 es5, dom, scripthost。
- `--target` 选项为 es6 时，会导入 es6, dom, dom.iterable, scripthost。
:::

我个人的推荐：
```json
"compilerOptions": {
  "target": "es5",
  "lib": ["es6", "dom"]
}
```

包括使用 Symbol 的 ES5 使用例子：
```json
"compilerOptions": {
  "target": "es5",
  "lib": ["es5", "dom", "scripthost", "es2015.symbol"]
}
```

#### 在旧的 JavaScript 引擎时使用 Polyfill

要使用一些新功能如 `Map`、`Set`、`Promise`（随着时间推移会变化），你可以使用现代的 `lib` 选项，并且需要安装 `core-js`：
```shell
npm install core-js --save-dev
```

接着，在你的项目里导入它：
```ts
import 'core-js';
```

### 函数

#### 参数注解

##### 返回类型注解

##### 可选参数

##### 重载

##### 函数声明

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
