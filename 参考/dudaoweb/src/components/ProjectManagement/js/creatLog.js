import ue from '@/common/components/ueditor.vue'
export default {
  components: { ue },
  data () {
    return {
      importFileUrl: '',
      token: { 'authorization': sessionStorage.getItem('user_token') },
      detailData: {},
      ruleForm: {
        projectId: '',
        krtenCode: '',
        createBy: '',
        createDate: '',
        logStatus: '',
        logContent: '',
        logTitile: ''
      },
      fileList: [],
      fileSendlist: [],
      rules: {
        logTitile: [
          { required: true, message: '请输入日志名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      },
      maindata: {
        intdata: '',
        outdata: '',
        outdataTxt: ''
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      }
    }
  },
  mounted () {
    let type = this.$route.query.type
    this.detailData = JSON.parse(sessionStorage.getItem('logDetail'))
    console.log(this.detailData)
    this.ruleForm.projectId = this.detailData.projectId
    this.ruleForm.krtenCode = this.detailData.krtenCode
    if (type === 2) {
      this.ruleForm = Object.assign({}, this.detailData.list[0].list[this.detailData.chooseIndex])
      this.maindata.intdata = this.ruleForm.logContent
      this.ruleForm.atts.forEach((val, key) => {
        this.$set(val, 'name', val.attName)
        let obj = {
          'attName': val.attName,
          'attUrl': val.attUrl,
          'attType': val.attType,
          'attSize': val.attSize
        }
        this.fileSendlist.push(obj)
      })
      this.fileList = this.ruleForm.atts
    }
    this.importFileUrl = this.$api.baseUrl + '/baseInfo/dictConf/uploadFile'
  },
  methods: {
    UploadUrl: function () { // :action执行函数，上传的地址
      return this.importFileUrl
    },
    uploadSuccessFun: function (files, fileList) {
      // 成功之后返回fileList
      let index = files.list[0].lastIndexOf('.')
      let attType = files.list[0].substring(index, files.list[0].length)
      console.log(attType)
      let obj = {
        'name': fileList.name,
        'attName': fileList.name,
        'attUrl': files.list[1],
        'attType': attType,
        'attSize': fileList.size / 1024 / 1024
      }
      this.fileSendlist.push(obj)
    },
    beforeAvatarUpload: function (file) {
      // 文件大小要做显示 不能超过10M
      // console.log(file)
    },
    uploadErrorFun: function () {
      //
    },
    saveFun (type) {
      // 验证是否为空
      type === 1 ? this.ruleForm.logStatus = '0' : this.ruleForm.logStatus = '1' // 状态0.草稿 1.提交
      this.ruleForm.logContent = this.maindata.outdataTxt
      if (!this.ruleForm.logTitile) {
        this.$message.error('日志名称不能为空')
        return false
      }
      this.$ajax({
        method: 'post',
        data: {'processLog': this.ruleForm, 'atts': this.fileSendlist},
        url: 'procedural/Processsspm/addLog'
      }).then((res) => {
        this.$message.success('保存成功')
        this.$router.push({path: '/ProjectManagement/logManagement'})
      })
    },
    handleRemove (file, fileList) {
     // console.log(file, fileList)
    },
    handlePreview (file) {
      // console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getContents: function () {
      console.log(this.maindata.outdata)
    },
    delet () {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'post',
          data: {
            'processLog': {
              'logId': this.detailData.logId
            }
          },
          url: 'procedural/Processsspm/deleteLog'
        }).then((re) => {
          this.$message.success('删除成功')
          this.$router.go(-1)
        }).catch((err) => {
          this.$message.error('错误信息' + err)
        })
      })
    }
  },
  watch: {
  }
}
