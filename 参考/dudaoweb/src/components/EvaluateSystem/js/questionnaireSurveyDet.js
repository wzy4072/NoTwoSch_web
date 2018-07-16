export default{
  data () {
    return {
      questionnaireName: '', // 问卷名
      writeName: '', // 填写人名字
      topicList: []
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.refresh()
    })
  },
  methods: {
    refresh () {
     // this.topicList=JSON.parse(sessionStorage.getItem('listData'))
      this.$ajax({
        method: 'POST',
        url: 'feedback/questionStatistics/queryFillinResultByAttId',
        data: {'attendancerecordsId': this.$route.query.id}
      }).then((re) => {
        if (re.data.code > 0) {
          this.questionnaireName = re.data.data.questionnaireTitle
          this.writeName = re.data.data.createrName
          this.topicList = re.data.data.subjects
          this.topicList.forEach((el, key) => {
            if (el.subjectType === 1) {
              let obj = el.answers.filter(val => { return val.isSelect === 1 })
              el.answers.forEach(els => {
                els.radio = obj[0].answerId
              })
            }
            if (el.subjectType === 4) {
              el.answers.forEach(els => {
                els.answer = parseInt(els.answer)
              })
            }
          })
        } else {
          this.$message.error(re.data.desc)
        }
      }).catch((err) => {
        this.$message.error('接口错误:' + err)
      })
    },
    exportWordFun () { // 导出问卷
      this.YS.YS_jquery().then($ => {
        window.jQuery = $
        this.YS.YS_wordExport(() => {
          $('#questionnaire').wordExport(this.questionnaireName, {})
        })
      })
    },
    goBackFun () { // 返回
      this.$router.go(-1)
    }
  }
}
