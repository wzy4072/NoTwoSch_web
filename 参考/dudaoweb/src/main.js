// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import util from './common/js/util'
import store from './store'
import YS from './common/js/YS'
import '../src/assets/styles/index.less'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.$api = util
Vue.prototype.$ajax = util.promise
Vue.prototype.YS = YS

/* eslint-disable */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
