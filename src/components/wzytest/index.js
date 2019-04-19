import myTest1 from './test1.vue'
import myTest2 from './test2.vue'
import mypage from './mypage.vue'

const components = [
  myTest1,
  myTest2,mypage
]
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}
const routes = function () {
  return [
    { path: '/test/t1', name: 'myTest1', component: myTest1 },
    { path: '/test/t2', name: 'myTest2', component: myTest2 },
    { path: '/test/mypage', name: 'mypage', component: mypage }
  ]
}
export default { install, routes }