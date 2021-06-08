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
      - IIFE（立即执行函数）
- 块作用域：{}（**if条件语句不算块**）
  - try/catch：catch会创建一个块作用域
  - let、const

**总结：任何声明在某个作用域内的变量，都将`附属于这个作用域`**

### 提升

引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来，[词法作用域](#词法作用域)核心内容（**针对当前作用域**）

函数优先：函数会首先被提升，然后才是变量（**同名的函数声明和变量声明不提升规则方式进行覆盖**）

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
