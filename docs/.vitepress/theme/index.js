import DefaultTheme from 'vitepress/dist/client/theme-default'
import NotFound from './NotFound.vue';
import './style.css'

const theme = {
  ...DefaultTheme,
  NotFound,
  enhanceApp({ app, router, siteData}) {}
};
export default theme;
