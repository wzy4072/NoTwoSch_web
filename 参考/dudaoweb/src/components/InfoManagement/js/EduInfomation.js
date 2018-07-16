import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default{
  components: { tableBar, returnBtn },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      printOb: {
        pageNum: 1,
        title: '教育局用户信息列表'
      }, // 打印
      scrColumn: {
        superintendentName: {text: '姓名', selected: true, field: 'superintendentName'},
        superintendentGenderText: {text: '姓别', selected: true, field: 'superintendentGenderText'},
        superintendentPositionName: {text: '职务', selected: true, field: 'superintendentPositionName'},
        superintendentTel: {text: '手机号码', selected: true, field: 'superintendentTel'},
        certificatesTypetxt: {text: '证件类型', selected: true, field: 'certificatesTypetxt'},
        certificatesNum: {text: '证件号码', selected: true, field: 'certificatesNum'}
      }, // 表格筛选
      searchstr: '',
      multipleSelection: [], // 选中数据的数组
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      copyData: []
    }
  },
  mounted () {
    this.getPageData() // 获取数据
  },
  methods: {
    getPageData () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduInfoManager/selectEduList',
        data: {}
      }).then((re) => {
        this.fullscreenLoading = false
       // 使用分页
        this.copyData = Object.assign([], re.data.list)
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = re.data.list.length
        this.tableData.forEach((val) => {
          val.superintendentGenderText = val.superintendentGender === 1 ? '男' : '女'
          switch (val.certificatesType) {
            case 1:
              val.certificatesTypetxt = '身份证'
              break
            case 2:
              val.certificatesTypetxt = '香港特区护照/身份证'
              break
            case 3:
              val.certificatesTypetxt = '澳门特区护照/身份证 '
              break
            case 4:
              val.certificatesTypetxt = '台湾居民来往大陆通行证'
              break
            case 5:
              val.certificatesTypetxt = '护照'
              break
            case 6:
              val.certificatesTypetxt = '其他'
              break
          }
        })
      }).catch((err) => {
        this.$message.error('错误提示：' + err)
      })
    },
    addUser () {
      // 添加用户，教育局用户信息补录
      this.$router.push({
        path: '/InfoManagement/EduInfoSupplement'
      })
    },
    editComfrim (row) {
      sessionStorage.setItem('userInfo', JSON.stringify(row))
      this.$router.push({
        path: '/InfoManagement/EduInfoSupplement?sourceHtml=userEdit'
      })
    },
    infoImport () {
      // 批量导入 ,跳转到教育局用户信息批量导入页面
      this.$router.push({
        path: '/InfoManagement/EduInfoImport'
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    checkSelectable (row) {
      return row
    },
    deleteItem () {
      let deletArry = this.multipleSelection.map((re) => {
        return re.superintendentId
      })
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduInfoManager/deleteEduInfo',
        data: deletArry
      }).then((re) => {
        this.$message.success('删除成功')
        this.getPageData()
        this.dialogVisible = false
      }).catch((err) => {
        this.$message.error('错误提示:' + err)
      })
    },
    searchFun () {

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
    searchstr: function (newVal, oldVal) { // 有筛选列模糊搜索
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return Object.values(this.scrColumn).filter((item) => {
          return item.selected
        }).some(d => {
          return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
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
