import navBar from '@/common/components/navBar'
// import Menu from '@/getMenu' // 获取本地菜单
export default {
  components: { navBar },
  data () {
    return {
      menu: [], // 一级菜单
      menuShow: false, // 是否显示菜单
      showOpa: false, // 显示设置列表
      userName: '',
      schoolName: '',
      rightkey: false, // 右键菜单的显示隐藏
      rightstyle: {left: '0px', top: '0px'}, // 右键菜单的定位
      shortMenu: [],
      selectedOptions: [] // 当前选中
    }
  },
  mounted () {
    this.userName = JSON.parse(sessionStorage.getItem('LoginUser')).userLoginName
    this.schoolName = JSON.parse(sessionStorage.getItem('LoginUser')).krtenName
    // 获取菜单 + 去除首页
    this.menu = JSON.parse(sessionStorage.getItem('instaiMenu'))
    this.menu = this.menu.slice(1)
  },
  methods: {
    // 菜单右键事件
    test ([item, event]) {
      if (item.parentResId === -1 || !item.children || !item.children.length) { return false }
      let e = event || window.event
      // 取消默认
      e.preventDefault()
      // 获取鼠标位置
      let placeX = e.clientX + 30
      let placeY = e.clientY - 30
      this.rightkey = true
      this.rightstyle.left = placeX + 'px'
      this.rightstyle.top = placeY + 'px'
    },
    openMenu (val) {
      this.menuShow = val !== 0
      if (!val) {
        this.rightkey = false
      }
    },
    opaShortcut (type) {
      if (!type) { // 删除

      } else { // 设置

      }
    },
    jumpPage (url) {
      this.$router.push({path: url})
    },
    exitLogin () { // 退出登录
      this.showOpa = false
      this.$api.delCookie('token')
      sessionStorage.removeItem('user_token')
      if (sessionStorage.getItem('LoginType') == 1) {
        window.location.href = '#/login_kind'// 需求方要求一旦出错立即跳转登录，所以采取这种侵入式的手段。
      } else {
        window.location.href = '#/login_edu'// 需求方要求一旦出错立即跳转登录，所以采取这种侵入式的手段。
      }
    }
  },
  watch: {
    $route: function (to, from) {
      this.menuShow = false
    }
  }
}
