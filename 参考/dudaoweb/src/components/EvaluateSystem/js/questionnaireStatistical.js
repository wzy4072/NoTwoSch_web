import tableBar from '@/common/components/tableBar'
export default{
  components: {
    tableBar
  },
  data () {
    return {
      token: '', // token 信息
      activeName: '0',
      printOb: {}, // 表格打印对象
      scrColumn: [], // 表头数据
      isFilterIp: true, // 是否过滤ip
      questionnaireList: [], // 问卷名称列表
      checkVdoing: null, // 选中统计维度数据id
      vdoingList: [// 统计维度
        {id: null, name: '请选择统计维度'},
        {id: 0, name: '系统内外数据'},
        {id: 1, name: '各幼儿园统计'},
        {id: 2, name: '问卷回答人员分组'},
        {id: 3, name: '各用户类型统计'},
        {id: 4, name: '各性别统计'},
        {id: 5, name: '各年级统计'},
        {id: 6, name: '各班级统计'},
        {id: 7, name: '各年级教职工统计'},
        {id: 8, name: '各年级学生统计'},
        {id: 9, name: '各班级教职工统计'},
        {id: 10, name: '各班级学生统计'}
      ],
      checkSpecificOption: [], // 选中具体维度列表
      specificOptionList: [], // 具体维度列表
      gradeList: [], // 年级列表
      classList: [], // 班级列表
      displayFormatList: [// 显示形式
        {id: 1, name: '饼形汇总图'},
        {id: 2, name: '堆积条形图'}
      ],
      isShowPict: true, // 是否显示图形
      subjectList: [], // 自定义筛选条件 问题列表
      containsList: [ // 自定义筛选条件 包含不包含
        {id: 1, name: '包含'},
        {id: 2, name: '不包含'}
      ],
      questionnaireName: '', // 问卷名字
      gatherQuestionList: [], // 饼形汇总图  问卷题目答案列表
      colTabTheadList: [], // 堆积柱状图  问卷题目表格表头
      columnarQuestionList: [], // 堆积柱状图  问卷题目答案列表
      detailedAnswerList: [], // 题目详细答案列表
      dialogVisible: false,
      tableColumn: [], // 表头数据
      tableData: [], // 表格数据
      multipleSelection: [], // 表格check数据
      requestData: {// 接口请求数据
        'questionnaireId': null, // 问卷id
        'requestType': null, // 显示形式
        'screens': [],
        'requestUrl': 'party'
      }
    }
  },
  computed: {
    questionnaireId () {
      return this.requestData.questionnaireId
    },
    requestType () {
      return this.requestData.requestType
    }
  },
  watch: {
    checkVdoing (cur, old) {
      switch (cur) {
        case 0:
          this.checkSpecificOption = []
          this.specificOptionList = [{'id': 0, 'name': '系统外数据'}, {'id': 1, 'name': '系统内数据'}]
          break
        case 1:
          this.checkSpecificOption = []
          this.$ajax({
            method: 'GET',
            url: 'baseInfo/infoManage/selectKindergapten'
          }).then(re => {
            this.specificOptionList = re.data.list
          }).catch(err => {
            this.$message.error('接口异常' + err)
          })
          break
        case 2:// 人员分组
          this.checkSpecificOption = []
          this.$ajax({
            method: 'POST',
            url: 'feedback/questionGroup/selectGroupList'
          }).then(re => {
            this.specificOptionList = re.data.list
          }).catch(err => {
            this.$message.error('接口异常' + err)
          })
          break
        case 3:
          this.checkSpecificOption = []
          this.specificOptionList = [
            {'id': 1, 'name': '超级管理员'},
            {'id': 2, 'name': '督导管理员'},
            {'id': 3, 'name': '园区管理员'},
            {'id': 4, 'name': '督学'},
            {'id': 5, 'name': '教职工'},
            {'id': 6, 'name': '家长'}
          ]
          break
        case 4:
          this.checkSpecificOption = []
          this.specificOptionList = [
            {'id': 0, 'name': '女'},
            {'id': 1, 'name': '男'}
          ]
          break
        case 5:
          this.checkSpecificOption = []
          this.specificOptionList = this.gradeList
          break
        case 6:
          this.checkSpecificOption = []
          this.specificOptionList = this.classList
          break
        case 7:
          this.checkSpecificOption = []
          this.specificOptionList = this.gradeList
          break
        case 8:
          this.checkSpecificOption = []
          this.specificOptionList = this.gradeList
          break
        case 9:
          this.checkSpecificOption = []
          this.specificOptionList = this.classList
          break
        case 10:
          this.checkSpecificOption = []
          this.specificOptionList = this.classList
          break
        default:
          break
      }
    },
    questionnaireId (newValue, oldValue) {
      this.$ajax({// 获取题目答案列表
        method: 'POST',
        url: 'feedback/question/selectQues',
        data: {
          'questionnaireId': newValue
        }
      }).then(re => {
        this.subjectList = re.data.data.subjectList
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    },
    requestType (newValue, oldValue) {
      this.colTabTheadList = []
      this.gatherQuestionList = []
      this.columnarQuestionList = []
    }
  },
  mounted () {
    this.$ajax({// 获取问卷列表
      method: 'POST',
      url: 'feedback/question/selectQuesList',
      data: {}
    }).then(re => {
      this.questionnaireList = re.data.list
    }).catch(err => {
      this.$message.error('接口异常' + err)
    })
    this.$ajax({// 年级班级列表
      method: 'GET',
      url: 'baseInfo/gradeClass/getGradeByKrten'
    }).then(re => {
      this.gradeList = re.data.list
      re.data.list.forEach(value => {
        value.classList.forEach(res => {
          res.className = value.gradeName + res.className
          this.classList.push(res)
        })
      })
    }).catch(err => {
      this.$message.error('接口异常' + err)
    })
    this.token = {'authorization': sessionStorage.getItem('user_token')}
    window.onresize = () => {
      this.effectiveHeightFun()
    }
  },
  methods: {
    handleClick () {
      this.effectiveHeightFun()
    },
    effectiveHeightFun () { // 自动计算高度
      this.YS.YS_jquery().then($ => {
        if (this.activeName === '1') {
          let h = $('.ins-page-main').height() - 41
          $('.tab').css({'height': h + 'px'})
        } else if (this.activeName === '0') {
          let h1 = $('.ins-page-main').height() - 50 - $('.ins-page-other-search').height() - 20
          $('.questionnaire').css({'height': h1 + 'px'})
        }
      })
    },
    delFilterFun (index) { // 删除筛选条件
      this.$nextTick(() => {
        this.effectiveHeightFun()
      })
      this.requestData.screens.splice(index, 1)
    },
    addFilterFun () { // 添加筛选条件
      this.$nextTick(() => {
        this.effectiveHeightFun()
      })
      this.requestData.screens.push({
        'subjectId': null,
        'type': null,
        'answerId': null
      })
    },
    inquireFun () { // 查询数据
      if (!this.requestData.questionnaireId) {
        this.$message.error('请选择调查问卷')
        return false
      }
      this.effectiveHeightFun()
      // 初始化
      this.requestData.isSystems = null
      this.requestData.krtenCodes = null
      this.requestData.groupIds = null
      this.requestData.userTypes = null
      this.requestData.userSexs = null
      this.requestData.classCodes = null
      this.requestData.statisticsType = null
      this.colTabTheadList = []
      let processingDataFun = (code, value) => { // 形成统一属性的数组对象
        this.checkSpecificOption.forEach(re => {
          this.specificOptionList.forEach(val => {
            if (val[code] === re) {
              let obj = {}
              obj.id = val[code]
              obj.name = val[value]
              this.colTabTheadList.push(obj)
            }
          })
        })
      }
      switch (this.checkVdoing) { // 维度和具体统计
        case 0:
          this.requestData.isSystems = this.checkSpecificOption
          processingDataFun('id', 'name')
          break
        case 1:
          this.requestData.krtenCodes = this.checkSpecificOption
          processingDataFun('krtenCode', 'krtenName')
          break
        case 2:
          this.requestData.groupIds = this.checkSpecificOption
          processingDataFun('groupId', 'groupName')
          break
        case 3:
          this.requestData.userTypes = this.checkSpecificOption
          processingDataFun('id', 'name')
          break
        case 4:
          this.requestData.userSexs = this.checkSpecificOption
          processingDataFun('id', 'name')
          break
        case 5:
          this.requestData.classCodes = this.checkSpecificOption
          processingDataFun('gradeId', 'gradeName')
          break
        case 6:
          this.requestData.classCodes = this.checkSpecificOption
          processingDataFun('classId', 'className')
          break
        case 7:
          this.requestData.statisticsType = 10
          this.requestData.classCodes = this.checkSpecificOption
          processingDataFun('gradeId', 'gradeName')
          break
        case 8:
          this.requestData.statisticsType = 11
          this.requestData.classCodes = this.checkSpecificOption
          processingDataFun('gradeId', 'gradeName')
          break
        case 9:
          this.requestData.statisticsType = 10
          this.requestData.classCodes = this.checkSpecificOption
          processingDataFun('classId', 'className')
          break
        case 10:
          this.requestData.statisticsType = 11
          this.requestData.classCodes = this.checkSpecificOption
          processingDataFun('classId', 'className')
          break
        default:
          break
      }
      if (this.activeName === '0') { // 问卷报告  查询
        delete this.requestData.isFilterIP
        if (!this.requestData.requestType) {
          this.$message.error('请选择显示形式')
          return false
        }
        if (this.checkVdoing === null) {
          this.$message.error('请选择统计纬度')
          return false
        }
        if (!this.checkSpecificOption.length) {
          this.$message.error('请选择统计数据')
          return false
        }
        // 判断筛选条件是否完善
        let keepGoing = 1 // 完善
        if (this.requestData.screens.length > 0) {
          this.requestData.screens.forEach(re => {
            if (!re.subjectId || !re.type || !re.answerId) {
              this.$message.error('筛选答案不完善，请填写完善！')
              keepGoing = 0// 不完善
            }
          })
        }
        if (!keepGoing) { return false }

        this.$ajax({// 获取题目答案列表
          method: 'POST',
          url: 'feedback/questionStatistics/statisticsPicTable',
          data: this.requestData
        }).then(re => {
          if (this.requestData.requestType === 1) { // 饼形汇总图
            let key = ''
            for (let o in re.data.data) {
              if (re.data.data[o] === null) {
                delete re.data.data[o]
              } else {
                key = o
              }
            }
            this.questionnaireName = re.data.data[key].questionnaireTitle// 获取问卷名称
            this.gatherQuestionList = re.data.data[key].subjects
            this.YS.YS_echarts().then(echart => {
              this.gatherQuestionList.forEach((val, key) => {
                if (val.subjectType === 1 || val.subjectType === 2) {
                  val.answers.forEach(val1 => { // 生成图表数据格式
                    val1.name = val1.questionAnswer
                    val1.value = val1.ratio
                  })
                  // 生成图表
                  echart.init(document.getElementById('choicePieEchart' + key)).setOption({
                    tooltip: {
                      trigger: 'item',
                      formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: {
                      name: '答案',
                      type: 'pie',
                      data: val.answers,
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }
                  })
                }
              })
            })
          } else if (this.requestData.requestType === 2) { // 堆积柱状图
            let key = ''
            for (let o in re.data.data) {
              if (!re.data.data[o] === null) {
                delete re.data.data[o]
              } else {
                key = o
              }
            }
            this.questionnaireName = re.data.data[key].questionnaireTitle// 获取问卷名称
            let arr = []
            this.checkSpecificOption.forEach(index => { // 请求数据处理
              let obj = {}
              obj.key = index
              obj.response = re.data.data[index]
              arr.push(obj)
            })
            this.$ajax({// 堆积条形图数据转换
              method: 'POST',
              url: 'feedback/questionStatistics/accumulaionPicTable',
              data: arr
            }).then(re => {
              this.columnarQuestionList = re.data.list
              this.YS.YS_echarts().then(echart => { // 堆积柱状图数据处理及生成图表
                this.columnarQuestionList.forEach((val, key) => {
                  if (val.subjectType === 1 || val.subjectType === 2 || val.subjectType === 4) {
                    let seriesArr = []// 数据列表
                    let legendList = []// 图例列表
                    if (val.subjectType === 4) {
                      val.answers = [
                        {questionAnswer: '平均分'},
                        {questionAnswer: '求和'}
                      ]
                      val.answers.forEach(v => {
                        this.colTabTheadList.forEach(v1 => {
                          if (v.questionAnswer === '平均分') {
                            v[v1.id] = val.subjectData[v1.id].fillinCount
                          } else {
                            v[v1.id] = val.subjectData[v1.id].sum
                          }
                        })
                      })
                    }
                    this.colTabTheadList.forEach(v => {
                      let obj = {
                        type: 'bar',
                        stack: '总量',
                        data: []
                      }
                      obj.name = v.name
                      val.answers.forEach((v1, k1) => {
                        legendList.push(v1.questionAnswer)
                        if (val.subjectType !== 4) {
                          obj.data.push(v1.answerData[v.id] ? v1.answerData[v.id].selectCount : '')
                        } else {
                          obj.data.push(v1[v.id] ? v1[v.id] : '')
                        }
                      })
                      seriesArr.push(obj)
                    })
                    // 生成堆积柱状图
                    echart.init(document.getElementById('choiceBarEchart' + key)).setOption({
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                      },
                      legend: {
                        data: this.colTabTheadList.map(re => re.name)
                      },
                      xAxis: {
                        type: 'value'
                      },
                      yAxis: {
                        type: 'category',
                        data: legendList
                      },
                      series: seriesArr
                    })
                  }
                })
              })
            }).catch(err => {
              this.$message.error('接口异常' + err)
            })
          }
        }).catch(err => {
          this.$message.error('接口异常' + err)
        })
      } else if (this.activeName === '1') { // 回答详情   查询
        delete this.requestData.requestType
        this.requestData.isFilterIP = this.isFilterIp ? 1 : 0
        this.$ajax({
          method: 'POST',
          url: 'feedback/questionStatistics/selectAnswerDetails',
          data: this.requestData
        }).then(re => {
          this.tableColumn = []
          for (const key in re.data.data.cols) {
            let obj = {}
            obj.index = key
            obj.value = re.data.data.cols[key]
            this.tableColumn.push(obj)
          }
          this.tableData = re.data.data.rows
        }).catch(err => {
          this.$message('接口异常' + err)
        })
      }
    },
    detailedAnswerFun (id) { // 填空和打分题回答详情
      let obj = {}
      obj.subjectId = id
      obj.requestType = this.requestData.requestType
      obj.requestUrl = this.requestData.requestUrl
      obj.statisticsType = this.requestData.statisticsType
      obj.isSystems = this.requestData.isSystems
      obj.groupIds = this.requestData.groupIds
      obj.userTypes = this.requestData.userTypes
      obj.userSexs = this.requestData.userSexs
      obj.classCodes = this.requestData.classCodes
      obj.krtenCodes = this.requestData.krtenCodes
      this.$ajax({// 获取题目详细答案
        method: 'POST',
        url: 'feedback/questionStatistics/selectSubjectAnswer',
        data: obj
      }).then(re => {
        this.detailedAnswerList = re.data.data
        this.detailedAnswerList.forEach(res => {
          res.submitTime = this.$api.getDateAll(res.createDate, '-', 'hms')
        })
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
      this.dialogVisible = true
    },
    handleSelectionChange (val) { // 回答详情 checkBox勾选事件
      this.multipleSelection = val
    },
    batchRemoveFun () { // 回答详情 批量删除
      let arr = []
      this.multipleSelection.forEach(re => {
        arr.push(re.attendancerecordsId)
      })
      this.$ajax({
        method: 'POST',
        url: 'feedback/questionStatistics/deleteFillinResultByAttId',
        data: arr
      }).then(re => {
        for (let index = this.tableData.length - 1; index >= 0; index--) {
          this.multipleSelection.forEach(v => {
            if (this.tableData[index].attendancerecordsId === v.attendancerecordsId) {
              this.tableData.splice(index, 1)
            }
          })
        }
        this.$message.success('删除成功!')
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    },
    examineFun (id) { // 回答详情表格操作 查看 具体的回答详情
      this.$router.push({path: 'questionnaireSurveyDet', query: { id: id }})
    },
    delAnswerFun (id, index) { // 回答详情表格操作 单个删除回答详情
      this.$ajax({
        method: 'POST',
        url: 'feedback/questionStatistics/deleteFillinResultByAttId',
        data: [id]
      }).then(re => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功!')
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    }
  }

}
