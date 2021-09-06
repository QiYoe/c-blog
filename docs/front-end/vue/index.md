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

### Prop 类型

1. 数组
```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

2. 对象: 这不仅为你的组件提供了文档，还会在它们遇到错误的类型时从浏览器的 JavaScript 控制台提示用户。
```js
function Person(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}

props: {
  // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise, // 或任何其他构造函数
  propO: Person,  // 自定义构造函数  用于验证 propO prop 的值是否是通过 new Person 创建的。
  propA: Date,
  propB: [String, Number],
  // 必填的字符串
  propC: {
    type: String,
    required: true
  },
  // 带有默认值的数字
  propD: {
    type: Number,
    default: 100
  },
  // 带有默认值的对象
  propE: {
    type: Object,
    // 对象或数组默认值必须从一个工厂函数获取
    default() {
      return { message: 'hello' }
    }
  },
  // 自定义验证函数
  propF: {
    validator(value) {
      // 这个值必须匹配下列字符串中的一个
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 具有默认值的函数
  propG: {
    type: Function,
    // 与对象或数组默认值不同，这不是一个工厂函数 —— 这是一个用作默认值的函数
    default() {
      return 'Default function'
    }
  }
}
```

:::tip
子组件里不要修改 prop 的值, 因为这会修改父组件状态, 从而导致你的应用的数据流难以理解

注意那些 prop 会在一个组件实例创建之前进行验证，所以实例的 property (如 `data`、`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。

prop 值为驼峰命名法
HTML 中为短横线命名法
:::

### 非 Prop 的 Attribute

一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 [props](#prop-类型) 或 emits 定义的 attribute。常见的示例包括 `class`、`style` 和 `id` 属性。

#### Attribute 继承

当组件返回单个根节点时，非 prop attribute 将自动添加到根节点的 attribute 中。例如，在 `<date-picker>` 组件的实例中：
```js
app.component('date-picker', {
  template: `
    <div class="date-picker">
      <input type="datetime-local" />
    </div>
  `
})
```

如果我们需要通过 `data-status` attribute 定义 `<date-picker>` 组件的状态，它将应用于根节点 (即 `div.date-picker`)。
```html
<!-- 具有非prop attribute的Date-picker组件-->
<date-picker data-status="activated"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div class="date-picker" data-status="activated">
  <input type="datetime-local" />
</div>
```

同样的规则也适用于事件监听器：
```html
<date-picker @change="submitChange"></date-picker>
```
```js
app.component('date-picker', {
  created() {
    console.log(this.$attrs) // { onChange: () => {}  }
  }
})
```

当有一个具有 `change` 事件的 HTML 元素将作为 `date-picker` 的根元素时，这可能会有帮助。
```js
app.component('date-picker', {
  template: `
    <select>
      <option value="1">Yesterday</option>
      <option value="2">Today</option>
      <option value="3">Tomorrow</option>
    </select>
  `
})
```

在这种情况下，`change` 事件监听器从父组件传递到子组件，它将在原生 `select` 的 `change` 事件上触发。我们不需要显式地从 `date-picker` 发出事件：
```html
<div id="date-picker" class="demo">
  <date-picker @change="showChange"></date-picker>
</div>
```
```js
const app = Vue.createApp({
  methods: {
    showChange(event) {
      console.log(event.target.value) // 将记录所选选项的值
    }
  }
})
```

#### 禁用 Attribute 继承

如果你不希望组件的根元素继承 attribute，你可以在组件的选项中设置 `inheritAttrs: false`。例如：

禁用 attribute 继承的常见情况是需要将 attribute 应用于根节点之外的其他元素。

通过将 `inheritAttrs` 选项设置为 `false`，你可以访问组件的 `$attrs` property，该 property 包括组件 `props` 和 `emits` property 中未包含的所有属性 (例如，`class`、`style`、`v-on` 监听器等)。

使用上一节中的 date-picker 组件示例，如果需要将所有非 prop attribute 应用于 `input` 元素而不是根 `div` 元素，则可以使用 `v-bind` 缩写来完成。
```js
app.component('date-picker', {
  inheritAttrs: false,
  template: `
    <div class="date-picker">
      <input type="datetime-local" v-bind="$attrs" />
    </div>
  `
})
```

有了这个新配置，`data-status` attribute 将应用于 `input` 元素！
```html
<!-- Date-picker 组件 使用非 prop attribute -->
<date-picker data-status="activated"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div class="date-picker">
  <input type="datetime-local" data-status="activated" />
</div>
```

#### 多个根节点上的 Attribute 继承

与单个根节点组件不同，具有多个根节点的组件不具有自动 attribute [fallthrough (隐式贯穿)](https://en.wiktionary.org/wiki/fall-through#English) 行为。如果未显式绑定 `$attrs`，将发出运行时警告。
```html
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>
```
```js
// 这将发出警告
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  `
})

// 没有警告，$attrs被传递到<main>元素
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main v-bind="$attrs">...</main>
    <footer>...</footer>
  `
})
```

### 自定义事件

#### 事件名

与组件和 prop 一样，事件名提供了自动的大小写转换。如果用驼峰命名的子组件中触发一个事件，你将可以在父组件中添加一个 kebab-case (短横线分隔命名) 的监听器。
```js
this.$emit('myEvent')
```
```html
<my-component @my-event="doSomething"></my-component>
```

与 props 的命名一样，当你使用 DOM 模板时，我们建议使用 kebab-case 事件监听器。如果你使用的是字符串模板，这个限制就不适用。

#### 定义自定义事件

可以通过 `emits` 选项在组件上定义发出的事件。
```js
app.component('custom-form', {
  emits: ['inFocus', 'submit']
})
```

当在 `emits` 选项中定义了原生事件 (如 `click`) 时，将使用组件中的事件**替代**原生事件侦听器。

:::tip
建议定义所有发出的事件，以便更好地记录组件应该如何工作。
:::

#### 验证抛出的事件

与 prop 类型验证类似，如果使用对象语法而不是数组语法定义发出的事件，则可以验证它。

要添加验证，将为事件分配一个函数，该函数接收传递给 `$emit` 调用的参数，并返回一个布尔值以指示事件是否有效。
```js
app.component('custom-form', {
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
})
```

#### `v-model` 参数

默认情况下，组件上的 `v-model` 使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件。我们可以通过向 `v-model` 传递参数来修改这些名称：
```html
<my-component v-model:title="bookTitle"></my-component>
```

在本例中，子组件将需要一个 `title` prop 并发出 `update:title` 要同步的事件：
```js
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```
```html
<my-component v-model:title="bookTitle"></my-component>
```

#### 多个 `v-model` 绑定

通过利用以特定 prop 和事件为目标的能力，正如我们之前在 v-model 参数中所学的那样，我们现在可以在单个组件实例上创建多个 v-model 绑定。

每个 v-model 将同步到不同的 prop，而不需要在组件中添加额外的选项：
```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```
```js
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

#### 处理 `v-model` 修饰符

当我们学习表单输入绑定时，我们看到 `v-model` 有[内置修饰符](#表单输入绑定)——`.trim`、`.number` 和 `.lazy`。但是，在某些情况下，你可能还需要添加自己的自定义修饰符。

让我们创建一个示例自定义修饰符 `capitalize`，它将 `v-model` 绑定提供的字符串的第一个字母大写。

添加到组件 `v-model` 的修饰符将通过 `modelModifiers` prop 提供给组件。在下面的示例中，我们创建了一个组件，其中包含默认为空对象的 `modelModifiers` prop。

请注意，当组件的 `created` 生命周期钩子触发时，`modelModifiers` prop 会包含 `capitalize`，且其值为 `true`——因为 `capitalize` 被设置在了写为 `v-model.capitalize="myText"` 的 `v-model` 绑定上。
```html
<my-component v-model.capitalize="myText"></my-component>
```
```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  template: `
    <input type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `,
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
})
```

现在我们已经设置了 prop，我们可以检查 `modelModifiers` 对象键并编写一个处理器来更改发出的值。在下面的代码中，每当 `<input/>` 元素触发 `input` 事件时，我们都将字符串大写。
```html
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  {{ myText }}
</div>
```
```js
const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

