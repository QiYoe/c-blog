<template>
  <div id="gitalk-container"></div>
</template>

<script setup>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

const gitalk = new Gitalk({
  clientID: 'c56c04ef74d5cb6792f3',
  clientSecret: '821b08b1bee53fe40c03b1e93f6e8320cc81c4a5',
  repo: 'https://github.com/QiYoe/c-blog',
  owner: 'QiYoe',
  admin: ['QiYoe'],
  id: location.pathname,      // Ensure uniqueness and length less than 50
  distractionFreeMode: true,  // Facebook-like distraction free mode
  language: 'zh-CN'
})

gitalk.render('gitalk-container')
</script>
