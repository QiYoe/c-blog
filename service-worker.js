/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "38d13c5060f14f56b908f044c6a7a2f6"
  },
  {
    "url": "assets/css/0.styles.733879bf.css",
    "revision": "77d90c2e6652e316c52f045e2b0c1531"
  },
  {
    "url": "assets/img/home-bg.7b267d7c.jpg",
    "revision": "7b267d7ce30257a197aeeb29f365065b"
  },
  {
    "url": "assets/img/init-project.98d85e85.png",
    "revision": "98d85e85b57789bc907fb84a678bdab9"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.49e5b7dc.js",
    "revision": "61fa0934e9b116e8de5a847c99409db4"
  },
  {
    "url": "assets/js/10.4141ad8f.js",
    "revision": "0fe106a32feb579ea200d0bf0c31f755"
  },
  {
    "url": "assets/js/11.2d88d667.js",
    "revision": "1f9726e26121d9e04a6a69e95b925fd4"
  },
  {
    "url": "assets/js/12.eaf0ddc7.js",
    "revision": "e7f6e6848852db242e639cc1811b1707"
  },
  {
    "url": "assets/js/13.7959452e.js",
    "revision": "f73b59453502e4af91006e33cd7e2689"
  },
  {
    "url": "assets/js/14.f0317fcd.js",
    "revision": "e17f4502e7f0f313c806ddd07a654087"
  },
  {
    "url": "assets/js/15.e87211f0.js",
    "revision": "61d899e620806beebd83be71af18fd03"
  },
  {
    "url": "assets/js/16.728255b5.js",
    "revision": "d0a66657070bb212a0da0d710ea9eeab"
  },
  {
    "url": "assets/js/17.ad7be82f.js",
    "revision": "2dfd3d1a02ce11418892eac5e2ba165c"
  },
  {
    "url": "assets/js/18.0d224c84.js",
    "revision": "c0ce78b90972353d9f038f1c250bc102"
  },
  {
    "url": "assets/js/19.b412f2fb.js",
    "revision": "28091f64ce5675789558720d81279445"
  },
  {
    "url": "assets/js/4.e54ef1c8.js",
    "revision": "2de43bbe2f6955fc18f8978bbf8bc244"
  },
  {
    "url": "assets/js/5.37bac60f.js",
    "revision": "ec326e4538b181b641191b8592b173ef"
  },
  {
    "url": "assets/js/6.4d6f09ad.js",
    "revision": "99b946418f1a293d8bfc3f4f6d64e8ba"
  },
  {
    "url": "assets/js/7.0c23e863.js",
    "revision": "90018607390018d0fadac88e4b816ac0"
  },
  {
    "url": "assets/js/8.47d8bb17.js",
    "revision": "bbb6d292cad02476426ffcb0669d664b"
  },
  {
    "url": "assets/js/9.89ef3a2b.js",
    "revision": "f041377fa42d9c0b405236594ac6d5c7"
  },
  {
    "url": "assets/js/app.bc5af7c8.js",
    "revision": "22bd59d494fbc719cc2d9ca71a4f1a0e"
  },
  {
    "url": "assets/js/vendors~flowchart.66c41f64.js",
    "revision": "936c7066be95b521cb3ac75023af410f"
  },
  {
    "url": "category/article.html",
    "revision": "b934f3842fb315456c659cee5bc877bb"
  },
  {
    "url": "category/front-end.html",
    "revision": "5445efb34c55a687e5163333e43cd1f0"
  },
  {
    "url": "category/index.html",
    "revision": "a0742c0cb7e7ee4fd29437e6522133e5"
  },
  {
    "url": "category/thoughts.html",
    "revision": "dc28fd2edfb06c64e506f637b782dc7f"
  },
  {
    "url": "category/tools.html",
    "revision": "94820533f676f7677b4da22e8ccbcf49"
  },
  {
    "url": "head.png",
    "revision": "680e9753d2785335aaa542f4112802ab"
  },
  {
    "url": "index.html",
    "revision": "0530a1a79d9d4c7df8c4417fea6f18fc"
  },
  {
    "url": "tag/front-end.html",
    "revision": "4c8b423cefebc898501bb29948ddbeca"
  },
  {
    "url": "tag/index.html",
    "revision": "8e308d594a0dbddb9a7f241b780f5a44"
  },
  {
    "url": "tag/tools.html",
    "revision": "52c4a2bfc37bf5f50e9a1afd2699fec0"
  },
  {
    "url": "tag/个人信息.html",
    "revision": "7ca1b50bc1632018318c239b8dc90e12"
  },
  {
    "url": "tag/佛学.html",
    "revision": "95a4b6445d9108c969d50e4ba8955509"
  },
  {
    "url": "tag/感想.html",
    "revision": "824b4ccda9cee0fd18cb6e747b1693c7"
  },
  {
    "url": "timeline/index.html",
    "revision": "645077614d1e7c1e0e5dda140ac453cd"
  },
  {
    "url": "view/article/2021/042010.html",
    "revision": "1223db23285100e8fa6bca21a396ac5c"
  },
  {
    "url": "view/front-end/2021/042317.html",
    "revision": "1d5b33b23c2a9ea652e1120ad65b5c5a"
  },
  {
    "url": "view/index.html",
    "revision": "d27b1f7d33e771849a8d716056c1d2b3"
  },
  {
    "url": "view/personalInfo/index.html",
    "revision": "03469e91c83f172ba99e29cf6d8a3faa"
  },
  {
    "url": "view/thoughts/2021/042109.html",
    "revision": "1af51d3d1f79ca948398cc4415caa855"
  },
  {
    "url": "view/tools/2021/042113.html",
    "revision": "01a7d274c28b9eab9cde879f8e4730fa"
  },
  {
    "url": "view/tools/2021/042114.html",
    "revision": "d07b2a304d21e8c7f0bcf60a9cec4124"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
