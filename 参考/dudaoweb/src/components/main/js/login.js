export default {
  data () {
    return {
      fullscreenLoading: false,
      tableData: [ // 幼儿园基本信息数据
      ],
      detailsData: {}, // 当前幼儿园详细信息
      showTable: false, // 是否显示幼儿园表格数据
      showDetails: false, // 是否显示详情
      formData: { // 表单数据
        loginName: '',
        password: '',
        loginType: 0, // 0:教育局 1:幼儿园
        loginCode: null // 当前选中幼儿园 or 教育局
      },
      selectred: false, // 是否记住密码
      schoolList: [], // 幼儿园列表
      showQrcode: false, // 是否二维码登录
      loginWay: 1 // 1：用户名  2：扫码
    }
  },
  mounted () {
    if (this.$api.getCookie('user')) { // 已存用户
      this.formData.loginName = this.$api.getCookie('user')
      this.formData.password = this.$api.getCookie('pswd')
      this.selectred = true
    }
    // 根据url判断用户登录页
    if (window.location.href.indexOf('login_kind') > -1) { // 幼儿园
      this.formData.loginType = 1
    }
    this.getKindergartenList() // 获取登录所需的信息 幼儿园列表+教育局code
  },
  methods: {
    getKindergartenList () {
      this.$ajax({
        method: 'GET',
        url: 'auth/getSystemInfo'
      }).then(res => {
        this.schoolList = res.data.list
        this.tableData = res.data.list
        if (this.formData.loginType == 1) { // 幼儿园
          this.formData.loginCode = ''
        } else { // 教育局
          this.formData.loginCode = res.data.data.areaCode
        }
      })
    },
    submit () {
      if (this.formData.loginType == 1 && !this.formData.loginCode) {
        this.$message.warning('请选择幼儿园')
        return
      }
      if (this.formData.loginName === '') {
        this.$message.warning('用户名不能为空')
        return
      }
      if (this.formData.password === '') {
        this.$message.warning('密码不能为空')
        return
      }
      // md5加密
      let that = this
      this.YS.YS_jquery().then(function ($) {
        that.YS.YS_md5().then(function (md5) {
          let sendData = Object.assign({}, that.formData)
          sendData.password = md5(sendData.password + '' + sendData.password).toUpperCase()
          that.$ajax({
            method: 'post',
            url: 'auth/login',
            data: sendData
          }).then(res => {
            sessionStorage.setItem('instaiMenu', JSON.stringify(res.data.data.resourceList))
            sessionStorage.setItem('LoginUser', JSON.stringify(res.data.data)) // 存储登陆用户信息
            sessionStorage.setItem('LoginType', that.formData.loginType) // 存储登录类型 0:教育局 1:幼儿园
            sessionStorage.setItem('krtenCodes', res.data.data.krtenCode)
            if (that.selectred) { // 记住密码
              that.$api.setCookie('user', that.formData.loginName, 7) // 保存帐号到cookie，有效期7天
              that.$api.setCookie('pswd', that.formData.password, 7) // 保存密码到cookie，有效期7天
              that.$api.setCookie('token', res.data.token, 7) // 保存token到cookie，有效期7天
            }
            return that.$ajax({
              method: 'get',
              url: 'auth/getServiceToken',
              params: {loginAuthToken: res.data.token, type: 1}
            })
          }).then(res => {
            sessionStorage.setItem('user_token', res.data.token) // 存储token
            that.$router.push({ path: '/' }) // 跳转到首页
            if (!that.formData.loginType) { // 教育局
              return that.$ajax({
                method: 'post',
                url: 'baseInfo/kindergapten/krtenInfo'
              })
            }
          }).then(res => {
            // 获取 存储 督导员管辖幼儿园 'krtenCode1,krtenCode2...'
            if (!that.formData.loginType) { // 教育局
              sessionStorage.setItem('krtenCodes', res.data.data.map((item) => {
                return item.krtenCode
              }).join(','))
            }
          })
        })
      })
    },
    checkDetails (row) {
      this.showDetails = !this.showDetails
      this.detailsData = row
    },
    keyup (ev, id) {
      if (ev.keyCode === 13) {
        if (id) {
          document.querySelector('#' + id).focus()
        } else {
          this.submit()
        }
      }
    },
    opaList () {
      this.showTable = !this.showTable
    },
    forgetPwd () { // 忘记密码
      this.$message.warning('请联系管理员')
    }
  },
  watch: {
    selectred: function (val) {
      if (!val) { // 不记住密码
        this.$api.delCookie('user') // 删除用户名
        this.$api.delCookie('pswd') // 删除密码
      }
    }
  }
}
