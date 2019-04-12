import myTest from './test.vue'

const components = [
  myTest
]
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}
const routes = function () {
  return [
    { path: '/myTest', name: 'myTest', component: myTest }
  ]
}

export default { install, routes }