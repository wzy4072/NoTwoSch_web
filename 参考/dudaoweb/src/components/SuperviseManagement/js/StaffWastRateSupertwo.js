import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      total: 0, // 数据总条数
      size: 20, // 每页数据条数
      currentPage: 1, // 当前页数
      tableData: [],
      copyData: [],
      currPost: [], // 统计岗位
      postArr: [], // 所有岗位
      currDate: [], // 统计时间
      currKindergarten: [], // 统计幼儿园
      kindergartenArr: [], // 所有幼儿园
      scrColumn: [// 表头
        {text: '学校名称', selected: true, 'field': 'krtenName'},
        {text: '期初员工人数', selected: true, 'field': 'start'},
        {text: '期末员工人数', selected: true, 'field': 'end'},
        {text: '本期员工增加人数', selected: true, 'field': 'come'},
        {text: '本期员工流失人数', selected: true, 'field': 'go'},
        {text: '本期员工流失率', selected: true, 'field': 'liushilvRate'},
        {text: '本期流动总量流动率', selected: true, 'field': 'ldzlliushilvRate'},
        {text: '本期流动差量流动率', selected: true, 'field': 'ldclliushilvRate'},
        {text: '本期流出量流动率', selected: true, 'field': 'lclliudonglvRate'},
        {text: '本期流进量流动率', selected: true, 'field': 'ljlliudonglvRate'}
      ],
      searchstr: '',
      printOb: {// 打印所需
        pageNum: 1,
        title: '教职工流失率统计列表'
      }
    }
  },
  mounted () { // 进页面默认执行方法
    this.fullscreenLoading = true
        // 获取幼儿园列表
    this.$ajax({
      method: 'post',
      url: 'baseInfo/kindergapten/selectResponsibleKrtenCode'
    }).then((res) => {
      this.fullscreenLoading = false
      this.kindergartenArr = Object.assign([], res.data.list)
    })
  },
  methods: {
    getPageData () {
      if (!this.currDate.length) { // 判断选择时间
        this.$message.error('请输入统计时间')
        return false
      }
      this.fullscreenLoading = true
      let time1 = this.$api.getDateAll(Date.parse(this.currDate[0]), '-')
      let time2 = this.$api.getDateAll(Date.parse(this.currDate[1]), '-')
      let temp = {
        'krtenCodes': this.currKindergarten,
        'workerTypes': this.currPost,
        'beginDate': time1,
        'endDate': time2
      }
      let that = this
      this.$ajax({
        method: 'post',
        url: 'baseInfo/infoManage/selectWorkerLossRateForInspectorate',
        data: temp
      }).then((res) => {
        this.fullscreenLoading = false
        this.$message.success('查询成功')
        this.copyData = Object.assign([], res.data.list)
        // 处理数据 -> 百分比
        this.copyData.forEach((item) => {
          item.liushilvRate = that.$api.decimalToPercent(item.liushilv, 2)
          item.ldzlliushilvRate = that.$api.decimalToPercent(item.ldzlliushilv, 2)
          item.ldclliushilvRate = that.$api.decimalToPercent(item.ldclliushilv, 2)
          item.lclliudonglvRate = that.$api.decimalToPercent(item.lclliudonglv, 2)
          item.ljlliudonglvRate = that.$api.decimalToPercent(item.ljlliudonglv, 2)
        })
        this.total = this.copyData.length
        this.tableData = this.copyData.slice(0, this.size * 1)
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copyData.slice(
                    (this.currentPage - 1) * this.size,
                    this.currentPage * this.size
                )
    },
    getSummaries (param) { // 自定义合计方法 columns + data
      let { columns, data } = param
      let sums = []
      columns.forEach((column, index) => {
        let field = column.property
        if (field === 'index') {
          sums[index] = '-'
        } else if (field === 'krtenName') {
          sums[index] = '合计'
        } else {
          field = field.indexOf('Rate') > -1 ? field.slice(0, field.length - 4) : field
          let values = data.map(item => Number(item[field]))
          if (!values.every(value => isNaN(value))) {
            // type：1 百分数  2 整数
            let type = (field === 'liushilv' || field === 'ldzlliushilv' || field === 'ldclliushilv' || field === 'lclliudonglv' || field === 'ljlliudonglv') ? 1 : 2
            sums[index] = values.reduce((prev, curr) => {
              return type === 1 ? Number((prev + curr * 100).toFixed(1)) : (prev + curr)
            }, 0) + (type === 1 ? '%' : '')
          } else {
            sums[index] = 'N/A'
          }
        }
      })
      return sums
    }
  },
  watch: {
    currKindergarten (curVal, oldVal) {
      if (!curVal.length || curVal.length > 1) {
        this.postArr.length = 0
        this.currPost.length = 0
        return false
      }
         // 获取统计岗位
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'baseInfo/infoManage/selectWorkerTypeByKindergapten',
        data: {
          'krtenCode': curVal.join(',')
        }
      }).then((res) => {
        this.fullscreenLoading = false
        this.postArr = Object.assign([], res.data.data)
      })
    },
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.scrColumn.filter((item) => {
          return item.selected
        }).some(d => {
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
