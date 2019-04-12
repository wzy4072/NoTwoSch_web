import UserList from './userList.vue'

var components = [
  UserList
]

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}

const routes = function () {
  return [
    { path: '/user', name: 'UserList', component: UserList },
  ]
}

export default { install, routes }
