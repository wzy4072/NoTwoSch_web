import tableBar from '@/common/components/tableBar'
export default {
  components: {tableBar},
  data () {
    return {
      searchstr: '',
      fullscreenLoading: false,
      tableData: [],
      printOb: {// 打印所需
        pageNum: 1,
        title: '幼儿园教师资历列表'
      },
      scrColumn: [// 表头
            {text: '姓名', selected: true},
            {text: '性别', selected: true},
            {text: '岗位', selected: true},
            {text: '任教科目', selected: true},
            {text: '最高学历', selected: true},
            {text: '相关证书', selected: true},
            {text: '更新时间', selected: true}
      ],
      baseUrl: '',
      currRow: {}, // 当前行数据
      showLayer1: false, // 是否显示证书弹框
      showLayer2: false // 是否显示姓名内容弹框
    }
  },
  mounted () { // 进页面默认执行方法
    this.baseUrl = this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url='
        // 查询资历列表
    this.fullscreenLoading = true
        // 获取幼儿园列表
    this.$ajax({
      method: 'post',
      url: 'baseInfo/staffManage/staffQualifications'
    }).then((res) => {
      debugger
      this.tableData = Object.assign([], res.data.data)
          // 截取相关证书 名称+地址
      this.tableData.forEach(function (val) {
        val.qualificationsName = val.qualificationsName ? val.qualificationsName.split(',') : []
        val.qualificationsPath = val.qualificationsPath ? val.qualificationsPath.split(',') : []
      })
      debugger
      this._tableData = Object.assign([], this.tableData)
    })
  },
  methods: {
    searchFun () {
      if (this.searchstr !== '') {
        this.fullscreenLoading = true
        let tempArr = []
        let that = this
        document.querySelectorAll('.el-table__body-wrapper table tr').forEach(function (tr, key) {
          tr.innerText.trim().replace(/\s/g, '').indexOf(that.searchstr) > -1 && tempArr.push(key)
        })
        this.tableData = this.tableData.filter((o, k) => {
          return tempArr.indexOf(k) > -1
        })
      } else {
        this.tableData = this._tableData
      }
      this.fullscreenLoading = false
    },
    picture (url) { // 图片点击原图
      window.open(this.baseUrl + url.slice(1))
    },
        // 转换时间
    transDate (row, column, cellValue) {
      if (!cellValue) return ''
      return this.$api.getDateAll(cellValue, '-')
    },
    openLayer (row, type) { // type 1 教师详情 2 资历证书
      this.currRow = row
      if (type === 1) {
        this.showLayer1 = true
      } else {
        if (row.qualificationsName.length) {
          this.showLayer2 = true
        } else {
          this.$message.warning('没有证书图片')
          this.showLayer2 = false
        }
      }
    }
  }
}
