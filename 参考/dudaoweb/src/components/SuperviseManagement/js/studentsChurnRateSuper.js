import tableBar from '@/common/components/tableBar'
export default {
  components: {tableBar},
  data () {
    return {
      startDate: '', // 查询条件（开始时间）
      endDate: '', // 查询条件（结束时间）
      kindergarten: [], // 学校信息
      schoolName: [],
      openClassify: 0, // 分类弹窗显示 0：隐藏 1：显示
      options: [],
      scrColumn: [
        {text: '学校名称', selected: true, field: 'krtenName'},
        {text: '期初学生人数', selected: true, field: 'startNum'},
        {text: '期末学生人数', selected: true, field: 'endNum'},
        {text: '本期增加学生人数', selected: true, field: 'addNum'},
        {text: '本期流失学生人数', selected: true, field: 'lossNum'},
        {text: '本期学生流失率%', selected: true, field: 'lossNumRate'},
        {text: '本期流动总量流动率%', selected: true, field: 'totalAddRate'},
        {text: '本期流动差量流动率%', selected: true, field: 'totalLossRate'},
        {text: '本期流出量流动率%', selected: true, field: 'outRate'},
        {text: '本期流进量流动率%', selected: true, field: 'inRate'}
      ],
      printOb: {
        pageNum: 1,
        title: '各幼儿园学生流动及流失率统计表'
      },
      tableData: [],
      copyData: [],
      date: [
        (new Date(new Date().setMonth(new Date().getMonth() - 1))),
        new Date()
      ],
      total: 0,
      size: 50,
      searchstr: '',
      handleClose: '',
      currentPage: 1,
      zIndex: null
    }
  },
  mounted () {
    let that = this
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/eduAdminMang/stuLossAndAddRate',
      data: {
        'startDate': this.formatDate(this.date[0]),
        'endDate': this.formatDate(this.date[1], 1),
        'krtenCodes': this.schoolName.join(',')
      }
    }).then((re) => {
      if (re.data.code > 0) {
        this.copyData = Object.assign([], re.data.data)
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.tableData.forEach(function (v1) {
          if (v1.type === '合计') {
            v1.krtenName = '合计'
          }
        })
        this.total = re.data.data.length
        re.data.data.forEach(function (v) {
          that.kindergarten.push({value: v.krtenCode, label: v.krtenName})
        })
        that.kindergarten.pop()
      } else {
        this.$message.error(re.data.desc)
      }
    })
    this.refresh()
  },
  methods: {
    refresh () {
      if (this.tableData.length > 0) {
        this.copyData = this.tableData
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.tableData.length
      }
    },
    intPage () {
      this.startDate = this.formatDate(this.date[0])
      this.endDate = this.formatDate(this.date[1], 1)
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/stuLossAndAddRate',
        data: {
          'startDate': this.startDate,
          'endDate': this.endDate,
          'krtenCodes': this.schoolName.join(',')
        }
      }).then((re) => {
        if (re.data.code > 0) {
          this.copyData = Object.assign([], re.data.data)
          this.tableData = this.copyData.slice(0, this.size * 1)
          this.tableData.forEach(function (v1) {
            if (v1.type === '合计') {
              v1.krtenName = '合计'
            }
          })
          this.total = re.data.data.length
        } else {
          this.$message.error(re.data.desc)
        }
      })
      this.refresh()
    },
    // 分页的上一页下一页
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    // 分页的跳到当前页面
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copyData.slice(
        (this.currentPage - 1) * this.size,
        this.currentPage * this.size
      )
    },
    // 查询按钮点击事件
    query () {
      this.intPage()
    },
    formatDate (date, delayDays) { // 增加字段 delayDays:延迟天数
      delayDays && (date = new Date((Date.parse(date) + 86400000 * delayDays)))
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = date.getDate()
      day = day < 10 ? ('0' + day) : day
      return year + '-' + month + '-' + day
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.scrColumn.filter((item) => { return item.selected }).some(d => {
          return o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1)
        })
      })
      } else {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      )
      }
    }
  }
}
