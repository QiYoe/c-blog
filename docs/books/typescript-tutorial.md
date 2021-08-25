---
title: TypeScript 入门教程
head:
  - - meta
    - name: description
      content: TypeScript 入门教程 TS
  - - meta
    - name: keywords
      content: TypeScript 入门教程 TS
---

## 前置准备

### 安装 TypeScript

```shell
# yarn安装
yarn global add typescript

# npm安装
npm install -g typescript
```

以上命令会在全局环境下安装 tsc 命令，安装完成之后，我们就可以在任何地方执行 tsc 命令了。

编译 TypeScript 文件:
```shell
tsc hello.ts
```

### Hello TypeScript

将以下代码复制到 hello.ts 中：

```ts
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```

然后执行

```shell
tsc hello.ts
```

这时候会生成一个编译好的文件 hello.js：

```js
function sayHello(person) {
  return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```

在 TypeScript 中，我们使用 : 指定变量的类型，: 的前后有没有空格都可以。

上述例子中，我们用 : 指定 person 参数类型为 string。但是编译为 js 之后，并没有什么检查的代码被插入进来。

这是**因为 TypeScript 只会在编译时对类型进行静态检查，如果发现有错误，编译的时候就会报错**。而在运行时，与普通的 JavaScript 文件一样，不会对类型进行检查。

如果我们需要保证运行时的参数类型，还是得手动对类型进行判断：

```ts
function sayHello(person: string) {
  if (typeof person === 'string') {
    return 'Hello, ' + person;
  } else {
    throw new Error('person is not a string');
  }
}

let user = 'Tom';
console.log(sayHello(user));
```

下面尝试把这段代码编译一下：
```ts
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = [0, 1, 2];
console.log(sayHello(user));
```

编辑器中会提示错误，编译的时候也会出错：
```shell
hello.ts:6:22 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

但是还是生成了 js 文件：

这是因为 **TypeScript 编译的时候即使报错了，还是会生成编译结果**，我们仍然可以使用这个编译之后的文件。

如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。

## 基础

### 原始数据类型

JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。

原始数据类型包括：`boolean`、`number`、`string`、`null`、`undefined` 以及 ES6 中的新类型 [Symbol](https://es6.ruanyifeng.com/#docs/symbol) 和 ES10 中的新类型 [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。

本节主要介绍`前五种`原始数据类型在 TypeScript 中的应用。

- boolean

布尔值是最基础的数据类型，在 TypeScript 中，使用 `boolean` 定义布尔值类型：

```ts
let isDone: boolean = false;

// 编译通过
// 后面约定，未强调编译错误的代码片段，默认为编译通过
```

注意，使用构造函数 `Boolean` 创造的对象不是布尔值：

```ts
let createdByNewBoolean: boolean = new Boolean(1);

// Type 'Boolean' is not assignable to type 'boolean'.
// 'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when possible.
```

事实上 new Boolean() 返回的是一个 Boolean 对象：

```ts
let createdByNewBoolean: Boolean = new Boolean(1);
```

直接调用 Boolean 也可以返回一个 boolean 类型：

```ts
let createdByBoolean: boolean = Boolean(1);
```

在 TypeScript 中，`boolean` 是 JavaScript 中的基本类型，而 `Boolean` 是 JavaScript 中的构造函数。其他基本类型（除了 `null` 和 `undefined`）一样，不再赘述。

- number

使用 `number` 定义数值类型：

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

编译结果：

```js
var decLiteral = 6;
var hexLiteral = 0xf00d;
// ES6 中的二进制表示法
var binaryLiteral = 10;
// ES6 中的八进制表示法
var octalLiteral = 484;
var notANumber = NaN;
var infinityNumber = Infinity;
```

- string

使用 `string` 定义字符串类型：

```ts
let myName: string = 'Tom';
let myAge: number = 25;

// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```

编译结果：

```js
var myName = 'Tom';
var myAge = 25;
// 模板字符串
var sentence = "Hello, my name is " + myName + ".
I'll be " + (myAge + 1) + " years old next month.";
```

- void

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数：

```ts
function alertName(): void {
  alert('My name is Tom');
}
```

声明一个 `void` 类型的变量没有什么用，因为你只能将它赋值为 `undefined` 和 `null`（只在 --strictNullChecks 未指定时）：

```ts
// "strict": true
//会报错 不能将类型“null”分配给类型“void”
let unusable: void = null;
//不会报错
let unusable: void = undefined;
```

- `null` 和 `undefined`

在 TypeScript 中，可以使用 `null` 和 `undefined` 来定义这两个原始数据类型：

```ts
let u: undefined = undefined;
let n: null = null;
```

与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量：

```ts
// "strict": true
// 这样不会报错
let num: number = undefined;
// Type 'undefined' is not assignable to type 'number'.

// 这样也不会报错
let u: undefined;
let num: number = u;
// Type 'undefined' is not assignable to type 'number'.
```

```warning
声明变量的数据类型为 void 时，非严格模式下，变量的值可以为 undefined 或 null。而严格模式下，变量的值只能为 undefined。
```

而 `void` 类型的变量不能赋值给 `number` 类型的变量：

```ts
let u: void;
let num: number = u;

// Type 'void' is not assignable to type 'number'.
```

### 任意值

### 类型推论

### 联合类型

### 对象的类型—接口

### 数组的类型

### 函数的类型

### 类型断言

### 声明文件

### 内置对象

## 进阶

### 类型别名

### 字符串字面量类型

### 元组

### 枚举

### 类

### 类与接口

### 泛型

### 声明合并

### 扩展阅读

## 工程

### 代码检查

### 编译选项

> 摘自[TypeScript 入门教程](https://ts.xcatliu.com/)
