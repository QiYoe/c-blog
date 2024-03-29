---
head:
  - - meta
    - name: description
      content: PostCSS
  - - meta
    - name: keywords
      content: PostCSS
---

# PostCSS

## What You Need to Know

### PostCSS in a Nutshell

PostCSS 是一个允许使用 JS 插件转换css的工具。 这些插件可以检查（lint）你的 CSS，支持 CSS Variables 和 Mixins， 编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。

PostCSS 在工业界被广泛地应用，其中不乏很多有名的行业领导者，如：维基百科，Twitter，阿里巴巴， JetBrains。PostCSS 的 Autoprefixer 插件是最流行的 CSS 处理工具之一。

PostCSS 接收一个 CSS 文件并提供了一个 API 来分析、修改它的规则（通过把 CSS 规则转换成一个抽象语法树的方式）。在这之后，这个 API 便可被许多插件利用来做有用的事情，比如寻错或自动添加 CSS vendor 前缀。

> 简而言之，PostCSS 采用了 CSS，并将其转化为一种数据形式，JavaScript 可以对其进行操作。然后基于 javascript 的 PostCSS 插件执行上述代码操作。本身并没有改变你的 CSS，它只是为插件铺平了道路，使它们能够执行它们被设计来进行的任何转换。

对于 PostCSS 插件可以应用于 CSS 的操作类型基本上没有任何限制。如果你能想到的话，你可以编写一个 PostCSS 插件来实现它。

PostCSS 插件可以像预处理器一样运行; 它们可以优化和自动修复代码，它们可以添加未来的语法，它们可以执行链接，它们可以处理变量和逻辑，它们可以提供完整的网格系统，它们可以提供编码快捷方式... ... 列表是长而多样的。

### What PostCSS is Not

- PostCSS is Not a Pre-processor

许多开发者说他们正在放弃 CSS 预处理器，转而使用 PostCSS。与此同时，其他人声称，因为他们喜欢当前的预处理器，他们不喜欢 PostCSS。然而，PostCSS 并不是一个预处理器。

是的，如果你愿意，你完全可以使用它作为一个预处理器，但是你也可以使用 PostCSS，完全没有类似预处理器的功能。你甚至可以继续使用你最喜欢的预处理器和 PostCSS。

- PostCSS is Not a Post-processor

PostCSS 的名字中有“ post”这个词，但它也不是一个真正的“后处理器”。后期处理通常被看作是将一个包含有效/标准 CSS 语法的完成样式表进行处理，以完成添加供应商前缀等工作。然而，PostCSS 并不仅限于以这种方式操作。如上所述，它也可以表现得像一个预处理器。

也许最好把 PostCSS 看作是一种“处理器”，与其说 PostCSS 中的“ post”指的是“ post”处理，还不如说它指的是“ CSS 及其他”。

- PostCSS is Not “Future Syntax”

有一些非常优秀和非常著名的 PostCSS 插件，它们允许你在未来的语法中编写，比如使用将来可用但尚未得到广泛支持的 CSS。然而，PostCSS 并非天生就支持未来的语法。

一些开发人员表示不愿意使用 PostCSS，说这是因为他们不确定自己是否适合编写未来的语法。然而，编写未来的语法只是使用 PostCSS 的许多方法之一。

- PostCSS is Not a Clean Up / Optimization Tool

Autoprefixer plugin的成功导致了人们对 PostCSS 的普遍看法，即你运行完整的 CSS 来清理它，并优化它以提高速度和跨浏览器兼容性。这是我自己的看法，直到我了解到你可以用 PostCSS 实现大量的其他事情。

是的，有很多很棒的插件提供了很好的清理和优化过程，但这些只是提供的插件的一小部分。

- PostCSS is Not Any One Thing

关于 PostCSS 最引人注目的事情是它不局限于任何一种类型的功能; 它代表了一个完全可定制和可配置的功能集，这是潜在的无限的。

### Okay, Let’s Recap

你需要知道的第一件事就是 PostCSS 正在快速发展，而且有充分的理由，所以现在是时候清楚地了解它如何帮助你的开发过程了。

