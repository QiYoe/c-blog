import { HeadConfig } from '../../types/shared';

export default <HeadConfig[]> [
  ['meta', { name: 'theme-color', content: '#646cff' }],
  ['link', { rel: 'image/x-icon', href: '/favicon.ico' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ['link', { rel: 'manifest', href: '/manifest.json' }],
  ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
  ['meta', { name: 'keywords', content: '青山, vitepress, 顾青山, blog, 博客, 狗窝, 青山'}],
  ['meta', { name: 'baidu-site-verification', content: 'code-5BMDhSDgSq'}],
  ['meta', { name: 'baidu_union_verify', content: 'acd0eb90461e19817cabd1140c8ffd54' }],
  // ['script', {}, `
  //   var _hmt = _hmt || [];
  //   (function() {
  //     var hm = document.createElement("script");
  //     hm.src = "https://hm.baidu.com/hm.js?1801e4a45f1eecdfe603fc0637120c56";
  //     var s = document.getElementsByTagName("script")[0]; 
  //     s.parentNode.insertBefore(hm, s);

  //     // 引入谷歌,不需要可删除这段
  //     var hm1 = document.createElement("script");
  //     hm1.src = "https://www.googletagmanager.com/gtag/js?id=G-SBNLNM3Q41";
  //     var s1 = document.getElementsByTagName("script")[0]; 
  //     s1.parentNode.insertBefore(hm1, s1);
  //   })();

  //   // 谷歌加载,不需要可删除
  //   window.dataLayer = window.dataLayer || [];
  //   function gtag(){dataLayer.push(arguments);}
  //   gtag('js', new Date());

  //   gtag('config', 'G-SBNLNM3Q41');
  // `],
  ['script', { type: 'async', src: 'https://cpwebassets.codepen.io/assets/embed/ei.js' }],
]
