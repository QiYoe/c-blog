---
title: CSS揭秘
head:
  - - meta
    - name: description
      content: CSS揭秘
  - - meta
    - name: keywords
      content: CSS揭秘 css-secrets
---

## 前置知识

### css 3d坐标轴空间

<div align="center"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/css-3d.jpg" width="300" align="center"/></div>

**正向轴对着眼睛，顺时针则旋转角度为正，逆时针则旋转角度为负。**

或者用左手法则也行：**伸出左手，大拇指指向正轴方向，四个手指的指向即是旋转正向，但务必记住是左手！**

- rotate3d
  - rotateX +顺时针旋转，-逆时针旋转（X轴垂直平面）
  - rotateY +顺时针旋转，-逆时针旋转（Y轴垂直平面）
  - rotateZ +顺时针旋转，-逆时针旋转（Z轴垂直平面）
- scale3d
  - scaleX +顺时针旋转，-逆时针旋转（X轴垂直平面）
  - scaleY +顺时针旋转，-逆时针旋转（Y轴垂直平面）
  - scaleZ +顺时针旋转，-逆时针旋转（Z轴垂直平面）
- translate3d
  - translateX +顺时针旋转，-逆时针旋转（X轴垂直平面）
  - translateY +顺时针旋转，-逆时针旋转（Y轴垂直平面）

### css 2d坐标轴空间

<div align="center"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/css-2d.png" width="300" align="center"/></div>

- rotate 顺时针为+，逆时针为-
- translate x为横轴，y为纵轴
- scale x为横轴，y为纵轴
- skew
  - skewX +顺时针旋转，-逆时针旋转
  - skewY +顺时针旋转，-逆时针旋转

## 边框与背景

### 半透明边框

> 背景知识：:point_right: [background-clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip)

默认情况下，背景的颜色会延伸至边框下层，这意味着我们设置的透明边框效果会被覆盖掉，在css3中，我们可以通过设置`background-clip:padding-box`来改变背景的默认行为，达到我们想要的效果。

<CodePen title="translucent-borders" slug="QWvzYGx" tab="js,result" :editable="true" :preview="true" :height="350" />

