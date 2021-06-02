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
          text: '博客搭建',
          link: '/front-end/vitepress-build',
          activeMatch: '^/front-end/'
        }
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
      text: '工具',
      ariaLabel: '工具',
      link: '/tools/smart-tools'
    }
  ],

  sidebar: {
    '/front-end/': getFrontEndSidebar(),
    '/books/': getBooksSidebar(),
    '/tools/': getToolsSidebar()
  }
}

function getFrontEndSidebar() {
  return [
    {
      text: '博客相关',
      children: [
        { text: '博客搭建', link: '/front-end/vitepress-build' },
        { text: '百度收录', link: '/front-end/baidu-include' },
        { text: 'SEO优化', link: '/front-end/seo-optimize' },
        { text: '阿里云域名', link: '/front-end/aliyun-domin' },
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
