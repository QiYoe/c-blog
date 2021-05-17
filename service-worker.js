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
    "revision": "d185d6b21767120cb5d4aad322530d05"
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
    "url": "assets/js/app.ad0678a7.js",
    "revision": "f3c4a94304e9fd5d0f942eae2fe70217"
  },
  {
    "url": "assets/js/vendors~flowchart.66c41f64.js",
    "revision": "936c7066be95b521cb3ac75023af410f"
  },
  {
    "url": "category/article.html",
    "revision": "7603052f4bbb87aaa51f8744845f2b05"
  },
  {
    "url": "category/front-end.html",
    "revision": "671c055aab597a38a25023b78f8973b5"
  },
  {
    "url": "category/index.html",
    "revision": "1c05c4ba6048af9876c4f7f314b4fa0d"
  },
  {
    "url": "category/thoughts.html",
    "revision": "c599dd519f1cfd43db35c11810bb53e5"
  },
  {
    "url": "category/tools.html",
    "revision": "42b8f4c7f10fb36201f8f89c5f548033"
  },
  {
    "url": "head.png",
    "revision": "680e9753d2785335aaa542f4112802ab"
  },
  {
    "url": "index.html",
    "revision": "4711243afbe236cbafe07c81aac57e0e"
  },
  {
    "url": "tag/front-end.html",
    "revision": "b5a65ee49fd35cef73e28b90006bae5c"
  },
  {
    "url": "tag/index.html",
    "revision": "4e70598d91eea51cdaa399a2ea4d1944"
  },
  {
    "url": "tag/tools.html",
    "revision": "1423c322282fb4e23ed8f0a95f74ff29"
  },
  {
    "url": "tag/个人信息.html",
    "revision": "b04c37aef294629fca9295718bbec573"
  },
  {
    "url": "tag/佛学.html",
    "revision": "9da8f79866ed85554fecf8482d2ed867"
  },
  {
    "url": "tag/感想.html",
    "revision": "faf77540deebd711966c29f37520f7de"
  },
  {
    "url": "timeline/index.html",
    "revision": "d29ac5adfb5d8ff08e7a3616a7ca1177"
  },
  {
    "url": "view/article/2021/042010.html",
    "revision": "0b196b925fe88be893eb8b197ddfe36a"
  },
  {
    "url": "view/front-end/2021/042317.html",
    "revision": "e50d36c2876cb169c507fe04d1bb22c7"
  },
  {
    "url": "view/index.html",
    "revision": "1dec4a1fb6006eab353b468e38012a23"
  },
  {
    "url": "view/personalInfo/index.html",
    "revision": "dbad676c33b96262b87b227674f0108f"
  },
  {
    "url": "view/thoughts/2021/042109.html",
    "revision": "be3509539004561ae8ddcc4dc5e6e296"
  },
  {
    "url": "view/tools/2021/042113.html",
    "revision": "16a40444ba9d26834ac69ff6d221d867"
  },
  {
    "url": "view/tools/2021/042114.html",
    "revision": "11fba61509915d844342ee341db0a75b"
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
