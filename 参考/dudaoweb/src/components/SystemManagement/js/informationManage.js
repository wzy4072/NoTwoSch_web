import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
const fixation = ['督学']
const isRepeat = arr => {
  let result = [false]
  let hash = {}
  for (let i in arr) {
    if (hash[arr[i]]) {
      result[0] = true
      result[1] = arr[i]
      return result
    }
    hash[arr[i]] = true
  }
  return result
}
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      state: 0,
      barNameArr: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      tableData: [],
      copyData: [],
      searchstr: '', // 当前输入
      searchFiledArr: ['dictValue'], // 搜索字段
      fixation: fixation,
      scrColumn: [
        // 表头
        { text: '序号', selected: true },
        { text: '科目名称', selected: true }
      ],
      printOb: {// 打印所需
        pageNum: 1,
        title: '职务信息列表'
      },
      dialogVisible: false,
      deletDialog: false, // 删除弹框
      deletArr: [], // 删除数组
      count: 0, // 选择几条数据
      ruleForm: { // 职务表单
        dutyId: '',
        dutyName: ''
      },
      newInputList: null, // 新增 职务名称 数组
      rules: { // 表单验证规则
        dutyName: [
          { required: true, message: '请输入职务名称', trigger: 'manual' },
          {
            validator: (rule, value, callback) => { // 自定义校验规则
              // 判断是否输入重复职务
              let temp = isRepeat(this.newInputList)
              if (temp[0]) {
                callback(new Error('请勿输入重复职务名称（' + temp[1] + '）'))
                return false
              }
              // 判断是否重复添加职务
              let state = false // 是否有重复职务 0：false  1：true
              for (let index = 0; index < this.newInputList.length; index++) {
                let item = this.newInputList[index]
                state = this.copyData.some((element) => {
                  return item.trim() == element.dictName
                })
                if (state) { // 存在重复
                  callback(new Error('存在重复职务名称（' + item.trim() + '）'))
                  return false
                }
              }
              callback()
            },
            trigger: 'manual'
          }
        ]
      },
      dialogTitle: '', // 弹框题目
      type: ''// 1是新增，2是修改
    }
  },
  mounted () { // 进页面默认执行方法
    this.refresh()
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/workerSelect',
        data: {
          'dictType': 'JOB'
        }
      }).then((re) => {
        this.fullscreenLoading = false
       // 使用分页
        this.copyData = Object.assign([], re.data.list)
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = re.data.list.length
      }).catch((err) => {
        this.$message.error('错误提示：' + err)
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
    searchFun () {
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
        this.tableData = this.copyData
      }
      this.fullscreenLoading = false
    },
    check (selection) { // 表格勾选获取deletArr
      this.deletArr = []
      let array = []
      if (selection.length) {
        selection.forEach((element, index) => {
          if (fixation.indexOf(element.dictValue) === -1) {
            this.deletArr.push(element.confId)
          } else {
            this.$refs.multipleTable.toggleRowSelection(element)
            array.push(index)
          }
        })
      }
      array.forEach(function (o, i) {
        selection.splice(o - i, 1)
      })
      this.count = selection.length
    },
    Add (value, type) { // 表格添加信息
      this.ruleForm.dutyName = ''
      this.dialogTitle = '添加职务'
      this.type = type
      this.dialogVisible = true
    },
    deletRow () { // 表格删除数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/deleteBatch',
        data: this.deletArr
      })
        .then(res => {
          this.fullscreenLoading = false
          this.deletDialog = false
          this.$message.success('删除成功')
          this.refresh()
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    name_function (row, type) { // 表格岗位名称点击时赋值弹窗
      this.ruleForm.dutyName = row.dictValue
      this.ruleForm.dutyId = row.confId
      this.dialogTitle = '编辑职务'
      this.type = type
      this.dialogVisible = true
    },
    cancel () { // 取消编辑+新增
      // 移除表单校验
      this.$refs.ruleForm.clearValidate()
      this.dialogVisible = false
    },
    Submit () { // 表格编辑或新增数据
      let that = this
      this.newInputList = this.ruleForm.dutyName.split('\n')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let sendData = []
          that.newInputList.forEach((val) => {
            let obj = {
              'confId': that.type == 1 ? '' : that.ruleForm.dutyId,
              'dictName': val,
              'dictValue': val,
              'dictDesc': '职务类型',
              'dictType': 'JOB'
            }
            sendData.push(obj)
          })
          // 请求接口
          that.fullscreenLoading = true
          that.$ajax({
            method: 'POST',
            url: 'baseInfo/dictConf/saveDictConfList',
            data: sendData
          }).then(res => {
            that.fullscreenLoading = false
            that.dialogVisible = false
            that.$message.success('操作成功')
            that.refresh()
          })
        }
      })
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.fullscreenLoading = true

        this.tableData = this.copyData.filter(o => {
          return this.searchFiledArr.some(d => {
            return o[d] && ((typeof o[d] === 'string') ? o[d].indexOf(newVal) > -1 : o[d].toString().indexOf(newVal) > -1)
          })
        })
      } else {
        this.tableData = this.copyData
      }
      this.fullscreenLoading = false
    }
  }
}
