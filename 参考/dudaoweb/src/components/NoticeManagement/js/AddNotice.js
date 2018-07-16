import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      session: null,
      noticeTypeList: [], // 公告类型列表
      formData: { // 表单数据
        noticeType: '', // 公告类型
        title: '', // 公告名称
        content: '', // 公告正文
        releaseScopeArr: [], // 发布范围
        atts: [] // 附件
      },
      token: '', // token
      baseUrl: '', // 地址
      rules: { // 校验规则
        noticeType: [
          { required: true, message: '请选择公告类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入公告名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        releaseScopeArr: [
          { type: 'array', required: true, message: '请至少选择一个发布范围', trigger: 'change' }
        ]
      },
      fullscreenLoading: false
    }
  },
  mounted () {
    // 获取token
    this.token = sessionStorage.getItem('user_token')
    // 获取当前地址
    this.baseUrl = this.$api.baseUrl
    this.getNoticeTypeList()
    // 获取编辑数据
    this.session = sessionStorage.getItem('NmCurrNotice')
    if (this.session) { // 编辑
      this.formData = JSON.parse(this.session)
      this.formData.atts.forEach(element => {
        element.name = element.attName
      })
      this.$set(this.formData, 'releaseScopeArr', this.formData.publicRange ? this.formData.publicRange.split(',') : [])
    }
  },
  methods: {
    getNoticeTypeList () { // 获取公告类型列表
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'baseInfo/dictConf/selectDictConfListByType',
        data: {
          'dictType': 'NOTICE_CATEGORY_GG'
        }
      }).then(res => {
        this.fullscreenLoading = false
        this.noticeTypeList = res.data.list
      })
    },
    handleRemove (file, fileList) { // 移除成功事件
      this.formData.atts = fileList
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除附件 ${file.name}？`)
    },
    handleSuccess (res, file, fileList) {
      if (res.code > 0) { // 上传成功
        this.formData.atts.push({
          'name': file.name,
          'attName': file.name,
          'attUrl': res.data.attUrl,
          'attType': res.data.attType,
          'attSize': (res.data.attSize / 1024).toFixed(2)
        })
      } else {
        this.$message.error(res.desc)
      }
    },
    handleExceed (files, fileList) { // 上传文件个数限制
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    addNotice (type) { // 0.草稿 1.发布
      // 校验输入数据
      let that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) { // 校验成功
          that.formData.noticeStatus = type
          that.formData.releaseScope = that.formData.releaseScopeArr.join(',')
          that.formData.publicRange = that.formData.releaseScope
          let sendUrl = 'baseInfo/noticeSys/addNoticeSys'
          if (that.session) {
            sendUrl = 'baseInfo/noticeSys/editNoticeSys'
            delete that.formData.createTime
          }
          this.$ajax({
            method: 'post',
            url: sendUrl,
            data: that.formData
          }).then(res => {
            this.$message.success(!type ? '公告已存为草稿' : '公告已发布')
            this.$router.push({ path: '/NoticeManagement/NManagement' })
          })
        } else {
          this.$message.warning('请填写完整信息')
          return false
        }
      })
    }
  }
}
