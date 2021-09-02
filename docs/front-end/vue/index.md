---
title: Vue3
head:
  - - meta
    - name: description
      content: vue3学习笔记
  - - meta
    - name: keywords
      content: vue vue3 vuejs vue.js
---

## 基础

### 安装

使用 npm：
```shell
npm init vite <project-name> -- --template vue
cd <project-name>
npm install
npm run dev
```

或者 yarn：
```shell
yarn create vite
```

### 生命周期

![lifecycle](https://cdn.jsdelivr.net/gh/qiyoe/qiyoe.github.io/c-blog/vue3/lifecycle.svg)

由上图可以看出:
- beforeCeate: 初始化事件和生命周期--完成状态
  - 实例初始化, el 和 data 未初始化, 组件各个选项对象未创建(即无法访问 methods, data, computed)--完成状态
- created: 初始化注入和交互(响应式)--完成状态
  - 实例创建, 但是不可见(因为还没挂载). 可以进行数据的预处理
- beforeMount: el 和 data 初始化, 生成模**板 HTML**
  - 如有 "template" 选项, 则把模板编译到 render 函数(虚拟 DOM)--完成状态
  - 反之, 编译 el's innerHTML 为模板--完成状态
- mounted: 创建 app.$el 并将之挂载到 el (模板 HTML 渲染到 HTML 页面)--完成状态
- beforeUpdate: 数据发生改变--完成状态
- updated: 虚拟 DOM 重新渲染并修补 DOM(diff 算法打补丁)--完成状态
- beforeUnmount: 当 app.unmount() 调用之前(可以获取实例; 清除定时器和监听的 DOM 事件)--完成状态
- unmounted: 实例卸载--完成状态

### 模版语法

#### 插值

:::tip
```html
<button v-bind:disabled="isButtonDisabled">按钮</button>
```

如果 `isButtonDisabled` 的值是 `truthy`，那么 `disabled` attribute 将被包含在内。**如果该值是一个空字符串，它也会被包括在内，与 `<button disabled="">` 保持一致。** 对于其他 `falsy` 的值，该 attribute 将被省略。

**即对于 `v-bind` 来说, `""` 也是 `true`**
:::

#### 指令

动态参数

<cite>[-- 《vue3官方文档》](https://v3.cn.vuejs.org/)</cite>
