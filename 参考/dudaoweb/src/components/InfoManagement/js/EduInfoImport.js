import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      isEdit: false, // 是否编辑状态
      dialogVisible: false,
      previewdata: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      searchstr: '', // 当前查询输入
      scrColumn: [ // 表头
                  { text: '姓名', field: 'superintendentName', selected: true, align: 'center' },
                  { text: '性别', field: 'superintendentGendername', selected: true, align: 'center' },
                  { text: '职务', field: 'superintendentPositionName', selected: true },
                  { text: '手机号码', field: 'superintendentTel', selected: true }
      ],
      printOb: { // 打印所需
        pageNum: 1,
        title: '项目列表'
      },
      urlName: '',
      importFileUrl: '',
      missListLayer: false, // 上传失败人员名单弹框
      missList: [] // 上传失败人员名单
    }
  },
  mounted () { // 进页面默认执行方法
    this.urlName = this.$api.baseUrl + 'baseInfo/staffManage/download?templateNumber=importKSSEducationInfo.xlsx'
    this.importFileUrl = this.$api.baseUrl + 'baseInfo/eduInfoManager/showExcelFile'
  },
  methods: {
    UploadUrl: function () { // :action执行函数，上传的地址
      return this.importFileUrl
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copydata.slice(
                  (this.currentPage - 1) * this.size,
                  this.currentPage * this.size
              )
    },
    searchFun () {
      if (this.searchstr !== '') {
        this.fullscreenLoading = true
        this.tableData = this.copydata.filter(o => {
          return Object.keys(o).some(d => {
            return (typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
                              .searchstr) > -1
          })
        })
      } else {
        this.tableData = this.copydata
      }
      this.fullscreenLoading = false
      this.total = this.tableData.length
    },
    beforeAvatarUpload (file) { // 文件上传时执行的函数
      let Xls = file.name.split('.')
      if (Xls[1] === 'xls' || Xls[1] === 'xlsx') {
        return file
      } else {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
        return false
      }
    },
    uploadSuccessFun: function (response, file) { // 文件导入  文件上传成功时执行
      if (response.code > 0) {
        this.isEdit = true
        this.previewdata = response.list
        this.previewdata.forEach((val, key) => {
          val.superintendentGender === 1 ? val.superintendentGendername = '男' : val.superintendentGendername = '女'
        })
        console.log(this.previewdata)
        this.$message.success('上传成功！')
      } else {
        this.$message.error(response.desc)
      }
    },
    uploadErrorFun: function (err, file, fileList) { // 文件导入  文件上传失败时执行
      this.$message.error(err)
    },
    savefun: function () {
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduInfoManager/addImport',
        data: this.previewdata
      })
        .then(res => {
          if (res.data.code > 0) {
            if (res.data.data.missSize > 0) {
              // this.$message.success('保存成功,' + res.data.data.missSize + '个教职工信息填写不符合规范')
              // 弹框显示所有填写不规范的教职工信息
              that.missList = res.data.data.missList
              // 处理性别
              this.missList.forEach((val, key) => {
                val.superintendentGendername = val.superintendentGender === 1 ? '男' : '女'
              })
              that.missListLayer = true
            } else {
              this.$message.success('全部保存成功')
            }
            this.isEdit = false
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => {
          this.$message.error('接口异常：' + err)
        })
    },
    cancel: function () {
      this.dialogVisible = false
      this.isEdit = false
    }
  }
}
