import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
let columnObj = {
  scrColumn1: { // 教职工表筛选列
    WORKER_NAME: { field: 'WORKER_NAME', text: '姓名', selected: true },
    WORKER_GENDER_STR: { field: 'WORKER_GENDER_STR', text: '性别', selected: true },
    DICT_VALUE: { field: 'DICT_VALUE', text: '岗位', selected: true },
    USER_LOGIN_NAME: {text: '用户名', selected: true, field: 'USER_LOGIN_NAME'},
    USER_INIT_PWD: {text: '初始密码', selected: true, field: 'USER_INIT_PWD'},
    USER_LOGIN_TELE: { text: '绑定手机', selected: true, field: 'USER_LOGIN_TELE' },
    IS_BINDING: {text: '绑定微信', selected: true, field: 'IS_BINDING'},
    USER_STATUS_STR: {text: '使用状态', selected: true, field: 'USER_STATUS_STR'}
  },
  scrColumn2: { // 家长表筛选列
    STUDENT_NAME: { field: 'STUDENT_NAME', text: '学生姓名', selected: true },
    GRADE_NAME: { field: 'GRADE_NAME', text: '学生年级', selected: true },
    CLASS_NAME: { field: 'CLASS_NAME', text: '学生班级', selected: true },
    PARENT_RELATIONSHIP_STR: {text: '家长角色', selected: true, field: 'PARENT_RELATIONSHIP_STR'},
    USER_LOGIN_NAME: {text: '用户名', selected: true, field: 'USER_LOGIN_NAME'},
    USER_INIT_PWD: {text: '初始密码', selected: true, field: 'USER_INIT_PWD'},
    USER_LOGIN_TELE: {text: '绑定手机', selected: true, field: 'USER_LOGIN_TELE'},
    IS_MAIN_STR: { text: '账户类型', selected: true, field: 'IS_MAIN_STR' },
    IS_BINDING: {text: '绑定微信', selected: true, field: 'IS_BINDING'},
    USER_STATUS_STR: {text: '使用状态', selected: true, field: 'USER_STATUS_STR'}
  }
}
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      activeName: '1',
      scrColumn: columnObj.scrColumn1,
      Kindergarten: '',
      printOb: {// 打印所需
        pageNum: 1,
        title: '幼儿园教职工列表'
      },
      searchstr: '',
      fullscreenLoading: false,
      tableData1: [], // table数据1
      tableData2: [], // table数据2
      copyData1: [], // 副本数据1
      copyData2: [], // 副本数据2
      Tabid: 'a1',
      count: 0,
      selection: [],
      work_options: [],
      class_options: [],
      work_show: true,
      class_show: false,
      Binding_options: [
        {'name': '已绑定', 'value': 1},
        {'name': '未绑定', 'value': 0}
      ],
      workType: '',
      isBinding: '',
      classisBinding: '',
      class_selected: []
    }
  },
  mounted () { // 进页面默认执行方法
    this.infoQuery() // 默认查询
    this.getPostList() // 岗位获取
    this.getClassList() // 获取筛选条件 班级列表
  },
  methods: {
    getPostList () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/infoManage/selectWorkerTypeByKindergapten',
        data: {'krtenCode': ''}
      }).then(res => {
        this.work_options = Object.assign([], res.data.data)
      })
    },
    getClassList () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/selectGradeAndClass',
        data: {}
      }).then(res => { // 成功回
        this.class_options = Object.assign([], res.data.data)
        this.class_options = JSON.parse(JSON.stringify(this.class_options).replace(/gradeName/g, 'label'))
        this.class_options = JSON.parse(JSON.stringify(this.class_options).replace(/gradeCode/g, 'value'))
        this.class_options = JSON.parse(JSON.stringify(this.class_options).replace(/classList/g, 'children'))
        this.class_options.forEach((v, k) => {
          v.children.forEach((v2, k2) => {
            v.children = JSON.parse(JSON.stringify(v.children).replace(/classCode/g, 'value'))
            v.children = JSON.parse(JSON.stringify(v.children).replace(/className/g, 'label'))
          })
        })
      })
    },
    check (selection) { // 表格勾选事件
      this.count = 0
      this.selection = []
      selection.forEach((v, k) => {
        this.selection.push(v)
        if (v.IS_BINDING === '已绑定') {
          this.count++
        }
      })
    },
    infoQuery () { // 查询数据请求
      switch (this.activeName) {
        case '1':
          var ajxdata = {}
          if (this.isBinding !== '') { // 绑定没有选择时，不传isBinding字段
            ajxdata.workType = this.workType
            ajxdata.isBinding = this.isBinding
          } else {
            ajxdata.workType = this.workType
          }
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
            data: ajxdata
          }).then(res => { // 成功回调
            this.copyData1 = Object.assign([], res.data.data)
            // 处理性别 + 使用状态
            this.copyData1.forEach((item) => {
              item.WORKER_GENDER_STR = (item.WORKER_GENDER == 0 ? '女' : item.WORKER_GENDER == 1 ? '男' : '')
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData1 = this.copyData1.slice(0)
          })
          break
        case '2':
          var gradeCode = ''
          var classCode = ''
          var data = {}
          if (this.class_selected.length !== 0) {
            gradeCode = this.class_selected[0]
            classCode = this.class_selected[1]
          }
          if (this.classisBinding !== '') { // 绑定没有选择时，不传isBinding字段
            data.gradeCode = gradeCode
            data.classCode = classCode
            data.isBinding = this.classisBinding
          } else {
            data.gradeCode = gradeCode
            data.classCode = classCode
          }
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
            data: data
          }).then(res => { // 成功
            this.copyData2 = Object.assign([], res.data.data)
            // 使用状态 + 账户类型 + 家长角色
            this.copyData2.forEach((item) => {
              item.PARENT_RELATIONSHIP_STR = (item.PARENT_RELATIONSHIP ? (item.STUDENT_NAME + item.PARENT_RELATIONSHIP) : '')
              item.IS_MAIN_STR = item.IS_MAIN == 1 ? '主账号' : '亲情号'
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData2 = this.copyData2.slice(0)
          })
          break
      }
    },
    Jump () {
      if (this.selection.length === 0) {
        this.$message.warning('请勾选要打印的人员!')
        return false
      }
      if (this.count > 0) {
        this.$message.warning('已绑定二维码用户不可打印！')
        return false
      }
      sessionStorage.setItem('Useid', JSON.stringify(this.selection))
      sessionStorage.setItem('activeName', this.activeName)
      this.$router.push({path: '/AccountManagement/AQrcodePrint'})// 跳转路由
    },
    prohibitClick (value, Status) { // 表格按钮事件 0 锁定 1 已激活  2禁用
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/updateAccountList',
        data: {'userId': value.USER_ID, 'userStatus': Status}
      }).then(res => { // 成功
        this.$message.success('操作成功!')
        this.infoQuery()
      })
    },
    initial () { // 重置密码事件
      if (this.selection.length === 0) {
        this.$message.warning('请选择需要重置密码的用户！')
        return false
      }
      var list = []
      var obj = {}
      this.selection.forEach((v, k) => {
        obj.userId = v.USER_ID
        obj.userLoginName = v.USER_LOGIN_NAME
        list.push(obj)
      })
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/resetPassword',
        data: list
      }).then(res => { // 成功
        this.$message.success('重置成功!')
        this.infoQuery()
      })
    }
  },
  watch: {
    activeName (newVal, oldVal) {
      this.scrColumn = columnObj['scrColumn' + this.activeName]
      switch (this.activeName) {
        case '1':
          this.class_show = false
          this.work_show = true
          this.Tabid = 'a1'
          this.printOb.title = '幼儿园教职工列表'
          break
        case '2':
          this.Tabid = 'a2'
          this.work_show = false
          this.class_show = true
          this.printOb.title = '幼儿园家长列表'
          break
      }
      this.infoQuery() // 切换tab页时查询
    },
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this['tableData' + this.activeName] = this['copyData' + this.activeName].filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected
          }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this['tableData' + this.activeName] = this['copyData' + this.activeName]
      }
    }
  }
}
