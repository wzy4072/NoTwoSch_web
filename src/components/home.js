import Welcome from './welcome'
import StuManage from './stuManage'
import Login from './login'
import Home from './home'

const components = [
  Welcome,
  StuManage,
  Login,
  Home
]

const install = function (Vue, opts = []) {
  components.map(component => Vue.use(component))
}

const routes = function () {
  return [].concat.apply([], components.map(component => component.routes !== undefined ? component.routes() : []))
}

export default { install, routes }
