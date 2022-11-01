import Vue from "vue";
import App from '~/App.vue'
import '@unocss/reset/tailwind.css'
import '~/style.css'
import 'uno.css'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from "element-ui";
import VueRouter from "vue-router";
import router from '~/router'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
Vue.use(ElementUI)
Vue.use(VueRouter)

const pinia = createPinia()

const app = new Vue({
  router,
  pinia,
  render: (h) => h(App),
})

// install all modules under `modules/` 自动导入modules文件夹下的js模块,并且自动注册到vue实例中,需要暴露install方法方法,接收一个参数,包含vue实例
Object.values(import.meta.globEager('./modules/*.js')).forEach(function (i) {
  return i.install?.({ app, router })
})
//mount
app.$mount('#app')
