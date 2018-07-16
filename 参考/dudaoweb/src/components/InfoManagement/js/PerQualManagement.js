import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      token: '', // token 信息
      fullscreenLoading: false,
      tableData: [],
      checkTableDataList: [],
      workerData: {
        workerName: '',
        workerGender: '',
        workerTypeName: '',
        courseName: '',
        highestEducation: ''
      },
      isShowBtn: 0,
      certificateType: ['毕业证书', '学位证书', '幼儿教师资格证', '保育员资格证', '幼儿园园长资格证', '幼儿园保健医生上岗证', '其他类型'],
      dialogData: {
        'qualificationsId': null,
        'workerId': 1,
        'qualificationsName': '',
        'otherQualificationsName': '',
        'qualificationsPath': '',
        'createBy': null,
        'modifyBy': null,
        'createDate': null,
        'modifyDate': null,
        'fileName': ''
      },
      fileUploadData: {},
      dialogName: '',
      dialogPictureVisible: false,
      imgUrl: null,
      dialogAddOrEditVisible: false,
      dialogAddOrEditTitle: '',
      fileUploadStatus: false,
      uploadUrl: ''
    }
  },
  mounted () {
    this.uploadUrl = this.$api.baseUrl + 'baseInfo/staffManage/updateStaffImg'
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/dictConf/selectDictConfLsit',
      data: {
        dictType: 'POSITION'
      }
    }).then(re => {
      this.workerTypeList = re.data.data
      this.getdataFn()
    }).catch(err => {
      this.$message.error('接口异常：' + err)
    })
    this.token = {'authorization': sessionStorage.getItem('user_token')}
  },
  methods: {
    getdataFn () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/staffManage/infoQualificationsManager',
        data: {}
      })
          .then(res => {
            this.fullscreenLoading = false
            if (res.data.data.worker.arg1 === null) {
              this.workerData.teaching = ''
            } else {
              let arg = new Date(res.data.data.worker.arg1)
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
            this.workerData.workerName = res.data.data.worker.workerName
            this.workerData.workerGender = res.data.data.worker.workerGender
            this.workerData.workerTypeName = this.workerTypeList.filter(re => re.dictCode === res.data.data.worker.workerType)[0].dictValue
            this.workerData.courseName = res.data.data.workerCourse.courseName ? res.data.data.workerCourse.courseName : ''
            this.workerData.highestEducation = res.data.data.worker.highestEducation
            this.dialogData.workerId = res.data.data.worker.workerId
            this.tableData = res.data.list
          })
          .catch(err => {
            this.fullscreenLoading = false
            this.$message.error('接口异常：' + err)
          })
    },
    selectTableFn (selection, row) { // 表格选择
      this.checkTableDataList = Array.prototype.slice.call(selection)
    },
    addFn () {
        // 新增证书
      this.dialogAddOrEditTitle = '新增证书'
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
      this.fileList = []
    },
    editFn () {
        // 编辑证书
      if (this.checkTableDataList.length > 0) {
        this.dialogAddOrEditVisible = true
        this.dialogAddOrEditTitle = '编辑证书'
        this.dialogData.qualificationsId = this.checkTableDataList[0].qualificationsId
        this.dialogData.qualificationsName = this.checkTableDataList[0].qualificationsName === '毕业证书' || this.checkTableDataList[0].qualificationsName === '学位证书' || this.checkTableDataList[0].qualificationsName === '幼儿教师资格证' || this.checkTableDataList[0].qualificationsName === '保育员资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园园长资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园保健医生上岗证' ? this.checkTableDataList[0].qualificationsName : '其他类型'
        this.dialogData.otherQualificationsName = this.checkTableDataList[0].qualificationsName === '毕业证书' || this.checkTableDataList[0].qualificationsName === '学位证书' || this.checkTableDataList[0].qualificationsName === '幼儿教师资格证' || this.checkTableDataList[0].qualificationsName === '保育员资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园园长资格证' || this.checkTableDataList[0].qualificationsName === '幼儿园保健医生上岗证' ? '' : this.checkTableDataList[0].qualificationsName
        this.dialogData.qualificationsPath = this.checkTableDataList[0].qualificationsPath
        this.dialogData.createBy = this.checkTableDataList[0].createBy
        this.dialogData.modifyBy = this.checkTableDataList[0].modifyBy
        this.dialogData.createDate = this.checkTableDataList[0].createDate
        this.dialogData.modifyDate = this.checkTableDataList[0].modifyDate
        this.dialogData.fileName = ''
      } else {
        this.$message({
          type: 'error',
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
      }).then(res => {
        this.fullscreenLoading = false
        this.getdataFn()
      }).catch(err => {
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
        }).then(res => {
          this.fullscreenLoading = false
          for (let index = this.tableData.length - 1; index >= 0; index--) {
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
        }).catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    saveFn () { // 保存
      this.isShowBtn = 0
      this.checkTableDataList = []
      this.$refs.multipleTable.clearSelection()
    },
    certificateClickFn (row) { // 打开弹窗
      this.dialogName = row.qualificationsName
      this.imgUrl = this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + row.qualificationsPath.slice(1)
      this.dialogPictureVisible = true
    },
    showLargerFn (value) { // 查看原图
      window.open(this.imgUrl)
    }
  }
}
