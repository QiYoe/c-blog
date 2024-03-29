---
head:
  - - meta
    - name: description
      content: you-dont-know-JS读书笔记
  - - meta
    - name: keywords
      content: 你不知道的JavaScript you-dont-know-JS 你不知道的JS 读书笔记
---

# 你不知道的JavaScript

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

8中基本类型：string、number、boolean、null、undefined、object、`symbol(es6)`、`bigInt(es10)`

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

> - **`__proto__`：读作“dunder proto”,就是[[Prototype]], 由一个对象指向一个对象`即指向他们的原型对象`——终点：null**
> - **`prototype`：函数独有，由一个函数指向一个对象，是函数的原型对象，即函数所创建的实例的原型对象——终点：Object.prototype**
> - **`constructor`：一个对象指向一个函数，即指向该对象的构造函数——终点：Function()**

```js
var anotherObject = {
  a:2
};
var myObject = Object.create( anotherObject );
anotherObject.a; // 2
myObject.a; // 2
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

> 函数不是构造函数，但是当且仅当使用 new 时，函数调用会变成“构造函数调用”;
>
> 实例的.constructor引用被委托给了Foo.prototype，而Foo.prototype.constructor默认指向Foo（Foo声明时的默认属性）

**a.constructor === Foo 为真意味着 a 确实有一个指向 Foo 的 .constructor 属性，但是事实不是这样。`实际上，.constructor 引用同样被委托给了 Foo.prototype，而Foo.prototype.constructor 默认指向 Foo`。举例来说，Foo.prototype 的 .constructor 属性只是 Foo 函数在声明时的默认属性。如果你创建了一个新对象并替换了函数默认的 .prototype 对象引用，那么新对象并不会自动获得 .constructor 属性。constructor 并不表示被构造**

> a instanceof Foo：在 a 的整条 [[Prototype]] 链中是否有指向 Foo.prototype 的对象？（只能处理对象和函数关系）**使用isPrototypeOf和getPrototypeOf代替**
> 
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
var b2 = Object.create( Bar );
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

**`Symbol`可以用作属性名，但无论是在代码还是开发控制台中都无法查看和访问它的值**

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
isThisCool(); // true
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
对大多数简单值来说，JSON 字符串化和 toString() 的效果基本相同，只不过序列化的结果总是字符串：

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

JSON.stringify 还有一个可选参数 space，用来指定输出的缩进格式。space 为正整数时是指定每一级缩进的字符数，它还可以是字符串，此时最前面的十个字符被用于每一级的缩进

---

ToNumber:

true 转换为 1，false 转换为 0。undefined 转换为 NaN，null 转换为 0。

对象（包括数组）会首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则再遵循以上规则将其强制转换为数字。

为了将值转换为相应的基本类型值，抽象操作 ToPrimitive 会首先（通过内部操作 [[DefaultValue]] ）检查该值是否有 valueOf() 方法。如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString()的返回值（如果存在）来进行强制类型转换。如果 valueOf() 和 toString() 均不返回基本类型值，会产生 TypeError 错误(返回 NaN)。

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

字符串和数字之间的转换是通过 String(..) 和 Number(..) 这两个内建函数（[原生构造函数](#原生函数（内置函数）)）来实现的，请注意它们前面没有 new 关键字，并不创建封装对象。
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

[] == {}            // false  "" == "[object Object]"
{} == []            // SynyaxError  独立空代码块 == ""
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
var h = Object( g ); // new Number(NaN) -> NaN
g == h; // false
// 因为没有对应的封装对象，所以 null 和 undefined 不能够被封装（boxed），Object(null)和 Object() 均返回一个常规对象。NaN 能够被封装为数字封装对象，但拆封之后 NaN == NaN 返回 false，因为 NaN 不等于 NaN

"0" == null; // false
"0" == undefined; // false
"0" == false; // true
"0" == NaN; // false
"0" == 0; // true
"0" == ""; // false  当类型相同时停止隐式转换
0 == ""; // true
false == null; // false
false == undefined; // false
false == NaN; // false
false == 0; // true
false == ""; // true
false == []; // true -- 晕！
false == {}; // false
"" == null; // false
"" == undefined; // false
"" == NaN; // false
"" == 0; // true
"" == []; // true
"" == {}; // false
0 == null; // false
0 == undefined; // false
0 == NaN; // false
0 == []; // true
0 == {}; // false
[] == ![] // true
"" == [null]; // true  [null].toString() -> ""
0 == "\n"; // true -- 晕！ ""、"\n"（或者 " " 等其他空格组合）等空字符串被 ToNumber 强制类型转换为 0。
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
>> // 实际上 JavaScript 中 <= 是“不大于”的意思（即 !(a > b)）。同理 a >= b 处理为 !(a < b>)。
>> var a = [ 42 ];
>> var b = "043";
>> a < b; // false -- 字符串比较！ "42" < "042"
>> Number( a ) < Number( b ); // true -- 数字比较！ 42 < 43
>> ```
> 比较双方都是字符串
>> 避免 a < b 中发生隐式强制类型转换，只能确保 a 和 b 为相同的类型

### 语法

- 语句（statement）相当于句子
  - 语句都有一个`结果值`(只有控制台可以获得，代码中无法获得)
  - 语句由一个或多个表达式组成
- 表达式（expression）相当于短语
  - 一个表达式是对一个变量或值的引用，或者是一组值和变量与运算符的组合

举例来说，a = b * 2; 这个语句中有四个表达式。
- 2 是一个字面值表达式。 
- b 是一个变量表达式，表示获取它的当前值。 
- b * 2 是一个算术表达式，表示进行乘法运算。 
- a = b * 2 是一个赋值表达式，意思是将表达式 b * 2 的结果赋值给变量 a（我们将在后文中深入介绍赋值）。

一个独立的表达式也可以称为表达式语句，如下所示：b * 2;

这种表达式语句不是很常用，或者说不是很有用，因为它通常不会对程序的运行起到任何作用，它只是取得 b 的值并乘以 2，但是却没有对结果有任何影响。

更常用的表达式语句是调用表达式语句（参见 1.11 节），因为整个语句本身就是一个函数调用表达式：alert( a );

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
    return matches;
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

带标签的循环跳转一个更大的用处在于，和 break 一起使用可以实现从内层循环跳转到外层循环。没有它们的话实现起来有时会非常麻烦：

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

标签也能用于非循环代码块，但只有 break 才可以。我们可以对带标签的代码块使用 break ，但是不能对带标签的非循环代码块使用 continue ，也不能对不带标签的代码块使用 break：

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
标签不允许使用双引号，如控制台中输入 {"a":42} 会报错`因为带上双引号的话就是对象键值对了`

JSON 的确是 JavaScript 语法的一个子集，但是 JSON 本身并不是合法的 JavaScript 语法。

JSON-P 能将 JSON 转换为合法的JavaScript 语法。JSON-P（将 JSON 数据封装为函数调用，比如 foo({"a":42})）通过将 JSON 数据传递给函数来实现对其的访问

**解构：{ a, b } 实际上是 { a: a, b: b } 的简化版本**

&& 运算符先于 || 执行
:::

```js
true || false && false; // true
(true || false) && false; // false
true || (false && false); // true

// && > || > ?: > =
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
  console.log( "Crazy" );
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

- 将来：
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

[顺序的大脑](/book/quotations#顺序的大脑)

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
  doB();
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

不足以用p instanceof Promise 以作为检查方法，原因有许多。其中最主要的是，Promise 值可能是从其他浏览器窗口（iframe 等）接收到的。这个浏览器窗口自己的 Promise 可能和当前窗口 /frame 的不同，因此这样的检查无法识别 Promise实例。还有，库或框架可能会选择实现自己的 Promise，而不是使用原生 ES6 Promise 实现。实际上，很有可能你是在早期根本没有 Promise 实现的浏览器中使用由库提供的 Promise。

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

- 如果向 Promise.resolve(..) 传递一个非 Promise、非 thenable 的立即值，就会得到一个用这个值填充的 promise。下面这种情况下，promise p1 和 promise p2 的行为是完全一样的：

```js
var p1 = new Promise( function(resolve,reject){ 
  resolve( 42 ); 
} ); 
var p2 = Promise.resolve( 42 );
```

- 如果向 Promise.resolve(..) 传递一个真正的 Promise，就只会返回同一个 promise：

```js
var p1 = Promise.resolve( 42 ); 
var p2 = Promise.resolve( p1 );
p1 === p2; // true
```
- 如果向 Promise.resolve(..) 传递了一个非 Promise 的 thenable 值，前者就会试图展开这个值，而且展开过程会持续到提取出一个具体的非类 Promise 的最终值。

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
  console.log( v ); // 21
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
    console.log( err ); // "Oops"
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
try {
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

JavaScript 开发者在代码中几乎普遍依赖的一个假定：一个函数一旦开始执行，就会运行到结束，期间不会有其他代码能够打断它并插入其间。不过 ES6 引入了一个新的函数类型，它并不符合这种运行到结束的特性。这类新的函数被称为生成器。

```js
var x = 1; 
function *foo() { 
  x++; 
  yield; // 暂停！
  console.log( "x:", x ); 
} 
function bar() { 
  x++; 
}
// 构造一个迭代器it来控制这个生成器  创建了一个迭代器对象，把它赋给了一个变量 it
var it = foo(); 
// 这里启动foo()！
it.next(); 
x; // 2 
bar(); 
x; // 3 
it.next(); // x: 3 
```

执行过程：

1. it = foo() 运算并没有执行生成器 *foo()，而只是构造了一个迭代器（iterator），这个迭代器会控制它的执行。后面会介绍迭代器。
2. 第一个 it.next() 启动了生成器 *foo()，并运行了 *foo() 第一行的 x++。
3. *foo() 在 yield 语句处暂停，在这一点上第一个 it.next() 调用结束。此时 *foo() 仍在运行并且是活跃的，但处于暂停状态。
4. 我们查看 x 的值，此时为 2。
5. 我们调用 bar()，它通过 x++ 再次递增 x。
6. 我们再次查看 x 的值，此时为 3。
7. 最后的 it.next() 调用从暂停处恢复了生成器 *foo() 的执行，并运行 console.log(..)语句，这条语句使用当前 x 的值 3。

生成器函数是一个特殊的函数，具有前面我们展示的新的执行模式。但是，它仍然是一个函数，这意味着它仍然有一些基本的特性没有改变。比如，它仍然可以接受参数（即输入），也能够返回值（即输出）。

```js
function *foo(x,y) { 
  return x * y; 
} 
var it = foo( 6, 7 );
var res = it.next(); 
res.value; // 42 
```

```js
function *foo(x) { 
  var y = x * (yield); 
  return y; 
} 
var it = foo( 6 ); 
// 启动foo(..) 
it.next(); 
var res = it.next( 7 ); 
res.value; // 42 
```

首先，传入 6 作为参数 x。然后调用 it.next()，这会启动 *foo(..)。在 *foo(..) 内部，开始执行语句 var y = x ..，但随后就遇到了一个 yield 表达式。它就会在这一点上暂停 *foo(..)（在赋值语句中间！），并在本质上要求调用代码为 yield表达式提供一个结果值。接下来，调用 it.next( 7 )，这一句把值 7 传回作为被暂停的yield 表达式的结果。所以，这时赋值语句实际上就是 var y = 6 * 7。现在，return y 返回值 42 作为调用it.next( 7 ) 的结果。

:::warning 注意
一般来说，需要的 next(..) 调用要比 yield 语句多一个，前面的代码片段有一个 yield 和两个 next(..) 调用。因为第一个 next(..) 总是启动一个生成器，并运行到第一个 yield 处。不过，是第二个next(..) 调用完成第一个被暂停的 yield 表达式，第三个 next(..) 调用完成第二个 yield，以此类推。
:::

消息是双向传递的——yield.. 作为一个表达式可以发出消息响应 next(..) 调用，next(..) 也可以向暂停的 yield 表达式发送值。考虑下面这段稍稍调整过的代码：

```js
function *foo(x) { 
  var y = x * (yield "Hello"); // <-- yield一个值！
  return y; 
} 
var it = foo( 6 ); 
var res = it.next(); // 第一个next()，并不传入任何东西
res.value; // "Hello" 
res = it.next( 7 ); // 向等待的yield传入7
res.value; // 42
```

:::warning 提示
生成器的起始处我们调用第一个 next() 时，还没有暂停的 yield 来接受这样一个值。规范和所有兼容浏览器都会默默丢弃传递给第一个 next() 的任何东西。传值过去仍然不是一个好思路，因为你创建了沉默的无效代码，这会让人迷惑。因此，启动生成器时一定要用不带参数的 next()。
:::

同一个生成器的多个实例可以同时运行，它们甚至可以彼此交互(交替执行)：
```js
function *foo() { 
  var x = yield 2; 
  z++; 
  var y = yield (x * z); 
  console.log( x, y, z ); 
} 
var z = 1; 
var it1 = foo(); 
var it2 = foo(); 
var val1 = it1.next().value; // 2 <-- yield 2 
var val2 = it2.next().value; // 2 <-- yield 2 
val1 = it1.next( val2 * 10 ).value; // 40 <-- x:20, z:2 
val2 = it2.next( val1 * 5 ).value; // 600 <-- x:200, z:3 
it1.next( val2 / 2 ); // y:300 
                      // 20 300 3 
it2.next( val1 / 4 ); // y:10 
                      // 200 10 3 
```

1. *foo() 的两个实例同时启动，两个 next() 分别从 yield 2 语句得到值 2。
2. val2 * 10 也就是 2 * 10，发送到第一个生成器实例 it1，因此 x 得到值 20。z 从 1 增加到 2，然后 20 * 2 通过 yield 发出，将 val1 设置为 40。
3. val1 * 5 也就是 40 * 5，发送到第二个生成器实例 it2，因此 x 得到值 200。z 再次从 2递增到 3，然后 200 * 3 通过 yield 发出，将 val2 设置为 600。
4. val2 / 2 也就是 600 / 2，发送到第一个生成器实例 it1，因此 y 得到值 300，然后打印出 x y z 的值分别是 20 300 3。
5. val1 / 4 也就是 40 / 4，发送到第二个生成器实例 it2，因此 y 得到值 10，然后打印出x y z 的值分别为 200 10 3。

```js
var a = 1; 
var b = 2; 
function *foo() { 
  a++; 
  yield; 
  b = b * a; 
  a = (yield b) + 3; 
} 
function *bar() { 
  b--; 
  yield; 
  a = (yield 8) + b; 
  b = a * (yield 2); 
}
function step(gen) { 
  var it = gen(); 
  var last; 
  return function() { 
    // 不管yield出来的是什么，下一次都把它原样传回去！
    last = it.next( last ).value; 
  }; 
}
// 确保重新设置a和b
a = 1; 
b = 2; 
var s1 = step( foo ); 
var s2 = step( bar ); 
s2(); // b--; 
s2(); // yield 8 
s1(); // a++; 
s2(); // a = 8 + b; 
      // yield 2 
s1(); // b = b * a; 
      // yield b 
s1(); // a = b + 3; 
s2(); // b = a * 2; 
console.log( a, b ); // 12 18 
```

标准的迭代器接口：
```js
var something = (function(){ 
  var nextVal; 
  return { 
    // for..of循环需要
    [Symbol.iterator]: function(){ return this; }, 
    // 标准迭代器接口方法
    next: function(){ 
      if (nextVal === undefined) { 
        nextVal = 1; 
      } 
      else { 
        nextVal = (3 * nextVal) + 6; 
      } 
      return { done:false, value:nextVal }; 
    } 
  }; 
})(); 
something.next().value; // 1 
something.next().value; // 9 
something.next().value; // 33 
something.next().value; // 105 
```

ES6原生循环语法自动迭代标准迭代器：
```js
for (var v of something) { 
  console.log( v ); 
  // 不要死循环！
  if (v > 500) { 
    break; 
  } 
} 
// 1 9 33 105 321 969 
// 因为我们的迭代器 something 总是返回 done:false，因此这个 for..of 循环将永远运行下去，这也就是为什么我们要在里面放一个 break 条件。迭代器永不结束是完全没问题的，但是也有一些情况下，迭代器会在有限的值集合上运行，并最终返回 done:true。

// 数组迭代器
var a = [1,3,5,7,9]; 
for (var v of a) { 
  console.log( v ); 
} 
// 1 3 5 7 9 
// for..of 循环自动调用它的 Symbol.iterator 函数来构建一个迭代器。

// 也可以手工调用这个函数，然后使用它返回的迭代器：
var a = [1,3,5,7,9]; 
var it = a[Symbol.iterator](); 
it.next().value; // 1 
it.next().value; // 3 
it.next().value; // 5 
.. 
```

迭代器（一个包含可以在其值上迭代`iterable`的迭代器对象）：接口有next()方法

从 ES6 开始，从一个 iterable 中提取迭代器的方法是：iterable 必须支持一个函数，其名称是专门的 ES6 符号值 Symbol.iterator。调用这个函数时，它会返回一个迭代器。通常每次调用会返回一个全新的迭代器，虽然这一点并不是必须的

当你执行一个生成器，就得到了一个迭代器。通过生成器实现前面的这个 something 无限数字序列生产者：
```js
function *something() { 
  var nextVal; 
  while (true) { 
    if (nextVal === undefined) { 
      nextVal = 1; 
    } 
    else { 
      nextVal = (3 * nextVal) + 6; 
    } 
    yield nextVal; 
  } 
}
```

```js
for (var v of something()) { 
  console.log( v ); 
  // 不要死循环！
  if (v > 500) { 
    break; 
  } 
} 
// 1 9 33 105 321 969 
```
不要忽略了这段 for (var v of something()) .. ！我们并不是像前面的例子那样把something 当作一个值来引用，而是调用了 *something() 生成器以得到它的迭代器供 for..of 循环使用。
- 为什么不能用 for (var v of something) .. ？因为这里的 something 是生成器，并不是iterable。我们需要调用 something() 来构造一个生产者供 for..of 循环迭代。
- something() 调用产生一个迭代器，但 for..of 循环需要的是一个 iterable，对吧？是的。生成器的迭代器也有一个 Symbol.iterator 函数，基本上这个函数做的就是 return this，和我们前面定义的 iterable something 一样。换句话说，生成器的迭代器也是一个iterable ！

for..of 循环的“异常结束”（也就是“提前终止”），通常由 break、return 或者未捕获异常引起，会向生成器的迭代器发送一个信号使其终止。

严格地说，在循环正常结束之后，for..of 循环也会向迭代器发送这个信号。对于生成器来说，这本质上是没有意义的操作，因为生成器的迭代器需要先完成 for..of 循环才能结束。但是，自定义的迭代器可能会需要从 for..of循环的消费者那里接收这个额外的信号。

如果在生成器内有 try..finally 语句，它将总是运行，即使生成器已经外部结束。如果需要清理资源的话（数据库连接等），这一点非常有用：
```js
function *something() { 
  try { 
    var nextVal; 
    while (true) { 
      if (nextVal === undefined) { 
        nextVal = 1; 
      } 
      else { 
        nextVal = (3 * nextVal) + 6; 
      } 
      yield nextVal; 
    } 
  } 
  // 清理子句
  finally { 
    console.log( "cleaning up!" ); 
  } 
} 
```

之前的例子中，for..of 循环内的 break 会触发 finally 语句。但是，也可以在外部通过return(..) 手工终止生成器的迭代器实例：
```js
var it = something(); 
for (var v of it) { 
  console.log( v ); 
  // 不要死循环！
  if (v > 500) { 
    console.log( 
    // 完成生成器的迭代器
    it.return( "Hello World" ).value 
  ); 
  // 这里不需要break 
  } 
} 
// 1 9 33 105 321 969 
// 清理！
// Hello World 
```
调用 it.return(..) 之后，它会立即终止生成器，这当然会运行 finally 语句。另外，它还会把返回的 value 设置为传入 return(..) 的内容，这也就是 "Hello World" 被传出去的过程。现在我们也不需要包含 break 语句了，因为生成器的迭代器已经被设置为done:true，所以 for..of 循环会在下一个迭代终止。

```js
function foo(x,y) { 
  ajax( 
    "http://some.url.1/?x=" + x + "&y=" + y, 
    function(err,data){ 
      if (err) { 
        // 向*main()抛出一个错误
        it.throw( err ); 
      } 
      else { 
        // 用收到的data恢复*main() 
        it.next( data ); 
      } 
    } 
  ); 
} 
function *main() { 
  try { 
    var text = yield foo( 11, 31 );
    console.log( text ); 
  } 
  catch (err) { 
    console.error( err ); 
  } 
} 
var it = main(); 
// 这里启动！
it.next();
```
在 yield foo(11,31) 中，首先调用 foo(11,31)，它没有返回值（即返回 undefined），所以我们发出了一个调用来请求数据，但实际上之后做的是 yield undefined。这没问题，因为这段代码当前并不依赖 yield 出来的值来做任何事情。

所以，生成器在 yield 处暂停，本质上是在提出一个问题：“我应该返回什么值来赋给变量text ？”谁来回答这个问题呢？看一下 foo(..)。如果这个 Ajax 请求成功，我们调用：`it.next( data );`

这会用响应数据恢复生成器，意味着我们暂停的 yield 表达式直接接收到了这个值。然后随着生成器代码继续运行，这个值被赋给局部变量 text。

回头往前看一步，思考一下这意味着什么。我们在生成器内部有了看似完全同步的代码（除了 yield 关键字本身），但隐藏在背后的是，在 foo(..) 内的运行可以完全异步。

这是巨大的改进！对于我们前面陈述的回调无法以顺序同步的、符合我们大脑思考模式的方式表达异步这个问题，这是一个近乎完美的解决方案。

从本质上而言，我们把异步作为实现细节抽象了出去，使得我们可以以同步顺序的形式追踪流程控制：“发出一个 Ajax 请求，等它完成之后打印出响应结果。”并且，当然，我们只在这个流程控制中表达了两个步骤，而这种表达能力是可以无限扩展的，以便我们无论需要多少步骤都可以表达。

从生成器向外抛出错误：
```js
function *main() { 
  var x = yield "Hello World"; 
  yield x.toLowerCase(); // 引发一个异常！
} 
var it = main(); 
it.next().value; // Hello World 
try { 
  it.next( 42 ); 
} 
catch (err) { 
  console.error( err ); // TypeError 
} 
```

可以捕获通过 throw(..) 抛入生成器的同一个错误，基本上也就是给生成器一个处理它的机会；如果没有处理的话，迭代器代码就必须处理：
```js
function *main() { 
  var x = yield "Hello World"; 
  // 永远不会到达这里
  console.log( x ); 
} 
var it = main(); 
it.next(); 
try { 
  // *main()会处理这个错误吗？看看吧！
  it.throw( "Oops" ); 
} 
catch (err) { 
  // 不行，没有处理！
  console.error( err ); // Oops 
} 
```

异步迭代生成器错失了很重要的两点：Promise 的可信任性和可组合性

```js
// 在运行 Ajax 例子中基于 Promise 的实现方法：
function foo(x,y) { 
  return request( 
    "http://some.url.1/?x=" + x + "&y=" + y 
  ); 
} 
foo( 11, 31 ) 
.then( 
  function(text){ 
    console.log( text ); 
  }, 
  function(err){ 
    console.error( err ); 
  } 
); 
// foo(..) 没有返回值（undefined），并且我们的迭代器控制代码并不关心 yield 出来的值。


function foo(x,y) { 
  return request( 
    "http://some.url.1/?x=" + x + "&y=" + y 
  ); 
} 
function *main() { 
  try { 
    var text = yield foo( 11, 31 ); 
    console.log( text ); 
  } 
  catch (err) { 
    console.error( err ); 
  } 
} 
var it = main(); 
var p = it.next().value; 
// 等待promise p决议
p.then( 
  function(text){ 
    it.next( text ); 
  }, 
  function(err){ 
    it.throw( err ); 
  } 
); 
```

```js
function run(gen) { 
  var args = [].slice.call( arguments, 1), it; 
  // 在当前上下文中初始化生成器
  it = gen.apply( this, args ); 
  // 返回一个promise用于生成器完成
  return Promise.resolve() 
    .then( function handleNext(value){ 
      // 对下一个yield出的值运行
      var next = it.next( value ); 
      return (function handleResult(next){ 
        // 生成器运行完毕了吗？
        if (next.done) { 
          return next.value; 
        } 
        // 否则继续运行
        else { 
          return Promise.resolve( next.value ) 
            .then( 
              // 成功就恢复异步循环，把决议的值发回生成器
              handleNext, 
              // 如果value是被拒绝的 promise，
              // 就把错误传回生成器进行出错处理
              function handleErr(err) { 
                return Promise.resolve( 
                    it.throw( err )
                  ) 
                  .then( handleResult ); 
              } 
            ); 
        } 
      })(next); 
    }); 
}

function *main() { 
  // .. 
} 
run( main );
// 它会自动异步运行你传给它的生成器，直到结束。
```

async 与 await

```js
function foo(x,y) { 
  return request( 
    "http://some.url.1/?x=" + x + "&y=" + y 
  ); 
} 
async function main() { 
  try { 
    var text = await foo( 11, 31 ); 
    console.log( text ); 
  }
  catch (err) { 
    console.error( err ); 
  } 
} 
main(); 
```

```js
function *foo() { 
  // 让两个请求"并行"
  var p1 = request( "http://some.url.1" ); 
  var p2 = request( "http://some.url.2" ); 
  // 等待两个promise都决议
  var r1 = yield p1; 
  var r2 = yield p2; 
  var r3 = yield request( 
    "http://some.url.3/?v=" + r1 + "," + r2 
  ); 
  console.log( r3 ); 
} 
// 使用前面定义的工具run(..)
run( foo );
```

观察一下 yield 的位置。p1 和 p2 是并发执行（即“并行”）的用于 Ajax 请求的 promise。哪一个先完成都无所谓，因为 promise 会按照需要在决议状态保持任意长时间。

然后我们使用接下来的两个 yield 语句等待并取得 promise 的决议（分别写入 r1 和 r2）。如果 p1 先决议，那么 yield p1 就会先恢复执行，然后等待 yield p2 恢复。如果 p2 先决议，它就会耐心保持其决议值等待请求，但是 yield p1 将会先等待，直到 p1 决议。

不管哪种情况，p1 和 p2 都会并发执行，无论完成顺序如何，两者都要全部完成，然后才会发出 r3 = yield request..Ajax 请求。

```js
function *foo() { 
  // 让两个请求"并行"，并等待两个promise都决议
  var results = yield Promise.all( [ 
    request( "http://some.url.1" ), 
    request( "http://some.url.2" ) 
  ] ); 
  var r1 = results[0]; 
  var r2 = results[1]; 
  var r3 = yield request( 
    "http://some.url.3/?v=" + r1 + "," + r2 
  ); 
  console.log( r3 ); 
} 
// 使用前面定义的工具run(..) 
run( foo ); 
```

```js
// 注：普通函数，不是生成器
function bar(url1,url2) { 
  return Promise.all( [ 
    request( url1 ), 
    request( url2 ) 
  ] ); 
} 
function *foo() { 
  // 隐藏bar(..)内部基于Promise的并发细节
  var results = yield bar( 
    "http://some.url.1", 
    "http://some.url.2" 
  ); 
  var r1 = results[0]; 
  var r2 = results[1]; 
  var r3 = yield request( 
    "http://some.url.3/?v=" + r1 + "," + r2 
  ); 
  console.log( r3 ); 
} 
// 使用前面定义的工具run(..)
run( foo ); 
```

在 *foo() 内部，我们所做的一切就是要求 bar(..) 给我们一些 results，并通过 yield来等待结果，这样更简洁也更清晰。我们不需要关心在底层是用 Promise.all([ .. ])Promise 组合来实现这一切。我们把异步，实际上是 Promise，作为一个实现细节看待

从一个生成器调用另一个生成器，使用辅助函数 run(..)，就像这样：

```js
function *foo() { 
  var r2 = yield request( "http://some.url.2" ); 
  var r3 = yield request( "http://some.url.3/?v=" + r2 ); 
  return r3; 
} 
function *bar() { 
  var r1 = yield request( "http://some.url.1" ); 
  // 通过 run(..) "委托"给*foo()
  var r3 = yield run( foo ); 
  console.log( r3 ); 
} 
run( bar );
```

通过 run(..) 工具从 *bar() 内部运行 *foo()。这里我们利用了如下事实：我们前面定义的 run(..) 返回一个 promise，这个 promise 在生成器运行结束时（或出错退出时）决议。因此，如果从一个 run(..) 调用中 yield 出来一个 promise 到另一个 run(..) 实例中，它会自动暂停 *bar()，直到 *foo() 结束。

但其实还有一个更好的方法可以实现从 *bar() 调用 *foo()，称为 yield 委托。yield 委托的具体语法是：yield *  （注意多出来的 *）。在我们弄清它在前面的例子中的使用之前，先来看一个简单点的场景：

```js
function *foo() { 
  console.log( "*foo() starting" );
  yield 3; 
  yield 4; 
  console.log( "*foo() finished" ); 
} 
function *bar() { 
  yield 1; 
  yield 2; 
  yield *foo(); // yield委托！
  yield 5; 
} 
var it = bar(); 
it.next().value; // 1 
it.next().value; // 2 
it.next().value; // *foo()启动
                  // 3 
it.next().value; // 4 
it.next().value; // *foo()完成
                  // 5
