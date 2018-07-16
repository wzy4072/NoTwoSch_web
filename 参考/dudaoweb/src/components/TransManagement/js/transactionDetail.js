import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      transactionTypeStr: ['转班', '转入', '转出', '休学', '复学', '退学'],
      studentGenderStr: ['女', '男'],
      dialogChangeTeacher: false,
      currentPage4: 1,
      size: 50,
      total: 0,
      activeName: 'first',
      date: [
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date()
      ],
      startDate: '',
      endDate: '',
      nowGrade: '',
      printOb: {
        pageNum: 1,
        title: '学生列表'
      },
      scrColumn: { // 表头（有筛选列模糊搜索字段）
        transactionType: { text: '异动内容', selected: true, align: 'center', field: 'transactionType' },
        gradeName: { text: '年级', selected: true, align: 'center', field: 'gradeName' },
        gradeCode: { text: '年级代码', selected: true, field: 'gradeCode' },
        className: { text: '班级', selected: true, field: 'className' },
        studentName: { text: '姓名', selected: true, field: 'studentName' },
        entranceCode: { text: '入学代码', selected: true, field: 'entranceCode' },
        studentGender: { text: '性别', selected: true, field: 'studentGender' },
        transactionDate: { text: '操作时间', selected: true, field: 'transactionDate' }
      },
      searchCoum: ['gradeName', 'gradeCode', 'className', 'studentName', 'entranceCode', 'studentGender', 'transactionDate'],
      copyData: [],
      tableData: [],
      input5: '',
      transactionData: {}
    }
  },
  watch: {
    input5 (newVal, oldVal) { // 有筛选列模糊搜索
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage4 - 1) * this.size,
          this.currentPage4 * this.size
        ).filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected && !item.noSearch
          }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this.tableData = this.copyData.slice(
          (this.currentPage4 - 1) * this.size,
          this.currentPage4 * this.size
        )
      }
    }
  },
  mounted () {
    let nowdate = new Date()
    nowdate.setMonth(nowdate.getMonth() - 1)
    this.startDate = this.$api.getDateAll(this.$api.time(nowdate), '-')
    this.endDate = this.$api.getDateAll(this.$api.time(), '-')
    setTimeout(function () {
      var ele = document.getElementsByClassName('el-input__prefix')
      for (let i = 0; i < ele.length; i++) {
        ele[i].setAttribute('style', 'top:-4px;')
      }
    }, 5)
    let senddata = {
      'statisticsStratDate': this.startDate,
      'statisticsEndDate': this.endDate
    }
    this.getData(senddata)
  },
  methods: {
    getData (senddata) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/stuTransactionNumStatistics',
        data: senddata
      })
      .then(data => {
        let arr1 = JSON.parse(JSON.stringify(data.data.data.stuTranList))
        this.copyData = arr1
        this.tableData = data.data.data.stuTranList
      })
      .then(err => {
        console.log(err)
      })
    },
    handleClick (tab, event) {
      this.activeName = tab.name
    },
    searchfunc () {
      if (this.input5 !== '') {
        let tempArr = []
        let that = this
        document.querySelectorAll('.el-table__body-wrapper table tr').forEach(function (tr, key) {
          tr.innerText.trim().replace(/\s/g, '').indexOf(that.input5) > -1 && tempArr.push(key)
        })
        this.tableData = this.tableData.filter((o, k) => {
          return tempArr.indexOf(k) > -1
        })
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.copyData))
      }
      // if (this.input5 !== '') {
      //   this.tableData = this.copyData.filter(o => {
      //     return Object.keys(o).some(d => { // .some是循环
      //       if (this.searchCoum.indexOf(d) > -1) { // 检索字符串是否存在
      //         if (o[d]) {
      //           return (typeof o[d] === 'string') ? o[d].indexOf(this.input5) > -1 : o[d].toString().indexOf(this.input5) > -1
      //         }
      //       }
      //     })
      //   })
      // } else {
      //   let arr1 = JSON.parse(JSON.stringify(this.copyData))
      //   this.tableData = arr1
      // }
    },
    // 分页的上一页下一页
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    //  分页的跳到当前页面
    handleCurrentChange (val) {
      this.currentPage4 = val || this.currentPage4
      this.tableData3 = this.copydata.slice(
        (this.currentPage4 - 1) * this.size,
        this.currentPage4 * this.size
      )
    },
    showDieg (transactionType, index, data) {
      let that = this
      let senddata = {
        transactionType: transactionType,
        studentIdlist: [data.studentId]
      }
      this.dialogChangeTeacher = true
      that.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/selectStuTransactionList',
        data: senddata
      })
      .then(data => {
        if (data.data.data && data.data.data.length > 0) {
          that.transactionData = data.data.data[0]
          that.transactionData.transactionDate = !that.transactionData.transactionDate ? '' : that.$api.getDateAll(that.transactionData.transactionDate, '-')
        }
        console.log(data)
      })
      .then(err => {
        console.log(err)
      })
    },
    searchData () {
      let senddata = {
        'statisticsStratDate': this.startDate,
        'statisticsEndDate': this.endDate
      }
      this.getData(senddata)
    }
  }
}
