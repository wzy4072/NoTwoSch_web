import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      pageData: {
        'noticeType': '',
        'content': '', // 资料正文
        'atts': [], // 资料附件
        'version': ''
      },
      rules: { // 校验规则
        noticeType: [
          { required: true, message: '请选择资料类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入资料名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      noticeTypeList: [], // 资料类型列表
      baseUrl: '',
      token: '',
      businessId: ''
    }
  },
  mounted () {
    // 获取token
    this.token = sessionStorage.getItem('user_token')
    // 获取当前地址
    this.baseUrl = this.$api.baseUrl
    this.getTypeList() // 获取资料列表
    let session = sessionStorage.getItem('CmCurrConstitution')
    if (session) { // 编辑
      this.pageData = JSON.parse(session)
      console.log(this.pageData)
      this.pageData.atts.forEach((item) => {
        item.name = item.attName
      })
    }
  },
  methods: {
    getTypeList () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/dictConf/selectDictConfListByType',
        data: {
          'dictType': 'NOTICE_CATEGORY_ZC'
        }
      }).then(res => {
        this.noticeTypeList = res.data.list
        this.selectGet(this.pageData.noticeType)
      })
    },
    selectGet (dictCode) {
      let obj = {}
      let obj2 = {}
      obj = this.noticeTypeList.find((item) => {
        return item.dictCode == dictCode
      })
      obj2 = this.noticeTypeList.find((item) => {
        return item.dictName == obj.dictName
      })
      console.log(obj2)
      this.pageData.noticeTypeCom = obj2.dictValue
    },
    handleRemove (file, fileList) { // 移除成功事件
      this.pageData.atts = fileList
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除附件 ${file.name}？`)
    },
    handleSuccess (res, file, fileList) {
      if (res.code > 0) { // 上传成功
        res.data.attName = file.name
        res.data.name = file.name
        res.data.attSize = (res.data.attSize / 1024).toFixed(2)
        res.data.businessId = file.businessId
        this.pageData.atts.push(res.data)
      } else {
        this.$message.error(res.desc)
      }
    },
    handleExceed (files, fileList) { // 上传文件个数限制
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    submit () {
      // 校验输入数据
      let that = this
      if (that.pageData.historyData && that.pageData.historyData.length > 0) {
        that.pageData.version = that.pageData.historyData[0].version
      }
      if (that.pageData.id && !session) {
        delete that.pageData['id']
      }
      console.log(that.pageData)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) { // 校验成功
          this.$ajax({
            method: 'post',
            url: !session ? 'baseInfo/statuteMang/addStatute' : 'baseInfo/statuteMang/editStatute',
            data: that.pageData
          }).then(res => {
            this.$message.success(!session ? '资料已更新' : '资料已修改')
            this.$router.push({ path: '/ConstitutionManagement/CMTwo' })
          })
        } else {
          this.$message.warning('请填写完整信息')
          return false
        }
      })
    }
  }
}
