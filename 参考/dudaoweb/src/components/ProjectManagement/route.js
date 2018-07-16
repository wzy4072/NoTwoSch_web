export default [
  /* 幼儿督导系统 */
  {
    path: 'ProjectManagement/ProcessProject', //
    name: '过程性专项督导项目管理',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './ProcessProject')
  },
   /* 过程性专项督导管理详情（幼儿园） */
  {
    path: 'ProjectManagement/SpecialKindergarten', // 过程性专项督导管理详情（幼儿园）
    name: '专项督导管理>过程性专项督导管理详情',
    component: () =>
        import(/* webpackChunkName: "ProjectManagement" */ './SpecialKindergarten')
  },
     /* 过程性专项督导日志管理 */
  {
    path: 'ProjectManagement/specialStatistics', //
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './specialStatistics')
  },
  {
    path: 'ProjectManagement/logManagement', //
    name: '过程性专项督导日志管理',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './logManagement')
  },
  {
    path: 'ProjectManagement/creatLog', //
    name: '新建日志',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './creatLog')
  },
  {
    path: 'ProjectManagement/SpecialSupervision', //
    name: '过程性专项督导管理详情',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './SpecialSupervision')
  },
  {
    path: 'ProjectManagement/CategoryDetails', //
    name: '幼儿园范畴详情',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './CategoryDetails')
  },
  {
    path: 'ProjectManagement/SpecialSupervisionInfo', //
    name: '新建日志',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './SpecialSupervisionInfo')
  },
  {
    path: 'ProjectManagement/SpecialSupervisionMsg', //
    name: '过程性专项督导日志查看',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './SpecialSupervisionMsg')
  },
  {
    path: 'ProjectManagement/SpecialKindergar', //
    name: '过程性专项督导管理',
    component: () =>
      import(/* webpackChunkName: "ProjectManagement" */ './SpecialKindergar')
  }
]
