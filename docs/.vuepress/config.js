const themeConfig = require('./config/theme/')

module.exports = {
  title: '南上康青山',
  description: "Don't forget, a person's greatest emotional need is to feel appreciated.",
  dest: 'public',
//   base: '/c-blog/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/medium-zoom', 'flowchart']
}
