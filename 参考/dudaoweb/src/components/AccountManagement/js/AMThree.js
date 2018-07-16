import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      scrColumn: {
        SUPERINTENDENT_NAME: { field: 'SUPERINTENDENT_NAME', text: '姓名', selected: true },
        SUPERINTENDENT_GENDER_STR: { field: 'SUPERINTENDENT_GENDER_STR', text: '性别', selected: true },
        DICT_VALUE: { field: 'DICT_VALUE', text: '职务', selected: true },
        USER_LOGIN_NAME: {text: '用户名', selected: true, field: 'USER_LOGIN_NAME'},
        USER_INIT_PWD: {text: '初始密码', selected: true, field: 'USER_INIT_PWD'},
        USER_LOGIN_TELE: { text: '绑定手机', selected: true, field: 'USER_LOGIN_TELE' },
        IS_BINDING: {text: '绑定微信', selected: true, field: 'IS_BINDING'},
        USER_STATUS_STR: {text: '使用状态', selected: true, field: 'USER_STATUS_STR'}
      },
      printOb: {// 打印所需
        pageNum: 1,
        title: '教育局用户列表'
      },
      searchstr: '',
      fullscreenLoading: false,
      tableData: [],
      copyData: [],
      count: 0,
      selection: [],
      Binding_options: [{'name': '已绑定', 'value': 1}, {'name': '未绑定', 'value': 0}],
      Superintendent_options: [],
      SuperintendentisBinding: '',
      SuperintendentType: '',
      activeName: '3'
    }
  },
  mounted () { // 进页面默认执行方法
    this.Ajax_fucn()
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
    Superintendent_filter () { // 教育局
      var obj = {}
      if (this.SuperintendentisBinding !== '' && this.SuperintendentType !== '') {
        obj = {
          'superintendentPosition': this.SuperintendentType,
          'isBinding': this.SuperintendentisBinding
        }
      } else if (this.SuperintendentisBinding === '' && this.SuperintendentType === '') {
        obj = {}
      } else if (this.SuperintendentisBinding !== '') {
        obj = {
          'isBinding': this.SuperintendentisBinding
        }
      } else if (this.SuperintendentType !== '') {
        obj = {
          'superintendentPosition': this.SuperintendentType
        }
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectAccountList/3',
        data: obj
      }).then(res => { // 成功
        this.copyData = Object.assign([], res.data.data)
        // 处理性别 + 使用状态
        this.copyData.forEach((item) => {
          item.SUPERINTENDENT_GENDER_STR = (item.SUPERINTENDENT_GENDER == 0 ? '女' : item.SUPERINTENDENT_GENDER == 1 ? '男' : '')
          item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
        })
        this.tableData = this.copyData.slice(0)
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
        url: 'baseInfo/personalCenter/selectAccountList/3',
        data: {}
      }).then(res => { // 成功回调
        this.copyData = Object.assign([], res.data.data)
        // 处理性别 + 使用状态
        this.copyData.forEach((item) => {
          item.SUPERINTENDENT_GENDER_STR = (item.SUPERINTENDENT_GENDER == 0 ? '女' : item.SUPERINTENDENT_GENDER == 1 ? '男' : '')
          item.USER_STATUS_STR = (item.USER_STATUS == 0 ? '已锁定' : item.USER_STATUS == 1 ? '已激活' : item.USER_STATUS == 2 ? '已禁用' : '')
        })
        this.tableData = this.copyData.slice(0)
        this.post()
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
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected
          }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this.tableData = this.copyData
      }
    }
  }
}
