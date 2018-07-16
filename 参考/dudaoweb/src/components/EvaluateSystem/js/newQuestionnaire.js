export default {
  data () {
    return {
      dialogVisible: false, // 弹出框
      saveDialogVisible: false,
      editDialogVisible: false,
      multiDialogVisible: false,
      previewDialogVisible: false,
      previewlistDialog: false,
      flag: 0,
      topicList: [], // 所有题目列表
      batchList: '', // 批量添加题目
      newbatchList: [],
      topic: { // 所有的内容
        questionnaireId: null,
        schoolCode: null,
        questionnaireTitle: '',
        questionnaireIsRealname: 0, // 不记名问卷
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
      filterText: '', // 搜索树节点
      treeData: [],
      defaultProps: {
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
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    // 题目列表变动(新增,调序,删除),重新设置序号
    topicList: { // 监听数组变化，实现增加的时候修改题目顺序
      handler (newValue, oldValue) {
        let myindex = 1
        if (this.topicList) {
          this.topicList.forEach((val) => {
            if (val.subjectType !== 5) {
              val.arg1 = myindex
              myindex++
            }
          })
        }
      },
      deep: true
    },
    topic: { // 监听对象topic变化，新值==旧值没做任何编辑
      handler (newValue, oldValue) {
        this.flag = 1
      },
      deep: true
    }
  },
  methods: {
    refresh () {
      let questionnaireId = null
      let sourceHtml = this.getUrlParameter('sourceHtml')
      // 获取树数据
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/availableRanges',
        data: {
          'questionnaireIds': null
        }
      }).then((re) => {
        this.treeData = re.data.list
      }).catch((err) => {
        this.$message.error(err)
      })
      // 编辑:从后端获取数据
      if (sourceHtml === 'QuestRecord') {
        questionnaireId = sessionStorage.getItem('questionnaireId')
        this.$ajax({
          method: 'POST',
          url: 'feedback/question/selectQuesBatch',
          data: {
            'questionnaireIds': [questionnaireId]
          }
        }).then((re) => {
          this.topic = Object.assign({}, re.data.data[0])
          this.topicList = re.data.data[0].subjectList
          // 判断问卷范围
          // let isReal=this.topic.questionnaireIsRealname===0?"0":"1" //0是不实名，1是实名
          // 是否实名
          this.$set(this.topic, 'isRealName', this.topic.questionnaireIsRealname === 0 ? '0' : '1')
          // 是否分享
          this.$set(this.topic, 'isShareType', this.topic.isShare === 1)
          // 是否匿名
          this.$set(this.topic, 'isQrcodeType', this.topic.isQrcode === 1)
          if (this.topicList) {
            this.topicList.forEach((val, key) => {
              this.$set(this.topicList[key], 'subjectIsOptiontype', val.subjectIsOption === 1)
            })
          }
          let idArr = []
          if (this.topic.ranges) {
            this.topic.ranges.forEach(val => { // 树默认选中
              idArr.push(val.userId)
            })
          }

          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(idArr, true)
          })
        }).catch((err) => {
          this.$message.error('错误提示:' + err)
        })
      }
    },
    saveQuestion () {
      this.$set(this.topic, 'subjectList', this.topicList)

      // 保存问卷
      let tipMsg = ''
      // 是否填写完整问卷信息
      if (this.topic.questionnaireTitle === '') {
        tipMsg += '阅卷标题不能为空'
      }
      if (this.topic.questionnaireTitle.length > 20) {
        tipMsg += '阅卷标题最多为20字'
      }
      if (this.topic.questionnaireExplain.length > 500) {
        tipMsg += '阅卷说明最多填写500字'
      }
      // 修改bug不需要添加题目
      // if (this.topic.subjectList.length <= 0) {
      //   this.$message.error('请至少填写一个题目')
      //   return false
      // }

      this.topic.subjectList.forEach((val) => {
        if (val.subjectType === 5) {
          // 段落说明
          if (val.subjectTitle === '') {
            tipMsg += '段落说明未填写'
          }
        } else {
          if (val.subjectTitle === '') {
            tipMsg += val.arg1 + ':标题未填写'
          }
        }
        if (val.subjectType === 2) {
          // 单选题和多选题选项判断
          val.answerList.forEach((o) => {
            if (o.subjectTitle === '') {
              tipMsg += val.arg1 + ':选项未填写'
            }
          })
        }
      })

      if (tipMsg !== '') {
        this.$message.error('错误提示 :' + tipMsg)
        return false
      }
      // 检查是否选择人
      let getNodes = []
      getNodes = this.$refs.tree.getCheckedNodes()
      if (getNodes.length <= 0) {
        this.$message.error('错误提示：请选择填写人')
        return false
      }
      this.topic.ranges = []
      getNodes.forEach((val) => {
        // 应该要判断一下
        if (val.isParent !== 1) {
          let obj = {
            'userId': val.userId,
            'userType': val.userType
          }
          this.topic.ranges.push(obj)
        }
      })

      // 把实名匿名转换
      this.topic.isQrcode = this.topic.isQrcodeType === true ? 1 : 0 // 二维码
      this.topic.isShare = this.topic.isShareType === true ? 1 : 0 // 是否分享
      this.topic.questionnaireIsRealname = this.topic.isRealName === '1' ? 1 : 0 // 是否匿名

      console.log(this.topic.subjectList)
      this.topic.subjectList.forEach((val) => {
        val.subjectIsOption = val.subjectIsOptiontype === true ? 1 : 0
      })
      // 保存数据
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/add',
        data: this.topic
      }).then((re) => {
        if (re.data.code > 0) {
          // this.saveDialogVisible = true
          this.$message.success('保存成功')
          this.goList()
        } else {
          this.$message.error(re.data.desc)
        }
      }).catch((err) => {
        this.$message.error('接口错误:' + err)
      })
    },
    goList () {
      this.$router.push({
        path: '/EvaluateSystem/questionnaireSurvey'
      })
    },
    cancleSave () {
      // 保存问卷
      if (this.flag === 0) {
        // 没有做任何编辑
        this.$router.push({
          path: '/EvaluateSystem/questionnaireSurvey'
        })
      } else {
        this.editDialogVisible = true
      }
    },
    confirm () { // 确定取消，清空对象，回到列表页面
      // 怎么清空对象
      // this.$set(this.topic,{})
      this.$router.push({
        path: '/EvaluateSystem/questionnaireSurvey'
      })
    },
    addQuestionDialog () {
      // 显示批量添加弹出框
      this.multiDialogVisible = true
    },
    addQuestionList () {
      // 批量添加题目   产品说不用判空
      // if (this.batchList.length <= 0) {
      //   this.$message.error('批量添加题目为空')
      //   return false
      // }
      if (this.batchList.length <= 0) {
        this.multiDialogVisible = false
        return false
      }
      this.newbatchList = this.batchList.split('\n')
      let newTitle = ''
      let newObejct = {}
      let newArry = []
      // 循环出题目标题
      this.newbatchList.forEach((val, key) => {
        if (val.indexOf('单选题') > 0) {
          // 如果是单选题
          newTitle = val.replace('[单选题]', '') // 去掉后面的[单选题]
          newObejct = {
            'len': key,
            'type': 1,
            'title': newTitle,
            'answerList': []
          }
          newArry.push(newObejct)
        }
        if (val.indexOf('多选题') > 0) {
          // 如果是多选题
          newTitle = val.replace('[多选题]', '') // 去掉后面的[单选题]
          newObejct = {
            'len': key,
            'type': 2,
            'title': newTitle,
            'maxSelect': 2, // 修改bug 最多添加
            'answerList': []
          }
          newArry.push(newObejct)
        }
        if (val.indexOf('填空题') > 0) {
          // 如果是单选题
          newTitle = val.replace('[填空题]', '') // 去掉后面的[单选题]
          newObejct = {
            'len': key,
            'type': 3,
            'title': newTitle,
            'answerList': []
          }
          newArry.push(newObejct)
        }
        if (val.indexOf('评分题') > 0) {
          // 如果是评分题
          newTitle = val.replace('[评分题]', '') // 去掉后面的[单选题]
          newObejct = {
            'len': key,
            'type': 4,
            'title': newTitle,
            'answerList': [],
            'maxSelect': 100
          }
          newArry.push(newObejct)
        }
        if (val.indexOf('段落说明') > 0) {
          // 如果是段落说明
          newTitle = val.replace('[段落说明]', '') // 去掉后面的[单选题]
          newObejct = {
            'len': key,
            'type': 5,
            'title': newTitle,
            'answerList': []
          }
          newArry.push(newObejct)
        }
      })

      // 循环出选项
      newArry.forEach((val, key) => {
        for (let i = val.len + 1; i < 100; i++) {
          if (!this.newbatchList[i] || this.newbatchList[i] === '') {
            return false
          }
          let newAnswer = {
            'questionAnswer': this.newbatchList[i]
          }
          val.maxSelect = this.newbatchList[i].length
          val.answerList.push(newAnswer)
        }
      })
      newArry.forEach((val, key) => {
        if (val.type > 2) {
          val.answerList = []
        }
        let publish = {
          'subjectType': val.type,
          'subjectTitle': val.title,
          'subjectIsOption': 0,
          'maxSelect': val.maxSelect,
          'answerList': val.answerList
        }
        this.topicList.push(publish)
        this.$message.success('批量添加成功')
        // 清空数据
        this.batchList = ''
        this.multiDialogVisible = false
      })
    },
    slViewFun () {
      this.previewDialogVisible = true
    },
    preview () {
      // 预览问卷
      this.previewlistDialog = true
    },
    deleteItem () {},
    addTopic (value) {},
    // 树节点操作
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys () {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes () {
      this.$refs.tree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys () {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleChange () {
      // 计数器
    },
    getUrlParameter (field) { // 获取网址上参数
      let GET = {}
      let canshu = window.location.hash.split('?')[1] == undefined ? '' : window.location.hash.split('?')[1]
      if (canshu !== '') {
        let strarr = canshu.split('&')
        for (let i = 0; i < strarr.length; i++) {
          let xx = strarr[i]
          let mykey = xx.split('=')[0]
          let myvalue = xx.split('=')[1]
          GET[mykey] = myvalue
        }
      }
      return GET[field]
    },
    addTopic (type) {
      // 新增题目 type=1是单选题，2是多选题，3是填空题，4是打分，5是段落分明
      let newTopic = {
        arg1: null,
        maxSelect: null,
        subjectId: '',
        subjectIsOption: 0,
        subjectIsOptiontype: true, // 1是必选 ，0是不选
        subjectTitle: '',
        subjectType: type
      }
      if (type === 1 || type === 2) {
        this.$set(newTopic, 'answerList', [{
          'questionAnswer': ''
        }, {
          'questionAnswer': ''
        }])
      }
      if (type === 2) {
        newTopic.maxSelect = 2
      }
      if (type === 4) {
        newTopic.maxSelect = 10
      }
      this.topicList.push(newTopic)
    },
    // 所有题目的事件 包括题目的删除、题目上、下移动、 题目选项的增加、删除、上下移动、最多选项的 加、减
    topicsUp (index) { // 题目上移
      if (index === 0) {
        this.$message.error('已经是第一个题目，不能再往上移')
        return false
      }
      // es6 Object.assign()对象深拷贝
      // let copyData=Object.assign(this.topicList[k-1])
      // this.topicList[k-1]=this.topicList[k]
      // this.topicList[k]=copyData
      // console.log(this.topicList)

      // 要使用set方法,直接赋值是不可以的
      let copyData = Object.assign(this.topicList[index - 1])
      this.$set(this.topicList, [index - 1], this.topicList[index])
      this.$set(this.topicList, index, copyData)
    },
    topicsDown (index) { // 题目下移
      if (index === this.topicList.length - 1) {
        this.$message.error('已经是最后一个题目，不能再往下移')
        return false
      }
      let copyData = Object.assign(this.topicList[index + 1])
      this.$set(this.topicList, [index + 1], this.topicList[index])
      this.$set(this.topicList, index, copyData)
    },
    topicsDel (index) { // 题目删除
      this.topicList.splice(index, 1)
    },
    topicsAddMaxSelect (index) { // 题目最多选项的加
    //   if (this.topicList[index].maxSelect < this.topicList[index].answerList.length) {
    //     this.topicList[index].maxSelect += 1
    //   }
      this.topicList[index].maxSelect += 1
    },
    topicsDelMaxSelect (index) { // 题目最多选项的减
      if (this.topicList[index].maxSelect > 1) {
        this.topicList[index].maxSelect -= 1
      }
    },
    topicsAnswerListUp (index, index2) { // 题目选项上移
      let thisOption = this.topicList[index].answerList
      if (index2 === 0) {
        this.$message.error('已经上移到第一个选项，不能再上移')
        return false
      }
      let copyData = Object.assign(thisOption[index2 - 1])
      this.$set(thisOption, [index2 - 1], thisOption[index2])
      this.$set(thisOption, index2, copyData)
    },
    topicsAnswerListDown (index, index2) { // 题目选项下移
      let thisOption = this.topicList[index].answerList
      if (index2 === thisOption.length - 1) {
        this.$message.error('已经下移到最后一个选项，不能再往下移')
        return false
      }
      let copyData = Object.assign(thisOption[index2 + 1])
      this.$set(thisOption, [index2 + 1], thisOption[index2])
      this.$set(thisOption, index2, copyData)
    },
    topicsAnswerListAdd (index, index2) { // 题目选项增加
      let thisOption = this.topicList[index].answerList
      let newAnswer = {
        'questionnaireTitle': ''
      }
      // 创建一个新数组，并向其添加一个元素.splice(index,howmany,item1,.....,itemX)设置为 0，则不会删除项目
      thisOption.splice(index2 + 1, 0, newAnswer)
      // 设置多选题的最多选项
      this.topicList[index].maxSelect = this.topicList[index].answerList.length
    },
    topicsAnswerListDel (index, index2) { // 题目选项删除
      // 至少保留两个选项
      let thisOption = this.topicList[index].answerList
      if (thisOption.length > 2) {
        this.topicList[index].answerList.splice(index2, 1)
      } else {
        this.$message.error('至少要求保留两个选项，所以不可以再删除啦')
      }
      this.topicList[index].maxSelect = this.topicList[index].answerList.length
    }
  }
}
