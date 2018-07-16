export default {
  data () {
    return {
      getProcessArr: [],
      baseUrl: '',
      curprojectId: null, // 默认当前学年
      logList: [], // 日志列表
      krtenlist: [],
      logArr: [],
      logId: '',
      logIndex: 0,
      logDetail: {}
    }
  },
  mounted () {
    this.getProcess()
  },
  created () {
    this.baseUrl = this.$api.baseUrl
    this.getLoglist()
  },
  methods: {
    getProcess () {
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/selectProcesssspList'
      }).then(re => {
        this.getProcessArr = re.data.data
        if (this.getProcessArr) {
          this.curprojectId = this.getProcessArr[0].projectId
        }
      }).catch(err => {
        this.$message.error('错误提示：' + err)
      })
    },
    getLoglist () {
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/selectLogpList',
        data: {'projectId': this.curprojectId}
      }).then(re => {
        this.krtenlist = re.data.data.krtenlist
        this.logList = re.data.data.logs
        if (this.krtenlist) {
          this.krtenlist.forEach((val, key) => {
            this.$set(val, 'list', [])
            this.logList.forEach((data, index) => {
              if (val.krtenCode === data.krtenCode) {
                val.list.push(data)
              }
            })
          })
          this.logDetail = this.krtenlist[0].list[0].list[0]
          this.logArr = this.krtenlist[0]
        }
        console.log(this.krtenlist)
      })
    },
    addlog (data, type) {
      this.$set(data, 'logId', this.logId)
      this.$set(data, 'chooseIndex', this.logIndex)
      this.$set(data, 'projectId', this.curprojectId)
      sessionStorage.setItem('logDetail', JSON.stringify(data))
      this.$router.push({ path: 'creatLog', query: {type: type} })
    },
    changeItem (item, key) {
      this.logArr = item
      this.logDetail = Object.assign({}, this.logArr.list[0].list[key])
      this.logIndex = key
      this.logId = this.logDetail.logId
    }
  },
  watch: {
    curprojectId (newVal, oldVal) {
      this.getLoglist()
    }
  }
}
