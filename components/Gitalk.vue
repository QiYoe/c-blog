<template>
  <Gitalk
    clientID='c56c04ef74d5cb6792f3'
    clientSecret='821b08b1bee53fe40c03b1e93f6e8320cc81c4a5'
    repo='https://github.com/QiYoe/c-blog'
    owner='QiYoe'
    :admin="['QiYoe']"
    :id="location.pathname"
    :distractionFreeMode=true
    language='zh-CN'
  />
</template>

<script setup>
import Gitalk from "gitalk/dist/gitalk-component";
</script>

<!-- <template>
  <div id="gitalk-container"></div>
</template>

<script>
  export default {
    name: "blog-comments",
    mounted() {
      const commentConfig = {
        // 是否开启
        enable: true,
        // clientID
        clientID: "a6598e156cf30077f530",
        // clientSecret
        clientSecret: "98937aee37a93913b415f2688ad92d351c5e0c52",
        // 评论项目名
        repo: 'blog-comments',
        owner: 'crazymryan',
        admin: ['crazymryan'],
        githubID:'crazymryan',
        id: decodeURI(window.location.pathname),
        language:'zh-CN',
        distractionFreeMode: true
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render("gitalk-container");
    },
  };
</script> -->
