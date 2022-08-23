<template>
  <div class="NotFound">
    <p class="code">404</p>
    <h1 class="title">该页面未找到</h1>
    <div class="divider" />
    <blockquote class="quote">
      {{ getMsg() }}
    </blockquote>

    <div class="action">
      <a class="link" :href="site.base" aria-label="返回主页">
        返回主页
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()

const msgs = [
  `这里什么也没有。`,
  `我们是怎么走到这一步的?`,
  `这是一个404页面。`,
  `看来有一些链接坏了。`
]

function getMsg() {
  return msgs[Math.floor(Math.random() * msgs.length)]
}
</script>

<style scoped>
.NotFound {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 96px 32px 168px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider)
}

.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition: border-color 0.25s, color .25s;
}

.link:hover {
  border-color: var(--vp-c-brand-dark);
  color: var(--vp-c-brand-dark);
}
</style>
