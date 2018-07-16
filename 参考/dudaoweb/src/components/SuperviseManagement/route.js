export default [
  /* 幼儿督导系统 */
  {
    path: 'SuperviseManagement/FeedbackManagement', // 教职工资历监督 反馈管理
    name: '监督管理>教职工资历监督>反馈管理',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './FeedbackManagement')
  },
  {
    path: 'SuperviseManagement/FacultySupervision', // 师资力量监督
    name: '监督管理>师资力量监督',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './FacultySupervision')
  },
  {
    path: 'SuperviseManagement/FacultyDetails', // 师资力量监督 师资力量详情
    name: '监督管理>师资力量监督>师资力量详情',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './FacultyDetails')
  },
  {
    path: 'SuperviseManagement/StaffWastRateSupertwo', // 教职工流失率监督two
    name: '监督管理>教职工流失率监督',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './StaffWastRateSupertwo')
  },
  {
    path: 'SuperviseManagement/studentsNumSuper', // 学生人数监控（督导员/督导室）
    name: '监督管理>学生人数监控',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './studentsNumSuper')
  },
  {
    path: 'SuperviseManagement/studentsChurnRateSuper', // 学生流动及流失率监控（督导员/督导室）
    name: '监督管理>学生流动及流失率监控',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './studentsChurnRateSuper')
  },
  {
    path: 'SuperviseManagement/StudyFeedbackNumSuper', // 督学反馈数量监督
    name: '监督管理>督学反馈数量监督',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './StudyFeedbackNumSuper')
  },
  {
    path: 'SuperviseManagement/KidsFeedbackNumSuper', // 幼儿园反馈数量监督
    name: '监督管理>幼儿园反馈数量监督',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './KidsFeedbackNumSuper')
  },
  {
    path: 'SuperviseManagement/AptitudeCheck', // 学生流动及流失率监控（督导员/督导室）
    name: '监督管理>教职工资历监督>资历查看',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './AptitudeCheck')
  },
  {
    path: 'SuperviseManagement/FeedbackRecord', // 学生流动及流失率监控（督导员/督导室）
    name: '监督管理>教职工资历监督>反馈记录',
    component: () =>
      import(/* webpackChunkName: "SuperviseSystem" */ './FeedbackRecord')
  }
]
