---
title: 你不知道的JavaScript
head:
  - - meta
    - name: description
      content: you-dont-know-JS读书笔记
  - - meta
    - name: keywords
      content: 你不知道的JavaScript you-dont-know-JS 你不知道的JS 读书笔记
---

## 作用域和闭包

### 作用域是什么

首先介绍传统编译语言“编译”步骤：

- 分词：把我们编写的代码分解。比如var a = 2;，会分解成var、a、=、2、；空格的分解与否取决于空格在语言中有没有意义
- 解析：把上一步分解得到的词法单元流（数组）根据嵌套关系（作用域）组成“抽象语法树”（AST）
- 生成代码：将AST转为机器可执行指令

**总结：将编写的代码转换位AST，生成机器可执行指令，最后机器执行指令`创建变量、存储变量等`，实际上JavaScript编译过程也类似如此**

其次介绍js执行程序的“打工人”

- 引擎：项目经理，从头到尾参与整个编译和`执行`过程
- 编译器：苦逼程序员，上边编译过程就是它负责处理
- 作用域：产品经理，定义一套规则，规定当前执行代码对声明标识符的访问权限
  
当来一个新项目时（执行var a = 2;），程序员就要和产品经理开始沟通（撕逼：自行脑部吧🤭）

代码生成阶段编译器处理var a = 2;流程：

- 看到var a，编译器询问`当前作用域`是否已存在a，存在，则忽略它，继续编译；不存在，则在当前作用域声明变量a：`undefined`（**编译器在当前作用域活动**）
- 然后编译器生成引擎运行所需代码（处理a = 2）。引擎运行编译器处理之后的a = 2：引擎询问当前作用域是否已存在a，存在，则使用此a赋值；不存在，则在向上作用域查找a（**引擎在作用域链活动**）
  - 类似a = 2这种查找赋值操作`目标`是LHS查询（**引擎查找**）
    - 查询不到时：正常模式-不会报错（**自动生成全局属性a**）；严格模式-ReferenceError
    - 查到但进行不合理操作（比如获取null或undefined的子属性）：TypeError
  - 类似console.log(2)这种查找赋值操作`源头`是RHS查询（查询不到时：ReferenceError）（**引擎查找**）

**总结：变量赋值时，首先编译器在当前作用域中声明一个变量`如果之前没声明过`，然后引擎运行时在作用域中查找该变量，能找到就赋值，找不到则抛出异常（此处说的是严格模式，正常模式下不会报错）**

作用域链：作用域层层嵌套（比如函数嵌套函数）。当前作用域中找不到某变量，引擎就会向外层作用域层层查找，直到找到该变量或是在最外层的全局作用域中也没找到时停止查找

### 词法作用域

作用域有两种工作模型：