app.mount('#app')
```

对于带参数的 `v-model` 绑定，生成的 prop 名称将为 `arg + "Modifiers"`：
```html
<my-component v-model:description.capitalize="myText"></my-component>
```
```js
app.component('my-component', {
  props: ['description', 'descriptionModifiers'],
  emits: ['update:description'],
  template: `
    <input type="text"
      :value="description"
      @input="$emit('update:description', $event.target.value)">
  `,
  created() {
    console.log(this.descriptionModifiers) // { capitalize: true }
  }
})
```

### 插槽

#### 插槽内容

它允许你像这样合成组件：
```html
<todo-button>
  Add todo
</todo-button>
```

然后在 `<todo-button>` 的模板中，你可能有：
```html
<!-- todo-button 组件模板 -->
<button class="btn-primary">
  <slot></slot>
</button>
```

当组件渲染的时候，`<slot></slot>` 将会被替换为“Add Todo”。
```html
<!-- 渲染 HTML -->
<button class="btn-primary">
  Add todo
</button>
```

不过，字符串只是开始！插槽还可以包含任何模板代码，包括 HTML：
```html
<todo-button>
  <!-- 添加一个Font Awesome 图标 -->
  <i class="fas fa-plus"></i>
  Add todo
</todo-button>
```

或其他组件
```html
<todo-button>
    <!-- 添加一个图标的组件 -->
  <font-awesome-icon name="plus"></font-awesome-icon>
  Add todo
