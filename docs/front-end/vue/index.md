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
- beforeMount: el 和 data 初始化, 生成**模板 HTML**
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

如果 `isButtonDisabled` 的值是 `truthy(非 falsy 值)`，那么 `disabled` attribute 将被包含在内。**如果该值是一个空字符串，它也会被包括在内，与 `<button disabled="">` 保持一致**。对于其他 `falsy(false、0、""、null、undefined 和 NaN)` 的值，该 attribute 将被省略。

**即对于 `v-bind` 来说, `""` 也是 `true`**
:::

#### 动态参数

可以在指令参数中使用 JavaScript 表达式，方法是用方括号括起来：
```html
<!--
注意，参数表达式的写法存在一些约束，如之后的“对动态参数表达式的约束”章节所述。
-->
<a v-bind:[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如，如果你的组件实例有一个 data property `attributeName`，其值为 `"href"`，那么这个绑定将等价于 `v-bind:href`。

同样地，你可以使用动态参数为一个动态的事件名绑定处理函数：
```html
<a v-on:[eventName]="doSomething"> ... </a>
```

在这个示例中，当 `eventName` 的值为 `"focus"` 时，`v-on:[eventName]` 将等价于 `v-on:focus`

:::warning
- 对动态参数值约定(**为 `null` 时，移除绑定**)
动态参数预期会求出一个字符串，异常情况下值为 `null`。这个特殊的 `null` 值可以被显性地用于移除绑定。**任何其它非字符串类型的值都将会触发一个警告**。

- 对动态参数表达式约定
某些字符，如**空格和引号**，放在 HTML attribute 名里是无效的。例如：
```html
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

**变通的办法是使用没有空格或引号的表达式，或用计算属性替代这种复杂表达式。**

在 DOM 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要**避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写**：
```html
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```
:::

### 计算属性和侦听器

#### 计算属性的 Setter

计算属性默认只有 getter，不过在需要时你也可以提供一个 setter：
```js
// ...
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

现在再运行 `vm.fullName = 'John Doe'` 时，`setter` 会被调用，`vm.firstName` 和 `vm.lastName` 也会相应地被更新。

### Class 与 Style 绑定

#### 绑定 HTML Class

##### 对象语法

- 绑定对象**在内联模板**

你可以在对象中传入更多字段来动态切换多个 class。此外，`:class` 指令也可以与普通的 `class` attribute 共存。当有如下模板：
```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

和如下 data：
```js
data() {
  return {
    isActive: true,
    hasError: true
  }
}
```

渲染的结果为：
```html
<div class="static text-danger"></div>
```

- 绑定对象**不在内联模板**
  - 在 `data`

```html
<div :class="classObject"></div>
```
```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': true
    }
  }
}
```

- 绑定对象**不在内联模板**
  - 在 `computed`

渲染的结果和上面一样。我们也可以在这里绑定一个返回对象的计算属性。这是一个常用且强大的模式：
```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

##### 数组语法

我们可以把一个数组传给 :class，以应用一个 class 列表：
```html
<div :class="[activeClass, errorClass]"></div>
```
```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

渲染的结果为：
```html
<div :class="[activeClass, errorClass]"></div>
```

如果你想根据条件切换列表中的 class，可以使用三元表达式：
```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

不过，当有多个条件 class 时这样写有些繁琐。所以在数组语法中也可以使用对象语法：
```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

#### 绑定内联样式

##### 对象语法

`:style` 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，**记得用引号括起来**) 来命名：
```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

直接绑定到一个样式对象通常更好，这会让模板更清晰：
```html
<div :style="styleObject"></div>
```
```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

##### 数组语法

`:style` 的数组语法可以将多个样式对象应用到同一个元素上：
```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 条件渲染

带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display`。
:::info
注意，`v-show` 不支持 `<template>` 元素。

**`v-if` 是“真正”的条件渲染**，因为它会确保在切换过程中，**条件块内的事件监听器和子组件适当地被销毁和重建。**

`v-if` 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，`v-show` 就简单得多——**不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。**

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。
:::

### 列表渲染

你也可以用 of 替代 in 作为分隔符，因为它更接近 JavaScript 迭代器的语法：
```html
<div v-for="item of items"></div>
```

v-for 来遍历一个对象:
```html
<li v-for="(value, name, index) in myObject">
  {{ name }}: {{ value }}
</li>
```

:::tip
在遍历对象时，会按 `Object.keys()` 的结果遍历，但是不能保证它在不同 JavaScript 引擎下的结果都一致。
:::

- 操作原数组：push()、pop()、shift()、unshift()、splice()、sort()、reverse()
- 返回新数组：filter()、concat()、slice()
:::info
原数组的更新会触发视图更新；返回新数组的方法可以通过**新数组替换旧数组**的方法触发视图更新

Vue认为**用一个含有相同元素的数组去替换原来的数组是非常高效的操作。**
:::

