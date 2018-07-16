import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      startDate: '', // 查询条件（开始时间）
      endDate: '', // 查询条件（结束时间）
      kindergarten: [], // 学校信息
      message: '',
      stuNum: 0,
      searchFiledArr1: ['gradeName', 'stuNum'], // 模糊搜索字段
      searchFiledArr2: ['KRTEN_NAME', 'stuCount'], // 模糊搜索字段
      tableData: [],
      copyData: [],
      printOb: {
        pageNum: 1,
        title: '各幼儿园学生人数统计表'
      },
      schoolName: [],
      schoolName1: [],
      date: [
        (new Date(new Date().setMonth(new Date().getMonth() - 1))),
        new Date()
      ],
      searchstr: '',
      total: 0,
      size: 50,
      fullscreenLoading: true, // 加载样式
      currentPage: 1
    }
  },
  mounted () {
    let that = this
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/kindergapten/selectResponsibleKrtenCode',
      data: {}
    }).then((re) => {
      this.fullscreenLoading = false
      if (re.data.code > 0) {
        re.data.list.forEach(function (v) {
          that.schoolName.push(v.krtenCode)
          that.schoolName1 = that.schoolName
          that.kindergarten.push({value: v.krtenCode, label: v.krtenName})
        })
        this.intPage()
      }
    })
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      if (this.tableData.length > 0) {
        this.copyData = this.tableData
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.tableData.length
      }
    },
    intPage () {
      let that = this
      this.stuNum = 0
      if (this.schoolName.length !== 0) {
        this.startDate = this.formatDate(this.date[0])
        this.endDate = this.formatDate(this.date[1])
        this.fullscreenLoading = true
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/stuTransaction/stuNumberSupervise',
          data: {
            'statisticsStratDate': this.startDate,
            'statisticsEndDate': this.endDate,
            'krtenCode': this.schoolName.join(',')
          }
        }).then((res) => {
          this.fullscreenLoading = false
          if (this.schoolName.length === 1) {
            if (res.data.code > 0) {
              Object.keys(res.data.data.stuNumberSuperviseList[0]).forEach(function (v1) {
                res.data.data.gradeList.forEach(function (v2) {
                  if (v1 === v2.gradeClassId.toString()) {
                    v2.stuNum = res.data.data.stuNumberSuperviseList[0][v1]
                  }
                })
                if (v1 === 'stuCount') {
                  res.data.data.gradeList.push({'gradeName': '合计', 'stuNum': res.data.data.stuNumberSuperviseList[0][v1]})
                }
              })
              this.copyData = Object.assign([], res.data.data.gradeList)
              this.copyData.forEach(function (v, k) {
                for (var key in v) {
                  if (v[key] === null) {
                    delete v[key]
                  }
                }
              })
              console.log(this.copyData)
              this.tableData = this.copyData.slice(0, this.size * 1)
              this.total = res.data.data.gradeList.length
            }
          } else {
            if (res.data.code > 0) {
              res.data.data.stuNumberSuperviseList.forEach(function (v1) {
                that.stuNum += v1.stuCount
              })
              res.data.data.stuNumberSuperviseList.push({KRTEN_NAME: '合计', stuCount: that.stuNum})
              this.copyData = Object.assign([], res.data.data.stuNumberSuperviseList)
              this.tableData = this.copyData.slice(0, this.size * 1)
              this.total = res.data.data.stuNumberSuperviseList.length
            } else {
              this.$message.error(res.data.desc)
            }
          }
        })
        this.refresh()
      } else {
        this.$message.warning('请选择需要查询的幼儿园！')
      }
    },
    // 分页的上一页下一页
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    //  分页的跳到当前页面
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copyData.slice(
        (this.currentPage - 1) * this.size,
        this.currentPage * this.size
      )
    },
    // 查询按钮点击事件
    query () {
      this.schoolName = this.schoolName1
      this.intPage()
    },
    formatDate (date) {
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
        return this[this.schoolName.length === 0 ? 'searchFiledArr1' : 'searchFiledArr2'].some(d => {
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