</todo-button>
```

如果 `<todo-button>` 的 template 中没有包含一个 `<slot>` 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃
```html
<!-- todo-button 组件模板 -->

<button class="btn-primary">
  Create a new item
</button>
```
```html
<todo-button>
  <!-- 以下文本不会渲染 -->
  Add todo
</todo-button>
```

:::danger
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。
:::

#### 备用内容

有时为一个插槽设置具体的备用 (也就是默认的) 内容是很有用的，它只会在没有提供内容的时候被渲染。例如在一个 `<submit-button>` 组件中：
```html
<button type="submit">
  <slot></slot>
</button>
```

我们可能希望这个 `<button>` 内绝大多数情况下都渲染文本“Submit”。为了将“Submit”作为备用内容，我们可以将它放在 `<slot>` 标签内：
```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

现在当我们在一个父级组件中使用 `<submit-button>` 并且不提供任何插槽内容时：
```html
<submit-button></submit-button>
```

备用内容“Submit”将会被渲染：
```html
<button type="submit">
  Submit
</button>
```

但是如果我们提供内容：
```html
<submit-button>
  Save
</submit-button>
```

则这个提供的内容将会被渲染从而取代备用内容：
```html
<button type="submit">
  Save
</button>
```

#### 具名插槽

有时我们需要多个插槽。例如对于一个带有如下模板的 `<base-layout>` 组件：
```html
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>
```

对于这样的情况，`<slot>` 元素有一个特殊的 attribute：`name`。这个 attribute 可以用来定义额外的插槽：
```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

在向具名插槽提供内容的时候，我们可以在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：
```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

现在 `<template>` 元素中的所有内容都将会被传入相应的插槽。

渲染的 HTML 将会是：
```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

注意，`v-slot` 只能添加在 `<template>` 上 ([只有一种例外情况](#独占默认插槽的缩写语法))

### 作用域插槽

有时让插槽内容能够访问子组件中才有的数据是很有用的。当一个组件被用来渲染一个项目数组时，这是一个常见的情况，我们希望能够自定义每个项目的渲染方式。

例如，我们有一个组件，包含 todo-items 的列表。
```js
app.component('todo-list', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items">
        {{ item }}
      </li>
    </ul>
  `
})
```

要使 `item` 可用于父级提供的插槽内容，我们可以添加一个 `<slot>` 元素并将其作为一个 attribute 绑定：
```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item" :index="index" :another-attribute="anotherAttribute"></slot>
  </li>
</ul>
```

绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop**。现在在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：
```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

在这个例子中，我们选择将包含所有插槽 prop 的对象命名为 `slotProps`，但你也可以使用任意你喜欢的名字。

#### 独占默认插槽的缩写语法

在上述情况下，当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：
```html
<todo-list v-slot:default="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽：
```html
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

注意默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确：
```html
<!-- 无效，会导致警告 -->
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
  
  <template v-slot:other="otherSlotProps">
    slotProps is NOT available here
  </template>
</todo-list>
```

只要出现多个插槽，请始终为所有的插槽使用完整的基于 `<template>` 的语法：
```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

#### 解构插槽 Prop

作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：
```js
function (slotProps) {
  // ... 插槽内容 ...
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。你也可以使用 ES2015 解构来传入具体的插槽 prop，如下：
```html
<todo-list v-slot="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 `item` 重命名为 `todo`：
```html
<todo-list v-slot="{ item: todo }">
  <i class="fas fa-check"></i>
  <span class="green">{{ todo }}</span>
</todo-list>
```

你甚至可以定义备用内容，用于插槽 prop 是 undefined 的情形：
```html
<todo-list v-slot="{ item = 'Placeholder' }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

### 动态插槽名

动态指令参数也可以用在 `v-slot` 上，来定义动态的插槽名：
```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

### 具名插槽的缩写

跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：
```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：
```html
<!-- This will trigger a warning -->

<todo-list #="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：
```html
<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

### Provide / Inject

```js
const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe'
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- 模板的其余部分 -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入 property: John Doe
  }
})
```

要访问组件实例 property，我们需要将 `provide` 转换为返回对象的函数
```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  },
  template: `
    ...
  `
})
```

默认情况下，`provide/inject` 绑定并不是响应式的。我们可以通过传递一个 `ref` property 或 `reactive` 对象给 `provide` 来改变这种行为。在我们的例子中，如果我们想对祖先组件中的更改做出响应，我们需要为 provide 的 `todoLength` 分配一个组合式 API `computed` property：
```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})

app.component('todo-list-statistics', {
  inject: ['todoLength'],
  created() {
    console.log(`Injected property: ${this.todoLength.value}`) // > Injected property: 5
  }
})
```

### 在动态组件上使用 `keep-alive`

`is` 会重新创建动态组件:
```html
<component :is="currentTabComponent"></component>
```

`<keep-alive>` 缓存:
```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

