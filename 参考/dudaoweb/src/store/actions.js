import * as types from './mutation-types'

export const setUser = ({ commit }, { user }) => {
  commit(types.RECEIVE_USER, user)
}