- 词法作用域（最为普遍）--定义在词法阶段的作用域（也就是说作用域在写代码时就已经决定好了--大部分情况下是这样）
  - 词法阶段：即[上一节](#作用域是什么)说到的`分词`
  - 查找：引擎执行代码，作用域（作用域气泡更容易理解）层层向上查找变量--`遮蔽效应`（作用域查找匹配到第一个标识符时停止，即内部标识符”屏蔽“了外部标识符）
  - 欺骗词法：打破定义在词法阶段的作用域的规则（非常不建议使用：影响性能）
    - eval：在运行修改书写期的词法作用域
    - with（废弃）
- 动态作用域（比如Bash、Perl）

### 函数作用域和块作用域

- 函数作用域--不多说，函数内部形成函数自身的作用域（即函数外部无法访问函数内部变量）
  - 函数声明--function foo()开头
  - 函数表达式--非function()开头`(function foo(){...}())或foo()`
    - 匿名（不建议）
    - 具名
      - IIFE（立即执行函数）(也是函数，即内部变量不是全局变量)
- 块作用域：{}（**if条件语句不算块**）
  - try/catch：catch会创建一个块作用域
  - let、const

**总结：任何声明在某个作用域内的变量，都将`附属于这个作用域`**

### 提升

引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来，[词法作用域](#词法作用域)核心内容（**针对当前作用域**）

函数优先：函数会首先被提升，然后才是变量（**同名的函数声明和变量声明不提升规则方式进行覆盖**）

:::warning 提醒
**if语句中的var会`提升`到外层作用域，即使if条件不成立**
:::

### 作用域闭包

启示：**JavaScript中闭包无所不在，你只需要能够识别并拥抱它**

`在自己定义的词法作用域以外的地方执行，此时该作用域并未被销毁`

## this和对象原型

### 关于this

::: warning

- this作用：被自动定义在所有函数的作用域中，隐式传递上下文对象
- this不指向函数词法作用域：即函数书写时的上下文
- this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用
:::

### this全面解析

- 调用位置：调用位置就是函数在代码中被调用的位置（而不是声明的位置）
  - 调用栈：为了到达当前执行位置所调用的所有函数（在当前正在执行的函数的前一个调用）
  - 绑定规则：
    - 默认绑定：独立函数调用——this指向全局对象
      - 严格模式：与函数调用位置无关：
        - 函数内严格模式下的this指向undefined
        - 严格模式运行函数，函数内this指向函数声明的上下文
      - 正常模式：**不带任何修饰进行调用**
    - 隐式绑定：调用位置是否有上下文对象。比如obj 对象“拥有”或者“包含”函数时，函数中的this会绑定到obj上下文对象
      - 隐式丢失：即默认绑定（函数引用的只是地址）
    - 显示绑定：直接指定this的绑定对象
      - call、apply：如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作this的绑定对象，这个原始值会被转换成它的对象形式（也就是 new String(..)、new Boolean(..) 或者new Number(..)）。这通常被称为“装箱”（**无法解决隐式丢失问题**）
      - 硬绑定：函数内部执行call、apply绑定，后面执行此函数的任何绑定操作都会无效
    - new绑定：
      1. **创建（或者说构造）一个全新的对象**
      2. **这个新对象会被执行 [[ 原型 ]] 连接**
      3. **这个新对象会绑定到函数调用的 this**
      4. **如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象**
    - 箭头函数：函数内部创建的箭头函数会捕获调用时此函数的this。箭头函数的绑定无法被修改（new 也不行！）
    - 优先级：
      1. 函数是否在 new 中调用（new 绑定）？如果是的话 this 绑定的是新创建的对象。**var bar = new foo()**
      2. 函数是否通过 call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。**var bar = foo.call(obj)**
      3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。**var bar = obj.foo()**
      4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。**var bar = foo()**
  - 绑定例外：即当call、apply、bind的参数时null、undefined时，绑定全局。建议使用`const ф = Object.create(null)`创建一个没有prototype的{}
    - 软绑定：给默认绑定指定一个全局对象和 undefined 以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改 this 的能力
- 声明位置：函数书写时声明的位置（可能会考虑变量提升）

``` js
function baz() {
  // 当前调用栈是：baz
  // 因此，当前调用位置是全局作用域
  console.log( "baz" );
  bar(); // <-- bar 的调用位置
}
function bar() {
  // 当前调用栈是 baz -> bar
  // 因此，当前调用位置在 baz 中
  console.log( "bar" );
  foo(); // <-- foo 的调用位置
}
function foo() {
  // 当前调用栈是 baz -> bar -> foo
  // 因此，当前调用位置在 bar 中
  console.log( "foo" );
}
baz(); // <-- baz 的调用位置
```

### 对象

6中基本类型：string、number、boolean、null、undefined、object

语言bug：typeof null === 'object'`在JS中二进制的前三位为0判为object，而null全是0，所以会返回'object'`

内置对象：String、Number、Boolean、Object、Function、Array、Date、RegExp、Error

键值：在引擎内部，这些值的存储方式是多种多样的，一般并不会存在对象容器内部。存储在对象容器内部的是这些属性的名称，它们就像指针（从技术角度来说就是引用）一样，指向这些值真正的存储位置

- 属性访问：. `满足标识符命名规范`
  - 属性名永远都是字符串（如果你使用 string（字面量）以外的其他值作为属性名，那它首先会被转换为一个字符串`数字也不例外`）
- 键访问：[] `可见接受任意UTF-8/Unicode`

```js
var myObject = { };
myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";
myObject["true"]; // "foo"
myObject["3"]; // "bar"
myObject["[object Object]"]; // "baz"
```

如果你试图向数组添加一个属性，但是属性名“看起来”像一个数字，那它会变成
一个数值下标（因此会修改数组的内容而不是添加一个属性）

- 浅拷贝：复制引用地址`Object.assign()（实际是使用=操作符赋值）`
- 深拷贝：json安全时`JSON.parse(JSON.stringify())`

- 属性描述符：Object.getOwnPropertyDescriptor( myObject, "a" )
  - value、writable、enumerable、configurable
  - [[Get]]、 [[Put]]
    - [[put]]:
      1. 属性是否是访问描述符？如果是并且存在 setter 就调用 setter。
      2. 属性的数据描述符中 writable 是否是 false ？如果是，在非严格模式下静默失败，在严格模式下抛出 TypeError 异常。
      3. 如果都不是，将该值设置为属性的值。
  - 通过Object.defineProperty()修改属性描述符或其他特性

> **把 configurable 修改成false 是单向操作，无法撤销！**
>> 要注意有一个小小的例外：即便属性是 configurable:false，我们还是可以把 writable 的状态由 true 改为 false，但是无法由 false 改为true。除了无法修改，configurable:false 还会禁止删除这个属性（不能使用delete删除属性）

```js
var myObject = {
  a:2
};
Object.getOwnPropertyDescriptor( myObject, "a" );
// {
// value: 2,  //属性描述符
// writable: true,  //属性描述符  可以重新赋值
// enumerable: true,  //属性描述符  可以使用 defineProperty(..) 方法
// configurable: true  //属性描述符
// }

var myObject1 = {
  // 给 a 定义一个 getter
  get a() {
    return this._a_;
  },
  // 给 a 定义一个 setter
  set a(val) {
    this._a_ = val * 2;
  }
};
myObject1.a = 2;
myObject1.a; // 4
```

:::tip

1. 对象常量：结合 writable:false 和 configurable:false 就可以创建一个真正的常量属性（不可修改、重定义或者删除）
2. 禁止扩展：如果你想禁止一个对象添加新属性并且保留已有属性，可以使用Object.preventExtensions(..)
3. 密封：Object.seal(..) 会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用Object.preventExtensions(..) 并把所有现有属性标记为 configurable:false
4. 冻结：Object.freeze(..) 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用Object.seal(..) 并把所有“数据访问”属性标记为 writable:false，这样就无法修改它们的值
:::

```js
var myObject = {
  a:2
};
("a" in myObject); // true
("b" in myObject); // false

myObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "b" ); // false

// in 操作符会检查属性是否在对象及其 [[Prototype]] 原型链中（参见第 5 章）。相比之下，hasOwnProperty(..) 只会检查属性是否在 myObject 对象中，不会检查 [[Prototype]] 链
```

:::warning
Object.keys(..) 会返回一个数组，包含所有可枚举属性，Object.getOwnPropertyNames(..)会返回一个数组，包含所有属性，无论它们是否可枚举。

in 和 hasOwnProperty(..) 的区别在于是否查找 [[Prototype]] 链，然而，Object.keys(..)和 Object.getOwnPropertyNames(..) 都只会查找对象直接包含的属性。
:::

for..of 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器（@@iterator 对象）对象的next() 方法来遍历所有返回值

### 混合对象”类“

面向类的`设计模式`：

- 实例化：创建实例
- 继承：父类、子类
- 多态：父类的通用行为可以被子类用更特殊的行为重写。

### 原型

> - Object.create(obj)：创建一个对象，并把该对象的[[Prototype]]关联到obj上
> - 所有普通的 [[Prototype]] 链最终都会指向内置的 Object.prototype。

在于原型链上层时 myObject.foo = "bar" 会出现的三种情况:

1. 如果在 [[Prototype]] 链上层存在名为 foo 的普通数据访问属性并且没有被标记为只读（writable:false），那就会直接在 myObject 中添加一个名为 foo 的新属性，它是`屏蔽属性`。
2. 如果在 [[Prototype]] 链上层存在 foo，但是它被标记为只读（writable:false），那么无法修改已有属性或者在 myObject 上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
3. 如果在 [[Prototype]] 链上层存在 foo 并且它是一个 setter，那就一定会调用这个 setter。foo 不会被添加到（或者说屏蔽于）myObject，也不会重新定义 foo 这个 setter。

> - **__proto__：读作“dunder proto”,就是[[Prototype]], 由一个对象指向一个对象`即指向他们的原型对象`——终点：null**
> - **prototype：函数独有，由一个函数指向一个对象，是函数的原型对象，即函数所创建的实例的原型对象——终点：Object.prototype**
> - **constructor：一个对象指向一个函数，即指向该对象的构造函数——终点：Function()**

```js
var anotherObject = {
  a:2
};
var myObject = Object.create( anotherObject );
anotherObject.a; // 2
myObject.a; // 2146 ｜ 第 5 章
anotherObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "a" ); // false
myObject.a++; // 隐式屏蔽！
anotherObject.a; // 2
myObject.a; // 3
myObject.hasOwnProperty( "a" ); // true

function Foo() {
  // ...
}
// 这时Foo是由constructor属性的
var a = new Foo();
Object.getPrototypeOf( a ) === Foo.prototype; // true
Foo.prototype.constructor === Foo; // true
a.constructor === Foo; // true
// 内部链接 [[Prototype]] 关联的是 Foo.prototype 对象

// a.__proto__ === Foo.prototype === Object.getPrototypeOf(a)
// a.prototype === undefined

Foo.prototype = { /* .. */ }; // 创建一个新原型对象
// 这是Foo是没有constructor属性的
var a1 = new Foo();
a1.constructor === Foo; // false!
a1.constructor === Object; // true!
```

> 函数不是构造函数，但是当且仅当使用 new 时，函数调用会变成“构造函数调用”
> 实例的.constructor引用被委托给了Foo.prototype，而Foo.prototype.constructor默认指向Foo（Foo声明时的默认属性）

**a.constructor === Foo 为真意味着 a 确实有一个指向 Foo 的 .constructor 属性，但是事实不是这样。`实际上，.constructor 引用同样被委托给了 Foo.prototype，而Foo.prototype.constructor 默认指向 Foo`。举例来说，Foo.prototype 的 .constructor 属性只是 Foo 函数在声明时的默认属性。如果你创建了一个新对象并替换了函数默认的 .prototype 对象引用，那么新对象并不会自动获得 .constructor 属性。constructor 并不表示被构造**

> a instanceof Foo：在 a 的整条 [[Prototype]] 链中是否有指向 Foo.prototype 的对象？（只能处理对象和函数关系）**使用isPrototypeOf和getPrototypeOf代替**
> Foo.prototype.isPrototypeOf( a )：在 a 的整条 [[Prototype]] 链中是否出现过 Foo.prototype

### 行为委托

```js
// 面向对象设计模式
function Foo(who) {
  this.me = who;
}
Foo.prototype.identify = function() {
  return "I am " + this.me;
};
function Bar(who) {
  Foo.call( this, who );
}
Bar.prototype = Object.create( Foo.prototype );
Bar.prototype.speak = function() {
  alert( "Hello, " + this.identify() + "." );
};
var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" );
b1.speak();
b2.speak();
// 对象关联设计模式
Foo = {
  init: function(who) {
    this.me = who;
  },
  identify: function() {
    return "I am " + this.me;
  }
};
Bar = Object.create( Foo );
Bar.speak = function() {
  alert( "Hello, " + this.identify() + "." );
};
var b1 = Object.create( Bar );
b1.init( "b1" );
var b2 = Object.create( Bar );行为委托 ｜ 171
b2.init( "b2" );
b1.speak();
b2.speak();
```

## 类型和语法

### 类型

内置类型：

- null            - const a = null; (!a && typeof a === "object")
- undefined       - typeof undefined === "undefined"
- boolean         - typeof true === "boolean"
- number          - typeof 42 === "number"
- string          - typeof "42" === "string"
- object          - typeof { lift: 42 } === "object"
- symbol(es6新增)  - typeof Symbol() === "symbol"

**可以用`typeof`查看值的类型**

`object`子类型：

- typeof function a() {} === "function"  **a.length是参数个数**
- typeof [1, 2, 3] === "object"

### 值

++数组：++

:::warning 提醒
delete运算符可以删除数组单元，但是会留下空白。即length不变
:::

类数组（一组通过数字索引的值）转换为数组：

```js
function foo() {
  var arr = Array.prototype.slice.call(arguments)
  // var arr = Array.from(arguments)
  arr.push("bam")
  console.log(arr)
}

foo("baz", "bar") // ["baz", "bar", "bam"]
```

---

++字符串：++

JavaScript中字符串是不可变的：

```js
var a = "foo";
var b = ["f", "o", "o"];

a[1] = "O";
b[1] = "0";

a; // "foo"
b; // ["f", "O", "o"]
```

:::warning
只有成员可变更的值才可以借用方法。比如字符串可以借用数组的map、join方法，但是不可以借用reverse方法，因为reverse方法会改变值成员

```js
a.join; // undefined
a.map; // undefined

var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
  return v.toUpperCase() + ".";
} ).join( "" );

c; // "f-o-o"
d; // "F.O.O."

a.reverse; // undefined
b.reverse(); // ["!","o","O","f"]
b; // ["f","O","o","!"]


var f = a
 // 将a的值转换为字符数组
 .split( "" )
 // 将数组中的字符进行倒转
 .reverse()
 // 将数组中的字符拼接回字符串
 .join( "" );
f; // "oof
```

:::

---

++数字：++

```js
// 特别大和特别小的数字默认用指数格式显示，与 toExponential() 函数的输出结果相同
var a = 5E10;
a; // 50000000000
a.toExponential(); // "5e+10"

// tofixed(..) 方法可指定小数部分的显示位数：
var a = 42.59;
a.toFixed( 0 ); // "43"
a.toFixed( 1 ); // "42.6"
a.toFixed( 2 ); // "42.59"
a.toFixed( 3 ); // "42.590"
a.toFixed( 4 ); // "42.5900"

// toPrecision(..) 方法用来指定有效数位的显示位数：
var a = 42.59;
a.toPrecision( 1 ); // "4e+1"
a.toPrecision( 2 ); // "43"
a.toPrecision( 3 ); // "42.6"
a.toPrecision( 4 ); // "42.59"
a.toPrecision( 5 ); // "42.590"
a.toPrecision( 6 ); // "42.5900"

// . 运算符需要给予特别注意，因为它是一个有效的数字字符，会被优先识别为数字常量的一部分，然后才是对象属性访问运算符
// 无效语法：
42.toFixed( 3 ); // SyntaxError  . 被视为常量 42. 的一部分
// 下面的语法都有效：
(42).toFixed( 3 ); // "42.000"
0.42.toFixed( 3 ); // "0.420"
42..toFixed( 3 ); // "42.000"

// 还可以用指数形式来表示较大的数字
var onethousand = 1E3; // 即 1 * 10^3
var onemilliononehundredthousand = 1.1E6; // 即 1.1 * 10^6

0xf3; // 243的十六进制          推荐
0Xf3; // 同上
0363; // 243的八进制
0o363; // 243的八进制          推荐
0O363; // 同上
0b11110011; // 243的二进制     推荐
0B11110011; // 同上

0.1 + 0.2 === 0.3; // false
0.1 + 0.2 === 0.30000000000000004; // true

// 判断 0.1 + 0.2 和 0.3 是否相等，最常见的方法是设置一个误差范围值
if (!Number.EPSILON) {
  Number.EPSILON = Math.pow(2,-52);
}
// 可以使用 Number.EPSILON 来比较两个数字是否相等（在指定的误差范围内）
function numbersCloseEnoughToEqual(n1,n2) {
 return Math.abs( n1 - n2 ) < Number.EPSILON;
}
var a = 0.1 + 0.2;
var b = 0.3;
numbersCloseEnoughToEqual( a, b ); // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 ); // false

// 数位运算符 | 只适用于 32 位整数，可以将变量 a 中的数值转换为 32 位有符号整数
a | 0

// 表达式 void ___ 没有返回值，因此返回结果是 undefined。void 并不改变表达式的结果，只是让表达式不返回值：
var a = 42;
console.log( void a, a ); // undefined 42

Infinity/Infinity  // NaN

// 判断两个值是否绝对相等
Object.is(a, b)

function foo(x) {
  x.push( 4 );
  x; // [1,2,3,4]
  // 然后
  x = [4,5,6];
  x.push( 7 );
  x; // [4,5,6,7]
}
var a = [1,2,3];
foo( a );
a; // 是[1,2,3,4]，不是[4,5,6,7]
```

:::warning 提醒
向函数传递 a 的时候，实际是将引用 a 的一个复本赋值给 x，而 a 仍然指向 [1,2,3]。在函数中我们可以通过引用 x 来更改数组的值（push(4) 之后变为 [1,2,3,4]）。但 x = [4,5,6] 并不影响 a 的指向，所以 a 仍然指向 [1,2,3,4]

```js
function foo(x) {
  x.push( 4 );
  x; // [1,2,3,4]
  // 然后
  x = [4,5,6];
  x.push( 7 );
  x; // [4,5,6,7]
}
var a = [1,2,3];
foo( a );
a; // 是[1,2,3,4]，不是[4,5,6,7]
```

不能通过引用 x 来更改引用 a 的指向，只能更改 a 和 x 共同指向的值。如果要将 a 的值变为 [4,5,6,7]，必须更改 x 指向的数组，而不是为 x 赋值一个新的数组

```js
function foo(x) {
  x.push( 4 );
  x; // [1,2,3,4]
  // 然后
  x.length = 0; // 清空数组
  x.push( 4, 5, 6, 7 );
  x; // [4,5,6,7]
}
var a = [1,2,3];
foo( a );
a; // 是[4,5,6,7]，不是[1,2,3,4]
```

原因是标量基本类型值是不可更改的（字符串和布尔也是如此）。如果一个数字对象的标量基本类型值是 2，那么该值就不能更改，除非创建一个包含新值的数字对象。

x = x + 1 中，x 中的标量基本类型值 2 从数字对象中拆封（或者提取）出来后，x 就神不知鬼不觉地从引用变成了数字对象，它的值为 2 + 1 等于 3。然而函数外的 b 仍然指向原来那个值为 2 的数字对象。

```js
function foo(x) {
  x = x + 1;
  x; // 3 
}
var a = 2;
var b = new Number( a ); // Object(a)也一样
foo( b );
console.log( b ); // 是2，不是3
```

:::

### 原生函数（内置函数）

原生函数：

- String()
- Number()
- Boolean()
- Array()
- Object()
- Function()
- RegExp()
- Date()
- Error()
- Symbol()

:::warning 提醒

```js
var a = new String( "abc" );
typeof a; // 是"object"，不是"String"
a instanceof String; // true
Object.prototype.toString.call( a ); // "[object String]"
```

**typeof 在这里返回的是对象类型的子类型。**
:::

所有 typeof 返回值为 "object" 的对象（如数组）都包含一个内部属性 [[Class]]（可以把它看作一个内部的分类，而非传统的面向对象意义上的类）。这个属性无法直接访问，一般通过 Object.prototype.toString(..) 来查看。

```js
Object.prototype.toString.call( [1,2,3] );
// "[object Array]"
Object.prototype.toString.call( /regex-literal/i );
// "[object RegExp]"
Object.prototype.toString.call( null );
// "[object Null]"
Object.prototype.toString.call( undefined );
// "[object Undefined]"
Object.prototype.toString.call( "abc" );
// "[object String]"
Object.prototype.toString.call( 42 );
// "[object Number]"
Object.prototype.toString.call( true );
// "[object Boolean]"
```

如果想要自行封装基本类型值，可以使用 Object(..) 函数（不带 new 关键字）：

```js
var a = "abc";
var b = new String( a );
var c = Object( a );

typeof a; // "string"
typeof b; // "object"
typeof c; // "object"

b instanceof String; // true
c instanceof String; // true

Object.prototype.toString.call( b ); // "[object String]"
Object.prototype.toString.call( c ); // "[object String]"
```

如果想要得到封装对象中的基本类型值，可以使用 valueOf() 函数：

```js
var a = new String( "abc" );
var b = new Number( 42 );
var c = new Boolean( true );

a.valueOf(); // "abc"
b.valueOf(); // 42
c.valueOf(); // true

// 在需要用到封装对象中的基本类型值的地方会发生隐式拆封。
var a = new String( "abc" );
var b = a + ""; // b的值为"abc"

typeof a; // "object"
typeof b; // "string"
```

**`Symnol`可以用作属性名，但无论是在代码还是开发控制台中都无法查看和访问它的值，符号可以用作属性名，但无论是在代码还是开发控制台中都无法查看和访问它的值**

```js
// Function.prototype 是一个函数，RegExp.prototype 是一个正则表达式，而 Array.prototype 是一个数组。
typeof Function.prototype; // "function"
Function.prototype(); // 空函数！

RegExp.prototype.toString(); // "/(?:)/"——空正则表达式
"abc".match( RegExp.prototype ); // [""]

function isThisCool(vals = Array.prototype, fn = Function.prototype, rx = RegExp.prototype) {
  return rx.test(
    vals.map( fn ).join( "" )
  ); 
}
isThisCool(); // true原生函数 ｜ 45
isThisCool(
  ["a","b","c"],
  function(v){ return v.toUpperCase(); },
  /D/
); // false
```

### 强制类型转换

ToString:

对普通对象来说，除非自行定义，否则 toString()（Object.prototype.toString()）返回
内部属性 [[Class]] 的值，如 "[object Object]"。如果对象有自己的 toString() 方法，字符串化时就会调用该方法并使用其返回值，数组的 toString()。

**JSON.stringify(..) 在将 JSON 对象序列化为字符串时也用到了 ToString**

:::warning 提醒
对大多数简单值来说，JSON 字符串化和 toString() 的效果基本相同，只不过序列化的结
果总是字符串：

```js
JSON.stringify( 42 ); // "42"
JSON.stringify( "42" ); // "\"42\"" （含有双引号的字符串）
JSON.stringify( null ); // "null"
JSON.stringify( true ); // "true"
```
:::

- 安全的JSON值 - 指能够呈现为有效JSON的值，可使用JSON.stringify()字符串化
- 不安全的JSON值 - undefined、function、symbol、对象循环引用（对象相互引用，形成无限循环）

```js
// JSON.stringify(..) 在对象中遇到 undefined、function 和 symbol 时会自动将其忽略，在数组中则会返回 null（以保证单元位置不变）
JSON.stringify( undefined ); // undefined
JSON.stringify( function(){} ); // undefined
JSON.stringify(
  [1,undefined,function(){},4]
); // "[1,null,null,4]"
JSON.stringify(
  { a:2, b:function(){} }
); // "{"a":2}"
// 对包含循环引用的对象执行 JSON.stringify(..) 会出错。

// 如果对象中定义了 toJSON() 方法，JSON 字符串化时会首先调用该方法，然后用它的返回值来进行序列化。
var o = { };
var a = { 
  b: 42,
  c: o,
  d: function(){}
};
// 在a中创建一个循环引用
o.e = a;
// 循环引用在这里会产生错误
// JSON.stringify( a );
// 自定义的JSON序列化
a.toJSON = function() {
  // 序列化仅包含b
  return { b: this.b };
};
JSON.stringify( a ); // "{"b":42}"

// toJSON() 返回的应该是一个适当的值，可以是任何类型，然后再由 JSON.stringify(..) 对其进行字符串化。
var a = {
  val: [1,2,3],
  // 可能是我们想要的结果！
  toJSON: function(){
    return this.val.slice( 1 );
  }
};
var b = {
  val: [1,2,3],
  // 可能不是我们想要的结果！
  toJSON: function(){
    return "[" +
      this.val.slice( 1 ).join() +
    "]"; 
  }
};
JSON.stringify( a ); // "[2,3]"
JSON.stringify( b ); // ""[2,3]""
```

:::warning 提醒
可以向 JSON.stringify(..) 传递一个可选参数 replacer，它可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，哪些应该被排除，和 toJSON() 很像。如果 replacer 是一个数组，那么它必须是一个字符串数组，其中包含序列化要处理的对象的属性名称，除此之外其他的属性则被忽略。如果 replacer 是一个函数，它会对对象本身调用一次，然后对对象中的每个属性各调用一次，每次传递两个参数，键和值。如果要忽略某个键就返回 undefined，否则返回指定的值。

```js
var a = { 
  b: 42,
  c: "42",
  d: [1,2,3] 
};
JSON.stringify( a, ["b","c"] ); // "{"b":42,"c":"42"}"
JSON.stringify( a, function(k,v){
  if (k !== "c") return v;
} );
// "{"b":42,"d":[1,2,3]}"
```

**如果 replacer 是函数，它的参数 k 在第一次调用时为 undefined（就是对对象本身调用的那次）。if 语句将属性 "c" 排除掉。由于字符串化是递归的，因此数组 [1,2,3] 中的每个元素都会通过参数 v 传递给 replacer，即 1、2 和 3，参数 k 是它们的索引值，即 0、1 和 2。**
:::

JSON.string 还有一个可选参数 space，用来指定输出的缩进格式。space 为正整数时是指定每一级缩进的字符数，它还可以是字符串，此时最前面的十个字符被用于每一级的缩进

---

ToNumber:

true 转换为 1，false 转换为 0。undefined 转换为 NaN，null 转换为 0。

对象（包括数组）会首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则再遵循以上规则将其强制转换为数字。

为了将值转换为相应的基本类型值，抽象操作 ToPrimitive 会首先（通过内部操作 DefaultValue 节）检查该值是否有 valueOf() 方法。如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString()的返回值（如果存在）来进行强制类型转换。如果 valueOf() 和 toString() 均不返回基本类型值，会产生 TypeError 错误(返回 NaN)。

```js
var a = {
  valueOf: function(){
    return "42";
  }
};
var b = {
  toString: function(){
    return "42";
  }
};
var c = [4,2];
c.toString = function(){
  return this.join( "" ); // "42"
};
Number( a ); // 42
Number( b ); // 42
Number( c ); // 42
Number( "" ); // 0
Number( [] ); // 0
Number( [ "abc" ] ); // NaN
```

---

ToBoolean:

- 假值
  - undefined
  - null
  - false
  - +0、-0、NaN
  - ""
- 真值：假值之外都是真值

字符串和数字之间的转换是通过 String(..) 和 Number(..) 这两个内建函数（原生构造函
数，参见第 3 章）来实现的，请注意它们前面没有 new 关键字，并不创建封装对象。
```js
var a = 42;
var b = String( a );
var c = "3.14";
var d = Number( c );
b; // "42"
d; // 3.14
```

位运算符：只适用32位整数，运算符强制操作数使用32位格式。这是通过抽象操作 ToInt32 来实现的。ToInt32 首先执行 ToNumber 强制类型转换，比如 "123" 会先被转换为 123，然后再执行ToInt32。

`|（或）`：空操作（no-op）0 | x，它仅执行 ToInt32 转换。
```js
0 | -0; // 0
0 | NaN; // 0
0 | Infinity; // 0
0 | -Infinity; // 0
// 以上这些特殊数字无法以 32 位格式呈现（因为它们来自 64 位 IEEE 754 标准），因此 ToInt32 返回 0。
```

`~（非）`：首先将值强制类型转换为 32 位数字，然后执行字位操作“非”（对每一个字位进行反转）-  返回 2 的补码。
```js
// ~x 大致等同于 -(x+1)
~42; // -(42+1) ==> -43
```

:::warning 注意
-(x+1) 中唯一能够得到 0（或者严格说是 -0）的 x 值是 -1。-1 是一个“哨位值”：1 来代表函数执行失败，用大于等于 0 的值来代表函数执行成功。JavaScript 中字符串的 indexOf(..) 方法也遵循这一惯例

**字位操作是没有-0的，只有0。比如~-1 === 0，而不是-0**

```js
// ~~x 能将值截除为一个 32 位整数，x | 0 也可以，而且看起来还更简洁。
Math.floor( -49.6 ); // -50
~~-49.6; // -49
// 出于对运算符优先级的考虑，我们可能更倾向于使用 ~~x：
```
:::

:::warning 注意
```js
parseInt( 1/0, 19 ); // 18
```

- 1/0 === Infinity
- parseInt(..)先将参数强制类型转换为字符串再进行解析（toString(..)） === 'Infinity'
- 基数 19，有效数字字符范围是 0-9 和 a-i（区分大小写）- 'i' === 18
- 第二个字符 "n" 不是一个有效的数字字符，解析到此为止。

```js
parseInt( 'i', 19 ); // 18
parseInt( 'i1', 19 ); // 18*19+1

parseInt( 0.000008 ); // 0 ("0" 来自于 "0.000008")
parseInt( 0.0000008 ); // 8 ("8" 来自于 "8e-7")
parseInt( false, 16 ); // 250 ("fa" 来自于 "false")
parseInt( parseInt, 16 ); // 15 ("f" 来自于 "function..")
parseInt( "0x10" ); // 16
parseInt( "103", 2 ); // 2
```
:::

与 + 类似，一元运算符 ! 显式地将值强制类型转换为布尔值

```js
var a = [ 
  1,
  function(){ /*..*/ },
  2,
  function(){ /*..*/ }
];
JSON.stringify( a ); // "[1,null,2,null]"
JSON.stringify( a, function(key,val){
  if (typeof val == "function") {
    // 函数的ToBoolean强制类型转换
    return !!val;
  }
  else {
    return val;
  }
});
// "[1,true,2,true]"
```

如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+ 将进行拼接操作。如果其中一个操作数是对象（包括数组），则首先对其调用ToPrimitive 抽象操作，该抽象操作再调用 [[DefaultValue]]，以数字作为上下文。

```js
var a = [1,2];
var b = [3,4];
a + b; // "1,23,4"
```

这与 ToNumber 抽象操作处理对象的方式一样。因为数组的valueOf() 操作无法得到简单基本类型值，于是它转而调用 toString()。因此上例中的两个数组变成了 "1,2" 和 "3,4"。+ 将它们拼接后返回 "1,23,4"。

简单来说就是，如果 + 的其中一个操作数是字符串（或者通过以上步骤可以得到字符串），则执行字符串拼接；否则执行数字加法。

根据ToPrimitive 抽象操作规则，a + "" 会对 a 调用 valueOf() 方法，然后通过 ToString 抽象操作将返回值转换为字符串。而 String(a) 则是直接调用 ToString()。

```js
var a = {
  valueOf: function() { return 42; },
  toString: function() { return 4; }
};
a + ""; // "42"
String( a ); // "4"
```

```js
function foo() {
  console.log( a );
}
var a = 42;
a && foo(); // 42
```

:::warning 提醒
if (a) { foo(); }可以使用 a && foo() 代替
```js
// ES6 允许从符号到字符串的显式强制类型转换，然而隐式强制类型转换会产生错误。
var s1 = Symbol( "cool" );
String( s1 ); // "Symbol(cool)"
s1 + ""; // TypeError
Boolean( s1 ); // true
s1 || 2; // Symbol(cool)
Number(s1); // TypeErrorc
+s1; // TypeErrorc
// 符号不能够被强制类型转换为数字（显式和隐式都会产生错误），但可以被强制类型转换为布尔值（显式和隐式结果都是 true）
```
:::

> **“== 检查值是否相等，=== 检查值和类型是否相等”不够准确，正确的解释：== 允许在相等比较中进行强制类型转换，而 === 不允许。**

```js
var a = 42;
var b = "42";
a === b; // false
a == b; // true
```

> == (string)
>> - 如果 Type(x) 是数字，Type(y) 是字符串，则返回 x == ToNumber(y) 的结果
>> - 如果 Type(x) 是字符串，Type(y) 是数字，则返回 ToNumber(x) == y 的结果

```js
var a = "42";
var b = true;
a == b; // false
// "42" == 1 > 42 == 1
```

> == (boolean)
>> - 如果 Type(x) 是布尔类型，则返回 ToNumber(x) == y 的结果
>> - 如果 Type(y) 是布尔类型，则返回 x == ToNumber(y) 的结果

> == (null、undefined)
>> 在 == 中 null 和 undefined 相等（它们也与其自身相等）
>> - 如果 x 为 null，y 为 undefined，则结果为 true
>> - 如果 x 为 undefined，y 为 null，则结果为 true

```js
var a = 42;
var b = [ 42 ];
a == b; // true
```

> == (object)
>> 在 == 中 null 和 undefined 相等（它们也与其自身相等），
>> - 如果 Type(x) 是字符串或数字，Type(y) 是对象，则返回 x == ToPrimitive(y) 的结果
>> - 如果 Type(x) 是对象，Type(y) 是字符串或数字，则返回 ToPromitive(x) == y 的结果

:::warning 注意
这里只提到了字符串和数字，没有布尔值。原因是布尔值会先被强制类型转换为数字

[ 42 ] 首先调用 ToPromitive 抽象操作，返回 "42"，变成 "42" == 42，然后又变成 42 == 42，最后二者相等。

```js
[].valueOf()        // []
[].toString()       // ""
Object().valueOf()  // {}
Object().toString() // "[object Object]"

[] == {}            // false
{} == []            // SynyaxError
[] + {};            // "[object Object]"  "[object Object]" + ""
{} + [];            // 0  独立空代码块 + '' -> 独立空代码块 + 0

var a = "abc";
var b = Object( a ); // 和new String( a )一样
a === b; // false
a == b; // true
var c = null;
var d = Object( c ); // 和Object()一样
c == d; // false
var e = undefined; 
var f = Object( e ); // 和Object()一样
e == f; // false
var g = NaN; 
var h = Object( g ); // 和new Number( e )一样
g == h; // false
// 因为没有对应的封装对象，所以 null 和 undefined 不能够被封装（boxed），Object(null)和 Object() 均返回一个常规对象。NaN 能够被封装为数字封装对象，但拆封之后 NaN == NaN 返回 false，因为 NaN 不等于 NaN

"0" == null; // false
"0" == undefined; // false
"0" == false; // true -- 晕！
"0" == NaN; // false
"0" == 0; // true
"0" == ""; // false
false == null; // false
false == undefined; // false
false == NaN; // false
false == 0; // true -- 晕！
false == ""; // true -- 晕！
false == []; // true -- 晕！
false == {}; // false
"" == null; // false
"" == undefined; // false
"" == NaN; // false
"" == 0; // true -- 晕！
"" == []; // true -- 晕！
"" == {}; // false
0 == null; // false
0 == undefined; // false
0 == NaN; // false
0 == []; // true -- 晕！
0 == {}; // false
[] == ![] // true
"" == [null]; // true
0 == "\n"; // true  ""、"\n"（或者 " " 等其他空格组合）等空字符串被 ToNumber 强制类型转换为 0。
```
:::

---

> 其他情况
>> - 比较双方首先调用 ToPrimitive，如果结果出现非字符串，就根据 ToNumber 规则将双方强制类型转换为数字来进行比较。
>> ```js
>> var a = [ 42 ];
>> var b = [ "43" ];
>> a < b; // true
>> b < a; // false
>> ```
>> - 如果比较双方都是字符串，则按字母顺序来进行比较
>> ```js
>> var a = [ 42 ];
>> var b = [ "043" ];
>> b < a; // false
>> // a 和 b 并没有被转换为数字，因为 ToPrimitive 返回的是字符串，所以这里比较的是 "42" 和 "043" 两个字符串，它们分别以 "4" 和 "0" 开头。因为 "0" 在字母顺序上小于 "4"，所以最后结果为 false。
>> ```
>> - 特例
>> ```js
>> var a = { b: 42 };
>> var b = { b: 43 };
>> a < b; // false NaN < NaN
>> a == b; // false NaN == NaN
>> a > b; // false NaN > NaN
>> a <= b; // true !(a > b)
>> a >= b; // true !(a < b)
>> // a 和 b 并没有被转换为数字，因为 ToPrimitive 返回的是字符串，所以这里比较的是 "42" 和 "043" 两个字符串，它们分别以 "4" 和 "0" 开头。因为 "0" 在字母顺序上小于 "4"，所以最后结果为 false。
>> // 实际上 JavaScript 中 <= 是“不大于”的意思（即 !(a > b)，处理为 !(b < a)）。同理 a >= b 处理为 b <= a。
>> var a = [ 42 ];
>> var b = "043";
>> a < b; // false -- 字符串比较！ "42" < "042"
>> Number( a ) < Number( b ); // true -- 数字比较！ 42 < 43
>> ```
> 比较双方都是字符串
>> 避免 a < b 中发生隐式强制类型转换，只能确保 a 和 b 为相同的类型

### 语法

- 语句（statement）相当于句子 - 语句都有一个`结果值`(只有控制台可以获得，代码中无法获得)
- 表达式（expression）相当于短语

```js
var a = 3 * 6; // 声明语句
b = a;         // 赋值表达式
b;             // 表达式语句
// var 的结果值为undefined
// {...} 的结果值为 其最后一个语句 / 表达式的结果

// 下面这样的代码无法运行
var a, b;
a = if (true) {
  b = 4 + 38;
};
// 因为语法不允许我们获得语句的结果值并将其赋值给另一个变量

var a = 42;
var b = a++;  // === var b = (a++);
a; // 43
b; // 42

var a = 42, b;
b = ( a++, a );
a; // 43
b; // 43

var a = b = 42  // 创建全局变量b

function vowels(str) {
  var matches;
    if (str) {
      // 提取所有元音字母
      matches = str.match( /[aeiou]/g );
      if (matches) {
        return matches;
      } 
  }
}
vowels( "Hello World" ); // ["e","o","o"]
// 利用赋值语句的副作用将两个 if 语句合二为一
function vowels(str) {
  var matches;
  // 提取所有元音字母
  if (str && (matches = str.match( /[aeiou]/g ))) {
    return matches;语法 ｜ 99
  }
}
vowels( "Hello World" ); // ["e","o","o"]
```

标签语句：

```js
// 标签为foo的循环
foo: for (var i=0; i<4; i++) {
  for (var j=0; j<4; j++) {
  // 如果j和i相等，继续外层循环
    if (j == i) {
      // 跳转到foo的下一个循环
      continue foo;
    }
    // 跳过奇数结果
    if ((j * i) % 2 == 1) {
      // 继续内层循环（没有标签的）
      continue; 
    }
    console.log( i, j );
  }
}
// 1 0
// 2 0
// 2 1
// 3 0
// 3 2
```

带标签的循环跳转一个更大的用处在于，和 break __ 一起使用可以实现从内层循环跳转到外层循环。没有它们的话实现起来有时会非常麻烦：

```js
// 标签为foo的循环
foo: for (var i=0; i<4; i++) {
  for (var j=0; j<4; j++) {
    if ((i * j) >= 3) {
      console.log( "stopping!", i, j );
      break foo; 
    }
    console.log( i, j );
  }
}
// 0 0
// 0 1
// 0 2
// 0 3
// 1 0
// 1 1
// 1 2
// 停止！ 1 3
```

标签也能用于非循环代码块，但只有 break 才可以。我们可以对带标签的代码块使用break ___，但是不能对带标签的非循环代码块使用 continue ___，也不能对不带标签的代码块使用 break：

```js
// 标签为bar的代码块
function foo() {
  bar: {
    console.log( "Hello" );
    break bar;
    console.log( "never runs" );
  }
  console.log( "World" );
}
foo();
// Hello
// World
```

:::warning 提醒
标签不允许使用双引号，如控制台中输入 {"a":42} 会报错

JSON 的确是 JavaScript 语法的一个子集，但是 JSON 本身并不是合法的 JavaScript 语法。

JSON-P 能将 JSON 转换为合法的JavaScript 语法。JSON-P（将 JSON 数据封装为函数调用，比如 foo({"a":42})）通过将 JSON 数据传递给函数来实现对其的访问

**解构：{ a, b } 实际上是 { a: a, b: b } 的简化版本**

&& 运算符先于 || 执行
:::

```js
true || false && false; // true
(true || false) && false; // false
true || (false && false); // true

// &&、|| > ?: > =
a ? b : c ? d : e;  //  a ? b : (c ? d : e)  ? : 是右关联

a && b || c ? c || b ? a : c && b : a;  // ((a && b) || c) ? ((c || b) ? a : (c && b)) : a
```

如果参数被`省略`或者值为 `undefined`，则取该参数的默认值：

```js
function foo( a = 42, b = a + 1 ) {
  console.log( a, b );
}
foo(); // 42 43
foo( undefined ); // 42 43
foo( 5 ); // 5 6
foo( void 0, 7 ); // 42 7
foo( null ); // null 1  null 被强制类型转换为 0

function foo( a = 42, b = a + 1 ) {
  console.log(arguments.length, a, b, arguments[0], arguments[1]);
}
foo(); // 0 42 43 undefined undefined
foo( 10 ); // 1 10 11 10 undefined
foo( 10, undefined ); // 2 10 11 10 undefined
foo( 10, null ); // 2 10 null 10 null
```

finally 中的代码总是会在 try 之后执行，如果有 catch 的话则在 catch 之后执行。也可以将 finally 中的代码看作一个回调函数，即无论出现什么情况最后一定会被调用。

```js
function foo() {
  try {
    return 42;
  } 
  finally {
    console.log( "Hello" );
  }
    console.log( "never runs" );
}
console.log( foo() );
// Hello
// 42

// 这里 return 42 先执行，并将 foo() 函数的返回值设置为 42。然后 try 执行完毕，接着执行 finally。最后 foo() 函数执行完毕，console.log(..) 显示返回值。

// try 中的 throw 也是如此：
function foo() {
  try {
    throw 42; 
  }
  finally {
    console.log( "Hello" );
  }
  console.log( "never runs" );
}
console.log( foo() );
// Hello
// Uncaught Exception: 42

// 如果 finally 中抛出异常（无论是有意还是无意），函数就会在此处终止。如果此前 try 中已经有 return 设置了返回值，则该值会被丢弃：
function foo() {
  try {
    return 42;
  } 
  finally {
    throw "Oops!";
  }
 console.log( "never runs" );
}
console.log( foo() );
// Uncaught Exception: Oops!

// continue 和 break 等控制语句也是如此：
for (var i=0; i<10; i++) {
 try {
 continue; 
 }
 finally {
 console.log( i );
 }
}
// 0 1 2 3 4 5 6 7 8 9
// continue 在每次循环之后，会在 i++ 执行之前执行 console.log(i)，所以结果是 0..9 而非1..10。

// finally 中的 return 会覆盖 try 和 catch 中 return 的返回值：
function foo() {
  try {
    return 42;
  } 
  finally {
    // 没有返回语句，所以没有覆盖
  } 
}
function bar() {
  try {
    return 42;
  }
  finally {
    // 覆盖前面的 return 42
    return; 
  }
}
function baz() {
  try {
    return 42;
  } 
  finally {
    // 覆盖前面的 return 42
    return "Hello";
  }
}
foo(); // 42
bar(); // undefined
baz(); // Hello

function foo() {
  bar: {
    try {
      return 42;
    } 
    finally {
      // 跳出标签为bar的代码块
      break bar;
    }
  }
  console.log( "Crazy" );120 ｜ 第 5 章
  return "Hello";
}
console.log( foo() );
// Crazy
// Hello
```

- window.escape(..) 和 window.unescape(..) 让你能够转义（escape）和回转（unescape）带有 % 分隔符的十六进制字符串。例如，window.escape( "? foo=97%&bar=3%" ) 的结果为 "%3Ffoo%3D97%25%26bar%3D3%25"。
- String.prototype.substr 和 String.prototype.substring 十分相似，除了前者的第二个参数是结束位置索引（非自包含），后者的第二个参数是长度（需要包含的字符数）。
- RegExp.$1 .. RegExp.$9（匹配组）和 RegExp.lastMatch/RegExp["$&"]（最近匹配）
- 由于浏览器演进的历史遗留问题，在创建带有 id 属性的 DOM 元素时也会创建同名的全局变量。

```js
<div id="foo"></div>

if (typeof foo == "undefined") {
 foo = 42; // 永远也不会运行
}
console.log( foo ); // HTML元素

// shim/polyfill
if (!Array.prototype.foobar) {
  // 幼稚
  Array.prototype.foobar = function() {
    this.push( "foo", "bar" );
    // 问题在于一些标准功能无法被完整地 polyfill/prollyfill
  }; 
}

function addAll() {
  var sum = 0;
  for (var i=0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}
addAll( 2, 4, 6 ); // 12
addAll( 1000 ); // 1000 arguments.length===1  arguments[0]===1000  arguments[1]===undefined
addAll.apply( null, nums ); // 应该是: 499950000
```

## 异步和性能

### 异步：现在与将来

- 举例：
```js
function now() {
  return 21;
}
function later() {
  answer = answer * 2;
  console.log( "Meaning of life:", answer );
}
var answer = now();
setTimeout( later, 1000 ); // Meaning of life: 42
```
- 现在：
```js
function now() {
  return 21;
}
function later() { .. }
var answer = now();
setTimeout( later, 1000 );
```

- 现在：
```js
answer = answer * 2;
console.log( "Meaning of life:", answer );
```

现在这一块在程序运行之后就会立即执行。但是，setTimeout(..) 还设置了一个事件（定时）在将来执行，所以函数 later() 的内容会在之后的某个时间（从现在起 1000 毫秒之后）执行

`事件循环`：JavaScript 引擎（在给定的任意时刻执行程序中的单个代码块）运行在宿主环境中（Web 浏览器、Node等），所有这些环境都有线程，即它们都提供了一种机制来处理程序中多个块的执行，且执行每块时调用 JavaScript 引擎，这种机制被称为事件循环

```js
// 事件循环伪代码
// eventLoop是一个用作队列的数组
// （先进，先出）
var eventLoop = [ ];
var event;
// “永远”执行
while (true) {
  // 一次tick
  if (eventLoop.length > 0) {
    // 拿到队列中的下一个事件
    event = eventLoop.shift();
    // 现在，执行下一个事件
    try {
      event();
    }
    catch (err) {
      reportError(err);
    }
  }
}
```

对每个 tick 而言，如果在队列中有等待事件，那么就会从队列中摘下一个事件并执行。这些事件就是你的回调函数。

一定要清楚，setTimeout(..) 并没有把你的回调函数挂在事件循环队列中。它所做的是设定一个定时器。当定时器到时后，环境会把你的回调函数放在事件循环中，这样，在未来某个时刻的 tick 会摘下并执行这个回调。如果这时候事件循环中已经有 20 个项目了会怎样呢？你的回调就会等待。它得排在其他项目后面。只能确保你的回调函数不会在指定的
时间间隔之前运行，但可能会在那个时刻运行，也可能在那之后运行，要根据事件队列的状态而定。

- 异步：现在和将来的时间间隙
- 并行：能够同时发生的事情
  - 并行计算工具：进程和线程 - 进程和线程独立运行，并可能同时运行：在不同的处理器，甚至不同的计算机上，但多个线程能够共享单个进程的内存。

与之相对的是，事件循环把自身的工作分成一个个任务并顺序执行，不允许对共享内存的并行访问和修改。通过分立线程中彼此合作的事件循环，并行和顺序执行可以共存。

在单线程环境中，线程队列中的项目是底层运算确实是无所谓的，因为线程本身不会被中断。但如果是在并行系统中，同一个程序中可能有两个不同的线程在运转，这时很可能就会得到不确定的结果（因为两个线程并行执行可能会共享内存地址）。

```js
var a = 20; 
function foo() { 
  a = a + 1; 
} 
function bar() { 
  a = a * 2; 
} 
// ajax(..)是某个库中提供的某个Ajax函数
ajax( "http://some.url.1", foo ); 
ajax( "http://some.url.2", bar );
```

JavaScript 从不跨线程共享数据，这意味着不需要考虑这一层次的不确定性。但是这并不意味着JavaScript 总是确定性的。比如两个函数的相对顺序改变可能会导致不同结果（改变同一个全局变量）

由于 JavaScript 的单线程特性，foo()（以及 bar()）中的代码具有`原子性`。也就是说，一旦 foo() 开始运行，它的所有代码都会在 bar() 中的任意代码运行之前完成，或者相反。这称为`完整运行`（run-to-completion）特性。

由于 foo() 不会被 bar() 中断，bar() 也不会被 foo() 中断，所以这个程序只有两个可能的输出，取决于这两个函数哪个先运行——如果存在多线程(也就是说，它们的运行在时间上是分隔的)，且 foo() 和 bar() 中的语句可以交替运行的话，可能输出的数目将会增加不少！

这种不确定性是在函数（事件）顺序级别上，而不是多线程情况下的语句顺序级别（或者说，表达式运算顺序级别）。换句话说，这一确定性要高于多线程情况。

让我们来设想一个展示状态更新列表（比如社交网络新闻种子）的网站，其随着用户向下滚动列表而逐渐加载更多内容。要正确地实现这一特性，需要（至少）两个独立的“进程”同时运行（也就是说，是在同一段时间内，并不需要在同一时刻）。

两个或多个“进程”同时执行就出现了并发，不管组成它们的单个运算是否并行执行（在独立的处理器或处理器核心上同时运行）。可以把并发看作“进程”级（或者任务级）的并行，与运算级的并行（不同处理器上的线程）相对。

| 假设这些事件的时间线是这样的 | 下面列出了事件循环队列中所有这些交替的事件 |
| ----------------------- | ----------------------------------- |
|```md|```md|\
|onscroll, 请求1|onscroll, 请求1 <--- 进程1启动|\
|onscroll, 请求2 响应1|onscroll, 请求2|\
|onscroll, 请求3 响应2|响应1 <--- 进程2启动|\
|响应3|onscroll, 请求3|\
|onscroll, 请求4|响应2|\
|onscroll, 请求5|响应3|\
|onscroll, 请求6 响应4|onscroll, 请求4|\
|响应6|onscroll, 请求5|\
|响应5|onscroll, 请求6|\
|响应7|响应4|\
||onscroll, 请求7 <--- 进程1结束|\
||响应6|\
||响应5|\
||响应7 <--- 进程2结束|\
|```|```|

JavaScript 一次只能处理一个事件，所以要么是onscroll，请求 2 先发生，要么是响应 1 先发生，但是不会严格地同时发生。这就像学校食堂的孩子们，不管在门外多么拥挤，最终他们都得站成一队才能拿到自己的午饭。

“进程”1 和“进程”2 并发运行（任务级并行），但是它们的各个事件是在事件循环队列中依次运行的。

> 并发形式
>> - 事件循环
>> - 并发协作：取到一个长期运行的“进程”，并将其分割成多个步骤或多批任务，使得其他并发“进程”有机会将自己的运算插入到事件循环队列中交替运行(是指两个或多个事件链随时间发展交替执行，以至于从更高的层次来看，就像是同时在运行（尽管在任意时刻只处理一个事件）。)

- 任务队列

它是挂在事件循环队列的每个 tick 之后的一个队列。在事件循环的每个 tick 中，可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中，而会在当前 tick 的任务队列末尾添加一个项目（一个任务）

这就像是在说：“哦，这里还有一件事将来要做，但要确保在其他任何事情发生之前就完成它。”

事件循环队列类似于一个游乐园游戏：玩过了一个游戏之后，你需要重新到队尾排队才能再玩一次。而任务队列类似于玩过了游戏之后，插队接着继续玩。

用 setTimeout(..0)（hack）进行异步调度，基本上它的意思就是“把这个函数插入到当前事件循环队列的结尾处”

任务和 setTimeout(..0) hack 的思路类似，但是其实现方式的定义更加良好，对顺序的保证性更强：尽可能早的将来。

```js
console.log( "A" ); 
setTimeout( function(){ 
  console.log( "B" ); 
}, 0 ); 
// 理论上的"任务API" 
schedule( function(){ 
  console.log( "C" ); 
  schedule( function(){ 
    console.log( "D" ); 
  } ); 
} ); 
// A C D B
// 因为任务处理是在当前事件循环 tick 结尾处，且定时器触发是为了调度下一个事件循环 tick（如果可用的话！）
```

```js
var a, b; 
a = 10; 
b = 30; 
a = a + 1; 
b = b + 1; 
console.log( a + b ); // 42 
```

JavaScript 引擎在编译这段代码之后（是的，JavaScript 是需要编译的，参见[作用域和闭包](#作用域和闭包)！）可能会发现通过（安全地）重新安排这些语句的顺序有可能提高执行速度。重点是，只要这个重新排序是不可见的，一切都没问题。

```js
// 比如，引擎可能会发现，其实这样执行会更快：
var a, b; 
a = 10; 
a++; 
b = 30; 
b++; 
console.log( a + b ); // 42 

// 或者这样：
var a, b; 
a = 11; 
b = 31; 
console.log( a + b ); // 42 

// 或者甚至这样：
// 因为a和b不会被再次使用
// 我们可以inline，从而完全不需要它们！
console.log( 42 ); // 42 

// 前面的所有情况中，JavaScript 引擎在编译期间执行的都是安全的优化，最后可见的结果都是一样的。但是这里有一种场景，其中特定的优化是不安全的，因此也是不允许的（当然，不用说这其实也根本不能称为优化）：
var a, b; 
a = 10; 
b = 30; 
// 我们需要a和b处于递增之前的状态！
console.log( a * b ); // 300 
a = a + 1; 
b = b + 1; 
console.log( a + b ); // 42
```

代码编写的方式（从上到下的模式）和编译后执行的方式之间的联系非常脆弱，理解这一点也非常重要。

### 回调

[顺序的大脑](/quotations/)

回调地狱(毁灭金字塔)：

回调地狱问题：
- 嵌套
- 缩进
- 缺乏顺序性：大脑对于事情的计划方式是线性的、阻塞的、单线程的语义，但是回调表达异步流程的方式是非线性的、非顺序的，这使得正确推导这样的代码难度很大。难于理解的代码是坏代码，会导致坏 bug（异步回调运行顺序很难判断）--generator解决
- 缺乏可信任性：回调会受到控制反转的影响（因为回调暗中把控制权交给第三方（通常是不受你控制的第三方工具！）来调用你代码中的 continuation（回调）。这种控制转移导致一系列麻烦的信任问题，比如回调被调用的次数是否会超出预期）--Promise解决

```js
listen( "click", function handler(evt){ 
  setTimeout( function request(){ 
    ajax( "http://some.url.1", function response(text){ 
      if (text == "hello") { 
        handler(); 
      } 
      else if (text == "world") { 
        request(); 
      } 
    } ); 
  }, 500) ; 
} );
```

- 例子中的步骤是按照 1、2、3、4……的顺序，这只是一个偶然。实际的异步JavaScript 程序中总是有很多噪声，使得代码更加杂乱。在大脑的演习中，我们需要熟练地绕过这些噪声，从一个函数跳到下一个函数。对于这样满是回调的代码，理解其中的异步流不是不可能，但肯定不自然，也不容易，即使经过大量的练习也是如此。

```js
doA( function(){ 
  doB(); 回调 ｜ 167
  doC( function(){ 
    doD(); 
  } ) 
  doE(); 
} ); 
doF();
```

如果 doA(..) 或 doD(..) 是异步执行：A → F → B → C → E → D
如果 doA(..) 或 doD(..) 是同步执行：A → B → C → D → E → F

> 回调导致跟踪异步流如此之难

- 我们的顺序阻塞式的大脑计划行为无法很好地映射到面向回调的异步代码。这就是回调方式最主要的缺陷：对于它们在代码中表达异步的方式，我们的大脑需要努力才能同步得上。

### Promise

不足用p instanceof Promise 以作为检查方法，原因有许多。其中最主要的是，Promise 值可能是从其他浏览器窗口（iframe 等）接收到的。这个浏览器窗口自己的 Promise 可能和当前窗口 /frame 的不同，因此这样的检查无法识别 Promise实例。还有，库或框架可能会选择实现自己的 Promise，而不是使用原生 ES6 Promise 实现。实际上，很有可能你是在早期根本没有 Promise 实现的浏览器中使用由库提供的 Promise。

- 鸭子类型：“如果它看起来像只鸭子，叫起来像只鸭子，那它一定就是只鸭子”

```js
if ( 
  p !== null && 
  ( 
    typeof p === "object" || 
    typeof p === "function" 
  ) && 
  typeof p.then === "function" 
) { 
  // 假定这是一个thenable! 
} 
else { 
  // 不是thenable 
}

Object.prototype.then = function(){}; 
Array.prototype.then = function(){}; 
var v1 = { hello: "world" }; 
var v2 = [ "Hello", "World" ]; 
```

我并不喜欢最后还得用 thenable 鸭子类型检测作为 Promise 的识别方案。还有其他选择，比如 branding，甚至 anti-branding。可我们所用的似乎是针对最差情况的妥协。但情况也并不完全是一片黯淡。后面我们就会看到，thenable 鸭子类型检测还是有用的。只是要清楚，如果 thenable 鸭子类型误把不是 Promise 的东西识别为了 Promise，可能就是有害的。

Promise 创建对象调用 resolve(..) 或 reject(..) 时，这个 Promise 的then(..) 注册的观察回调就会被自动调度。可以确信，这些被调度的回调在下一个异步事件点上一定会被触发。所以一个同步任务链无法以这种方式运行来实现按照预期有效延迟另一个回调的发生。也就是说，一个 Promise 决议后，这个 Promise 上所有的通过then(..) 注册的回调都会在下一个异步时机点上依次被立即调用。这些回调中的任意一个都无法影响或延误对其他回调的调用。

```js
p.then( function(){ 
  p.then( function(){ 
    console.log( "C" ); 
  } ); 
  console.log( "A" ); 
} ); 
p.then( function(){ 
  console.log( "B" ); 
} ); 
// A B C 
// 这里，"C" 无法打断或抢占 "B"，这是因为 Promise 的运作方式。

var p3 = new Promise( function(resolve,reject){ 
  resolve( "B" ); 
} ); 
var p1 = new Promise( function(resolve,reject){ 
  resolve( p3 ); 
} ); 
p2 = new Promise( function(resolve,reject){ 
  resolve( "A" ); 
} ); 
p1.then( function(v){ 
  console.log( v ); 
} );
p2.then( function(v){ 
  console.log( v ); 
} ); 
// A B <-- 而不是像你可能认为的B A 
```

如果在 Promise 的创建过程中或在查看其决议结果过程中的任何时间点上出现了一个 JavaScript 异常错误，比如一个 TypeError 或ReferenceError，那这个异常就会被捕捉，并且会使这个 Promise 被拒绝。

```js
var p = new Promise( function(resolve,reject){ 
  foo.bar(); // foo未定义，所以会出错！
  resolve( 42 ); // 永远不会到达这里 :( 
} ); 
p.then( 
  function fulfilled(){ 
    // 永远不会到达这里 :( 
  }, 
  function rejected(err){ 
    // err将会是一个TypeError异常对象来自foo.bar()这一行
  } 
); 
```

如果向 Promise.resolve(..) 传递一个非 Promise、非 thenable 的立即值，就会得到一个用这个值填充的 promise。下面这种情况下，promise p1 和 promise p2 的行为是完全一样的：

```js
var p1 = new Promise( function(resolve,reject){ 
  resolve( 42 ); 
} ); 
var p2 = Promise.resolve( 42 );
```

而如果向 Promise.resolve(..) 传递一个真正的 Promise，就只会返回同一个 promise：

```js
var p1 = Promise.resolve( 42 ); 
var p2 = Promise.resolve( p1 );
p1 === p2; // true
```
更重要的是，如果向 Promise.resolve(..) 传递了一个非 Promise 的 thenable 值，前者就会试图展开这个值，而且展开过程会持续到提取出一个具体的非类 Promise 的最终值。

```js
var p = { 
  then: function(cb) { 
    cb( 42 ); 
  } 
}; 
// 这可以工作，但只是因为幸运而已
p 
.then( 
  function fulfilled(val){ 
    console.log( val ); // 42 
  }, 
  function rejected(err){ 
    // 永远不会到达这里
  } 
); 

var p = { 
  then: function(cb,errcb) { 
    cb( 42 ); 
    errcb( "evil laugh" ); 
  } 
}; 
p 
.then( 
  function fulfilled(val){ 
    console.log( val ); // 42 
  }, 
  function rejected(err){ 
    // 啊，不应该运行！
    console.log( err ); // 邪恶的笑
  } 
); 
// 这个 p 是一个 thenable，
```

尽管如此，我们还是都可以把这些版本的 p 传给 Promise.resolve(..)，然后就会得到期望Promise中的规范化后的安全结果：

```js
Promise.resolve( p ) 
.then( 
  function fulfilled(val){ 
    console.log( val ); // 42 
  }, 
  function rejected(err){ 
    // 永远不会到达这里
  } 
); 
```

Promise.resolve(..) 可以接受任何 thenable，将其解封为它的非 thenable 值。从 Promise.resolve(..) 得到的是一个真正的 Promise，是一个可以信任的值。如果你传入的已经是真正的 Promise，那么你得到的就是它本身，所以通过 Promise.resolve(..) 过滤来获得可信任性完全没有坏处。

```js
// 不要只是这么做：
foo( 42 ) 
.then( function(v){ 
  console.log( v ); 
} ); 
// 而要这么做：
Promise.resolve( foo( 42 ) ) 
.then( function(v){ 
  console.log( v ); 
} );
```

```js
var p = Promise.resolve( 21 ); 
var p2 = p.then( function(v){ 
  console.log( v ); // 21 
  // 用值42填充p2
  return v * 2; 
} ); 
// 连接p2 
p2.then( function(v){ 
  console.log( v ); // 42 
} );

var p = Promise.resolve( 21 ); 
p 
.then( function(v){ 
  console.log( v ); // 21 
  // 用值42完成连接的promise 
  return v * 2; 
} ) 
// 这里是链接的promise 
.then( function(v){ 
  console.log( v ); // 42 
} ); 
```

如果需要步骤 2 等待步骤 1 异步来完成一些事情怎么办？我们使用了立即返回 return 语句，这会立即完成链接的 promise。

```js
var p = Promise.resolve( 21 ); 
p.then( function(v){ 
  console.log( v ); // 21 
  // 创建一个promise并将其返回
  return new Promise( function(resolve,reject){ 
    // 用值42填充
    resolve( v * 2 ); 
  } ); 
} ) 
.then( function(v){ 
  console.log( v ); // 42 
} ); 
```

虽然我们把 42 封装到了返回的 promise 中，但它仍然会被展开并最终成为链接的 promise的决议，因此第二个 then(..) 得到的仍然是 42。如果我们向封装的 promise 引入异步，一切都仍然会同样工作：

```js
var p = Promise.resolve( 21 ); 
p.then( function(v){ 
  console.log( v ); // 21 200 ｜ 第 3 章
  // 创建一个promise并返回
  return new Promise( function(resolve,reject){ 
    // 引入异步！
    setTimeout( function(){ 
      // 用值42填充
      resolve( v * 2 ); 
    }, 100 ); 
  } ); 
} ) 
.then( function(v){ 
  // 在前一步中的100ms延迟之后运行
  console.log( v ); // 42 
} );
```

当然，在这些例子中，一步步传递的值是可选的。如果不显式返回一个值，就会隐式返回undefined，并且这些 promise 仍然会以同样的方式链接在一起。这样，每个 Promise 的决议就成了继续下一个步骤的信号。

```js
// 步骤1：
request( "http://some.url.1/" ) 
// 步骤2：
.then( function(response1){ 
  foo.bar(); // undefined，出错！
  // 永远不会到达这里
  return request( "http://some.url.2/?v=" + response1 ); 
} ) 
// 步骤3：
.then( 
  function fulfilled(response2){ 
  // 永远不会到达这里
  }, 
  // 捕捉错误的拒绝处理函数
  function rejected(err){ 
    console.log( err ); 
    // 来自foo.bar()的错误TypeError 
    return 42; 
  } 
) 
// 步骤4：
.then( function(msg){ 
  console.log( msg ); // 42 
} ); 
```

Promise.resolve(..) 会将传入的真正 Promise 直接返回，对传入的 thenable 则会展开。如果这个 thenable 展开得到一个拒绝状态，那么从 Promise.resolve(..) 返回的 Promise 实际上就是这同一个拒绝状态。

Promise(..) 构造器的第一个参数回调会展开 thenable（和 Promise.resolve(..) 一样）或真正的 Promise：

```js
var rejectedPr = new Promise( function(resolve,reject){ 
  // 用一个被拒绝的promise完成这个promise 
  resolve( Promise.reject( "Oops" ) ); 
} ); 
rejectedPr.then( 
  function fulfilled(){ 
    // 永远不会到达这里
  }, 
  function rejected(err){ 
    console.log( err ); // "Oops" 206 ｜ 第 3 章
  } 
); 
```

前面提到的 reject(..) 不会像 resolve(..) 一 样 进 行 展 开。 如 果 向reject(..) 传入一个 Promise/thenable 值，它会把这个值原封不动地设置为拒绝理由。后续的拒绝处理函数接收到的是你实际传给 reject(..) 的那个Promise/thenable，而不是其底层的立即值。

对多数开发者来说，错误处理最自然的形式就是同步的 try..catch 结构。遗憾的是，它只能是同步的，无法用于异步代码模式：

```js
function foo() { 
  setTimeout( function(){ 
    baz.bar(); 
  }, 100 ); 
} 
try { Promise ｜ 207
  foo(); 
  // 后面从 `baz.bar()` 抛出全局错误
} 
catch (err) { 
  // 永远不会到达这里
} 
```

try..catch 当然很好，但是无法跨异步操作工作。也就是说，还需要一些额外的环境支持。

```js
function foo(cb) { 
  setTimeout( function(){ 
    try { 
      var x = baz.bar(); 
      cb( null, x ); // 成功！
    } 
    catch (err) { 
      cb( err ); 
    } 
  }, 100 ); 
} 
foo( function(err,val){ 
  if (err) { 
    console.error( err ); // 烦 :( 
  } 
  else { 
    console.log( val ); 
  } 
} );
// 只有在 baz.bar() 调用会同步地立即成功或失败的情况下，这里的 try..catch 才能工作。如果 baz.bar() 本身有自己的异步完成函数，其中的任何异步错误都将无法捕捉到。
```

为了避免丢失被忽略和抛弃的 Promise 错误，一些开发者表示，Promise 链的一个最佳实践就是最后总以一个 catch(..) 结束，比如：

```js
var p = Promise.resolve( 42 ); 
p.then( 
  function fulfilled(msg){ 
    // 数字没有string函数，所以会抛出错误
    console.log( msg.toLowerCase() ); 
  } 
) 
.catch( handleErrors );
```

- 默认情况下，Promsie 在下一个任务或时间循环 tick 上（向开发者终端）报告所有拒绝，如果在这个时间点上该 Promise 上还没有注册错误处理函数。
- 如果想要一个被拒绝的 Promise 在查看之前的某个时间段内保持被拒绝状态，可以调用defer()（禁止这种错误报告），这个函数优先级高于该 Promise 的自动错误报告。

Promise.all([ .. ]) 需要一个参数，是一个数组，通常由 Promise 实例组成。从 Promise.all([ .. ]) 调用返回的 promise 会收到一个完成消息（代码片段中的 msg）。这是一个由所有传入 promise 的完成消息组成的数组，与指定的顺序一致（与完成顺序无关）

```js
// request(..)是一个Promise-aware Ajax工具
// 就像我们在本章前面定义的一样
var p1 = request( "http://some.url.1/" ); 
var p2 = request( "http://some.url.2/" ); 
Promise.all( [p1,p2] ) 
.then( function(msgs){ 
  // 这里，p1和p2完成并把它们的消息传入
  return request( 
    "http://some.url.3/?v=" + msgs.join(",") 
  ); 
} ) 
.then( function(msg){ 
  console.log( msg ); 
} ); 
```

严格说来，传给Promise.all([ .. ]) 的数组中的值可以是 Promise、thenable，甚至是立即值。就本质而言，列表中的每个值都会通过 Promise.resolve(..) 过滤，以确保要等待的是一个真正的 Promise，所以立即值会被规范化为为这个值构建的 Promise。如果数组是空的，主 Promise 就会立即完成。

与 Promise.all([ .. ]) 类似，一旦有任何一个 Promise 决议为完成，Promise.race([ .. ])就会完成；一旦有任何一个 Promise 决议为拒绝，它就会拒绝。

```js
// request(..)是一个支持Promise的Ajax工具
// 就像我们在本章前面定义的一样
var p1 = request( "http://some.url.1/" ); 
var p2 = request( "http://some.url.2/" ); 
Promise.race( [p1,p2] ) 
.then( function(msg){ 
  // p1或者p2将赢得这场竞赛
  return request( 
    "http://some.url.3/?v=" + msg 
  ); 
} ) 
.then( function(msg){ 
  console.log( msg ); 
} ); 
```

```js
var fulfilledTh = { 
  then: function(cb) { cb( 42 ); } 
}; 
var rejectedTh = { 
  then: function(cb,errCb) { 
    errCb( "Oops" ); 
  } 
}; 
var p1 = Promise.resolve( fulfilledTh ); 
var p2 = Promise.resolve( rejectedTh ); 
// p1是完成的promise
// p2是拒绝的promise
```

还要记住，如果传入的是真正的 Promise，Promise.resolve(..) 什么都不会做，只会直接把这个值返回。所以，对你不了解属性的值调用 Promise.resolve(..)，如果它恰好是一个真正的 Promise，是不会有额外的开销的。

```js
var p1 = Promise.resolve( 42 ); 
var p2 = Promise.resolve( "Hello World" ); 
var p3 = Promise.reject( "Oops" ); 
Promise.race( [p1,p2,p3] ) 
  .then( function(msg){ 
  console.log( msg ); // 42 
} ); 
Promise.all( [p1,p2,p3] ) 
.catch( function(err){ 
  console.error( err ); // "Oops" 
} ); 
Promise.all( [p1,p2] ) 
.then( function(msgs){ 
  console.log( msgs ); // [42,"Hello World"] 
} ); 
```

当心！若向 Promise.all([ .. ]) 传入空数组，它会立即完成，但 Promise.race([ .. ]) 会挂住，且永远不会决议。

### 生成器

> generator

### 程序性能

### 性能测试与调优

## 起步上路

### 深入编程

### 深入JavaScript

### 深入“你不知道的JavaScript系列”

## ES6及更新版本

### ES？现在与未来

### 语法

### 代码组织

### 异步流控制

### 集合

### 新增API

### 元编程

### ES6之后
