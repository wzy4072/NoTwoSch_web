export default [ /* 模板 */
  {
    path: 'demo/standard1', // 标准1
    name: '前端模板>参考页面1',
    component: () => import(/* webpackChunkName: "demo" */ './standard1')
  },
  {
    path: 'demo/standard2', // 标准2
    name: '前端模板>参考页面2',
    component: () => import(/* webpackChunkName: "demo" */ './standard2')
  },
  {
    path: 'demo/table', // 表格
    name: '前端模板>表格',
    component: () => import(/* webpackChunkName: "demo" */ './table')
  },
  {
    path: 'demo/form', // 表单
    name: '前端模板>表单',
    component: () =>
    import(/* webpackChunkName: "demo" */ './form')
  },
  {
    path: 'demo/estable', // 原生表格
    name: '前端模板>原生表格',
    component: () =>
    import(/* webpackChunkName: "demo" */ './estable')
  },
  {
    path: 'demo/treeTable', // 树形菜单
    name: '前端模板>树表格',
    component: () =>
    import(/* webpackChunkName: "demo" */ './treeTable')
  },
  {
    path: 'demo/echart', // 统计图
    name: '前端模板>统计图',
    component: () =>
    import(/* webpackChunkName: "demo" */ './echart')
  },
  {
    path: 'demo/map', // 地图
    name: '前端模板>地图',
    component: () =>
    import(/* webpackChunkName: "demo" */ './map')
  },
  {
    path: 'demo/qrcode', // 二维码
    name: '前端模板>二维码',
    component: () =>
    import(/* webpackChunkName: "demo" */ './qrcode')
  },
  {
    path: 'demo/calendar', // 日历
    name: '前端模板>日历',
    component: () =>
    import(/* webpackChunkName: "demo" */ './calendar')
  },
  {
    path: 'demo/template', // 前端模板
    name: '前端模板>前端模板',
    component: () =>
      import(/* webpackChunkName: "demo" */ './template')
  },
  {
    path: 'demo/ueditordemo', // 百度编辑器
    name: '前端模板>百度编辑器',
    component: () =>
      import(/* webpackChunkName: "demo" */ './ueditordemo')
  }
]
