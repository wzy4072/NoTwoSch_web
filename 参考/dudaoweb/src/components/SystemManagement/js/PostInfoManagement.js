import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
const fixation = ['园长', '保健医生', '教师', '保育员', '保安']
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      tableData: [],
      searchstr: '', // 当前输入
      fixation: fixation,
      printOb: {
        // 打印所需
        pageNum: 1,
        title: '项目列表'
      },
      dialogVisible: false,
      dialogVisible1: false,
      confId: [],
      count: 0,
      ruleForm: { // 岗位表单
        postName: ''
      },
      rules: { // 表单验证规则
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'manual' },
          { max: 10, message: '长度在 10个字符内', trigger: 'manual' },
          {
            validator: (rule, value, callback) => { // 自定义校验规则
              let state = 0
              for (let index = 0; index < this.copyData.length; index++) {
                const element = this.copyData[index]
                if (element.dictName === value) {
                  state = 1
                  break
                }
              }
              if (state) {
                callback(new Error('已存在该岗位，请勿重复添加！'))
              } else {
                callback()
              }
            },
            trigger: 'manual'
          }
        ]
      },
      dictDesc: '',
      dictType: '',
      searchFiledArr: [ {field: 'dictValue', value: null} ] // 模糊查询 字段
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/selectDictConfLsit',
        data: { dictType: 'POSITION' } // 岗位传值POSITION
      })
        .then(res => {
          this.fullscreenLoading = false
          this.copyData = Object.assign([], res.data.data)
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
    check (selection) {
      // 表格勾选获取confId和dictValue
      this.confId = []
      let array = []
      if (selection.length) {
        selection.forEach((element, index) => {
          if (fixation.indexOf(element.dictValue) === -1) {
            this.confId.push(element.confId)
          } else {
            this.$refs.multipleTable.toggleRowSelection(element)
            array.push(index)
          }
        })
        array.forEach(function (o, i) {
          selection.splice(o - i, 1)
        })
        this.ruleForm.postName = selection.length > 0 ? selection[0].dictValue : ''
      }
      this.count = selection.length
    },
    Add () {
      // 表格添加信息
      this.confId.length = 0
      this.ruleForm.postName = ''
      this.dialogVisible = true
    },
    deletRow () {
      // 表格删除数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/postDeleteBatch',
        data: this.confId
      })
        .then(res => {
          this.fullscreenLoading = false
          this.dialogVisible1 = false
          this.$message.success('删除成功')
          this.refresh()
        })
    },
    name_function (row) {
      // 表格岗位名称点击时赋值弹窗
      this.confId.push(row.confId)
      this.ruleForm.postName = row.dictValue
      this.dialogVisible = true
    },
    Submit () { // 表格编辑或新增数据
      let that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var obj = {
        // 新增时
            dictType: 'POSITION',
            dictDesc: '岗位',
            dictName: that.ruleForm.postName,
            dictValue: that.ruleForm.postName
          }
          if (that.confId.length) {
        // 编辑时传ID
            obj.confId = that.confId[0]
          }
          var arrDate = []
          arrDate.push(obj)
      // 请求接口
          that.fullscreenLoading = true
          that.$ajax({
            method: 'POST',
            url: 'baseInfo/dictConf/dictConfUpdateBatch',
            data: arrDate
          })
        .then(res => {
          that.fullscreenLoading = false
          that.dialogVisible = false
          that.$message.success('操作成功')
          that.refresh()
        })
        }
      })
    },
    cancel () { // 取消编辑+新增
      // 移除表单校验
      this.$refs.ruleForm.clearValidate()
      this.dialogVisible = false
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
