const themeConfig = require('./config/theme/')
const autometa_options = {
  site: {
    name: '南上康青山'
  },
  canonical_base: 'https://qiyoe.cn',
};

module.exports = {
  title: '南上康青山',
  description: "一个记录个人学习、分享经验和生活的狗窝",
  dest: 'public',
//   base: '/c-blog/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'baidu-site-verification', content: 'code-5BMDhSDgSq'}],
    ['meta', { name: 'keywords', content: '南上康青山, vuepress, blog, 博客, 狗窝'}],
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['meta', { name: 'baidu_union_verify', content: 'acd0eb90461e19817cabd1140c8ffd54' }],
    [
      "script",
      {
        "data-ad-client": "ca-pub-7969952937237973",
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      }
    ],
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?1801e4a45f1eecdfe603fc0637120c56";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);

        // 引入谷歌,不需要可删除这段
        var hm1 = document.createElement("script");
        hm1.src = "https://www.googletagmanager.com/gtag/js?id=G-SBNLNM3Q41";
        var s1 = document.getElementsByTagName("script")[0]; 
        s1.parentNode.insertBefore(hm1, s1);
      })();

      // 谷歌加载,不需要可删除
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-SBNLNM3Q41');
    `]
  ],
  theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true,
    externalLinks: { target: '_black', rel: 'nofollow noopener noreferrer'}
  },
  url: 'https://qiyoe.cn',
  root: '/',
//   permalink: ':title.html',
//   permalink_defaults: '',
  plugins: [
    '@vuepress/medium-zoom',
    'flowchart',
    [
      '@vuepress/google-analytics',
      {
        'ga': 'G-SBNLNM3Q41' // UA-00000000-0
      }
    ],
    ['autometa', autometa_options],
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
}