### 多重边框

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [outline](https://developer.mozilla.org/zh-CN/docs/Web/CSS/outline), [outline-offset](https://developer.mozilla.org/zh-CN/docs/Web/CSS/outline-offset)

`box-shadow`相信很多人都已经用透了，可用来给元素添加各种阴影效果，反过来，也只有我们需要实现阴影时才会想起它，其实，`box-shadow`还接受第四个参数作为阴影扩张半径，当我们只设置扩张半径时，零偏移，零模糊，产生的效果其实相当于一条实线“**边框**”。

`box-shadow`只能模拟实线边框效果，某些情况下，我们可能需要生成虚线的边框效果，我们可以通过类似于`border`的描边`outline`和对应的描边偏移`outline-offset`来实现。

<CodePen title="multiple-borders" slug="WNjLmoq" tab="js,result" :editable="true" :preview="true" :height="370" />

### 边框内圆角

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [outline](https://developer.mozilla.org/zh-CN/docs/Web/CSS/outline)

我们知道`box-shadow`是会紧贴`border-radius`圆角边的，但是，描边`outline`并不会与圆角边`border-radius`贴合，我们可以将两者组合，通过`box-shadow`去填补描边`outline`所产生的间隙来达到我们想要的效果。

:::danger 关于扩张半径的取值？
假设圆角`border-radius`的半径为`r`,根据勾股定理，扩张半径的最小值应等于`(√2−1)r ~= 3.314`，最大值不能超过描边宽度，即`6px`。
:::

<CodePen title="inner-rounding" slug="NWjoNbX" tab="js,result" :editable="true" :preview="true" :height="370" />

### 背景定位

> 背景知识：:point_right: [background-position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position), [background-origin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-origin), [calc](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)

<CodePen title="extended-bg-position" slug="MWmLvzQ" tab="js,result" :editable="true" :preview="true" :height="370" />

### 条纹背景

> 背景知识：:point_right: [gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient), [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient), [radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/radial-gradient), [repeating-linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/repeating-linear-gradient)

- 进度条

<CodePen title="stripes-background-linear" slug="OJmdOaG" tab="js,result" :editable="true" :preview="true" :height="370" />

- 不规则卡片

<CodePen title="stripes-background-radial" slug="NWjoOgX" tab="js,result" :editable="true" :preview="true" :height="370" />

> 示例中为了实现:hover时有贴边的阴影，所以采用了`radial-gradient`。

### 1px 线/边

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform), [@media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)

- `box-shadow` + `transform` 实现 1px 线条

<CodePen title="one-pixel-line" slug="NWjoOgX" tab="js,result" :editable="true" :preview="true" :height="370" />

- `border` + `伪元素` + `transform` 实现 1px 独立边框 :thumbsup:

<CodePen title="one-pixel-line-border" slug="wvdNQWY" tab="js,result" :editable="true" :preview="true" :height="370" />

## 常见形状

### 圆与椭圆

> 背景知识：:point_right: [border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)

通常我们一般使用`border-radius`来时实现圆角效果，其实`border-radius`是可以单独指定它的半长轴和半短轴，只需要用“/”分割即可。我们可以通过这个属性轻松实现半圆、半椭圆、四分之一圆及四分之一圆等常见的图形。

<CodePen title="ellipse" slug="vYmbQWR" tab="js,result" :editable="true" :preview="true" :height="370" />

### parallel四边形

> 背景知识：:point_right: [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform), [clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)

<CodePen title="parallelogram" slug="ExmMaxv" tab="js,result" :editable="true" :preview="true" :height="480" />

### 切角效果

> 背景知识：:point_right: [gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient), [clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)

<CodePen title="bevel-corners" slug="MWmxKaj" tab="js,result" :editable="true" :preview="true" :height="480" />

### 简易饼图

> 背景知识：:point_right: [gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient), [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation), [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial)

<CodePen title="pie-chart" slug="yLbwOBp" tab="js,result" :editable="true" :preview="true" :height="480" />

### 提示气泡

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform), [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

- `dark`主题

<CodePen title="poptip-dark" slug="ZEKPXWo" tab="js,result" :editable="true" :preview="true" :height="480" />

- `light`主题：`filter: drop-shadow()`

<CodePen title="poptip-light" slug="LYyaebm" tab="js,result" :editable="true" :preview="true" height="480" />

- 什么是“CSS Filter Effects”？

[cinwell website](https://www.bestagencies.com/tools/filter-effects-css-generator/)

### 其他多边形

> 背景知识：:point_right: [box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

<CodePen title="polygon" slug="OJmqaBB" tab="js,result" :editable="true" :preview="true" height="480" />

## 视觉效果

### 常见投影

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)

<CodePen title="single-projection" slug="VwbRqbG" tab="js,result" :editable="true" :preview="true" height="480" />

### 不规则投影

> 背景知识：:point_right: [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter), [radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/radial-gradient), [border-image](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image)

<CodePen title="irregular-projection" slug="VwbRqbG" tab="js,result" :editable="true" :preview="true" height="480" />

### 毛玻璃投影

> 背景知识：:point_right: [hsla/rgba](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)

:::warning 注意
background: `background-color`, `background-image`, `background-repeat`, `background-attachment`, `background-position / background-size`, `background-origin`, `background-clip`

font: `font-style`, `font-variant`, `font-weight`, `font-size/line-height`, `font-family`
:::

<CodePen title="frosted-glass" slug="YzVmORx" tab="js,result" :editable="true" :preview="true" height="480" />

### 斑马条纹

> 背景知识：:point_right: [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient)

<CodePen title="zebra-stripes" slug="eYWqQqQ" tab="js,result" :editable="true" :preview="true" height="480" />

### 文字特效

> 背景知识：:point_right: [text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow), [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter), [-webkit-text-fill-color](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-fill-color), [-webkit-text-stroke](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-stroke)

<CodePen title="text-effects" slug="ExmqGvx" tab="js,result" :editable="true" :preview="true" height="480" />

### 文本截断（溢出）

<CodePen title="text-overflow" slug="eYROZMd" tab="js,result" :editable="true" :preview="true" height="480" />

### 环形文字

> 背景知识：:point_right: [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG), [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)

<CodePen title="circular-text" slug="Rwgbaeq" tab="js,result" :editable="true" :preview="true" height="480" />

### 插入换行

> 背景知识：:point_right: [Unicode](https://en.wikipedia.org/wiki/Unicode), [white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)

在[Unicode](http://www.ssec.wisc.edu/~tomw/java/unicode.html)中，`0x000A`字符是专门控制换行的。在`CSS`中，我们可以写为`\000A`或`\A`,我们可以用它来作为`::after`伪元素的内容，并将其添加到指定元素的尾部，实现换行效果。

<CodePen title="circular-text" slug="mdwbEEZ" tab="js,result" :editable="true" :preview="true" height="480" />

:::warning 注意
上述代码中，通过伪元素在多个`span.bold`元素间添加的逗号前面会有一个空格，负外边距`margin-left: -.25em;`的作用是抵消所出现的空隙。
:::

### 图片对比控件

> 背景知识：:point_right: [resize](https://developer.mozilla.org/zh-CN/docs/Web/CSS/resize), HTML < [input[type=range]](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) >

<CodePen title="circular-text" slug="yLXBJEP" tab="js,result" :editable="true" :preview="true" height="480" />

> 创造良好的用户体验应当养成一种习惯~

## 用户体验

> 创造良好的用户体验应当养成一种习惯~

### 选择合适的鼠标光标

> 背景知识：:point_right: [cursor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)

<CodePen title="mouse-cursor" slug="QWgLmLj" tab="js,result" :editable="true" :preview="true" height="480" />

### 扩大可点击区域

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

<CodePen title="mouse-cursor" slug="XWgrEKz" tab="js,result" :editable="true" :preview="true" height="480" />

### 自定义复选框

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

<CodePen title="custom-checkbox" slug="YzQKaNg" tab="js,result" :editable="true" :preview="true" height="480" />

### 自定义单选框

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

<CodePen title="custom-radio" slug="MWogVLQ" tab="js,result" :editable="true" :preview="true" height="480" />

### 自定义开关选择器

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [伪元素](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Introduction_to_CSS/Pseudo-classes_and_pseudo-elements#%E4%BC%AA%E5%85%83%E7%B4%A0)

同自定义复选框或自定义单选框类似，都是利用一个隐藏的`input(:checked)`元素 + 一个关联的`label`元素，通过`label`元素及其伪元素模拟switch选择器，通过`input`的`:checked`属性来模拟`switch`状态是否开启。

<CodePen title="custom-radio" slug="abwoYrP" tab="js,result" :editable="true" :preview="true" height="480" />

### 输入框完美居中

<CodePen title="input-align" slug="yLXBEem" tab="js,result" :editable="true" :preview="true" height="480" />

### 通过阴影弱化背景

> 背景知识：:point_right: [css-boxshadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/css-boxshadow), HTML < [dialog](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog) >

<CodePen title="shadow-weaken-background" slug="jOwNKMo" tab="js,result" :editable="true" :preview="true" height="480" />

### 通过模糊弱化背景

> 背景知识：:point_right: [css-boxshadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/css-boxshadow), HTML < [dialog](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog) >

<CodePen title="blurry-weaken-background" slug="NWgKzMZ" tab="js,result" :editable="true" :preview="true" height="480" />

### 自定义文字下划线

> 背景知识：:point_right: [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient), [text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow), [text-decoration](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration)

通过`text-decoration: underline`实现的下划线存在很多问题，比如无法控制位置、无法实现避让（`text-decoration-skip`浏览器几乎都不支持）、更重要的是无法满足`强迫症患者`的需求，并且不同语言有不同的对齐习惯，中文以中心对齐，英文以基线对齐，所以建议通过自定义来实现下划线。

- `box-shadow`模拟下划线效果

<CodePen title="underline-solid-cn-shadow" slug="ZEyzRwp" tab="js,result" :editable="true" :preview="true" height="480" />

- 伪元素`after`模拟下划线效果

<CodePen title="underline-solid-cn-after" slug="MWogXxe" tab="js,result" :editable="true" :preview="true" height="480" />

### 自定义scroll滚动条

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [::-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)

<CodePen title="scrollbar" slug="xxrKzoP" tab="js,result" :editable="true" :preview="true" height="480" />

:::warning 注意
兼容性很差，并且很多样式不可控，建议在生产环境中采用类似 [perfect-scrollbar](https://github.com/utatti/perfect-scrollbar) 的方案。
:::

## 结构布局

### 全背景等宽内容居中

> 背景知识：:point_right: [calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)

将元素左右padding设置为父元素宽度的50%减去等宽内容的一半即可，无需设置width～

<CodePen title="fluidFixed" slug="KKqPBMg" tab="js,result" :editable="true" :preview="true" height="480" />

### 绝对底部

> 背景知识：:point_right: [calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc), [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

:::tip 什么是“Sticky Footer”
所谓 `Sticky Footer` 是指一种网页效果，如果页面内容不足够长时，页脚紧贴在视口的最底部；如果内容足够长时，页脚紧跟在内容的下方。效果大致如图所示：

<div align="center"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/sticky-footer.jpeg" width="100%" align="center"/></div>
:::

- 利用计算函数 `calc()` 计算（视窗高度 - 页头高度 - 页脚高度）赋予内容区最小高度

<CodePen title="sticky-calc" slug="JjJPBEZ" tab="js,result" :editable="true" :preview="true" height="480" />

- Flexbox `display: flex`:thumbsup:

<CodePen title="sticky-flex" slug="MWogBpm" tab="js,result" :editable="true" :preview="true" height="480" />

### 水平垂直居中

> 背景知识：:point_right: [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display), [calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc), [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

- `display: flex` + `margin: auto` 不限定宽高 :thumbsup:

<CodePen title="flex" slug="xxrKJWa" tab="js,result" :editable="true" :preview="true" height="480" />

- `display: grid` 不限定宽高 :thumbsup:

<CodePen title="grid" slug="NWgKBMR" tab="js,result" :editable="true" :preview="true" height="480" />

- 绝对定位 `position: absolute` 限定宽高

<CodePen title="position" slug="abwojKa" tab="js,result" :editable="true" :preview="true" height="480" />

- 绝对定位 `position: absolute` + `calc()` 限定宽高

<CodePen title="calc" slug="NWgKBLb" tab="js,result" :editable="true" :preview="true" height="480" />

- 绝对定位 `position: absolute` + `translate` 不限定宽高 :thumbsup:

<CodePen title="translate" slug="YzQKjOm" tab="js,result" :editable="true" :preview="true" height="480" />

- 仿table布局 `display: table/table-cell` + `vertical-align: middle` 不限定宽高

<CodePen title="table" slug="MWogBPr" tab="js,result" :editable="true" :preview="true" height="480" />

- 伪元素 `:after` + `vertical-align:middle` 不限定宽高

<CodePen title="after" slug="LYLPBga" tab="js,result" :editable="true" :preview="true" height="480" />

使用`vertical-align`实现居中时，居中元素`display`的值，必须为`inline-block/inline`，否则无法垂直居中，这是因为`vertical-align`只能用来指定行内元素`（inline）`或表格单元格`（table-cell）`元素的垂直对齐方式。更多请查看[MDN vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)

### 圣杯布局

### 双飞翼布局

### 类订单布局

### Flex布局

## 动画过渡

### 弹跳效果

### 弹性过渡

### 闪烁效果

### 打字效果

### 抖动效果

### 无缝平滑效果

### 延轨迹平滑效果

## 其他

### 常用片段

### 自定义变量

### 有趣的项目