```

调用 foo() 创建一个迭代器。然后 yield * 把迭代器实例控制（当前 *bar() 生成器的）委托给 / 转移到了这另一个 *foo() 迭代器。

所以，前面两个 it.next() 调用控制的是 *bar()。但当我们发出第三个 it.next() 调用时，*foo() 现在启动了，我们现在控制的是 *foo() 而不是 *bar()。这也是为什么这被称为委托：*bar() 把自己的迭代控制委托给了 *foo()。

一旦 it 迭代器控制消耗了整个 *foo() 迭代器，it 就会自动转回控制 *bar()。

```js
function *foo() { 
  var r2 = yield request( "http://some.url.2" ); 
  var r3 = yield request( "http://some.url.3/?v=" + r2 ); 
  return r3; 
} 
function *bar() { 
  var r1 = yield request( "http://some.url.1" );
  // 通过 yeild* "委托"给*foo()
  var r3 = yield *foo(); 
  console.log( r3 ); 
} 
run( bar ); 
```

这段代码和前面版本的唯一区别就在于使用了 yield *foo()，而不是前面的 yield run(foo)。

yield * 暂停了迭代控制，而不是生成器控制。当你调用 *foo() 生成器时，现在 yield 委托到了它的迭代器。但实际上，你可以 yield 委托到任意iterable，yield *[1,2,3] 会消耗数组值 [1,2,3] 的默认迭代器。

yield 委托的主要目的是代码组织，以达到与普通函数调用的对称。

想像一下有两个模块分别提供了方法 foo() 和 bar()，其中 bar() 调用了 foo()。一般来说，把两者分开实现的原因是该程序的适当的代码组织要求它们位于不同的函数中。比如，可能有些情况下是单独调用 foo()，另外一些地方则由 bar() 调用 foo()。

同样是出于这些原因，保持生成器分离有助于程序的可读性、可维护性和可调试性。在这一方面，yield * 是一个语法上的缩写，用于代替手工在 *foo() 的步骤上迭代，不过是在*bar() 内部。

yield 委托是如何不只用于迭代器控制工作，也用于双向消息传递工作的呢。认真跟踪下面的通过 yield 委托实现的消息流出入：

```js
function *foo() { 
  console.log( "inside *foo():", yield "B" ); 
  console.log( "inside *foo():", yield "C" ); 
  return "D"; 
} 
function *bar() {
  console.log( "inside *bar():", yield "A" ); 
  // yield委托！
  console.log( "inside *bar():", yield *foo() ); 
  console.log( "inside *bar():", yield "E" ); 
  return "F"; 
} 
var it = bar(); 
console.log( "outside:", it.next().value ); 
// outside: A 
console.log( "outside:", it.next( 1 ).value ); 
// inside *bar(): 1 
// outside: B 
console.log( "outside:", it.next( 2 ).value ); 
// inside *foo(): 2 
// outside: C 
console.log( "outside:", it.next( 3 ).value ); 
// inside *foo(): 3 
// inside *bar(): D 
// outside: E 
console.log( "outside:", it.next( 4 ).value ); 
// inside *bar(): 4 
// outside: F 
```

要特别注意 it.next(3) 调用之后的执行步骤。

1. 值 3（通过 *bar() 内部的 yield 委托）传入等待的 *foo() 内部的 yield "C" 表达式。
2. 然后 *foo() 调用 return "D"，但是这个值并没有一直返回到外部的 it.next(3) 调用。
3. 取而代之的是，值 "D" 作为 *bar() 内部等待的 yield*foo() 表达式的结果发出——这个yield 委托本质上在所有的 *foo() 完成之前是暂停的。所以 "D" 成为 *bar() 内部的最后结果，并被打印出来。
4. yield "E" 在 *bar() 内部调用，值 "E" 作为 it.next(3) 调用的结果被 yield 发出。

实际上，yield 委托甚至并不要求必须转到另一个生成器，它可以转到一个非生成器的一般 iterable。比如：

```js
function *bar() { 
  console.log( "inside *bar():", yield "A" );
  // yield委托给非生成器！
  console.log( "inside *bar():", yield *[ "B", "C", "D" ] ); 
  console.log( "inside *bar():", yield "E" ); 
  return "F"; 
} 
var it = bar(); 
console.log( "outside:", it.next().value ); 
// outside: A 
console.log( "outside:", it.next( 1 ).value ); 
// inside *bar(): 1 
// outside: B 
console.log( "outside:", it.next( 2 ).value ); 
// outside: C 
console.log( "outside:", it.next( 3 ).value ); 
// outside: D 
console.log( "outside:", it.next( 4 ).value ); 
// inside *bar(): undefined 
// outside: E 
console.log( "outside:", it.next( 5 ).value ); 
// inside *bar(): 5 
// outside: F 
```

注意这个例子和之前那个例子在消息接收位置和报告位置上的区别。最显著的是，默认的数组迭代器并不关心通过 next(..) 调用发送的任何消息，所以值 2、3 和 4 根本就被忽略了。还有，因为迭代器没有显式的返回值（和前面使用的 *foo() 不同），所以 yield * 表达式完成后得到的是一个 undefined。

异常也被委托！和 yield 委托透明地双向传递消息的方式一样，错误和异常也是双向传递的：

```js
function *foo() { 
  try { 
    yield "B"; 
  } 
  catch (err) { 
    console.log( "error caught inside *foo():", err ); 
  } 
  yield "C"; 
  throw "D"; 
}
function *bar() { 
 yield "A"; 
 try { 
  yield *foo(); 
 } 
 catch (err) { 
  console.log( "error caught inside *bar():", err ); 
 } 
 yield "E"; 
 yield *baz(); 
 // 注：不会到达这里！
 yield "G"; 
} 
function *baz() { 
  throw "F"; 
} 
var it = bar(); 
console.log( "outside:", it.next().value ); 
// outside: A 
console.log( "outside:", it.next( 1 ).value ); 
// outside: B 
console.log( "outside:", it.throw( 2 ).value ); 
// error caught inside *foo(): 2 
// outside: C 
console.log( "outside:", it.next( 3 ).value ); 
// error caught inside *bar(): D 
// outside: E 
try { 
  console.log( "outside:", it.next( 4 ).value ); 
} 
catch (err) { 
  console.log( "error caught outside:", err ); 
} 
// error caught outside: F 
```

这段代码中需要注意以下几点。
1. 调用 it.throw(2) 时，它会发送错误消息 2 到 *bar()，它又将其委托给 *foo()，后者捕获并处理它。然后，yield "C" 把 "C" 发送回去作为 it.throw(2) 调用返回的 value。
2. 接下来从 *foo() 内 throw 出来的值 "D" 传播到 *bar()，这个函数捕获并处理它。然后yield "E" 把 "E" 发送回去作为 it.next(3) 调用返回的 value。
3. 然后，从 *baz() throw 出来的异常并没有在 *bar() 内被捕获——所以 *baz() 和 *bar()都被设置为完成状态。这段代码之后，就再也无法通过任何后续的 next(..) 调用得到值 "G"，next(..) 调用只会给 value 返回 undefined。

我们终于回到前面的多个顺序 Ajax 请求的 yield 委托例子：
```js
function *foo() { 
 var r2 = yield request( "http://some.url.2" ); 
 var r3 = yield request( "http://some.url.3/?v=" + r2 ); 
 return r3; 
} 
function *bar() { 
 var r1 = yield request( "http://some.url.1" ); 
 var r3 = yield *foo(); 
 console.log( r3 ); 
} 
run( bar ); 
```
这里我们在 *bar() 内部没有调用 yield run(foo)，而是调用 yield *foo()。

在这个例子之前的版本中，使用了 Promise 机制（通过 run(..) 控制）把值从 *foo() 内的return r3 传递给 *bar() 中的局部变量 r3。现在，这个值通过 yield * 机制直接返回。除此之外的行为非常相似。

当然，yield 委托可以跟踪任意多委托步骤，只要你把它们连在一起。甚至可以使用 yield委托实现异步的生成器递归，即一个 yield 委托到它自身的生成器：
```js
function *foo(val) { 
  if (val > 1) { 
  // 生成器递归
  val = yield *foo( val - 1 ); 
  } 
  return yield request( "http://some.url/?v=" + val ); 
} 
function *bar() { 
  var r1 = yield *foo( 3 ); 
  console.log( r1 );
} 
run( bar );
```
run(..) 工具可以通过 run( foo, 3 ) 调用，因为它支持额外的参数和生成器一起传入。但是，这里使用了没有参数的 *bar()，以展示 yield * 的灵活性。

1. run(bar) 启动生成器 *bar()。
2. foo(3) 创建了一个 *foo(..) 的迭代器，并传入 3 作为其参数 val。
3. 因为 3 > 1，所以 foo(2) 创建了另一个迭代器，并传入 2 作为其参数 val。
4. 因为 2 > 1，所以 foo(1) 又创建了一个新的迭代器，并传入 1 作为其参数 val。
5. 因为 1 > 1 不成立，所以接下来以值 1 调用 request(..)，并从这第一个 Ajax 调用得到一个 promise。
6. 这个 promise 通过 yield 传出，回到 *foo(2) 生成器实例。
7. yield * 把这个 promise 传出回到 *foo(3) 生成器实例。另一个 yield * 把这个 promise传出回到 *bar() 生成器实例。再有一个 yield * 把这个 promise 传出回到 run(..) 工具，这个工具会等待这个 promsie（第一个 Ajax 请求）的处理。
8. 这个 promise 决议后，它的完成消息会发送出来恢复 *bar()；后者通过 yield * 转入*foo(3) 实例；后者接着通过 yield * 转入 *foo(2) 生成器实例；后者再接着通过 yield *转入 *foo(3) 生成器实例内部的等待着的普通 yield。
9. 第一个调用的 Ajax 响应现在立即从 *foo(3) 生成器实例中返回。这个实例把值作为*foo(2) 实例中 yield * 表达式的结果返回，赋给它的局部变量 val。
10. 在 *foo(2) 中，通过 request(..) 发送了第二个 Ajax 请求。它的 promise 通过 yield发回给 *foo(1) 实例，然后通过 yield * 一路传递到 run(..)（再次进行步骤 7）。这个promise 决议后，第二个 Ajax 响应一路传播回到 *foo(2) 生成器实例，赋给它的局部变量 val。
11. 最后，通过 request(..) 发出第三个 Ajax 请求，它的 promise 传出到 run(..)，然后它的决议值一路返回，然后 return 返回到 *bar() 中等待的 yield * 表达式。

两个同时运行的进程可以合作式地交替运作，而很多时候这可以产生（双关，原文为 yield：既指产生又指 yield 关键字）非常强大的异步表示。
```js
// 首先，使用 Promise 手工实现：
var it1 = reqData( "http://some.url.1" ); 
var it2 = reqData( "http://some.url.2" ); 
var p1 = it1.next(); 
var p2 = it2.next(); 
p1 
.then( function(data){ 
  it1.next( data ); 
  return p2;
} ) 
.then( function(data){ 
  it2.next( data ); 
} ); 
```
*reqData(..) 的两个实例都被启动来发送它们的 Ajax 请求，然后通过 yield 暂停。然后我们选择在 p1 决议时恢复第一个实例，然后 p2 的决议会重启第二个实例。通过这种方式，我们使用 Promise 配置确保 res[0] 中会放置第一个响应，而 res[1] 中会放置第二个响应。
```js
// request(..)是一个支持Promise的Ajax工具
var res = []; 
function *reqData(url) { 
  var data = yield request( url ); 
  // 控制转移
  yield; 
  res.push( data ); 
} 
var it1 = reqData( "http://some.url.1" ); 
var it2 = reqData( "http://some.url.2" ); 
var p1 = it.next(); 
var p2 = it.next(); 
p1.then( function(data){ 
  it1.next( data ); 
} ); 
p2.then( function(data){ 
  it2.next( data ); 
} ); 
Promise.all( [p1,p2] ) 
.then( function(){ 
  it1.next(); 
  it2.next(); 
} ); 
```

在前面的代码中，第二个实例直到第一个实例完全结束才得到数据。但在这里，两个实例都是各自的响应一回来就取得了数据，然后每个实例再次 yield，用于控制传递的目的。
然后我们在 Promise.all([ .. ]) 处理函数中选择它们的恢复顺序。

可能不那么明显的是，因为对称性，这种方法以更简单的形式暗示了一种可重用的工具。还可以做得更好。来设想一下使用一个称为 runAll(..) 的工具：
```js
// request(..)是一个支持Promise的Ajax工具
var res = []; 
runAll( 
  function*(){ 
    var p1 = request( "http://some.url.1" ); 
    // 控制转移
    yield; 
    res.push( yield p1 ); 
  }, 
  function*(){ 
    var p2 = request( "http://some.url.2" ); 
    // 控制转移
    yield; 
    res.push( yield p2 ); 
  } 
); 
```
以下是 runAll(..) 内部运行的过程。
1. 第一个生成器从第一个来自于 "`http://some.url.1`" 的 Ajax 响应得到一个 promise，然后把控制 yield 回 runAll(..) 工具。
2. 第二个生成器运行，对于 "`http://some.url.2`" 实现同样的操作，把控制 yield 回runAll(..) 工具。
3. 第一个生成器恢复运行，通过 yield 传出其 promise p1。在这种情况下，runAll(..) 工具所做的和我们之前的 run(..) 一样，因为它会等待这个 promise 决议，然后恢复同一个生成器（没有控制转移！）。p1 决议后，runAll(..) 使用这个决议值再次恢复第一个生成器，然后 res[0] 得到了自己的值。接着，在第一个生成器完成的时候，有一个隐式的控制转移。
4. 第二个生成器恢复运行，通过 yield 传出其 promise p2，并等待其决议。一旦决议，runAll(..) 就用这个值恢复第二个生成器，设置 res[1]。

在这个例子的运行中，我们使用了一个名为 res 的外层变量来保存两个不同的 Ajax 响应结果，我们的并发协调使其成为可能。但是，如果继续扩展 runAll(..) 来提供一个内层的变量空间，以使多个生成器实例可以共享，将是非常有帮助的，比如下面这个称为 data 的空对象。还有，它可以接受 yield 的非Promise 值，并把它们传递到下一个生成器。
```js
// request(..)是一个支持Promise的Ajax工具
runAll( 
  function*(data){ 
    data.res = []; 
    // 控制转移（以及消息传递）
    var url1 = yield "http://some.url.2"; 
    var p1 = request( url1 ); // "http://some.url.1" 
    // 控制转移
    yield; 
    data.res.push( yield p1 ); 
  }, 
  function*(data){ 
    // 控制转移（以及消息传递）
    var url2 = yield "http://some.url.1"; 
    var p2 = request( url2 ); // "http://some.url.2" 
    // 控制转移
    yield; 
    data.res.push( yield p2 ); 
  } 
); 
```
在这一方案中，实际上两个生成器不只是协调控制转移，还彼此通信，通过 data.res 和yield 的消息来交换 url1 和 url2 的值。真是极其强大！

这样的实现也为被称作通信顺序进程（Communicating Sequential Processes，CSP）的更高级异步技术提供了一个概念基础。

形实转换程序（thunk）：JavaScript 中的 thunk 是指一个用于调用另外一个函数的函数，没有任何参数。换句话说，你用一个函数定义封装函数调用，包括需要的任何参数，来定义这个调用的执行，那么这个封装函数就是一个形实转换程序。之后在执行这个 thunk 时，最终就是调用了原始的函数。
```js
// 同步的 thunk
function foo(x,y) { 
  return x + y; 
} 
function fooThunk() { 
  return foo( 3, 4 ); 
} 
// 将来
console.log( fooThunk() ); // 7

// 异步的 thunk
function foo(x,y,cb) { 
  setTimeout( function(){ 
    cb( x + y ); 
  }, 1000 ); 
} 
function fooThunk(cb) { 
  foo( 3, 4, cb ); 
} 
// 将来
fooThunk( function(sum){ 
  console.log( sum ); // 7 
} ); 

// 但是，你并不会想手工编写 thunk。所以，我们发明一个工具来做这部分封装工作
function thunkify(fn) { 
  var args = [].slice.call( arguments, 1 ); 
  return function(cb) { 
    args.push( cb ); 
    return fn.apply( null, args ); 
  }; 
} 
var fooThunk = thunkify( foo, 3, 4 ); 
// 将来
fooThunk( function(sum) { 
  console.log( sum ); // 7 
} );
```
thunkory（thunk+factory）。于是就有，thunkify(..) 生成一个 thunkory，然后 thunkory 生成 thunk。
```js
var fooThunkory = thunkify( foo ); 
var fooThunk1 = fooThunkory( 3, 4 ); 
var fooThunk2 = fooThunkory( 5, 6 ); 
// 将来
fooThunk1( function(sum) { 
  console.log( sum ); // 7 
} ); 
fooThunk2( function(sum) { 
  console.log( sum ); // 11 
} );

// 更简洁：
var fooThunkory = thunkify( foo ); 
var fooThunk1 = fooThunkory( 3, 4 ); 
var fooThunk2 = fooThunkory( 5, 6 ); 
// 而不是：
var fooThunk1 = thunkify( foo, 3, 4 ); 
var fooThunk2 = thunkify( foo, 5, 6 ); 
```

在第 3 章里我们定义了一个工具用于 promise 化一个函数，我们称之为Promise.wrap(..)，也可以将其称为 promisify(..) ！这个 Promise 封装工具并不产生Promise，它生成的是 promisory，而 promisory 则接着产生 Promise。这和现在讨论的thunkory 和 thunk 是完全对称的。

为了说明这种对称性，我们要首先把前面的 foo(..) 例子修改一下，改成使用 error-first 风格的回调：

```js
function foo(x,y,cb) { 
  setTimeout( function(){ 
    // 假定cb(..)是error-first风格的
    cb( null, x + y ); 
  }, 1000 ); 
} 
```

现在我们对比一下 thunkify(..) 和 promisify(..)（即第 3 章中的 Promise.wrap(..)）的使用：
```js
// 对称：构造问题提问者
var fooThunkory = thunkify( foo ); 
var fooPromisory = promisify( foo ); 
// 对称：提问
var fooThunk = fooThunkory( 3, 4 ); 
var fooPromise = fooPromisory( 3, 4 ); 
// 得到答案
fooThunk( function(err,sum){ 
  if (err) { 
    console.error( err ); 
  } 
  else { 
    console.log( sum ); // 7
  } 
} ); 
// 得到promise答案
fooPromise 
.then( 
  function(sum){ 
    console.log( sum ); // 7 
  }, 
  function(err){ 
    console.error( err ); 
  } 
); 
```

```js
// request(..)是一个支持Promise的Ajax工具
function *foo(url) { 
  try { 
    console.log( "requesting:", url ); 
    var val = yield request( url ); 
    console.log( val ); 
  } 
  catch (err) { 
    console.log( "Oops:", err ); 
    return false; 
  } 
} 
var it = foo( "http://some.url.1" );
// 首先要观察到的是，我们仍然需要一个可以调用的普通函数 foo()，它仍然需要返回一个迭代器。因此，先把非生成器变换的轮廓刻画出来：
function foo(url) { 
  // .. 
  // 构造并返回一个迭代器
  return { 
    next: function(v) { 
    // .. 
  }, 
  throw: function(e) { 
    // .. 
  } 
  }; 
}
var it = foo( "http://some.url.1" ); 

// 接下来要观察到的是，生成器是通过暂停自己的作用域 / 状态实现它的“魔法”的。可以通过函数闭包来模拟这一点。为了理解这样的代码是如何编写的，我们先给生成器的各个部分标注上状态值
// request(..)是一个支持Promise的Ajax工具
function *foo(url) { 
  // 状态1 
  try { 
    console.log( "requesting:", url ); 
    var TMP1 = request( url ); 
    // 状态2 
    var val = yield TMP1; 
    console.log( val ); 
  } 
  catch (err) { 
    // 状态3 
    console.log( "Oops:", err ); 
    return false; 
  } 
} 
// 1 是起始状态，2 是 request(..) 成功后的状态，3 是 request(..) 失败的状态。

// 回到我们翻译的生成器，让我们在闭包中定义一个变量 state 用于跟踪状态：
function foo(url) { 
  // 管理生成器状态
  var state; 
  // .. 
} 

// 现在在闭包内定义一个内层函数，称为 process(..)，使用 switch 语句处理每个状态：
// request(..)是一个支持Promise的Ajax工具 
function foo(url) { 
  // 管理生成器状态282 ｜ 第 4 章
  var state; 
  // 生成器范围变量声明
  var val; 
  function process(v) { 
    switch (state) { 
      case 1: 
        console.log( "requesting:", url ); 
        return request( url ); 
      case 2: 
        val = v; 
        console.log( val ); 
        return; 
      case 3: 
        var err = v; 
        console.log( "Oops:", err ); 
        return false; 
    } 
  } 
  // .. 
}
// 对于每个生成器级的变量声明（val），我们都把它移动为 process(..) 外的一个 val 声明，这样它们就可以在多个 process(..) 调用之间存活。不过块作用域的变量 err 只在状态 3中需要使用，所以把它留在原来的位置。
// 在状态 1，没有了 yield resolve(..)，我们所做的是 return resolve(..)。在终止状态 2，没有显式的 return，所以我们只做一个 return，这等价于 return undefined。在终止状态3，有一个 return false，因此就保留这一句。

// 现在需要定义迭代器函数的代码，使这些函数正确调用 process(..)：
function foo(url) { 
  // 管理生成器状态
  var state; 
  // 生成器变量范围声明
  var val; 
  function process(v) { 
    switch (state) { 
      case 1: 
        console.log( "requesting:", url ); 
        return request( url ); 
      case 2: 
        val = v; 
        console.log( val );
        return; 
      case 3: 
        var err = v; 
        console.log( "Oops:", err ); 
        return false; 
    } 
  } 
  // 构造并返回一个生成器
  return { 
    next: function(v) { 
      // 初始状态
      if (!state) { 
        state = 1; 
        return { 
          done: false, 
          value: process() 
        }; 
      } 
      // yield成功恢复
      else if (state == 1) { 
        state = 2; 
        return { 
          done: true, 
          value: process( v ) 
        }; 
      } 
      // 生成器已经完成
      else { 
        return { 
          done: true, 
          value: undefined 
        }; 
      } 
    }, 
    "throw": function(e) { 
      // 唯一的显式错误处理在状态1
      if (state == 1) { 
        state = 3; 
        return { 
          done: true, 
          value: process( e ) 
        }; 
      } 
      // 否则错误就不会处理，所以只把它抛回
      else { 
        throw e; 
      } 
    } 
  }; 
}
```
1. 对迭代器的 next() 的第一个调用会把生成器从未初始化状态转移到状态 1，然后调用process() 来处理这个状态。request(..) 的返回值是对应 Ajax 响应的 promise，作为value 属性从 next() 调用返回。
2. 如果 Ajax 请求成功，第二个 next(..) 调用应该发送 Ajax 响应值进来，这会把状态转移到状态 2。再次调用 process(..)（这次包括传入的 Ajax 响应值），从 next(..) 返回的 value 属性将是 undefined。
3. 然而，如果 Ajax 请求失败的话，就会使用错误调用 throw(..)，这会把状态从 1 转移到3（而非 2）。再次调用 process(..)，这一次包含错误值。这个 case 返回 false，被作为 throw(..) 调用返回的 value 属性。从外部来看（也就是说，只与迭代器交互），这个普通函数 foo(..) 与生成器 *foo(..) 的工作几乎完全一样。所以我们已经成功地把 ES6 生成器转为了前 ES6 兼容代码！然后就可以手工实例化生成器并控制它的迭代器了，调用 var it = foo("..") 和it.next(..) 等。甚至更好的是，我们可以把它传给前面定义的工具 run(..)，就像run(foo,"..")。

如果使用 regenerator 来转换前面的生成器的话，以下是产生的代码（本书写作之时）：
```js
// request(..)是一个支持Promise的Ajax工具
var foo = regeneratorRuntime.mark(function foo(url) { 
  var val; 
  return regeneratorRuntime.wrap(function foo$(context$1$0) { 
    while (1) switch (context$1$0.prev = context$1$0.next) { 
      case 0: 
        context$1$0.prev = 0; 
        console.log( "requesting:", url ); 生成器 ｜ 285
        context$1$0.next = 4; 
        return request( url ); 
      case 4: 
        val = context$1$0.sent; 
        console.log( val ); 
        context$1$0.next = 12; 
        break; 
      case 8: 
        context$1$0.prev = 8; 
        context$1$0.t0 = context$1$0.catch(0); 
        console.log("Oops:", context$1$0.t0); 
        return context$1$0.abrupt("return", false); 
      case 12: 
      case "end": 
        return context$1$0.stop(); 
    } 
  }, foo, this, [[0, 8]]); 
});
```

### 程序性能

Web Worker是浏览器（即宿主环境）的功能，实际上和 JavaScript 语言本身几乎没什么关系。也就是说，JavaScript 当前并没有任何支持多线程执行的功能。

像浏览器这样的环境，很容易提供多个 JavaScript 引擎实例，各自运行在自己的线程上，这样你可以在每个线程上运行不同的程序。程序中每一个这样的独立的多线程部分被称为一个（Web）Worker。

从 JavaScript 主程序（或另一个 Worker）中，可以这样实例化一个 Worker：
```js
var w1 = new Worker( "http://some.url.1/mycoolworker.js" );
```
这个 URL 应该指向一个 JavaScript 文件的位置（而不是一个 HTML 页面！），这个文件将被加载到一个 Worker 中。然后浏览器启动一个独立的线程，让这个文件在这个线程中作为独立的程序运行。

:::warning 提醒
除了提供一个指向外部文件的 URL，你还可以通过提供一个 Blob URL（另外一个 HTML5 特性）创建一个在线 Worker（Inline Worker)，本质上就是一个存储在单个（二进制）值中的在线文件。
:::

Worker 之间以及它们和主程序之间，不会共享任何作用域或资源。Worker w1 对象是一个事件侦听者和触发者，可以通过订阅它来获得这个 Worker 发出的事件以及发送事件给这个 Worker。

```js
// 以下是如何侦听事件（其实就是固定的 "message" 事件）：
w1.addEventListener( "message", function(evt){ 
 // evt.data 
} ); 
// 也可以发送 "message" 事件给这个 Worker：
w1.postMessage( "something cool to say" ); 
// 在这个 Worker 内部，收发消息是完全对称的：
// "mycoolworker.js" 
addEventListener( "message", function(evt){ 
 // evt.data 
} ); 
postMessage( "a really cool reply" ); 
```

要在创建 Worker 的程序中终止 Worker，可以调用 Worker 对象（就像前面代码中的 w1）上的 terminate()。突然终止 Worker 线程不会给它任何机会完成它的工作或者清理任何资源。这就类似于通过关闭浏览器标签页来关闭页面。

在 Worker 内部是无法访问主程序的任何资源的。这意味着你不能访问它的任何全局变量，也不能访问页面的 DOM 或者其他资源。记住，这是一个完全独立的线程。

但是，你可以执行网络操作（Ajax、WebSockets）以及设定定时器。还有，Worker 可以访问几个重要的全局变量和功能的本地复本，包括 navigator、location、JSON 和applicationCache。

你还可以通过 importScripts(..) 向 Worker 加载额外的 JavaScript 脚本：
```js
// 在Worker内部
importScripts( "foo.js", "bar.js" ); 
```
这些脚本加载是同步的。也就是说，importScripts(..) 调用会阻塞余下 Worker 的执行，直到文件加载和执行完成

下面是如何使用 postMessage(..)发送一个 Transferable 对象：
```js
// 比如foo是一个Uint8Array 
postMessage( foo.buffer, [ foo.buffer ] ); 
```
第一个参数是一个原始缓冲区，第二个是一个要传输的内容的列表。

不支持 Transferable 对象的浏览器就降级到结构化克隆，这会带来性能下降而不是彻底的
功能失效。

防止重复专用 Worker 来降低系统的资源使用，创建一个整个站点或 app 的所有页面实例都可以共享的中心 Worker。这称为 SharedWorker
```js
var w1 = new SharedWorker( "http://some.url.1/mycoolworker.js" ); 
```
因为共享 Worker 可以与站点的多个程序实例或多个页面连接，所以这个 Worker 需要通过某种方式来得知消息来自于哪个程序。这个唯一标识符称为端口（port），可以类比网络socket 的端口。因此，调用程序必须使用 Worker 的 port 对象用于通信：
```js
w1.port.addEventListener( "message", handleMessages ); 
// .. 
w1.port.postMessage( "something cool" );

// 还有，端口连接必须要初始化，形式如下：
w1.port.start(); 
```
在共享 Worker 内部，必须要处理额外的一个事件："connect"。这个事件为这个特定的连接提供了端口对象。保持多个连接独立的最简单办法就是使用 port 上的闭包，就像下面的代码一样，把这个链接上的事件侦听和传递定义在 "connect" 事件的处理函数内部：
```js
// 在共享Worker内部
addEventListener( "connect", function(evt){ 
  // 这个连接分配的端口
  var port = evt.ports[0]; 
  port.addEventListener( "message", function(evt){ 
    // .. 
    port.postMessage( .. ); 
    // .. 
  } ); 
  // 初始化端口连接
  port.start(); 
} ); 
```
单指令多数据（SIMD）是一种数据并行（data parallelism）方式，与 Web Worker 的任务并行（task parallelism）相对，因为这里的重点实际上不再是把程序逻辑分成并行的块，而是并行处理数据的多个位。

通过 SIMD，线程不再提供并行。取而代之的是，现代 CPU 通过数字“向量”（特定类型的数组），以及可以在所有这些数字上并行操作的指令，来提供 SIMD 功能。这是利用低级指令级并行的底层运算。

SIMD JavaScript 计划向 JavaScript 代码暴露短向量类型和 API。在支持 SIMD 的那些系统中，这些运算将会直接映射到等价的 CPU 指令，而在非 SIMD 系统中就会退化回非并行化的运算。

```js
var v1 = SIMD.float32x4( 3.14159, 21.0, 32.3, 55.55 ); 
var v2 = SIMD.float32x4( 2.1, 3.2, 4.3, 5.4 ); 
var v3 = SIMD.int32x4( 10, 101, 1001, 10001 ); 
var v4 = SIMD.int32x4( 10, 20, 30, 40 ); 
SIMD.float32x4.mul( v1, v2 ); 
 // [ 6.597339, 67.2, 138.89, 299.97 ] 
SIMD.int32x4.add( v3, v4 ); 
 // [ 20, 121, 1031, 10041 ] 
```

### 性能测试与调优

如果被问到如何测试某个运算的速度（执行时间），绝大多数 JavaScript 开发者都会从类似下面的代码开始：
```js
var start = (new Date()).getTime(); // 或者Date.now() 
// 进行一些操作
var end = (new Date()).getTime(); 
console.log( "Duration:", (end - start) ); 
```

如果报告的时间是 0，可能你会认为它的执行时间小于 1ms。但是，这并不十分精确。有些平台的精度并没有达到 1ms，而是以更大的递增间隔更新定时器。比如，Windows（也就是 IE）的早期版本上的精度只有 15ms，这就意味着这个运算的运行时间至少需要这么长才不会被报告为 0 ！

还有，不管报告的时长是多少，你能知道的唯一一点就是，这个运算的这次特定的运行消耗了大概这么长时间。而它是不是总是以这样的速度运行，你基本上一无所知。你不知道引擎或系统在这个时候有没有受到什么影响，以及其他时候这个运算会不会运行得更快。

如果时长报告是 4 呢？你能更加确定它的运行需要大概 4ms 吗？不能。它消耗的时间可能要短一些，而且在获得 start 或 end 时间戳之间也可能有其他一些延误。

更麻烦的是，你也不知道这个运算测试的环境是否过度优化了。有可能 JavaScript 引擎找到了什么方法来优化你这个独立的测试用例，但在更真实的程序中是无法进行这样的优化的，那么这个运算就会比测试时跑得慢。

下面介绍应该如何使用 Benchmark.js 来运行一个快速的性能测试：
```js
function foo() { 
 // 要测试的运算
} 
var bench = new Benchmark( 
  "foo test", // 测试名称
  foo, // 要测试的函数（也即内容）
  { 
  // .. // 可选的额外选项（参见文档）
  } 
); 
bench.hz; // 每秒运算数
bench.stats.moe; // 出错边界
bench.stats.variance; // 样本方差
// ..
```
Benchmark.js 当然可以用在浏览器中测试 JavaScript，它也可以在非浏览器环境中运行（Node.js 等）。

有一点非常重要，一定要理解，setup 和 teardown 代码不会在每个测试迭代都运行。最好的理解方法是，想像有一个外层循环（一轮一轮循环）还有一个内层循环（一个测试一个测试循环）。setup 和 teardown 在每次外层循环（轮）的开始和结束处运行，而不是在内层循环中。
```js
a = a + "w"; 
b = a.charAt( 1 ); 
// 然后，你建立了测试 setup 如下：
var a = "x"; 
```
你的目的可能是确保每个测试迭代开始的 a 值都是 "x"。但并不是这样！只有在每一轮测试开始时 a 值为 "x"，然后重复 + "w" 链接运算会使得 a 值越来越长，即使你只是访问了位置 1 处的字符 "w"。

对某个东西，比如 DOM，执行产生副作用的操作的时候，比如附加一个子元素，常常会刺伤你。你可能认为你的父元素每次都清空了，但是，实际上它被附加了很多元素，这可能会严重影响测试结果。

