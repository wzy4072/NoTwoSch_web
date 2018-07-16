export default {
  data () {
    return {
      token: {},
      tableData: [], // 表格list
      checkTableDataList: [], // 表格选中list
      workerData: {// 教师信息
        workerName: '',
        workerGender: '',
        workerTypeName: '',
        courseName: '',
        highestEducation: ''
      },
      isShowBtn: 0, // btn 显示
      certificateType: [// 证书list
        '毕业证书', '学位证书', '幼儿教师资格证', '保育员资格证', '幼儿园园长资格证', '幼儿园保健医生上岗证', '其他类型'
      ],
      dialogData: {// 弹窗信息
        qualificationsId: null,
        workerId: 1,
        qualificationsName: '',
        otherQualificationsName: '',
        qualificationsPath: '',
        createBy: null,
        modifyBy: null,
        createDate: null,
        modifyDate: null
      },
      uploadUrl: '', // 文件上传地址
      uploadObj: {
        workerId: ''
      },
      imgDialogName: '', // 图片弹窗Title
      newEditDialogName: '', // 新增编辑弹窗Title
      imgUrl: '', // 证件照url
      dialogPictureVisible: false,
      dialogAddOrEditVisible: false,
      fileUploadStatus: false
    }
  },
  mounted () {
    this.uploadUrl = this.$api.baseUrl + 'baseInfo/staffManage/updateStaffImg'
    // 教师信息
    let obj = JSON.parse(sessionStorage.getItem('workerData'))
    this.uploadObj.workerId = obj.workerId
    this.dialogData.workerId = obj.workerId
    this.workerData.workerName = obj.workerName
    this.workerData.workerGenderName = obj.workerGenderName
    this.workerData.workerTypeName = obj.workerTypeName
    this.workerData.courseName = obj.courseName
    this.workerData.highestEducationName = obj.highestEducationName
    if (obj.arg1 === null) {
      this.workerData.teaching = ''
    } else {
      let arg = new Date(obj.arg1)
      let now = new Date()
      let chaYear = now.getFullYear() - arg.getFullYear()
      let chaMonth = now.getMonth() - arg.getMonth()
      if (chaMonth < 0) {
        chaYear -= 1
        chaMonth = 12 + chaMonth
      }
      if (chaYear > 0) {
        this.workerData.teaching = chaYear + '年'
      }
      if (chaMonth > 0) {
        this.workerData.teaching += chaMonth + '月'
      }
    }
    this.getdataFn()
    this.token = {'authorization': sessionStorage.getItem('user_token')}
  },
  methods: {
    getdataFn () { // 获取数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/staffManage/staffQualificationsInfo',
        data: {
          'workerId': JSON.parse(sessionStorage.getItem('workerData')).workerId
        }
      })
        .then(res => {
          this.fullscreenLoading = false
          this.tableData = res.data.data
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    selectTableFn (selection, row) { // 表格选择
      this.checkTableDataList = Array.prototype.slice.call(selection)
    },
    addFn () { // 新增证书
      this.newEditDialogName = '新增证书'
      this.dialogAddOrEditVisible = true
      this.dialogData.qualificationsId = null
      this.dialogData.qualificationsName = ''
      this.dialogData.otherQualificationsName = ''
      this.dialogData.qualificationsPath = ''
      this.dialogData.createBy = null
      this.dialogData.modifyBy = null
      this.dialogData.createDate = null
      this.dialogData.modifyDate = null
      this.dialogData.fileName = ''
    },
    editFn () { // 编辑证书
      if (this.checkTableDataList.length > 0) {
        this.newEditDialogName = '编辑证书'
        this.dialogAddOrEditVisible = true
        // 设置弹窗默认显示数据
        this.dialogData.qualificationsId = this.checkTableDataList[0].qualificationsId
        // 判断常规类型显示什么数据
        this.dialogData.qualificationsName = this.checkTableDataList[0].qualificationsName === '毕业证书' || this.checkTableDataList[0].qualificationsName === '学位证书' || this.checkTableDataList[0].qualificationsName === '幼儿教师资格证' || this.checkTableDataList[0].qualificationsName === '保育员资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园园长资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园保健医生上岗证' ? this.checkTableDataList[0].qualificationsName : '其他类型'
        // 判断其他类型显示数据
        this.dialogData.otherQualificationsName = this.checkTableDataList[0].qualificationsName === '毕业证书' || this.checkTableDataList[0].qualificationsName === '学位证书' || this.checkTableDataList[0].qualificationsName === '幼儿教师资格证' || this.checkTableDataList[0].qualificationsName === '保育员资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园园长资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园保健医生上岗证' ? '' : this.checkTableDataList[0].qualificationsName
        this.dialogData.qualificationsPath = this.checkTableDataList[0].qualificationsPath
        this.dialogData.createBy = this.checkTableDataList[0].createBy
        this.dialogData.modifyBy = this.checkTableDataList[0].modifyBy
        this.dialogData.createDate = this.checkTableDataList[0].createDate
        this.dialogData.modifyDate = this.checkTableDataList[0].modifyDate
        this.dialogData.fileName = ''
      } else {
        this.$message({
          type: 'warning',
          message: '请选择证书'
        })
      }
    },
    beUploadFn (file) { // 文件上传之前
      this.fileUploadStatus = true
      this.dialogData.fileName = file.name
    },
    fileUploadSucFn (response, file, fileList) { // 文件上传成功
      this.fileUploadStatus = false
      if (response.code >= 1) {
        this.dialogData.qualificationsPath = response.list[1]
        this.$message.success('文件上传成功！')
      } else {
        this.$message.error('文件上传失败！')
      }
    },
    winConfirmFn () { // 新增编辑确认
      if (!this.dialogData.qualificationsName && !this.dialogData.otherQualificationsName) {
        this.$message.error('请填写类型')
        return false
      }
      if (!this.dialogData.fileName) {
        this.$message.error('请先上传图片')
        return false
      }
      if (this.dialogData.otherQualificationsName) {
        this.dialogData.qualificationsName = this.dialogData.otherQualificationsName
      }
      this.checkTableDataList = []
      this.$refs.multipleTable.clearSelection()
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: this.dialogData.qualificationsId === null ? 'baseInfo/staffManage/staffInfoInsert' : 'baseInfo/staffManage/staffInfoUpdate',
        data: this.dialogData
      })
        .then(res => {
          this.fullscreenLoading = false
          this.getdataFn()
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
      this.dialogAddOrEditVisible = false
    },
    deleteFn () { // 删除证书
      if (this.checkTableDataList.length === 0) {
        this.$message.warning('请选择证书!')
        return false
      }
      this.fullscreenLoading = true
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delArr = []
        this.checkTableDataList.forEach(re => {
          delArr.push(re.qualificationsId)
        })
        this.fullscreenLoading = true
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/staffManage/staffInfoDelete',
          data: delArr
        })
        .then(res => {
          this.fullscreenLoading = false
          for (let index = this.tableData.length - 1; index >= 0; index--) { // 本地删除
            const obj = this.tableData[index]
            this.checkTableDataList.forEach((v, k) => {
              if (obj.qualificationsId === v.qualificationsId) {
                this.tableData.splice(index, 1)
              }
            })
          }
          this.$message.success('删除成功')
          this.checkTableDataList = []
          this.$refs.multipleTable.clearSelection()
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
        this.checkTableDataList = []
        this.$refs.multipleTable.clearSelection()
      })
    },
    saveFn () { // 保存
      this.isShowBtn = 0
      this.checkTableDataList = []
      this.$refs.multipleTable.clearSelection()
    },
    certificateClickFn (row) { // 打开弹窗
      this.imgDialogName = row.qualificationsName
      this.imgUrl = this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + row.qualificationsPath.slice(1)
      this.dialogPictureVisible = true
    },
    showLargerFn (value) { // 查看原图
      window.open(this.imgUrl)
    }
  }
}