在这篇简介中，我们介绍了 PostCSS 不是什么:
- 它不是预处理器，尽管它可以像预处理器一样有选择地运行
- 它不是一个后处理器，尽管它可以有选择地像处理器一样运行
- 它不是关于“未来语法”，尽管它可以促进对未来语法的支持
- 它不是一个清理/优化工具，尽管它可以提供这样的功能
- 它不是任何一个东西; 它是一种方法，可以根据您的选择配置无限的功能

我们还介绍了 PostCSS 的特别之处:
- 通过插件生态系统提供的多种功能
- 它的模块化，“使用你需要的”性质
- 它的编译时间很快
- 创建自己的插件的可访问性
- 使用常规 CSS 的选项
- 创建不依赖于一个预处理器的库的能力
- 它的无缝部署与许多流行的构建工具

## Instant Setup Options

- 为了让你的 PostCSS 实时展示，尝试 CodePen 或 Prepros 的即时设置
- 提供了10款你可以使用的插件/包
- 在 CodePen 的 CSS 设置中激活 PostCSS，然后使用@规则来启用特定的插件
- 提供了 Autoprefixer 插件和 cssnext 包
- 在 Prepros 项目中的任何 CSS 文件的设置中激活这两个

我们介绍了如何立即使用 CodePen 或 Prepros 开始使用 PostCSS。这些选项都很棒，但是限制性在于你无法控制哪些插件可供你使用。

## Gulp Setup

- 创建一个安装了 Gulp 的 npm 项目，内置一个 Gulpfile
- 安装 gulp-postcss 插件
- 设置 Gulpfile 来加载 gulp 和 gulp-postcss 插件
- 创建一个 gulp 任务来编译 CSS
- 在任务中，设置一个processors数组，pipe你的源代码 CSS 通过postcss()函数，使用processors作为参数传递的数组

从这里，你可以按照相同的基本步骤在你的项目中启用任何 PostCSS 插件:
- 在你的项目中安装插件
`npm install <plugin_name> --save-dev`
- 在 Gulpfile 中定义一个变量来加载插件
`var autoprefixer = require('autoprefixer');`
- 将该变量名添加到preprocessors数组

## Exploring Plugins

正如您将从本系列以前的条目中收集到的那样，PostCSS 是关于插件的。你选择的插件将完全定义你使用 PostCSS 的体验。

### Finding Plugins