[性能测试jsPerf](https://github.com/jsperf/jsperf.com/tree/master)

有时候编译器可能会决定执行与你所写的不同的代码，不只是顺序不同，实际内容也会不同。
```js
var foo = 41; 
(function(){ 
  (function(){ 
    (function(baz){ 
      var bar = foo + baz; 
      // .. 
    })(1);
  })(); 
})(); 
```
可能你会认为最内层函数中的引用 foo 需要进行三层作用域查找。事实上，编译器通常会缓存这样的查找结果，使得从不同的作用域引用 foo 实际上并没有任何额外的花费。

尾调用优化：尾调用就是一个出现在另一个函数“结尾”处的函数调用。这个调用结束后就没有其余事情要做了（除了可能要返回结果值）。
```js
// 以下是一个非递归的尾调用：
function foo(x) { 
  return x; 
} 
function bar(y) { 
  return foo( y + 1 ); // 尾调用
} 
function baz() { 
  return 1 + bar( 40 ); // 非尾调用
} 
baz(); // 42 
```
调用一个新的函数需要额外的一块预留内存来管理调用栈，称为栈帧。所以前面的代码一般会同时需要为每个 baz()、bar(..) 和 foo(..) 保留一个栈帧。

然而，如果支持 TCO 的引擎能够意识到 foo(y+1) 调用位于尾部，这意味着 bar(..) 基本上已经完成了，那么在调用 foo(..) 时，它就不需要创建一个新的栈帧，而是可以重用已有的 bar(..) 的栈帧。这样不仅速度更快，也更节省内存。

在简单的代码片段中，这类优化算不了什么，但是在处理递归时，这就解决了大问题，特别是如果递归可能会导致成百上千个栈帧的时候。有了 TCO，引擎可以用同一个栈帧执行所有这类调用！

递归是 JavaScript 中一个纷繁复杂的主题。因为如果没有 TCO 的话，引擎需要实现一个随意（还彼此不同！）的限制来界定递归栈的深度，达到了就得停止，以防止内存耗尽。有了 TCO，尾调用的递归函数本质上就可以任意运行，因为再也不需要使用额外的内存！
```js
// 考虑到前面递归的 factorial(..)，这次重写成 TCO 友好的：
function factorial(n) { 
  function fact(n,res) { 
    if (n < 2) return res; 
    return fact( n - 1, n * res ); 
  } 
  return fact( n, 1 ); 
} 
factorial( 5 ); // 120 
// 这个版本的 factorial(..) 仍然是递归的，但它也是可以 TCO 优化的，因为内部的两次fact(..) 调用的位置都在结尾处。
```
:::warning 注意
TCO 只用于有实际的尾调用的情况。如果你写了一个没有尾调用的递归函数，那么性能还是会回到普通栈帧分配的情形，引擎对这样的递归调用栈的限制也仍然有效。很多递归函数都可以改写，就像刚刚展示的 factorial(..) 那样，但是需要认真注意细节。
:::

[异步序列风格](https://github.com/getify/asynquence)

如果一个函数表示序列中的一个普通步骤，那调用这个函数时第一个参数是 continuation回调，所有后续的参数都是从前一个步骤传递过来的消息。直到这个 continuation 回调被调用后，这个步骤才完成。一旦它被调用，传给它的所有参数将会作为消息传入序列中的下一个步骤。

要向序列中添加额外的普通步骤，可以调用 then(..)（这本质上和 ASQ(..) 调用的语义完全相同）
```js
ASQ( 
  // 步骤1 
  function(done){ 
    setTimeout( function(){ 
      done( "Hello" ); 
    }, 100 ); 
  }, 
  // 步骤2 
  function(done,greeting) { 
    setTimeout( function(){ 
      done( greeting + " World" ); 
    }, 100 ); 
  } 
) 
// 步骤3 
.then( function(done,msg){ 
  setTimeout( function(){ 
    done( msg.toUpperCase() ); 
  }, 100 ); 
} ) 
// 步骤4 
.then( function(done,msg){ 
  console.log( msg ); // HELLO WORLD 
} );
```
:::warning 提醒
尽管 then(..) 和原生 Promise API 名称相同，但是这个 then(..) 是不一样的。你可以向 then(..) 传递任意多个函数或值，其中每一个都会作为一个独立步骤。其中并不涉及两个回调的完成 / 拒绝语义。
:::
和 Promise 不同的一点是：在 Promise 中，如果你要把一个 Promise 链接到下一个，需要创建这个 Promise 并通过 then(..) 完成回调函数返回这个 Promise；而使用 asynquence，你需要做的就是调用 continuation 回调——我一直称之为 done()，但你可以随便给它取什么名字——并可选择性将完成消息传递给它作为参数。

通过 then(..) 定义的每个步骤都被假定为异步的。如果你有一个同步的步骤，那你可以直接调用 done(..)，也可以使用更简单的步骤辅助函数 val(..)。
```js
// 步骤1（同步）
ASQ( function(done){ 
  done( "Hello" ); // 手工同步
} ) 
// 步骤2（同步）
.val( function(greeting){ 
  return greeting + " World"; 
} ) 
// 步骤3（异步）
.then( function(done,msg){ 
  setTimeout( function(){ 
    done( msg.toUpperCase() ); 
  }, 100 ); 
} ) 
// 步骤4（同步）
.val( function(msg){ 
  console.log( msg ); 
} ); 
```
可以看到，通过 val(..) 调用的步骤并不接受 continuation 回调，因为这一部分已经为你假定了，结果就是参数列表没那么凌乱！如果要给下一个步骤发送消息的话，只需要使用return。可以把 val(..) 看作一个表示同步的“只有值”的步骤，可以用于同步值运算、日志记录及其他类似的操作。

asynquence 为注册一个序列错误通知处理函数提供了一个 or(..) 序列方法。这个方法还有一个别名，onerror(..)。你可以在序列的任何地方调用这个方法，也可以注册任意多个处理函数。这很容易实现多个不同的消费者在同一个序列上侦听，以得知它有没有失败。从这个角度来说，它有点类似错误事件处理函数。

和使用 Promise 类似，所有的 JavaScript 异常都成为了序列错误，或者你也可以编写代码来发送一个序列错误信号：
```js
var sq = ASQ( function(done){ 
  setTimeout( function(){ 
    // 为序列发送出错信号
    done.fail( "Oops" ); 
  }, 100 ); 
} ) 
.then( function(done){ 
  // 不会到达这里
} ) 
.or( function(err){ 
  console.log( err ); // Oops 
} ) 
.then( function(done){ 
  // 也不会到达这里
} ); 
// 之后
sq.or( function(err){ 
  console.log( err ); // Oops
} ); 
```
asynquence 的错误处理和原生 Promise 还有一个非常重要的区别，就是默认状态下未处理异常的行为。没有注册拒绝处理函数的被拒绝 Promise 就会默默地持有（即吞掉）这个错误。你需要记得总要在链的尾端添加一个最后的 catch(..)。

而在 asynquence 中，这个假定是相反的。如果一个序列中发生了错误，并且此时没有注册错误处理函数，那这个错误就会被报告到控制台。换句话说，未处理的拒绝在默认情况下总是会被报告，而不会被吞掉和错过。

一旦你针对某个序列注册了错误处理函数，这个序列就不会产生这样的报告，从而避免了重复的噪音。

实际上，可能在一些情况下你会想创建一个序列，这个序列可能会在你能够注册处理函数之前就进入了出错状态。这不常见，但偶尔也会发生。

在这样的情况下，你可以选择通过对这个序列调用 defer() 来避免这个序列实例的错误报告。应该只有在确保你最终会处理这种错误的情况下才选择关闭错误报告：
```js
var sq1 = ASQ( function(done){ 
  doesnt.Exist(); // 将会向终端抛出异常
} ); 
var sq2 = ASQ( function(done){ 
  doesnt.Exist(); // 只抛出一个序列错误
} ) 
// 显式避免错误报告
.defer(); 
setTimeout( function(){ 
  sq1.or( function(err){ 
    console.log( err ); // ReferenceError 
  } ); 
  sq2.or( function(err){ 
    console.log( err ); // ReferenceError 
  } ); 
}, 100 ); 
// ReferenceError (from sq1) 
```
并非序列中的所有步骤都恰好执行一个（异步）任务。序列中的一个步骤中如果有多个子步骤并行执行则称为 gate(..)（还有一个别名 all(..)，如果你愿意用的话），和原生的Promise.all([..]) 直接对应。
```js
// 考虑：
ASQ( function(done){ 
  setTimeout( done, 100 ); 
} ) 
.gate( 
  function(done){ 
    setTimeout( function(){ 
      done( "Hello" ); 
    }, 100 ); 
  }, 
  function(done){ 
    setTimeout( function(){ 
      done( "World", "!" ); 
    }, 100 ); 
  } 
) 
.val( function(msg1,msg2){ 
  console.log( msg1 ); // Hello 
  console.log( msg2 ); // [ "World", "!" ] 
} ); 
// 出于展示说明的目的，我们把这个例子与原生 Promise 对比：
new Promise( function(resolve,reject){ 
  setTimeout( resolve, 100 ); 
} ) 
.then( function(){ 
  return Promise.all( [ 
    new Promise( function(resolve,reject){ 
      setTimeout( function(){ 
        resolve( "Hello" ); 
      }, 100 ); 
    } ), 
    new Promise( function(resolve,reject){ 
      setTimeout( function(){ 
        // 注：这里需要一个[ ]数组
        resolve( [ "World", "!" ] ); 
      }, 100 ); 
    } ) 
  ] ); 
} ) 
.then( function(msgs){ 
  console.log( msgs[0] ); // Hello 
  console.log( msgs[1] ); // [ "World", "!" ] 
} ); 
```
contrib 插件中提供了几个 asynquence 的 gate(..) 步骤类型的变体，非常实用。

- any(..) 类似于 gate(..)，除了只需要一个子步骤最终成功就可以使得整个序列前进。
- first(..) 类似于 any(..)，除了只要有任何步骤成功，主序列就会前进（忽略来自其
他步骤的后续结果）。
- race(..)（对应 Promise.race([..])）类似于 first(..)，除了只要任何步骤完成（成
功或失败），主序列就会前进。
- last(..) 类似于 any(..)，除了只有最后一个成功完成的步骤会将其消息发送给主序列。
- none(..) 是 gate(..) 相反：只有所有的子步骤失败（所有的步骤出错消息被当作成功
消息发送，反过来也是如此），主序列才前进。
```js
// 让我们先定义一些辅助函数，以便更清楚地进行说明：
function success1(done) { 
  setTimeout( function(){ 
    done( 1 ); 
  }, 100 ); 
} 
function success2(done) { 
  setTimeout( function(){ 
    done( 2 ); 
  }, 100 ); 
} 
function failure3(done) { 
  setTimeout( function(){ 
    done.fail( 3 ); 
  }, 100 ); 
} 
function output(msg) { 
  console.log( msg ); 
} 
// 现在来说明这些 gate(..) 步骤变体的用法：
ASQ().race( 
  failure3, 
  success1 
) 
.or( output ); // 3 
ASQ().any( 
  success1, 
  failure3,
  success2 
) 
.val( function(){ 
  var args = [].slice.call( arguments ); 
  console.log( 
    args // [ 1, undefined, 2 ] 
  ); 
} ); 
ASQ().first( 
  failure3, 
  success1, 
  success2 
) 
.val( output ); // 1 
ASQ().last( 
  failure3, 
  success1, 
  success2 
) 
.val( output ); // 2 
ASQ().none( 
 failure3 
) 
.val( output ) // 3 
.none( 
  failure3 
  success1 
) 
.or( output ); // 1 
```
另外一个步骤变体是 map(..)，它使你能够异步地把一个数组的元素映射到不同的值，然后直到所有映射过程都完成，这个步骤才能继续。map(..) 与 gate(..) 非常相似，除了它是从一个数组而不是从独立的特定函数中取得初始值，而且这也是因为你定义了一个回调函数来处理每个值：
```js
function double(x,done) { 
  setTimeout( function(){ 
    done( x * 2 ); 
  }, 100 ); 
} 
ASQ().map( [1,2,3], double ) 
.val( output ); // [2,4,6] 
// map(..) 的参数（数组或回调）都可以从前一个步骤传入的消息中接收：
function plusOne(x,done) { 
  setTimeout( function(){ asynquence 库 ｜ 329
    done( x + 1 ); 
  }, 100 ); 
} 
ASQ( [1,2,3] ) 
.map( double ) // 消息[1,2,3]传入
.map( plusOne ) // 消息[2,4,6]传入
.val( output ); // [3,5,7] 
```
另外一个变体是 waterfall(..)，这有点类似于 gate(..) 的消息收集特性和 then(..) 的顺序处理特性的混合。

首先执行步骤 1，然后步骤 1 的成功消息发送给步骤 2，然后两个成功消息发送给步骤 3，然后三个成功消息都到达步骤 4，以此类推。这样，在某种程度上，这些消息集结和层叠下来就构成了“瀑布”（waterfall）。
```js
// 考虑：
function double(done) { 
  var args = [].slice.call( arguments, 1 ); 
  console.log( args ); 
  setTimeout( function(){ 
    done( args[args.length - 1] * 2 ); 
  }, 100 ); 
} 
ASQ( 3 ) 
.waterfall( 
  double, // [ 3 ] 
  double, // [ 6 ] 
  double, // [ 6, 12 ] 
  double // [ 6, 12, 24 ] 
) 
.val( function(){ 
  var args = [].slice.call( arguments ); 
  console.log( args ); // [ 6, 12, 24, 48 ] 
} ); 
// 如果“瀑布”中的任何一点出错，整个序列就会立即进入出错状态。
```
try(..) 会试验执行一个步骤，如果成功的话，这个序列就和通常一样继续。如果这个步骤失败的话，失败就会被转化为一个成功消息，格式化为 { catch: .. } 的形式，用出错消息填充：
```js
ASQ() 
.try( success1 ) 
.val( output ) // 1 
.try( failure3 ) 
.val( output ) // { catch: 3 } 
.or( function(err){ 
  // 永远不会到达这里
} );
```
也可以使用 until(..) 建立一个重试循环，它会试着执行这个步骤，如果失败的话就会在下一个事件循环 tick 重试这个步骤，以此类推。

这个重试循环可以无限继续，但如果想要从循环中退出的话，可以在完成触发函数中调用标志 break()，触发函数会使主序列进入出错状态：
```js
var count = 0; 
ASQ( 3 ) 
.until( double ) 
.val( output ) // 6 
.until( function(done){ 
  count++; 
  setTimeout( function(){ 
    if (count < 5) { 
      done.fail(); 
    } 
    else { 
      // 跳出until(..)重试循环
      done.break( "Oops" ); 
    } 
  }, 100 ); 
} ) 
.or( output ); // Oops
```
如果你喜欢在序列使用类似于 Promise 的 then(..) 和 catch(..)（参见第 3 章）的 Promise风格语义，可以使用 pThen 和 pCatch 插件：
```js
ASQ( 21 ) 
.pThen( function(msg){ 
  return msg * 2; 
} ) 
.pThen( output ) // 42 
.pThen( function(){ 
  // 抛出异常
  doesnt.Exist(); 
} ) 
.pCatch( function(err){ 
  // 捕获异常（拒绝）
  console.log( err ); // ReferenceError
} ) 
.val( function(){ 
  // 主序列以成功状态返回，
  // 因为之前的异常被 pCatch(..)捕获了 
} ); 
```
pThen(..) 和 pCatch(..) 是设计用来运行在序列中的，但其行为方式就像是在一个普通的 Promise 链中。因此，可以从传给 pThen(..) 的完成处理函数决议真正的 Promise 或asynquence 序列

关于 Promise，有一个可能会非常有用的特性，那就是可以附加多个 then(..) 处理函数注册到同一个 promise；在这个 promise 处有效地实现了分叉流程控制：
```js
var p = Promise.resolve( 21 ); 
// 分叉1（来自p）
p.then( function(msg){ 
  return msg * 2; 
} ) 
.then( function(msg){ 
  console.log( msg ); // 42 
} ) 
// 分叉2 （来自p）
p.then( function(msg){ 
  console.log( msg ); // 21 
} ); 
// 在 asynquence 里可使用 fork() 实现同样的分叉：
var sq = ASQ(..).then(..).then(..); 
var sq2 = sq.fork(); 
// 分叉1 
sq.then(..)..; 
// 分叉2 
sq2.then(..)..; 
```
如果要实现 fork() 的逆操作，可以使用实例方法 seq(..)，通过把一个序列归入另一个序列来合并这两个序列：
```js
var sq = ASQ( function(done){ 
  setTimeout( function(){ 332 ｜ 附录 A
    done( "Hello World" ); 
  }, 200 ); 
} ); 
ASQ( function(done){ 
  setTimeout( done, 100 ); 
} ) 
// 将sq序列纳入这个序列
.seq( sq ) 
.val( function(msg){ 
  console.log( msg ); // Hello World 
} )
```
正如这里展示的，seq(..) 可以接受一个序列本身，或者一个函数。如果它接收一个函数，那么就要求这个函数被调用时会返回一个序列。因此，前面的代码可以这样实现：
```js
// .. 
.seq( function(){ 
  return sq; 
} ) 
// .. 
// 这个步骤也可以通过 pipe(..) 来完成：
// .. 
.then( function(done){ 
  // 把sq加入done continuation回调
  sq.pipe( done ); 
} ) 
// .. 
// 如果一个序列被包含，那么它的成功消息流和出错流都会输入进来。
```
```js
// 如果序列的某个步骤只是一个普通的值，这个值就映射为这个步骤的完成消息：
var sq = ASQ( 42 ); 
sq.val( function(msg){ 
  console.log( msg ); // 42 
} ); 
// 如果你想要构建一个自动出错的序列：a
var sq = ASQ.failed( "Oops" ); 
ASQ() 
.seq( sq ) 
.val( function(msg){ 
  // 不会到达这里
} ) 
.or( function(err){ 
  console.log( err ); // Oops 
} ); 
// 也有可能你想自动创建一个延时值或者延时出错的序列。使用 contrib 插件 after 和failAfter，很容易实现：
var sq1 = ASQ.after( 100, "Hello", "World" ); 
var sq2 = ASQ.failAfter( 100, "Oops" ); 
sq1.val( function(msg1,msg2){ 
  console.log( msg1, msg2 ); // Hello World 
} ); 
sq2.or( function(err){ 
  console.log( err ); // Oops
} ); 
// 也可以使用 after(..) 在序列中插入一个延时：
ASQ( 42 ) 
// 在序列中插入一个延时
.after( 100 ) 
.val( function(msg){ 
  console.log( msg ); // 42 
} );
```
```js
// 通过实例方法 promise(..) 很容易把一个 promise（比如一个 thenable，参见第 3 章）归入到一个序列中：
var p = Promise.resolve( 42 ); 
ASQ() 
.promise( p ) // 也可以： function(){ return p; } 
.val( function(msg){ 
  console.log( msg ); // 42 
} );

// 要实现相反的操作以及从一个序列中的某个步骤分叉 / 剔出一个 promise，可以通过 contrib插件 toPromise 实现：
var sq = ASQ.after( 100, "Hello World" ); 
sq.toPromise() 
// 现在这是一个标准promise链
.then( function(msg){ 
  return msg.toUpperCase(); 
} ) 
.then( function(msg){ 
  console.log( msg ); // HELLO WORLD 
} ); 

// 有几个辅助工具可以让 asynquence 与使用回调的系统适配。要从序列中自动生成一个error-first 风格回调以连入到面向回调的工具，可以使用 errfcb：
var sq = ASQ( function(done){ 
  // 注：期望"error-first风格"回调
  someAsyncFuncWithCB( 1, 2, done.errfcb ) 
} ) 
.val( function(msg){ 
  // .. 
} ) 
.or( function(err){ 
  // .. 
} ); 
// 注：期望"error-first风格"回调
anotherAsyncFuncWithCB( 1, 2, sq.errfcb() ); 

// 你还可能想要为某个工具创建一个序列封装的版本，类似于第 3 章的 promisory 和第 4 章的 thunkory，asynquence 为此提供了 ASQ.wrap(..)：
var coolUtility = ASQ.wrap( someAsyncFuncWithCB ); 
coolUtility( 1, 2 ) 
.val( function(msg){ 
  // .. 
} ) 
.or( function(err){ 
  // .. 
} ); 
```
不幸的是，有时候需要实现对 Promise 或步骤的外部控制，这会导致棘手的 capability extraction 问题。
```js
// 考虑这个 Promise 例子：
var domready = new Promise( function(resolve,reject){ 
  // 不需把这个放在这里，因为逻辑上这属于另一部分代码
  document.addEventListener( "DOMContentLoaded", resolve ); 
} ); 
// .. 
domready.then( function(){ 
  // DOM就绪！
} ); 

// 使用 Promise 的 capability extraction 反模式看起来类似如下：
var ready; 
var domready = new Promise( function(resolve,reject){ 
  // 提取resolve()功能
  ready = resolve; 
} ); 
// .. 
domready.then( function(){ 
  // DOM就绪！
} ); 
// .. 
document.addEventListener( "DOMContentLoaded", ready ); 
```
asynquence 提供了一个反转的序列类型，我称之为可迭代序列，它把控制能力外部化了（对于像 domready 这样的用例非常有用）：
```js
// 注：这里的domready是一个控制这个序列的迭代器
var domready = ASQ.iterable(); 
// .. 
domready.val( function(){ 
  // DOM就绪
} ); 
// .. 
document.addEventListener( "DOMContentLoaded", domready.next );
```
在第 4 章中我们推导出了一个名为 run(..) 的工具。这个工具可以运行生成器到结束，侦听 yield 出来的 Promise，并使用它们来异步恢复生成器。asynquence 也内建有这样的工具，叫作 runner(..)。
```js
// 为了展示，我们首先构建一些辅助函数：
function doublePr(x) { 
  return new Promise( function(resolve,reject){ 
    setTimeout( function(){ 
      resolve( x * 2 ); 
    }, 100 ); 
  } ); 
} 
function doubleSeq(x) { 
  return ASQ( function(done){ 
    setTimeout( function(){ 
      done( x * 2) 
    }, 100 ); 
  } ); 
} 

// 现在，可以使用 runner(..) 作为序列中的一个步骤：
ASQ( 10, 11 ) 
.runner( function*(token){ 
  var x = token.messages[0] + token.messages[1]; 
  // yield一个真正的promise 
  x = yield doublePr( x ); 
  // yield一个序列
  x = yield doubleSeq( x );
  return x; 
} ) 
.val( function(msg){ 
  console.log( msg ); // 84 
} ); 
```
你也可以创建一个自封装的生成器，也就是说，通过 ASQ.wrap(..) 包装实现一个运行指定生成器的普通函数，完成后返回一个序列：
```js
var foo = ASQ.wrap( function*(token){ 
  var x = token.messages[0] + token.messages[1]; 
  // yield一个真正的promise 
  x = yield doublePr( x ); 
  // yield一个序列
  x = yield doubleSeq( x ); 
  return x; 
}, { gen: true } ); 
// .. 
foo( 8, 9 ) 
.val( function(msg){ 
  console.log( msg ); // 68
})
```

```js
// 回忆一下：
var domready = ASQ.iterable(); 
// .. 
domready.val( function(){ 
  // DOM就绪
} ); 
// .. 
document.addEventListener( "DOMContentLoaded", domready.next ); 

// 现在，让我们把一个多步骤序列定义为可迭代序列：
var steps = ASQ.iterable();
steps 
.then( function STEP1(x){ 
  return x * 2; 
} ) 
.steps( function STEP2(x){ 
  return x + 3; 
} ) 
.steps( function STEP3(x){ 
  return x * 4; 
} ); 
steps.next( 8 ).value; // 16 
steps.next( 16 ).value; // 19 
steps.next( 19 ).value; // 76 
steps.next().done; // true 
```
可以看到，可迭代序列是一个符合标准的迭代器（参见第 4 章）。因此，可通过 ES6 的for..of 循环迭代，就像生成器（或其他任何 iterable）一样：
```js
var steps = ASQ.iterable(); 
steps 
.then( function STEP1(){ return 2; } ) 
.then( function STEP2(){ return 4; } ) 
.then( function STEP3(){ return 6; } ) 
.then( function STEP4(){ return 8; } ) 
.then( function STEP5(){ return 10; } ); 
for (var v of steps) { 
  console.log( v ); 
} 
// 2 4 6 8 10
```
请考虑一个多 Ajax 请求的例子。我们在第 3 章和第 4 章中已经看到过同样的场景，分别通过 Promise 链和生成器实现的。用可迭代序列来表达：
```js
// 支持序列的ajax 
var request = ASQ.wrap( ajax ); 
ASQ( "http://some.url.1" ) 
.runner( 
  ASQ.iterable() 
  .then( function STEP1(token){ 
    var url = token.messages[0]; 
    return request( url ); 
  } ) 
  .then( function STEP2(resp){
    return ASQ().gate( 
    request( "http://some.url.2/?v=" + resp ), 
    request( "http://some.url.3/?v=" + resp ) 
    ); 
  } ) 
  .then( function STEP3(r1,r2){ return r1 + r2; } ) 
) 
.val( function(msg){ 
  console.log( msg ); 
} ); 
```
可迭代序列本质上和生成器的行为方式一样。这个事实值得注意，原因如下。

首先，可迭代序列是 ES6 生成器某个子集的某种前 ES6 等价物。也就是说，你可以直接编写它们（在任意环境运行），或者你也可以编写 ES6 生成器，并将其重编译或转化为可迭代序列（就此而言，也可以是 Promise 链！）。

把“异步完整运行”的生成器看作是 Promise 链的语法糖，对于认识它们的同构关系是很重要的。
```js
// 在继续之前，我们应该注意到，前面的代码片段可以用 asynquence 重写如下：
ASQ( "http://some.url.1" ) 
.seq( /*STEP 1*/ request ) 
.seq( function STEP2(resp){ 
  return ASQ().gate( 
    request( "http://some.url.2/?v=" + resp ), 
    request( "http://some.url.3/?v=" + resp ) 
  ); 
} ) 
.val( function STEP3(r1,r2){ return r1 + r2; } ) 
.val( function(msg){ 
  console.log( msg ); 
} ); 

// 而且，步骤 2 也可以这样写：
.gate( 
  function STEP2a(done,resp) { 
    request( "http://some.url.2/?v=" + resp ) 
    .pipe( done ); 
  }, 
  function STEP2b(done,resp) { 
    request( "http://some.url.3/?v=" + resp )
    .pipe( done ); 
  } 
) 
```
可迭代序列是惰性求值（lazily evaluated），这意味着在可迭代序列的执行过程中，如果需要的话可以用更多的步骤扩展这个序列。只能在可迭代序列的末尾添加步骤，不能插入序列的中间。

首先，让我们通过一个简单点的（同步）例子来熟悉一下这个功能：

```js
function double(x) { 
  x *= 2; 
  // 应该继续扩展吗？
  if (x < 500) { 
    isq.then( double ); 
  } 
  return x; 
} 
// 建立单步迭代序列
var isq = ASQ.iterable().then( double ); 
for (var v = 10, ret; 
  (ret = isq.next( v )) && !ret.done; 
) { 
  v = ret.value; 
  console.log( v ); 
} 
```
一开始这个可迭代序列只定义了一个步骤（isq.then(double)），但这个可迭代序列在某种条件下（x < 500）会持续扩展自己。

尽管这个例子很平常，也可以通过一个生成器中的 while 循环表达，但我们会考虑到更复杂的情况。

举例来说，可以查看 Ajax 请求的响应，如果它指出还需要更多的数据，就有条件地向可迭代序列中插入更多的步骤来发出更多的请求。或者你也可以有条件地在 Ajax 处理结尾处增加一个值格式化的步骤。
```js
var steps = ASQ.iterable() 
.then( function STEP1(token){ 
  var url = token.messages[0].url; 
  // 提供了额外的格式化步骤了吗？
  if (token.messages[0].format) { 
    steps.then( token.messages[0].format ); 
  } 
  return request( url ); 
} ) 
.then( function STEP2(resp){ 
  // 向区列中添加一个Ajax请求吗？
  if (/x1/.test( resp )) { 
    steps.then( function STEP5(text){ 
      return request( 
      "http://some.url.4/?v=" + text 
      ); 
    } ); 
  } 
  return ASQ().gate( 
    request( "http://some.url.2/?v=" + resp ), 
    request( "http://some.url.3/?v=" + resp ) 
  ); 
} ) 
.then( function STEP3(r1,r2){ return r1 + r2; } );
```
你可以看到，在两个不同的位置处，我们有条件地使用 steps.then(..) 扩展了 steps。要运行这个可迭代序列 steps，只需要通过 ASQ#runner(..) 把它链入我们的带有 asynquence序列（这里称为 main）的主程序流程：
```js
var main = ASQ( { 
  url: "http://some.url.1", 
  format: function STEP4(text){ 
    return text.toUpperCase(); 
  }
} ) 
.runner( steps ) 
.val( function(msg){ 
  console.log( msg ); 
} );
```
可迭代序列 steps 的这一灵活性（有条件行为）可以用生成器表达吗？算是可以吧，但我们不得不以一种有点笨拙的方式重新安排这个逻辑：
```js
function *steps(token) { 
  // 步骤1 
  var resp = yield request( token.messages[0].url ); 
  // 步骤2 
  var rvals = yield ASQ().gate( 
    request( "http://some.url.2/?v=" + resp ), 
    request( "http://some.url.3/?v=" + resp ) 
  ); 
  // 步骤3 
  var text = rvals[0] + rvals[1]; 
  // 步骤4 
  //提供了额外的格式化步骤了吗？
  if (token.messages[0].format) { 
    text = yield token.messages[0].format( text ); 
  } 
  // 步骤5 
  // 需要向序列中再添加一个Ajax请求吗？
  if (/foobar/.test( resp )) { 
    text = yield request( 
      "http://some.url.4/?v=" + text 
    ); 
  } 
  return text; 
} 
// 注意：*steps()可以和前面的steps一样被同一个ASQ序列运行
```
除了已经确认的生成器的顺序、看似同步的语法的好处（参见第 4 章），要模拟可扩展可迭代序列 steps 的动态特性，steps 的逻辑也需要以 *steps() 生成器形式重新安排。

而如果要通过 Promise 或序列来实现这个功能会怎样呢？你可以这么做：
```js
var steps = something( .. ) 
.then( .. ) 
.then( function(..){ 
  // .. 
  // 扩展链是吧？
  steps = steps.then( .. );
  // .. 
}) 
.then( .. ); 
```
其中的问题捕捉起来比较微妙，但是很重要。所以，考虑要把我们的 steps Promise 链链入主程序流程。这次使用 Promise 来表达，而不是 asynquence：
```js
var main = Promise.resolve( { 
  url: "http://some.url.1", 
  format: function STEP4(text){ 
    return text.toUpperCase(); 
  } 
} ) 
.then( function(..){ 
  return steps; // hint！
} ) 
.val( function(msg){ 
  console.log( msg ); 
} ); 
```
序列步骤排序有一个竞态条件。在你返回 steps 的时候，steps 这时可能是之前定义的Promise 链，也可能是现在通过 steps = steps.then(..) 调用指向扩展后的 Promise 链。根据执行顺序的不同，结果可能不同。

以下是两个可能的结果。

- 如果 steps 仍然是原来的 Promise 链，一旦之后它通过 steps = steps.then(..) 被“扩展”，在链结尾处扩展之后的 promise 就不会被 main 流程考虑，因为它已经连到了steps 链。很遗憾，这就是及早求值的局限性。
- 如果 steps 已经是扩展后的 Promise 链，它就会按预期工作，因为 main 连接的是扩展后的 promise。

有一点应该是显而易见的，Promise 是异步工具箱中一个非常强大的工具。但是，因为 Promise 只能决议一次，它们的功能有一个很明显的缺憾就是处理事件流的能力。坦白地说，简单 asynquence 序列恰巧也有同样的弱点。

考虑这样一个场景，你想要在每次某个事件触发时都启动一系列步骤。单个 Promise 或序列不能代表一个事件的所有发生。因此，你不得不在每次事件发生时创建一整个新的Promise 链（或序列），就像这样：
```js
listener.on( "foobar", function(data){ 
  // 构造一个新的事件处理promise链
  new Promise( function(resolve,reject){ 
    // .. 
  } ) 
  .then( .. ) 
  .then( .. ); 
} ); 
```
设想一下，把这个范式的反转恢复一下，就像这样：
```js
var observable = listener.on( "foobar" ); 
// 将来
observable 
.then( .. ) 
.then( .. ); 
// 还有
observable 
.then( .. ) 
.then( .. ); 
```
值 observable 并不完全是一个 Promise，但你可以像查看 Promise 一样查看它，所以它们是紧密相关的。实际上，它可以被查看多次，并且每次它的事件（"foobar"）发生的时候都会发出通知。

ES7 提案提出了一个称为 Observable 的新数据类型，这类 Observable 的概念是这样的：“订阅”到一个流的事件的方式是传入一个生成器——实际上其中有用的部分是迭代器——事件每次发生都会调用迭代器的 next(..) 方法。你可以把它想象成类似这样：
```js
// someEventStream是一个事件流，比如来自鼠标点击或其他
var observer = new Observer( someEventStream, function*(){ 
  while (var evt = yield) { 
    console.log( evt ); 
  } 
} ); 
```
传入的生成器将会 yield 暂停那个 while 循环，等待下一个事件。每次 someEventStream 发布一个新事件，都会调用到附加到生成器实例上的迭代器的 next(..)，因此事件数据会用evt 数据恢复生成器 / 迭代器。

在这里的对事件的订阅功能中，重要的是迭代器部分，而不是生成器部分。所以，从概念上说，实际上你可以传入任何 iterable，包括 ASQ.iterable() 可迭代序列。

有趣的是，也有关于适配器的提案来简化从某些流类型构造 Observable，比如用于 DOM事件的 fromEvent(..)。如果你查看前面给出链接的 ES7 提案中建议的 fromEvent(..) 实现，你会发现它看起来和我们在下一节将要看到的 ASQ.react(..) 惊人的相似。

“响应式序列”:
```js
// 首先，让我们从如何使用名为 react(..) 的 asynquence 插件工具创建一个 Observable 开始：
var observable = ASQ.react( function setup(next){ 
  listener.on( "foobar", next ); 
} ); 

// 现在，来看看如何定义一个能“响应”这个 observable 的序列（在 F/RP 中，这通常称为“订阅”）：
observable 
.seq( .. ) 
.then( .. ) 
.val( .. ); 
```
在 F/RP 中，事件流通常从一系列函数变换中穿过，比如 scan(..)、map(..)、reduce(..)，等等。
```js
ASQ.react( function setup(next){ 
  document.getElementById( "mybtn" ) 
  .addEventListener( "click", next, false ); 
} ) 
.seq( function(evt){ 
  var btnID = evt.target.id; 
  return request( 
    "http://some.url.1/?id=" + btnID 
  ); 
} ) 
.val( function(text){ 
  console.log( text ); 
} ); 
```
这个响应序列的“响应”部分来自于分配了一个或多个事件处理函数来调用事件触发器（调用 next(..)）。

响应序列的“序列”部分就和我们已经研究过的序列完全一样：每个步骤可以使用任意合理的异步技术，从 continuation 到 Promise 再到生成器。

一旦建立起响应序列，只要事件持续触发，它就会持续启动序列实例。如果想要停止响应序列，可以调用 stop()。高级异步模式 ｜ 349

如果响应序列调用了 stop()，停止了，那你很可能希望事件处理函数也被注销。可以注册一个 teardown 处理函数来实现这个目的：
```js
var sq = ASQ.react( function setup(next,registerTeardown){ 
  var btn = document.getElementById( "mybtn" ); 
  btn.addEventListener( "click", next, false ); 
  // 一旦sq.stop()被调用就会调用
  registerTeardown( function(){ 
    btn.removeEventListener( "click", next, false ); 
  } ); 
} ) 
.seq( .. ) 
.then( .. ) 
.val( .. ); 
// 将来
sq.stop(); 
```
这里是一个来自 Node.js 世界的例子，使用了响应序列来处理到来的 HTTP 请求：
```js
var server = http.createServer(); 
server.listen(8000); 
// 响应式observer 
var request = ASQ.react( function setup(next,registerTeardown){ 
  server.addListener( "request", next ); 
  server.addListener( "close", this.stop ); 
  registerTeardown( function(){ 
    server.removeListener( "request", next ); 
    server.removeListener( "close", request.stop ); 
  } ); 
}); 
// 响应请求
request 
.seq( pullFromDatabase ) 
.val( function(data,res){ 
  res.end( data ); 
} ); 
// 节点清除
process.on( "SIGINT", request.stop ); 

// 使用 onStream(..) 和 unStream(..)，触发器 next(..) 也很容易适配节点流：
ASQ.react( function setup(next){ 
  var fstream = fs.createReadStream( "/some/file" ); 
  // 把流的"data"事件传给next(..) 
  next.onStream( fstream ); 
  // 侦听流结尾
  fstream.on( "end", function(){ 
    next.unStream( fstream ); 
  } ); 
} ) 
.seq( .. ) 
.then( .. ) 
.val( .. ); 

// 也可以通过序列合并来组合多个响应序列流：
var sq1 = ASQ.react( .. ).seq( .. ).then( .. ); 
var sq2 = ASQ.react( .. ).seq( .. ).then( .. ); 
var sq3 = ASQ.react(..) 
.gate( 
  sq1, 
  sq2 
) 
.then( .. ); 
```
设想一个工具 runAll(..)，它能接受两个或更多的生成器，并且并发地执行它们，让它们依次进行合作式 yield 控制，并支持可选的消息传递。

除了可以运行单个生成器到结束之外，我们在附录 A 讨论的 ASQ#runner(..) 是 runAll(..)概念的一个相似实现，后者可以并发运行多个生成器到结束。

因此，让我们来看看如何实现第 4 章中并发 Ajax 的场景：
```js
ASQ( 
 "http://some.url.2" 
) 
.runner( 
  function*(token){ 
    // 传递控制
    yield token; 
    var url1 = token.messages[0]; // "http://some.url.1" 
    // 清空消息，重新开始
    token.messages = []; 
    var p1 = request( url1 ); 
    // 传递控制
    yield token; 
    token.messages.push( yield p1 ); 
  }, 
  function*(token){ 
    var url2 = token.messages[0]; // "http://some.url.2" 
    // 传递消息并传递控制
    token.messages[0] = "http://some.url.1"; 
    yield token; 
    var p2 = request( url2 ); 
    // 传递控制
    yield token; 
    token.messages.push( yield p2 ); 
    // 把结果传给下一个序列步骤
    return token.messages; 
  } 
) 
.val( function(res){ 
  // res[0]来自"http://some.url.1" 
  // res[1]来自"http://some.url.2" 
} ); 
```
ASQ#runner(..) 和 runAll(..) 之间的主要区别如下。

- 每个生成器（协程）都被提供了一个叫作 token 的参数。这是一个特殊的值，想要显式把控制传递到下一个协程的时候就 yield 这个值。
- token.messages 是一个数组，其中保存了从前面一个序列步骤传入的所有消息。它也是一个你可以用来在协程之间共享消息的数据结构。
- yield一个Promise（或序列）值不会传递控制，而是暂停这个协程处理，直到这个值准备好。
- 从协程处理运行最后 return 的或 yield 的值将会被传递到序列中的下一个步骤。

状态机：让我们来设想这样一个工具。我们将其称为 state(..)，并给它传入两个参数：一个状态值和一个处理这个状态的生成器。创建和返回要传递给 ASQ#runner(..) 的适配器生成器这样的苦活将由 state(..) 负责。
```js
function state(val,handler) { 
  // 为这个状态构造一个协程处理函数
  return function*(token) { 
    // 状态转移处理函数
    function transition(to) { 
      token.messages[0] = to; 
    } 
    // 设定初始状态（如果还未设定的话）
    if (token.messages.length < 1) { 
      token.messages[0] = val; 
    } 
    // 继续，直到到达最终状态（false）
    while (token.messages[0] !== false) { 
      // 当前状态与这个处理函数匹配吗？
      if (token.messages[0] === val) { 
        // 委托给状态处理函数
        yield *handler( transition ); 
      } 
      // 还是把控制转移到另一个状态处理函数？
      if (token.messages[0] !== false) { 
        yield token; 
      } 
    } 
  }; 
} 
```
如果仔细观察的话，可以看到 state(..) 返回了一个接受一个 token 的生成器，然后它建立了一个 while 循环，该循环将持续运行，直到状态机到达终止状态（这里我们随机设定为值 false）。这正是我们想要传给 ASQ#runner(..) 的那一类生成器！

我们还随意保留了 token.messages[0] 槽位作为放置状态机当前状态的位置，用于追踪，这意味着我们甚至可以把初始状态值作为种子从序列中的前一个步骤传入。

如何将辅助函数 state(..) 与 ASQ#runner(..) 配合使用呢？
```js
var prevState; 
ASQ( 
  /*可选：初始状态值 */ 
  2 
) 
// 运行状态机
// 转移: 2 -> 3 -> 1 -> 3 -> false 
.runner( 
  // 状态1处理函数
  state( 1, function *stateOne(transition){ 
    console.log( "in state 1" ); 
    prevState = 1; 
    yield transition( 3 ); // 转移到状态3 
  } ), 
  // 状态2处理函数
  state( 2, function *stateTwo(transition){ 
    console.log( "in state 2" ); 
    prevState = 2; 
    yield transition( 3 ); // 转移到状态3 
  } ), 
  // 状态3处理函数
  state( 3, function *stateThree(transition){ 
    console.log( "in state 3" ); 
    if (prevState === 2) { 
      prevState = 3; 
      yield transition( 1 ); // 转移到状态1 
    } 
    // 完毕! 
    else { 
      yield "That’s all folks!"; 
      prevState = 3; 
      yield transition( false ); // 最终状态
    } 
  } ) 
) 
// 状态机完毕，继续
.val( function(msg){ 
  console.log( msg ); // 就这些！
} ); 
```
有很重要的一点需要指出，生成器 *stateOne(..)、*stateTwo(..) 和 *stateThree(..) 三者本身在每次进入状态时都会被再次调用，而在你通过 transition(..) 转移到其他值时就会结束。尽管这里没有展示，但这些状态生成器处理函数显然可以通过 yield Promise/ 序列 /thunk 来异步暂停。

底层隐藏的由辅助函数 state(..) 产生并实际上传给 ASQ#runner(..) 的生成器是在整个状态机生存期都持续并发运行的，它们中的每一个都会把协作式 yield 控制传递到下一个，以此类推。

两个或更多并发运行的生成器可以彼此之间用看似同步的形式进行消息传递，同时保持系统的异步本性，因为每个生成器的代码都被暂停（阻塞）了，等待一个异步动作来恢复。

这是如何工作的呢？

设想一个名为 A 的生成器（“进程”），想要发送一个消息给生成器 B。首先 A yield 要发给 B 的这个消息（因此暂停了 A），等 B 就绪并拿到这个消息时，A 就会被恢复（解除阻塞）。

对称地，设想 A 要接收一个来自 B 的消息。A yield 它对来自于 B 的这个消息的请求（因此暂停 A）。而一旦 B 发送了一个消息，A 就拿到消息并恢复执行。这种 CSP 消息传递的一个更流行的实现来自 ClojureScript 的 core.async 库，还有 go 语言。这些 CSP 实现通过开放在进程间的称为通道（channel）的管道实现了前面描述的通信语义。

:::warning 注意
使用术语通道的部分原因是，在一些模式中可以一次发送多个值到通道的缓冲区，这可能类似于你对流的认识。这里我们并不深入探讨，但要了解，对于管理数据流来说，它可以是非常强大的技术。在最简单的 CSP 概念中，我们在 A 和 B 之间创建的通道会有一个名为 take(..) 的方法用于阻塞接收一个值，还有一个名为 put(..) 的方法用于阻塞发送一个值。
:::

这看起来可能类似于：
```js
var ch = channel(); 
function *foo() { 
  var msg = yield take( ch ); 
  console.log( msg ); 
} 
function *bar() { 
  yield put( ch, "Hello World" ); 
  console.log( "message sent" ); 
} 
run( foo ); 
run( bar ); 
// Hello World 
// "message sent"
```
比较这个结构化的、（看似）同步的消息传递交互和 ASQ#runner(..) 通过数组 token.messages 及合作式 yield 提供的非正式非结构化的消息共享机制。本质上，yield put(..)是一个既发送了值也暂停了执行来传递控制的单个操作，而在前面我们给出的例子中这两者是分开的步骤。

另外，CSP 强调你并不真正显式地传递控制，而是设计并发例程来阻塞等待来自于通道的值或阻塞等待试图发送值到这个通道。协调顺序和协程之间行为的方式就是通过接收和发送消息的阻塞。

由于我们这里一直讨论的异步模式都是在我的 asynquence 库的大背景下进行的，因此你可能有兴趣看到我们可以相当轻松地在 ASQ#runner(..) 生成器处理上添加一个模拟层，作为CSP API 和特性的近乎完美的移植。这个模拟层作为 asynquence-contrib 包的一个可选部分与 asynquence 一起发布。

与前面的辅助函数 state(..) 非 常 相 似，ASQ.csp.go(..) 接 受 一 个 生 成 器 —— 在 go/core.async 术语中，它被称为 goroutine——并通过返回一个新的生成器将其适配为可与ASQ#runner(..) 合作。

goroutine 接收一个最初创建好的通道（ch），而不是被传入一个 token，一次运行中的所有goroutien 都会共享这个通道。你可以通过 ASQ.csp.chan(..) 创建更多的通道（这常常会极其有用！）。

在 CSP 中，我们把所有的异步都用通道消息上的阻塞来建模，而不是阻塞等待 Promise/ 序列 /thunk 完成。

因此，不是把从 request(..) 返回的 Promise yield 出来，而是 request(..) 应该返回一个通道，从中你可以 take(..)（拿到）值。换句话说，这种环境和用法下单值通道大致等价于 Promise 或序列。

我们先来构造一个支持通道的 request(..) 版本：
```js
function request(url) { 
  var ch = ASQ.csp.channel(); 
  ajax( url ).then( function(content){ 
    // putAsync(..)的put(..)的一个变异版本，这个版本
    // 可以在生成器之外使用。返回一个运算完毕promise。
    // 这里我们没有使用这个promise，但是如果当值被
    // take(..)之后我们需要得到通知的话，可以使用这个promise。
    ASQ.csp.putAsync( ch, content ); 
  } ); 
  return ch; 
}
```
由第 3 章可知，promisory 是生产 Promise 的工具；第 4 章里的 thunkory 是生产 thunk 的工具；以及最后在附录 A 中，我们发明了 sequory 来表示生产序列的工具。

很自然地，我们要再次构造一个类似的术语以表示生产通道的工具。我们就称之为chanory（channel+factory）吧。作为留给你的练习，请试着定义一个类似于 Promise.wrap(..)/promisify(..)（第 3 章）、thunkify(..)（第 4 章）和 ASQ.wrap(..)（附录 A）的channelify(..) 工具。

现在考虑使用 asynquence 风格的 CSP 实现的并发 Ajax 的例子：
```js
ASQ() 
.runner( 
  ASQ.csp.go( function*(ch){ 
    yield ASQ.csp.put( ch, "http://some.url.2" ); 
    var url1 = yield ASQ.csp.take( ch ); 
    // "http://some.url.1" 
    var res1 = yield ASQ.csp.take( request( url1 ) ); 
    yield ASQ.csp.put( ch, res1 ); 
  } ), 
  ASQ.csp.go( function*(ch){ 
    var url2 = yield ASQ.csp.take( ch ); 
    // "http://some.url.2" 
    yield ASQ.csp.put( ch, "http://some.url.1" ); 
    var res2 = yield ASQ.csp.take( request( url2 ) ); 
    var res1 = yield ASQ.csp.take( ch ); 
    // 把结果传递到下一个序列步骤
    ch.buffer_size = 2; 
    ASQ.csp.put( ch, res1 ); 
    ASQ.csp.put( ch, res2 );
  } ) 
) 
.val( function(res1,res2){ 
  // res1来自"http://some.url.1" 
  // res2来自"http://some.url.2" 
} ); 
```
在两个 goroutine 之间交换 URL 字符串的消息传递过程是非常直接的。第一个 goroutine 构造一个到第一个 URL 的 Ajax 请求，响应放到通道 ch 中。第二个 goroutine 构造一个到第二个 URL 的 Ajax 请求，然后从通道 ch 拿到第一个响应 res1。这时，两个响应 res1 和res2 便都已经完成就绪了。

如果在 goroutine 运行结束时，通道 ch 中还有任何剩下的值，那它们就会被传递到序列的下一个步骤。所以，要从最后的 goroutine 传出消息，可以通过 put(..) 将其放入 ch 中。如上所示，为了避免这些最后的 put(..) 阻塞，我们通过将 ch 的 buffer_size 设置为 2（默认：0）而将 ch 切换为缓冲模式。

[asynquence 风格的 CSP 的示例](https://gist.github.com/getify/e0d04f1f5aa24b1947ae)

## 起步上路

### 深入编程

- 代码解释: 对某些计算机语言来说，在程序被执行时，对命令的翻译通常是自上而下逐行执行的
- 代码编译: 对另外一些语言来说，这种翻译是预先进行的，被称为代码编译，这样一来，当执行程序时，实际上运行的是已经编译好的、可以执行的计算机指令。

基本上可以说 JavaScript 是解释型的，因为每次执行 JavaScript 源码时都需要进行处理。但这么说并不完全精确。JavaScript 引擎实际上是动态编译程序，然后立即执行编译后的代码。

```js
// 常量
const ACCESSORY_PRICE = 9.99;

// if条件 + 块（块内的语句只有再条件判断成立时才会运行）
if () {...}
// 块语句不需要分号结尾
```

循环块的每次执行被称为一个`迭代`

### 深入JavaScript

[[toc]]

### 深入“你不知道的JavaScript系列”

JavaScript 引擎在执行前（有时是执行中！）就编译了代码。因此，通过深入理解编译器对代码的处理方式，我们可以尝试理解它是如何找到并处理变量和函数声明的。沿着这条路，我们看到了 JavaScript 变量作用域管理的常见方式——“提升”

## ES6及更新版本

### 语法

```js
let a = 2; 
if (a > 1) { 
  let b = a * 3; 
  console.log( b ); // 6 
  for (let i = a; i <= b; i++) { 
    let j = i + 10; 
    console.log( j ); 
  } 
  // 12 13 14 15 16 
  let c = a + b; 
  console.log( c ); // 8 
}
```

if 语句包含了块作用域变量 b 和 c，块作用域变量 j 存在于 for 循环之中, i 并不在包含它的 if 语句作用域中

- 临时性死区（TDZ）

```js
{ 
  console.log( a ); // undefined 
  console.log( b ); // ReferenceError! 
  var a; 
  let b; 
}
```

过早访问 let 声明的引用导致的这个 ReferenceError 严格说叫作临时死亡区（Temporal Dead Zone，TDZ）错误——你在访问一个已经声明但没有初始化（赋值）的变量——它防止变量在未初始化的状态下被访问。

:::warning 注意
const: 常量不是对这个值本身的限制，而是对赋值的那个变量的限制。换句话说，这个值并没有因为 const 被锁定或者不可变，只是赋值本身不可变。如果这个值是复杂值，比如对象或者数组，其内容仍然是可以修改的。

```js
{ 
  const a = [1,2,3]; 
  a.push( 4 ); 
  console.log( a ); // [1,2,3,4] 
  a = 42; // TypeError! 
}
```

变量 a 并不持有一个常量数组；相反地，它持有一个指向数组的常量引用。数组本身是可以随意改变的。

将一个对象或数组作为常量赋值，意味着这个值在这个常量的词法作用域结束之前不会被垃圾回收，因为指向这个值的引用没有清除。
:::

- spread/rest(展开/收集运算符)

```js
function foo(x,y,z) { 
 console.log( x, y, z ); 
} 
foo( ...[1,2,3] ); // 1 2 3

var a = [2,3,4]; 
var b = [ 1, ...a, 5 ]; 
console.log( b ); // [1,2,3,4,5]

function foo(x, y, ...z) { 
 console.log( x, y, z ); 
} 
foo( 1, 2, 3, 4, 5 ); // 1 2 [3,4,5]
```

当 ... 用在数组之前时（实际上是任何 iterable），它会把这个变量“展开”为各个独立的值。

可以替代弃用很久的 arguments 数组

```js
function foo(...args) { 
  // args已经是一个真正的数组
  // 丢弃args中第一个元素
  args.shift(); 
  // 把整个args作为参数传给console.log(..) 
  console.log( ...args ); 
}
```

```js
function foo(x = 11, y = 31) { 
  console.log( x + y ); 
}

foo( 5, undefined ); // 36 <-- 丢了undefined 
foo( 5, null ); // 5 <-- null被强制转换为0 
```

> 注意函数声明中形式参数是在它们自己的作用域中（可以把它看作是就在函数声明包裹的 ( .. ) 的作用域中），而不是在函数体作用域中。这意味着在默认值表达式中的标识符引用首先匹配到形式参数作用域，然后才会搜索外层作用域。

```js
var w = 1, z = 2; 
function foo( x = w + 1, y = x + 1, z = z + 1 ) { 
  console.log( x, y, z ); 
} 
foo(); // ReferenceError
```

对于对象解构形式来说，如果省略了 var/let/const 声明符，就必须把整个赋值表达式用 ( ) 括起来。因为如果不这样做，语句左侧的 {..} 作为语句中的第一个元素就会被当作是一个块语句而不是一个对象

```js
var a, b, c, x, y, z; 

[a,b,c] = foo(); 
( { x, y, z } = bar() ); 

console.log( a, b, c ); // 1 2 3 
console.log( x, y, z ); // 4 5 6
```

解构中使用计算出的属性表达式。[which]: 这一部分是计算出的属性，结果是 x

```js
var which = "x", 
  o = {}; 

( { [which]: o[which] } = bar() ); 

console.log( o.x ); // 4
```

甚至可以不用临时变量解决“交换两个变量”这个经典问题：

```js
var x = 10, y = 20; 
[ y, x ] = [ x, y ]; 
console.log( x, y ); // 20 10
```

```js
var o = { a:1, b:2, c:3 }, 
  a, b, c, p; 
p = { a, b, c } = o; 
console.log( a, b, c ); // 1 2 3 
p === o; // true
// p 赋值为对象 o 的引用，而不是 a、b 或者 c 的值之一

var o = { a:1, b:2, c:3 }, 
  p = [4,5,6], 
  a, b, c, x, y, z; 
( {a} = {b,c} = o ); 
[x,y] = [z] = p; 
console.log( a, b, c ); // 1 2 3 
console.log( x, y, z ); // 4 5 4
// 通过持有对象 / 数组的值作为完成值，可以把解构赋值表达式组成链

var [ a = 3, b = 6, c = 9, d = 12 ] = foo(); 
var { x = 5, y = 10, z = 15, w = 20 } = bar(); 
console.log( a, b, c, d ); // 1 2 3 12 
console.log( x, y, z, w ); // 4 5 6 20
// 默认值赋值

var o = { 
  __id: 10, 
  get id() { return this.__id++; }, 
  set id(v) { this.__id = v; } 
} 
o.id; // 10 
o.id; // 11 
o.id = 20; 
o.id; // 20 
// and: 
o.__id; // 21 
o.__id; // 21--保持不变!
```

```js
var o1 = { 
  foo() { 
    console.log( "o1:foo" ); 
  } 
}; 
var o2 = { 
  foo() { 
    super.foo(); 
    console.log( "o2:foo" ); 
  } 
}; 
Object.setPrototypeOf( o2, o1 ); 
o2.foo(); // o1:foo 
 // o2:foo
```

super 只允许在简洁方法中出现，而不允许在普通函数表达式属性中出现。也只允许以 super.XXX 的形式（用于属性 / 方法访问）出现，而不能以super() 的形式出现。

```js
function foo(strings, ...values) { 
  console.log( strings ); 
  console.log( values ); 
} 

var desc = "awesome"; 
foo`Everything is ${desc}!`; 
// [ "Everything is ", "!"] 
// [ "awesome" ]


function bar() { 
  return function foo(strings, ...values) { 
    console.log( strings ); 
    console.log( values ); 
  } 
} 
var desc = "awesome"; 
bar()`Everything is ${desc}!`; 
// [ "Everything is ", "!"] 
// [ "awesome" ]

// 第一个参数，名为 strings，是一个由所有普通字符串（插入表达式之间的部分）组成的数组。得到的 strings 数组中有两个值："Everything is" 和 "!"
```

本质上说，这是一类不需要 ( .. ) 的特殊函数调用。标签（tag）部分，即 `..` 字符串字面量之前的 foo 这一部分 , 是一个要调用的函数值。实际上，它可以是任意结果为函数的表达式，甚至可以是一个结果为另一个函数的函数调用.

```js
function dollabillsyall(strings, ...values) { 
  return strings.reduce( function(s,v,idx){ 
    if (idx > 0) { 
      if (typeof values[idx-1] == "number") { 
        // 看，这里也使用了插入字符串字面量！
        s += `$${values[idx-1].toFixed( 2 )}`; 
      } 
      else { 
        s += values[idx-1]; 
      } 
    } 
    return s + v; 
  }, "" ); 
} 
var amt1 = 11.99, 
  amt2 = amt1 * 1.08, 
  name = "Kyle"; 
var text = dollabillsyall 
`Thanks for your purchase, ${name}! Your 
product cost was ${amt1}, which with tax 
comes out to ${amt2}.` 
console.log( text ); 
// Thanks for your purchase, Kyle! Your 
// product cost was $11.99, which with tax 
// comes out to $12.95.
```

如果在 values 中遇到一个 number 值，就在其之前放一个 "$"，然后用 toFixed(2) 把它格式化为两个十进制数字的形式，否则就让这个值直接通过而不做任何修改。

```js
function showraw(strings, ...values) { 
  console.log( strings ); 
  console.log( strings.raw ); 
} 
showraw`Hello\nWorld`; 
// [ "Hello 
// World" ] 
// [ "Hello\nWorld" ]
```

```js
console.log( `Hello\nWorld` ); 
// Hello 
// World 
console.log( String.raw`Hello\nWorld` ); 
// Hello\nWorld 
String.raw`Hello\nWorld`.length; 
// 12
```

```js
function foo(x,y) { 
  return x + y; 
} 
// 对比
var foo = (x,y) => x + y;
```

for..of 循环的值必须是一个 iterable，或者说它必须是可以转换 / 封箱到一个 iterable 对象的值。iterable 就是一个能够产生迭代器供循环使用的对象。

```js
var a = ["a","b","c","d","e"]; 
for (var idx in a) { 
  console.log( idx ); 
} 
// 0 1 2 3 4 
for (var val of a) { 
  console.log( val ); 
} 
// "a" "b" "c" "d" "e"

```

可以看到，for..in 在数组 a 的键 / 索引上循环，而 for..of 在 a 的值上循环。

JavaScript 中默认为（或提供）iterable 的标准内建值包括：
- Arrays 
- Strings
- Generators
- Collections / TypedArrays

ES6 正则表达式中另外一个新增的标签模式是 y，通常称为“定点（sticky）模式”。定点主要是指在正则表达式的起点有一个虚拟的锚点，只从正则表达式的 lastIndex 属性指定的位置开始匹配。

```js
// 第一个没有定点模式
var re1 = /foo/, 
  str = "++foo++"; 
re1.lastIndex; // 0 
re1.test( str ); // true 
re1.lastIndex; // 0--没有更新
re1.lastIndex = 4; 
re1.test( str ); // true--被忽略的lastIndex 
re1.lastIndex; // 4--没有更新
```

- test(..) 并不关心 lastIndex 的值，总是从输入字符串的起始处开始执行匹配。
- 因为我们的模式并没有起始锚点 ^，对 "foo" 的搜索从整个字符串向前寻找匹配。
- test(..) 不更新 lastIndex。

```js
// 定点模式正则表达式
var re2 = /foo/y, // <-- 注意定点标识y 
  str = "++foo++"; 
re2.lastIndex; // 0 
re2.test( str ); // false--0处没有找到"foo" 
re2.lastIndex; // 0 
re2.lastIndex = 2; 
re2.test( str ); // true 
re2.lastIndex; // 5--更新到前次匹配之后位置
re2.test( str ); // false 
re2.lastIndex; // 0--前次匹配失败后重置
```

- test(..) 使用 lastIndex 作为 str 中精确而且唯一的位置寻找匹配。不会向前移动去寻找匹配——要么匹配位于 lastIndex 位置上，要么就没有匹配。
- 如果匹配成功，test(..) 会更新 lastIndex 指向紧跟匹配内容之后的那个字符。如果匹配失败，test(..) 会把 lastIndex 重置回 0。

一般的没有用 ^ 限制输入起始点匹配的非定点模式可以自由地在输入字符串中向前移动寻找匹配内容。而定点模式则限制了模式只能从 lastIndex 开始匹配。

```js
var re = /\d+\.\s(.*?)(?:\s|$)/y 
  str = "1. foo 2. bar 3. baz"; 
str.match( re ); // [ "1. foo ", "foo" ] 
re.lastIndex; // 7--正确位置! 
str.match( re ); // [ "2. bar ", "bar" ] 
re.lastIndex; // 14--正确位置! 
str.match( re ); // ["3. baz", "baz"]
```

```js
var re = /o+./g, // <-- 注意g! 
  str = "foot book more"; 
re.exec( str ); // ["oot"] 
re.lastIndex; // 4 
re.exec( str ); // ["ook"] 
re.lastIndex; // 9 
re.exec( str ); // ["or"] 
re.lastIndex; // 13 
re.exec( str ); // null--没有更多匹配! 
re.lastIndex; // 0--现在从头开始!
```

确实，g 模式匹配加上 exec(..) 从 lastiIndex 的当前值开始匹配，同时会在每次匹配（或匹配失败后）更新 lastIndex，但是这和 y 的行为特性并不相同。

注意前面的代码中位于位置 6 处的 "ook"，会被第二个 exec(..) 调用匹配找到，虽然在那个时候，lastIndex 值是 4（来自于上一次匹配的结尾）。这是为什么？因为就像我前面所说，非定点匹配可以在匹配过程中自由向前移动。因为不允许向前移动，所以定点模式表达式在这里会匹配失败。

除了可能并不需要的向前移动匹配，只用 g 替代 y 的另一个缺点是 g 改变了某些匹配方法的行为特性，比如 str.match(re)。

```js
var re = /o+./g, // <-- 注意g! 
  str = "foot book more"; 
str.match( re ); // ["oot","ook","or"]
```

看到所有的匹配是如何立即返回了吗？有时候这不是问题，但有时候它又并非是你想要的。

通过使用工具 test(..) 和 match(..)，y 定点标识带来的是一次一个的向前匹配。只是要确保每次匹配的时候 lastIndex 总是处于正确的位置上！

模式中的 ^ 就是表示也仅表示输入的起始点。因此，像 /^foo/y 这样的模式总是也只是寻找字符串起始处的 "foo" 匹配，但前提是允许在此处匹配。如果 lastIndex 不是 0，那么匹配就会失败。

```js
var re = /^foo/y, 
  str = "foo"; 
re.test( str ); // true 
re.test( str ); // false 
re.lastIndex; // 0--失败后重置
re.lastIndex = 1; 
re.test( str ); // false--由于定位而失败
re.lastIndex; // 0--失败后重置
```

底线：y 加上 ^ 再加上 lastIndex > 0 是一个不兼容的组合，总是会导致匹配失败。

y 不会以任何形式改变 ^ 的含义，而 m 多行模式则会，也就是说，^ 意味着输入起始处或者换行之后的文字起始位置。所以，如果组合使用 y 和 m 模式，就会发现字符串中有多个 ^ 匹配基准。但是记住：因为这是 y 定点的，需要确保每次匹配的时候 lastIndex 指向正确的换行位置（可能通过匹配行尾来实现），否则下次匹配不会成功。

```js
var re = /foo/ig; 
re.flags; // "gi"

// ES6 规范中规定了表达式的标识按照这个顺序列出："gimuy"，无论原始指定的模式是什么。
```

Unicode 字符范围从 0x0000 到 0xFFFF，包含可能看到和接触到的所有（各种语言的）标准打印字符。这组字符称为基本多语言平面（Basic Multilingual Plane，BMP）。BMP 甚至包含了像雪人这样的有趣的符号： （U+2603）。

在 BMP 集之外还有很多其他扩展 Unicode 字符，范围直到 0x10FFFF。这些符号通常是星形符号（astral symbol），这个名称是指 BMP 之外的字符的 16 个平面（或者说，层次 / 分组）的集合。星形符号的例子包括 U+1D11E）和 U+1F4A9) 这样的符号。

```js
var snowman = "\u2603"; 
console.log( snowman ); // "☃"

var gclef = "\u{1D11E}"; 
console.log( gclef ); // " "6
```

默认情况下，JavaScript 字符串运算和方法不能感知字符串中的 astral 符号。所以会单独处理每个 BMP 字符，即使是构成单个 astral 字符的两半。考虑：

```js
var snowman = "☃"; 
snowman.length; // 1 

var gclef = " "; 
gclef.length; // 2

var gclef = " "; 
[...gclef].length; // 1 
Array.from( gclef ).length; // 1
```

ES6 字符串有内建的迭代器。这个迭代器恰好是可以识别Unicode 的，也就是说它能够自动将 astral 符号作为单个值输出。我们可以利用这一点，在数组字面量使用 ...spread 运算符，创建一个字符串符号的数组。然后查看结果数组的长度。ES6 的 Array.from(..) 所做的事情基本上和 [...XYZ] 一样

```js
var s1 = "\xE9", 
  s2 = "e\u0301";

console.log( s1 ); // "é" 
console.log( s2 ); // "é"

[...s1].length; // 1 
[...s2].length; // 2

s1.normalize().length; // 1 
s2.normalize().length; // 1 
s1 === s2; // false 
s1 === s2.normalize(); // true
```

基本上说就是，normalize(..) 接受像 "e\u0301" 这样的一个序列，然后把它规范化为"\xE9"。甚至如果有合适的 Unicode 符号可以合并的话，规范化可以把多个相邻的组合符号合并：

```js
var s1 = "o\u0302\u0300", 
  s2 = s1.normalize(), 
  s3 = " "; 
s1.length; // 3 

s2.length; // 1 
s3.length; // 1 
s2 === s3; // true
```

不幸的是，这里规范化也并不完美。如果有多个组合符号修改了单个字符，你可能就无法得到期望的长度结果，因为可能并没有单个的定义好的规范化符号可以表示所有这些符号带来的合并结果。举例来说：

```js
var s1 = "e\u0301\u0330"; 
console.log( s1 ); // "ḛ́" 
s1.normalize().length; // 2
```

```js
var s1 = "abc\u0301d", 
  s2 = "ab\u0107d", 
  s3 = "ab\u{1d49e}d"; 
console.log( s1 ); // "abćd" 
console.log( s2 ); // "abćd" 
console.log( s3 ); // "ab d" 
s1.charAt( 2 ); // "c" 
s2.charAt( 2 ); // "ć" 
s3.charAt( 2 ); // "" <-- 不可打印
s3.charAt( 3 ); // "" <-- 不可打印

[...s1.normalize()][2]; // "ć" 
[...s2.normalize()][2]; // "ć" 
[...s3.normalize()][2]; // " "
```

```js
var s1 = "abc\u0301d", 
  s2 = "ab\u0107d", 
  s3 = "ab\u{1d49e}d"; 
s1.normalize().codePointAt( 2 ).toString( 16 ); 
// "107" 
s2.normalize().codePointAt( 2 ).toString( 16 ); 
// "107" 
s3.normalize().codePointAt( 2 ).toString( 16 ); 
// "1d49e"

String.fromCodePoint( 0x107 ); // "ć" 
String.fromCodePoint( 0x1d49e ); // " "

String.fromCodePoint( s1.normalize().codePointAt( 2 ) ); 
// "ć" 
String.fromCodePoint( s2.normalize().codePointAt( 2 ) ); 
// "ć" 
String.fromCodePoint( s3.normalize().codePointAt( 2 ) ); 
// " "
```

Unicode 也可以用作标识符名（变量、属性等）。在 ES6 之前，可以通过 Unicode 转义符实现这一点

```js
var \u03A9 = 42; 
// 等价于：var Ω = 42;

// 码点转义符语法
var \u{2B400} = 42; 
// 等价于：var = 42;
```

符号的主要意义是创建一个类 ( 似 ) 字符串的不会与其他任何值冲突的值。所以，考虑使用一个符号作为事件名的常量表示的例子：

```js
const EVT_LOGIN = Symbol( "event.login" );

evthub.listen( EVT_LOGIN, function(data){ 
  // .. 
} );
```

考虑一下这个实现了单例（singleton）模式的模块，也就是说，它只允许自己被创建一次：

```js
const INSTANCE = Symbol( "instance" ); 
function HappyFace() { 
  if (HappyFace[INSTANCE]) return HappyFace[INSTANCE]; 
  function smile() { .. } 
  return HappyFace[INSTANCE] = { 
    smile: smile 
  }; 
} 
var me = HappyFace(), 
  you = HappyFace(); 
me === you; // true
```

这里的 INSTANCE 符号值是一个特殊的、几乎隐藏的、类似元属性的属性，静态保存在HappeyFace() 函数对象中。

全局符号注册:

```js
const EVT_LOGIN = Symbol.for( "event.login" ); 
console.log( EVT_LOGIN ); // Symbol(event.login)

function HappyFace() { 
  const INSTANCE = Symbol.for( "instance" ); 
  if (HappyFace[INSTANCE]) return HappyFace[INSTANCE]; 
  // .. 
  return HappyFace[INSTANCE] = { .. }; 
}
```

Symbol.for(..) 在全局符号注册表中搜索，来查看是否有描述文字相同的符号已经存在，如果有的话就返回它。如果没有的话，会新建一个并将其返回。换句话说，全局注册表把符号值本身根据其描述文字作为单例处理。

```js
var s = Symbol.for( "something cool" ); 
var desc = Symbol.keyFor( s ); 
console.log( desc ); // "something cool" 
// 再次从注册中取得符号
var s2 = Symbol.for( desc ); 
s2 === s; // true
```

```js
var o = { 
  foo: 42, 
  [ Symbol( "bar" ) ]: "hello world", 
  baz: true 
}; 
Object.getOwnPropertyNames( o ); // [ "foo","baz" ]

Object.getOwnPropertySymbols( o ); // [ Symbol(bar) ]
```

```js
var a = [1,2,3]; 
a[Symbol.iterator]; // 原生函数
```

规范使用 @@ 前缀记法来指代内置符号，最常用的一些是：@@iterator、@@toStringTag、@@toPrimitive。规范还定义了一些其他符号，但是可能没那么常用。

### 代码组织

- 迭代器（iterator）

```js
Iterator [required] 
  next() {method}: 取得下一个IteratorResult

Iterator [optional] 
  return() {method}: 停止迭代器并返回IteratorResult 
  throw() {method}: 报错并返回IteratorResult

IteratorResult 
  value {property}: 当前迭代值或者最终返回值（如果undefined为可选的）
  done {property}: 布尔值，指示完成状态

Iterable 
  @@iterator() {method}: 产生一个 Iterator
```

我们来观察一个数组，这是一个 iterable，它产生的迭代器可以消耗其自身值：

```js
var arr = [1,2,3]; 
var it = arr[Symbol.iterator](); 
it.next(); // { value: 1, done: false } 
it.next(); // { value: 2, done: false } 
it.next(); // { value: 3, done: false } 
it.next(); // { value: undefined, done: true }
```

每次在这个 arr 值上调用位于 Symbol.iterator 的方法时，都会产生一个全新的迭代器。多数结构都是这么实现的，包括所有 JavaScript 内置数据结构。

```js
var m = new Map(); 
m.set( "foo", 42 ); 
m.set( { cool: true }, "hello world" ); 
var it1 = m[Symbol.iterator](); 
var it2 = m.entries(); 
it1.next(); // { value: [ "foo", 42 ], done: false } 
it2.next(); // { value: [ "foo", 42 ], done: false } 
..
```

迭代器接口——return(..) 和 throw(..)

return(..) 被定义为向迭代器发送一个信号，表明消费者代码已经完毕，不会再从其中提取任何值。这个信号可以用于通知生产者（响应 next(..) 调用的迭代器）执行可能需要的清理工作，比如释放 / 关闭网络、数据库或者文件句柄资源。

如果迭代器存在 return(..)，并且出现了任何可以自动被解释为异常或者对迭代器消耗的提前终止的条件，就会自动调用 return(..)。你也可以手动调用 return(..)。

通用的惯例是，迭代器不应该在调用 return(..) 或者 thrown(..) 之后再产生任何值。

```js
var it = { 
  // 使迭代器it成为iterable 
  [Symbol.iterator]() { return this; }, 
  next() { .. }, 
  .. 
}; 
it[Symbol.iterator]() === it; // true

for (var v of it) { 
  console.log( v ); 
}

// for..of 循环的等价 for 形式
for (var v, res; (res = it.next()) && !res.done; ) { 
  v = res.value; 
  console.log( v ); 
}
```

试着构造一个迭代器来产生一个无限斐波纳契序列：

```js
var Fib = { 
  [Symbol.iterator]() { 
    var n1 = 1, n2 = 1; 
    return { 
      // 使迭代器成为iterable 
      [Symbol.iterator]() { return this; }, 
      next() { 
        var current = n2; 
        n2 = n1; 
        n1 = n1 + current; 
        return { value: current, done: false }; 
      }, 
      return(v) { 
        console.log("Fibonacci sequence abandoned." ); 
        return { value: v, done: true }; 
      } 
    }; 
  } 
}; 
for (var v of Fib) { 
  console.log( v ); 
  if (v > 50) break; 
} 
// 1 1 2 3 5 8 13 21 34 55 
// Fibonacci sequence abandoned.


var tasks = { 
  [Symbol.iterator]() { 
    var steps = this.actions.slice(); 
    return { 
      // 使迭代器成为iterable 
      [Symbol.iterator]() { return this; }, 
      next(...args) { 
        if (steps.length > 0) { 
          let res = steps.shift()( ...args ); 
          return { value: res, done: false }; 
        } 
        else { 
          return { done: true } 
        } 
      }, 
      return(v) { 
        steps.length = 0; 
        return { value: v, done: true }; 
      } 
    }; 
  }, 
  actions: [] 
};


tasks.actions.push( 
  function step1(x){ 
    console.log( "step 1:", x ); 
    return x * 2; 
  }, 
  function step2(x,y){ 
    console.log( "step 2:", x, y ); 
    return x + (y * 2); 
  }, 
  function step3(x,y,z){ 
    console.log( "step 3:", x, y, z ); 
    return (x * y) + z; 
  } 
); 
var it = tasks[Symbol.iterator](); 
it.next( 10 ); // step 1: 10 
 // { value: 20, done: false } 
it.next( 20, 50 ); // step 2: 20 50 
 // { value: 120, done: false } 
it.next( 20, 50, 120 ); // step 3: 20 50 120 
 // { value: 1120, done: false } 
it.next(); // { done: true }
```

```js
if (!Number.prototype[Symbol.iterator]) { 
  Object.defineProperty( 
    Number.prototype, 
    Symbol.iterator, 
    { 
      writable: true, 
      configurable: true, 
      enumerable: false, 
      value: function iterator(){ 
        var i, inc, done = false, top = +this; 
        // 正向还是反向迭代？
        inc = 1 * (top < 0 ? -1 : 1); 
        return { 
          // 使得迭代器本身成为iterable! 
          [Symbol.iterator](){ return this; }, 
          next() { 
            if (!done) { 
            // 初始迭代总是0 
            if (i == null){ 
              i = 0; 
            } 
            // 正向迭代
            else if (top >= 0) { 
              i = Math.min(top,i + inc); 
            } 
            // 反向迭代
            else { 
              i = Math.max(top,i + inc); 
            } 
            // 本次迭代后结束？
            if (i == top) done = true; 
              return { value: i, done: false }; 
            } 
            else { 
              return { done: true }; 
            } 
          } 
        }; 
      } 
    } 
  ); 
}

for (var i of 3) { 
  console.log( i ); 
} 
// 0 1 2 3 
[...-3]; // [0,-1,-2,-3]
```

```js
var a = [1,2,3,4,5];
var it = a[Symbol.iterator](); 
var [x,y] = it; 
// 从it中获取前两个元素
var [z, ...w] = it; 
// 获取第三个元素，然后一次取得其余所有元素
// it已经完全耗尽？是的。
it.next(); // { value: undefined, done: true } 
x; // 1 
y; // 2 
z; // 3 
w; // [4,5]
```

- 生成器

yield 关键字的优先级很低，几乎 yield.. 之后的任何表达式都会首先计算，然后再通过 yield 发送。只有 spread 运算符 ... 和逗号运算符 , 拥有更低的优先级，也就是说它们会在 yield 已经被求值之后才会被绑定。

```js
yield 2 + 3; // 等价于yield (2 + 3) 
(yield 2) + 3; // 首先yield 2，然后+ 3
```

和 = 赋值一样，yield 也是“右结合”的，也就是说多个 yield 表达式连续出现等价于用 (..) 从右向左分组。所以，yield yield yield 3 会被当作 yield(yield(yield 3))

使用 yield..，表达式的完成值来自于用 it.next(..) 恢复生成器的值，而对于 yield *.. 表达式来说，完成值来自于被委托的迭代器的返回值（如果有的话）。

```js
function *foo() { 
  yield 1; 
  yield 2; 
  yield 3; 
  return 4; 
} 
function *bar() { 
  var x = yield *foo(); 
  console.log( "x:", x ); 
} 
for (var v of bar()) { 
  console.log( v ); 
} 
// 1 2 3 
// x: 4
```

值 1、2 和 3 从 *foo() 中 yield 出来后再从 *bar() 中 yield 出来，然后从 *foo() 返回的值4 是 yield *foo() 表达式的完成值，被赋给了 x。

因为 yield * 可以调用另外一个生成器（通过委托到其迭代器），所以它也可以通过调用自身执行某种生成器递归：

```js
function *foo(x) { 
  if (x < 3) { 
    x = yield *foo( x + 1 ); 
  } 
  return x * 2; 
} 
foo( 1 );
```

foo(1) 以及之后的调用迭代器的 next() 来运行递归步骤的结果是 24。第一个 *foo(..) 运行 x 值为 1，满足 x < 3。x + 1 被递归地传给 *foo(..)，所以这一次 x 为 2。再次的递归调用使得 x 值为 3。

现在，因为不满足 x < 3，递归停止，返回 3 * 2 也就是 6 给前一个调用的 yield *.. 表达式，这个值被赋给 x。再次返回 6 * 2 的结果 12 给前一次调用的 x。最后是 12 * 2，也就是 24，返回给 *foo() 生成器的完成结果。

```js
function *foo(x) { 
  if (x < 3) { 
    x = yield *foo( x + 1 ); 
  } 
  return x * 2; 
} 
var it = foo( 1 ); 
it.next(); // { value: 24, done: true }
```

在上面的例子中，生成器没有真正暂停，因为并没有 yield .. 表达式。相反，yield * 只是通过递归调用保存当前的迭代步骤。所以，只要一次调用迭代器的 next() 函数就运行了整个生成器。

```js
function *foo() { 
  var x = yield 1; 
  var y = yield 2; 
  var z = yield 3; 
  console.log( x, y, z ); 
}

var it = foo(); 
it.next(); // { value: 1, done: false }
```

在这段代码中，每个 yield.. 从（1, 2, 3）中发出一个值，更直接地说，它是暂停生成器来等待一个值。换句话说几乎等价于在问“这里我应该用什么值？请回复。”这个问题。

第一个 next() 调用初始的暂停状态启动生成器，运行直到第一个 yield。在调用第一个next() 的时候，并没有 yield.. 表达式等待完成。如果向第一个 next() 调用传入一个值，这个值会马上被丢弃，因为并没有 yield 等待接收这个值。

```js
var it = foo(); 
// 启动生成器
it.next(); // { value: 1, done: false } 
// 回答第一个问题
it.next( "foo" ); // { value: 2, done: false } 
// 回答第二个问题
it.next( "bar" ); // { value: 3, done: false } 
// 回答第三个问题
it.next( "baz" ); // "foo" "bar" "baz" 
 // { value: undefined, done: true }
```

本章前面讨论过，生成器上附着的迭代器支持可选的 return(..) 和 throw(..) 方法。这两种方法都有立即终止一个暂停的生成器的效果。

```js
function *foo() { 
  yield 1; 
  yield 2; 
  yield 3; 
} 
var it = foo(); 
it.next(); // { value: 1, done: false } 
it.return( 42 ); // { value: 42, done: true } 
it.next(); // { value: undefined, done: true }
```

return(..) 除了可以手动调用，还可以在每次迭代的末尾被任何消耗迭代器的 ES6 构件自动调用，比如 for..of 循环和 spread 运算符 ...。

```js
function *foo() { 
  try { 
    yield 1; 
    yield 2; 
    yield 3; 
  } 
  finally { 
    console.log( "cleanup!" ); 
  } 
} 
for (var v of foo()) { 
  console.log( v ); 
} 
// 1 2 3 
// cleanup! 
var it = foo(); 
it.next(); // { value: 1, done: false } 
it.return( 42 ); // cleanup! 
 // { value: 42, done: true }
```

```js
function *foo() { 
  yield 1; 
  yield 2; 
  yield 3; 
} 
var it = foo(); 
it.next(); // { value: 1, done: false } 
try { 
  it.throw( "Oops!" ); 
} 
catch (err) { 
  console.log( err ); // Exception: Oops! 
} 
it.next(); // { value: undefined, done: true }
```

和 return(..) 不同，迭代器的 throw(..) 方法从来不会被自动调用。

- 模块

| 命名导出1 | 命名导出2 |
| - | - |
| ```js | ```js |\
| export function foo() {// .. } | function foo() {// .. } |\
| export var awesome = 42; | var awesome = 42; |\
| var bar = [1,2,3]; | var bar = [1,2,3]; |\
| export { bar as bar }; | export { foo, awesome, bar }; |\
| export function foo() {// .. }  | |\
| ``` | ``` |


| 默认导出1 | 默认导出2 |
| - | - |
| ```js | ```js |\
| function foo() {// .. } | function foo() {// .. } |\
| export default foo; | export { foo as default }; |\
| //export default function foo(..) {// .. } | .. |\
| ``` | ``` |

在第一段代码中，导出的是此时到函数表达式值的绑定，而不是标识符 foo。换句话说，export default .. 接受的是一个表达式。如果之后在你的模块中给 foo 赋一个不同的值，模块导入得到的仍然是原来导出的函数，而不是新的值。

在第二段代码模块导出中，默认导出绑定实际上绑定到 foo 标识符而不是它的值，所以得到了前面描述的绑定行为（也就是说，如果之后修改了 foo 的值，在导入一侧看到的值也会更新）。

除了 export default ... 形式导出一个表达式值绑定，所有其他的导出形式都是导出局部标识符的绑定。对于这些绑定来说，如果导出之后在模块内部修改某个值，外部导入的绑定会访问到修改后的值：

```js
var foo = 42; 
export { foo as default }; 
export var bar = "hello world"; 
foo = 10; 
bar = "cool";
```

当你导入这个模块的时候，default 和 bar 导出会绑定到局部变量 foo 和 bar，也就是说它们会暴露更新后的值 10 和 "cool"。导出时刻的值无关紧要。导入时刻的值也无关紧要。绑定是活连接，所以重要的是访问这个绑定时刻的当前值。

> 双向绑定是不允许的。如果从一个模块导入了 foo，然后修改导入的 foo 变量的值，就会抛出错误！

模块的 export 中的关键字 default 指定了一个命名导出，名称实际上就是 default，就像第二种更详细的语法形式表明的一样。在后一种语法中，从 default 到这个例子中的 foo 的重命名都是显式的，和前一种隐式语法形式是一样的。

```js
export default function foo() { .. } 
export function bar() { .. } 
export function baz() { .. }

import FOOFN, { bar, baz as BAZ } from "foo"; 
FOOFN(); 
bar(); 
BAZ();
```

| 命名空间导入 |
| - |
| ```js |\
| export function bar() { .. } |\
| export var x = 42; |\
| export function baz() { .. } |\
| import * as foo from "foo"; |\
| foo.bar(); |\
| foo.x; // 42 |\
| foo.baz(); |\
| ``` |

如果通过 * as .. 导入的模块有默认导出，它在指定的命名空间中的名字就是 default。你还可以在这个命名空间绑定之外把默认导入作为顶层标识符命名。

```js
export default function foo() { .. } 
export function bar() { .. } 
export function baz() { .. }

import foofn, * as hello from "world"; 
foofn(); 
hello.default(); 
hello.bar(); 
hello.baz();
```

| 模块 "A" | 模块 "B" |
| - | - |
| ```js | ```js |\
| import bar from "B"; | import foo from "A";  |\
| export default function foo(x) { | export default function bar(y) { |\
|   if (x > 10) return bar( x - 1 ); | if (y > 5) return foo( y / 2 ); |\
|   return x * 2;  | return y * 3; |\
| } | } |\
| ``` | ``` |

- 如果先加载模块 "A"，第一步是扫描这个文件分析所有的导出，这样就可以注册所有可以导入的绑定。然后处理 import .. from "B"，这表示它需要取得 "B"。
- 引擎加载 "B" 之后，会对它的导出绑定进行同样的分析。当看到 import .. from "A"，它已经了解 "A" 的 API，所以可以验证 import 是否有效。现在它了解 "B" 的 API，就可以验证等待的 "A" 模块中 import .. from "B" 的有效性。

本质上说，相互导入，加上检验两个 import 语句的有效性的静态验证，虚拟组合了两个独立的模块空间（通过绑定），这样 foo(..) 可以调用 bar(..)，反过来也是一样。这和如果它们本来是声明在同一个作用域中是对称的。

```js
import foo from "foo"; 
import bar from "bar"; 
foo( 25 ); // 11 
bar( 25 ); // 11.5

// 一般脚本在浏览器中通过<script>加载，这里import不合法
Reflect.Loader.import( "foo" ) // 为"foo"返回一个promise 
.then( function(foo){ 
  foo.bar(); 
} )
```

Reflect.Loader.import(..) 工具返回一个 promise，这个 promise 模块就绪就会完成。要导入多个模块，可以使用 Promise.all([ .. ]) 组合多个Reflect.Loader.import(..) 调用返回的 promise。

- 类

```js
class Foo { 
  constructor(a,b) { 
    this.x = a; 
    this.y = b; 
  } 
  gimmeXY() { 
    return this.x * this.y; 
  } 
}
```

- class Foo 表明创建一个（具体的）名为 Foo 的函数，与你在前 ES6 中所做的非常类似。
- constructor(..) 指定 Foo(..) 函数的签名以及函数体内容。
- 类方法使用第 2 章讨论过的对象字面量可用的同样的“简洁方法”语法。这也包含本章前面讨论过的简洁生成器形式，以及 ES5 getter/setter 语法。但是，类方法是不可枚举的，而对象方法默认是可枚举的。
- 和对象字面量不一样，在 class 定义体内部不用逗号分隔成员！实际上，这甚至是不允许的。

注意！尽管 class Foo 看起来很像 function Foo()，但二者有重要区别。

- 由于前 ES6 可用的 Foo.call(obj) 不能工作，class Foo 的 Foo(..) 调用必须通过new 来实现。
- function Foo 是“提升的”，而 class Foo 并不是；extends .. 语句指定了一个不能被“提升”的表达式。所以，在实例化一个 class 之前必须先声明它。
- 全局作用域中的 class Foo 创建了这个作用域的一个词法标识符 Foo，但是和 function Foo 不一样，并没有创建一个同名的全局对象属性。

因为 class 只是创建了一个同名的构造器函数，所以现有的 instanceof 运算符对 ES6 类仍然可以工作。然而，ES6 引入了一种使用 Symbol.hasInstance（参见 7.3 节）自定义instanceof 如何工作的方法。

ES6 class 本身并不是一个真正的实体，而是一个包裹着其他像函数和属性这样的具体实体并把它们组合到一起的元概念。

除了声明形式，class 也可以是一个表达式，就像在这一句中：var x = class Y { .. }。

```js
class Bar extends Foo { 
  constructor(a,b,c) { 
    super( a, b ); 
    this.z = c; 
  } 
  gimmeXYZ() { 
    return super.gimmeXY() * this.z; 
  } 
} 
var b = new Bar( 5, 15, 25 ); 
b.x; // 5 
b.y; // 15 
b.z; // 25 
b.gimmeXYZ(); // 1875
```

Bar extends Foo 的意思当然就是把 Bar.prototype 的 [[Prototype]] 连接到 Foo.prototype。所以，在像 gimmeXYZ() 这样的方法中，super 具体指 Foo.prototype，而在 Bar 构造器中super 指的是 Foo。

new.target 是一个新的在所有函数中都可用的“魔法”值，尽管在一般函数中它通常是undefined。在任何构造器中，new.target 总是指向 new 实际上直接调用的构造器，即使构造器是在父类中且通过子类构造器用 super(..) 委托调用。

```js
class Foo { 
  constructor() { 
    console.log( "Foo: ", new.target.name ); 
  } 
} 
class Bar extends Foo { 
  constructor() { 
    super(); 
    console.log( "Bar: ", new.target.name ); 
  } 
  baz() { 
    console.log( "baz: ", new.target ); 
  } 
} 
var a = new Foo(); 
// Foo: Foo 
var b = new Bar(); 
// Foo: Bar <-- 遵循new调用点
// Bar: Bar 
b.baz(); 
// baz: undefined
```

除了访问静态属性 / 方法之外，类构造器中的 new.target 元属性没有什么其他用处。

static 方法这些是直接添加到这个类的函数对象上的，而不是在这个函数对象的 prototype 对象上

```js
class Foo { 
  static cool() { console.log( "cool" ); } 
  wow() { console.log( "wow" ); } 
} 
class Bar extends Foo { 
  static awesome() { 
    super.cool(); 
    console.log( "awesome" ); 
  } 
  neat() { 
    super.wow(); 
    console.log( "neat" ); 
  } 
} 
Foo.cool(); // "cool" 
Bar.cool(); // "cool" 
Bar.awesome(); // "cool" 
 // "awesome" 
var b = new Bar(); 
b.neat(); // "wow" 
 // "neat" 
b.awesome; // undefined 
b.cool; // undefined
```

小心不要误以为 static 成员在类的原型链上。实际上它们在函数构造器之间的双向 / 并行链上。

static 适用的一个地方就是为派生（子）类设定 Symbol.species getter（规范内称为@@species）。如果当任何父类方法需要构造一个新实例，但不想使用子类的构造器本身时，这个功能使得子类可以通知父类应该使用哪个构造器。

举例来说，Array 有很多方法会创造并返回一个新的 Array 实例。如果定义一个 Array 的子类，但是想要这些方法仍然构造真正的 Array 实例而不是你的子类实例，就可以这样使用：

```js
class MyCoolArray extends Array { 
  // 强制species为父构造器
  static get [Symbol.species]() { return Array; } 
} 
var a = new MyCoolArray( 1, 2, 3 ), 
  b = a.map( function(v){ return v * 2; } ); 
b instanceof MyCoolArray; // false 
b instanceof Array; // true
```

```js
class Foo { 
  // 推迟species为子构造器
  static get [Symbol.species]() { return this; } 
  spawn() { 
    return new this.constructor[Symbol.species](); 
  } 
} 
class Bar extends Foo { 
  // 强制species为父构造器
  static get [Symbol.species]() { return Foo; } 
} 
var a = new Foo(); 
var b = a.spawn(); 
b instanceof Foo; // true 
var x = new Bar(); 
var y = x.spawn(); 
y instanceof Bar; // false 
y instanceof Foo; // true
```

父类 Symbol.species 通过 return this 来延迟到子类，就像通常期望的那样。然后 Bar 覆盖手动声明使用 Foo 来进行实例创建。当然，子类仍然可以使用 new this.constructor(..) 来创建自身的实例。

### 异步流控制

JavaScript管理异步的主要机制一直以来都是函数回调。

- 如果调用 reject(..)，这个 promise 被拒绝，如果有任何值传给 reject(..)，这个值就被设置为拒绝的原因值。
- 如果调用 resolve(..) 且没有值传入，或者传入任何非 promise 值，这个 promise 就完成。
- 如果调用 resove(..) 并传入另外一个 promise，这个 promise 就会采用传入的 promise的状态（要么实现要么拒绝）——不管是立即还是最终。

```js
step1() 
.then( 
  step2, 
  step2Failed 
) 
.then( 
  function(msg) { 
    return Promise.all( [ 
      step3a( msg ), 
      step3b( msg ), 
      step3c( msg ) 
    ] ) 
  } 
) 
.then(step4);
```

生成器可以 yield 一个 promise，然后这个 promise 可以被绑定，用其完成值来恢复这个生成器的运行。

```js
function *main() { 
  var ret = yield step1(); 
  try { 
    ret = yield step2( ret ); 
  } 
  catch (err) { 
    ret = yield step2Failed( err ); 
  } 
  // 特别是由于 try..catch 出错处理可以跨过这些隐藏的异步边界。
  ret = yield Promise.all( [ 
    step3a( ret ), 
    step3b( ret ), 
    step3c( ret ) 
  ] ); 
  yield step4( ret ); 
}


run( main ) 
.then( 
  function fulfilled(){ 
    // *main()成功完成
  }, 
  function rejected(reason){ 
    // 哎呀，出错了
  } 
);
```

这种“yield 一个 promise 来恢复生成器”的模式将会成为一个常用模式，这个模式非常强大，下一个版本的 JavaScript 几乎肯定会引入一个新的函数类型来自动执行这种模式而无需 run 工具: async function

### 集合

- Map 就像是一个对象（键 / 值对），但是键值并非只能为字符串，而是可以使用任何值——甚至是另一个对象或 map ！
- Set 与数组（值的序列）类似，但是其中的值是唯一的；如果新增的值是重复的，就会被忽略。
- 相应的弱（与内存 / 垃圾回收相关）版本：WeakMap 和 WeakSet。

介绍：

- TypedArray

把称为“类型数组”这样的特性想象为一个特定类型的值构成的数组，比如一个只有字符串构成的数组

但实际上带类型的数组更多是为了使用类数组语义（索引访问等）结构化访问二进制数据。名称中的“type( 类型 )”是指看待一组位序列的“视图”，本质上就是一个映射，比如是把这些位序列映射为 8 位有符号整型数组还是 16 位有符号整型数组，等等。

如何构建这样的位集合呢？这称为一个“buffer”，最直接的方法是通过 ArrayBuffer(..)构造器来构造：

```js
var buf = new ArrayBuffer( 32 ); 
buf.byteLength; // 32
```

现在 buf 就是一个二进制 buffer，长为 32 字节（256 位），预先初始化全部为 0。一个buffer 本身除了查看它的 byteLength 属性外，并不真正支持任何其他交互。

而在这个数组 buffer 之上，可以放置一个“视图”，这个视图以类型数组的形式存在。考虑：

```js
var arr = new Uint16Array( buf ); 
arr.length; // 16
```

arr 是在这个 256 位 buf 上映射的一个 16 位无符号整型的类型数组，也就是说你得到了 16个元素。

理解下面这点很重要：arr 的映射是按照运行 JavaScript 的平台的大小端设置（大端或小端）进行的。如果二进制数据的构造是基于某个大小端配置，而解释平台的大小端配置正相反，那么这就成了一个问题。

大小端的意思是多字节数字（比如前面代码片段中创建的 16 位无符号整型）中的低字节（8 位）位于这个数字字节表示中的右侧还是左侧。

举个例子，设想一个十进制数字 3085，我们需要用 16 位来表示它。如果只是用一个 16 位数字容器，不管大小端配置如何，它会被表示为二进制 0000110000001101（十六进制 0c0d）。

但是如果用两个 8 位数组表示数字 3085，那么大小端设置就会明显影响它在内存中的存储表示：

- 0000110000001101 / 0c0d（大端）
- 0000110100001100 / 0d0c ( 小端）

如果接收到一个来自于小端系统的表示 3085 的位序列 0000110100001100，而在大端系统中为其建立视图，得到的值将是 3340（十进制）或者 0d0c（十六进制）。

目前 Web 上最常用的是小端表示方式，但是肯定存在不采用这种方式的浏览器。了解一块二进制数据生产方和消费方的大小端属性是很重要的。

根据 MDN，这里有一个快速检测 JavaScript 大小端的方法：

```js
var littleEndian = (function() { 
  var buffer = new ArrayBuffer( 2 ); 
  new DataView( buffer ).setInt16( 0, 256, true ); 
  return new Int16Array( buffer )[0] === 256; 
})();
```

littleEndian 的结果可能是 true 也可能是 false，对于多数浏览器来说，它应该会返回true。这个测试方法使用了 DataView(..)，此方法比在 buffer 上建立的视图访问（getting/setting）位提供了更底层、更小粒度的控制方法。前面代码片段中 setInt16(..) 方法的第三个参数是用来通知 DataView 要使用哪种大小端配置来操作。

> 不要把数组 buffer 的底层二进制存储的大小端和给定数字在 JavaScript 程序中如何表示搞混。比如，(3085).toString(2) 返回 "110000001101"，加上前面 4 个隐去的 "0" 看起来似乎是大端表示。实际上，这个表示法是基于 16位视图，而不是两个 8 位字节的表示。要确定 JavaScript 环境的大小端，最好的方法就是前面的 DataView 测试。

单个 buffer 可以关联多个视图，比如：

```js
var buf = new ArrayBuffer( 2 ); 
var view8 = new Uint8Array( buf ); 
var view16 = new Uint16Array( buf ); 
view16[0] = 3085; 
view8[0]; // 13 
view8[1]; // 12 
view8[0].toString( 16 ); // "d" 
view8[1].toString( 16 ); // "c" 
// 交换（就像大小端变换一样！）
var tmp = view8[0]; 
view8[0] = view8[1]; 
view8[1] = tmp; 
view16[0]; // 3340
```

这个带类数组构造器有多个签名变体。目前我们展示的情况都是传入已经存在的 buffer。然而这种形式还接受两个额外参数：byteOffset 和 length。换句话说，可以从非 0 的位置开始带类型数组视图，也可以不消耗整个 buffer 长度。

如果二进制数据的 buffer 包含的数据格式大小 / 位置不均匀，这种技术是非常有用的。

举例来说，考虑一个二进制 buffer，在它的起始位置有一个 2 字节数字（也就是“字”），接着是两个 1 字节数字，然后是一个 32 位浮点数。这展示了如何通过在同一个 buffer 建立多个视图，从不同的位置，以不同长度访问这个数据：

```js
var first = new Uint16Array( buf, 0, 2 )[0], 
  second = new Uint8Array( buf, 2, 1 )[0], 
  third = new Uint8Array( buf, 3, 1 )[0], 
  fourth = new Float32Array( buf, 4, 4 )[0];
```

除了前面一节中展示的 (buffer,[offset, [length]]) 形式，带类数组构造器还支持以下这些形式。

- [constructor\](length)：在一个新的长度为 length 字节的 buffer 上创建一个新的视图。
- [constructor\](typedArr)：创建一个新的视图和 buffer，把 typeArr 视图的内容复制进去。
- [constructor\](obj)：创建一个新的视图和 buffer，并在类数组或对象 obj 上迭代复制其内容。

ES6 提供了下面这些带类数组构造器：

- Int8Array（8 位有符号整型），Uint8Array（8 位无符号整型）——Uint8ClampedArray（8 位无符号整型，每个值会被强制设置为在 0-255 内）；
- Int16Array（16 位有符号整型）, Uint16Array（16 位无符号整型）；
- Int32Array（32 位有符号整型）, Uint32Array（32 位无符号整型）；
- Float32Array（32 位浮点数， IEEE-754）；
- Float64Array（64 位浮点数， IEEE-754）。

带类数组构造器的实例几乎和普通原生数组完全一样。一些区别包括具有固定的长度以及值都属于某种“类型”。然而，它们的 prototype 方法几乎完全一样。因此，很可能可以把它们当作普通数组使用而无需转换。

```js
var a = new Int32Array( 3 ); 
a[0] = 10; 
a[1] = 20; 
a[2] = 30; 
a.map( function(v){ 
 console.log( v ); 
} ); 
// 10 20 30 
a.join( "-" ); 
// "10-20-30"
```

> 不能对 TypedArray 使用不合理的 Array.prototype 方 法， 比 如 修 改 器(splice(..)、push(..) 等）和 concat(..)。

要清楚 TypedArray 中的元素是限制在声明的位数大小中的。如果视图给一个 Uint8Array的某个元素赋值为大于 8 位的值，这个值会被折回（wrap around）来适应其位宽。

这可能会引起问题，比如，如果你要把 TypedArray 中的值平方。考虑：

```js
var a = new Uint8Array( 3 ); 
a[0] = 10; 
a[1] = 20; 
a[2] = 30; 
var b = a.map( function(v){ 
 return v * v; 
} ); 
b; // [100, 144, 132]
```

对于值 20 和 30，平方值就会溢出。要解决这样的局限，可以使用 TypedArray#from(..)函数：

```js
var a = new Uint8Array( 3 ); 
a[0] = 10; 
a[1] = 20; 
a[2] = 30; 
var b = Uint16Array.from( a, function(v){ 
 return v * v; 
} ); 
b; // [100, 400, 900]
```

还有很有趣的一点要考虑，与普通数组一样，TypedArray 也有一个 sort(..) 方法，但是这个方法默认使用数字排序方法，而不是强制转换为字符串之后进行字母序比较 。举例来说：

```js
var a = [ 10, 1, 2, ]; 
a.sort(); // [1,10,2] 
var b = new Uint8Array( [ 10, 1, 2 ] ); 
b.sort(); // [1,2,10]
```

就像 Array#sort(..) 一样，TypedArray#sort(..) 接受了一个可选比较函数参数，它们的工作方式也是完全一样的。

TypedArray 提供了对二进制数据 buffer 的各种整型类型“视图”，比如 8 位无符号整型和32 位浮点型。对二进制数据的数组访问使得运算更容易表达和维护，从而可以更容易操纵视频、音频、canvas 数据等这样的复杂数据。

- Map

```js
var m = {}; 
var x = { id: 1 }, 
  y = { id: 2 }; 
m[x] = "foo"; 
m[y] = "bar"; 
m[x]; // "bar" 
m[y]; // "bar"
```

x 和 y 两个对象字符串化都是 "[object Object]"，所以 m 中只设置了一个键。

```js
var m = new Map(): 
var x = { id: 1 }, 
  y = { id: 2 }; 
m.set( x, "foo" ); 
m.set( y, "bar" ); 
m.get( x ); // "foo" 
m.get( y ); // "bar"
```

这里唯一的缺点就是不能使用方括号 [ ] 语法设置和获取值，但完全可以使用 get(..) 和set(..) 方法完美代替。

要从 map 中删除一个元素，不要使用 delete 运算符，而是要使用 delete() 方法：

```js
m.set( x, "foo" ); 
m.set( y, "bar" ); 
m.delete( y );
```

你可以通过 clear() 清除整个 map 的内容。要得到 map 的长度（也就是键的个数），可以使用 size 属性（而不是 length）：

```js
m.set( x, "foo" ); 
m.set( y, "bar" ); 
m.size; // 2 
m.clear(); 
m.size; // 0
```

Map(..) 构造器也可以接受一个 iterable（参见 3.1 节），这个迭代器必须产生一列数组，每个数组的第一个元素是键，第二个元素是值。这种迭代的形式和 entries() 方法产生的形式是完全一样的，下一小节将会介绍。这使得创建一个 map 的副本很容易：

```js
var m2 = new Map( m.entries() ); 
// 等价于：
var m2 = new Map( m );
```

因为 map 的实例是一个 iterable，它的默认迭代器与 entries() 相同，所以我们更推荐使用后面这个简短的形式。

当然，也可以在 Map(..) 构造器中手动指定一个项目（entry）列表（键 / 值数组的数组）：

```js
var x = { id: 1 }, 
  y = { id: 2 }; 
var m = new Map( [ 
  [ x, "foo" ], 
  [ y, "bar" ] 
] ); 
m.get( x ); // "foo" 
m.get( y ); // "bar
```

要从 map 中得到一列值，可以使用 values(..)，它会返回一个迭代器。比如 spread 运算符 ... 和for..of 循环。另外，我们将会详细介绍 Array.from(..) 方法。考虑：

```js
var m = new Map(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
m.set( x, "foo" ); 
m.set( y, "bar" ); 
var vals = [ ...m.values() ]; 
vals; // ["foo","bar"] 
Array.from( m.values() ); // ["foo","bar"]
```

前面一小节介绍过，可以在一个 map 的项目上使用 entries() 迭代（或者默认 map 迭代器）。考虑：

```js
var m = new Map(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
m.set( x, "foo" ); 
m.set( y, "bar" ); 
var vals = [ ...m.entries() ]; 
vals[0][0] === x; // true 
vals[0][1]; // "foo" 
vals[1][0] === y; // true 
vals[1][1]; // "bar"
```

要得到一列键，可以使用 keys()，它会返回 map 中键上的迭代器：

```js
var m = new Map(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
m.set( x, "foo" ); 
m.set( y, "bar" ); 
var keys = [ ...m.keys() ]; 
keys[0] === x; // true 
keys[1] === y; // true
```

要确定一个 map 中是否有给定的键，可以使用 has(..) 方法：

```js
var m = new Map(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
m.set( x, "foo" ); 
m.has( x ); // true 
m.has( y ); // false
```

map 的本质是允许你把某些额外的信息（值）关联到一个对象（键）上，而无需把这个信息放入对象本身。

对于 map 来说，尽管可以使用任意类型的值作为键，但通常我们会使用对象，因为字符串或者其他基本类型已经可以作为普通对象的键使用。换句话说，除非某些或者全部键需要是对象，否则可以继续使用普通对象作为影射，这种情况下 map 才更加合适。

> 如果使用对象作为映射的键，这个对象后来被丢弃（所有的引用解除），试图让垃圾回收（GC）回收其内存，那么 map 本身仍会保持其项目。你需要从 map 中移除这个项目来支持 GC。在下一小节中，我们将会介绍作为对象键和 GC 的更好选择——WeakMap。

Map 是键 - 值对，其中的键不只是字符串 / 原生类型，也可以是对象。

- WeakMap

WeakMap 是 map 的变体，二者的多数外部行为特性都是一样的，区别在于内部内存分配（特别是其 GC）的工作方式。

WeakMap（只）接受对象作为键。这些对象是被弱持有的，也就是说如果对象本身被垃圾回收的话，在 WeakMap 中的这个项目也会被移除。然而我们无法观测到这一点，因为对象被垃圾回收的唯一方式是没有对它的引用了。但是一旦不再有引用，你也就没有对象引用来查看它是否还存在于这个 WeakMap 中了。

除此之外，WeakMap 的 API 是类似的，尽管要更少一些：

```js
var m = new WeakMap(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
m.set( x, "foo" ); 
m.has( x ); // true 
m.has( y ); // false
```

WeakMap 没有 size 属性或 clear() 方法，也不会暴露任何键、值或项目上的迭代器。所以即使你解除了对 x 的引用，它将会因 GC 时这个条目被从 m 中移除，也没有办法确定这一事实。所以你就相信 JavaScript 所声明的吧！

和 Map 一样，通过 WeakMap 可以把信息与一个对象软关联起来。而在对这个对象没有完全控制权的时候，这个功能特别有用，比如 DOM 元素。如果作为映射键的对象可以被删除，并支持垃圾回收，那么 WeakMap 就更是合适的选择了

需要注意的是，WeakMap 只是弱持有它的键，而不是值。考虑：

```js
var m = new WeakMap(); 
var x = { id: 1 }, 
  y = { id: 2 }, 
  z = { id: 3 }, 
  w = { id: 4 }; 
m.set( x, y ); 
x = null; // { id: 1 } 可GC 
y = null; // { id: 2 } 可GC 
 // 只因 { id: 1 } 可GC 
m.set( z, w ); 
w = null; // { id: 4 } 不可GC
```

因此，我认为 WeakMap 更应该叫作“Weak-KeyMap”。

WeakMap 也是 map，其中的键（对象）是弱持有的，因此当它是对这个对象的最后一个引用的时候，GC（垃圾回收）可以回收这个项目。

- Set

set 是一个值的集合，其中的值唯一（重复会被忽略）。

set 的 API 和 map 类似。只是 add(..) 方法代替了 set(..) 方法（某种程度上说有点讽刺），没有 get(..) 方法。

```js
var s = new Set(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
s.add( x ); 
s.add( y ); 
s.add( x ); 
s.size; // 2 
s.delete( y ); 
s.size; // 1 
s.clear(); 
s.size; // 0
```

Set(..) 构造器形式和 Map(..) 类似，都可以接受一个 iterable，比如另外一个 set 或者仅仅是一个值的数组。但是，和 Map(..) 接受项目（entry）列表（键 / 值数组的数组）不同，Set(..) 接受的是值（value）列表（值的数组）：

```js
var x = { id: 1 }, 
  y = { id: 2 }; 
var s = new Set( [x,y] );
```

set 不需要 get(..) 是因为不会从集合中取一个值，而是使用 has(..) 测试一个值是否存在：

```js
var s = new Set(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
s.add( x ); 
s.has( x ); // true 
s.has( y ); // false
```

除了会把 -0 和 0 当作是一样的而不加区别之外，has(..) 中的比较算法和Object.is(..) 几乎一样

set 的迭代器方法和 map 一样。对于 set 来说，二者行为特性不同，但它和 map 迭代器的行为是对称的。考虑：

```js
var s = new Set(); 
var x = { id: 1 }, 
  y = { id: 2 }; 
s.add( x ).add( y ); 
var keys = [ ...s.keys() ], 
  vals = [ ...s.values() ], 
  entries = [ ...s.entries() ]; 
keys[0] === x; 
keys[1] === y; 
vals[0] === x; 
vals[1] === y; 
entries[0][0] === x; 
entries[0][1] === x; 
entries[1][0] === y; 
entries[1][1] === y;
```

keys() 和 values() 迭代器都从 set 中 yield 出一列不重复的值。entries() 迭代器 yield 出一列项目数组，其中的数组的两个项目都是唯一 set 值。set 默认的迭代器是它的 values()迭代器。

set 固有的唯一性是它最有用的特性。举例来说：

```js
var s = new Set( [1,2,3,4,"1",2,4,"5"] ), 
  uniques = [ ...s ]; 
uniques; // [1,2,3,4,"1","5"]
```

set 的唯一性不允许强制转换，所以 1 和 "1" 被认为是不同的值。

Set 是成员值（任意类型）唯一的列表。

- WeakSet

就像 WeakMap 弱持有它的键（对其值是强持有的）一样，WeakSet 对其值也是弱持有的（这里并没有键）：

```js
var s = new WeakSet(); 
var x = { id: 1 }, 
 y = { id: 2 }; 
s.add( x ); 
s.add( y ); 
x = null; // x可GC 
y = null; // y可GC
```

> WeakSet 的值必须是对象，而并不像 set 一样可以是原生类型值。

WeakSet 也是 set，其中的值是弱持有的，也就是说如果其中的项目是对这个对象最后一个引用的时候，GC 可以移除它。

### 新增API

- Array

Array.of(..) 取代了 Array(..) 成为数组的推荐函数形式构造器，因为 Array.of(..) 并没有这个特殊的单个数字参数的问题。考虑：

```js
var a = Array( 3 ); 
a.length; // 3 
a[0]; // undefined 
var b = Array.of( 3 ); 
b.length; // 1 
b[0]; // 3 
var c = Array.of( 1, 2, 3 ); 
c.length; // 3 
c; // [1,2,3]
```

- 如果你有一个回调函数需要传入的参数封装为数组，Array.of(..) 可以完美解决这个需求。
- 如果你构建 Array 的子类，并且想要在你的子类实例中创建和初始化元素，

```js
class MyCoolArray extends Array { 
  sum() { 
    return this.reduce( function reducer(acc,curr){ 
      return acc + curr; 
    }, 0 ); 
  } 
} 
var x = new MyCoolArray( 3 ); 
x.length; // 3--oops! 
x.sum(); // 0--oops! 
var y = [3]; // Array, 而不是MyCoolArray 
y.length; // 1 
y.sum(); // sum不是一个函数
var z = MyCoolArray.of( 3 ); 
z.length; // 1 
z.sum(); // 3
```

你不能（简单地）只是为 MyCoolArray 创建一个构造器来覆盖 Array 父构造器的行为，因为那个构造器对于实际构造一个行为符合规范的数组值（初始化 this）是必要的。MyCoolArray 子类“继承来的”静态 of(..) 方法提供了很好的解决方案。

```js
// 类数组转换为真正的数组
// 类数组对象
var arrLike = { 
  length: 3, 
  0: "foo", 
  1: "bar" 
}; 
var arr = Array.prototype.slice.call( arrLike );

// 另外一个常见的任务是使用 slice(..) 来复制产生一个真正的数组：
var arr2 = arr.slice();

// 两种情况下，新的 ES6 Array.from(..) 方法都是更好理解、更优雅、更简洁的替代方法：
var arr = Array.from( arrLike ); 
var arrCopy = Array.from( arr );
```

Array.from(..) 检查第一个参数是否为 iterable（参见 3.1 节），如果是的话，就使用迭代器来产生值并“复制”进入返回的数组。因为真正的数组有一个这些值之上的迭代器，所以会自动使用这个迭代器。

而如果你把类数组对象作为第一个参数传给 Array.from(..)，它的行为方式和 slice()（没有参数）或者 apply(..) 是一样的，就是简单地按照数字命名的属性从 0 开始直到length 值在这些值上循环。

```js
var arrLike = { 
  length: 4, 
  2: "foo" 
}; 
Array.from( arrLike ); 
// [ undefined, undefined, "foo", undefined ]
```

因为位置 0、1 和 3 在 arrLike 上并不存在，所以在这些位置上是 undefined 值。

```js
var emptySlotsArr = []; 
emptySlotsArr.length = 4; 
emptySlotsArr[2] = "foo"; 
Array.from( emptySlotsArr ); 
// [ undefined, undefined, "foo", undefined ]
```

前面代码中的 emptySlotArr 和 Array.from(..) 调用的结果有一个微妙但重要的区别。也就是 Array.from(..) 永远不会产生空槽位。

```js
// 在 ES6 之前，如果你想要产生一个初始化为某个长度，在每个槽位上都是真正的undefined 值（不是空槽位！）的数组，不得不做额外的工作：
var a = Array( 4 ); 
// 4个空槽位！
var b = Array.apply( null, { length: 4 } ); 
// 4个undefined值

// 而现在 Array.from(..) 使其简单了很多：
var c = Array.from( { length: 4 } ); 
// 4个undefined值
```

Array.from(..) 工具还有另外一个有用的技巧。如果提供了的话，第二个参数是一个映射回调（和一般的 Array#map(..) 所期望的几乎一样），这个函数会被调用，来把来自于源的每个值映射 / 转换到返回值。

```js
var arrLike = { 
  length: 4, 
  2: "foo" 
}; 
Array.from( arrLike, function mapper(val,idx){ 
  if (typeof val == "string") { 
    return val.toUpperCase(); 
  } 
  else { 
    return idx; 
  } 
} ); 
// [ 0, 1, "FOO", 3 ]
```

> 和其他接收回调的数组方法一样，Array.from(..) 接收一个可选的第三个参数，如果设置了的话，这个参数为作为第二个参数传入的回调指定 this 绑定。否则，this 将会是 undefined。

```js
class MyCoolArray extends Array { 
  .. 
} 
MyCoolArray.from( [1, 2] ) instanceof MyCoolArray; // true 
Array.from( 
  MyCoolArray.from( [1, 2] ) 
) instanceof MyCoolArray; // false
```

of(..) 和 from(..) 都使用访问它们的构造器来构造数组。所以如果使用基类 Array.of(..)，那么得到的就是 Array 实例；如果使用 MyCoolArray.of(..)，那么得到的就是MyCoolArray 实例。

我们介绍了 @@species 设置，所有的内置类（比如 Array）都有定义，任何创建新实例的原型方法都会使用它。slice(..) 是一个很好的例子：

```js
var x = new MyCoolArray( 1, 2, 3 ); 
x.slice( 1 ) instanceof MyCoolArray; // true
```

一般来说，默认的行为方式很可能就是需要的，但就像我们在第 3 章中介绍的，必要的话也可以覆盖它：

```js
class MyCoolArray extends Array { 
  // 强制species为父构造器
  static get [Symbol.species]() { return Array; } 
} 
var x = new MyCoolArray( 1, 2, 3 ); 
x.slice( 1 ) instanceof MyCoolArray; // false 
x.slice( 1 ) instanceof Array; // true
```

需要注意的是，@@species 设置只用于像 slice(..) 这样的原型方法。of(..) 和 from(..)不会使用它；它们都只使用 this 绑定（由使用的构造器来构造其引用）。

```js
class MyCoolArray extends Array { 
  // 强制species为父构造器
  static get [Symbol.species]() { return Array; } 
} 
var x = new MyCoolArray( 1, 2, 3 ); 
MyCoolArray.from( x ) instanceof MyCoolArray; // true 
MyCoolArray.of( [2, 3] ) instanceof MyCoolArray; // true
```

Array#copyWithin(..) 是一个新的修改器方法，所有数组都支持。copyWithin(..) 从一个数组中复制一部分到同一个数组的另一个位置，覆盖这个位置所有原来的值。

参数是 target（要复制到的索引）、start（开始复制的源索引，包括在内）以及可选的 end（复制结束的不包含索引）。如果任何一个参数是负数，就被当作是相对于数组结束的相对值。

```js
[1,2,3,4,5].copyWithin( 3, 0 ); // [1,2,3,1,2] 
[1,2,3,4,5].copyWithin( 3, 0, 1 ); // [1,2,3,1,5] 
[1,2,3,4,5].copyWithin( 0, -2 ); // [4,5,3,4,5] 
[1,2,3,4,5].copyWithin( 0, -2, -1 ); // [4,2,3,4,5]
```

就像前面代码片段展示的，copyWithin(..) 方法不会增加数组的长度。到达数组结尾复制就会停止。

与你想象的正相反，复制并非总是从左到右（索引递增）进行的。如果源范围和目标范围重叠的话，可能会出现重复复制已经复制的值，而这可能并非你想要的结果。所以，内部算法通过反向复制避免了这种情况。

```js
[1,2,3,4,5].copyWithin( 2, 1 ); // ???
```

如果算法严格按照从左到右来移动，那么 2 应该被复制来覆盖 3，然后这个被复制的 2 应该被复制来覆盖 4，然后这个被复制的 2 应该被复制来覆盖 5，而你最终会得到 [1,2,2,2,2]。

而实际上，复制算法会反向进行，复制 4 来覆盖 5，然后复制 3 来覆盖 4，然后复制 2 来覆盖 3，最后的结果是 [1,2,2,3,4]。根据期望来说，这可能是更“正确”的结果，但如果只考虑简单的从左到右方式的复制算法，你可能会觉得很迷惑。

可以通过 ES6 原生支持的方法 Array#fill(..) 用指定值完全（或部分）填充已存在的数组：

```js
var a = Array( 4 ).fill( undefined ); 
a; 
// [undefined,undefined,undefined,undefined]
```

fill(..) 可选地接收参数 start 和 end，它们指定了数组要填充的子集位置，比如：

```js
var a = [ null, null, null, null ].fill( 42, 1, 3 ); 
a; // [null,42,42,null]
```

一般来说，在数组中搜索一个值的最常用方法一直是 indexOf(..) 方法，这个方法返回找到值的索引，如果没有找到就返回 -1：

```js
var a = [1,2,3,4,5]; 
(a.indexOf( 3 ) != -1); // true 
(a.indexOf( 7 ) != -1); // false 
(a.indexOf( "2" ) != -1); // false
```

相比之下，indexOf(..) 需要严格匹配 ===，所以搜索 "2" 不会找到值 2，反之也是如此。indexOf(..) 的匹配算法无法覆盖，而且要手动与值 -1 进行比较也很麻烦 / 笨拙。

```js
var a = [1,2,3,4,5]; 
a.some( function matcher(v){ 
  return v == "2"; 
} ); // true 
a.some( function matcher(v){ 
  return v == 7; 
} ); // false
```

但这种方式的缺点是如果找到匹配的值的时候，只能得到匹配的 true/false 指示，而无法得到真正的匹配值本身。

ES6 的 find(..) 解决了这个问题。基本上它和 some(..) 的工作方式一样，除了一旦回调返回 true/ 真值，会返回实际的数组值：

```js
var a = [1,2,3,4,5]; 
a.find( function matcher(v){ 
  return v == "2"; 
} ); // 2 
a.find( function matcher(v){ 
  return v == 7; // undefined 
});
```

通过自定义 matcher(..) 函数也可以支持比较像对象这样的复杂值：

```js
var points = [ 
  { x: 10, y: 20 }, 
  { x: 20, y: 30 }, 
  { x: 30, y: 40 }, 
  { x: 40, y: 50 }, 
  { x: 50, y: 60 } 
]; 
points.find( function matcher(point) { 
  return ( 
    point.x % 3 == 0 && 
    point.y % 4 == 0 
  ); 
} ); // { x: 30, y: 40 }
```

> 就像其他接受回调的数组方法一样，find(..) 接受一个可选的第二个参数，如果设定这个参数就绑定到第一个参数回调的 this。否则，this 就是undefined。

前面一小节展示了 some(..) 如何 yield 出一个布尔型结果用于在数组中搜索，以及find(..) 如何从数组搜索 yield 出匹配的值本身，另外，还需要找到匹配值的位置索引。

indexOf(..) 会提供这些，但是无法控制匹配逻辑；它总是使用 === 严格相等。所以 ES6的 findIndex(..) 才是解决方案：

```js
var points = [ 
  { x: 10, y: 20 }, 
  { x: 20, y: 30 }, 
  { x: 30, y: 40 }, 
  { x: 40, y: 50 }, 
  { x: 50, y: 60 } 
]; 
points.findIndex( function matcher(point) { 
  return ( 
    point.x % 3 == 0 && 
    point.y % 4 == 0 
  ); 
} ); // 2 
points.findIndex( function matcher(point) { 
  return ( 
    point.x % 6 == 0 && 
    point.y % 7 == 0 
  ); 
} ); // -1
```

不要使用 findIndex(..) != -1（这是 indexOf(..) 的惯用法）从搜索中得到布尔值，因为 some(..) 已经 yield 出你想要的 true/false。也不要用 a[ a.findIndex(..) ] 来得到匹配值，因为这是 find(..) 所做的事。最后，如果需要严格匹配的索引值，那么使用indexOf(..)；如果需要自定义匹配的索引值，那么使用 findIndex(..)。

> 就像其他接收回调的数组方法一样，findIndex(..) 接收一个可选的第二个参数，如果设定这个参数就绑定到第一个参数回调的 this。否则，this 就是undefined。

因为 Array 对于 ES6 来说已经不是新的了，所以从传统角度来说，它可能不会被看作是“集合”，但是它提供了同样的迭代器方法 entries()、values() 和 keys()，从这个意义上说，它是一个集合。

```js
var a = [1,2,3]; 
[...a.values()]; // [1,2,3] 
[...a.keys()]; // [0,1,2] 
[...a.entries()]; // [ [0,1], [1,2], [2,3] ] 
[...a[Symbol.iterator]()]; // [1,2,3]
```

就像 Set 一样，默认的 Array 迭代器和 values() 返回的值一样。

我们将展示 Array.from(..) 如何把数组中的空槽位看作值为undefined 的槽位。这实际上是因为在底层数组迭代器是这样工作的：

```js
var a = []; 
a.length = 3; 
a[1] = 2; 
[...a.values()]; // [undefined,2,undefined] 
[...a.keys()]; // [0,1,2] 
[...a.entries()]; // [ [0,undefined], [1,2], [2,undefined] ]
```

- Object

静态函数 Object.is(..) 执行比 === 比较更严格的值比较。

Object.is(..) 调用底层 SameValue 算法。SameValue 算法基本上和 === 严格相等比较算法一样（ES6 规范，7.2.13 节），但有两个重要的区别。

```js
var x = NaN, y = 0, z = -0; 
x === x; // false 
y === z; // true 
Object.is( x, x ); // true 
Object.is( y, z ); // false
```

你应该继续使用 === 进行严格相等比较；不应该把 Object.is(..) 当作这个运算符的替代。但是，如果需要严格识别 NaN 或者 -0 值，那么应该选择 Object.is(..)。

> ES6 还新增了一个 Number.isNaN(..) 工具（本章后面会介绍），这个工具可能是更方便的检查工具；与 Object.is(x,NaN) 相比，你可能更喜欢 Number.isNaN(x)。你可以使用 x == 0 && 1 / x === -Infinity 这种笨拙的方式精确判断 -0 值，但这种情况下使用 Object.is(x,-0) 会好很多。

Symbol 很 可 能 会 成 为 对 象 最 常 用 的 特 殊（ 元 ） 属 性。 所 以 引 入 了 工 具 ObgetOwnPropertySymbols(..)，它直接从对象上取得所有的符号属性：

```js
var o = { 
  foo: 42, 
  [ Symbol( "bar" ) ]: "hello world", 
  baz: true 
}; 
Object.getOwnPropertySymbols( o ); // [ Symbol(bar) ]
```

我们提到工具 Object.setPrototypeOf(..)，这个工具（不出人意料地）设置对象的 [[Prototype]] 用于行为委托

```js
var o1 = { 
  foo() { console.log( "foo" ); } 
}; 
var o2 = { 
  // .. o2的定义 .. 
}; 
Object.setPrototypeOf( o2, o1 ); 
// 委托给o1.foo() 
o2.foo(); // foo

// 也可以：
var o1 = { 
  foo() { console.log( "foo" ); } 
}; 
var o2 = Object.setPrototypeOf( { 
  // .. o2的定义 .. 
}, o1 ); 
// 委托给o1.foo() 
o2.foo(); // foo
```

前面两段代码中，o2 和 o1 的关系都出现在 o2 定义的结尾处。更通俗地说，o2 和 o1 的关系在 o2 的定义上指定，就像类一样，也和字面值对象中的 __proto__ 一样

ES6 新增了 Object.assign(..)，这是这些算法的简化版本。第一个参数是 target，其他传入的参数都是源，它们将按照列出的顺序依次被处理。对于每个源来说，它的可枚举和自己拥有的（也就是不是“继承来的”）键值，包括符号都会通过简单 = 赋值被复制。Object.assign(..) 返回目标对象。

```js
var target = {}, 
  o1 = { a: 1 }, o2 = { b: 2 }, 
  o3 = { c: 3 }, o4 = { d: 4 }; 
// 设定只读属性
Object.defineProperty( o3, "e", { 
  value: 5, 
  enumerable: true, 
  writable: false, 
  configurable: false
} ); 
// 设定不可枚举属性
Object.defineProperty( o3, "f", { 
  value: 6, 
  enumerable: false
} ); 
o3[ Symbol( "g" ) ] = 7; 
// 设定不可枚举符号
Object.defineProperty( o3, Symbol( "h" ), { 
  value: 8, 
  enumerable: false
} ); 
Object.setPrototypeOf( o3, o4 );
```

只有属性 a、b、c、e 以及 Symbol("g") 会被复制到 target 中：

```js
Object.assign( target, o1, o2, o3 ); 
target.a; // 1 
target.b; // 2 
target.c; // 3 
Object.getOwnPropertyDescriptor( target, "e" ); 
// { value: 5, writable: true, enumerable: true, 
// configurable: true } 
Object.getOwnPropertySymbols( target ); 
// [Symbol("g")]
```

复制过程会忽略属性 d、f 和 Symbol("h")；不可枚举的属性和非自有的属性都被排除在赋值过程之外。另外，e 作为一个普通属性赋值被复制，而不是作为只读属性复制。

在前面一节中，我们展示了使用 setPrototypeOf(..) 设定对象 o2 和 o1 之间的 [[Prototype]]关系。还有另外一种应用了 Object.assign(..) 的形式：

```js
var o1 = { 
  foo() { console.log( "foo" ); } 
}; 
var o2 = Object.assign( 
  Object.create( o1 ), 
  { 
    // .. o2的定义 .. 
  } 
); 
// 委托给o1.foo() 
o2.foo(); // foo
```

- Math

三角函数：
- cosh(..) 双曲余弦函数
- acosh(..) 双曲反余弦函数
- sinh(..) 双曲正弦函数
- asinh(..) 双曲反正弦函数
- tanh(..) 双曲正切函数
- atanh(..) 双曲反正切函数
- hypot(..) 平方和的平方根（也即：广义勾股定理）

算术：
- cbrt(..) 立方根
- clz32(..) 计算 32 位二进制表示的前导 0 个数
- expm1(..) 等价于 exp(x) - 1
- log2(..) 二进制对数（以 2 为底的对数）
- log10(..) 以 10 为底的对数
- log1p(..) 等价于 log(x + 1)
- imul(..) 两个数字的 32 位整数乘法

元工具：
- sign(..) 返回数字符号
- trunc(..)返回数字的整数部分
- fround(..) 向最接近的 32 位（单精度）浮点值取整

结束
- Number

Number.parseInt(..) 和 Number.parseFloat(..)

- Number.EPSILON -任意两个值之间的最小差：2^-52
- Number.MAX_SAFE_INTEGER -JavaScript 可以用数字值无歧义“安全”表达的最大整数：2^53 - 1
- Number.MIN_SAFE_INTEGER -JavaScript 可以用数字值无歧义“安全”表达的最小整数：-(2^53 - 1) 或 (-2)^53 + 1

Number.isNaN(..)

```js
var a = NaN, b = "NaN", c = 42; 
isNaN( a ); // true 
isNaN( b ); // true--oops! 
isNaN( c ); // false 
Number.isNaN( a ); // true 
Number.isNaN( b ); // false--修正了! 
Number.isNaN( c ); // false
```

```js
var a = NaN, b = Infinity, c = 42; 
Number.isFinite( a ); // false 
Number.isFinite( b ); // false 
Number.isFinite( c ); // true
```

标准的全局 isFinite(..) 会对参数进行强制类型转换，但是 Number.isFinite(..) 会略去这种强制行为：

```js
var a = "42"; 
isFinite( a ); // true 
Number.isFinite( a ); // false
```

Number.isFinite(+x)，它会在传入之前显式地把 x 强制转换为数字

JavaScript 的数字值永远都是浮点数（IEE-754）。所以确定数字是否为“整型”的概念并不是检查其类型，因为 JavaScript 并没有这样区分。

相反，你需要检查这个值的小数部分是否非 0。最简单的实现方法通常是：

```js
x === Math.floor( x );
```

ES6 新增了一个辅助工具 Number.isInteger(..) ，这个工具可能会更有效地确定这个性质：

```js
Number.isInteger( 4 ); // true 
Number.isInteger( 4.2 ); // false
```

> 在 JavaScript 中，4、4.、4.0 或者 4.0000 之间并没有区别。所有这些都会被当作“整型”并且从 Number.isInteger(..) 中返回 true。

另外，Number.isInteger(..) 会过滤掉 x === Math.floor(x) 可能会搞混的明显非整数值 ：

```js
Number.isInteger( NaN ); // false 
Number.isInteger( Infinity ); // false
```

使用“整数”工作有时候是一个重要的信息，因为这可能会简化某些类型的算法。JavaScript 代码本身不会因为只使用整数而运行得更快，但是，只有在使用整数时，引擎才可以采用优化技术（比如 asm.js)。

基于 Number.isInteger(..) 对 NaN 和 Infinity 值的处理方式，要定义一个 isFloat(..) 工具并不像 !Number.isInteger(..) 那么简单。可能需要做类似于下面这样的事情：

```js
function isFloat(x) { 
  return Number.isFinite( x ) && !Number.isInteger( x ); 
} 
isFloat( 4.2 ); // true 
isFloat( 4 ); // false 
isFloat( NaN ); // false 
isFloat( Infinity ); // false
```

> 看起来可能有点奇怪，但是 Infinity 既不应该被当作整型又不应该被当作浮点型。

ES6 还定义了一个工具 Number.isSafeInteger(..)，这个工具检查一个值以确保其为整数并且在 Number.MIN_SAFE_INTEGER-Number.MAX_SAFE_INTEGER 范围之内（全包含）：

```js
var x = Math.pow( 2, 53 ), 
  y = Math.pow( -2, 53 ); 
Number.isSafeInteger( x - 1 ); // true 
Number.isSafeInteger( y + 1 ); // true 
Number.isSafeInteger( x ); // false 
Number.isSafeInteger( y ); // false
```

- 字符串

详细介绍过 String.fromCodePoint(..)、String#codePointAt(..) 和 String#normalize(..)。新增这些函数是为了提高 JavaScript 字符串值对 Unicode 的支持：

```js
String.fromCodePoint( 0x1d49e ); // " " 
"ab d.codePointAt( 2 ).toString( 16 ); // "1d49e"
```

字符串原型方法 normalize(..) 用于执行 Unicode 规范化，或者把字符用“合并符”连接起来或者把合并的字符解开。

规范化不会对字符串的内容造成可见的效果，但是会改变字符串的内容，这可能会影响像 length 属性的结果，以及通过位置访问字符的方式：

```js
var s1 = "e\u0301"; 
s1.length; // 2 
var s2 = s1.normalize(); 
s2.length; // 1 
s2 === "\xE9"; // true
```

normalize(..) 接受一个可选的参数，来指定要使用的规范化形式。这个参数必须是这几个值之一："NFC" ( 默认 )、"NFD"、"NFKC" 或者 "NFKD"。

String.raw(..)这个函数基本上不会被手动调用，而是与标签模板字面值一起使用：

```js
var str = "bc"; 
String.raw`\ta${str}d\xE9`; 
// "\tabcd\xE9", 而不是" abcdé"
```

在结果字符串中，\ 和 t 是独立的原始字符，而不是转义字符 \t。对于 Unicode 转义序列也是一样。

```js
"foo".repeat( 3 ); // "foofoofoo"
```

除了 ES6 之前的 String#indexOf(..) 和 String#lastIndexOf(..)，又新增了 3 个用于搜索 /检查的新方法：startsWith(..)、endsWidth(..) 和 includes(..)。

```js
var palindrome = "step on no pets"; 
palindrome.startsWith( "step on" ); // true 
palindrome.startsWith( "on", 5 ); // true 
palindrome.endsWith( "no pets" ); // true 
palindrome.endsWith( "no", 10 ); // true 
palindrome.includes( "on" ); // true 
palindrome.includes( "on", 6 ); // false
```

对于所有的字符串搜索 / 检查方法，如果寻找空字符串 ""，总是会在字符串的开头或结尾找到。

> 默认情况下，这些方法不会接受正则表达式用于字符串搜索。对第一个参数执行的 isRegExp 检查的部分。

### 元编程

元编程是指操作目标是程序本身的行为特性的编程。换句话说，它是对程序的编程的编程。

举例来说，如果想要查看对象 a 和另外一个对象 b 的关系是否是 [[Prototype]] 链接的，可以使用 a.isProto type(b)，这是一种元编程形式，通常称为内省（introspection）。另外一个明显的元编程例子是宏（在 JavaScript 中还不支持）——代码在编译时修改自身。用for..in 循环枚举对象的键，或者检查一个对象是否是某个“类构造器”的实例，也都是常见的元编程例子。

元编程关注以下一点或几点：代码查看自身、代码修改自身、代码修改默认语言特性，以此影响其他代码。

元编程的目标是利用语言自身的内省能力使代码的其余部分更具描述性、表达性和灵活性。因为元编程的元（meta）本质，我们有点难以给出比上面提到的更精确的定义。要理解元编程，最好的方法是通过实例来展示。

- 函数名称

```js
var abc = function() { 
  // .. 
}; 
abc.name; // "abc"
```

如果给了这个函数一个词法名称，比如 abc = function def() { .. }，那么 name 属性当然就是 "def"。而如果没有词法名称的话，直觉上看似乎名称为 "abc" 比较合理。

```js
(function(){ .. }); // name: 
(function*(){ .. }); // name: 
window.foo = function(){ .. }; // name: 
class Awesome { 
  constructor() { .. } // name: Awesome 
  funny() { .. } // name: funny 
} 
var c = class Awesome { .. }; // name: Awesome 
var o = { 
  foo() { .. }, // name: foo 
  *bar() { .. }, // name: bar 
  baz: () => { .. }, // name: baz 
  bam: function(){ .. }, // name: bam 
  get qux() { .. }, // name: get qux 
  set fuz() { .. }, // name: set fuz 
  ["b" + "iz"]: 
  function(){ .. }, // name: biz 
  [Symbol( "buz" )]: 
  function(){ .. } // name: [buz] 
}; 
var x = o.foo.bind( o ); // name: bound foo 
(function(){ .. }).bind( o ); // name: bound 
export default function() { .. } // name: default 
var y = new Function(); // name: anonymous 
var GeneratorFunction = 
  function*(){}.__proto__.constructor; 
var z = new GeneratorFunction(); // name: anonymous
```

默认情况下，name 属性不可写，但可配置，也就是说如果需要的话，可使用 Object.defineProperty(..) 来手动修改。

- 元属性

元属性以属性访问的形式提供特殊的其他方法无法获取的元信息。

以 new.target 为例，关键字 new 用作属性访问的上下文。显然，new 本身并不是一个对象，因此这个功能很特殊。而在构造器调用（通过 new 触发的函数 / 方法）内部使用 new.target 时，new 成了一个虚拟上下文，使得 new.target 能够指向调用 new 的目标构造器。

这个是元编程操作的一个明显示例，因为它的目的是从构造器调用内部确定最初 new 的目标是什么，通用地说就是用于内省（检查类型 / 结构）或者静态属性访问。

举例来说，你可能需要在构造器内部根据是直接调用还是通过子类调用采取不同的动作：

```js
class Parent { 
  constructor() { 
    if (new.target === Parent) { 
      console.log( "Parent instantiated" ); 
    } 
    else { 
      console.log( "A child instantiated" ); 
    } 
  } 
} 
class Child extends Parent {} 
var a = new Parent(); 
// Parent instantiated 
var b = new Child(); 
// A child instantiated
```

这里有点微妙，Parent 类定义内部的 constructor() 实际上被给定了类的词法名称（Parent），即使语法暗示这个类是与构造器分立的实体。

- 公开符号

Symbol.iterator 表示任意对象上的一个专门位置（属性），语言机制自动在这个位置上寻找一个方法，这个方法构造一个迭代器来消耗这个对象的值。很多对象定义有这个符号的默认值。

然而，也可以通过定义 Symbol.iterator 属性为任意对象值定义自己的迭代器逻辑，即使这会覆盖默认的迭代器。这里的元编程特性在于我们定义了一个行为特性，供 JavaScript其他部分（也就是运算符和循环结构）在处理定义的对象时使用。

```js
var arr = [4,5,6,7,8,9]; 
for (var v of arr) { 
  console.log( v ); 
} 
// 4 5 6 7 8 9 
// 定义一个只在奇数索引值产生值的迭代器
arr[Symbol.iterator] = function*() { 
  var idx = 1; 
  do { 
    yield this[idx]; 
  } while ((idx += 2) < this.length); 
}; 
for (var v of arr) { 
  console.log( v ); 
} 
// 5 7 9
```

最常见的一个元编程任务，就是在一个值上进行内省来找出它是什么种类，这通常是为了确定其上适合执行何种运算。对于对象来说，最常用的内省技术是 toString() 和 instanceof。

```js
function Foo() {} 
var a = new Foo(); 
a.toString(); // [object Object] 
a instanceof Foo; // true
```

在 ES6 中，可以控制这些操作的行为特性：

```js
function Foo(greeting) { 
  this.greeting = greeting; 
} 
Foo.prototype[Symbol.toStringTag] = "Foo"; 
Object.defineProperty( Foo, Symbol.hasInstance, { 
  value: function(inst) { 
    return inst.greeting == "hello"; 
  } 
} ); 
var a = new Foo( "hello" ), 
  b = new Foo( "world" ); 
b[Symbol.toStringTag] = "cool"; 
a.toString(); // [object Foo] 
String( b ); // [object cool] 
a instanceof Foo; // true 
b instanceof Foo; // false
```

原型（或实例本身）的 @@toStringTag 符号指定了在 [object ___] 字符串化时使用的符串值。

@@hasInstance 符号是在构造器函数上的一个方法，接受实例对象值，通过返回 true 或false 来指示这个值是否可以被认为是一个实例。

> 要在一个函数上设定 @@hasInstance，必须使用 Object.defineProperty(..)，因为 Function.prototype 上默认的那一个是 writable: false（不可写的）

Symbol.species, 我们介绍了符号 @@species，这个符号控制要生成新实例时，类的内置方法使用哪一个构造器。

最常见的例子是，在创建 Array 的子类并想要定义继承的方法（比如 slice(..)）时使用哪一个构造器（是 Array(..) 还是自定义的子类）。默认情况下，调用 Array 子类实例上的 slice(..) 会创建这个子类的新实例，坦白说这很可能就是你想要的。

但是，你可以通过覆盖一个类的默认 @@species 定义来进行元编程：

```js
class Cool { 
  // 把@@species推迟到子类
  static get [Symbol.species]() { return this; } 
  again() { 
    return new this.constructor[Symbol.species](); 
  } 
} 
class Fun extends Cool {} 
class Awesome extends Cool { 
  // 强制指定@@species为父构造器
  static get [Symbol.species]() { return Cool; } 
} 
var a = new Fun(), 
  b = new Awesome(), 
  c = a.again(), 
  d = b.again(); 
c instanceof Fun; // true 
d instanceof Awesome; // false 
d instanceof Cool; // true
```

就像前面代码中 Cool 的定义那样，内置原生构造器上 Symbol.species 的默认行为是return this。在用户类上没有默认值，但是就像展示的那样，这个行为特性很容易模拟。

如果需要定义生成新实例的方法，使用 `new this.constructor[Symbol.species](..)` 模式元编程，而不要硬编码 new this.constructor(..) 或 new XYZ(..)。然后继承类就能够自定义 Symbol.species 来控制由哪个构造器产生这些实例。

Symbol.toPrimitive, 我们讨论了抽象类型转换运算ToPrimitive，它用在对象为了某个操作（比如比较 == 或者相加 +）必须被强制转换为一个原生类型值的时候。在 ES6 之前，没有办法控制这一行为。

而在 ES6 中，在任意对象值上作为属性的符号 @@toPrimitivesymbol 都可以通过指定一个方法来定制这个 ToPrimitive 强制转换。

```js
var arr = [1,2,3,4,5]; 
arr + 10; // 1,2,3,4,510 
arr[Symbol.toPrimitive] = function(hint) { 
  if (hint == "default" || hint == "number") { 
    // 求所有数字之和
    return this.reduce( function(acc,curr){ 
      return acc + curr; 
    }, 0 ); 
  } 
}; 
arr + 10; // 25
```

Symbol.toPrimitive 方法根据调用 ToPrimitive 的运算期望的类型，会提供一个提示（hint）指定 "string"、"number" 或 "default"（这应该被解释为 "number"）。在前面的代码中，加法 + 运算没有提示（传入 "default"）。而乘法 * 运算提示为 "number"，String(arr)提示为 "string"。

> 如果一个对象与另一个非对象值比较，== 运算符调用这个对象上的ToPrimitive 方法时不指定提示——如果有 @@toPrimitive 方法的话，调用时提示为 "default"。但是，如果比较的两个值都是对象，== 的行为和 === 一样，也就是直接比较其引用。这种情况下完全不会调用 @@toPrimitive。

符号 @@isConcatSpreadable 可以被定义为任意对象（比如数组或其他可迭代对象）的布尔型属性（Symbol.isConcatSpreadable），用来指示如果把它传给一个数组的 concat(..) 是否应该将其展开。

```js
var a = [1,2,3], 
  b = [4,5,6]; 
b[Symbol.isConcatSpreadable] = false; 
[].concat( a, b ); // [1,2,3,[4,5,6]]
```

符号 @@unscopables 可以被定义为任意对象的对象属性（Symbol.unscopables），用来指示使用 with 语句时哪些属性可以或不可以暴露为词法变量。

```js
var o = { a:1, b:2, c:3 }, 
  a = 10, b = 20, c = 30; 
o[Symbol.unscopables] = { 
  a: false, 
  b: true, 
  c: false
}; 
with (o) { 
  console.log( a, b, c ); // 1 20 3 
}
```

@@unscopables 对象中的 true 表示这个属性应该是 unscopable 的，因此会从词法作用域变量中被过滤出去。false 表示可以将其包含到词法作用域变量中。

> strict 模式下不允许 with 语句，因此应当被认为是语言的过时特性。不要使用它。因为应该避免使用 with，所以符号 @@unscopables 也没有太大意义。

- 代理

Proxy, 代理是一种由你创建的特殊的对象，它“封装”另一个普通对象——或者说挡在这个普通对象的前面。你可以在代理对象上注册特殊的处理函数（也就是 trap），代理上执行各种操作的时候会调用这个程序。这些处理函数除了把操作转发给原始目标 / 被封装对象之外，还有机会执行额外的逻辑。

你可以在代理上定义的 trap 处理函数的一个例子是 get，当你试图访问对象属性的时候，它拦截 [[Get]] 运算。考虑：

```js
var obj = { a: 1 }, 
  handlers = { 
    get(target,key,context) { 
      // 注意：target === obj, 
      // context === pobj 
      console.log( "accessing: ", key ); 
      return Reflect.get( 
        target, key, context 
      ); 
    } 
  }, 
  pobj = new Proxy( obj, handlers ); 
obj.a; 
// 1 
pobj.a; 
// accessing: a 
// 1
```

我们在 handlers（Proxy(..) 的第二个参数）对象上声明了一个 get(..) 处理函数命名方法，它接受一个 target 对象的引用（obj）、key 属性名 ("a") 粗体文字以及 self/ 接收者 /代理（pobj）。

在跟踪语句 console.log(..) 之后，我们把对 obj 的操作通过 Reflect.get(..)“转发”。下一小节中会介绍 APIReflect，这里只要了解每个可用的代理 trap 都有一个对应的同名Reflect 函数即可。

这里的映射是有意对称的。每个代理处理函数在对应的元编程任务执行的时候进行拦截，而每个 Reflect 工具在一个对象上执行相应的元编程任务。每个代理处理函数都有一个自动调用相应的 Reflect 工具的默认定义。几乎可以确定 Proxy 和 Reflect 总是这么协同工作的。

- get(..) -通过 [[Get]]，在代理上访问一个属性（Reflect.get(..)、. 属性运算符或 [ .. ] 属性运算符）
- set(..) -通过 [[Set]]，在代理上设置一个属性值（Reflect.set(..)、赋值运算符 = 或目标为对象属性的解构赋值）
- deleteProperty(..) -通 过 [[Delete]]， 从 代 理 对 象 上 删 除 一 个 属 性（Reflect.deleteProperty(..) 或delete）
- apply(..)（如果目标为函数） -通 过 [[Call]]，将代理作为普通函数 / 方 法 调 用（Reflect.apply(..)、call(..)、apply(..) 或 (..) 调用运算符）
- construct(..)（如果目标为构造函数） -通过 [[Construct]]，将代理作为构造函数调用（Reflect.construct(..) 或 new）
- getOwnPropertyDescriptor(..) -通过 [[GetOwnProperty]]，从代理中提取一个属性描述符（Object.getOwnPropertyDescriptor(..)或 Reflect.getOwnPropertyDescriptor(..)）
- defineProperty(..) -通过 [[DefineOwnProperty]]，在代理上设置一个属性描述符（Object.defineProperty(..)或 Reflect.defineProperty(..)）
- getPrototypeOf(..) -通 过 [[GetPrototypeOf]]，得到代理的 [[Prototype]]（Object.getPrototypeOf(..)、Reflect.getPrototypeOf(..)、__proto__、Object#isPrototypeOf(..) 或 instanceof）
- setPrototypeOf(..) -通 过 [[SetPrototypeOf]]，设置代理的 [[Prototype]]（Object.setPrototypeOf(..)、Reflect.setPrototypeOf(..) 或 __proto__）
- preventExtensions(..) -通过 [[PreventExtensions]]，使得代理变成不可扩展的（Object.prevent Extensions(..)或 Reflect.preventExtensions(..)）
- isExtensible(..) -通过 [[IsExtensible]]，检测代理是否可扩展（Object.isExtensible(..) 或 Reflect.isExtensible(..)）
- ownKeys(..) -通过 [[OwnPropertyKeys]]，提取代理自己的属性和 / 或符号属性（Object.keys(..)、Object.getOwnPropertyNames(..)、Object.getOwnSymbolProperties(..)、Reflect.ownKeys(..) 或 JSON.stringify(..)）
- enumerate(..) -通过 [[Enumerate]]，取得代理拥有的和“继承来的”可枚举属性的迭代器（Reflect.enumerate(..) 或 for..in）
- has(..) -通过 [[HasProperty]]，检查代理是否拥有或者“继承了”某个属性（Reflect.has(..)、Object#hasOwnProperty(..) 或 "prop" in obj）

除了上面列出的会触发各种 trap 的动作，某些 trap 是由其他 trap 的默认动作间接触发的。

```js
var handlers = { 
    getOwnPropertyDescriptor(target,prop) { 
      console.log( 
        "getOwnPropertyDescriptor" 
      ); 
      return Object.getOwnPropertyDescriptor( 
        target, prop 
      ); 
    }, 
    defineProperty(target,prop,desc){ 
      console.log( "defineProperty" ); 
      return Object.defineProperty( 
        target, prop, desc 
      ); 
    } 
  }, 
  proxy = new Proxy( {}, handlers ); 

proxy.a = 2; 
// getOwnPropertyDescriptor 
// defineProperty
```

getOwnPropertyDescriptor(..) 和 defineProperty(..) 处理函数是在设定属性值（不管是新增的还是更新已有的）时由默认 set(..) 处理函数的步骤触发的。如果你也自定义了set(..) 处理函数，那么在 context（不是 target ！）上可以（也可以不）进行相应的调用，这些调用会触发这些代理 trap。

可以在对象上执行的很广泛的一组基本操作都可以通过这些元编程处理函数 trap。但有一些操作是无法（至少现在）拦截的。

比如，下面这些操作都不会 trap 并从代理 pobj 转发到目标 obj：

```js
var obj = { a:1, b:2 }, 
  handlers = { .. }, 
  pobj = new Proxy( obj, handlers ); 
typeof obj; 
String( obj ); 
obj + ""; 
obj == pobj; 
obj === pobj
```

代理处理函数总会有一些不变性（invariant），亦即不能被覆盖的行为。比如，isExtensible(..) 处理函数的返回值总会被类型转换为 boolean。这些不变性限制了自定义代理行为的能力，但它们的目的只是为了防止你创建诡异或罕见（或者不一致）的行为。

可取消代理（revocable proxy）：

```js
var obj = { a: 1 }, 
  handlers = { 
    get(target,key,context) { 
      // 注意：target === obj, 
      // context === pobj 
      console.log( "accessing: ", key ); 
      return target[key]; 
    } 
  }, 
  { proxy: pobj, revoke: prevoke } = Proxy.revocable( obj, handlers ); 
pobj.a; 
// accessing: a 
// 1 
// 然后：
prevoke(); 
pobj.a; 
// TypeError
```

可取消代理用 Proxy.revocable(..) 创建，这是一个普通函数，而不像 Proxy(..) 一样是构造器。除此之外，它接收同样的两个参数：target 和 handlers。

和 new Proxy(..) 不一样，Proxy.revocable(..) 的返回值不是代理本身。而是一个有两个属性——proxy 和 revode 的对象，我们使用对象解构（参见 2.4 节）把这两个属性分别赋给变量 pobj 和 prevoke()。

一旦可取消代理被取消，任何对它的访问（触发它的任意 trap）都会抛出 TypeError。可取消代理的一个可能应用场景是，在你的应用中把代理分发到第三方，其中管理你的模型数据，而不是给出真实模型本身的引用。如果你的模型对象改变或者被替换，就可以使分发出去的代理失效，这样第三方能够（通过错误！）知晓变化并请求更新到这个模型的引用。

1. 代理在先，代理在后

我们在前面介绍过，通常可以把代理看作是对目标对象的“包装”。在这种意义上，代理成为了代码交互的主要对象，而实际目标对象保持隐藏 / 被保护的状态。

你可能这么做是因为你想要把对象传入到某个无法被完全“信任”的环境，因此需要为对它的访问增强规范性，而不是把对象本身传入。

```js
var messages = [], 
  handlers = { 
    get(target,key) { 
      // 字符串值？
      if (typeof target[key] == "string") { 
        // 过滤掉标点符号
        return target[key].replace( /[^\w]/g, "" ); 
      } 
      // 所有其他的传递下去
      return target[key]; 
    }, 
    set(target,key,val) { 
      // 设定唯一字符串，改为小写
      if (typeof val == "string") { 
        val = val.toLowerCase(); 
        if (target.indexOf( val ) == -1) { 
          target.push( 
            val.toLowerCase() 
          ); 
        } 
      } 
      return true; 
    } 
  }, 
  messages_proxy = 
  new Proxy( messages, handlers ); 
// 其他某处：
messages_proxy.push( 
  "heLLo...", 42, "wOrlD!!", "WoRld!!" 
); 
messages_proxy.forEach( function(val){ 
  console.log(val); 
} ); 
// hello world 
messages.forEach( function(val){ 
  console.log(val); 
} ); 
// hello... world!!
```

我称之为代理在先（proxy first）设计，因为我们首先（主要、完全）与代理交互。

通过与 messages_proxy 交互来增加某些特殊的规则，这些是 messages 本身没有的。我们只在值为字符串并且是唯一值的时候才添加这个元素；我们还将这个值变为小写。在从messages_proxy 提取值的时候，我们过滤掉了字符串中的所有标点符号。

另外，我们也可以完全反转这个模式，让目标与代理交流，而不是代理与目标交流。这样，代码只能与主对象交互。这个回退方式的最简单实现就是把 proxy 对象放到主对象[[Prototype]] 链中。

```js
var handlers = { 
    get(target,key,context) { 
      return function() { 
        context.speak(key + "!"); 
      }; 
    } 
  }, 
  catchall = new Proxy( {}, handlers ), 
  greeter = { 
    speak(who = "someone") { 
      console.log( "hello", who ); 
    } 
  }; 
// 设定greeter回退到catchall 
Object.setPrototypeOf( greeter, catchall ); 
greeter.speak(); // hello someone 
greeter.speak( "world" ); // hello world 
greeter.everyone(); // hello everyone!
```

这里直接与 greeter 而不是 catchall 交流。当我们调用 speak(..) 的时候，它在 greeter上被找到并直接使用。但是当我们试图访问像 everyone() 这样的方法的时候，这个函数在greeter 上并不存在。

默认的对象属性行为是检查 [[Prototype]] 链，所以会查看 catchall 是否有 everyone 属性。然后代理的 get() 处理函数介入并返回一个用访问的属性名（"everyone"）调用 speak(..) 的函数。

我把这个模式称为代理在后（proxy last），因为在这里代理只作为最后的保障。

有一个关于 JavaScript 的常见抱怨，在你试着访问或设置一个还不存在的属性时，默认情况下对象不是非常具有防御性。你可能希望预先定义好一个对象的所有属性 / 方法之后，访问不存在的属性名时能够抛出一个错误。

我们可以通过代理实现这一点，代理在先或代理在后设计都可以。两种情况我们都考虑一下：

```js
var obj = { 
    a: 1, 
    foo() { 
      console.log( "a:", this.a ); 
    } 
  }, 
  handlers = { 
    get(target,key,context) { 
      if (Reflect.has( target, key )) { 
        return Reflect.get( 
          target, key, context 
        ); 
      } 
      else { 
        throw "No such property/method!"; 
      } 
    }, 
    set(target,key,val,context) { 
      if (Reflect.has( target, key )) { 
        return Reflect.set( 
          target, key, val, context 
        ); 
      } 
      else { 
        throw "No such property/method!"; 
      } 
    } 
  }, 
  pobj = new Proxy( obj, handlers ); 
pobj.a = 3; 
pobj.foo(); // a: 3 
pobj.b = 4; // Error: No such property/method! 
pobj.bar(); // Error: No such property/method!
```

对于 get(..) 和 set(..)，我们都只在目标对象的属性存在的时候才转发这个操作；否则抛出错误。主对象代码应该与代理对象（pobj）交流，因为它截获这些动作以提供保护。

现在，考虑转换为代理在后设计：

```js
var handlers = { 
  get() { 
    throw "No such property/method!"; 
  }, 
  set() { 
    throw "No such property/method!"; 
  } 
  }, 
  pobj = new Proxy( {}, handlers ), 
  obj = { 
    a: 1, 
    foo() { 
      console.log( "a:", this.a ); 
    } 
  }; 
// 设定obj回退到pobj 
Object.setPrototypeOf( obj, pobj ); 
obj.a = 3; 
obj.foo(); // a: 3 
obj.b = 4; // Error: No such property/method! 
obj.bar(); // Error: No such property/method!
```

考虑到处理函数的定义方式，这里的代理在后设计更简单一些。与截获 [[Get]] 和 [[Set]]操作并且只在目标属性存在情况下才转发不同，我们依赖于这样一个事实：如果 [[Get]] 或[[Set]] 进入我们的 pobj 回退，此时这个动作已经遍历了整个 [[Prototype]] 链并且没有发现匹配的属性。这时候我们可以自由抛出错误。不错吧？

[[Prototype]] 机制运作的主要通道是 [[Get]] 运算。当直接对象中没有找到一个属性的时候，[[Get]] 会自动把这个运算转给 [[Prototype]] 对象处理。

这意味着你可以使用代理的 get(..) trap 来模拟或扩展这个 [[Prototype]] 机制的概念。

我们将考虑的第一个 hack 就是创建两个对象，通过 [[Prototype]] 连成环状（或者，至少看起来是这样！）。实际上并不能创建一个真正的 [[Prototype]] 环，因为引擎会抛出错误。但是可以用代理模拟！

```js
var handlers = { 
    get(target,key,context) { 
      if (Reflect.has( target, key )) { 
        return Reflect.get( 
          target, key, context 
        ); 
      } 
      // 伪环状[[Prototype]] 
      else { 
        return Reflect.get( 
          target[ 
            Symbol.for( "[[Prototype]]" ) 
          ], 
          key, 
          context 
        ); 
      } 
    } 
  }, 
  obj1 = new Proxy( 
    { 
      name: "obj-1", 
      foo() { 
        console.log( "foo:", this.name ); 
      } 
    }, 
    handlers ), 
  ), 
  obj2 = Object.assign( 
    Object.create( obj1 ), 
    { 
      name: "obj-2", 
      bar() { 
        console.log( "bar:", this.name ); 
        this.foo(); 
      } 
    } 
  ); 
// 伪环状[[Prototype]]链接
obj1[ Symbol.for( "[[Prototype]]" ) ] = obj2; 
obj1.bar(); 
// bar: obj-1 <-- 通过代理伪装[[Prototype]] 
// foo: obj-1 <-- this上下文依然保留着
obj2.foo(); 
// foo: obj-2 <-- 通过[[Prototype]]
```

> 在这个例子中，我们不需要代理 / 转发 [[Set]]，所以比较简单。要完整模拟[[Prototype]]，需要实现一个 set(..) 处理函数来搜索 [[Prototype]] 链寻找匹配的属性，并遵守其描述符特性（比如 set，可写的）

在前面的代码中，通过 Object.create(..) 语句 obj2 [[Prototype]] 链接到了 obj1。而为了创建反向（环）的链接，我们在 obj1 符号位置 Symbol.for("[[Prototype]]")处创建了属性。这个符号可能看起来有点特殊 / 神奇，但实际上并非如此。它只是给我提供了一个方便的与我正在执行的任务关联的命名钩子，以便语义上引用。

然后，代理的 get(..) 处理函数首先查看这个代理上是否有请求的 key。如果没有，就手动把这个运算转发给保存在 target 的 Symbol.for("[[Prototype]]") 位置中的对象引用。

这种模式的一个重要优点是，obj1 和 obj2 的定义几乎不会受到在它们之间建立的这种环状关系的影响。尽管为了简洁的缘故，前面代码把所有的代码都纠缠到了一起，但是仔细观察可以看到，代理处理函数的逻辑完全是通用的（并不具体了解obj1 和 obj2 的细节）。所以，这段逻辑可提取出来封装为一个单独的辅助函数，比如setCircularPrototypeOf(..)。我们把这个实现留给读者作为练习。

既然已经了解了如何通过 get(..) 来模拟一个 [[Prototype]] 链接，现在让我们来深入hack 一下。不用环状 [[Prototype]]，用多个 [[Prototype]] 链接（也就是“多继承”）怎么样？实际上这非常简单直接：

```js
var obj1 = { 
    name: "obj-1", 
    foo() { 
      console.log( "obj1.foo:", this.name ); 
    }, 
  }, 
  obj2 = { 
    name: "obj-2", 
    foo() { 
      console.log( "obj2.foo:", this.name ); 
    }, 
    bar() { 
      console.log( "obj2.bar:", this.name ); 
    } 
  }, 
  handlers = { 
    get(target,key,context) { 
      if (Reflect.has( target, key )) { 
        return Reflect.get( 
          target, key, context 
        ); 
      } 
      // 伪装多个[[Prototype]] 
      else { 
        for (var P of target[ 
          Symbol.for( "[[Prototype]]" ) 
        ]) { 
          if (Reflect.has( P, key )) { 
            return Reflect.get( 
              P, key, context 
            ); 
          } 
        } 
      } 
    } 
  }, 
  obj3 = new Proxy( 
    { 
      name: "obj-3", 
      baz() { 
        this.foo(); 
        this.bar(); 
      } 
    }, 
    handlers 
  ); 
// 伪装多个[[Prototype]]链接
obj3[ Symbol.for( "[[Prototype]]" ) ] = [ 
  obj1, obj2 
]; 
obj3.baz(); 
// obj1.foo: obj-3 
// obj2.bar: obj-3
```

> 正如前面环状 [[Prototype]] 例子之后的注释中提到的一样，我们没有实现set(..) 处理函数，但是要实现一个完整解决方案，模拟 [[Set]] 动作作为普通的 [[Prototype]] 行为是必要的。

obj3 建立了多委托到 obj1 和 obj2。在 obj3.baz() 中，this.foo() 调用最后从 obj1 中提出foo()（先到先得，虽然 obj2 上也有一个 foo()）。如果我们把链接重新排序为 obj2、obj1，就会找到并使用 obj2.foo()。

而现在 this.bar() 调用不会在 obj1 上找到 bar()，所以它会陷入检查 obj2，在其中找到匹配。

obj1 和 obj2 表示 obj3 的两条平行的 [[Prototype]] 链。obj1 和 / 或 obj2 本身也可以有普通的 [[Prototype]] 委托到其他对象，或者本身也可以是一个多委托的代理（就像obj3 一样）。

就像前面的环状 [[Prototype]] 链例子一样，obj1、obj2 和 obj3 的定义与通用的处理多委托代理的逻辑几乎是完全分离的。要定义一个像 setPrototypesOf(..)（注意这个表示复数的“s”）这样的工具接收一个主对象和一个对象列表来模拟多 [[Prototype]] 链接是很简单的。我们还是把这个实现留给读者作为练习。

希望在各种各样的例子之后代理的威力现在变得明朗了。代理使得很多其他威力强大的元编程任务成为可能。

- Reflect API

Reflect 对象是一个平凡对象（就像 Math），不像其他内置原生值一样是函数 / 构造器。

- Reflect.getOwnPropertyDescriptor(..); 
- Reflect.defineProperty(..); 
- Reflect.getPrototypeOf(..);
- Reflect.setPrototypeOf(..);
- Reflect.preventExtensions(..);
- Reflect.isExtensible(..)。

一般来说这些工具和 Object.* 的对应工具行为方式类似。但是，有一个区别是如果第一个参数（目标对象）不是对象的话，Object.* 相应工具会试图把它类型转换为一个对象。而这种情况下 Reflect.* 方法只会抛出一个错误。

可以使用下面这些工具访问 / 查看一个对象键：

- Reflect.ownKeys(..) -返回所有“拥有”的（不是“继承”的）键的列表，就像 Object.getOwnPropertyNames (..) 和 Object.getOwnPropertySymbols(..) 返回的一样。关于键的顺序参见后面的“属性排序”一节。
- Reflect.enumerate(..) -返回一个产生所有（拥有的和“继承的”）可枚举的（enumerable）非符号键集合的迭代器。本质上说，这个键的集合和 foo..in 循环处理的那个键的集合是一样的。关于键的顺序参见后面的“属性排序”一节。
- Reflect.has(..) -实质上和 in 运 算 符 一 样， 用 于 检 查 某 个 属 性 是 否 在 某 个 对 象 上 或 者 在 它 的[[Prototype]] 链上。比如，Reflect.has(o, "foo") 实质上就是执行 "foo" in o。

函数调用和构造器调用可以通过使用下面这些工具手动执行，与普通的语法（比如，(..)和 new）分开 :

- Reflect.apply(..) -举例来说，Reflect.apply(foo,thisObj,[42,"bar"]) 以 thisObj 作为 this 调用 foo(..)函数，传入参数 42 和 "bar"。
- Reflect.construct(..) -举例来说，Reflect.construct(foo,[42,"bar"]) 实质上就是调用 new foo(42,"bar")。可以使用下面这些工具来手动执行对象属性访问、设置和删除。
- Reflect.get(..) -举例来说，Reflect.get(o,"foo") 提取 o.foo。
- Reflect.set(..) -举例来说，Reflect.set(o,"foo",42) 实质上就是执行 o.foo = 42。
- Reflect.deleteProperty(..) -举例来说，Reflect.deleteProperty(o,"foo") 实质上就是执行 delete o.foo。

对于 ES6 来说，拥有属性的列出顺序是由 [[OwnPropertyKeys]] 算法定义的（ES6 规范，9.1.12 节），这个算法产生所有拥有的属性（字符串或符号），不管是否可枚举。这个顺序只对 Reflect.ownKeys(..)（以及扩展的 Object.getOwnPropertyNames(..) 和 Object.getOwnPropertySymbols(..)）有保证。

其顺序为：

1. 首先，按照数字上升排序，枚举所有整数索引拥有的属性；
2. 然后，按照创建顺序枚举其余的拥有的字符串属性名；
3. 最后，按照创建顺序枚举拥有的符号属性。

```js
var o = {}; 
o[Symbol("c")] = "yay"; 
o[2] = true; 
o[1] = true; 
o.b = "awesome"; 
o.a = "cool"; 
Reflect.ownKeys( o ); // [1,2,"b","a",Symbol(c)] 
Object.getOwnPropertyNames( o ); // [1,2,"b","a"] 
Object.getOwnPropertySymbols( o ); // [Symbol(c)]
```

另一方面，[[Enumerate]] 算法（ES6 规范，9.1.11 节）只从目标对象和它的 [[Prototype]]链产生可枚举属性。它用于 Reflect.enumerate(..) 和 for..in。可以观察到的顺序和具体的实现相关，不由规范控制。

与之对比，Object.keys(..) 调用 [[OwnPropertyKeys]] 算法取得拥有的所有键的列表。但是，它会过滤掉不可枚举属性，然后把这个列表重新排序来遵循遗留的与实现相关的行为特性，特别是 JSON.stringify(..) 和 for..in。因此通过扩展，这个顺序也和 Reflect.enumerate(..) 顺序相匹配。

换句话说，所有这 4 种机制（Reflect.enumerate(..)、Object.keys(..)、for..in 和 JSON.stringify(..)）都会匹配同样的与具体实现相关的排序，尽管严格上说是通过不同的路径。

把这 4 种机制与 [[OwnPropertyKeys]] 的排序匹配的具体实现是允许的，但并不是必须的。尽管如此，你很可能会看到它们的排序特性是这样的：

```js
var o = { a: 1, b: 2 }; 
var p = Object.create( o ); 
p.c = 3; 
p.d = 4; 
for (var prop of Reflect.enumerate( p )) { 
  console.log( prop ); 
} 
// c d a b 
for (var prop in p) { 
  console.log( prop ); 
} 
// c d a b 
JSON.stringify( p ); 
// {"c":3,"d":4} 
Object.keys( p ); 
// ["c","d"]
```

总 结 一 下： 对 于 ES6 来 说，Reflect.ownKeys(..)、Object.getOwnPropertyNames(..) 和Object.getOwnPropertySymbols(..) 的顺序都是可预测且可靠的，这由规范保证。所以依赖于这个顺序的代码是安全的。

Reflect.enumerate(..)、Object.keys(..) 和 for..in（以及扩展的 JSON.stringification(..)）还像过去一样，可观察的顺序是相同的。但是这个顺序不再必须与 Reflect.ownKeys(..) 相同。在使用它们依赖于具体实现的顺序时仍然要小心。

- 尾递归调用（Tail Call Optimization,TCO）

通常，在一个函数内部调用另一个函数的时候，会分配第二个栈帧来独立管理第二个函数调用的变量 / 状态。这个分配不但消耗处理时间，也消耗了额外的内存。

通常调用栈链最多有 10~15 个从一个函数到另一个函数的跳转。这种情况下，内存使用并不会造成任何实际问题。

但是，当考虑到递归编程的时候（一个函数重复调用自身）——或者两个或多个函数彼此调用形成递归——调用栈的深度很容易达到成百上千，甚至更多。如果内存的使用无限制地增长下去，你可能看到了它将导致的问题。

JavaScript 引擎不得不设置一个武断的限制来防止这种编程技术引起浏览器和设备内存耗尽而崩溃。这也是为什么达到这个限制的时候我们会得到烦人的“RangeError: Maximum call stack size exceeded”

有一些称为尾调用（tail call）的函数调用模式，可以以避免额外栈帧分配的方式进行优化。如果可以避免额外的分配，就没有理由任意限制调用栈深度，所以引擎就可以不设置这个限制。

尾调用是一个 return 函数调用的语句，除了调用后返回其返回值之外没有任何其他动作。这个优化只在 strict 模式下应用。这又是一个要坚持编写 strict 模式代码的原因！下面是一个不在尾位置的函数调用：

```js
"use strict"; 
function foo(x) { 
  return x * 2; 
} 
function bar(x) { 
  // 这不是尾调用
  return 1 + foo( x ); 
} 
bar( 10 ); // 21
```

foo(x) 调用完毕后还得执行 1 + ..，所以 bar(..) 调用的状态需要被保留。

但下面代码展示的对 foo(..) 和 bar(..) 的调用都处于尾位置，因为它们是在其代码路径上发生的最后一件事（除了 return）：

```js
function foo(x) { 
  return x * 2; 
} 
function bar(x) { 
  x = x + 1; 
  if (x > 10) { 
    return foo( x ); 
  } 
  else { 
    return bar( x + 1 ); 
  } 
} 
bar( 5 ); // 24 
bar( 15 ); // 32
```

在这个程序中，bar(..) 显然是递归，而 foo(..) 只是一个普通函数调用。在这两种情况下，函数调用都处于合适的尾位置（proper tail position）。x + 1 在 bar(..) 调用之前求值，在调用结束后，所做的只有 return。

这些形式的正确尾调用（Proper Tail Call，PTC）是可以被优化的——称为尾调用优化（Tail Call Optimization，TCO）——于是额外的栈帧分配是不需要的。引擎不需要对下一个函数调用创建一个新的栈帧，只需复用已有的栈帧。这能够工作是因为一个函数不需要保留任何当前状态——在 PTC 之后不需要这个状态做任何事情。

TCO 意味着对调用栈的允许深度没有任何限度。对于一般程序中的普通函数调用，这个技巧有些许优化，但更重要的是打开了在程序表达中使用递归的大门，甚至是调用栈的调用深度可能达到成千上万的时候。

现在我们不再只把递归作为解决问题的理论方案了，而是可以实际将其用在 JavaScript 程序中

但这里的问题是只有 PTC 可以被优化；非 PTC 当然仍然可以工作，但会像以前一样触发栈帧分配。如果你希望这个优化介入的话，需要认真设计函数结构支持 PTC。

如果有一个函数不是以 PTC 方式编写的，那么你可能会需要手动重新安排代码以适合TCO。

```js
"use strict"; 
function foo(x) { 
  if (x <= 1) return 1; 
  return (x / 2) + foo( x - 1 ); 
} 
foo( 123456 ); // RangeError
```

调用 foo(x-1) 不是 PTC，因为它的结果每次在 return 之前要加上 (x / 2)。

但是，要想使这段代码适合 ES6 引擎 TCO，可以这样重写：

```js
"use strict"; 
var foo = (function(){ 
  function _foo(acc,x) { 
  if (x <= 1) return acc; 
    return _foo( (x / 2) + acc, x - 1 ); 
  } 
  return function(x) { 
    return _foo( 1, x ); 
  }; 
})(); 
foo( 123456 ); // 3810376848.5
```

如果你在实现了 TCO 的 ES6 引擎中运行前面的代码，会得到如前显示的 3810376848.5。然而，它在非 TCO 引擎里仍然会因 RangeError 而失败。

在非 TCO 引擎中，递归循环最终会失败，抛出一个异常被 try..catch 捕获。换句话说，有了 TCO，循环才能完成。

### ES6之后

- 异步函数

生成器向类似运行器的工具 yield 出 promise，这个运行器工具会在 promise 完成时恢复生成器。让我们来简单了解一下这个提案提出的特性 async function, JavaScript 将会自动了解如何寻找要等待和恢复的 promise。

```js
async function main() { 
  var ret = await step1(); 
  try { 
    ret = await step2( ret ); 
  } 
  catch (err) { 
    ret = await step2Failed( err ); 
  } 
  ret = await Promise.all( [ 
    step3a( ret ), 
    step3b( ret ), 
    step3c( ret ) 
  ] ); 
  await step4( ret ); 
} 
main() 
.then( 
  function fulfilled(){ 
    // main()成功完成
  }, 
  function rejected(reason){ 
    // 哎呀，出错了
  } 
);
```

我们没有使用 function *main() {.. 声明，而是使用了 async function main() {.. 形式。而且，没有 yield 出一个 promise，而是 await 这个 promise。调用来运行函数 main() 实际上返回了一个可以直接观察的 promise。这和从 run(main) 调用返回的 promise 是等价的。

看到这种对称性了吗？ async function 本质上就是生成器＋ promise ＋ run(..) 模式的语法糖；它们底层的运作方式是一样的！

> 还有一个对 async function* 的提案，可以称之为“异步生成器”。你可以在同一段代码中既 yield 又 await，甚至可以把这两个运算放在同一个语句：x = await yield y。这个“异步生成器”提案似乎更不稳定——具体说，它的返回值还没有完全确定。有些人认为返回值应该是一个observable，有点类似于一个迭代器和一个 promise 的合并。目前我们不会深入探讨这个主题，但会对它保持关注。

async function 有一个没有解决的问题，因为它只返回一个 promise，所以没有办法从外部取消一个正在运行的 async function 实例。如果这个异步操作的资源紧张，那么可能会引起问题，因为一旦你确认不需要结果就会想要释放资源。

```js
async function request(url) { 
  var resp = await ( 
    new Promise( function(resolve,reject){ 
      var xhr = new XMLHttpRequest(); 
      xhr.open( "GET", url ); 
      xhr.onreadystatechange = function(){ 
        if (xhr.readyState == 4) { 
          if (xhr.status == 200) { 
            resolve( xhr ); 
          } 
          else { 
            reject( xhr.statusText ); 
          } 
          } 
      }; 
      xhr.send(); 
    }) 
  ); 
  return resp.responseText; 
} 
var pr = request( "http://some.url.1" ); 
pr.then( 
  function fulfilled(responseText){ 
    // ajax成功
  }, 
  function rejected(reason){ 
    //哎呀，出错了
  } 
);
```

我给出的这个 request(..) 有点像最近提出要集成到 Web 平台上的 fetch(..) 工具。那么问题来了，如果你想要用 pr 值以某种方法指示取消一个长时间运行的 Ajax 请求会怎样呢？

Promise 是不可取消的（至少在编写本部分的时候是如此）。和很多人一样，我的看法是它们永远不应该被取消。而且即使它有一个 cancel() 方法，就一定意味着调用 pr.cancel() 应该把取消信号一路沿着promise 链传播回到 async function 吗？

编写本部分时，async function 返回普通 promise，所以返回值不太可能会彻底改变。但是判断最终如何发展还为时过早。我们对这个讨论保持关注吧。

- Object.observe(..)

Web 前端开发的圣杯之一就是数据绑定——侦听数据对象的更新，同步这个数据的 DOM表示。多数 JavaScript 框架都为这类操作提供了某种机制。

可能在后 ES6，我们将会看到通过工具 Object.observe(..) 直接添加到语言中的支持。本质上说，这个思路就是你可以建立一个侦听者（listener）来观察对象的改变，然后在每次变化发生时调用一个回调。例如，你可以据此更新 DOM

你可以观察的改变有 6 种类型：

- add
- update
- delete
- reconfigure
- setPrototype
- preventExtensions

默认情况下，你可以得到所有这些类型的变化的通知，也可以进行过滤只侦听关注的类型。

```js
var obj = { a: 1, b: 2 }; 
Object.observe( 
  obj, 
  function(changes){ 
    for (var change of changes) { 
      console.log( change ); 
    } 
  }, 
  [ "add", "update", "delete" ] 
); 
obj.c = 3; 
// { name: "c", object: obj, type: "add" } 
obj.a = 42; 
// { name: "a", object: obj, type: "update", oldValue: 1 } 
delete obj.b; 
// { name: "b", object: obj, type: "delete", oldValue: 2 }
```

除了主要的 "add"、"update" 和 "delete" 变化类型：

- 如果一个对象通过 Object.defineProperty(..) 重新配置这个对象的属性，比如修改它的 writable 属性，就会发出 "reconfigure" 改变事件。
- 如果一个对象通过 Object.preventExtensions(..) 变为不可扩展，就会发出 "prevent Extensions" 改变事件。

因 为 Object.seal(..) 和 Object.freeze(..) 也都意味着 Object.preventExtensions(..)，所以它们也会发出相应的改变事件。另外，对象的每个属性都会发出 "reconfigure" 改变事件。如果一个对象的 [[Prototype]] 改变，或者通过 __proto__ setter 来设置，或者使用Object.setPrototy peOf(..) 来设置，都会发出 "setPrototype" 改变事件。

注意，这些改变事件会在改变发生后立即发出。不要把这一点和代理混淆，代理是可以在动作发生之前拦截的。对象观察支持在变化（或一组变化）发生后响应。

除了前面 6 类内置改变事件，你也可以侦听和发出自定义改变事件。

```js
function observer(changes){ 
  for (var change of changes) { 
    if (change.type == "recalc") { 
      change.object.c = 
      change.object.oldValue + 
      change.object.a + 
      change.object.b; 
    } 
  } 
} 
function changeObj(a,b) { 
  var notifier = Object.getNotifier( obj ); 
  obj.a = a * 2; 
  obj.b = b * 3; 
  // 把改变事件排到一个集合中
  notifier.notify( { 
    type: "recalc", 
    name: "c", 
    oldValue: obj.c 
  } ); 
} 
var obj = { a: 1, b: 2, c: 3 }; 
Object.observe( 
  obj, 
  observer, 
  ["recalc"] 
); 
changeObj( 3, 11 ); 
obj.a; // 12 
obj.b; // 30 
obj.c; // 3
```

改变集合（"recalc" 自定义事件）已经排入队列准备发送给观测者，但是还没有发送，因此 obj.c 的值仍然是 3。

默认情况下，改变会在当前事件循环的最后发送）。如果你想要立即发送，可以使用 Object.deliverChangeRecords(observer)。一旦改变事件发送后，你就可以看到 obj.c 如预期地更新为：

```js
obj.c; // 42
```

在前面的例子中，我们用完成改变事件记录来调用 notifier.notify(..)。还有一种改变记录入队的方式是使用 performChange(..)，这会把指定事件类型从其余事件记录属性中分离出来（通过函数回调）。考虑：

```js
notifier.performChange( "recalc", function(){ 
  return { 
    name: "c", 
    // this就是在观察之中的对象
    oldValue: this.c 
  }; 
} );
```

就像普通的事件侦听器一样，你可能希望停止观测一个对象的改变事件。为此，可以通过Object.unobserve(..) 来实现。

```js
var obj = { a: 1, b: 2 }; 
Object.observe( obj, function observer(changes) { 
  for (var change of changes) { 
    if (change.type == "setPrototype") { 
      Object.unobserve( 
        change.object, observer 
      ); 
      break; 
    } 
  } 
} );
```

在这个小例子中，我们侦听改变事件，直到看到 "setPrototype" 事件发生，然后就停止观察任何新改变事件。

- 幂运算符

```js
var a = 2; 
a ** 4; // Math.pow( a, 4 ) == 16 
a **= 3; // a = Math.pow( a, 3 ) 
a; // 8
```

- 对象属性与 ...

```js
var o1 = { a: 1, b: 2 }, 
  o2 = { c: 3 }, 
  o3 = { ...o1, ...o2, d: 4 }; 
console.log( o3.a, o3.b, o3.c, o3.d ); 
// 1 2 3 4

// ... 运算符可能也会用于把对象的解构属性收集到一个对象：
var o1 = { b: 2, c: 3, d: 4 }; 
var { b, ...o2 } = o1; 
console.log( b, o2.c, o2.d ); // 2 3 4
// 在这里，...o2 把解构的 c 和 d 属性重新收集回到 o2 对象（o2 没有 o1 中的 a b 属性）
```

- Array#includes(..)

JavaScript 开发者需要执行的一个极其常见的任务就是在值数组中搜索一个值。一直以来实现这个任务的方法是：

```js
var vals = [ "foo", "bar", 42, "baz" ]; 
if (vals.indexOf( 42 ) >= 0) { 
  // 找到了! 
}
```

使用 >= 0 检查的原因是，如果找到的话 indexOf(..) 返回一个 0 或者更大的数字值，如果没有找到就会返回 -1。换句话说，我们是在布尔值上下文中使用返回索引的函数。因为 -1为真而不是假，所以需要更多的手动检查。

```js
var vals = [ "foo", "bar", 42, "baz" ]; 
if (~vals.indexOf( 42 )) { 
  // 找到了! 
}
```

这里的 ~ 运算符把 indexOf(..) 返回值规范为更适合强制转换为布尔型的值范围。也就是说，-1 产生 0( 假 )，所有其他值产生非 0 值 ( 真），这正是判断是否找到这个值所需的

我认为这是一个改进，然而其他人强烈反对。但是，没有人认为 indexOf(..) 的搜索逻辑是完美的。比如，它无法找到数组中 NaN 值。

于是出现了一个获得了大量支持的提案，提出增加一个真正返回布尔值的数组搜索方法，称为 includes(..):

```js
var vals = [ "foo", "bar", 42, "baz" ]; 
if (vals.includes( 42 )) { 
  // 找到了! 
}
```

> Array#includes(..) 使用的匹配逻辑能够找到 NaN 值，但是无法区分 -0 和0。如果你不关心程序中的 -0 值，那么这可能就是你所需要的。如果你确实在意这个 -0 值的话，那么你就需要实现自己的搜索逻辑，很可能是使用 Object.is(..) 工具

-  SIMD

SIMD API 暴露了可以同时对多个数字值运算的各种底层（CPU）指令。比如，你可以指定两个向量，其中分别有 4 个或 8 个数字，把它们的对应元素一次全部相乘（数据并行！）。

```js
var v1 = SIMD.float32x4( 3.14159, 21.0, 32.3, 55.55 ); 
var v2 = SIMD.float32x4( 2.1, 3.2, 4.3, 5.4 ); 
SIMD.float32x4.mul( v1, v2 ); 
// [ 6.597339, 67.2, 138.89, 299.97 ]
```

除了 mul(..)（相乘）之外，SIMD 还会包含其他几个运算，比如 sub()、div()、abs()、neg()、sqrt() 以及很多其他运算。

对于下一代高性能 JavaScript 应用来说，并行数学运算是很关键的。

-  WebAssembly (WASM)

本质上说，如果 WASM 发布，JavaScript 引擎将会获得执行二进制格式代码的新能力，这种格式某种程度上类似于字节码（bytecode，就像 JVM 上运行的那样）。

WASM 提出了一种代码的高度压缩 AST（语法树）二进制表示格式，然后可以直接向JavaScript 引擎发出指令，而它的基础结构，不需要通过 JavaScript 解析，甚至不需要符合JavaScript 的规则。像 C 或 C++ 这样的语言可以被直接编译为 WASM 格式而不是 ASM.js，这样通过跳过 JavaScript 解析会获得额外的速度优势。

WASM 的近期目标是与 ASM.js 和真正 JavaScript 相当。但最终的预期是，WASM 将会增加新功能，而这些新功能是超出 JavaScript 所能做的。比如像线程这样的激进功能给JavaScript 带来了很大压力——这个改变将会给整个 JavaScript 生态系统带来巨大震撼——将很可能会成为一个 WASM 扩展，缓解 JavaScript 本身的修改压力。

实际上，这个新的发展图景为很多语言打开了新的道路，使其能够进入 Web 运行时。对于Web 平台来说，这是一个令人激动的新特性。

对于 JavaScript 来说这意味着什么？ JavaScript 将会变得无关紧要或者“死去”吗？绝对不会！看起来在以后的几年里，ASM.js 不会有太大的发展了，但在 Web 平台中 JavaScript 的主体还是非常安全的。

WASM 的支持者认为，WASM 的成功将意味着 JavaScript 的设计可以免于被不现实的需求撕裂的压力。重点是，对于应用中的高性能部分 WASM 是更好的目标，可以用其他多种语言编写。

有趣的是，JavaScript 是未来不太可能转化为 WASM 的语言之一。未来的修改可能会刻划出 JavaScript 的一个适合于转化为 WASM 的子集，但是这条发展路径的优先级似乎并不高。

尽管 JavaScript 很可能不会转化为 WASM，但是 JavaScript 代码和 WASM 代码将能够最大程度地交互，就像现在的模块交互一样自然。你可以设想调用像 foo() 这样的 JavaScript函数，而实际上调用的是一个同名的能够在你的其余 JavaScript 的限制之外良好运行的WASM 函数。

当下用 JavaScript 编写的代码将可能继续用它编写，至少在可见的未来是这样。transpile到 JavaScript 的东西将可能最终考虑使用 WASM 替代。对于那些性能要求极高，不能容忍多层抽象的功能，最有可能的选择是寻找合适的非 JavaScript 语言编写，然后以WASM 为目标。

这个转变可能会比较缓慢，需要几年才能完成。WASM 进入所有主流浏览器平台可能至少也需要数年。同时，WASM 项目（[https://github.com/WebAssembly](https://github.com/WebAssembly)）已经有一个早期的polyfill 对其基本宗旨提供了概念证明。

但随着时间的发展，也随着 WASM 学到更多非 JavaScript 技巧，很可能当前一些JavaScript 的东西会被重构为以 WASM 为目标的语言。举例来说，框架、游戏引擎以及其他常用工具中性能敏感的部分都可能从这样的转变中获益。在自己的 Web 应用中使用这些工具的开发者很可能不会注意到使用和集成过程中的差别，只会自动受益于性能和功能的提高。


