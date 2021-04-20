const themeReco = require('./themeReco.js')
const nav = require('../nav/')
const sidebar = require('../sidebar/')

module.exports = Object.assign({}, themeReco, {
  nav,
  sidebar,
  // // logo: '/head.png',
  // // 搜索设置
  search: true,
  searchMaxSuggestions: 10,
  // 自动形成侧边导航
  sidebar: 'auto',
  valineConfig: {
    appId: 'GKPfReaObN41kUWNy1ktUOAg-gzGzoHsz',// your appId
    appKey: 'JQUswxYaCmzNPJasurnphUS3', // your appKey
    avatar: 'wavatar' // (''/mp/identicon/monsterid/wavatar/robohash/retro/hide)
  },
  vssueConfig: {
    platform: 'github',
    // owner: 'OWNER_OF_REPO',
    // repo: 'NAME_OF_REPO',
    // clientId: 'YOUR_CLIENT_ID',
    // clientSecret: 'YOUR_CLIENT_SECRET',
  }
})
