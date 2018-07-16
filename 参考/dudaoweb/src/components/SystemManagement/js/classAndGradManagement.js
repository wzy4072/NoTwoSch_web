import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      addDialog: false, // 添加年级对话框状态
      levelDialog: false, // 升级配置对话框
      editDialog: false, // 编辑对话框
      tabPosition: '常规年级',
      temp: false,
      addList: [{
        values: ''
      }],
      editList: [],
      data1: {
        'classId': 0,
        'className': ''
      },
      data: {
        values: ''
      },
      editData: {},
      classIdList: [],
      stuNumList: [],
      stuNum: 0,
      formLabelWidth: '80px',
      tableData: [],
      copyData: [],
      printOb: {
        pageNum: 1,
        title: '在校年级班级列表'
      },
      searchstr: '',
      classNameStr: [],
      option: [],
      option1: [],
      option2: [],
      classArr: [],
      classUpdataList: [],
      comLevUpType: 0,
      comLevUpStr: [],
      addNameSelect: '',
      value1: '',
      value2: '',
      value3: '',
      editNameSelect: '',
      value5: '',
      dictCode: '',
      btnType: 2,
      date2: '',
      total: 0,
      size: 50,
      input1: '',
      addCodeInput: '',
      editCodeInput: '',
      input3: '',
      tempArr: [],
      fullscreenLoading: true, // 加载样式
      currentPage: 1,
      searchFiledArr: ['gradeType', 'gradeName', 'gradeCode', 'classNameStr'], // 搜索字段
      length1: 0,
      v1: [],
      v2: 0,
      options: []
    }
  },
  computed: {
    activeStyle () {
      return {
        backgroundColor: this._radioGroup.fill,
        borderColor: this._radioGroup.fill,
        color: this._radioGroup.textColor
      }
    }
  },
  mounted () {
    this.intPage()
  },
  methods: {
    // 页面数据加载
    intPage () {
      this.fullscreenLoading = true
      // 在线年级班级列表接口
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/gradeClass/getGradeByKrten',
        data: {}
      }).then((res) => {
        this.fullscreenLoading = false
        let that = this
        if (res.data.code > 0) {
          this.copyData = Object.assign([], res.data.list)
          this.copyData.forEach(function (v1, index1) {
            if (v1.gradeType === '1') {
              v1.gradeType = '常规年级'
            } else if (v1.gradeType === '2') {
              v1.gradeType = '混龄年级'
            }
            v1.classList.forEach(function (v2, index) {
              that.stuNumList.push({'stuNum': v2.stuNum})
              that.classIdList.push({'clssId': v2.classId})
              that.classNameStr.push(v2.className)
            })
            v1.classNameStr = that.classNameStr.join()
            that.classNameStr = []
          })
          this.tableData = this.copyData.slice(0, this.size * 1)
          this.total = this.copyData.length
        } else {
          this.$message.error(res.data.desc)
        }
      })
      // 升级次序配置按钮点击事件
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/gradeClass/getGradeDictConf',
        data: {}
      }).then((re) => {
        this.fullscreenLoading = false
        let that = this
        if (re.data.code > 0) {
          this.option = []
          this.option1 = []
          re.data.data[-1].forEach(function (item) {
            if (item.dictValue !== '混龄年级') {
              re.data.data[item.confId].forEach(function (v1) {
                that.option.push(v1)
              })
            } else if (re.data.data[item.confId].length !== 0) {
              re.data.data[item.confId].forEach(function (v1) {
                that.option1.push(v1)
              })
            }
          })
          this.option2 = this.option
        } else {
          this.$message.error(re.data.desc)
        }
      })
    },
    // 分页的上一页下一页
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    //  分页的跳到当前页面
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copyData.slice(
        (this.currentPage - 1) * this.size,
        this.currentPage * this.size
      )
    },
    addButton () {
      this.addDialog = true
      this.temp = true
      this.tabPosition = '常规年级'
      this.changeTemp()
    },
    // 对话框年级切换事件
    changeTemp () {
      this.temp = !this.temp
      this.option2 = []
      if (this.tabPosition === '常规年级') {
        this.option2 = this.option
        this.addCodeInput = ''
      } else {
        this.addCodeInput = 'HL'
        this.option2 = this.option1
      }
      this.addNameSelect = ''
      this.addList = [{
        values: ''
      }]
    },
    // 增加班级名称输入框
    addSpec () {
      this.data = {values: ''}
      this.addList.push(this.data)
      this.v2 = this.addList.length
    },
    // 移除班级名称输入框
    moveSpec () {
      if (this.addList.length > 1) {
        this.addList.splice(this.addList.length - 1, 1)
      }
    },
    editAddSpec () {
      this.data = {
        'classId': null,
        'className': ''
      }
      this.editList.push(this.data)
      this.v2 = this.editList.length
    },
    // 移除班级名称输入框
    editMoveSpec () {
      if (this.editList.length > 1) {
        this.editList.splice(this.editList.length - 1, 1)
      }
    },
    cancelAdd () {
      this.addDialog = false
      this.addNameSelect = ''
      this.addCodeInput = ''
      this.addList = [{
        values: ''
      }]
    },
    // 勾选表格数据
    selectData (selection) {
      this.options = selection
      this.length1 = selection.length
      this.stuNum = 0
      let that = this
      this.editList = []
      this.v1 = []
      if (selection.length > 0) {
        if (selection[0].gradeType === '常规年级') {
          this.temp = false
          this.tabPosition = '常规年级'
          this.option2 = this.option
          this.btnType = 1
        } else {
          this.tabPosition = '混龄年级'
          this.option2 = this.option1
          this.temp = true
          this.btnType = 0
        }
        selection[0].classList.forEach(function (v, k) {
          that.editList.push({
            'classId': v.classId,
            'className': v.className
          })
        })
        selection.forEach(function (v, k) {
          that.v1.push(v.gradeId)
          v.classList.forEach(function (v, k) {
            that.stuNum += v.stuNum
          })
        })
        // this.v1 = selection[0].gradeId
        this.editData = {
          'gradeId': selection[0].gradeId,
          'gradeCode': selection[0].gradeCode,
          'gradeName': selection[0].gradeName
        }
        this.editNameSelect = selection[0].gradeName
        this.editCodeInput = selection[0].gradeCode
        this.classArr = selection[0].classNameStr.split(',')
      }
    },
    // 添加年级班级按钮点击事件
    addClassSave () {
      console.log(this.options)
      if (this.addCodeInput === '' || this.addNameSelect === '' || this.addList.length === 0) {
        this.$message({
          type: 'warning',
          message: '所有选项都不能为空！'
        })
      } else {
        this.$ajax({
          method: 'GET',
          url: 'baseInfo/gradeClass/gradeCodeCheck?gradeCode=' + this.addCodeInput,
          data: {}
        }).then((re) => {
          this.fullscreenLoading = false
          if (re.data.code > 0) {
            if (re.data.data === 1) {
              this.$message.error(re.data.desc)
            } else {
              this.addDialog = false
              let that = this
              this.addList.forEach(function (v, k) {
                that.classNameStr.push({'className': v.values})
              })
              this.option2.forEach(function (v1, k1) {
                if (v1.dictName === that.addNameSelect) {
                  that.dictCode = v1.dictCode
                }
              })
              this.$ajax({
                method: 'POST',
                url: 'baseInfo/gradeClass/addGradeClass',
                data: {
                  'gradeCode': this.addCodeInput,
                  'gradeName': this.addNameSelect,
                  'classList': this.classNameStr,
                  'dictCode': this.dictCode
                }
              }).then((re) => {
                this.fullscreenLoading = false
                if (re.data.code > 0) {
                  this.intPage()
                  this.$message({
                    type: 'success',
                    message: re.data.desc
                  })
                } else {
                  this.$message.error(re.data.desc)
                }
              })
              this.classNameStr = []
            }
          } else {
            this.$message.error(re.data.desc)
          }
        })
      }
    },
    // 编辑按钮点击事件
    editClassSave () {
      this.editDialog = false
      let that = this
      this.tableData.forEach(function (v1, k1) {
        if (v1.dictName === that.editNameSelect) {
          that.dictCode = v1.dictCode
        }
      })
      this.option2.forEach(function (v1, k1) {
        if (v1.dictName === that.editNameSelect) {
          that.dictCode = v1.dictCode
        }
      })
      this.editData.dictCode = this.dictCode
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/gradeClass/updateGradeClass',
        data: {
          'gradeId': this.editData.gradeId,
          'gradeCode': this.editCodeInput,
          'gradeName': this.editNameSelect,
          'dictCode': this.editData.dictCode,
          'classList': this.editList
        }
      }).then((re) => {
        this.fullscreenLoading = false
        if (re.data.code > 0) {
          this.intPage()
          this.$message({
            type: 'success',
            message: re.data.desc
          })
        } else {
          this.$message.error(re.data.desc)
        }
      })
      this.classNameStr = []
    },
    // 删除按钮事件
    deleteData () {
      let that = this
      console.log(this.option)
      this.$confirm('此操作无法撤销，信息将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.stuNum === 0) {
          that.v1.forEach(function (v, k) {
            that.$ajax({
              method: 'GET',
              url: 'baseInfo/gradeClass/deleteGradeClassByGradeId?gradeId=' + v,
              data: {}
            }).then((re) => {
              that.fullscreenLoading = false
              if (re.data.code > 0) {
                that.intPage()
                that.$message({
                  type: 'success',
                  message: re.data.desc
                })
              } else {
                that.$message.error(re.data.desc)
              }
            })
          })
        } else {
          this.$message.error('该年级已被使用无法被删除!')
        }
      })
    },
    levelTemp () {
      this.comLevUpStr = []
      this.comLevUpType = 0
      let that = this
      this.option.forEach(function (v, k) {
        if (v.values !== undefined && v.values !== '') {
          that.comLevUpType++
          that.comLevUpStr.push(v.values)
        }
      })
      this.levelDialog = false
    },
    // 对话框关闭事件
    closeAddCommon () {
      this.addNameSelect = ''
      this.addList = [{
        values: ''
      }]
      if (this.temp === false) {
        this.addCodeInput = ''
      }
    },
    // 常规年级升级按钮点击事件
    comLevUp () {
      let that = this
      this.option.forEach(function (v, k) {
        that.classUpdataList.push({'dictCode': v.dictCode, 'gradeName': v.dictName})
      })
      this.$confirm('当前升级次序为' + this.comLevUpStr.join('→') + '确认升级后无法撤销！', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/gradeClass/upgradeGradeClass',
          data: this.classUpdataList
        }).then((re) => {
          this.fullscreenLoading = false
          if (re.data.code > 0) {
            that.$message({
              type: 'success',
              message: '升级成功！'
            })
            this.intPage()
          } else {
            this.$message.error(re.data.desc)
          }
        })
      })
    },
    Ele (EleTemp) {
      this.option.forEach(function (v, k) {
        if (EleTemp.values === v.dictValue) {
          v.disabled = true
        }
      })
    },
    clear (EleTemp) {
      EleTemp.disabled = false
    },
    empty () {
      this.option.forEach(function (v) {
        v.values = ''
        v.disabled = false
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
        return this.searchFiledArr.some(d => {
          return o[d] && ((typeof o[d] === 'string') ? o[d].indexOf(newVal) > -1 : o[d].toString().indexOf(newVal) > -1)
        })
      })
      } else {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size)
      }
    }
  }
}
