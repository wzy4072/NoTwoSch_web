export default [
  /* 幼儿督导系统 异动管理 */
  {
    path: 'TransManagement/transactionManagement', // 异动管理 异动管理
    name: '异动管理 > 异动管理 ',
    component: () =>
      import(/* webpackChunkName: "TransManagement" */ './transactionManagement')
  }, {
    path: 'TransManagement/transactionCount', // 异动管理 异动数量统计
    name: '异动管理 > 异动数量统计 ',
    component: () =>
      import(/* webpackChunkName: "TransManagement" */ './transactionCount')
  }, {
    path: 'TransManagement/transactionDetail', // 异动管理 异动明细信息
    name: '异动管理 > 异动明细信息 ',
    component: () =>
      import(/* webpackChunkName: "TransManagement" */ './transactionDetail')
  }, {
    path: 'TransManagement/transactionPrint', // 异动管理 异动打印单
    name: '异动管理 > 异动打印 ',
    component: () =>
      import(/* webpackChunkName: "TransManagement" */ './transactionPrint')
  }
]
