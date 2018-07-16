export default [
  /* 幼儿督导系统 */
  {
    path: 'AccountManagement/AMOne', // 账户管理(区管理员)
    name: '账户管理（管理员） ',
    component: () =>
      import(/* webpackChunkName: "AccountManagement" */ './AMOne')
  },
  {
    path: 'AccountManagement/AMTwo', // 账户管理(幼儿园)
    name: '账户管理（幼儿园） ',
    component: () =>
      import(/* webpackChunkName: "AccountManagement" */ './AMTwo')
  },
  {
    path: 'AccountManagement/AMThree', // 账户管理(教育局)
    name: '账户管理（教育局） ',
    component: () =>
      import(/* webpackChunkName: "AccountManagement" */ './AMThree')
  },
  {
    path: 'AccountManagement/AQrcodePrint', // 账户管理 打印二维码
    name: '账户管理 > 打印二维码',
    component: () =>
      import(/* webpackChunkName: "AccountManagement" */ './AQrcodePrint')
  }
]
