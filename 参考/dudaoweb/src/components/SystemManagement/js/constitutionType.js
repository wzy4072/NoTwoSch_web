import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
const isRepeat = arr => { // 参数为需要校验的字符数组[str1,str2,...]
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
      baseUrl: '',
      token: '',
      barNameArr: [],
      atts: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      tableData: [],
      copyData: [],
      searchstr: '', // 当前输入
      searchFiledArr: ['dictValue'], // 搜索字段
      printOb: {// 打印所需
        pageNum: 1,
        title: '幼儿园上传资料列表'
      },
      dialogVisible: false,
      dialogVisible2: false,
      deletDialog: false, // 删除弹框
      deletArr: [], // 删除数组
      count: 0, // 选择几条数据
      ruleForm: { // 资料表单
        constitutionId: '',
        constitutionName: '',
        constitutionContent: ''
      },
      newInputList: null, // 新增 资料名称 数组
      rules: { // 表单验证规则
        constitutionName: [
          { required: true, message: '请输入资料名称', trigger: 'manual' },
          {
            validator: (rule, value, callback) => { // 自定义校验规则
              if (value === ' ') {
                callback(new Error('请输入资料名称'))
                return false
              }
              if (this.type === 1) { // 新增资料
                // 判断是否重复添加资料
                let state = false // 是否有重复资料 0：false  1：true
                for (let index = 0; index < this.newInputList.length; index++) {
                  let item = this.newInputList[index]
                  state = this.copyData.some((element) => {
                    return item.trim() == element.dictName
                  })
                  if (state) { // 存在重复
                    callback(new Error('存在重复资料名称（' + item.trim() + '）'))
                    return false
                  }
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
      // 获取token
      this.token = sessionStorage.getItem('user_token')
      // 获取当前地址
      this.baseUrl = this.$api.baseUrl
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/selectDictConfListByType',
        data: {
          'dictType': 'NOTICE_CATEGORY_ZC'
        }
      }).then((re) => {
        this.fullscreenLoading = false
       // 使用分页

        this.copyData = Object.assign([], re.data.list)

        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.copyData.length
        console.log(this.tableData)
      })
    },
    downloadAttr (file) {
      this.$api.downloadFile(this.baseUrl + 'baseInfo/noticeSys/download/' + file.id, file.attName)
    },
    handleRemove (file, fileList) { // 移除成功事件
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/deleteAtt',
        data: {
          'id': file.id
        }
      }).then((re) => {
        if (re.data.code === 1) {
          this.atts = fileList
          this.refresh()
        } else {
          this.$message.warning(re.data.desc)
        }
      })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除附件 ${file.name}？`)
    },
    handleSuccess (res, file, fileList) {
      if (res.code > 0) { // 上传成功
        var arr = []
        arr.push(
          {
            'attName': file.name,
            'attUrl': res.list[1],
            'attType': '.' + file.name.split('.')[1],
            'attSize': this.$api.bytesToSize(file.size),
            'businessId': this.businessId,
            'businessType': 14
          }
        )
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/dictConf/saveAtts',
          data: arr
        }).then((re) => {
          console.log(re.data.code)
          if (re.data.code === 1) {
            this.$message.success('上传成功')
            this.refresh()
          } else {
            this.$message.warning(re.data.desc)
          }
        })
      } else {
        this.$message.error(res.data.desc)
      }
    },
    handleExceed (files, fileList) { // 上传文件个数限制
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
    check (selection) { // 表格勾选获取deletArr
      this.deletArr = []
      if (selection.length) {
        selection.forEach((element, index) => {
          this.deletArr.push(element.confId)
        })
      }
      this.count = selection.length
    },
    Add (value, type) { // 表格添加信息
      this.ruleForm.constitutionName = ''
      this.ruleForm.constitutionContent = ''
      this.dialogTitle = '添加资料类型'
      this.type = type
      this.dialogVisible = true
    },
    deletRow () { // 表格删除数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/deleteBatch',
        data: this.deletArr
      }).then(res => {
        this.fullscreenLoading = false
        this.deletDialog = false
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    name_function (row, type) { // 表格岗位名称点击时赋值弹窗
      this.ruleForm.constitutionName = row.dictName
      this.ruleForm.constitutionContent = row.dictValue
      this.ruleForm.constitutionId = row.confId
      this.dialogTitle = '编辑资料类型'
      this.type = type
      this.dialogVisible = true
    },
    name_function2 (row) {
      this.dialogVisible2 = true
      this.businessId = row.confId
      row.atts.forEach((item) => {
        item.name = item.attName
      })
      console.log(row)
      this.atts = row.atts
    },
    Submit () { // 表格编辑或新增数据
      let that = this
      let temp = []
      temp.push(this.ruleForm.constitutionName)
      this.newInputList = temp
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let sendData = []
          let obj = {
            'confId': Number(that.type) === 1 ? '' : that.ruleForm.constitutionId,
            'dictName': that.ruleForm.constitutionName,
            'dictValue': that.ruleForm.constitutionContent,
            'dictDesc': '资料类型',
            'dictType': 'NOTICE_CATEGORY_ZC'
          }
          sendData.push(obj)
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
    },
    cancel () { // 取消编辑+新增
      // 移除表单校验
      this.$refs.ruleForm.clearValidate()
      this.dialogVisible = false
      this.dialogVisible2 = false
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
          this.currentPage * this.size
      )
      }
    }
  }
}
