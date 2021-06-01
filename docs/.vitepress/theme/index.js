import DefaultTheme from 'vitepress/dist/client/theme-default'
import NotFound from './NotFound.vue';
// document.getElementsByTagName('body')[0].className = 'themeRed'

const theme = {
    ...DefaultTheme,
    NotFound,
    enhanceApp({ app, router, siteData }) {
      // app is the Vue 3 app instance from `createApp()`. router is VitePress'
      // custom router. `siteData`` is a `ref`` of current site-level metadata.
    }
};
export default theme;
