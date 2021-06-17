import DefaultTheme from 'vitepress/dist/client/theme-default'
import NotFound from './NotFound.vue';
// document.getElementsByTagName('body')[0].className = 'themeRed'
import './style.css'

const theme = {
  ...DefaultTheme,
  NotFound,
  enhanceApp({ Vue, options, router, siteData, isServer }) {}
};
export default theme;
