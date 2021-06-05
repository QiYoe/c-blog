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
        { 
          text: '博客相关',
          link: '/front-end/blog-build/vitepress-build',
          activeMatch: '^/front-end/'
        },
        { 
          text: 'SwaggerHub',
          link: '/front-end/swagger-hub/',
          activeMatch: '^/front-end/'
        },
        { 
          text: 'Linux相关',
          link: '/front-end/linux/',
          activeMatch: '^/front-end/'
        },
      ]
    },
    {
      text: '书籍',
      ariaLabel: '书籍',
      items: [
        {
          text: '你不知道的JavaScript',
          link: '/books/you-dont-know-js',
          activeMatch: '^/books/'
        }
      ]
    },
    {
      text: '算法',
      ariaLabel: '算法',
      items: [
        {
          text: 'LeetCode',
          link: '/algorithm/leetcode',
          activeMatch: '^/algorithm/'
        }
      ]
    },
    {
      text: '工具',
      ariaLabel: '工具',
      link: '/tools/smart-tools'
    }
  ],

  sidebar: {
    '/front-end/': getFrontEndSidebar(),
    '/books/': getBooksSidebar(),
    '/tools/': getToolsSidebar(),
    '/algorithm/': getAlgorithmSidebar()
  }
}

function getFrontEndSidebar() {
  return [
    {
      text: '博客相关',
      children: [
        { text: '博客搭建', link: '/front-end/blog-build/vitepress-build' },
        { text: '百度收录', link: '/front-end/blog-build/baidu-include' },
        { text: 'SEO优化', link: '/front-end/blog-build/seo-optimize' },
        { text: '阿里云域名', link: '/front-end/blog-build/aliyun-domin' },
      ]
    },
    {
      text: 'SwaggerHub',
      children: [
        { text: 'SwaggerHub使用教程', link: '/front-end/swagger-hub/' }
      ]
    },
    {
      text: 'Linux相关',
      children: [
        { text: 'Linux启动Nginx服务', link: '/front-end/linux/' },
        { text: 'Nginx配置', link: '/front-end/linux/nginx' }
      ]
    }
  ]
}

function getBooksSidebar() {
  return [
    {
      text: '前端书籍',
      children: [{ text: '你不知道的JavaScript', link: '/books/you-dont-know-js' }]
    }
  ]
}

function getToolsSidebar() {
  return [
    {
      text: '常用工具',
      children: [{ text: 'markdown', link: '/tools/smart-tools' }]
    }
  ]
}

function getAlgorithmSidebar() {
  return [
    {
      text: '算法',
      children: [{ text: 'markdown', link: '/algorithm/leetcode' }]
    }
  ]
}
