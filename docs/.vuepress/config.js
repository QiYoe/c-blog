const themeConfig = require('./config/theme/')

module.exports = {
  title: '南上康青山',
  description: "Don't forget, a person's greatest emotional need is to feel appreciated.",
  dest: 'public',
//   base: '/c-blog/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
//     ['script', {}, `
//       var _hmt = _hmt || [];
//       (function() {
//       var hm = document.createElement("script");
//       hm.src = "https://hm.baidu.com/hm.js?**********************";
//       var s = document.getElementsByTagName("script")[0]; 
//       s.parentNode.insertBefore(hm, s);

//       // 引入谷歌,不需要可删除这段
//       var hm1 = document.createElement("script");
//       hm1.src = "https://www.googletagmanager.com/gtag/js?id=UA-00000000-1";
//       var s1 = document.getElementsByTagName("script")[0]; 
//       s1.parentNode.insertBefore(hm1, s1);
//       })();

//       // 谷歌加载,不需要可删除
//       window.dataLayer = window.dataLayer || [];
//       function gtag(){dataLayer.push(arguments);}
//       gtag('js', new Date());

//       gtag('config', 'UA-00000000-1');
//     `]
  ],
  theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true
  },
  url: 'https://qiyoe.cn',
  root: '/',
  permalink: ':title.html',
  permalink_defaults: '',
  plugins: [
    '@vuepress/medium-zoom',
    'flowchart',
//     [
//       '@vuepress/google-analytics',
//       {
//         'ga': 'UA-149666038-1' // UA-00000000-0
//       }
//     ]
  ]
}
