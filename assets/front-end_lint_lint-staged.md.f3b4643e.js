import{_ as n,c as s,o as a,d as t}from"./app.51cce2b7.js";const q='{"title":"Lint-staged","description":"\u524D\u7AEF\u4EE3\u7801\u98CE\u683C\u89C4\u8303","frontmatter":{"title":"Lint-staged","head":[["meta",{"name":"description","content":"\u524D\u7AEF\u4EE3\u7801\u98CE\u683C\u89C4\u8303"}],["meta",{"name":"keywords","content":"\u524D\u7AEF\u4EE3\u7801\u98CE\u683C\u89C4\u8303 Lint-staged"}]]},"headers":[{"level":2,"title":"\u524D\u7F6E\u77E5\u8BC6","slug":"\u524D\u7F6E\u77E5\u8BC6"},{"level":2,"title":"\u5B89\u88C5","slug":"-1"},{"level":2,"title":"\u914D\u7F6E","slug":"-2"},{"level":2,"title":"\u76F8\u5173\u914D\u5957\u5DE5\u5177","slug":"-3"},{"level":3,"title":"Prettier","slug":"prettier"},{"level":3,"title":"Eslint","slug":"eslint"},{"level":3,"title":"Stylelint","slug":"stylelint"},{"level":3,"title":"\u5176\u4ED6\u4E00\u4E9B\u901A\u7528\u6587\u4EF6\u914D\u7F6E","slug":"-10"},{"level":2,"title":"\u9A8C\u8BC1","slug":"-11"}],"relativePath":"front-end/lint/lint-staged.md","lastUpdated":1639495017977}',p={},o=t(`<h2 id="" tabindex="-1"><a class="header-anchor" href="#">#</a> \u524D\u7F6E\u77E5\u8BC6</h2><p><code>lint-staged</code> \u662F\u4E00\u4E2A\u524D\u7AEF\u6587\u4EF6\u8FC7\u6EE4\u5DE5\u5177\uFF0C\u5B83\u4EC5\u8FC7\u6EE4 <code>Git</code> \u4EE3\u7801\u6682\u5B58\u533A\u6587\u4EF6\u3002\u5F53 <code>git commit</code> \u65F6\uFF0C<code>pre-commit</code> \u94A9\u5B50\u4F1A\u542F\u52A8\uFF0C\u6267\u884C <code>lint-staged</code> \u547D\u4EE4\u3002</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p><code>lint-staged</code> \u4EC5\u4EC5\u662F\u4E00\u4E2A\u6587\u4EF6\u8FC7\u6EE4\u5DE5\u5177\uFF0C\u4E0D\u6D89\u53CA\u4EE3\u7801\u683C\u5F0F\u5316\uFF01\uFF01\uFF01</p></div><h2 id="-1" tabindex="-1"><a class="header-anchor" href="#-1">#</a> \u5B89\u88C5</h2><div class="language-shell"><pre><code><span class="token function">npm</span> <span class="token function">install</span> lint-staged -D
<span class="token comment"># or</span>
<span class="token function">yarn</span> <span class="token function">add</span> lint-staged -D
</code></pre></div><h2 id="-2" tabindex="-1"><a class="header-anchor" href="#-2">#</a> \u914D\u7F6E</h2><p>\u5728 <code>.husky</code> \u6587\u4EF6\u5939\u4E0B\u521B\u5EFA <code>lintstagedrc.js</code> \u6587\u4EF6\uFF1A</p><div class="language-js"><pre><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token string">&#39;*.{js,jsx,ts,tsx}&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;eslint --fix&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;prettier --write&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string">&#39;{!(package)*.json,*.code-snippets,.!(browserslist)*rc}&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;prettier --write--parser json&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string">&#39;package.json&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;prettier --write&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string">&#39;*.vue&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;eslint --fix&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;prettier --write&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;stylelint --fix&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string">&#39;*.{scss,less,styl,html}&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;stylelint --fix&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;prettier --write&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string">&#39;*.md&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;prettier --write&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>\u5728 <code>.husky</code> \u6587\u4EF6\u5939\u4E0B\u7684 <code>pre-commit</code> \u4E2D\u6DFB\u52A0\uFF1A</p><div class="language-shell"><pre><code><span class="token shebang important">#!/bin/sh</span>
<span class="token builtin class-name">.</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">dirname</span> <span class="token string">&quot;<span class="token variable">$0</span>&quot;</span><span class="token variable">)</span></span>/_/husky.sh&quot;</span>
<span class="token builtin class-name">.</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">dirname</span> <span class="token string">&quot;<span class="token variable">$0</span>&quot;</span><span class="token variable">)</span></span>/common.sh&quot;</span>

<span class="token punctuation">[</span> -n <span class="token string">&quot;<span class="token variable">$CI</span>&quot;</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">exit</span> <span class="token number">0</span>

<span class="token comment"># Format and submit code according to lintstagedrc.js configuration</span>
<span class="token function">npm</span> run lint:lint-staged
<span class="token comment"># \u4EE5\u4E0A\u547D\u4EE4 &quot;lint-staged -c ./.husky/lintstagedrc.js&quot;</span>
</code></pre></div><h2 id="-3" tabindex="-1"><a class="header-anchor" href="#-3">#</a> \u76F8\u5173\u914D\u5957\u5DE5\u5177</h2><p>\u8FD9\u91CC\u662F\u6240\u9700\u7684\u683C\u5F0F\u5316\u5DE5\u5177</p><h3 id="prettier" tabindex="-1"><a class="header-anchor" href="#prettier">#</a> Prettier</h3><p><code>prettier</code> \u662F\u5BF9\u5168\u91CF\u7684\u4EE3\u7801\u8FDB\u884C\u683C\u5F0F\u5316\u3002\u5C06\u4EE3\u7801\u89E3\u6790\u4E3A <code>AST</code> \uFF0C\u7136\u540E\u91CD\u65B0\u7EC4\u88C5\uFF0C\u76EE\u7684\u662F\u6700\u7EC8\u8F93\u51FA\u98CE\u683C\u7EDF\u4E00\u7684\u4EE3\u7801\u3002\u800C <code>eslint</code> \u53EA\u662F\u5BF9\u6709\u95EE\u9898\u7684\u5730\u65B9\u8FDB\u884C\u683C\u5F0F\u5316\u4FEE\u6539\uFF0C\u4E0D\u6539\u52A8\u6E90\u4EE3\u7801\u98CE\u683C</p><h4 id="-4" tabindex="-1"><a class="header-anchor" href="#-4">#</a> \u5B89\u88C5</h4><div class="language-shell"><pre><code><span class="token function">npm</span> <span class="token function">install</span> -D prettier
<span class="token comment"># or</span>
<span class="token function">yarn</span> <span class="token function">add</span> -D prettier
</code></pre></div><h4 id="-5" tabindex="-1"><a class="header-anchor" href="#-5">#</a> \u914D\u7F6E</h4><p>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6DFB\u52A0 <code>prettier.config.js</code> :</p><div class="language-js"><pre><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  printWidth<span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
  tabWidth<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  useTabs<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  semi<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  vueIndentScriptAndStyle<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  singleQuote<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  quoteProps<span class="token operator">:</span> <span class="token string">&#39;as-needed&#39;</span><span class="token punctuation">,</span>
  bracketSpacing<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  trailingComma<span class="token operator">:</span> <span class="token string">&#39;es5&#39;</span><span class="token punctuation">,</span>
  jsxBracketSameLine<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  jsxSingleQuote<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  arrowParens<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
  insertPragma<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  requirePragma<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  proseWrap<span class="token operator">:</span> <span class="token string">&#39;never&#39;</span><span class="token punctuation">,</span>
  htmlWhitespaceSensitivity<span class="token operator">:</span> <span class="token string">&#39;strict&#39;</span><span class="token punctuation">,</span>
  endOfLine<span class="token operator">:</span> <span class="token string">&#39;auto&#39;</span><span class="token punctuation">,</span>
  rangeStart<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6DFB\u52A0 <code>.prettierignore</code> :</p><div class="language-tex"><pre><code>/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
</code></pre></div><p>\u5728 <code>.husky</code> \u6587\u4EF6\u5939\u4E0B\u7684 <code>pre-commit</code> \u4E2D\u6DFB\u52A0\uFF1A</p><div class="language-shell"><pre><code><span class="token punctuation">..</span>.
<span class="token function">npm</span> run lint:pretty
<span class="token comment"># \u4EE5\u4E0A\u547D\u4EE4 &quot;pretty-quick --staged&quot;</span>
</code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p><code>pretty-quick</code> \u7684\u4F5C\u7528\u662F\u5728\u66F4\u6539\u7684\u6587\u4EF6\u4E2D\u8FD0\u884C <code>prettier</code></p></div><p>\u5728 package.json \u6587\u4EF6\u4E2D\u6DFB\u52A0\u547D\u4EE4\uFF1A</p><div class="language-json"><pre><code><span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  ...
  <span class="token property">&quot;lint:prettier&quot;</span><span class="token operator">:</span> <span class="token string">&quot;prettier --write  \\&quot;docs/**/*.{js,json,tsx,css,less,scss,vue,html,md}\\&quot;&quot;</span>
<span class="token punctuation">}</span>
</code></pre></div><p><strong>\u9879\u76EE\u63D0\u4EA4\u524D\u53EF\u4EE5\u5148\u8FD0\u884C\u6B64\u547D\u4EE4</strong></p><h3 id="eslint" tabindex="-1"><a class="header-anchor" href="#eslint">#</a> Eslint</h3><p><code>eslint</code> \u4E3B\u8981\u4F5C\u7528\u662F\u4EE3\u7801\u89C4\u5219\u6821\u9A8C\uFF0C\u662F\u4EE3\u7801\u66F4\u52A0\u4E00\u81F4\u5E76\u907F\u514D\u9519\u8BEF\u3002</p><h4 id="-6" tabindex="-1"><a class="header-anchor" href="#-6">#</a> \u5B89\u88C5</h4><div class="language-shell"><pre><code><span class="token function">npm</span> <span class="token function">install</span> -D eslint eslint-config-prettier eslint-define-config eslint-plugin-prettier
<span class="token comment"># or</span>
<span class="token function">yarn</span> <span class="token function">add</span> -D eslint eslint-config-prettier eslint-define-config eslint-plugin-prettier
</code></pre></div><h4 id="-7" tabindex="-1"><a class="header-anchor" href="#-7">#</a> \u914D\u7F6E</h4><p>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6DFB\u52A0 <code>eslintrc.js</code> :</p><div class="language-js"><pre><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// @ts-check</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;eslint-define-config&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  root<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  env<span class="token operator">:</span> <span class="token punctuation">{</span>
    browser<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    node<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    es6<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  parser<span class="token operator">:</span> <span class="token string">&#39;vue-eslint-parser&#39;</span><span class="token punctuation">,</span>
  parserOptions<span class="token operator">:</span> <span class="token punctuation">{</span>
    parser<span class="token operator">:</span> <span class="token string">&#39;@typescript-eslint/parser&#39;</span><span class="token punctuation">,</span>
    ecmaVersion<span class="token operator">:</span> <span class="token number">2020</span><span class="token punctuation">,</span>
    sourceType<span class="token operator">:</span> <span class="token string">&#39;module&#39;</span><span class="token punctuation">,</span>
    jsxPragma<span class="token operator">:</span> <span class="token string">&#39;React&#39;</span><span class="token punctuation">,</span>
    ecmaFeatures<span class="token operator">:</span> <span class="token punctuation">{</span>
      jsx<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">extends</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&#39;plugin:vue/vue3-recommended&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;plugin:@typescript-eslint/recommended&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;prettier&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;plugin:prettier/recommended&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">// &#39;plugin:jest/recommended&#39;,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  rules<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string">&#39;vue/script-setup-uses-vars&#39;</span><span class="token operator">:</span> <span class="token string">&#39;error&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/ban-ts-ignore&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/explicit-function-return-type&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/no-explicit-any&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/no-var-requires&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/no-empty-function&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/custom-event-name-casing&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;no-use-before-define&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/no-use-before-define&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/ban-ts-comment&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/ban-types&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/no-non-null-assertion&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/explicit-module-boundary-types&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;@typescript-eslint/no-unused-vars&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">&#39;error&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        argsIgnorePattern<span class="token operator">:</span> <span class="token string">&#39;^_&#39;</span><span class="token punctuation">,</span>
        varsIgnorePattern<span class="token operator">:</span> <span class="token string">&#39;^_&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;no-unused-vars&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">&#39;error&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        argsIgnorePattern<span class="token operator">:</span> <span class="token string">&#39;^_&#39;</span><span class="token punctuation">,</span>
        varsIgnorePattern<span class="token operator">:</span> <span class="token string">&#39;^_&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;space-before-function-paren&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>

    <span class="token string">&#39;vue/attributes-order&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/one-component-per-file&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/html-closing-bracket-newline&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/max-attributes-per-line&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/multiline-html-element-content-newline&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/singleline-html-element-content-newline&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/attribute-hyphenation&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/require-default-prop&#39;</span><span class="token operator">:</span> <span class="token string">&#39;off&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue/html-self-closing&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">&#39;error&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        html<span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token keyword">void</span><span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
          normal<span class="token operator">:</span> <span class="token string">&#39;never&#39;</span><span class="token punctuation">,</span>
          component<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        svg<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
        math<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6DFB\u52A0 <code>eslintignore</code> :</p><div class="language-tex"><pre><code>*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
Dockerfile
</code></pre></div><p>\u5728 <code>package.json</code> \u6587\u4EF6\u4E2D\u6DFB\u52A0\u547D\u4EE4\uFF1A</p><div class="language-json"><pre><code><span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  ...
  <span class="token property">&quot;lint:eslint&quot;</span><span class="token operator">:</span> <span class="token string">&quot;eslint --cache --max-warnings 0  \\&quot;{docs,mock}/**/*.{vue,ts,tsx}\\&quot; --fix&quot;</span>
<span class="token punctuation">}</span>
</code></pre></div><p><strong>\u9879\u76EE\u63D0\u4EA4\u524D\u53EF\u4EE5\u5148\u8FD0\u884C\u6B64\u547D\u4EE4</strong></p><h3 id="stylelint" tabindex="-1"><a class="header-anchor" href="#stylelint">#</a> Stylelint</h3><p>\u901A\u8FC7\u5B9A\u4E49\u4E00\u7CFB\u5217\u7684\u7F16\u7801\u98CE\u683C\u89C4\u5219\u5E2E\u52A9\u6211\u4EEC\u907F\u514D\u5728\u6837\u5F0F\u8868\u4E2D\u51FA\u73B0\u9519\u8BEF\u3002</p><h4 id="-8" tabindex="-1"><a class="header-anchor" href="#-8">#</a> \u5B89\u88C5</h4><div class="language-shell"><pre><code><span class="token function">npm</span> <span class="token function">install</span> -D stylelint stylelint-config-prettier stylelint-config-standard stylelint-order
<span class="token comment"># or</span>
<span class="token function">yarn</span> <span class="token function">add</span> -D stylelint stylelint-config-prettier stylelint-config-standard stylelint-order
</code></pre></div><h4 id="-9" tabindex="-1"><a class="header-anchor" href="#-9">#</a> \u914D\u7F6E</h4><p>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6DFB\u52A0 <code>stylelint.config.js</code> :</p><div class="language-js"><pre><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  root<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  plugins<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;stylelint-order&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token keyword">extends</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;stylelint-config-standard&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;stylelint-config-prettier&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  rules<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string">&#39;selector-pseudo-class-no-unknown&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        ignorePseudoClasses<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;global&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;selector-pseudo-element-no-unknown&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        ignorePseudoElements<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;v-deep&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;at-rule-no-unknown&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        ignoreAtRules<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token string">&#39;tailwind&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;apply&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;variants&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;responsive&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;screen&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;function&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;if&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;each&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;include&#39;</span><span class="token punctuation">,</span>
          <span class="token string">&#39;mixin&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;no-empty-source&#39;</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&#39;named-grid-areas-no-invalid&#39;</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&#39;unicode-bom&#39;</span><span class="token operator">:</span> <span class="token string">&#39;never&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;no-descending-specificity&#39;</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&#39;font-family-no-missing-generic-family-keyword&#39;</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token string">&#39;declaration-colon-space-after&#39;</span><span class="token operator">:</span> <span class="token string">&#39;always-single-line&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;declaration-colon-space-before&#39;</span><span class="token operator">:</span> <span class="token string">&#39;never&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">// &#39;declaration-block-trailing-semicolon&#39;: &#39;always&#39;,</span>
    <span class="token string">&#39;rule-empty-line-before&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        ignore<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;after-comment&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;first-nested&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;unit-no-unknown&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> ignoreUnits<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;rpx&#39;</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token string">&#39;order/order&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">[</span>
        <span class="token string">&#39;dollar-variables&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;custom-properties&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;at-rules&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;declarations&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          type<span class="token operator">:</span> <span class="token string">&#39;at-rule&#39;</span><span class="token punctuation">,</span>
          name<span class="token operator">:</span> <span class="token string">&#39;supports&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          type<span class="token operator">:</span> <span class="token string">&#39;at-rule&#39;</span><span class="token punctuation">,</span>
          name<span class="token operator">:</span> <span class="token string">&#39;media&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token string">&#39;rules&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> severity<span class="token operator">:</span> <span class="token string">&#39;warning&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  ignoreFiles<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;**/*.js&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;**/*.jsx&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;**/*.tsx&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;**/*.ts&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u6DFB\u52A0 <code>.stylelintignore</code> :</p><div class="language-tex"><pre><code>/dist/*
/public/*
public/*
</code></pre></div><h3 id="-10" tabindex="-1"><a class="header-anchor" href="#-10">#</a> \u5176\u4ED6\u4E00\u4E9B\u901A\u7528\u6587\u4EF6\u914D\u7F6E</h3><p><code>.gitignore</code> :</p><div class="language-txe"><pre><code>.DS_Store
node_modules
dist
.npmrc
.cache

yarn.lock
package-lock.json

tests/server/static
tests/server/static/upload
test/unit/coverage
test/e2e/reports

.local
# local env files
.env.local
.env.*.local
.eslintcache

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
selenium-debug.log
pnpm-debug.log*

# Editor directories and files
.idea
# .vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
</code></pre></div><p>\u6839\u76EE\u5F55\u4E0B <code>.vscode</code> \u6587\u4EF6\u5939\u4E0B <code>.extensios.json</code> :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;recommendations&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;octref.vetur&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;dbaeumer.vscode-eslint&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;stylelint.vscode-stylelint&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;esbenp.prettier-vscode&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;mrmlnc.vscode-less&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;lokalise.i18n-ally&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;antfu.iconify&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;mikestead.dotenv&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;heybourn.headwind&quot;</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u6839\u76EE\u5F55\u4E0B <code>.vscode</code> \u6587\u4EF6\u5939\u4E0B <code>.launch.json</code> :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0.2.0&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;configurations&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;chrome&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;request&quot;</span><span class="token operator">:</span> <span class="token string">&quot;launch&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Launch Chrome&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://localhost:3100&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;webRoot&quot;</span><span class="token operator">:</span> <span class="token string">&quot;\${workspaceFolder}/docs&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;sourceMaps&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u6839\u76EE\u5F55\u4E0B <code>.vscode</code> \u6587\u4EF6\u5939\u4E0B <code>.settings.json</code> :</p><div class="language-json"><pre><code><span class="token punctuation">{</span>
  <span class="token property">&quot;typescript.tsdk&quot;</span><span class="token operator">:</span> <span class="token string">&quot;./node_modules/typescript/lib&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;typescript.enablePromptUseWorkspaceTsdk&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;volar.tsPlugin&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;volar.tsPluginStatus&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token comment">//===========================================</span>
  <span class="token comment">//============= Editor ======================</span>
  <span class="token comment">//===========================================</span>
  <span class="token property">&quot;explorer.openEditors.visible&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token property">&quot;editor.tabSize&quot;</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;diffEditor.ignoreTrimWhitespace&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token comment">//===========================================</span>
  <span class="token comment">//============= Other =======================</span>
  <span class="token comment">//===========================================</span>
  <span class="token property">&quot;breadcrumbs.enabled&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;open-in-browser.default&quot;</span><span class="token operator">:</span> <span class="token string">&quot;chrome&quot;</span><span class="token punctuation">,</span>
  <span class="token comment">//===========================================</span>
  <span class="token comment">//============= files =======================</span>
  <span class="token comment">//===========================================</span>
  <span class="token property">&quot;files.eol&quot;</span><span class="token operator">:</span> <span class="token string">&quot;\\n&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;search.exclude&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;**/node_modules&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/*.log&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/*.log*&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/bower_components&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/dist&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/elehukouben&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.git&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.gitignore&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.svn&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.DS_Store&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.idea&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.vscode&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/yarn.lock&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/tmp&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;out&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;dist&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;node_modules&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;CHANGELOG.md&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;examples&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;res&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;screenshots&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;yarn-error.log&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.yarn&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;files.exclude&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;**/.cache&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.editorconfig&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.eslintcache&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/bower_components&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.idea&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/tmp&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.git&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.svn&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.hg&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/CVS&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.DS_Store&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;files.watcherExclude&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;**/.git/objects/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.git/subtree-cache/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/.vscode/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/node_modules/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/tmp/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/bower_components/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/dist/**&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;**/yarn.lock&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;stylelint.enable&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;stylelint.packageManager&quot;</span><span class="token operator">:</span> <span class="token string">&quot;yarn&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;liveServer.settings.donotShowInfoMsg&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;telemetry.enableCrashReporter&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token property">&quot;workbench.settings.enableNaturalLanguageSearch&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token property">&quot;path-intellisense.mappings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;/@/&quot;</span><span class="token operator">:</span> <span class="token string">&quot;\${workspaceRoot}/docs&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;prettier.requireConfig&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;typescript.updateImportsOnFileMove.enabled&quot;</span><span class="token operator">:</span> <span class="token string">&quot;always&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;workbench.sideBar.location&quot;</span><span class="token operator">:</span> <span class="token string">&quot;left&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[javascriptreact]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[typescript]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[typescriptreact]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[html]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[css]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[less]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[scss]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[markdown]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;editor.codeActionsOnSave&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;source.fixAll.eslint&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[vue]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.codeActionsOnSave&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;source.fixAll.eslint&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.localesPaths&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;src/locales/lang&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.keystyle&quot;</span><span class="token operator">:</span> <span class="token string">&quot;nested&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.sortKeys&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.namespace&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.pathMatcher&quot;</span><span class="token operator">:</span> <span class="token string">&quot;{locale}/{namespaces}.{ext}&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.enabledParsers&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;ts&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.sourceLanguage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;en&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.displayLanguage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;zh-CN&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;i18n-ally.enabledFrameworks&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;vue&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">&quot;cSpell.words&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;vben&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;windi&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;browserslist&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;tailwindcss&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;esnext&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;antv&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;tinymce&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;qrcode&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;sider&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;pinia&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;sider&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;nprogress&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;INTLIFY&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;stylelint&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;esno&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;vitejs&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;sortablejs&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;mockjs&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;codemirror&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;iconify&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;commitlint&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;vditor&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;echarts&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;cropperjs&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;logicflow&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;vueuse&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;zxcvbn&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;lintstagedrc&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;brotli&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;tailwindcss&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;sider&quot;</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="-11" tabindex="-1"><a class="header-anchor" href="#-11">#</a> \u9A8C\u8BC1</h2><div class="language-shell"><pre><code><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
<span class="token function">git</span> pull
<span class="token function">git</span> commit -m <span class="token string">&#39;test: \u6D4B\u8BD5\u524D\u7AEF\u4EE3\u7801\u89C4\u8303\u529F\u80FD&#39;</span>
</code></pre></div><p>\u5982\u679C\u786E\u4FDD\u4E86\u81EA\u5DF1\u7684\u4EE3\u7801\u786E\u5B9E\u6CA1\u95EE\u9898\uFF0C\u800C\u5374\u62A5\u9519\u59CB\u7EC8\u6210\u529F\u4E0D\u4E86\uFF0C\u5219\u53EF\u4EE5\u6DFB\u52A0 <code>--no-verify</code>:</p><div class="language-shell"><pre><code><span class="token function">git</span> commit -m <span class="token string">&#39;test: \u6D4B\u8BD5\u524D\u7AEF\u4EE3\u7801\u89C4\u8303\u529F\u80FD&#39;</span> --no-verify
</code></pre></div>`,61),e=[o];function c(l,u,r,i,k,d){return a(),s("div",null,e)}var y=n(p,[["render",c]]);export{q as __pageData,y as default};
