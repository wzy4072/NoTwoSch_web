/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import demo from '@/components/demo/route' // 开发demo
import detail from '@/components/main/detail' // 外层
import ConstitutionManagement from '@/components/ConstitutionManagement/route' // 章程管理
import NoticeManagement from '@/components/NoticeManagement/route' // 公告管理
import PrivilegeManagement from '@/components/PrivilegeManagement/route' // 权限管理
import SuperviseManagement from '@/components/SuperviseManagement/route' // 监督管理
import SystemManagement from '@/components/SystemManagement/route' // 系统管理
import EducManagement from '@/components/EducManagement/route' // 教务管理
import AccountManagement from '@/components/AccountManagement/route' // 账户管理
import TransManagement from '@/components/TransManagement/route' // 异动管理
import InfoManagement from '@/components/InfoManagement/route' // 信息管理
import DiseaseControl from '@/components/DiseaseControl/route' // 疾控管理
import ProjectManagement from '@/components/ProjectManagement/route' // 过程性督导管理
import Calendar from '@/components/Calendar/route' // 校历管理
import EvaluateSystem from '@/components/EvaluateSystem/route' //问卷调查
Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/',
      component: detail,
      children: [
        {
          path: '/',
          name: '',
          component: () => import(/* webpackChunkName: "demo" */ '@/components/main/home')
        },
        ...demo,
        ...ConstitutionManagement,
        ...NoticeManagement,
        ...PrivilegeManagement,
        ...SuperviseManagement,
        ...SystemManagement,
        ...EducManagement,
        ...EvaluateSystem,	
        ...AccountManagement,
        ...TransManagement,
        ...InfoManagement,
        ...DiseaseControl,
        ...ProjectManagement,
        ...Calendar
      ]
    }, {
      path: '/login_kind', // 幼儿园
      component: () => import(/* webpackChunkName: "login_kind" */ '@/components/main/login')
    },
    {
      path: '/login_edu', // 教育局
      component: () => import(/* webpackChunkName: "login_edu" */ '@/components/main/login')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/login_kind' && to.path !== '/login_edu') {
    if (sessionStorage.getItem('user_token')) { // 判断token信息的自写方法
      next()
    } else {
      if (sessionStorage.getItem('LoginType') ==1) {
        next({ path: '/login_kind' })// 跳转到登录页（幼儿园用户）
      } else {
        next({ path: '/login_edu' })// 跳转到登录页（教育局用户）
      }
    }
  } else {
    next()
  }
})
export default router
