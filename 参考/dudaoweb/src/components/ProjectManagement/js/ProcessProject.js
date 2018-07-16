import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn }, // 表格功能组件 返回键
  data () {
    return {
      tableData: '',
      dialogTitle: '',
      projectId: '',
      InputNumber1: '',
      InputNumber2: '',
      dialogVisible: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/selectProcesssspList'
      }).then(re => {
        this.tableData = re.data.data
      })
    },
    showDialog (type, index, data) {
      this.InputNumber1 = ''
      this.InputNumber2 = ''
      if (type === 1) {
        this.dialogVisible = true
        this.dialogTitle = '新建项目'
      } else if (type === 2) {
        this.dialogVisible = true
        this.dialogTitle = '编辑项目'
        this.projectId = data.projectId
        this.InputNumber1 = data.projectName.slice(0, data.projectName.indexOf('-'))
        this.InputNumber2 = data.projectName.slice(data.projectName.indexOf('-') + 1, data.projectName.indexOf('学年'))
      }
    },
    handleDelete (index, data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'post',
          url: 'procedural/Processsspm/deleteProcessssp',
          data: {'projectId': data.projectId}
        }).then(re => {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        }).catch(err => {
          this.$message.error('错误消息:' + err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveFuc () {
      if (!this.InputNumber1 || !this.InputNumber2) {
        this.$message.error('年份不能为空')
        return false
      }
      if (this.InputNumber1 >= this.InputNumber2) {
        this.$message.error('开始年份不能大于结束年份')
        return false
      }
      let projectName = this.InputNumber1 + '-' + this.InputNumber2 + '学年过程性专项督导'
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/addProcessssp',
        data: {
          'projectId': this.projectId,
          'projectName': projectName
        }
      }).then(re => {
        this.$message.success('保存成功')
        this.dialogVisible = false
        this.getData()
      })
    }
  },
  watch: {

  }
}