### 异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了简化，Vue 有一个 `defineAsyncComponent` 方法：
```js
const { createApp, defineAsyncComponent } = Vue

const app = createApp({})

const AsyncComp = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: '<div>I am async!</div>'
      })
    })
)

app.component('async-example', AsyncComp)
```

如你所见，此方法接受返回 `Promise` 的工厂函数。从服务器检索组件定义后，应调用 `Promise` 的 `resolve` 回调。你也可以调用 `reject(reason)`，来表示加载失败。

你也可以在工厂函数中返回一个 `Promise`，把 webpack 2 和 ES2015 语法相结合后，我们就可以这样使用动态地导入：
```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

当在局部注册组件时，你也可以使用 `defineAsyncComponent`
```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

### 模板引用

尽管存在 prop 和事件，但有时你可能仍然需要直接访问 JavaScript 中的子组件。为此，可以使用 `ref` attribute 为子组件或 HTML 元素指定引用 ID。例如：
```html
<input ref="input" />
```

例如，你希望在组件挂载时，以编程的方式 focus 到这个 input 上，这可能有用
```js
const app = Vue.createApp({})

app.component('base-input', {
  template: `
    <input ref="input" />
  `,
  methods: {
    focusInput() {
      this.$refs.input.focus()
    }
  },
  mounted() {
    this.focusInput()
  }
})
```

此外，还可以向组件本身添加另一个 `ref`，并使用它从父组件触发 `focusInput` 事件：
```js
<base-input ref="usernameInput"></base-input>
this.$refs.usernameInput.focusInput()
```

:::warning
`$refs` 只会在组件渲染完成之后生效。这仅作为一个用于直接操作子元素的“逃生舱”——你应该避免在模板或计算属性中访问 `$refs`。
:::

## 过渡 & 动画

### 硬件加速

如果要对一个元素进行硬件加速，可以应用以下任何一个 property (并不是需要全部，任意一个就可以)：
```css
perspective: 1000px;
backface-visibility: hidden;
transform: translateZ(0);
```

许多像 GreenSock 这样的 JS 库都会默认你需要硬件加速，并在默认情况下应用，所以你不需要手动设置它们。

### Timing

对于简单 UI 过渡，即从一个状态到另一个没有中间状态的状态，通常使用 0.1s 到 0.4s 之间的计时，大多数人发现 0.25s 是一个最佳选择。

你也可能会发现，起始动画比结束动画的时间稍长一些，看起来会更好一些。用户通常是在动画开始时被引导的，而在动画结束时没有那么多耐心，因为他们想继续他们的动作。

### Easing

asing 是在动画中表达深度的一个重要方式。动画新手最常犯的一个错误是在起始动画节点使用 ease-in，在结束动画节点使用 ease-out。实际上你需要的是反过来的。
```css
.button {
  background: #1b8f5a;
  /* 应用于初始状态，因此此转换将应用于返回状态 */
  transition: background 0.25s ease-in;
}

.button:hover {
  background: #3eaf7c;
  /* 应用于悬停状态，因此在触发悬停时将应用此过渡 */
  transition: background 0.35s ease-out;
}
```

