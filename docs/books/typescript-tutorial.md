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

[TypeScript 入门教程](https://ts.xcatliu.com/)

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

原始数据类型包括：`boolean`、`number`、`string`、`null`、`undefined` 以及 ES6 中的新类型 `[Symbol](https://es6.ruanyifeng.com/#docs/symbol)` 和 ES10 中的新类型 `[BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)`。

本节主要介绍`前五种`原始数据类型在 TypeScript 中的应用。

- Boolean



- Number


- String


- Null


- Undefined



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


