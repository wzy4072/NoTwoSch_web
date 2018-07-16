import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      activeName: '1',
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      isWork: '',
      data: [],
      holiday_staff: '',
      holidayTypeList: ['', '元旦', '除夕', '春节', '清明节', '劳动节', '端午节', '中秋节', '国庆节']
    }
  },
  mounted () {
    this.initData(null)
    this.Ajax_funtion()
  },
  methods: {
    initData: function (cur) {
      var date
      if (cur) {
        date = new Date(cur)
      } else {
        var now = new Date()
        var d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1))
        d.setDate(35)
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      }
      this.currentDay = date.getDate()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1

      this.currentWeek = date.getDay() // 1...6,0
      if (this.currentWeek === 0) {
        this.currentWeek = 7
      }
      var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)
      this.days.length = 0
        // 今天是周日，放在第一行第7个位置，前面6个
        // 初始化本周
      for (var i = this.currentWeek - 1; i >= 0; i--) {
        var dataTime = new Date(str)
        dataTime.setDate(dataTime.getDate() - i)
        var dayobject = {} // 用一个对象包装Date对象  以便为以后预定功能添加属性
        dayobject.day = dataTime
        dayobject.HOLIDAY_DATE = 'x'
        dayobject.IS_WORK = 'x'
        dayobject.HOLIDAY_TYPE = ''
        this.days.push(dayobject)// 将日期放入data 中的days数组 供页面渲染使用
      }
        // 其他周
      for (var j = 1; j <= 42 - this.currentWeek; j++) {
        var d2 = new Date(str)
        d2.setDate(d2.getDate() + j)
        var dayobject2 = {}
        dayobject2.day = d2
        dayobject2.HOLIDAY_DATE = 'x'
        dayobject2.IS_WORK = 'x'
        dayobject2.HOLIDAY_TYPE = ''
        this.days.push(dayobject2)
      }
    },
    pickPre: function (year, month) {
        // setDate(0); 上月最后一天
        // setDate(-1); 上月倒数第二天
        // setDate(dx) 参数dx为 上月最后一天的前后dx天
      var d = new Date(this.formatDate(year, month, 1))
      d.setDate(0)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      this.Ajax_funtion()
    },
    pickNext: function (year, month) {
      var d = new Date(this.formatDate(year, month, 1))
      d.setDate(35)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      this.Ajax_funtion()
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function (year, month, day) {
      var y = year
      var m = month
      if (m < 10) m = '0' + m
      var d = day
      if (d < 10) d = '0' + d
      return y + '-' + m + '-' + d
    },
    day_function: function (params, value) { // 日历点击事件 activeName=0为学生 activeName=1为教职工
      if (this.isWork === 1) { // 上课、上班 为红色
        if (params.path[0].className === 'Schedule_work' || params.path[0].className === 'Schedule_active' || params.path[0].className === 'nois') {
          params.path[0].className = 'Schedule_active'
          this.conserve(value)
        }
      } else if (this.isWork === 0) { // 放假、休息为蓝色
        if (params.path[0].className === 'Schedule_work' || params.path[0].className === 'Schedule_active' || params.path[0].className === 'nois') {
          params.path[0].className = 'Schedule_work'
          this.conserve(value)
        }
      } else if (this.isWork === '') {
        this.$message.warning('请先点击放假或上课按钮,再设置！')
        return false
      }
    },
    Vacation: function () { // 设为放假
      this.isWork = 0
    },
    Course: function () { // 设为上课
      this.isWork = 1
    },
    handleClick (tab, event) { // Tabs导航切换
      this.Ajax_funtion()
    },
    list_function () {
      this.days.forEach((v, k) => { // 遍历日期
        v.HOLIDAY_DATE = this.formatDate(v.day.getFullYear(), v.day.getMonth() + 1, v.day.getDate())
      })

      this.data.forEach((e, index) => {
        this.days.forEach((v, k) => {
          if (e.HOLIDAY_DATE === v.HOLIDAY_DATE) {
            v.IS_WORK = e.IS_WORK
            v.HOLIDAY_TYPE = e.HOLIDAY_TYPE
          }
        })
      })
    },
    Ajax_funtion () { // 请求数据
      var currentMonth = this.currentMonth < 10 ? '0' + this.currentMonth : this.currentMonth
      var day = Number(this.activeName)
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/selectCalendar',
        data: {'holidayStaff': day, 'holidayDate': this.currentYear + '-' + currentMonth}
      })
          .then(res => { // 成功回调
            this.data = Object.assign([], res.data.data)
            this.list_function()
          })
          .catch(err => {
            this.$message.error('接口异常：' + err)
          })
    },
    conserve (value) { // 保存设置
      var day = Number(this.activeName)
      var holidayDate = this.formatDate(value.getFullYear(), value.getMonth() + 1, value.getDate())
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/personalCenter/updateCalendar',
        data: {'holidayStaff': day, 'holidayDate': holidayDate, 'isWork': this.isWork}
      })
          .then(res => { // 成功回调
            this.$message.success('保存设置成功!')
            this.Ajax_funtion()
          })
          .catch(err => {
            this.$message.error('接口异常：' + err)
          })
    }

  }
}
