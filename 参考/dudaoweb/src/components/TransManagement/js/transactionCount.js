import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      dialogChangeTeacher: false,
      currentPage4: 1,
      size: 50,
      total: 0,
      activeWeidu: '1',
      activeName: 'first',
      date: [
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date()
      ],
      startDate: '',
      searchCoum: ['gradeName', 'zhuanban', 'zhuanru', 'zhuanchu', 'xiuxue', 'fuxue', 'tuixue'],
      endDate: this.$api.getDateAll(this.$api.time(), '-'),
      nowGrade: '',
      printOb: {
        pageNum: 1,
        title: '学生列表'
      },
      scrColumn: { // 表头（有筛选列模糊搜索字段）
        gradeName: { text: '年级', selected: true, align: 'center', field: 'gradeName' },
        zhuanban: { text: '转班', selected: true, field: 'zhuanban' },
        zhuanru: { text: '转入', selected: true, field: 'zhuanru' },
        zhuanchu: { text: '转出', selected: true, field: 'zhuanchu' },
        xiuxue: { text: '休学', selected: true, field: 'xiuxue' },
        fuxue: { text: '复学', selected: true, field: 'fuxue' },
        tuixue: { text: '退学', selected: true, field: 'tuixue' }
      },
      copyData: [],
      tableData: [],
      tableDataCopy: [],
      tagList: [],
      dialogTitle: '',
      input5: '',
      options: [],
      tableData9: []
    }
  },
  watch: {
    activeWeidu () {
      this.changeWeidu(this.activeWeidu)
    },
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
    this.getGradeAndClass()
    setTimeout(function () {
      var ele = document.getElementsByClassName('el-input__prefix')
      for (let i = 0; i < ele.length; i++) {
        ele[i].setAttribute('style', 'top:-4px;')
      }
    }, 5)
    setTimeout(function () {
      var ele = document.getElementsByClassName('el-input__prefix')
      for (let i = 0; i < ele.length; i++) {
        ele[i].setAttribute('style', 'top:-4px;')
      }
    }, 5)
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    //  分页的跳到当前页面
    handleCurrentChange (val) {
      this.currentPage4 = val || this.currentPage4
      this.tableData = this.copyData.slice(
        (this.currentPage4 - 1) * this.size,
        this.currentPage4 * this.size
      )
    },
    getData (senddata) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/stuTransactionNumStatistics',
        data: senddata
      })
      .then(data => {
        this.tableDataCopy = data.data.data.gradesMap
        let gradesMapObj = data.data.data.gradesMap
        let arr = []
        for (let i in gradesMapObj) {
          let obj = {
            'gradeName': i,
            'zhuanban': 0,
            'zhuanru': 0,
            'zhuanchu': 0,
            'xiuxue': 0,
            'fuxue': 0,
            'tuixue': 0
          }
          this.options.forEach(function (val, key) {
            if (i === val.label) {
              obj.gradeName = i + '(' + val.value + ')'
            }
          })
          for (let j in gradesMapObj[i]) {
            switch (j) {
              case '1':
                obj.zhuanban = gradesMapObj[i][j].length
                break
              case '2':
                obj.zhuanru = gradesMapObj[i][j].length
                break
              case '3':
                obj.zhuanchu = gradesMapObj[i][j].length
                break
              case '4':
                obj.xiuxue = gradesMapObj[i][j].length
                break
              case '5':
                obj.fuxue = gradesMapObj[i][j].length
                break
              case '6':
                obj.tuixue = gradesMapObj[i][j].length
                break
            }
          }
          arr.push(obj)
        }
        let objCount = {}
        arr.forEach((v, k) => {
          if (v.gradeName === '合计') {
            objCount = v
          }
        })
        arr = arr.filter((v, k) => {
          return v.gradeName !== '合计'
        })
        arr.push(objCount)
        let arr1 = JSON.parse(JSON.stringify(arr))
        this.copyData = arr1
        this.tableData = arr
      })
      .then(err => {
        console.log(err)
      })
    },
    getGradeAndClass () { // 获取年级班级
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/gradeClass/getGradeByKrten'
      })
      .then(data => {
        let opt = []
        let nowGradesList = []
        data.data.list.forEach(function (v, k) {
          opt.push({
            value: v.gradeCode,
            label: v.gradeName
          })
          nowGradesList.push(v.gradeCode)
        })
        that.options = opt
        that.nowGrade = nowGradesList
        let senddata = {
          statisticsStratDate: this.startDate,
          statisticsEndDate: this.endDate,
          gradeCodeList: nowGradesList
        }
        this.getData(senddata)
      })
      .then(err => {
        console.log(err)
      })
    },
    handleClick (tab, event) {
      let option = {
        color: ['#92d209', '#f9a022', '#ff4a43', '#2490ff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataZoom: {
          show: false,
          realtime: true,
          start: 0,
          end: 100,
          bottom: 10,
          height: 20
        },
        legend: {
          data: []
        },
        xAxis: {
          type: 'category',
          data: ['转班', '转入', '转出', '休学', '复学', '退学']
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      this.activeName = tab.name
      console.log(tab.name)
      if (tab.name === 'second') {
        let arr = []
        option.legend.data = []
        this.tableData.forEach(function (v, k) {
          if (v.gradeName && v.gradeName.indexOf('(')) {
            v.gradeNameStr = v.gradeName.split('(')[0]
          }
          arr.push(v.gradeNameStr)
          option.legend.data.push(v.gradeNameStr)
          let obj = {
            name: '',
            data: [],
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
          obj.name = v.gradeNameStr
          obj.data = [v.zhuanban, v.zhuanru, v.zhuanchu, v.xiuxue, v.fuxue, v.tuixue]
          option.series.push(obj)
        })
        option.yAxis.max = this.getMax(this.tableData[this.tableData.length - 1])
        this.tagList = arr
        setTimeout(() => {
          this.changeEcharts(option)
        }, 100)
      } else {
        this.activeWeidu = '1'
      }
    },
    changeEcharts (op) {
      this.YS.YS_echarts().then(echarts => {
        let mainecharts = echarts.init(this.$refs.main)
        mainecharts.setOption(op, true)
      })
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
    showDieg (str, index, data) { // 打开弹窗
      this.dialogChangeTeacher = true
      this.getCloumsData(str, data)
    },
    getCloumsData (str, data) { // 弹窗数据处理
      this.dialogTitle = data.gradeName
      switch (str) {
        case '1':
          this.dialogTitle = '转班'
          break
        case '2':
          this.dialogTitle = '转入'
          break
        case '3':
          this.dialogTitle = '转出'
          break
        case '4':
          this.dialogTitle = '休学'
          break
        case '5':
          this.dialogTitle = '复学'
          break
        case '6':
          this.dialogTitle = '退学'
          break
      }
      let grade = data.gradeName.split('(')[0]
      this.tableData9 = []
      for (let i in this.tableDataCopy) {
        if (grade === i) {
          if (str === 'gradeName') {
            let arr = []
            for (let j in this.tableDataCopy[i]) {
              this.tableDataCopy[i][j].forEach(function (v, k) {
                arr.push(v)
              })
            }
            this.tableData9 = this.sortArr(arr, 'className')
          } else {
            for (let j in this.tableDataCopy[i]) {
              if (j === str) {
                this.tableData9 = this.tableDataCopy[i][j]
              }
            }
          }
        }
      }
      if (this.tableData9 && this.tableData9.length > 0) {
        this.tableData9.forEach(function (v, k) {
          switch (v.transactionType) {
            case '1':
              v.transactionTypeStr = '转班'
              break
            case '2':
              v.transactionTypeStr = '转入'
              break
            case '3':
              v.transactionTypeStr = '转出'
              break
            case '4':
              v.transactionTypeStr = '休学'
              break
            case '5':
              v.transactionTypeStr = '复学'
              break
            case '6':
              v.transactionTypeStr = '退学'
              break
          }
        })
      }
    },
    sortArr (arr, sortStr) { // 班级排序
      // 排序函数（用以返回次序关系）
      let bySort = function () {
        return function (o, p) {  // p 是 o 的下一项
          let a = o[sortStr]
          let b = p[sortStr]
          if (isNaN(a)) {  // 非数字排序
            return a.localeCompare(b) // 用本地特定顺序来比较(支持中文)
          } else {
            if (a === b) {
              return 0
            } else {
              return a > b ? 1 : -1
            }
          }
        }
      }
      for (let i = 0; i < arr.length; i++) {
        arr.sort(bySort(arr[i][sortStr]))
      }
      return arr
    },
    changeWeidu (v) {
      let that = this
      let option = {
        color: ['#92d209', '#f9a022', '#ff4a43', '#2490ff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
        },
        dataZoom: {
          show: false,
          realtime: true,
          start: 0,
          end: 100,
          bottom: 10,
          height: 20
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      that.activeWeidu = v
      if (v == 1) {
        option.legend.data = that.tagList
        option.xAxis.data = ['转班', '转入', '转出', '休学', '复学', '退学']
        that.tableData.forEach(function (v, k) {
          let obj = {
            name: '',
            data: [],
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
          obj.name = v.gradeNameStr
          obj.data = [v.zhuanban, v.zhuanru, v.zhuanchu, v.xiuxue, v.fuxue, v.tuixue]
          option.series.push(obj)
          option.yAxis.max = that.getMax(that.tableData[that.tableData.length - 1])
        })
      } else {
        option.xAxis.data = that.tagList
        option.legend.data = ['转班', '转入', '转出', '休学', '复学', '退学']
        option.legend.data.forEach(function (v, k) {
          let obj = {
            name: '',
            data: [],
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
          obj.name = v
          that.tableData.forEach(function (val, key) {
            switch (v) {
              case '转班':
                obj.data.push(val.zhuanban)
                break
              case '转入':
                obj.data.push(val.zhuanru)
                break
              case '转出':
                obj.data.push(val.zhuanchu)
                break
              case '休学':
                obj.data.push(val.xiuxue)
                break
              case '复学':
                obj.data.push(val.fuxue)
                break
              case '退学':
                obj.data.push(val.tuixue)
                break
            }
          })
          option.series.push(obj)
          option.yAxis.max = that.getMax(that.tableData[that.tableData.length - 1])
        })
      }
      setTimeout(() => {
        that.changeEcharts(option)
      }, 100)
    },
    getMax (data) {
      let arr = []
      for (let i in data) {
        if (i !== 'gradeName' && i !== 'gradeNameStr') {
          arr.push(parseInt(data[i]))
        }
      }
      arr.sort((a, b) => a - b)
      let max = arr[arr.length - 1]
      return max + 5
    },
    queryBtn () {
      let senddata = {
        statisticsStratDate: this.startDate,
        statisticsEndDate: this.endDate,
        gradeCodeList: this.nowGrade
      }
      this.getData(senddata)
      if (this.activeName === 'second') {
        this.changeWeidu(this.activeWeidu)
      }
    }
  }
}
