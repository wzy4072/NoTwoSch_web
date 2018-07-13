// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
// import Router from './router'
import Element from 'element-ui'
import EgjComponents from '@/components'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Router)
// 写法1
// var modules = [
//   EgjComponents
// ]

// var allRoutes = [].concat.apply([], modules
//   .map(m => {
//     Vue.use(m)
//     return m
//   })
//   .map(m => m.routes !== undefined ? m.routes() : [])
// )
// 写法2
Vue.use(EgjComponents)
var allRoutes = EgjComponents.routes()

var router = new Router({
  routes: allRoutes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
