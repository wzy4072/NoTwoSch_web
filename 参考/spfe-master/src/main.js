// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueBeauty from 'vue-beauty' // migration use, remove after migration
import App from './App'
import Router from 'vue-router'
import ShipperComponents from '@/components'
// import Root from '@/components/Root'

import 'element-ui/lib/theme-chalk/index.css'
import 'vue-beauty/package/style/vue-beauty.min.css' // migration use, remove after migration

Vue.config.productionTip = false
Vue.use(VueBeauty)
Vue.use(ElementUI)
Vue.use(Router)

var modules = [
  ShipperComponents
];

var allRoutes = [].concat.apply([], modules
  .map(m => {
    // use the module
    Vue.use(m);
    return m;
  })
  .map(m => m.routes !== undefined ? m.routes() : [])
);

console.log(allRoutes);

var router = new Router({
  routes: allRoutes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
