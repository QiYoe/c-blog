module.exports = {
  repo: 'QiYoe/c-blog',
  docsDir: 'docs',
  
  editLinks: true,
  editLinkText: '在 GitHub 上编辑此页',
  lastUpdated: '最新更新时间',

  nav: [
    { text: '首页', link: '/' },
    {
      text: '前端',
      ariaLabel: '前端',
      items: [
        { text: '博客相关', link: '/front-end/blog-build/' },
        { text: '前端代码风格规范', link: '/front-end/lint/' },
        { text: 'SwaggerHub', link: '/front-end/swagger-hub/' },
        { text: 'Linux相关', link: '/front-end/linux/' },
        { text: 'Vue', link: '/front-end/vue/' },
        { text: 'AST', link: '/front-end/ast/' },
        { text: 'CSS', link: '/front-end/css/' },
        { text: 'Git', link: '/front-end/git/' },
        { text: 'WebSocket', link: '/front-end/websocket/' },
        { text: 'WebContainer', link: '/front-end/web-container/' },
      ]
    },
    {
      text: '书籍',
      ariaLabel: '书籍',
      items: [
        { text: '你不知道的JavaScript', link: '/books/you-dont-know-js' },
        { text: 'JavaScript深入系列', link: '/books/js-advice' },
        { text: 'TypeScript入门教程', link: '/books/typescript-tutorial' },
        { text: '深入理解TypeScript', link: '/books/typescript-deep-dive' },
        { text: 'CSS揭秘', link: '/books/css-tricks' },
        { text: '算法图解', link: '/books/grokking-algorithms' },
        { text: 'Pro-Git', link: '/books/pro-git' },
        { text: 'Docker-从入门到实践', link: '/books/docker-practice' },
        { text: 'Everything Curl', link: '/books/everything-curl' },
      ]
    },
    {
      text: '算法',
      ariaLabel: '算法',
      items: [
        {text: 'LeetCode', link: '/algorithm/leetcode' },
        {text: 'Lodash', link: '/algorithm/lodash' },
      ]
    },
    {
      text: 'DevOps',
      ariaLabel: 'DevOps',
      items: [
        {text: 'Jira', link: '/devops/jira' },
      ]
    },
    {
      text: 'Cesium',
      ariaLabel: 'Cesium',
      items: [
        {text: 'Cesium加载', link: '/cesium/clb' },
        {text: 'Cesium用例', link: '/cesium/examples/entity' },
      ]
    },
    {
      text: '其他',
      ariaLabel: '其他',
      // link: '/other/'
      items: [
        {text: 'Markdown', link: '/other/smart-tools' },
        {text: '计算机基础知识', link: '/other/computer-tech' },
        {text: '30 seconds of code', link: '/other/30-seconds-of-code' },
        {text: 'vanillawebprojects', link: '/other/vanillawebprojects' },
      ]
    },
    {
      text: '摘抄语录',
      ariaLabel: '摘抄语录',
      link: '/quotations/'
    },
  ],
 
  sidebar: {
    '/front-end/': getFrontEndSidebar(),
    '/books/': getBooksSidebar(),
    '/other/': getOtherSidebar(),
    '/algorithm/': getAlgorithmSidebar(),
    '/devops/': getDevOpsSidebar(),
    '/cesium/': getCesiumSidebar(),
  }
}

