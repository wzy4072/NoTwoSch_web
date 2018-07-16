import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn }, // 表格功能组件 返回键
  data () {
    return {
      searchstr: '', // 模糊查询data
      total: 0,
      size: 50,
      currentPage: 1,
      scrColumn: {
        workerName: { text: '姓名', selected: true, field: 'workerName' },
        workerGenderName: { text: '性别', selected: true, field: 'workerGenderName' },
        workerTypeName: { text: '岗位', selected: true, field: 'workerTypeName' },
        teaching: { text: '教学资历', selected: true, field: 'teaching' },
        highestEducationName: { text: '最高学历', selected: true, field: 'highestEducationName' },
        qualificationsArrStr: { text: '相关证书', selected: true, field: 'qualificationsArrStr' },
        modifyDate_: { text: '更新时间', selected: true, field: 'modifyDate_' }
      },
      printOb: { // 打印所需
        pageNum: 1,
        title: '教职工资历信息列表'
      },
      tableData: [], // 表格data
      copyData: [],
      dialogName: '', // 弹窗title
      imgUrl: '', // 证件照地址
      pictureData: [], // 证书信息
      dialogVisible: false // 控制弹窗显示影藏
    }
  },
  mounted () {
    // 获取数据
    this.fullscreenLoading = true
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/staffManage/staffQualifications',
      data: {}
    })
      .then(res => {
        this.fullscreenLoading = false
        res.data.data.forEach(re => {
          re.teaching = ''
          re.qualificationsArr = [] // 相关证书
          let [nameArr, urlArr] = [re.qualificationsName ? re.qualificationsName.split(',') : '', re.qualificationsPath ? re.qualificationsPath.split(',') : '']
          if (re.arg1 === null) {
            re.teaching = ''
          } else {
            let arg = new Date(re.arg1)
            let now = new Date()
            let chaYear = now.getFullYear() - arg.getFullYear()
            let chaMonth = now.getMonth() - arg.getMonth()
            if (chaMonth < 0) {
              chaYear -= 1
              chaMonth = 12 + chaMonth
            }
            if (chaYear > 0) {
              re.teaching = chaYear + '年'
            }
            if (chaMonth > 0) {
              re.teaching += chaMonth + '月'
            }
          }
          if (nameArr.length === urlArr.length) {
            for (let index = 0; index < nameArr.length; index++) {
              let obj = {}
              obj.qualificationsName = nameArr[index]
              obj.qualificationsPath = urlArr[index]
              re.qualificationsArr.push(obj)
            }
          }
          // 转换成字符串
          re.qualificationsArrStr = re.qualificationsArr.map((item, key) => {
            return item.qualificationsName + '.' + item.qualificationsPath.split('.')[re.qualificationsArr.length - 1]
          }).join('；')
        })
        this.copyData = Object.assign([], res.data.data)
        // 处理 更新时间
        let that = this
        this.copyData.forEach((item) => {
          item.modifyDate_ = that.$api.getDateAll(item.modifyDate, '-') || ''
        })
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.copyData.length
      })
  },
  methods: {
    nameClickFn (value) { // 名字点击函数
      sessionStorage.setItem('workerData', JSON.stringify(value))
      this.$router.push({ path: 'StaffSeniDetails' })
    },
    certificateClickFn (value) { // 点击证书
      this.dialogName = value[0].qualificationsName
      this.pictureData = value
      // this.imgUrl = this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + value.qualificationsPath.slice(1)
      this.dialogVisible = true
    },
    certificateChangeFn () {
      this.dialogName = this.pictureData[arguments[0]].qualificationsName
    },
    showLargerFn (value) { // 查看原图
      window.open(this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + value.qualificationsPath.slice(1))
    },
    dateFormatFn (row, column, cellValue) {
      // 表格时间格式转换
      let date = this.$api.getDateAll(cellValue, '-')
      return date || ''
    },
    handleClose () { // 弹窗关闭之前事件
      this.pictureData = null
    },
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copyData.slice(
                (this.currentPage - 1) * this.size,
                this.currentPage * this.size
            )
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    }
  },
  watch: {
    searchstr (newVal, oldVal) { // 有筛选列模糊搜索
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
