export default [
  /* 幼儿督导系统 */
  {
    path: 'SystemManagement/classAndGradManagement', // 系统管理 年级班级管理（幼园管理）
    name: '系统管理 > 年级班级管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './classAndGradManagement')
  },
  {
    path: 'SystemManagement/gradeInfoManagement', // 系统管理 系统年级信息管理（系统管理）
    name: '系统管理 > 系统年级信息管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './gradeInfoManagement')
  },
  {
    path: 'SystemManagement/PostInfoManagement', // 系统管理 系统年级信息管理（系统管理）
    name: '系统管理 > 基本信息配置 > 系统岗位信息管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './PostInfoManagement')
  },
  {
    path: 'SystemManagement/SubInfoManagement', // 系统管理 系统年级信息管理（系统管理）
    name: '系统管理 > 基本信息配置 > 系统科目信息管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './SubInfoManagement')
  },
  {
    path: 'SystemManagement/constitutionType', // 系统管理 系统年级信息管理（系统管理）
    name: '系统管理 > 基本信息配置 > 园资料上传 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './constitutionType')
  },
  {
    path: 'SystemManagement/NoticeType', // 系统管理 系统年级信息管理（系统管理）
    name: '系统管理 > 基本信息配置 > 教育局公告类型管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './NoticeType')
  },
  {
    path: 'SystemManagement/informationManage', // 系统管理 系统年级信息管理（系统管理）
    name: '系统管理 > 基本信息配置 > 系统职务信息管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './informationManage')
  },
  {
    path: 'SystemManagement/InformType1', // 系统管理 幼儿园通知类型管理
    name: '系统管理 > 基本信息配置 > 幼儿园通知类型管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './InformType1')
  },
  {
    path: 'SystemManagement/InformType2', // 系统管理 教育局通知类型管理
    name: '系统管理 > 基本信息配置 > 教育局通知类型管理 ',
    component: () =>
      import(/* webpackChunkName: "SystemManagement" */ './InformType2')
  }
]
