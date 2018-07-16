export default [
  /* 幼儿督导系统 */
  {
    path: 'ConstitutionManagement/CMOne', // 园资料审核
    name: '园资料审核',
    component: () =>
      import(/* webpackChunkName: "ConstitutionManagement" */ './CMOne')
  },
  {
    path: 'ConstitutionManagement/CMTwo', // 园资料上报
    name: '园资料上报',
    component: () =>
      import(/* webpackChunkName: "ConstitutionManagement" */ './CMTwo')
  },
  {
    path: 'ConstitutionManagement/CUpdate', // 章程管理 更新章程
    name: '园资料管理 > 更新资料',
    component: () =>
      import(/* webpackChunkName: "ConstitutionManagement" */ './CUpdate')
  }
]
