// @ts-nocheck
export default ({ Vue, options, router, siteData, isServer }) => {
  // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
  /**
   * 路由切换事件处理
   */
  router.beforeEach((to, from, next) => {
    console.log("切换路由", to.fullPath, from.fullPath);

    //触发百度的pv统计
    if (typeof _hmt != "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
        console.log("上报百度统计", to.fullPath);
      }
    }

    // continue
    next();
  });
};
