import Theme from 'vitepress/theme'
import SvgImage from './components/SvgImage.vue'
import NotFound from './components/NotFound.vue'
import CodePen from '../../components/CodePen.vue'
import Gitalk from '../../components/Gitalk.vue'
// import VercelCusdis from '../../components/VercelCusdis.vue'
import './styles/vars.css'
import './custom.css'

// import HomeFooterBg from '../../components/HomeFooterBg.vue'
export default {
  ...Theme,
  NotFound,
  enhanceApp({ app, router, siteData}) {
    app.component('CodePen', CodePen)
    app.component('SvgImage', SvgImage)
    app.component('Gitalk', Gitalk)
    // app.component('VercelCusdis', VercelCusdis)
  },
  setup() {}
}
