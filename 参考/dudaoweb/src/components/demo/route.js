export default [ /* 模板 */
  {
    path: 'demo/standard', // 标准
    name: '前端模板>参考页面',
    component: () => import(/* webpackChunkName: "demo" */ './standard')
  }
]
