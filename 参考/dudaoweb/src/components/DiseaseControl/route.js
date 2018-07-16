export default [
  /* 幼儿督导系统 */
  {
    path: 'DiseaseControl/diseaseRecord', // 儿童晨检、全日观察及患病情况记录表
    name: '疾控中心 > 儿童晨检、全日观察及患病情况记录表 ',
    component: () =>
      import(/* webpackChunkName: "DiseaseControl" */ './diseaseRecord')
  },
  {
    path: 'DiseaseControl/addRecord', // 添加记录
    name: '疾控中心 > 添加记录 ',
    component: () =>
      import(/* webpackChunkName: "DiseaseControl" */ './addRecord')
  },
  {
    path: 'DiseaseControl/addComfirm', // 添加确诊信息
    name: '疾控中心 > 添加确诊信息 ',
    component: () =>
      import(/* webpackChunkName: "DiseaseControl" */ './addComfirm')
  }, {
    path: 'DiseaseControl/addInfectious',
    name: '疾控中心 > 传染疾病登记 ',
    component: () =>
      import(/* webpackChunkName: "DiseaseControl" */ './addInfectious')
  }, {
    path: 'DiseaseControl/infectiousRecord',
    name: '疾控中心 > 幼儿园儿童传染病登记表',
    component: () =>
      import(/* webpackChunkName: "DiseaseControl" */ './infectiousRecord')
  },
  {
    path: 'DiseaseControl/qrcodeManage',
    name: '疾控中心 > 幼儿保健二维码管理 ',
    component: () =>
      import(/* webpackChunkName: "DiseaseControl" */ './qrcodeManage')
  }
]