:::tip
- computed
```html
<li v-for="n in evenNumbers" :key="n">{{ n }}</li>
```
```js
data() {
  return {
    numbers: [ 1, 2, 3, 4, 5 ]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(number => number % 2 === 0)
  }
}
```

- methods(计算属性不适用时)
```html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
</ul>
```
```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```
:::

### 事件处理

有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 `$event` 把它传入方法：
```html
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```
```js
// ...
methods: {
  warn(message, event) {
    // 现在可以访问到原生事件
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

事件处理程序中可以有多个方法，这些方法由逗号运算符分隔：
```html
<!-- 这两个 one() 和 two() 将执行按钮点击事件 -->
<button @click="one($event), two($event)">
  Submit
</button>
```
```js
// ...
methods: {
  one(event) {
    // 第一个事件处理器逻辑...
  },
  two(event) {
   // 第二个事件处理器逻辑...
  }
}
```

- [事件修饰符](#事件修饰符)
  - .stop
  - .prevent
  - .capture
  - .self
  - .once
  - .passive
- [按键修饰符](#按键修饰符)
  - .enter
  - .tab
  - .delete (捕获“删除”和“退格”键)
  - .esc
  - .space
  - .up
  - .down
  - .left
  - .right
- [系统修饰键](#系统修饰键)
  - .ctrl
  - .alt
  - .shift
  - .meta
  - .exact
  - [鼠标按钮修饰符](#鼠标按钮修饰符)
    - .left
    - .right
    - .middle
- [v-model修饰符](#表单输入绑定)
  - .lazy
  - .number
  - .trim

#### 事件修饰符

```html
<!-- 阻止单击事件继续传播 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div @click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发   -->
<!-- 而不会等待 `onScroll` 完成                   -->
<!-- 这其中包含 `event.preventDefault()` 的情况   -->
<div @scroll.passive="onScroll">...</div>
```

:::tip
这个 `.passive` 修饰符尤其能够提升移动端的性能。

使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止所有的点击，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击。

不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，`.passive` 会告诉浏览器你**不想阻止事件的默认行为**。(`passive` 设置为 `true` 时，表示 listener 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。)
:::

#### 按键修饰符

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 `v-on` 或者 `@` 在监听键盘事件时添加按键修饰符：
```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

你可以直接将 [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。
```html
<input @keyup.page-down="onPageDown" />
```
在上述示例中，处理函数只会在 `$event.key` 等于 `'PageDown'` 时被调用。

#### 系统修饰键

```html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

:::tip
请注意修饰键与常规按键不同，在和 `keyup` 事件一起用时，事件触发时修饰键必须处于按下状态。换句话说，只有在按住 `ctrl` 的情况下释放其它按键，才能触发 `keyup.ctrl`。而单单释放 `ctrl` 也不会触发事件。
:::

.exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。
```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

### 表单输入绑定

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：
- text 和 textarea 元素使用 `value` property 和 `input` 事件；
- checkbox 和 radio 使用 `checked` property 和 `change` 事件；
- select 字段将 `value` 作为 prop 并将 `change` 作为事件。

#### `.lazy`

在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步 (除了上述输入法组织文字时)。你可以添加 `lazy` 修饰符，从而转为在 `change` 事件_之后_进行同步：
```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" />
```

#### `.number`

如果想自动将用户的输入值转为数值类型，可以给 `v-model` 添加 `number` 修饰符：
```html
<input v-model.number="age" type="number" />
```

这通常很有用，因为即使在 `type="number"` 时，HTML 输入元素的值也总会返回字符串。如果这个值无法被 `parseFloat()` 解析，则会返回原始的值。

#### `.trim`

如果要自动过滤用户输入的首尾空白字符，可以给 `v-model` 添加 `trim` 修饰符：
```html
<input v-model.trim="msg" />
```

### 组件基础

#### 使用事件抛出一个值

```html
<button @click="$emit('enlargeText', 0.1)">
  Enlarge text
</button>

<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

#### 在组件上使用 v-model

自定义事件也可以用于创建支持 `v-model` 的自定义输入组件。记住：
```html
<input v-model="searchText" />
```

等价于：
```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

当用在组件上时，`v-model` 则会这样：
```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

为了让它正常工作，这个组件内的 `<input>` 必须：
- 将其 `value` attribute 绑定到一个名叫 `modelValue` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `update:modelValue` 事件抛出

写成代码之后是这样的：
```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

现在 `v-model` 就应该可以在这个组件上完美地工作起来了：
```html
<custom-input v-model="searchText"></custom-input>
```

在该组件中实现 `v-model` 的另一种方法是使用 `computed` property 的功能来定义 `getter` 和 `setter`。`get` 方法应返回 `modelValue` property，`set` 方法应该触发相应的事件。
```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) { 
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

## 深入组件



<cite>[-- 《vue3官方文档》](https://v3.cn.vuejs.org/)</cite>
