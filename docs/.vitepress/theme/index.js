import DefaultTheme from 'vitepress/dist/client/theme-default'
import NotFound from './NotFound.vue';
import './style.css'

// import HomeFooterBg from '../../components/HomeFooterBg.vue'

const theme = {
  ...DefaultTheme,
  NotFound,
  enhanceApp({ app, router, siteData}) {
    // app.component('HomeFooterBg', HomeFooterBg)
  }
};
export default theme;