- [PostCSS Github Page](https://github.com/postcss/postcss#plugins)
- [Catalog Site postcss.parts](https://www.postcss.parts/)
- [@postcss Twitter](https://twitter.com/postcss)

总结一下对 PostCSS 插件的探索:
- 找到插件[PostCSS Github Page](https://github.com/postcss/postcss#plugins)及[Catalog Site postcss.parts](https://www.postcss.parts/)
- 请继续关注[@postcss Twitter](https://twitter.com/postcss)学习新的插件
- 插件包允许你同时安装几个类似主题的插件
- 插件可以分为很多种类
- 在加载选择的插件时，一定要考虑它们的执行顺序

## Using PostCSS for Cross Browser Compatibility

在本教程中，我们将使用 PostCSS 创建一个跨浏览器兼容的样式表:
- 自动添加供应商前缀
- 为 Internet Explorer 版本8、9和10添加一系列备用方案
- 为尚未得到广泛支持的方法添加备用will-change属性

Recap:
- Autoprefixer 是每个项目都必须使用的工具
- Autoprefixer 可以配置为根据需要支持的任何浏览器添加供应商前缀
- 如果在项目中使用动画，可以考虑使用插件postcss-will-change
- 如果支持 IE8，考虑使用插件 postcss-color-rgba-fallback, postcss-opacity, postcss-pseudoelements 及 postcss-vmin.
- 如果支持 IE8，IE9，IE10考虑使用node-pixrem插件

## Using PostCSS for Minification and Optimization

在本教程中，我们将学习如何使用 PostCSS 来执行各种缩小和优化操作，从而提高样式表的效率和加载速度:
- 将多个样式表通过@import rule,即使有些样式表来自 Bower 组件或 npm 模块，也要确保只需要一个http请求加载你的网站的 CSS
- 将匹配的媒体查询合并到一个查询中，允许您在开发过程中在多个位置使用相同的媒体查询，但最终在最后的样式表中实现合并查询的效率
- 使用cssnano pack从删除空白和注释到减少某些类型的代码等等

### cssnano Plugin Pack

在众多优化中，它可以:
- 去掉空格和最后的分号
- 删除注释
- 优化字体的粗细
- 丢弃重复的规则
- 优化calc()使用
- 缩小选择器
- 最小化手写和属性
- 合并规则

### Recap

- 这个postcss-import插件提供了一种有效的方式来内联样式表
- 它可以用来组合第三方样式表，包括在“bower_components”或“npm_modules”文件夹中自动发现
- 它可以用来让你分割你的样式表成为部分，然后重新组合他们以后
- 这个css-mqpacker插件允许你复制媒体查询，这样你就可以按照你的喜好组织你的 CSS，包括分开的文件，然后在你最终的样式表中组合所有匹配的媒体查询
- 这个cssnano pack集合了大约25种不同的插件，提供了一个即插即用的缩小和优化功能列表
- 它可以配置为使用任何包含的插件，你想要的选项

## Preprocessing with “PreCSS”

在上两个教程中，我们研究了如何在已完成的样式表上使用 PreCSS 来增强跨浏览器的兼容性和优化，本质上是作为一个后处理器。在本教程中，您将学习使用 PostCSS 作为预处理器，就像使用 Stylus、 Sass 或 LESS 一样。

使用 PostCSS 进行预处理主要有两种方式。一个是选择所有你自己的插件来添加你想要的预处理器功能，另一个是安装一个预选插件包，这样你就可以马上开始了。

- 在 PreCSS 中嵌套的工作方式与 Sass 和 LESS 相同
- PreCSS 中的变量使用与 Sass 相同的语法
- PreCSS 中使用@if 和@else 语法存在条件句
- @for 和 @each 循环都可用
- 使用以下语法定义 PreCSS mixin:
`@define-mixin mixin_name $arg1, $arg2 {...}`
- PreCSS mixin 的语法如下:
`@mixin mixin_name pass_arg1, pass_arg2;`
- `@mixin-content` 可以像 Sass 一样使用`@content`
-  PreCSS 中的扩展使用以下语法定义:
`@define-extend extend_name {...}`
- 使用 Extends 语法:
`@extend extend_name;`
- `@import` 引用外部 CSS 文件，特别是有助于使用局部

## Shortcuts and Shorthand

- 每天做一些小的编码任务看起来不像是单独的，但是它们加起来总共会花费大量的时间，所以缩短它们是值得的
- 这个postcss-alias插件可以让你创建自己的速记属性
- 这个postcss-crip插件有数以百计的预定义属性
- 这个postcss-font-magician让你使用自定义字体，好像它们是默认字体，自动生成@font-face你的代码
- 这个postcss-circle及postcss-triangle插件使得创建 CSS 圆形和三角形变得直观和直观
- 这个postcss-all-link-colors插件可以让你一次输出所有链接状态的颜色
- 这个postcss-center插件提供垂直和水平中心与top: center; and 及left: center;
- 这个postcss-clearfix插件可以让你输出 clearfix 代码与clear: fix;
- 这个postcss-position插件允许你添加你的top, right, bottom and 及left设置为您使用的一部分position属性
- 这个postcss-size插件可以让你一次设置宽度和高度
- 这个postcss-verthorz插件允许水平间距和垂直间距与单一规则输出
- 这个postcss-color-short插件使你能够使用一个和两个数字六码，和其他颜色快捷方式
































:::warning 提示
上述内容过程在[**<u>PostCSS Deep Dive</u>**](https://webdesign.tutsplus.com/series/postcss-deep-dive--cms-889)可查看。更多内容请看[**<u>the PostCSS Github repo</u>**](https://github.com/postcss/postcss#plugins)
:::
