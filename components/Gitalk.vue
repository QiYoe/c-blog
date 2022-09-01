<template>
  <div id="gitalk-container"></div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted } from 'vue'
import md5 from 'md5'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

const gitalk = new Gitalk({
  clientID: 'c56c04ef74d5cb6792f3',
  clientSecret: '821b08b1bee53fe40c03b1e93f6e8320cc81c4a5',
  repo: 'c-blog',
  owner: 'QiYoe',
  admin: ['QiYoe'],
  id: md5(location.pathname),      // Ensure uniqueness and length less than 50
  distractionFreeMode: false,  // Facebook-like distraction free mode
  language: 'zh-CN',
  proxy: 'https://cloudflare-cors-anywhere.qiyoe.workers.dev/?https://github.com/login/oauth/access_token'
})

onMounted(() => {
  gitalk.render('gitalk-container')
})
</script>
