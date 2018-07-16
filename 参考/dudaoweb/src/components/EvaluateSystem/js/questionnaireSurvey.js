import tableBar from '@/common/components/tableBar'
export default{
  components: { tableBar },
  data () {
    return {
      systemInner: true, // 默认是分享问卷给系统外用户
      dialogVisible: false, // 删除弹框不可见
      publishDialog: false, // 发布弹窗不可见
      shareDialog: false, // 分享弹框不可见
      searchstr: '', // 当前输入
      printOb: { // 打印所需
        pageNum: 1,
        title: '项目列表'
      },
      total: 0, // 总条目数
      size: 50, // 每页显示条目个数
      currentPage: 1, // 当前页面
      fullscreenLoading: false,
      tableData: [], // 表格list
      scrColumn: [// 表头
      { text: '创建时间', field: 'createrDate', selected: true },
      { text: '发布范围', field: 'publishRange', selected: true },
      { text: '填写人数', field: 'Proportion', selected: true },
      { text: '问卷浏览量', field: 'questionnairePageviews', selected: true },
      { text: '填写比例', field: 'percent', selected: true },
      { text: '平均填写时间', field: 'attendanceTime', selected: true },
      { text: '问卷状态', field: 'questionnaireStatus', selected: true }
      ],
      copyArry: [], // 复制的数组
      deleteArry: [], // 删除的数组
      downloadArry: [], // 下载的数组
      topic: [], // 导出word
      topicList: [], // 导出word
      getWordList: [], // 导出word
      publishArry: [], // 发布数组
      sharebdUrl: '' // 分享链接
    }
  },
  mounted () {
    this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
    this.$nextTick(function () {
      this.refresh()
    })
  },
  methods: {
    refresh () { // 刷新
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/selectQuesList',
        data: {}
      }).then((res) => {
        this.fullscreenLoading = false
        if (res.data.code > 0) {
          this.copydata = Object.assign([], res.data.list)
          this.tableData = this.copydata.slice(0, this.size * 1)
          this.total = res.data.list.length
          this.tableData.forEach((val) => {
                 //  自定义表格 内容
            val.createrDate = this.$api.getDateAll(val.createrDate, '-')
                 // 发布范围  系统内部人员 0-不分享
            if (val.isShare === 0) {
              val.publishRange = '仅系统内部用户'
            } else if (val.isShare === 1) {
              val.publishRange = '可对外分享'
            }
                // 问卷状态
            if (val.questionnaireStatus === 0) {
              val.questionnaireStatusTxt = '待发布'
            } else if (val.questionnaireStatus === 1) {
              val.questionnaireStatusTxt = '回收中'
            } else {
              val.questionnaireStatusTxt = '暂停回收'
            }
                // 填写比例
            val.Pnum = val.filled / val.totalNum * 100
            if (val.totalNum !== 0) {
              val.Pnum = val.Pnum.toFixed(2)
              val.percent = val.Pnum + '%'
            } else {
              val.percent = 0
            }
                // 填写人数
            if (val.isShare === 0 || val.isQrcode === 0) { // 系统内部人员 0-不分享
              val.systemInner = false
            } else {   // 系统外部人员
              val.systemInner = true
            }
          })
        } else {
          this.$message.error(res.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    searchFun () { // 搜索
      if (this.searchstr !== '') {
        this.fullscreenLoading = true
        let tempArr = []
        let that = this
        document.querySelectorAll('.el-table__body-wrapper table tr').forEach(function (tr, key) {
          tr.innerText.trim().replace(/\s/g, '').indexOf(that.searchstr) > -1 && tempArr.push(key)
        })
        this.tableData = this.tableData.filter((o, k) => {
          return tempArr.indexOf(k) > -1
        })
      } else {
        this.tableData = this.copydata
      }
      this.fullscreenLoading = false
    //   if (this.searchstr !== '') {
    //     this.fullscreenLoading = true
    //     this.tableData = this.copydata.filter(o => {
    //       return Object.keys(o).some(d => { // .some是循环 检索字符串是否存在
    //         if (o[d]) {
    //           return (typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
    //                         .searchstr) > -1
    //         }
    //       })
    //     })
    //   } else {
    //     this.tableData = this.copydata
    //   }
    //   this.fullscreenLoading = false
    //   this.total = this.tableData.length
    },
    addQuestion () { // 新建问卷
        // 跳转到新建问卷页面
      this.$router.push({
        path: '/EvaluateSystem/newQuestionnaire'
      })
    },
    addQuestionTwo () { // 新建副本 可同时复制多个文件
      if (!this.multipleSelection) { // 没有勾选文件
        this.$message.error('错误提示：请选择需要复制的问卷')
        return false
      }
      this.copyArry = this.multipleSelection.map((val) => {
        return val.questionnaireId
      })
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/copyQuestionnaire',
        data: {
          'questionnaireIds': this.copyArry
        }
      }).then((res) => {
        if (res.data.code > 0) {
          this.$message.success('复制成功')
          this.refresh()
        } else {
          this.$message.error(res.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    deleteShowdialog () {
      if (!this.multipleSelection) { // 没有勾选文件
        this.$message.error('错误提示：请选择需要删除的文件')
        return false
      }
      this.dialogVisible = true
    },
    deleteItem () { // 可同时删除多个文件
      this.deleteArry = this.multipleSelection.map((val) => { // 筛选出需要的字段组成新的数组
        return val.questionnaireId
      })
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/updateStatus',
        data: {
          'questionnaireIds': this.deleteArry,
          'questionnaireStatus': -1
        }
      }).then((res) => {
        if (res.data.code > 0) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.refresh()
                // for (let i = 0; i < this.tableData.length; i++) {
                //     for (let j = 0; j < this.deleteArry.length; j++) {
                //         if (this.tableData[i].questionnaireId === this.deleteArry[j]) {
                //             this.tableData.splice(i, 1)
                //         }
                //     }
                // }
        } else {
          this.$message.error(res.data.desc)
        }
      }).catch((err) => {
        this.$message.error('接口异常：' + err)
      })
    },
    downLoad () { // 下载 可同时下载多个文件
      if (!this.multipleSelection) { // 没有勾选文件
        this.$message.error('错误提示：请选择需要下载的文件')
        return false
      }
      this.downloadArry = this.multipleSelection.map((val) => { // 筛选出需要的字段组成新的数组
        return val.questionnaireId
      })
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/selectQuesBatch',
        data: {
          'questionnaireIds': this.downloadArry
        }
      }).then((re) => {
        if (re.data.code > 0) {
          let downLoadList = Object.assign([], re.data.data)
          downLoadList.forEach((value, key) => {
            this.topic = value
            this.topicList = value.subjectList
            this.$set(this.getWordList, [])
            this.getWordList.push({'questionnaireTitle': this.topic.questionnaireTitle, 'isbr': true})
            this.topicList.forEach((val) => {
                        // 区分题目类型(1.单选 2.多选 3.问答 4.分数 5.段落说明) subjectType
              if (val.subjectType === 1) { // 单选题
                this.getWordList.push({'questionnaireTitle': val.subjectTitle + '[单选题]', 'isbr': false})
              }
              if (val.subjectType === 2) {
                this.getWordList.push({'questionnaireTitle': val.subjectTitle + '[多选题]', 'isbr': false})
              }
              if (val.subjectType === 3) {
                this.getWordList.push({'questionnaireTitle': val.subjectTitle + '[填空题]', 'isbr': true})
              }
              if (val.subjectType === 4) {
                this.getWordList.push({'questionnaireTitle': val.subjectTitle + '[分数题]', 'isbr': true})
              }
              if (val.subjectType === 5) {
                this.getWordList.push({'questionnaireTitle': val.subjectTitle + '[段落说明]', 'isbr': true})
              }
                        // 答案
              if (val.answerList.length > 0) {
                val.answerList.forEach((item, key) => {
                  let answer = {'questionnaireTitle': item.questionAnswer, 'isbr': false}
                  if (key === val.answerList.length - 1) {
                    answer.isbr = true
                  }
                  this.getWordList.push(answer)
                })
              }
            })
          })
          this.$nextTick(function () {
                    // 引用导出word插件
            this.YS.YS_jquery().then($ => {
              window.jQuery = $
              this.YS.YS_wordExport(() => {
               // $('#wordPrint').wordExport(this.topic.questionnaireTitle, {})
                $('#wordPrint').wordExport('问卷', {})
              })
            })
          })
        }
      }).catch((err) => {
        this.$message.error('接口错误', err)
      })
    },
    handleSizeChange (val) { // 每页显示多少条
      this.size = val
      this.handleCurrentChange()
    },
    handleCurrentChange (val) { // 当前页
      this.currentPage = val || this.currentPage
      this.tableData = this.copydata.slice(
            (this.currentPage - 1) * this.size,
            this.currentPage * this.size
        )
    },
    handleSelectionChange (val) { // 当选择项发生变化时会触发该事件
      this.multipleSelection = val
      if (this.multipleSelection.length !== 0) {
        this.isDeleshow = true
      } else {
        this.isDeleshow = false
      }
    },
    checkSelectable (row) { // 第一个多选框
      return row
    },
    goThroughQues (val) { // 跳转到浏览问卷
   // sessionStorage.setItem('questionnaireId',JSON.stringify(val.questionnaireId))
      this.$router.push({
        path: '/EvaluateSystem/throughQuestionnaire?questionnaireId=' + val.questionnaireId
      })
    },
    publishShowdialog (id) { // 发布弹窗
      this.publishDialog = true
      this.publishArry.push(id)
    },
    publish () { // 发布
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/updateStatus',
        data: {
          'questionnaireIds': this.publishArry,
          'questionnaireStatus': 1 // 发布传1
        }
      }).then((res) => {
        if (res.data.code > 0) {
          this.$message.success('发布成功')
          this.publishDialog = false
          this.refresh()// 重新刷新列表
        }
      }).catch((err) => {
        this.$message.error('接口异常:' + err)
      })
    },
    start (id) { // 开始回收
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/updateStatus',
        data: {
          'questionnaireIds': [id],
          'questionnaireStatus': 1  // 开始传 1
        }
      }).then((res) => {
        if (res.data.code > 0) {
          this.$message.success('开始成功')
          this.refresh()// 重新刷新列表
        }
      }).catch((err) => {
        this.$message.error('接口异常:' + err)
      })
    },
    stop (id) { // 暂停回收
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/updateStatus',
        data: {
          'questionnaireIds': [id],
          'questionnaireStatus': 2 // 停止传2
        }
      }).then((res) => {
        if (res.data.code > 0) {
          this.$message.success('停止成功')
          this.refresh()// 重新刷新列表
        }
      }).catch((err) => {
        this.$message.error('接口异常:' + err)
      })
    },
    shareShowdialog (val) { // 分享
      this.shareDialog = true
      let hostUrl = window.location.host
      this.sharebdUrl = hostUrl + '/webpage/static/outSide/questFillInPc.html?questionnaireId=' + val.questionnaireId
    },
    copytxt () { // 分享复制按钮
      let d = document.getElementById('text')
      d.select()
      document.execCommand('Copy')
      this.$message.success('复制成功！')
      console.log('aa')
    },
    getCode (id) { // 二维码
      sessionStorage.setItem('codeId', id)
      this.$router.push({
        path: '/EvaluateSystem/qrcodeManage'
      })
    },
    setClass (Pnum) { // 动态添加class类名称
      var Pnumcss = '' // 不同百分比不同颜色
      if (Pnum <= 33) { Pnumcss = 'Pnumcss33' }
      if (Pnum > 33 && Pnum <= 66) { Pnumcss = 'Pnumcss66' }
      if (Pnum > 66 && Pnum < 100) { Pnumcss = 'Pnumcss99' }
      if (Pnum === 100) { Pnumcss = 'Pnumcss100' }
      return Pnumcss
    },
    writeSchedule (id) {
      this.$router.push({
        path: '/EvaluateSystem/writeSchedule',
        query: {id: id}
      })
    }
  }
}
