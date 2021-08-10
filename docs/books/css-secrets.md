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

[CSS揭秘读书笔记-You-need-to-know-css](https://lhammer.cn/You-need-to-know-css/#/zh-cn/introduce?v=1)

## 边框与背景

### 半透明边框

> 背景知识：:point_right: [background-clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip)

默认情况下，背景的颜色会延伸至边框下层，这意味着我们设置的透明边框效果会被覆盖掉，在css3中，我们可以通过设置`background-clip:padding-box`来改变背景的默认行为，达到我们想要的效果。

<CodePen title="translucent-borders" slug="QWvzYGx" tab="js,result" :editable="true" :preview="true" :height="350" />

<iframe
  width="100%"
  height="410px"
  src="https://caniuse.bitsofco.de/embed/index.html?feat=mdn-css__properties__background-clip&periods=future_1,current,past_1,past_2,past_3&accessible-colours=false&image-base=none"
  frameborder="0">
</iframe>

### 多重边框

> 背景知识：:point_right: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow), [outline](https://developer.mozilla.org/zh-CN/docs/Web/CSS/outline), [outline-offset](https://developer.mozilla.org/zh-CN/docs/Web/CSS/outline-offset)

`box-shadow`相信很多人都已经用透了，可用来给元素添加各种阴影效果，反过来，也只有我们需要实现阴影时才会想起它，其实，`box-shadow`还接受第四个参数作为阴影扩张半径，当我们只设置扩张半径时，零偏移，零模糊，产生的效果其实相当于一条实线“**边框**”。

`box-shadow`只能模拟实线边框效果，某些情况下，我们可能需要生成虚线的边框效果，我们可以通过类似于`border`的描边`outline`和对应的描边偏移`outline-offset`来实现。

<CodePen title="translucent-borders" slug="WNjLmoq" tab="js,result" :editable="true" :preview="true" :height="370" />

<iframe
  width="100%"
  height="410px"
  src="https://caniuse.bitsofco.de/embed/index.html?feat=mdn-css__properties__box-shadow&periods=future_1,current,past_1,past_2,past_3&accessible-colours=false&image-base=none"
  frameborder="0">
</iframe>

### 边框内圆角

### 背景定位

### 条纹背景

### 1px 线/边

## 常见形状

### 圆与椭圆

### parallel四边形

### 切角效果

### 简易饼图

### 提示气泡

### 其他多边形

## 视觉效果

### 常见投影

### 不规则投影

### 毛玻璃投影

### 斑马条纹

### 文字特效

### 文本截断

### 环形文字

### 插入换行

### 图片对比控件

## 用户体验

### 选择合适的鼠标光标

### 扩大可点击区域

### 自定义复选框

### 自定义单选框

### 自定义开关选择器

### 输入框完美居中

### 通过阴影弱化背景

### 通过模糊弱化背景

### 自定义文字下划线

### 自定义scroll滚动条

## 结构布局

### 全背景等宽内容居中

### 绝对底部

### 水平垂直居中

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
