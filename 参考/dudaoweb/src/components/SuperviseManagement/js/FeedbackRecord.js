import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      barNameArr: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      tableData: [],
      copyData: [],
      searchstr: '', // 当前输入
      scrColumn: {
        workerName: { text: '姓名', selected: true, field: 'workerName' },
        workerGender: { text: '性别', selected: true, field: 'workerGender' },
        workerType: { text: '岗位', selected: true, field: 'workerType' },
        teaching: { text: '教学资历', selected: true, field: 'teaching' },
        highestEducation: { text: '最高学历', selected: true, field: 'highestEducation' },
        qualificationsName: { text: '相关证书', selected: true, field: 'qualificationsName' },
        feedbackTime: { text: '反馈时间', selected: true, field: 'feedbackTime' },
        fixField: { text: '反馈内容', selected: true, value: '查看' },
        feedbackStatus: { text: '反馈状态', selected: true, field: 'feedbackStatus' },
        trackCountStr: { text: '反馈跟踪', selected: true, field: 'trackCountStr' }
      },
      printOb: {
        // 打印所需
        pageNum: 1,
        title: '反馈记录表'
      },
      baseUrl: '',
      currRow: {}, // 当前行数据
      Personal: false, // 个人详情弹窗
      endContent: false, // 已完结内容弹窗
      Record: false, // 反馈跟踪记录弹窗
      dialogVisible: false,
      deleteDialog: false, // 删除对话框
      information: false, // 查看反馈内容弹窗
      textarea: '', // 查看反馈内容
      text: '', // 提交记录反馈输入
      cuont_index: [], // 存储人员feedbackId
      showpic: false,
      detailsData: [
        { name: '姓名', value: '' },
        { name: '性别', value: '' },
        { name: '任教科目', value: '' },
        { name: '最高学历', value: '' }
      ],
      gridData: [], // 个人详情证书表格内容
      tim: '', // 查看反馈内容时间
      dialogue: [],
      show: false, // 删除按钮
      End: false, // 完结按钮
      show1: [],
      feedbackId: '',
      checkTable: [] // 表格当前勾选项
    }
  },
  mounted () {
    this.baseUrl = this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url='
    // 进页面默认执行方法
    this.refresh()
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'feedback/qualifications/feedbackRecordList',
        data: {}
      })
        .then(res => {
          this.fullscreenLoading = false
          res.data.data.forEach(o => {
            if (o.arg1 === null) {
              o.teaching = ''
            } else {
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
              } else {
                o.teaching = ''
              }
              if (chaMonth > 0) {
                o.teaching += chaMonth + '月'
              }
            }
          })
          this.copyData = Object.assign([], res.data.data)
          // 处理数据
          this.copyData.forEach((item) => {
            item.feedbackTime = that.$api.getDateAll(item.feedbackTime, '-', 'hm')
            item.trackCountStr = !item.trackCount ? '查看' : (item.trackCount + '条新消息')
          })
          this.tableData = this.copyData.slice(0, this.size * 1)
          this.total = this.copyData.length
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
    check (selection) { // 表格勾选获取ID
      this.checkTable = selection
      this.show1 = []
      this.cuont_index = []
      if (selection.length) {
        selection.forEach((element, index) => {
          this.cuont_index.push(element.feedbackId)
          this.show1.push(element.feedbackStatus)
        })
      }
      for (let index = 0; index < this.show1.length; index++) { // 勾选类型都是已完结时，显示删除按钮
        if (this.show1[index] === '已完结') {
          this.show = true
        } else {
          this.show = false
          break
        }
      }
      for (let index = 0; index < this.show1.length; index++) { // 勾选类型都是核实中时，显示完结按钮
        if (this.show1[index] === '核实中') {
          this.End = true
        } else {
          this.End = false
          break
        }
      }
    },
    paper (row) { // 证书点击事件
      this.currRow = row
      this.showpic = true // 打开弹框
    },
    openLayer (type) { // 1:删除 2:完结
      if (!this.checkTable.length) {
        this.$message.warning('请先选择需要操作的数据')
        return false
      }
      if (type == 1) {
        if (this.show) {
          this.deleteDialog = true
        } else {
          this.$message.warning('只能删除已完结的反馈')
        }
      } else {
        if (this.End) {
          this.dialogVisible = true
        } else {
          this.$message.warning('只能完结核实中的反馈')
        }
      }
    },
    show2 (row) { // 表格名字点击事件
      if (row.qualifications !== null) {
        if (row.qualifications.length) {
          this.gridData.length = 0
          row.qualifications.forEach((element, index) => {
            var obj = {}
            obj.type = element.type
            obj.name = element.name
            this.gridData.push(obj)
          })
        }
      }
      this.detailsData[0].value = row.workerName
      this.detailsData[1].value = row.workerGender
      this.detailsData[2].value = row.courseName
      this.detailsData[3].value = row.highestEducation
      this.Personal = true
    },
    picture (url) { // 图片点击原图
      window.open(this.baseUrl + url.slice(1))
    },
    details (val) { // 表格反馈内容查看点击
      this.textarea = val.feedbackContent
      this.tim = this.$api.getDateAll(val.feedbackTime, '-', 'hm')
      this.information = true
    },
    Track (val) { // 反馈已完结查看事件
      this.text = ''
      this.dialogue.length = 0
      val.tracks.forEach((element, index) => {
        element.createTime = this.$api.getDateAll(element.createTime, '-', 'hms')
        this.dialogue.push(element)
      })
      if (val.feedbackStatus === '核实中') { // 根据反馈状态打开窗口
        this.cuont_index.length = 0
        this.cuont_index.push(val.feedbackId)
        this.feedbackId = val.feedbackId
        // 更新反馈跟踪状态接口
        this.fullscreenLoading = true
        this.$ajax({
          method: 'POST',
          url: 'feedback/qualifications/updateFeedbackTrack?feedbackId=' + this.feedbackId,
          data: {}
        })
          .then(res => {
            this.fullscreenLoading = false
            if (res.data.code > 0) {
            } else {
              this.$message.error(res.data.desc)
            }
          })
        this.Record = true
        val.trackCount = 0
      } else {
        this.endContent = true
      }
    },
    Submit () { // 反馈完结确认
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'feedback/qualifications/updateFeedback?feedbackIds=' + this.cuont_index,
        data: {}
      })
        .then(res => {
          this.fullscreenLoading = false
          this.$message.success('完结成功')
          this.Record = false
          this.dialogVisible = false
          this.refresh()
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    Submit1 () { // 点击提交反馈
      if (this.text === '') {
        this.$message.warning('提交失败，没有填写提交内容')
        return false
      }
      var obj = {
        'feedbackId': this.feedbackId,
        'trackContent': this.text
      }
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'feedback/qualifications/addFeedbackTrack',
        data: obj
      })
        .then(res => {
          this.fullscreenLoading = false
          this.$message.success('提交成功')
          this.Record = false
          this.refresh()
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    delet () { // 删除按钮
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'feedback/qualifications/deleteFeedback?feedbackIds=' + this.cuont_index,
        data: {}
      })
        .then(res => {
          this.fullscreenLoading = false
          this.$message.success('删除成功')
          this.deleteDialog = false
          this.refresh()
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
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
