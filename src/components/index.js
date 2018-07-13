import Welcome from './welcome'
import StuManage from './stuManage'

const components = [
  Welcome,
  StuManage
]

const install = function (Vue, opts = []) {
  components.map(component => Vue.use(component))
}

const routes = function () {
  return [].concat.apply([], components.map(component => component.routes !== undefined ? component.routes() : []))
}

export default { install, routes }
