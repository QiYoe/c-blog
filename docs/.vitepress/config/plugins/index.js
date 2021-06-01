module.exports = [
  ['@vuepress/back-to-top', true],
  '@vuepress/medium-zoom',
  'flowchart',
  [
    '@vuepress/google-analytics',
    {
      'ga': 'G-SBNLNM3Q41' // UA-00000000-0
    }
  ],
  ['autometa', {
    site: { name: '南上康青山' },
    canonical_base: 'https://qiyoe.cn'
  }],
  ['sitemap', {
      hostname: "https://qiyoe.cn",
      // 排除无实际内容的页面
      exclude: ["/404.html"]
    }
  ],
  ['feed', { canonical_base: 'https://qiyoe.cn' }],
  'vuepress-plugin-baidu-autopush',
  ['@vuepress/pwa', {
    serviceWorker: true,
    updatePopup: {
      message: "发现新内容可用",
      buttonText: "刷新"
    }
  }]
]
