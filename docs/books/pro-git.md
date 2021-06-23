---
title: Pro Git
head:
  - - meta
    - name: description
      content: Pro Git
  - - meta
    - name: keywords
      content: Pro Git
---

[Pro Git](https://git-scm.com/book/zh/v2)

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


