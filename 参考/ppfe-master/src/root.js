import Vue from 'vue'
import VueRouter from 'vue-router'
import VueBeauty from 'vue-beauty'
import Root from './Root.vue'
import routes from './navigations/root/routes.js'
import store from './store'

//import css
// import 'vue-beauty/package/style/vue-beauty.min.css'

Vue.use(VueRouter)
Vue.use(VueBeauty)

// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes: routes.routes
})
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
   next();
})
new Vue({
  el: '#app',
  store,
  render: h => h(Root),
  router: router
})
