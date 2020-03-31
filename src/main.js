import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { Icon } from 'vant'
import { Loading } from 'vant'
import { Slider } from 'vant'
import { Toast } from 'vant'
import { Sidebar, SidebarItem } from 'vant'

Vue.use(Icon)
Vue.use(Loading)
Vue.use(Slider)
Vue.use(Toast)
Vue.use(Sidebar)
Vue.use(SidebarItem)

Toast.setDefaultOptions({ position: 'bottom' });

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
