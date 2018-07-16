export default [
  /* 幼儿督导系统 */
  {
    path: 'EducManagement/GradeClassTeaManagement', // 教务管理 年级班级主任管理 教务管理
    name: '教务管理 > 年级班级主任管理 ',
    component: () =>
      import(/* webpackChunkName: "EducManagement" */ './GradeClassTeaManagement')
  },
  {
    path: 'EducManagement/CourseTeachersManagement', // 教务管理 任课教师管理 教务管理
    name: '教务管理 > 任课教师管理 ',
    component: () =>
      import(/* webpackChunkName: "EducManagement" */ './CourseTeachersManagement')
  }
]
