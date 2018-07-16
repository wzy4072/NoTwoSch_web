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
    PARENT_RELATIONSHIP: {text: '家长角色', selected: true, field: 'PARENT_RELATIONSHIP'},
    USER_LOGIN_NAME: {text: '用户名', selected: true, field: 'USER_LOGIN_NAME'},
    USER_INIT_PWD: {text: '初始密码', selected: true, field: 'USER_INIT_PWD'},
    USER_LOGIN_TELE: {text: '绑定手机', selected: true, field: 'USER_LOGIN_TELE'},
    IS_MAIN: { text: '账户类型', selected: true, field: 'IS_MAIN' },
    IS_BINDING: {text: '绑定微信', selected: true, field: 'IS_BINDING'},
    USER_STATUS_STR: {text: '使用状态', selected: true, field: 'USER_STATUS_STR'}
  },
  scrColumn3: { // 教育局表筛选列
    SUPERINTENDENT_NAME: { field: 'SUPERINTENDENT_NAME', text: '姓名', selected: true },
    SUPERINTENDENT_GENDER_STR: { field: 'SUPERINTENDENT_GENDER_STR', text: '性别', selected: true },
    DICT_VALUE: { field: 'DICT_VALUE', text: '职务', selected: true },
    USER_LOGIN_NAME: {text: '用户名', selected: true, field: 'USER_LOGIN_NAME'},
    USER_INIT_PWD: {text: '初始密码', selected: true, field: 'USER_INIT_PWD'},
    USER_LOGIN_TELE: {text: '绑定手机', selected: true, field: 'USER_LOGIN_TELE'},
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
      options: [],
      Kindergarten: '',
      printOb: {// 打印所需
        pageNum: 1,
        title: '幼儿园教职工列表'
      },
      searchstr: '', // 表格搜索字段
      tableData1: [],
      tableData2: [],
      tableData3: [],
      copyData1: [],
      copyData2: [],
      copyData3: [],
      Tabid: 'a1',
      count: 0,
      selection: [],
      work_options: [],
      class_options: [],
      work_show: false,
      class_show: false,
      Superintendent_show: false,
      Binding_options: [{'name': '已绑定', 'value': 1}, {'name': '未绑定', 'value': 0}],
      Superintendent_options: [],
      workType: '',
      isBinding: '',
      classisBinding: '',
      class_selected: [],
      SuperintendentisBinding: '',
      SuperintendentType: ''
    }
  },
  mounted () { // 进页面默认执行方法
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/infoManage/selectKindergapten',
      data: {}
    }).then(res => { // 成功回
          this.options = Object.assign([], res.data.list)
        })
  },
  methods: {
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
      if (this.Kindergarten === '') {
        this.$message.warning('请选择幼儿园!')
        return false
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
        data: {'krtenCode': this.Kindergarten}
      }).then(res => { // 成功回调
            switch (this.activeName) {
              case '1':
            this.copyData1 = Object.assign([], res.data.data)
            // 处理性别 + 使用状态
            this.copyData1.forEach((item) => {
              item.WORKER_GENDER_STR = (item.WORKER_GENDER == 0 ? '女' : item.WORKER_GENDER == 1 ? '男' : '')
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData1 = this.copyData1.slice(0)
                this.worklist()// 查询岗位
                break
              case '2':
            this.copyData2 = Object.assign([], res.data.data)
            // 使用状态
            this.copyData2.forEach((item) => {
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData2 = this.copyData2.slice(0)
                this.worklist()// 查询岗位
                break
            }
          })
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
    worklist () { // 请求岗位数据
      if (this.activeName === '1') { // 教职工
        this.work_show = true
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/infoManage/selectWorkerTypeByKindergapten',
          data: {'krtenCode': this.Kindergarten}
        }).then(res => { // 成功回
            this.work_options = Object.assign([], res.data.data)
          })
      }
      if (this.activeName === '2') { // 家长
        this.class_show = true
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/stuTransaction/selectGradeAndClassBykrten',
          data: {'krtenCode': this.Kindergarten}
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
      }
    },
    filter () { // 教职工 刷选条件点击触发请求
      var ajxdata = {}
      if (this.isBinding !== '') { // 没有选择微信绑定，不传isBinding字段
        ajxdata.krtenCode = this.Kindergarten
        ajxdata.workType = this.workType
        ajxdata.isBinding = this.isBinding
      } else {
        ajxdata.krtenCode = this.Kindergarten
        ajxdata.workType = this.workType
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
        data: ajxdata
      }).then(res => { // 成功
        this.copyData1 = Object.assign([], res.data.data)
        // 处理性别 + 使用状态
        this.copyData1.forEach((item) => {
          item.WORKER_GENDER_STR = (item.WORKER_GENDER == 0 ? '女' : item.WORKER_GENDER == 1 ? '男' : '')
          item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
          })
        this.tableData1 = this.copyData1.slice(0)
          })
    },
    Parent_filter () { // 家长 刷选条件点击触发请求
      var gradeCode = ''
      var classCode = ''
      var data = {}
      if (this.class_selected !== 0) {
        gradeCode = this.class_selected[0]
        classCode = this.class_selected[1]
      }
      if (this.classisBinding !== '') { // 没有选择微信绑定，不传isBinding字段
        data.krtenCode = this.Kindergarten
        data.gradeCode = gradeCode
        data.classCode = classCode
        data.isBinding = this.classisBinding
      } else {
        data.krtenCode = this.Kindergarten
        data.gradeCode = gradeCode
        data.classCode = classCode
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
        data: data
      }).then(res => { // 成功
        this.copyData2 = Object.assign([], res.data.data)
        // 使用状态
        this.copyData2.forEach((item) => {
          item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
          })
        this.tableData2 = this.copyData2.slice(0)
          })
    },
    Superintendent_filter () { // 教育局
      var obj = {}

      if (this.SuperintendentisBinding !== '') {
        obj = {
          'superintendentPosition': this.SuperintendentType,
          'isBinding': this.SuperintendentisBinding
        }
      } else {
        obj = {
          'superintendentPosition': this.SuperintendentType
        }
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
        data: obj
      }).then(res => { // 成功
        this.copyData3 = Object.assign([], res.data.data)
        // 处理性别 + 使用状态
        this.copyData3.forEach((item) => {
          item.SUPERINTENDENT_GENDER_STR = (item.SUPERINTENDENT_GENDER == 0 ? '女' : item.SUPERINTENDENT_GENDER == 1 ? '男' : '')
          item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
          })
        this.tableData3 = this.copyData3.slice(0)
          })
    },
    prohibitClick (value, Status) { // 表格按钮事件 0 锁定 1 已激活  2禁用
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/updateAccountList',
        data: {'userId': value.USER_ID, 'userStatus': Status}
      }).then(res => { // 成功
            this.$message.success('操作成功!')
            this.Ajax_fucn()
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
            this.Ajax_fucn()
          })
    },
    Ajax_fucn () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
        data: {'krtenCode': this.Kindergarten}
      }).then(res => { // 成功回调
            switch (this.activeName) {
              case '1':
            this.copyData1 = Object.assign([], res.data.data)
            // 处理性别 + 使用状态
            this.copyData1.forEach((item) => {
              item.WORKER_GENDER_STR = (item.WORKER_GENDER == 0 ? '女' : item.WORKER_GENDER == 1 ? '男' : '')
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData1 = this.copyData1.slice(0)
                break
              case '2':
            this.copyData2 = Object.assign([], res.data.data)
            // 使用状态
            this.copyData2.forEach((item) => {
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData2 = this.copyData2.slice(0)
                break
              case '3':
            this.copyData3 = Object.assign([], res.data.data)
            // 处理性别 + 使用状态
            this.copyData3.forEach((item) => {
              item.SUPERINTENDENT_GENDER_STR = (item.SUPERINTENDENT_GENDER == 0 ? '女' : item.SUPERINTENDENT_GENDER == 1 ? '男' : '')
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData3 = this.copyData3.slice(0)
                break
            }
          })
    },
    post () { // 教育局职务查询
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/workerSelect',
        data: {}
      }).then(res => { // 成功回调
        this.Superintendent_options = Object.assign([], res.data.list)
      })
    }
  },
  watch: {
    activeName (newVal, oldVal) {
      this.scrColumn = columnObj['scrColumn' + newVal]
      switch (newVal) {
        case '1':
          this.printOb.title = '幼儿园教职工列表'
          this.class_show = false
          this.Superintendent_show = false
          this.Tabid = 'a1'
          break
        case '2':
          this.printOb.title = '幼儿园家长列表'
          this.Tabid = 'a2'
          this.work_show = false
          this.Superintendent_show = false
          break
        case '3':
          this.printOb.title = '教育局用户列表'
          this.Superintendent_show = true
          this.class_show = false
          this.work_show = false
          this.Tabid = 'a3'
          this.post()
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/personalCenter/selectAccountList/' + this.activeName,
            data: {}
          }).then(res => { // 成功回
            this.copyData3 = Object.assign([], res.data.data)
            // 处理性别 + 使用状态
            this.copyData3.forEach((item) => {
              item.SUPERINTENDENT_GENDER_STR = (item.SUPERINTENDENT_GENDER == 0 ? '女' : item.SUPERINTENDENT_GENDER == 1 ? '男' : '')
              item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
            })
            this.tableData3 = this.copyData3.slice(0)
          })
          break
      }
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
