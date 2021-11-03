const head = require('./config/head')
const themeConfig = require('./config/themeConfig')
const string = require('string')

module.exports = {
  lang: 'zh-CN',
  title: '南上康青山',
  description: "分享前端、后端开发的一些小经验",
  root: '/',
  // base: '/c-blog/',
  head,
  themeConfig,
  url: 'https://qiyoe.cn',
  markdown: {
    // options for markdown-it-anchor
    anchor: {  
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#',
      slugify: (s) => string(s).slugify().toString()
    },

    // options for markdown-it-toc
    toc: { includeLevel: [2, 3] },

    config: (md) => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-multimd-table'), {
          multiline:  true,
          rowspan:    true,
          headerless: true
        })
        .use(require('markdown-it-ins'))
        .use(require('markdown-it-textual-uml'))
    }
  }
}
