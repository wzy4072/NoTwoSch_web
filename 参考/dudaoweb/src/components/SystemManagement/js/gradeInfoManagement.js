import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
const judegRepeat = (value, arr, field) => {
  let result = false
  result = arr.some((item) => {
    return value == item[field]
  })
  return result
}
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      selectedTemp: [], // 当前选中条目
      printOb: {
        pageNum: 1,
        title: '年级信息列表'
      },
      searchFiledArr: [
        {field: 'orderId', value: null},
        {field: 'gradeType', value: null},
        {field: 'dictName', value: null}
      ], // 搜索字段
      searchstr: '',
      total: 0,
      size: 50,
      currentPage: 1,
      tableData: [],
      copyData: [],
      commonForm: { // 常规年级表单
        gradeIndex: null, // 年级序号
        gradeName: null // 年级名称
      },
      mixAgeForm: { // 混龄年级表单
        mixAgeGradeName: null // 年级名称
      },
      commonRules: {
        gradeIndex: [
          { required: true, message: '请输入常规年级序号', trigger: 'manual' },
          {
            validator: (rule, value, callback) => { // 自定义校验规则
              let re = /^[1-9]\d*$/
              if (!re.test(String(value).trim())) {
                callback(new Error('年级序号只能为数字，请重新输入！'))
                return false
              }
              if (!this.selectedTemp.length) { // 添加时
                if (judegRepeat(value, this.copyData, 'orderId')) {
                  callback(new Error('该常规年级序号已存在，请重新输入！'))
                  return false
                }
              }
              callback()
            },
            trigger: 'manual'
          }
        ],
        gradeName: [
          { required: true, message: '请输入常规年级名称', trigger: 'manual' },
          {
            validator: (rule, value, callback) => { // 自定义校验规则
              if (!this.selectedTemp.length) { // 添加时
                if (judegRepeat(String(value).trim(), this.copyData, 'dictName')) {
                  callback(new Error('该常规年级名称已存在，请重新输入！'))
                  return false
                }
              }
              callback()
            },
            trigger: 'manual'
          }
        ]
      }, // 常规年级校验规则
      mixAgeRules: {
        mixAgeGradeName: [
          { required: true, message: '请输入混龄年级名称', trigger: 'manual' }
        ]
      }, // 混龄年级校验规则
      currOpaType: null, // 当前操作 1：常规年级 2：混龄年级
      addLayer1: false, // 添加常规年级弹框
      addLayer2: false // 添加
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      // 在线年级班级列表接口
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/gradeClass/getGradeDictConf'
      }).then((re) => {
        if (re.data.code > 0) {
          let that = this
          this.copyData.length = 0
          if (re.data.data) {
            re.data.data[-1].forEach(function (item) {
              if (item.dictValue !== '混龄年级' && re.data.data[item.confId] !== undefined) {
                re.data.data[item.confId].forEach(function (v1) {
                  v1.gradeType = '常规年级'
                  that.copyData.push(v1)
                })
              } else if (item.dictValue === '混龄年级' && re.data.data[item.confId] !== undefined) {
                re.data.data[item.confId].forEach(function (v2) {
                  v2.gradeType = '混龄年级'
                  that.copyData.push(v2)
                })
              }
            })
          }
          this.total = this.copyData.length
          this.tableData = this.copyData.slice(0, this.size * 1)
        } else {
          this.$message.error(re.data.desc)
        }
      })
    },
    addSubmit (sendData) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/dictConfUpdateBatch',
        data: sendData
      }).then((re) => {
        if (re.data.code > 0) {
          this['addLayer' + this.currOpaType] = false
          this.getTableData()
          this.$message.success('操作成功')
        } else {
          this.$message.error(re.data.desc)
        }
      })
    },
    addGrade () {
      let that = this
      let currForm = this.currOpaType == 1 ? 'commonForm' : 'mixAgeForm'
      let orderId = this.currOpaType == 1 ? this.commonForm.gradeIndex : ''
      this.$refs[currForm].validate((valid) => {
        if (valid) {
          let sendData = []
          let obj = {
            'dictType': 'GRADE',
            'dictDesc': '年级名称',
            'dictName': that[currForm].gradeName,
            'dictValue': that[currForm].gradeName,
            'dictCode': this.currOpaType,
            'orderId': orderId
          }
          that.selectedTemp.length && (obj.confId = that.selectedTemp[0])
          sendData.push(obj)
          that.addSubmit(sendData)
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
    cancel () {
      // 移除表单校验
      if (this.currOpaType == 1) {
        this.commonForm.gradeIndex = ''
        this.commonForm.gradeName = ''
        this.$refs.commonForm.clearValidate()
      } else if (this.currOpaType == 2) {
        this.$refs.mixAgeForm.clearValidate()
        this.mixAgeForm.gradeName = ''
      }
      this['addLayer' + this.currOpaType] = false
    },
    selectData (selection, row) {
      this.selectedTemp = selection.map((item) => {
        return item.confId
      })
      if (this.selectedTemp.length === 1) {
        this.currOpaType = selection[0].gradeType == '常规年级' ? 1 : 2
        if (this.currOpaType == 1) {
          this.commonForm.gradeIndex = selection[0].orderId
          this.commonForm.gradeName = selection[0].dictName
        } else {
          this.mixAgeForm.mixAgeGradeName = selection[0].dictName
        }
      }
    },
    editFun () {
      this['addLayer' + this.currOpaType] = true
    },
    deleteFun () {
      // 询问框 是否删除
      this.$confirm('是否删除该年级, 删除后将无法恢复?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/dictConf/gradeDeleteBatch',
          data: this.selectedTemp
        }).then((re) => {
          if (re.data.code > 0) {
            this.$message.success('删除成功')
            this.getTableData()
          } else {
            this.$message.error(re.data.desc)
          }
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'})
      })
    },
    openLayer (type) {
      this.currOpaType = type
      this.selectedTemp.length = 0
      if (type == 1) {
        this.addLayer1 = true
        this.commonForm.gradeIndex = null
        this.commonForm.gradeName = null
      } else {
        let result = this.copyData.some((item) => {
          return item.gradeType == '混龄年级'
        })
        if (result) {
          this.$message.warning('当前已有一个混龄年级，无法添加多个混龄年级')
        } else {
          this.mixAgeForm.mixAgeGradeName = null
          this.addLayer2 = true
        }
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
        return this.searchFiledArr.some(d => {
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