[cubic bezier](https://cubic-bezier.com)

[greensock API(GSAP)](https://greensock.com/)

[ease-visualizer](https://greensock.com/ease-visualizer)

## 可复用 & 组合

### 组合式 API

#### 介绍

新的 setup 选项在组件**创建之前**执行，一旦 `props` 被解析，就将作为组合式 API 的入口。

:::warning
在 `setup` 中你应该避免使用 `this`，因为它不会找到组件实例。`setup` 的调用发生在 `data` `property、computed` property 或 `methods` 被解析之前，所以它们无法在 `setup` 中被获取。
:::

`setup` 选项是一个接收 `props` 和 `context` 的函数，我们将在之后进行讨论。此外，我们将 `setup` 返回的所有内容都暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板。
```js
// src/components/UserRepositories.vue
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props, context) {
     // 使用 `toRefs` 创建对prop的 `user` property 的响应式引用
    const { user } = toRefs(props)

    const repositories = ref([])
    const getUserRepositories = async () => {
      // 更新 `prop.user` 到 `user.value` 访问引用值
      repositories.value = await fetchUserRepositories(user.value)

      // repositories.value = await fetchUserRepositories(props.user)
    }

    onMounted(getUserRepositories) // 在 `mounted` 时调用 `getUserRepositories`

     // 在 user prop 的响应式引用上设置一个侦听器
    watch(user, getUserRepositories)

    const searchQuery = ref('')
    const repositoriesMatchingSearchQuery = computed(() => {
      return repositories.value.filter(
        repository => repository.name.includes(searchQuery.value)
      )
    })

    return {
      repositories,
      getUserRepositories,
      searchQuery,
      repositoriesMatchingSearchQuery
    }
  },
  data () {
    return {
      filters: { ... }, // 3
      // searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    // repositoriesMatchingSearchQuery () { ... }, // 2
  },
  // watch: {
  //   user: 'getUserRepositories' // 1
  // },
  methods: {
    updateFilters () { ... }, // 3
  },
  // mounted () {
  //   this.getUserRepositories() // 1
  // }
}
```

我们已经将第一个逻辑关注点中的几个部分移到了 `setup` 方法中，它们彼此非常接近。剩下的就是在 `mounted` 钩子中调用 `getUserRepositories`，并设置一个监听器，以便在 `user` prop 发生变化时执行此操作。

我们首先要将上述代码提取到一个独立的**组合式函数**中。让我们从创建 `useUserRepositories` 函数开始：
```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

然后是搜索功能：
```js
// src/composables/useRepositoryNameSearch.js

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

**现在我们有了两个单独的功能模块，接下来就可以开始在组件中使用它们了。以下是如何做到这一点：**
```js
// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}
```

此时，你可能已经知道了其中的奥妙，所以让我们跳到最后，迁移剩余的过滤功能。我们不需要深入了解实现细节，因为这并不是本指南的重点。
```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

#### Setup

· 函数中的第一个参数是 `props`。正如在一个标准组件中所期望的那样，· 函数中的 `props` 是响应式的，当传入新的 prop 时，它将被更新。
```js
// MyBook.vue

export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

:::warning
但是，因为 `props` 是响应式的，你**不能使用 ES6 解构**，它会消除 prop 的响应性。
:::

如果需要解构 prop，可以在 setup 函数中使用 toRefs 函数来完成此操作：
```js
// MyBook.vue

import { toRefs } from 'vue'

setup(props) {
  const { title } = toRefs(props)

  console.log(title.value)
}
```

如果 `title` 是可选的 prop，则传入的 `props` 中可能没有 `title` 。在这种情况下，`toRefs` 将不会为 `title` 创建一个 ref 。你需要使用 `toRef` 替代它：
```js
// MyBook.vue
import { toRef } from 'vue'
setup(props) {
  const title = toRef(props, 'title')
  console.log(title.value)
}
```

传递给 `setup` 函数的第二个参数是 `context`。`context` 是一个普通的 JavaScript 对象，它暴露组件的三个 property：
```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attribute (非响应式对象)
    console.log(context.attrs)

    // 插槽 (非响应式对象)
    console.log(context.slots)

    // 触发事件 (方法)
    console.log(context.emit)
  }
}
```

`context` 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 `context` 使用 ES6 解构。
```js
// MyBook.vue
export default {
  setup(props, { attrs, slots, emit }) {
    ...
  }
}
```

`attrs` 和 `slots` 是有状态的对象，它们总是会随组件本身的更新而更新。这意味着你应该避免对它们进行解构，并始终以 `attrs.x` 或 `slots.x` 的方式引用 property。请注意，与 `props` 不同，`attrs` 和 `slots` 是非响应式的。如果你打算根据 `attrs` 或 `slots` 更改应用副作用，那么应该在 onUpdated 生命周期钩子中执行此操作。

#### 生命周期钩子

setup () 内部调用生命周期钩子：
| 选项式 API | Hook inside `setup` |
| - | - |
| `beforeCreate` | **Not needed*** |
| `created` | **Not needed*** |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeUnmount` | `onBeforeUnmount` |
| `unmounted` | `onUnmounted` |
| `errorCaptured` | `onErrorCaptured` |
| `renderTracked` | `onRenderTracked` |
| `renderTriggered` | `onRenderTriggered` |
| `activated` | `onActivated` |
| `deactivated` | `onDeactivated` |

:::tip
因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。
:::

#### Provide / Inject

- Provide

`provide` 函数允许你通过两个参数定义 property：
1. name (`<String>` 类型)
2. value

```vue{7,15-22}
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
</script>
```

- Inject

`inject` 函数有两个参数：
1. 要 inject 的 property 的 name
2. 默认值 (**可选**)

```vue{3,6-14}
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}
</script>
```

:::tip
当使用响应式 provide / inject 值时，**建议尽可能将对响应式 property 的所有修改限制在定义 provide 的组件内部。**
```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)

    return {
      location
    }
  },
  methods: {
    updateLocation() {
      this.location = 'South Pole'
    }
  }
}
</script>
```
```vue
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>
```
:::

#### 模板引用

```html
<template> 
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 元素将在初始渲染后分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })

      // watchEffect(() => {
      //   console.log(root.value) // => <div>This is a root element</div>
      // }, 
      // {
      //   flush: 'post'
      // })

      return {
        root
      }
    }
  }
