export default [
  /* 幼儿督导系统 */
  {
    path: 'NoticeManagement/NManagement', // 公告管理
    name: '公告管理 ',
    component: () =>
      import(/* webpackChunkName: "NoticeManagement" */ './NManagement')
  },
  {
    path: 'NoticeManagement/AddNotice', // 公告管理>新建公告
    name: '公告管理 > 新建 / 编辑公告 ',
    component: () =>
      import(/* webpackChunkName: "NoticeManagement" */ './AddNotice')
  }
]
