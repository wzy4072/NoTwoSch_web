
import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutations'

// initial state
const state = {
    context: null,
    loading: false,
    messageCount:null
}

export default {
    state,
    getters,
    actions,
    mutations
}