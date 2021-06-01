<template>
  <div class="theme">
    <h1>404</h1>
    <blockquote>{{ getMsg() }}</blockquote>
    <a :href="$site.base" aria-label="go to home">
      返回主页.
    </a>
  </div>
</template>

<script>
const msgs = [
  `这里什么也没有。`,
  `我们是怎么走到这一步的?`,
  `这是一个404页面。`,
  `看来有一些链接坏了。`
]

export default {
  setup: () => ({
    getMsg() {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  })
}
</script>
