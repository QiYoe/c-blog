const head = require('./config/head')
const themeConfig = require('./config/themeConfig')
const plugins = require('./config/plugins')

module.exports = {
  lang: 'zh-CN',
  title: '南上康青山',
  description: "一个记录个人学习、分享经验和生活的狗窝",
  logo: '/favicon.ico',
//   base: '/c-blog/',
  head,
  // theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true,
    externalLinks: { target: '_black', rel: 'nofollow noopener noreferrer'}
  },
  url: 'https://qiyoe.cn',
  root: '/',
//   permalink: ':title.html',
//   permalink_defaults: '',
  plugins
}
