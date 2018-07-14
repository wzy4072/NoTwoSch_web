import Login from './login.vue'
const components = [
  Login
]
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}
const routes = function () {
  return [
    { path: '/login', name: 'Login', component: Login },
  ]
}

export default { install, routes }
