---
head:
  - - meta
    - name: description
      content: CSS揭秘
  - - meta
    - name: keywords
      content: CSS揭秘 css-secrets
---

# CSS揭秘

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

<CodePen title="poptip-light" slug="LYyaebm" tab="js,result" :editable="true" :preview="true" :height="480" />

- 什么是“CSS Filter Effects”？

[cinwell website](https://www.bestagencies.com/tools/filter-effects-css-generator/)

### 其他多边形

> 背景知识：:point_right: [box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

<CodePen title="polygon" slug="OJmqaBB" tab="js,result" :editable="true" :preview="true" :height="480" />

## 视觉效果

### 常见投影

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)

<CodePen title="single-projection" slug="VwbRqbG" tab="js,result" :editable="true" :preview="true" :height="480" />

### 不规则投影

> 背景知识：:point_right: [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter), [radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/radial-gradient), [border-image](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image)

<CodePen title="irregular-projection" slug="VwbRqbG" tab="js,result" :editable="true" :preview="true" :height="480" />

### 毛玻璃投影

> 背景知识：:point_right: [hsla/rgba](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)

:::warning 注意
background: `background-color`, `background-image`, `background-repeat`, `background-attachment`, `background-position / background-size`, `background-origin`, `background-clip`

font: `font-style`, `font-variant`, `font-weight`, `font-size/line-height`, `font-family`
:::

<CodePen title="frosted-glass" slug="YzVmORx" tab="js,result" :editable="true" :preview="true" :height="480" />

### 斑马条纹

> 背景知识：:point_right: [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient)

<CodePen title="zebra-stripes" slug="eYWqQqQ" tab="js,result" :editable="true" :preview="true" :height="480" />

### 文字特效

> 背景知识：:point_right: [text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow), [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter), [-webkit-text-fill-color](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-fill-color), [-webkit-text-stroke](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-stroke)

<CodePen title="text-effects" slug="ExmqGvx" tab="js,result" :editable="true" :preview="true" :height="480" />

### 文本截断（溢出）

<CodePen title="text-overflow" slug="eYROZMd" tab="js,result" :editable="true" :preview="true" :height="480" />

### 环形文字

> 背景知识：:point_right: [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG), [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)

<CodePen title="circular-text" slug="Rwgbaeq" tab="js,result" :editable="true" :preview="true" :height="480" />

### 插入换行

> 背景知识：:point_right: [Unicode](https://en.wikipedia.org/wiki/Unicode), [white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)

在[Unicode](http://www.ssec.wisc.edu/~tomw/java/unicode.html)中，`0x000A`字符是专门控制换行的。在`CSS`中，我们可以写为`\000A`或`\A`,我们可以用它来作为`::after`伪元素的内容，并将其添加到指定元素的尾部，实现换行效果。

<CodePen title="circular-text" slug="mdwbEEZ" tab="js,result" :editable="true" :preview="true" :height="480" />

:::warning 注意
上述代码中，通过伪元素在多个`span.bold`元素间添加的逗号前面会有一个空格，负外边距`margin-left: -.25em;`的作用是抵消所出现的空隙。
:::

### 图片对比控件

> 背景知识：:point_right: [resize](https://developer.mozilla.org/zh-CN/docs/Web/CSS/resize), HTML < [input[type=range]](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) >

<CodePen title="circular-text" slug="yLXBJEP" tab="js,result" :editable="true" :preview="true" :height="480" />

> 创造良好的用户体验应当养成一种习惯~

## 用户体验

> 创造良好的用户体验应当养成一种习惯~

### 选择合适的鼠标光标

> 背景知识：:point_right: [cursor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)

<CodePen title="mouse-cursor" slug="QWgLmLj" tab="js,result" :editable="true" :preview="true" :height="480" />

### 扩大可点击区域

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

<CodePen title="mouse-cursor" slug="XWgrEKz" tab="js,result" :editable="true" :preview="true" :height="480" />

### 自定义复选框

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

<CodePen title="custom-checkbox" slug="YzQKaNg" tab="js,result" :editable="true" :preview="true" :height="480" />

### 自定义单选框

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

<CodePen title="custom-radio" slug="MWogVLQ" tab="js,result" :editable="true" :preview="true" :height="480" />

### 自定义开关选择器

> 背景知识：:point_right: [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [伪元素](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Introduction_to_CSS/Pseudo-classes_and_pseudo-elements#%E4%BC%AA%E5%85%83%E7%B4%A0)

同自定义复选框或自定义单选框类似，都是利用一个隐藏的`input(:checked)`元素 + 一个关联的`label`元素，通过`label`元素及其伪元素模拟switch选择器，通过`input`的`:checked`属性来模拟`switch`状态是否开启。

<CodePen title="custom-radio" slug="abwoYrP" tab="js,result" :editable="true" :preview="true" :height="480" />

### 输入框完美居中

<CodePen title="input-align" slug="yLXBEem" tab="js,result" :editable="true" :preview="true" :height="480" />

### 通过阴影弱化背景

> 背景知识：:point_right: [css-boxshadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/css-boxshadow), HTML < [dialog](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog) >

<CodePen title="shadow-weaken-background" slug="jOwNKMo" tab="js,result" :editable="true" :preview="true" :height="480" />

### 通过模糊弱化背景

> 背景知识：:point_right: [css-boxshadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/css-boxshadow), HTML < [dialog](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog) >

<CodePen title="blurry-weaken-background" slug="NWgKzMZ" tab="js,result" :editable="true" :preview="true" :height="480" />

### 自定义文字下划线

> 背景知识：:point_right: [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient), [text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow), [text-decoration](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration)

通过`text-decoration: underline`实现的下划线存在很多问题，比如无法控制位置、无法实现避让（`text-decoration-skip`浏览器几乎都不支持）、更重要的是无法满足`强迫症患者`的需求，并且不同语言有不同的对齐习惯，中文以中心对齐，英文以基线对齐，所以建议通过自定义来实现下划线。

- `box-shadow`模拟下划线效果

<CodePen title="underline-solid-cn-shadow" slug="ZEyzRwp" tab="js,result" :editable="true" :preview="true" :height="480" />

- 伪元素`after`模拟下划线效果

<CodePen title="underline-solid-cn-after" slug="MWogXxe" tab="js,result" :editable="true" :preview="true" :height="480" />

### 自定义scroll滚动条

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [::-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)

<CodePen title="scrollbar" slug="xxrKzoP" tab="js,result" :editable="true" :preview="true" :height="480" />

:::warning 注意
兼容性很差，并且很多样式不可控，建议在生产环境中采用类似 [perfect-scrollbar](https://github.com/utatti/perfect-scrollbar) 的方案。
:::

## 结构布局

### 全背景等宽内容居中

> 背景知识：:point_right: [calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)

将元素左右padding设置为父元素宽度的50%减去等宽内容的一半即可，无需设置width～

<CodePen title="fluidFixed" slug="KKqPBMg" tab="js,result" :editable="true" :preview="true" :height="480" />

### 绝对底部

> 背景知识：:point_right: [calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc), [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

:::tip 什么是“Sticky Footer”
所谓 `Sticky Footer` 是指一种网页效果，如果页面内容不足够长时，页脚紧贴在视口的最底部；如果内容足够长时，页脚紧跟在内容的下方。效果大致如图所示：

<div align="center"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/sticky-footer.jpeg" width="100%" align="center"/></div>
:::

- 利用计算函数 `calc()` 计算（视窗高度 - 页头高度 - 页脚高度）赋予内容区最小高度

<CodePen title="sticky-calc" slug="JjJPBEZ" tab="js,result" :editable="true" :preview="true" :height="480" />

- Flexbox `display: flex`:thumbsup:

<CodePen title="sticky-flex" slug="MWogBpm" tab="js,result" :editable="true" :preview="true" :height="480" />

### 水平垂直居中

> 背景知识：:point_right: [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display), [calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc), [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

- `display: flex` + `margin: auto` 不限定宽高 :thumbsup:

<CodePen title="flex" slug="xxrKJWa" tab="js,result" :editable="true" :preview="true" :height="480" />

- `display: grid` 不限定宽高 :thumbsup:

<CodePen title="grid" slug="NWgKBMR" tab="js,result" :editable="true" :preview="true" :height="480" />

- 绝对定位 `position: absolute` 限定宽高

<CodePen title="position" slug="abwojKa" tab="js,result" :editable="true" :preview="true" :height="480" />

- 绝对定位 `position: absolute` + `calc()` 限定宽高

<CodePen title="calc" slug="NWgKBLb" tab="js,result" :editable="true" :preview="true" :height="480" />

- 绝对定位 `position: absolute` + `translate` 不限定宽高 :thumbsup:

<CodePen title="translate" slug="YzQKjOm" tab="js,result" :editable="true" :preview="true" :height="480" />

- 仿table布局 `display: table/table-cell` + `vertical-align: middle` 不限定宽高

<CodePen title="table" slug="MWogBPr" tab="js,result" :editable="true" :preview="true" :height="480" />

- 伪元素 `:after` + `vertical-align:middle` 不限定宽高

<CodePen title="after" slug="LYLPBga" tab="js,result" :editable="true" :preview="true" :height="480" />

使用`vertical-align`实现居中时，居中元素`display`的值，必须为`inline-block/inline`，否则无法垂直居中，这是因为`vertical-align`只能用来指定行内元素`（inline）`或表格单元格`（table-cell）`元素的垂直对齐方式。更多请查看[MDN vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)

### 圣杯布局

此布局一般的需求为两边等宽，中间自适应的三栏布局。

<CodePen title="holy-grail-layout" slug="BaZBbKB" tab="js,result" :editable="true" :preview="true" :height="480" />

### 双飞翼布局

此布局的需求同[圣杯布局](https://lhammer.cn/You-need-to-know-css/#/holy-grail-layout)一样，都为两边等宽，中间自适应的三栏布局，源自淘宝UED

<CodePen title="double-wing-layout" slug="VwWZRzg" tab="js,result" :editable="true" :preview="true" :height="480" />

:::tip 圣杯布局和双飞翼布局的区别
圣杯布局和双飞翼布局解决问题的方案在前一半是相同的，也就是三栏全部float浮动，但左右两栏加上负margin让其跟中间栏div并排，以形成三栏布局。

不同在于解决”中间栏div内容不被遮挡“问题的思路不一样：圣杯布局，为了中间div内容不被遮挡，将中间div设置了左右padding-left和padding-right后，将左右两个div用相对布局position: relative并分别配合right和left属性，以便左右两栏div移动后不遮挡中间div。

双飞翼布局，为了中间div内容不被遮挡，直接在中间div内部创建子div用于放置内容，在该子div里用margin-left和margin-right为左右两栏div留出位置。多了1个div，少用大致4个css属性（圣杯布局中间divpadding-left和padding-right这2个属性，加上左右两个div用相对布局position: relative及对应的right和left共4个属性，一共6个；而双飞翼布局子div里用margin-left和margin-right共2个属性，6-2=4），个人感觉比圣杯布局思路更直接和简洁一点。
:::

### 类订单布局

> 背景知识：:point_right: [水平垂直居中](#水平垂直居中)

此布局一般的需求为左侧高度不固定，右侧自适应高度并且居中。

<div align="center" style="border: 1px solid #f5f5f5"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/interesting-layout-1.jpeg" width="100%" align="center"/></div>

- 伪元素 `:after` + `vertical-align:middle` 方案

<CodePen title="class-order-layout" slug="rNwBRdJ" tab="js,result" :editable="true" :preview="true" :height="480" />

- 伪元素 `display: flex` 方案

<CodePen title="dlayout-flexbox" slug="ZEyzZYR" tab="js,result" :editable="true" :preview="true" :height="480" />

### Flex布局

> 背景知识：:point_right: [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex), [flex 布局的基本概念](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)

Flex 布局的全称为 CSS Flexible Box Layout Module，是 W3C 提出的一种新型页面布局方案，第一个版本于 2009 年推出，到现在为止，W3C 一共发布了 12 个版本，[最新版本](https://www.w3.org/TR/css-flexbox-1/)于 20171019 推出，已经得到了所有主流浏览器的支持，所以请大胆的使用吧~

:::tip Flexbox 原理演示
[A Visual Guide to CSS3 Flexbox Properties](https://lhammer.cn/Flexbox/ ":include :type=iframe width=100% height=791px")
:::

Flex 布局由容器`flex container`和项目`flex item`两部分组成，容器默认存在两根轴：水平的主轴`main axis`和垂直的交叉轴`cross axis`，项目默认以主轴排列。
Flex 属性包括容器属性和项目属性两部分，容器上可设置：`flex-direction`、`flex-wrap`、`flex-flow`、`justify-content`、`align-items`、`align-content`6 个属性，项目上同样可设置 6 个属性，分别为：`order`、`flex-grow`、`flex-shrink`、`flex-basis`、`flex`、`align-self`。示例如下：

- 容器属性
  - flex-direction 属性

**作用：** 决定主轴的方向。

```css
flex-direction: row | row-reverse | column | column-reverse;
```

> - row：默认值，主轴为水平方向,表示从左向右排列
> - row-reverse：主轴为水平方向，从右向左排列
> - column：主轴为垂直方向，从上向下排列
> - column-reverse：主轴为垂直方向，从下向上排列

<CodePen title="flexDirection" slug="zYzOXry" tab="js,result" :editable="true" :preview="true" :height="480" />

- 容器属性
  - flex-wrap 属性

**作用：** 决定项目在一条轴线排不下时如何换行。

```css
flex-wrap: nowrap | wrap | wrap-reverse;
```

> - nowrap：默认值，不换行
> - wrap：换行，第一行在上方
> - row-reverse：换行，第一行在下方

<CodePen title="flexWrap" slug="wvewbbL" tab="js,result" :editable="true" :preview="true" :height="480" />

- 容器属性
  - flex-flow 属性

**作用：** `flex-direction`属性和`flex-wrap`属性的简写形式，默认值为 row nowrap。

```css
flex-flow: <flex-direction> || <flex-wrap>;
```

> - row nowrap：默认值，主轴为水平方向，不换行
> - `<flex-direction>`
> - `<flex-wrap>`

- 容器属性
  - justify-content 属性

**作用：** 定义项目在主轴上的对齐方式。

```css
justify-content: flex-start | flex-end | center | space-between | space-round |
  space-evenly;
```

> - flex-start：默认值，左对齐
> - flex-end：右对齐
> - center：居中
> - space-evenly：每个项目之间及两端的间隔都相等
> - space-around：每个项目两侧间隔相等
> - space-between：两端对齐，项目之间间隔相等

<CodePen title="justifyContent" slug="MWogMKJ" tab="js,result" :editable="true" :preview="true" :height="480" />

- 容器属性
  - align-items 属性

**作用：** 定义项目在交叉轴（默认方向从上到下）上的对齐方式。

```css
align-items: flex-start | flex-end | center | baseline | stretch;
```

> - flex-start：交叉轴的起点对齐
> - flex-end：交叉轴的终点对齐
> - cente：交叉轴的中心对齐
> - baseline：项目第一行文字的基线对齐
> - stretch：默认值，项目未设置固定高度时，将占满整个容器

<CodePen title="alignItems" slug="Rwgbzav" tab="js,result" :editable="true" :preview="true" :height="480" />

- 容器属性
  - align-content 属性

**作用：** 定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

```css
align-content: flex-start | flex-end | center | space-between | space-around |
  stretch;
```

> - flex-start：交叉轴的起点对齐
> - flex-end：交叉轴的终点对齐
> - center：交叉轴的中心对齐
> - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
> - space-around：每根轴线两侧的间隔都相等
> - stretch：默认值，轴线占满整个交叉轴

<CodePen title="alignContent" slug="ExXYBmQ" tab="js,result" :editable="true" :preview="true" :height="480" />

- 项目属性
  - order 属性

**作用：** 定义项目的排列顺序。

```css
order: <number>;
```

> - `<number>`：值为整数，数值越小，排列越靠前，默认为 0

<CodePen title="order" slug="xxrKoLz" tab="js,result" :editable="true" :preview="true" :height="480" />

- 项目属性
  - order 属性

**作用：** 定义项目的排列顺序。

```css
order: <number>;
```

> - `<number>`：值为整数，数值越小，排列越靠前，默认为 0

<CodePen title="order" slug="xxrKoLz" tab="js,result" :editable="true" :preview="true" :height="480" />

- 项目属性
  - flex-grow 属性

**作用：** 定义项目的伸缩比例，按照该比例给项目分配空间。

```css
flex-grow: <number>;
```

> - `<number>`：值为整数，数值越大，项目占据空间越大，默认为 0

<CodePen title="flexGrow" slug="xxrKopJ" tab="js,result" :editable="true" :preview="true" :height="480" />

- 项目属性
  - flex-shrink 属性

**作用：** 定义项目的收缩比例，按照该比例给项目分配空间。

```css
flex-shrink: <number>;
```

> - `<number>`：值为整数，数值越大，项目占据空间越小，默认为 1

<CodePen title="flexShrink" slug="abwogqK" tab="js,result" :editable="true" :preview="true" :height="480" />

- 项目属性
  - flex-basis 属性

**作用：** 定义在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。

```css
flex-basis: <length> | auto;
```

> - `<length>`：默认为 auto，即项目的原始尺寸；也可设置和 width 或 height 属性一样的值（比如 329px），则项目将占据固定空间。

<CodePen title="flexBasis" slug="XWgrLEZ" tab="js,result" :editable="true" :preview="true" :height="480" />

- 项目属性
  - flex 属性 :thumbsup:

**作用：** 是`flex-grow`,`flex-shrink`和`flex-basis`的简写，后两个属性可选。

```css
flex: none | [ < "flex-grow" > < "flex-shrink" >? || < "flex-basis" > ];
```

> - `0 1 auto`：默认值，不伸缩，如果容器空间不足则等比例收缩
> - `1 1 auto`：对应关键字`auto`，如果容器空间多余，则等比例分配多余空间空间；如果容器空间不足则等比例收缩
> - `0 0 auto`：对应关键字`none`，按项目原始大小分配空间

- 项目属性
  - align-self 属性

**作用：** 定义单个项目的对齐方式，可覆盖 align-items 属性。

```css
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

> - auto：默认值，继承父元素的`align-items`属性，如果没有父元素，则等同于 stretch
> - flex-start：交叉轴的起点对齐
> - flex-end：交叉轴的终点对齐
> - center：交叉轴的中心对齐
> - baseline：项目第一行文字的基线对齐
> - stretch：未设置固定高度是，将占满整个容器

<CodePen title="alignSelf" slug="PojYraq" tab="js,result" :editable="true" :preview="true" :height="480" />

## 动画过渡

### 弹跳效果

> 背景知识：:point_right: [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation), [timing-function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/timing-function), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

小球下落过程属于自由落体运动，在时间函数[timing-function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/timing-function)中,`ease`（更快的加速度）相对更接近于自由落体运动，所以下落过程我们选用`ease`作为时间函数的关键值；当小球被弹起时属于减速运动，我们需用使用`ease`的方向版本`cubic-bezier(.1,.25,.1,.25)`（更快的减速度）作为时间函数的函数值来模仿减速运动。调速函数如下图所示：

<div align="center"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/cubic-bezier.jpeg" width="100%" align="center"/></div>

<CodePen title="bounce" slug="yLXBdRz" tab="js,result" :editable="true" :preview="true" :height="480" />

### 弹性过渡

> 背景知识：:point_right: [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation), [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)

一切的过度皆应该由动画来完成

- `animation`方案 :thumbsup:

<CodePen title="elastic-animation" slug="xxrxKWq" tab="js,result" :editable="true" :preview="true" :height="480" />

- 三次贝塞尔`cubic-bezier` + `transition`方案

<CodePen title="elastic-transtion" slug="jOwONdO" tab="js,result" :editable="true" :preview="true" :height="480" />

三次贝塞尔曲线`cubic-bezier`主要是为`animation`生成速度曲线的函数，语法是`cubic-bezier(<x1>, <y1>, <x2>, <y2>)`，更多请参考：[Lea Verou](http://lea.verou.me/about/)的图形化工具[cubic-bezier](http://cubic-bezier.com/#)

### 闪烁效果

背景知识：:point_right: [animation-direction](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction)

`animation-direction`属性接受的值共有四个，为了你能从视觉上直接理解其作用，我以下图一段从`#FFFFFF`变化到`#b4a078`并循环三次的动画为例，展示了这四个值各自对动画的作用效果。

<div align="center"><img src="https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/css-secrets/animation-direction.jpeg" width="60%" align="center"/></div><br />

<CodePen title="blink" slug="wvevwOb" tab="js,result" :editable="true" :preview="true" :height="480" />

### 打字效果

> 背景知识：:point_right: [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation), [animation-timing-function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)

<CodePen title="typing" slug="MWoWWge" tab="js,result" :editable="true" :preview="true" :height="480" />

:::danger 注意
此方法仅限**单行等宽**字体~
:::

### 抖动效果

> 背景知识：:point_right: [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

- See [百度](https://www.baidu.com/s?wd=%E6%8A%96%E5%8A%A8&rsv_spt=1&rsv_iqid=0xe9f337870004f38a&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_sug3=11&rsv_sug1=15&rsv_sug7=101&rsv_sug2=0&inputT=3789&rsv_sug4=4507)

<CodePen title="shakeBaidu" slug="ExXxxVw" tab="js,result" :editable="true" :preview="true" :height="480" />

- See [CSShake](https://github.com/elrumordelaluz/csshake)

<CodePen title="CSShake" slug="dyRyyGj" tab="js,result" :editable="true" :preview="true" :height="480" />

### 无缝平滑效果

> 背景知识：:point_right: [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

- 图片平滑效果

<CodePen title="single-projection" slug="JjJjjKL" tab="js,result" :editable="true" :preview="true" :height="480" />

> 上图为两张左右对称的图片拼接而成，效果不是很完美，在开发中，只需使用一张左右可以无缝对接（类似360°全景图）的图片即可更完美。

- 块平滑效果

<CodePen title="block-smooth" slug="VwWwwmV" tab="js,result" :editable="true" :preview="true" :height="480" />

### 延轨迹平滑效果

> 背景知识：:point_right: [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation), [transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition), [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform), [animation-delay](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)

**transform-origin 只是一个语法糖而已。实际上你总是可以用 translate() 来代替它。**

<CodePen title="circular-smooth" slug="NWgWWpG" tab="js,result" :editable="true" :preview="true" :height="480" />