</script>
```

这里我们在渲染上下文中暴露 `root`，并通过 ref="root"，将其绑定到 div 作为其 ref。在虚拟 DOM 补丁算法中，如果 VNode 的 ref 键对应于渲染上下文中的 ref，则 VNode 的相应元素或组件实例将被分配给该 ref 的值。这是在虚拟 DOM 挂载/打补丁过程中执行的，因此模板引用只会在初始渲染之后获得赋值。

作为模板使用的 ref 的行为与任何其他 ref 一样：它们是响应式的，可以传递到 (或从中返回) 复合函数中。

### Mixin

同名钩子函数将合并为一个数组，因此都将被调用。另外，mixin 对象的钩子将在组件自身钩子**之前**调用。
```js
const myMixin = {
  created() {
    console.log('mixin 对象的钩子被调用')
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  created() {
    console.log('组件钩子被调用')
  }
})

// => "mixin 对象的钩子被调用"
// => "组件钩子被调用"
```

### 自定义指令

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：
- `created`：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加须要在普通的 `v-on` 事件监听器前调用的事件监听器时，这很有用。
- `beforeMount`：当指令第一次绑定到元素并且在挂载父组件之前调用。
- `mounted`：在绑定元素的父组件被挂载后调用。
- `beforeUpdate`：在更新包含组件的 VNode 之前调用。
- `updated`：在包含组件的 VNode 及其子组件的 VNode 更新后调用。
- `beforeUnmount`：在卸载绑定元素的父组件之前调用
- `unmounted`：当指令与元素解除绑定且父组件已卸载时，只调用一次。

```html{4}
<div id="dynamicexample">
  <h2>Scroll down the page</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Stick me {{ pinPadding + 'px' }} from the {{ direction || 'top' }} of the page</p>
