import { DefaultTheme } from '../types/default-theme';
import { UserConfig } from "../types";
import head from './head';

/**
 * Type config helper
 */
export function defineConfig(config: UserConfig<DefaultTheme.Config>) {
  return config
}

export default defineConfig({
  lang: 'zh-CN',
  title: '青山',
  description: '学无止境',

  head,

  vue: {
    reactivityTransform: true
  },

  lastUpdated: true,

  // markdown: {
  //   config: (md) => {
  //     md.use(MarkDownItCustomAnchor)
  //   }
  // },

  themeConfig: {
    logo: '/logo.svg',

    nav: nav(),

    sidebar: {
      '/code/': sidebarCode(),
      '/book/': sidebarBook(),
      '/money/': sidebarMoney(),
    },

    editLink: {
      pattern: 'https://github.com/QiYoe/c-blog/edit/master/:path',
      text: '在 GitHub 上编辑此页'
    },
    lastUpdatedText: '最新更新时间',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outlineTitle: '大纲',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/QiYoe/c-blog' }
    ],

    footer: {
      message: '根据 MIT 许可证发布。',
      copyright: 'Copyright © 2021-present QiYoe'
    },

    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // }
  }
})

function nav() {
  return [
    { 
      text: '编程',
      items: [
        { text: '前端', link: '/code/front-end/blog-build/', activeMatch: '/code/front-end/blog-build/' },
        { text: '算法', link: '/code/algorithm/leetcode', activeMatch: '/code/algorithm/leetcode' },
        { text: 'Cesium', link: '/code/cesium/clb', activeMatch: '/code/cesium/clb' },
        { text: 'DevOps', link: '/code/devops/jira', activeMatch: '/code/devops/jira' },
        { text: '其他', link: '/code/other/30-seconds-of-code', activeMatch: '/code/other/30-seconds-of-code' },
      ]
     },
    { text: '书籍', link: '/book/front-end/you-dont-know-js', activeMatch: '/book/front-end/you-dont-know-js' },
    { text: '理财', link: '/money/', activeMatch: '/money/' },
    { text: '短视频', link: '/video/', activeMatch: '/video/' },
  ]
}

function sidebarCode() {
  return [
    {
      text: '博客相关',
      collapsible: true,
      items: [
        { text: '博客搭建', link: '/code/front-end/blog-build/' },
        { text: '百度收录', link: '/code/front-end/blog-build/baidu-include' },
        { text: 'SEO优化', link: '/code/front-end/blog-build/seo-optimize' },
        { text: '阿里云域名', link: '/code/front-end/blog-build/aliyun-domin' },
      ]
    },
    {
      text: '前端代码风格规范',
      collapsible: true,
      collapsed: true,
      items: [
        { text: '介绍', link: '/code/front-end/lint/' },
        { text: 'Husky', link: '/code/front-end/lint/husky' },
        { text: 'Commitlint', link: '/code/front-end/lint/commitlint' },
        { text: 'Commitizen', link: '/code/front-end/lint/commitizen' },
        { text: 'Lint-staged', link: '/code/front-end/lint/lint-staged' },
      ]
    },
    {
      text: 'SwaggerHub',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'SwaggerHub使用教程', link: '/code/front-end/swagger-hub/' },
        { text: 'Curl', link: '/code/front-end/swagger-hub/curl' },
      ]
    },
    {
      text: 'Linux相关',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'Linux启动Nginx服务', link: '/code/front-end/linux/' },
        { text: 'Nginx', link: '/code/front-end/linux/nginx' },
        { text: 'Docker', link: '/code/front-end/linux/docker' },
        { text: 'Jenkins', link: '/code/front-end/linux/jenkins' },
        { text: 'Kubernetes', link: '/code/front-end/linux/kubernetes' },
      ]
    },
    {
      text: 'Vue',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'Vue3学习笔记', link: '/code/front-end/vue/' },
        { text: 'Axios学习笔记', link: '/code/front-end/vue/axios' },
        { text: 'VueRouter学习笔记', link: '/code/front-end/vue/vue-router' },
        { text: 'TS学习笔记', link: '/code/front-end/vue/typescript' },
        { text: 'Vite学习笔记', link: '/code/front-end/vue/vite' },
        { text: 'Nuxt学习笔记', link: '/code/front-end/vue/nuxt' },
      ]
    },
    {
      text: 'AST',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'AST详解', link: '/code/front-end/ast/' },
        { text: 'The-Super-Tiny-Compiler', link: '/code/front-end/ast/the-super-tiny-compiler' },
      ]
    },
    {
      text: 'CSS',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'PostCSS', link: '/code/front-end/css/' },
        { text: 'TailWind', link: '/code/front-end/css/tailwind' },
        { text: 'Sass', link: '/code/front-end/css/sass' },
      ]
    },
    {
      text: 'Git',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'git入门指南', link: '/code/front-end/git/' },
        { text: 'git进阶', link: '/code/front-end/git/advance' },
        { text: 'git飞行规则', link: '/code/front-end/git/flight-rules' }
      ]
    },
    {
      text: 'WebSocket',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'WebSocket', link: '/code/front-end/websocket/' }
      ]
    },
    {
      text: 'WebContainer',
      collapsible: true,
      collapsed: true,
      items: [
        { text: 'webContainer详解', link: '/code/front-end/web-container/' }
      ]
    },
    {
      text: '算法',
      collapsible: true,
      // collapsed: true,
      items: [
        { text: 'LeetCode', link: '/code/algorithm/leetcode' },
        { text: 'Lodash', link: '/code/algorithm/lodash' },
      ]
    },
    {
      text: 'Cesium',
      collapsible: true,
      // collapsed: true,
      items: [
        { text: 'Cesium 离线加载', link: '/code/cesium/clb' },
        { text: 'Cesium 用例', link: '/code/cesium/examples/tutorials' },
      ]
    },
    {
      text: '算法',
      collapsible: true,
      // collapsed: true,
      items: [
        { text: 'DevOps', link: '/code/devops/jira' },
      ]
    },
    {
      text: '其他',
      collapsible: true,
      // collapsed: true,
      items: [
        { text: 'markdown', link: '/code/other/smart-tools' },
        { text: '计算机基础知识', link: '/code/other/computer-tech' },
        { text: '30 seconds of code', link: '/code/other/30-seconds-of-code' },
        { text: 'vanillawebprojects', link: '/code/other/vanillawebprojects' },
      ]
    },
  ]
}

function sidebarBook() {
  return [
    {
      text: '前端',
      collapsible: true,
      items: [
        { text: '你不知道的JavaScript', link: '/book/front-end/you-dont-know-js' },
        { text: 'JavaScript深入系列', link: '/book/front-end/js-advice' },
        { text: 'TypeScript入门教程', link: '/book/front-end/typescript-tutorial' },
        { text: '深入理解TypeScript', link: '/book/front-end/typescript-deep-dive' },
        { text: 'CSS揭秘', link: '/book/front-end/css-tricks' },
        { text: '算法图解', link: '/book/front-end/grokking-algorithms' },
        { text: 'Pro-Git', link: '/book/front-end/pro-git' },
        { text: 'Docker-从入门到实践', link: '/book/front-end/docker-practice' },
        { text: 'Everything Curl', link: '/book/front-end/everything-curl' },
      ]
    },
    {
      text: '摘抄',
      collapsible: true,
      items: [
        { text: '摘抄语录', link: '/book/quotations' },
      ]
    },
  ]
}

function sidebarMoney() {
  return [
    {
      text: '理财',
      collapsible: true,
      items: [
        { text: '基金', link: '/money/' },
      ]
    }
  ]
}
