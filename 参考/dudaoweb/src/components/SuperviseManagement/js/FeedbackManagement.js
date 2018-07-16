import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      total: 0, // 数据总条数
      size: 20, // 每页数据条数
      currentPage: 1, // 当前页数
      tab: 'first',
      searchstr: '',
      fullscreenLoading: false,
      tableData: [], // table数据
      copyData: [], // table数据副本
      allData: [], // 核实中+已完结 所有数据
      scrColumn: {// 表头 fixField=>值固定字段
        feedbackTime: {text: '反馈时间', selected: true, field: 'feedbackTime'},
        fixField: {text: '反馈内容', selected: true, value: '查看'}, // 固定内容列
        trackCountStr: {text: '反馈跟踪', selected: true, field: 'trackCountStr'},
        krtenName: {text: '幼儿园名称', selected: true, field: 'krtenName'},
        workerName: {text: '姓名', selected: true, field: 'workerName'},
        workerGender: {text: '性别', selected: true, field: 'workerGender'},
        workerType: {text: '岗位', selected: true, field: 'workerType'},
        teaching: {text: '教学资历', selected: true, field: 'teaching'},
        highestEducation: {text: '最高学历', selected: true, field: 'highestEducation'},
        qualificationsName: {text: '相关证书', selected: true, field: 'qualificationsName'}
      },
      printOb: {// 打印所需
        pageNum: 1,
        title: '反馈记录表'
      },
      detailsData1: [
        { name: '姓名', value: '' },
        { name: '性别', value: '' },
        { name: '任教科目', value: '' },
        { name: '最高学历', value: '' }
      ],
      detailsData2: [],
      baseUrl: '',
      myFeedback: '', // 我的反馈内容
      currRow: {}, // 当前行数据
      showLayer1: false, // 是否显示证书弹框
      showLayer2: false, // 是否显示反馈内容弹框
      showLayer3: false, // 是否显示反馈跟踪弹框
      showLayer4: false  // 是否显示资历详情弹框
    }
  },
  mounted () { // 进页面默认执行方法
    this.baseUrl = this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url='
    this.getPageData()
  },
  methods: {
    getPageData () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'feedback/qualifications/feedbackAdminList'
      }).then((res) => {
        this.fullscreenLoading = false
        res.data.data.forEach(o => {
          o.teaching = ''
          let arg = new Date(o.arg1)
          let now = new Date()
          let chaYear = now.getFullYear() - arg.getFullYear()
          let chaMonth = now.getMonth() - arg.getMonth()
          if (chaMonth < 0) {
            chaYear -= 1
            chaMonth = 12 + chaMonth
          }
          if (chaYear > 0) {
            o.teaching = chaYear + '年'
          } if (chaMonth > 0) {
            o.teaching += chaMonth + '月'
          }
        })
        this.allData = Object.assign([], res.data.data)
        var that = this
        // 转换时间+图片字符串+消息条数
        this.allData.forEach(function (element, index) {
          element.trackCountStr = !element.trackCount ? '查看' : (element.trackCount + '条新消息')
          element.feedbackTime = that.$api.getDateAll(element.feedbackTime, '-', 'hm')
          element.tracks.forEach(function (item, index) {
            item.createTime = that.$api.getDateAll(item.createTime, '-', 'hms')
          })
        })
        // 筛选 核实中 or 已完结 数据
        this.copyData = this.allData.filter(function (val) {
          return val.feedbackStatus === (that.tab === 'first' ? '核实中' : '已完结')
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
      this.tableData = this.allData.slice(
                    (this.currentPage - 1) * this.size,
                    this.currentPage * this.size
                )
    },
    submitFeedback () { // 提交反馈
      if (!this.myFeedback.trim()) {
        this.$message.error('请输入反馈内容')
        return false
      }
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'feedback/qualifications/addFeedbackTrack',
        data: {
          'feedbackId': this.currRow.feedbackId,
          'trackContent': this.myFeedback
        }
      }).then((res) => {
        this.fullscreenLoading = false
        if (res.data.code > 0) {
          this.$message.success('反馈成功')
          this.showLayer3 = false
          this.getPageData()
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    picture (url) { // 图片点击原图
      window.open(this.baseUrl + url.slice(1))
    },
    openLayer (row, type) { // type 1：证书图片
      this.currRow = row
      if (type === 1) {
        if (row.qualifications.length) {
          this.showLayer1 = true
        } else {
          this.$message.warning('没有证书图片')
          this.showLayer1 = false
        }
      } else if (type === 2) {
        this.showLayer2 = true
      } else if (type === 3) {
        if (this.currRow.trackCount) {
            // 更新反馈跟踪
          this.fullscreenLoading = true
          this.$ajax({
            method: 'post',
            url: 'feedback/qualifications/updateFeedbackTrack?feedbackId=' + this.currRow.feedbackId
          }).then((res) => {
            this.fullscreenLoading = false
            this.currRow.trackCount = 0
            this.myFeedback = ''
            this.showLayer3 = true
          })
        } else {
          this.myFeedback = ''
          this.showLayer3 = true
        }
      } else if (type === 4) {
        this.detailsData2.length = 0
        row.qualifications.forEach((element, index) => {
          this.detailsData2.push({
            type: element.type,
            name: element.name
          })
        })
        this.detailsData1[0].value = row.workerName
        this.detailsData1[1].value = row.workerGender
        this.detailsData1[2].value = row.courseName
        this.detailsData1[3].value = row.highestEducation
        this.showLayer4 = true
      }
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return Object.values(this.scrColumn).filter((item) => {
          return item.selected
        }).some(d => {
          return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
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