function getFrontEndSidebar() {
  return [
    {
      text: '博客相关',
      children: [
        { text: '博客搭建', link: '/front-end/blog-build/' },
        { text: '百度收录', link: '/front-end/blog-build/baidu-include' },
        { text: 'SEO优化', link: '/front-end/blog-build/seo-optimize' },
        { text: '阿里云域名', link: '/front-end/blog-build/aliyun-domin' },
      ]
    },
    {
      text: '前端代码风格规范',
      children: [
        { text: '介绍', link: '/front-end/lint/' },
        { text: 'Husky', link: '/front-end/lint/husky' },
        { text: 'Commitlint', link: '/front-end/lint/commitlint' },
        { text: 'Commitizen', link: '/front-end/lint/commitizen' },
        { text: 'Lint-staged', link: '/front-end/lint/lint-staged' },
      ]
    },
    {
      text: 'SwaggerHub',
      children: [
        { text: 'SwaggerHub使用教程', link: '/front-end/swagger-hub/' },
        { text: 'Curl', link: '/front-end/swagger-hub/curl' },
      ]
    },
    {
      text: 'Linux相关',
      children: [
        { text: 'Linux启动Nginx服务', link: '/front-end/linux/' },
        { text: 'Nginx', link: '/front-end/linux/nginx' },
        { text: 'Docker', link: '/front-end/linux/docker' },
        { text: 'Jenkins', link: '/front-end/linux/jenkins' },
        { text: 'Kubernetes', link: '/front-end/linux/kubernetes' },
      ]
    },
    {
      text: 'Vue',
      children: [
        { text: 'Vue3学习笔记', link: '/front-end/vue/' },
        { text: 'Axios学习笔记', link: '/front-end/vue/axios' },
        { text: 'VueRouter学习笔记', link: '/front-end/vue/vue-router' },
        { text: 'TS学习笔记', link: '/front-end/vue/typescript' },
        { text: 'Vite学习笔记', link: '/front-end/vue/vite' },
        { text: 'Nuxt学习笔记', link: '/front-end/vue/nuxt' },
      ]
    },
    {
      text: 'AST',
      children: [
        { text: 'AST详解', link: '/front-end/ast/' },
        { text: 'The-Super-Tiny-Compiler', link: '/front-end/ast/the-super-tiny-compiler' },
      ]
    },
    {
      text: 'CSS',
      children: [
        { text: 'PostCSS', link: '/front-end/css/' },
        { text: 'TailWind', link: '/front-end/css/tailwind' },
        { text: 'Sass', link: '/front-end/css/sass' },
      ]
    },
    {
      text: 'Git',
      children: [
        { text: 'git入门指南', link: '/front-end/git/' },
        { text: 'git进阶', link: '/front-end/git/advance' },
        { text: 'git飞行规则', link: '/front-end/git/flight-rules' }
      ]
    },
    {
      text: 'WebSocket',
      children: [
        { text: 'WebSocket', link: '/front-end/websocket/' }
      ]
    },
    {
      text: 'WebContainer',
      children: [
        { text: 'webContainer详解', link: '/front-end/web-container/' }
      ]
    }
  ]
}

function getBooksSidebar() {
  return [
    {
      text: '书籍',
      children: [
        { text: '你不知道的JavaScript', link: '/books/you-dont-know-js' },
        { text: 'JavaScript深入系列', link: '/books/js-advice' },
        { text: 'TypeScript入门教程', link: '/books/typescript-tutorial' },
        { text: '深入理解TypeScript', link: '/books/typescript-deep-dive' },
        { text: 'CSS揭秘', link: '/books/css-tricks' },
        { text: '算法图解', link: '/books/grokking-algorithms' },
        { text: 'Pro-Git', link: '/books/pro-git' },
        { text: 'Docker-从入门到实践', link: '/books/docker-practice' },
        { text: 'Everything Curl', link: '/books/everything-curl' },
      ]
    }
  ]
}

function getOtherSidebar() {
  return [
    {
      text: '其他',
      children: [
        { text: 'markdown', link: '/other/smart-tools' },
        { text: '计算机基础知识', link: '/other/computer-tech' },
        { text: '30 seconds of code', link: '/other/30-seconds-of-code' },
        { text: 'vanillawebprojects', link: '/other/vanillawebprojects' },
      ]
    }
  ]
}

function getAlgorithmSidebar() {
  return [
    {
      text: '算法',
      children: [
        { text: 'LeetCode', link: '/algorithm/leetcode' },
        { text: 'Lodash', link: '/algorithm/lodash' },
      ]
    }
  ]
}

function getDevOpsSidebar() {
  return [
    {
      text: 'DevOps',
      children: [
        { text: 'Jira', link: '/devops/jira' },
      ]
    }
  ]
}
function getCesiumSidebar() {
  return [
    {
      text: 'Cesium加载',
      children: [
        { text: '离线加载', link: '/cesium/clb' },
      ]
    },
    {
      text: 'Cesium用例',
      children: [
        { text: 'Beginner', link: '/cesium/examples/beginner' },
        { text: '3D Tiles', link: '/cesium/examples/3DTiles' },
        { text: 'ImageryProvider', link: '/cesium/examples/imageryProvider' },
      ]
    }
  ]
}
