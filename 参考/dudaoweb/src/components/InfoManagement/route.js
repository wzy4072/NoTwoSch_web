export default [
    /* 幼儿督导系统 */
  {
    path: 'InfoManagement/StaffInfoManagement', // 教职工信息管理
    name: '信息管理>教职工信息管理',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffInfoManagement')
  },
  {
    path: 'InfoManagement/StaffInfoSupplement', // 教职工信息管理 补录
    name: '信息管理>教职工信息管理>补录',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffInfoSupplement')
  },
  {
    path: 'InfoManagement/StaffInfoCheck', // 教职工信息管理 查看
    name: '信息管理>教职工信息管理>查看',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffInfoCheck')
  },
  {
    path: 'InfoManagement/StaffInfoImport', // 教职工信息管理 导入
    name: '信息管理>教职工信息管理>导入',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffInfoImport')
  },
  {
    path: 'InfoManagement/StaffSeniManagement', // 教职工资历管理
    name: '信息管理>教职工资历管理',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffSeniManagement')
  },
  {
    path: 'InfoManagement/StaffSeniDetails', // 教职工资历管理 资历详情
    name: '信息管理>教职工资历管理>资历详情',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffSeniDetails')
  },
  {
    path: 'InfoManagement/PerInfoManagement', // 个人信息管理
    name: '信息管理>个人信息管理',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './PerInfoManagement')
  },
  {
    path: 'InfoManagement/PerQualManagement', // 个人资历管理
    name: '信息管理>个人资历管理',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './PerQualManagement')
  },
  {
    path: 'InfoManagement/StaffTurnRate', // 教职工流失率
    name: '督导管理>教职工流失率',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StaffTurnRate')
  },
  {
    path: 'InfoManagement/StuInforManage',
    name: '信息管理>学生信息管理',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StuInforManage')
  },
  {
    path: 'InfoManagement/StuInfoSupplement',
    name: '信息管理>学生信息管理>添加学生',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StuInfoSupplement')
  },
  {
    path: 'InfoManagement/StuInfoCheck',
    name: '信息管理>学生信息管理>查看学生',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StuInfoCheck')
  },
  {
    path: 'InfoManagement/StuInfoImport',
    name: '信息管理>学生信息管理>批量导入',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StuInfoImport')
  },
  {
    path: 'InfoManagement/StuPerInfor',
    name: '信息管理>学生个人信息管理',
    component: () =>
            import(/* webpackChunkName: "InfoManagement" */ './StuPerInfor')
  },
  {
    path: 'InfoManagement/EduInfomation', // 教育局信息管理
    name: '信息管理>教育局信息管理',
    component: () =>
            import(/* webpackChunkName:"InfoManagement" */ './EduInfomation')
  },
  {
    path: 'InfoManagement/EduInfoImport', // 教育局信息管理
    name: '信息管理>教育局信息管理>批量导入',
    component: () =>
        import(/* webpackChunkName:"InfoManagement" */ './EduInfoImport')
  },
  {
    path: 'InfoManagement/EduInfoSupplement',
    name: '信息管理>教育局信息管理新增',
    component: () => import(/* webpackChunkName:"InfoManagement" */ './EduInfoSupplement')

  },
  {
    path: 'InfoManagement/supervisorInforMan',
    name: '信息管理>督导室信息管理',
    component: () => import(/* webpackChunkName:"InfoManagement" */ './supervisorInforMan')

  },
  {
    path: 'InfoManagement/supervisorAllotMan',
    name: '信息管理>幼儿园督导分配',
    component: () => import(/* webpackChunkName:"InfoManagement" */ './supervisorAllotMan')

  }, {
    path: 'InfoManagement/KindeInfo',
    name: '信息管理>幼儿园信息管理',
    component: () => import(/* webpackChunkName:"InfoManagement" */ './KindeInfo')

  }, {
    path: 'InfoManagement/KindDetailInfo',
    name: '信息管理>幼儿园经费支出信息管理',
    component: () => import(/* webpackChunkName:"InfoManagement" */ './KindDetailInfo')

  }, {
    path: 'InfoManagement/KindDetInfo',
    name: '信息管理>幼儿园教师工资信息管理',
    component: () => import(/* webpackChunkName:"InfoManagement" */ './KindDetInfo')

  }
]
