export default[
    // 督导问卷调查
  {
    path: 'EvaluateSystem/questionnaireSurvey', // 问卷调查
    name: '问卷调查',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './questionnaireSurvey')
  }, {
    path: 'EvaluateSystem/newQuestionnaire', // 新建问卷
    name: '问卷调查>新建问卷',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './newQuestionnaire')
  }, {
    path: 'EvaluateSystem/throughQuestionnaire', // 浏览问卷
    name: '问卷调查>浏览问卷',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './throughQuestionnaire')
  }, {
    path: 'EvaluateSystem/writeSchedule', // 填写进度
    name: '问卷调查>填写进度',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './writeSchedule')
  }, {
    path: 'EvaluateSystem/qrcodeManage', // 二维码管理
    name: '问卷调查>二维码管理',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './qrcodeManage')
  }, {
    path: 'EvaluateSystem/groupPeople', // 人员分组
    name: '问卷调查>人员分组',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './groupPeople')
  }, {
    path: 'EvaluateSystem/questionnaireStatistical', // 问卷统计
    name: '问卷调查>问卷统计',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './questionnaireStatistical')
  }, {
    path: 'EvaluateSystem/questionnaireSurveyDet', // 问卷调查详情
    name: '问卷调查>问卷调查详情',
    component: () =>
                import(/* webpackChunkName: "SuperviseSystem" */ './questionnaireSurveyDet')
  }
]
