import{o as n,c as a,b as s}from"./app.98f9a0b8.js";const e='{"title":"TypeScript 入门教程","description":"TypeScript 入门教程 TS","frontmatter":{"title":"TypeScript 入门教程","head":[["meta",{"name":"description","content":"TypeScript 入门教程 TS"}],["meta",{"name":"keywords","content":"TypeScript 入门教程 TS"}]]},"headers":[{"level":2,"title":"前置准备","slug":"前置准备"},{"level":3,"title":"安装 TypeScript","slug":"安装-typescript"},{"level":3,"title":"Hello TypeScript","slug":"hello-typescript"},{"level":2,"title":"基础","slug":"基础"},{"level":3,"title":"原始数据类型","slug":"原始数据类型"},{"level":3,"title":"任意值","slug":"任意值"},{"level":3,"title":"类型推论","slug":"类型推论"},{"level":3,"title":"联合类型","slug":"联合类型"},{"level":3,"title":"对象的类型—接口","slug":"对象的类型—接口"},{"level":3,"title":"数组的类型","slug":"数组的类型"},{"level":3,"title":"函数的类型","slug":"函数的类型"},{"level":3,"title":"类型断言","slug":"类型断言"},{"level":3,"title":"声明文件","slug":"声明文件"},{"level":3,"title":"内置对象","slug":"内置对象"},{"level":2,"title":"进阶","slug":"进阶"},{"level":3,"title":"类型别名","slug":"类型别名"},{"level":3,"title":"字符串字面量类型","slug":"字符串字面量类型"},{"level":3,"title":"元组","slug":"元组"},{"level":3,"title":"枚举","slug":"枚举"},{"level":3,"title":"类","slug":"类"},{"level":3,"title":"类与接口","slug":"类与接口"},{"level":3,"title":"泛型","slug":"泛型"},{"level":3,"title":"声明合并","slug":"声明合并"},{"level":3,"title":"扩展阅读","slug":"扩展阅读"},{"level":2,"title":"工程","slug":"工程"},{"level":3,"title":"代码检查","slug":"代码检查"},{"level":3,"title":"编译选项","slug":"编译选项"}],"relativePath":"books/typescript-tutorial.md","lastUpdated":1629788541708}',t={},p=[s('<p><a href="https://ts.xcatliu.com/" target="_blank" rel="noopener noreferrer">TypeScript 入门教程</a></p><h2 id="前置准备"><a class="header-anchor" href="#前置准备" aria-hidden="true">#</a> 前置准备</h2><h3 id="安装-typescript"><a class="header-anchor" href="#安装-typescript" aria-hidden="true">#</a> 安装 TypeScript</h3><div class="language-shell"><pre><code><span class="token comment"># yarn安装</span>\n<span class="token function">yarn</span> global <span class="token function">add</span> typescript\n\n<span class="token comment"># npm安装</span>\n<span class="token function">npm</span> <span class="token function">install</span> -g typescript\n</code></pre></div><p>以上命令会在全局环境下安装 tsc 命令，安装完成之后，我们就可以在任何地方执行 tsc 命令了。</p><p>编译 TypeScript 文件:</p><div class="language-shell"><pre><code>tsc hello.ts\n</code></pre></div><h3 id="hello-typescript"><a class="header-anchor" href="#hello-typescript" aria-hidden="true">#</a> Hello TypeScript</h3><p>将以下代码复制到 hello.ts 中：</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">sayHello</span><span class="token punctuation">(</span>person<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token string">&#39;Hello, &#39;</span> <span class="token operator">+</span> person<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">let</span> user <span class="token operator">=</span> <span class="token string">&#39;Tom&#39;</span><span class="token punctuation">;</span>\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">sayHello</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>然后执行</p><div class="language-shell"><pre><code>tsc hello.ts\n</code></pre></div><p>这时候会生成一个编译好的文件 hello.js：</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">sayHello</span><span class="token punctuation">(</span><span class="token parameter">person</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token string">&#39;Hello, &#39;</span> <span class="token operator">+</span> person<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> user <span class="token operator">=</span> <span class="token string">&#39;Tom&#39;</span><span class="token punctuation">;</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">sayHello</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>在 TypeScript 中，我们使用 : 指定变量的类型，: 的前后有没有空格都可以。</p><p>上述例子中，我们用 : 指定 person 参数类型为 string。但是编译为 js 之后，并没有什么检查的代码被插入进来。</p><p>这是<strong>因为 TypeScript 只会在编译时对类型进行静态检查，如果发现有错误，编译的时候就会报错</strong>。而在运行时，与普通的 JavaScript 文件一样，不会对类型进行检查。</p><p>如果我们需要保证运行时的参数类型，还是得手动对类型进行判断：</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">sayHello</span><span class="token punctuation">(</span>person<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> person <span class="token operator">===</span> <span class="token string">&#39;string&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token string">&#39;Hello, &#39;</span> <span class="token operator">+</span> person<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;person is not a string&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">let</span> user <span class="token operator">=</span> <span class="token string">&#39;Tom&#39;</span><span class="token punctuation">;</span>\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">sayHello</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>下面尝试把这段代码编译一下：</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">sayHello</span><span class="token punctuation">(</span>person<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token string">&#39;Hello, &#39;</span> <span class="token operator">+</span> person<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">let</span> user <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">sayHello</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>编辑器中会提示错误，编译的时候也会出错：</p><div class="language-shell"><pre><code>hello.ts:6:22 - error TS2345: Argument of <span class="token builtin class-name">type</span> <span class="token string">&#39;number[]&#39;</span> is not assignable to parameter of <span class="token builtin class-name">type</span> <span class="token string">&#39;string&#39;</span><span class="token builtin class-name">.</span>\n</code></pre></div><p>但是还是生成了 js 文件：</p><p>这是因为 <strong>TypeScript 编译的时候即使报错了，还是会生成编译结果</strong>，我们仍然可以使用这个编译之后的文件。</p><p>如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。</p><h2 id="基础"><a class="header-anchor" href="#基础" aria-hidden="true">#</a> 基础</h2><h3 id="原始数据类型"><a class="header-anchor" href="#原始数据类型" aria-hidden="true">#</a> 原始数据类型</h3><p>JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。</p><p>原始数据类型包括：<code>boolean</code>、<code>number</code>、<code>string</code>、<code>null</code>、<code>undefined</code> 以及 ES6 中的新类型 <code>[Symbol](https://es6.ruanyifeng.com/#docs/symbol)</code> 和 ES10 中的新类型 <code>[BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)</code>。</p><p>本节主要介绍<code>前五种</code>原始数据类型在 TypeScript 中的应用。</p><ul><li><p>Boolean</p></li><li><p>Number</p></li><li><p>String</p></li><li><p>Null</p></li><li><p>Undefined</p></li></ul><h3 id="任意值"><a class="header-anchor" href="#任意值" aria-hidden="true">#</a> 任意值</h3><h3 id="类型推论"><a class="header-anchor" href="#类型推论" aria-hidden="true">#</a> 类型推论</h3><h3 id="联合类型"><a class="header-anchor" href="#联合类型" aria-hidden="true">#</a> 联合类型</h3><h3 id="对象的类型—接口"><a class="header-anchor" href="#对象的类型—接口" aria-hidden="true">#</a> 对象的类型—接口</h3><h3 id="数组的类型"><a class="header-anchor" href="#数组的类型" aria-hidden="true">#</a> 数组的类型</h3><h3 id="函数的类型"><a class="header-anchor" href="#函数的类型" aria-hidden="true">#</a> 函数的类型</h3><h3 id="类型断言"><a class="header-anchor" href="#类型断言" aria-hidden="true">#</a> 类型断言</h3><h3 id="声明文件"><a class="header-anchor" href="#声明文件" aria-hidden="true">#</a> 声明文件</h3><h3 id="内置对象"><a class="header-anchor" href="#内置对象" aria-hidden="true">#</a> 内置对象</h3><h2 id="进阶"><a class="header-anchor" href="#进阶" aria-hidden="true">#</a> 进阶</h2><h3 id="类型别名"><a class="header-anchor" href="#类型别名" aria-hidden="true">#</a> 类型别名</h3><h3 id="字符串字面量类型"><a class="header-anchor" href="#字符串字面量类型" aria-hidden="true">#</a> 字符串字面量类型</h3><h3 id="元组"><a class="header-anchor" href="#元组" aria-hidden="true">#</a> 元组</h3><h3 id="枚举"><a class="header-anchor" href="#枚举" aria-hidden="true">#</a> 枚举</h3><h3 id="类"><a class="header-anchor" href="#类" aria-hidden="true">#</a> 类</h3><h3 id="类与接口"><a class="header-anchor" href="#类与接口" aria-hidden="true">#</a> 类与接口</h3><h3 id="泛型"><a class="header-anchor" href="#泛型" aria-hidden="true">#</a> 泛型</h3><h3 id="声明合并"><a class="header-anchor" href="#声明合并" aria-hidden="true">#</a> 声明合并</h3><h3 id="扩展阅读"><a class="header-anchor" href="#扩展阅读" aria-hidden="true">#</a> 扩展阅读</h3><h2 id="工程"><a class="header-anchor" href="#工程" aria-hidden="true">#</a> 工程</h2><h3 id="代码检查"><a class="header-anchor" href="#代码检查" aria-hidden="true">#</a> 代码检查</h3><h3 id="编译选项"><a class="header-anchor" href="#编译选项" aria-hidden="true">#</a> 编译选项</h3>',54)];t.render=function(s,e,t,o,l,c){return n(),a("div",null,p)};export{e as __pageData,t as default};
