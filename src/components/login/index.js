import Login from './login.vue'
const components = [
  Login
]
const install = function (Vue, opts) {
  components.map(c => {
    console.log(c.name)
    Vue.component(c.name, c)
  })
}
const routes = function () {
  return [
    { path: '/login', name: 'login', component: Login },
    { path: '/', name: 'login2', component: Login },
  ]
}

export default { install, routes }
