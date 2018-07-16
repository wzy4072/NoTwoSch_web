import tableBar from '@/common/components/tableBar'
export default {
  components: { tableBar },
  data () {
    return {
      isEdit: false, // 是否编辑状态
      token: { 'authorization': sessionStorage.getItem('user_token') },
      baseUrl: '',
      tableData: [],
      missListLayer: false,
      missTable: [],
      scrColumn: [
        { text: '姓名', field: 'studentName' },
        { text: '性别', field: 'studentGenderName', width: 80 },
        { text: '入学日期', field: 'entranceDateStr', width: 120 },
        { text: '入学代码', field: 'entranceCode', width: 120 },
        { text: '年级', field: 'gradeName' },
        { text: '年级代码', field: 'gradeCode', width: 120 },
        { text: '班级', field: 'className', width: 80 },
        { text: '座号', field: 'seatNum', width: 80 },
        { text: '出生日期', field: 'userBirthday', width: 120 },
        { text: '家长联系电话', field: 'contactTele', width: 160 }
      ]
    }
  },
  mounted () {
    // 进页面默认执行方法
    // 初始加载数据
    this.baseUrl = this.$api.baseUrl
  },
  methods: { // 方法不会执行 调用的时候才执行
    submitForm (formName) {
      let sendData = this.tableData.map((v, k) => {
        return {
          studentName: v.studentName,
          studentGenderName: v.studentGenderName,
          entranceDate: v.entranceDate,
          entranceCode: v.entranceCode,
          gradeName: v.gradeName,
          gradeCode: v.gradeCode,
          className: v.className,
          seatNum: v.seatNum,
          userBirthday: v.userBirthday,
          contactTele: v.contactTele
        }
      })

      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuInfo/saveStudentList',
        data: sendData
      }).then((re) => {
        this.fullscreenLoading = false
        if (re.data.code > 0) {
          if (re.data.data.missList.length > 0) {
            this.missTable = re.data.data.missList
            this.missListLayer = true
          } else {
            this.$message({
              message: '批量导入成功!',
              type: 'success'
            })
            this.isEdit = false
          }
        } else {
          this.$message.error(re.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    resetForm (formName) {
      this.$confirm('确定取消导入?此次上传的消息将被清空', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isEdit = false
      })
    },
    upload (response, file, fileList) { // 文件上传成功
      if (response.code > 0) {
        response.list.forEach((v, k) => {
          v.entranceDateStr = this.$api.getDateAll(v.entranceDate, '-')
        })
        this.tableData = response.list
        this.isEdit = true
      } else {
        this.$message.error('文件上传失败:' + response.desc)
      }
    }
  }
}
