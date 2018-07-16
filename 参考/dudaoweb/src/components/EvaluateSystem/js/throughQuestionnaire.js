export default{
  data () {
    return {
      topic: { // 所有的内容
        questionnaireId: null,
        schoolCode: null,
        questionnaireTitle: '',
        questionnaireIsRealname: 0,
        questionnaireIsRealnameType: false,
        questionnaireOutsideUrl: null,
        questionnaireStatu: null,
        questionnaireCode: null,
        questionnairePageviews: null,
        isShare: 1,
        isQrcodeType: true, // 默认勾选匿名防刷票二维码
        isQrcode: 1,
        isShareType: true, // 默认勾选分享
        questionnaireExplain: '',
        subjectList: this.topicList,
        ranges: [],
        isRealName: '1' // 是否显示实名
      },
      topicList: [],
      editDialogVisible: false,
      groupDialogVisible: false,
      filterText: '', // 树的搜索
      treeData: [],
      defaultProps: {// 数据项的配置
        children: 'list',
        label: 'name'
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.refresh()
    })
  },
  methods: {
    refresh () {
      let questionnaireId = null
      questionnaireId = this.getUrlVars()['questionnaireId']
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/selectQuesBatch',
        data: {'questionnaireIds': [questionnaireId]}
      }).then((re) => {
        if (re.data.code > 0) {
          this.topic = Object.assign([], re.data.data[0])
          this.topicList = re.data.data[0].subjectList
           // 是否实名
          this.$set(this.topic, 'isRealName', this.topic.questionnaireIsRealname === 0 ? '0' : '1')
          let _this = this
          if (this.topicList) {
            this.topicList.forEach((val, key) => {
              if (val.subjectType === 4) {
                let newMaxArry = []
                for (let i = 1; i <= val.maxSelect; i++) {
                  newMaxArry.push(i)
                }
                _this.$set(this.topicList[key], 'maxSelectArry', newMaxArry)
              }
            })
          }
          // this.$set(this.topicList,'maxSelectArry',newMaxArry)
          console.log(this.topicList)
        } else {
          this.$message.error(re.data.desc)
        }
      }).catch((err) => {
        this.$message.error('接口错误:' + err)
      })
      // 获取树数据
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/availableRanges',
        data: {'questionnaireIds': null}
      }).then((re) => {
        if (re.data.code > 0) {
          this.treeData = re.data.list
        }
      }).catch((err) => {
        this.$message.err(err)
      })
    },
    // 树节点操作
    getCheckedNodes () {
      let getNodes = this.$refs.tree.getCheckedNodes()
      let newArry = []
      getNodes.forEach(val => {
        if (val.isParent !== 1) {
          let obj = {
            'userId': val.userId,
            'userType': val.userType
          }
          newArry.push(obj)
        }
      })
      this.topic.ranges = newArry
       // 获取树数据
      this.$ajax({
        methods: 'POST',
        url: '/feedback/question/add',
        data: this.topic
      }).then((re) => {
        if (re.data.code > 0) {
          this.$message.success('添加人员成功')
          this.groupDialogVisible = false
        }
      }).catch((err) => {
        this.$message.err(err)
      })
    },
    getCheckedKeys () {
      // console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes () {
    },
    setCheckedKeys () {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    editQuestion () {
      // console.log(this.topic)
      if (this.topic.filled === 0 || this.topic.filled === null) {
        // 没人填写
        this.editDialogVisible = true
      } else if (this.topic.filled > 0) {
        this.groupDialogVisible = true
      }
    },
    editComfrim () {
      sessionStorage.setItem('questionnaireId', this.topic.questionnaireId)
      this.$router.push({
        path: '/EvaluateSystem/newQuestionnaire?sourceHtml=QuestRecord'
      })
    },
    getUrlVars () {
      var vars = [], hash
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=')
        vars.push(hash[0])
        vars[hash[0]] = hash[1]
      }
      return vars
    }

  }
}
