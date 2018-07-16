export default [
  /* 日程与校历管理 */
  {
    path: 'Calendar/Schedule', // 日程与校历管理
    name: '日程与校历 > 日程与校历管理 ',
    component: () =>
      import(/* webpackChunkName: "Calendar" */ './Schedule')
  }
]
