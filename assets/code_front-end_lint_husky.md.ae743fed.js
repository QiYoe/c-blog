import{_ as s,c as a,o as n,a as l}from"./app.836e6241.js";const A=JSON.parse('{"title":"Husky","description":"\u524D\u7AEF\u4EE3\u7801\u98CE\u683C\u89C4\u8303\u4E4BHusky","frontmatter":{"head":[["meta",{"name":"description","content":"\u524D\u7AEF\u4EE3\u7801\u98CE\u683C\u89C4\u8303\u4E4BHusky"}],["meta",{"name":"keywords","content":"\u524D\u7AEF\u4EE3\u7801\u98CE\u683C\u89C4\u8303 husky"}]]},"headers":[{"level":2,"title":"\u524D\u7F6E\u77E5\u8BC6","slug":"\u524D\u7F6E\u77E5\u8BC6"},{"level":2,"title":"\u5B89\u88C5","slug":"\u5B89\u88C5"},{"level":2,"title":"\u914D\u7F6E","slug":"\u914D\u7F6E"},{"level":2,"title":"\u9A8C\u8BC1","slug":"\u9A8C\u8BC1"}],"relativePath":"code/front-end/lint/husky.md","lastUpdated":1661337305000}'),p={name:"code/front-end/lint/husky.md"},o=l(`<h1 id="husky" tabindex="-1">Husky <a class="header-anchor" href="#husky" aria-hidden="true">#</a></h1><h2 id="\u524D\u7F6E\u77E5\u8BC6" tabindex="-1">\u524D\u7F6E\u77E5\u8BC6 <a class="header-anchor" href="#\u524D\u7F6E\u77E5\u8BC6" aria-hidden="true">#</a></h2><p>\u5728\u4EE3\u7801\u88AB\u63D0\u4EA4\u5230 <code>Git</code> \u4ED3\u5E93\u4E4B\u524D\uFF0C\u6211\u4EEC\u53EF\u4EE5\u505A\u4E00\u4E9B\u9884\u68C0\u67E5\u6216\u8005\u683C\u5F0F\u5316\u3002\u5177\u4F53\u7684\u505A\u6CD5\u5C31\u662F\u5229\u7528 <code>Git</code> \u63D0\u4EA4\u94A9\u5B50\uFF0C\u5F53\u4F7F\u7528\u94A9\u5B50\u65F6\u4FBF\u4F1A\u89E6\u53D1\u67D0\u4E9B\u683C\u5F0F\u5316\u64CD\u4F5C\u3002</p><p><a href="https://www.npmjs.com/package/husky" target="_blank" rel="noopener noreferrer">husky \u5305</a></p><p><a href="https://typicode.github.io/husky/#/?id=create-a-hook" target="_blank" rel="noopener noreferrer">husky \u5B98\u65B9\u6587\u6863</a></p><h2 id="\u5B89\u88C5" tabindex="-1">\u5B89\u88C5 <a class="header-anchor" href="#\u5B89\u88C5" aria-hidden="true">#</a></h2><div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install husky -D</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#A6ACCD;">yarn add husky -D</span></span>
<span class="line"></span></code></pre></div><h2 id="\u914D\u7F6E" tabindex="-1">\u914D\u7F6E <a class="header-anchor" href="#\u914D\u7F6E" aria-hidden="true">#</a></h2><p>\u5728 <code>package.json</code> \u6587\u4EF6\u4E2D\u6DFB\u52A0\u547D\u4EE4\uFF1A</p><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">prepare</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">husky install</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">test</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u7136\u540E\u8FD0\u884C\u6B64\u547D\u4EE4\uFF08\u542F\u7528 <code>Git</code> \u94A9\u5B50\uFF09\uFF1A</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm prepare</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#A6ACCD;">yarn prepare</span></span>
<span class="line"></span></code></pre></div><p>\u6700\u540E\u521B\u5EFA\u4E00\u4E2A <code>hook</code>\uFF08\u94A9\u5B50\uFF09:</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npx husky add .husky/pre-commit </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">npm test</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u8FD9\u91CC\u4E5F\u53EF\u4EE5\u5982\u6B64\u6DFB\u52A0\uFF08\u63A8\u8350\u4F7F\u7528\u6B64\u79CD\uFF0C\u65B9\u4FBF\u6211\u4EEC\u63A5\u4E0B\u6765\u7684\u6574\u5957\u6D41\u7A0B\u6F14\u793A\uFF09\uFF1A</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npx husky add .husky/commit-msg </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">npx --no-install commitlint --edit $1</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#A6ACCD;">yarn husky add .husky/commit-msg </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">yarn commitlint --edit $1</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span></code></pre></div></div><h2 id="\u9A8C\u8BC1" tabindex="-1">\u9A8C\u8BC1 <a class="header-anchor" href="#\u9A8C\u8BC1" aria-hidden="true">#</a></h2><p>\u8FD0\u884C\uFF1A</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">git add </span><span style="color:#82AAFF;">.</span></span>
<span class="line"><span style="color:#A6ACCD;">git commit -m </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test husky</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span></code></pre></div><p>\u4FBF\u4F1A\u8FD0\u884C <code>test</code> \u547D\u4EE4\uFF0C\u540C\u65F6 <code>commit</code></p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u5728 Windows \u4E0A\u4F7F\u7528 <code>Git Bash</code> \u65F6\uFF0C<code>Git</code> \u94A9\u5B50\u53EF\u80FD\u4F1A\u5931\u8D25\u3002\u5982\u679C Windows \u4E0A\u6709\u7528\u6237\uFF0C\u5F3A\u70C8\u5EFA\u8BAE\u6DFB\u52A0\u4EE5\u4E0B\u53D8\u901A\u65B9\u6CD5:</p><ol><li>\u521B\u5EFA <code>.husky/common.sh</code>:</li></ol><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#82AAFF;">command_exists</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">command</span><span style="color:#A6ACCD;"> -v </span><span style="color:#89DDFF;">&quot;$</span><span style="color:#A6ACCD;">1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">/dev/null </span><span style="color:#89DDFF;">2&gt;&amp;1</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Workaround for Windows 10, Git Bash and Yarn</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> command_exists winpty </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">test</span><span style="color:#A6ACCD;"> -t 1</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">then</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">exec</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;"> /dev/tty</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">fi</span></span>
<span class="line"></span></code></pre></div><ol start="2"><li>\u628A\u5B83\u653E\u5728 <code>Yarn</code> \u7528\u6765\u8FD0\u884C\u547D\u4EE4\u7684\u5730\u65B9:</li></ol><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">#!/bin/sh</span></span>
<span class="line"><span style="color:#82AAFF;">.</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;$(</span><span style="color:#C3E88D;">dirname </span><span style="color:#89DDFF;">&quot;$</span><span style="color:#A6ACCD;">0</span><span style="color:#89DDFF;">&quot;)</span><span style="color:#C3E88D;">/_/husky.sh</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#82AAFF;">.</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;$(</span><span style="color:#C3E88D;">dirname </span><span style="color:#89DDFF;">&quot;$</span><span style="color:#A6ACCD;">0</span><span style="color:#89DDFF;">&quot;)</span><span style="color:#C3E88D;">/common.sh</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">yarn ...</span></span>
<span class="line"></span></code></pre></div></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u4E3B\u8981\u662F\u914D\u5408\u4E00\u4E9B\u683C\u5F0F\u5316\u7684\u547D\u4EE4\uFF0C\u5982 <code>pretty</code> \u3001 <code>commitlint</code> \u7B49</p></div>`,21),e=[o];function c(t,r,i,y,d,D){return n(),a("div",null,e)}var C=s(p,[["render",c]]);export{A as __pageData,C as default};
