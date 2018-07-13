import Vue from 'vue'
import Vuex from 'vuex'
import context from './context'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        context,
    },
    strict: debug,
})