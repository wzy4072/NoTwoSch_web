import Menu from './menuTree.vue'

var components = [
  Menu
]

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}

const routes = function () {
  return [
    { path: '/menu', name: 'Menu', component: Menu },
  ]
}

export default { install, routes }
