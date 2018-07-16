import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
let startdate = new Date()
let enddate = new Date()
startdate.setDate(1)
enddate.setDate(0)
startdate.setMonth(startdate.getMonth() - 1)
startdate = startdate.getFullYear() + '-' +
((startdate.getMonth() + 1) > 10 ? (startdate.getMonth() + 1) : ('0' + (startdate.getMonth() + 1))) + '-' +
(startdate.getDate() > 10 ? startdate.getDate() : ('0' + startdate.getDate()))
enddate = enddate.getFullYear() + '-' +
((enddate.getMonth() + 1) > 10 ? (enddate.getMonth() + 1) : ('0' + (enddate.getMonth() + 1))) + '-' +
(enddate.getDate() > 10 ? enddate.getDate() : ('0' + enddate.getDate()))
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      total: 0,
      size: 45,
      currentPage: 1,
      totalCount: 0,
      unFinishCount: 0,
      finishCount: 0,
      fullscreenLoading: false,
      tableData: [],
      allSu: [],
      typeSelect: [
        {text: '资质反馈', value: 1},
        {text: '疾控反馈', value: 2}
      ],
      searchstr: '',
      searchFiledArr: ['suName'], // 模糊搜索字段数组
      searchData: {
        suIds: '',
        date: [startdate, enddate],
        feedBackType: ''
      },
      printOb: { // 打印所需
        pageNum: 1,
        title: '项目列表'
      }
    }
  },
  mounted () { // 进页面默认执行方法
    this.refresh()
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      let [beginDate = '', endDate = ''] = this.searchData.date
      this.$ajax({
        method: 'post',
        url: 'feedback/qualifications/selectSuFeedBack',
        data: {beginDate: beginDate, endDate: endDate, suIds: this.searchData.suIds.toString(), feedBackType: this.searchData.feedBackType.toString()}
      }).then((res) => {
        this.fullscreenLoading = false
        let maindata = []
        let {allSu, suInfo} = res.data.data
        this.allSu = allSu
        if (res.data.code > 0) {
          let cont = 0
          allSu.forEach((o, i) => {
            let total = {feedBackType: 0, total: 0, unFinish: 0, finish: 0, suName: o.suName, suId: o.suId}
            let arr = suInfo.filter(d => {
              if (d.suId === o.suId) {
                total.total += d.total
                total.unFinish += d.unFinish
                total.finish += d.finish
              }
              return d.suId === o.suId
            })
            this.totalCount += total.total
            this.unFinishCount += total.unFinish
            this.finishCount += total.finish
            if (arr.length > 0) {
              arr.push(total)
              arr[0]['lev'] = arr.length
              arr[0]['index'] = ++cont
              maindata = maindata.concat(arr)
            }
          })
          // 处理反馈类型
          maindata.forEach((item) => {
            switch (item.feedBackType) {
              case '1':
                item.feedBackTypeStr = '资质反馈'
                break
              case '2':
                item.feedBackTypeStr = '疾控反馈'
                break
              case 0:
                item.feedBackTypeStr = '小计'
            }
          })
          this.copyData = Object.assign([], maindata)
          this.total = this.copyData.length
          this.copyData.push({
            'index': '',
            'suName': '合计',
            'total': this.totalCount,
            'krtenCode': '',
            'feedBackType': '',
            'unFinish': this.unFinishCount,
            'finish': this.finishCount,
            'lev': 1
          })
          this.tableData = this.copyData.slice(0, this.size * 1)
        } else {
          this.$message.error(res.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
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
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 0) {
        if (typeof row.lev === 'number') {
          return {
            rowspan: row.lev,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
        } else if (index > 2) {
          const values = data.map(item => {
            return item.feedBackType !== 0 ? Number(item[column.property]) : 0
          })
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = 'N/A'
          }
        }
      })

      return sums
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.searchFiledArr.some(d => {
          return o[d] && ((typeof o[d] === 'string') ? o[d].indexOf(newVal) > -1 : o[d].toString().indexOf(newVal) > -1)
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
