import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      total: 0, // 数据总条数
      size: 20, // 每页数据条数
      currentPage: 1, // 当前页数
      fullscreenLoading: false,
      tableData: [],
      copyData: [],
      kindergartenArr: [],
      postArr: [],
      currKindergarten: [], // 当前幼儿园
      currPost: [], // 当前岗位
      currDate: [], // 当前时间
      searchstr: '', // 当前输入
      scrColumn: {// 表头
        krtenName: {text: '幼儿园名称', selected: true, field: 'krtenName'},
        workerNum: {text: '教职工人数', selected: true, field: 'workerNum'},
        middlezhuanNum: {text: '中专人数', selected: true, field: 'middlezhuanNum'},
        zhuanNum: {text: '大专人数', selected: true, field: 'zhuanNum'},
        unversityNum: {text: '本科人数', selected: true, field: 'unversityNum'},
        masterNum: {text: '硕士人数', selected: true, field: 'masterNum'},
        doctorNum: {text: '博士人数', selected: true, field: 'doctorNum'},
        otherNum: {text: '其他', selected: true, field: 'otherNum'}
      },
      printOb: {// 打印所需
        pageNum: 1,
        title: '师资力量统计表'
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
      let time1 = this.$api.getDateAll(Date.parse(this.currDate[0]), '-')
      let time2 = this.$api.getDateAll(Date.parse(this.currDate[1]), '-')
      let temp = {
        'krtenCodes': this.currKindergarten,
        'workerTypes': this.currPost,
        'beginDate': time1,
        'endDate': time2
      }
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'baseInfo/staffManage/selectFacultyList',
        data: temp
      }).then((res) => {
        this.fullscreenLoading = false
        this.$message.success('查询成功')
        this.copyData = Object.assign([], res.data.list)
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
          let values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              return prev + curr
            }, 0)
          } else {
            sums[index] = 'N/A'
          }
        }
      })
      return sums
    },
    jumpPage (name) {
      this.$router.push({path: 'FacultyDetails'})
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
        return Object.values(this.scrColumn).filter((item) => {
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
