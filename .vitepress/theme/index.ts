import DefaultTheme from 'vitepress/theme'
import SvgImage from './components/SvgImage.vue'
import NotFound from './components/NotFound.vue'
import Layout from './components/Layout.vue'
import CodePen from '../../components/CodePen.vue'
import Gitalk from '../../components/Gitalk.vue'

// import VercelCusdis from '../../components/VercelCusdis.vue'
import './styles/vars.css'
import './custom.css'

// import HomeFooterBg from '../../components/HomeFooterBg.vue'
export default {
  ...DefaultTheme,
  NotFound,
  Layout,
  enhanceApp({ app, router, siteData}) {
    app.component('CodePen', CodePen)
    app.component('SvgImage', SvgImage)
    app.component('Gitalk', Gitalk)
    // app.component('VercelCusdis', VercelCusdis)
  },
  setup() {}
}
