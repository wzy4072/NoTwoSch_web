import * as types from '../mutation-types'

// initial state
const state = {
  userName: '',
  schoolName: '',
  tokenId: ''
}
// mutations
const mutations = {
  [types.RECEIVE_USER] (state, {userName, schoolName, tokenId}) {
    state.userName = userName
    state.schoolName = schoolName
    state.tokenId = tokenId
  }
}

export default {
  state,
  mutations
}