</div>
```
```js{5}
const app = Vue.createApp({
  data() {
    return {
      direction: 'right',
      pinPadding: 200
    }
  }
})
```
```js{7-10}
app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  },
  updated(el, binding) {
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

// 函数简写
// app.directive('pin', (el, binding) => {
//   el.style.position = 'fixed'
//   const s = binding.arg || 'top'
//   el.style[s] = binding.value + 'px'
// })
```

### 渲染函数

让我们深入一个简单的例子，这个例子里 `render` 函数很实用。假设我们要生成一些带锚点的标题：
```html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

锚点标题的使用非常频繁，我们应该创建一个组件：
```html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

当开始写一个只能通过 `level` prop 动态生成标题 (heading) 的组件时，我们很快就可以得出这样的结论：
```js
const { createApp } = Vue

const app = createApp({})

app.component('anchored-heading', {
  template: `
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
      <slot></slot>
    </h6>
  `,
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

我们来尝试使用 `render` 函数重写上面的例子：
```js
const { createApp, h } = Vue

const app = createApp({})

app.component('anchored-heading', {
  render() {
    return h(
      'h' + this.level, // tag name
      {}, // props/attributes
      this.$slots.default() // array of children
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

#### DOM 树

[DOM 节点树](https://zh.javascript.info/dom-nodes)

希望页面上的 HTML 是什么，这可以是在一个模板里：
```html
<h1>{{ blogTitle }}</h1>
```

或者一个渲染函数里：
```js
render() {
  return h('h1', {}, this.blogTitle)
}
```

#### 虚拟 DOM 树

Vue 通过建立一个**虚拟 DOM** 来追踪自己要如何改变真实 DOM。请仔细看这行代码：
```js
return h('h1', {}, this.blogTitle)
```
`h()` 到底会返回什么呢？其实不是一个实际的 DOM 元素。它更准确的名字可能是 createNodeDescription，因为它所包含的信息会**告诉 Vue 页面上需要渲染什么样的节点，包括及其子节点的描述信息**。我们把这样的节点描述为“虚拟节点 (virtual node)”，也常简写它为 `VNode`。“虚拟 DOM”是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。

#### `h()` 参数

`h()` 函数是一个用于创建 vnode 的实用程序。也许可以更准确地将其命名为 `createVNode()`，但由于频繁使用和简洁，它被称为 `h()` 。它接受三个参数：
```js
// @returns {VNode}
h(
  // {String | Object | Function} tag
  // 一个 HTML 标签名、一个组件、一个异步组件、或
  // 一个函数式组件。
  //
  // 必需的。
  'div',

  // {Object} props
  // 与 attribute、prop 和事件相对应的对象。
  // 我们会在模板中使用。
  //
  // 可选的。
  {},

  // {String | Array | Object} children
  // 子 VNodes, 使用 `h()` 构建,
  // 或使用字符串获取 "文本 Vnode" 或者
  // 有插槽的对象。
  //
  // 可选的。
  [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ]
)
```

如果没有 prop，那么通常可以将 children 作为第二个参数传入。如果会产生歧义，可以将 `null` 作为第二个参数传入，将 children 作为第三个参数传入。
```js
const { createApp, h } = Vue

const app = createApp({})

/** 递归地从子节点获取文本 */
function getChildrenTextContent(children) {
  return children
    .map(node => {
      return typeof node.children === 'string'
        ? node.children
        : Array.isArray(node.children)
        ? getChildrenTextContent(node.children)
        : ''
    })
    .join('')
}

app.component('anchored-heading', {
  render() {
    // 从 children 的文本内容中创建短横线分隔 (kebab-case) id。
    const headingId = getChildrenTextContent(this.$slots.default())
      .toLowerCase()
      .replace(/\W+/g, '-') // 用短横线替换非单词字符
      .replace(/(^-|-$)/g, '') // 删除前后短横线

    return h('h' + this.level, [
      h(
        'a',
        {
          name: headingId,
          href: '#' + headingId
        },
        this.$slots.default()
      )
    ])
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

#### JSX

特别是对应的模板如此简单的情况下：
```html
<anchored-heading :level="1"> <span>Hello</span> world! </anchored-heading>
```

这就是为什么会有一个 [Babel 插件](https://github.com/vuejs/jsx-next)，用于在 Vue 中使用 JSX 语法，它可以让我们回到更接近于模板的语法上。
```js
import AnchoredHeading from './AnchoredHeading.vue'

const app = createApp({
  render() {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})

app.mount('#demo')
```

## 高阶指南

### 响应性

#### 深入响应性原理

1. **当一个值被读取时进行追踪：**proxy 的 `get` 处理函数中 `track` 函数记录了该 property 和当前副作用。
2. **当某个值改变时进行检测：**在 proxy 上调用 `set` 处理函数。
3. **重新运行代码来读取原始值：**`trigger` 函数查找哪些副作用依赖于该 property 并执行它们。
```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      // 将嵌套对象包裹在自己的响应式代理中
      return reactive(value)
    } else {
      return value
    }
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

#### 响应性基础

- 声明响应式状态(`reactive`)

要为 JavaScript `对象`创建响应式状态，可以使用 `reactive` 方法：
```js
import { reactive } from 'vue'

// 响应式状态
const state = reactive({
  count: 0
})
```

当从组件中的 `data()` 返回一个对象时，它在内部交由 `reactive()` 使其成为响应式对象。

- 创建独立的响应式值作为 `refs` (`refs`)

独立的原始值 (例如，一个字符串)，我们想让它变成响应式的。
```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

`ref` 会返回一个可变的响应式对象，该对象作为一个响应式的引用维护着它内部的值，这就是 `ref` 名称的来源。

当 ref 作为渲染上下文 (从 setup() 中返回的对象) 上的 property 返回并可以在模板中被访问时，它将自动浅层次解包内部值。只有访问嵌套的 ref 时需要在模板中添加 `.value`：
```js
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
    <button @click="nested.count.value ++">Nested Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count,

        nested: {
          count
        }
      }
    }
  }
</script>
```

当 `ref` 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包内部值：
```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将新的 ref 赋值给现有 ref 的 property，将会替换旧的 ref：
```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```

Ref 解包仅发生在被响应式 `Object` 嵌套的时候。当从 `Array` 或原生集合类型如 `Map` 访问 ref 时，不会进行解包：
```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

我们需要将我们的响应式对象转换为一组 ref。这些 ref 将保留与源对象的响应式关联：
```js
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide' // 我们需要使用 .value 作为标题，现在是 ref
console.log(book.title) // 'Vue 3 Detailed Guide'
```

#### 响应式计算和侦听

##### `computed`

它接受 getter 函数并为 getter 返回的值返回一个不可变的响应式 ref 对象。
```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```
```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

`computed` 可接受一个带有 `onTrack` 和 `onTrigger` 选项的对象作为第二个参数：
- `onTrack` 会在某个响应式 property 或 ref 作为依赖被追踪时调用。
- `onTrigger` 会在侦听回调被某个依赖的修改触发时调用。

所有回调都会收到一个 debugger 事件，其中包含了一些依赖相关的信息。推荐在这些回调内放置一个 `debugger` 语句以调试依赖。
```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // 当 count.value 作为依赖被追踪时触发
    debugger
  },
  onTrigger(e) {
    // 当 count.value 被修改时触发
    debugger
  }
})
// 访问 plusOne，应该触发 onTrack
console.log(plusOne.value)
// 修改 count.value，应该触发 onTrigger
count.value++
```

onTrack 和 onTrigger 仅在开发模式下生效。

##### `watchEffect`

为了根据响应式状态自动应用和重新应用副作用，我们可以使用 `watchEffect` 方法。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。
```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

当 watchEffect 在组件的 setup() 函数或生命周期钩子被调用时，侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下，也可以显式调用返回值以停止侦听：
```js
const stop = watchEffect(() => {
  /* ... */
})

// later
stop()
```

侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作入参，用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发：
- 副作用即将重新执行时
- 侦听器被停止 (如果在 `setup()` 或生命周期钩子函数中使用了 `watchEffect`，则在组件卸载时)
```js
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id has changed or watcher is stopped.
    // invalidate previously pending async operation
    token.cancel()
  })
})
```

我们之所以是通过传入一个函数去注册失效回调，而不是从回调返回它，是因为返回值对于异步错误处理很重要。

在执行数据请求时，副作用函数往往是一个异步函数：
```js
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {
    /* ... */
  }) // 我们在Promise解析之前注册清除函数
  data.value = await fetchData(props.id)
})
```

我们知道异步函数都会隐式地返回一个 Promise，但是清理函数必须要在 Promise 被 resolve 之前被注册。另外，Vue 依赖这个返回的 Promise 来自动处理 Promise 链上的潜在错误。

下面这个例子中：
- `count` 会在初始运行时同步打印出来
- 更改 `count` 时，将在组件**更新前**执行副作用。
```js
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  setup() {
    const count = ref(0)

    watchEffect(() => {
      console.log(count.value)
    }, {
      // 在组件更新(例如：当与模板引用一起)后重新运行侦听器副作用
      // 默认为 'pre'
      flush: 'post',
      onTrigger(e) {
        debugger
      }
    })

    return {
      count
    }
  }
}
</script>
```

`onTrack` 和 `onTrigger` 选项可用于调试侦听器的行为。
- `onTrack` 将在响应式 property 或 ref 作为依赖项被追踪时被调用。
- `onTrigger` 将在依赖项变更导致副作用被触发时被调用。

从 Vue 3.2.0 开始，`watchPostEffect` 和 `watchSyncEffect` 别名也可以用来让代码意图更加明显。

##### `watch`

与 watchEffect 比较，watch 允许我们：
- 懒执行副作用；
- 更具体地说明什么状态应该触发侦听器重新运行；
- 访问侦听状态变化前后的值。

侦听器数据源可以是返回值的 getter 函数，也可以直接是 ref：
```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

侦听器还可以使用数组同时侦听多个源：
```js
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

尽管如此，如果你在同一个方法里同时改变这些被侦听的来源，侦听器仍只会执行一次：
```js
setup() {
  const firstName = ref('')
  const lastName = ref('')

  watch([firstName, lastName], (newValues, prevValues) => {
    console.log(newValues, prevValues)
  })

  const changeValues = () => {
    firstName.value = 'John'
    lastName.value = 'Smith'
    // 打印 ["John", "Smith"] ["", ""]
  }

  return { changeValues }
}
```

注意多个同步更改只会触发一次侦听器。

通过更改设置 `flush: 'sync'`，我们可以为每个更改都强制触发侦听器，尽管这通常是不推荐的。或者，可以用 `nextTick` 等待侦听器在下一步改变之前运行。例如：
```js
const changeValues = async () => {
  firstName.value = 'John' // 打印 ["John", ""] ["", ""]
  await nextTick()
  lastName.value = 'Smith' // 打印 ["John", "Smith"] ["John", ""]
}
```

使用侦听器来比较一个数组或对象的值，这些值是响应式的，要求它有一个由值构成的副本。
```js
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
```

尝试检查深度嵌套对象或数组中的 property 变化时，仍然需要 `deep` 选项设置为 true。
```js
const state = reactive({ 
  id: 1,
  attributes: { 
    name: '',
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log('not deep', state.attributes.name, prevState.attributes.name)
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log('deep', state.attributes.name, prevState.attributes.name)
  },
  { deep: true }
)

state.attributes.name = 'Alex' // 日志: "deep" "Alex" "Alex"
```

然而，**侦听一个响应式对象或数组将始终返回该对象的当前值和上一个状态值的引用**。为了完全侦听深度嵌套的对象和数组，可能需要对值进行深拷贝。这可以通过诸如 lodash.cloneDeep 这样的实用工具来实现。
```js
import _ from 'lodash'

const state = reactive({
  id: 1,
  attributes: {
    name: '',
  }
})

watch(
  () => _.cloneDeep(state),
  (state, prevState) => {
    console.log(state.attributes.name, prevState.attributes.name)
  }
)

state.attributes.name = 'Alex' // 日志: "Alex" ""
```

:::tip
`watch` 与 `watchEffect` 共享停止侦听，清除副作用 (相应地 `onInvalidate` 会作为回调的第三个参数传入)、副作用刷新时机和侦听器调试行为。
:::

<cite>[-- 《vue3官方文档》](https://v3.cn.vuejs.org/)</cite>
