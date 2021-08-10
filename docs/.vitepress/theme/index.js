import DefaultTheme from 'vitepress/dist/client/theme-default'
import NotFound from './NotFound.vue';
import CodePen from '../../components/CodePen.vue'
import './style.css'

// import HomeFooterBg from '../../components/HomeFooterBg.vue'

const theme = {
  ...DefaultTheme,
  NotFound,
  enhanceApp({ app, router, siteData}) {
    app.component('CodePen', CodePen)
  }
};
export default theme;
