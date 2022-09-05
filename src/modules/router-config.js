import { Loading } from "element-ui"
import NProgress from 'nprogress'
const instance = ref()
export const install = ({ router }) => {
  router?.beforeEach((to, from, next) => {
    NProgress.start()
    instance.value = Loading.service({
      fullscreen: true,
      lock: true,
      text: "正在前往目的地"
    })
    next()
  })
  router?.afterEach((to, from) => {
    NProgress.done()
    instance.value?.close()
  })
}
