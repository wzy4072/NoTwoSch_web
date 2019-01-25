import Stulist from './stuList.vue'
import StuDetial from './stuDetial.vue'

var components = [
  Stulist,
  StuDetial
]

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}

const routes = function () {
  return [
    { path: '/stu/list', name: 'Stulist', component: Stulist },
    { path: '/stu/:id', name: 'StuDetial', component: StuDetial },
  ]
}

export default { install, routes }
