export default [
  /* 幼儿督导系统 */
  {
    path: 'PrivilegeManagement/PMOne', // 权限管理(管理员)
    name: '权限管理（管理员） ',
    component: () =>
      import(/* webpackChunkName: "PrivilegeManagement" */ './PMOne')
  },
  {
    path: 'PrivilegeManagement/PMTwo', // 权限管理(幼儿园)
    name: '权限管理（幼儿园） ',
    component: () =>
      import(/* webpackChunkName: "PrivilegeManagement" */ './PMTwo')
  },
  {
    path: 'PrivilegeManagement/PMThree', // 权限管理(教育局)
    name: '权限管理（教育局） ',
    component: () =>
      import(/* webpackChunkName: "PrivilegeManagement" */ './PMThree')
  }
]
