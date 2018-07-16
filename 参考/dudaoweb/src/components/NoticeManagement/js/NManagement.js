import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      total: 0, // 数据总条数
      size: 20, // 每页数据条数
      currentPage: 1, // 当前页数
      baseUrl: '',
      tableData: [], // 表格数据
      copyData: [], // 备份数据
      selectArr: [], // 已勾选数组
      currNotice: {}, // 当前公告
      searchFiledArr: ['title', 'noticeTypeStr', 'publicRangeStr', 'noticeStatusStr', 'sendName', 'createTime'], // 模糊查询 字段
      noticeDetailsLayer: false, // 公告详情弹框
      searchstr: '' // 表格模糊搜索
    }
  },
  mounted () {
    this.baseUrl = this.$api.baseUrl
    this.getTableData()
  },
  methods: {
    getTableData () { // 获取表格数据
      let that = this
      this.$ajax({
        method: 'get',
        url: 'baseInfo/noticeSys/getNoticeSysList'
      }).then(res => {
        this.copyData = Object.assign([], res.data.list)
        this.total = this.copyData.length
        // 处理时间 + 发布范围(1.教育局职工，2.幼儿园职工，3.幼儿园家长) + 公告状态
        this.copyData.forEach(element => {
          element.createTime = that.$api.getDateAll(element.createTime, '-', 'hm')
          element.noticeStatusStr = !element.noticeStatus ? '草稿' : '已发布'
          element.publicRangeStr = element.publicRange.split(',').map((item) => {
            return item == 1 ? '教育局职工' : item == 2 ? '幼儿园职工' : '幼儿园家长'
          }).join('，')
        })
        this.tableData = this.copyData.slice(0, this.size * 1)
      })
    },
    selectChange (selectArr) {
      this.selectArr = selectArr
    },
    tableOpa (type, row) {
      if (type == 4 || type == 3) { // 3:删除  4:批量删除
        if (type == 4 && !this.selectArr.length) {
          this.$message.error('请选择需要删除的公告')
          return false
        } else {
          let sendData = { ys: [], rs: [] } // ys->硬删除 rs->软删除
          if (type == 4) {
            this.selectArr.forEach((item) => {
              if (!item.noticeStatus) { // 草稿
                sendData.ys.push(item.id + '')
              } else { // 已发布
                sendData.rs.push(item.id + '')
              }
            })
          } else {
            if (!row.noticeStatus) { // 草稿
              sendData.ys.push(row.id + '')
            } else { // 已发布
              sendData.rs.push(row.id + '')
            }
          }
          // 询问框
          this.$confirm('是否删除该公告，删除后将无法恢复?', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax({
              method: 'post',
              url: 'baseInfo/noticeSys/delNoticeSysBatch',
              data: sendData
            }).then(res => {
              this.$message({type: 'success', message: '删除成功!'})
              this.getTableData() // 重新查询数据
            })
          }).catch(() => {
            this.$message({type: 'info', message: '已取消删除'})
          })
        }
      } else if (type == 1) { // 1:编辑
        sessionStorage.setItem('NmCurrNotice', JSON.stringify(row))
        this.$router.push({ path: '/NoticeManagement/AddNotice' })
      } else if (type == 5) { // 5:新建
        sessionStorage.removeItem('NmCurrNotice')
        this.$router.push({ path: '/NoticeManagement/AddNotice' })
      } else { // 2:查看
        this.currNotice = row
        this.noticeDetailsLayer = true
      }
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
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (this.searchstr.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.searchFiledArr.some(d => {
          return o[d] && ((typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
                .searchstr) > -1)
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
