import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      token: '',
      atts: [],
      dialogVisible2: false,
      total: 0, // 数据总条数
      size: 20, // 每页数据条数
      currentPage: 1, // 当前页数
      baseUrl: '',
      noticeTypeList: [], // 章程类型列表
      kindergartenList: [], // 幼儿园列表及幼儿园章程信息
      schoolList: [], // 幼儿园列表
      currKindergarten: '', // 当前选中幼儿园
      searchstr: '', // 表格模糊查询
      currIndex: null, // 当前审批行
      tableData: [],
      copyData: [],
      currRow: {}, // 当前章程
      historyLayer: false, // 历史版本章程弹框
      innerVisible: false, // 内层弹框
      detailsLayer: false, // 章程详细信息弹框 审核 + 更改
      detailsLayerMark: 0, // 1: 审核通过  2:更改评分
      detailsLayerData: {}, // 详情数据
      searchFiledArr: ['scoreStr', 'title', 'version', 'noticeTypeStr'] // 模糊查询 字段
    }
  },
  mounted () {
    this.baseUrl = this.$api.baseUrl
    // 获取token
    this.token = sessionStorage.getItem('user_token')
    this.getTypeList() // 获取章程类型列表
    this.getKindSchoolList() // 获取幼儿园列表
  },
  methods: {
    getKindSchoolList () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/kindergapten/krtenInfo'
      }).then(res => {
        this.schoolList = res.data.data
        this.currKindergarten = this.schoolList[0].krtenCode // 当前幼儿园
      })
    },
    getTypeList () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/dictConf/selectDictConfListByType',
        data: {
          'dictType': 'NOTICE_CATEGORY_ZC'
        }
      }).then(res => {
        this.noticeTypeList = res.data.list
      })
    },
    name_function2 (row) {
      this.dialogVisible2 = true
      row.atts = this.getAttr(row)
      if (row.atts.length > 0) {
        row.atts.forEach((item) => {
          item.name = item.attName
        })
        console.log(row.atts)
        this.atts = row.atts
      }
    },
    getAttr (row) {
      let obj = {}
      obj = this.noticeTypeList.find((item) => {
        return item.dictName === row.noticeTypeStr
      })
      return obj.atts
    },
    handleRemove (file, fileList) { // 移除成功事件
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/deleteAtt',
        data: {
          'id': file.id
        }
      }).then((re) => {
        if (re.code === 1) {
          this.atts = fileList
        } else {
          this.$message.warning(re.desc)
        }
      })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除附件 ${file.name}？`)
    },
    handleSuccess (res, file, fileList) {
      if (res.code > 0) { // 上传成功
        res.data.attName = file.name
        res.data.name = file.name
        res.data.attSize = (res.data.attSize / 1024).toFixed(2)
        this.atts.push(res.data)
      } else {
        this.$message.error(res.desc)
      }
    },
    handleExceed (files, fileList) { // 上传文件个数限制
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
    },
    tableOpa (type, row, index) {
      if (type == 3) { // 历史版本
        this.historyLayer = true
        this.currRow = row
      } else { // 审核 + 查看
        if (type == 1) {
          this.detailsLayerMark = 1
          this.currIndex = index
        } else if (type == 2) {
          this.detailsLayerMark = 2
        } else {
          this.detailsLayerMark = 0
        }
        this.detailsLayer = true
        row.atts = this.getAttr(row)
        this.detailsLayerData = row
        // 增加myScore 字段 => 备份当前章程score值
        this.$set(this.detailsLayerData, 'myScore', this.detailsLayerData.score)
        // 处理创建时间
        this.detailsLayerData.createTime = this.$api.getDateAll(this.detailsLayerData.createTime, '-', 'hm')
      }
    },
    sureSetScore () {
      this.$confirm('确认审核通过？\n' + '操作无法被撤回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'post',
          url: 'baseInfo/statuteMang/editStatute',
          data: {
            'id': this.detailsLayerData.id,
            'noticeStatus': 3,
            'score': this.detailsLayerData.myScore
          }
        }).then(res => {
          this.$message.success('设置成功')
          this.innerVisible = false
          this.detailsLayerData.score = this.detailsLayerData.myScore
          this.tableData[this.currIndex].noticeStatus = 3
        })
      })
    }
  },
  watch: {
    currKindergarten (newVal) { // 幼儿园
      let that = this
      // 获取当前幼儿园对应章程信息
      this.$ajax({
        method: 'post',
        url: 'baseInfo/statuteMang/getStatuteListSuper',
        data: {krtenCode: newVal}
      }).then(res => {
        let currData = res.data.list // 章程列表
        this.tableData = currData.map((item) => {
          if (!item.list[0]) {
            return { noticeTypeStr: item.type }
          } else {
            item.list[0].scoreStr = item.list[0] == 1 ? '欠佳' : item.list[0] == 2 ? '尚可' : item.list[0] == 3 ? '良好' : '优异'
            item.list[0].historyData = []
            if (item.list.length) {
              item.list[0].historyData = item.list.slice(1)
            }
            return item.list[0]
          }
        })
        // 插入新数据（其他章程）
        this.noticeTypeList.forEach((item) => {
          let result = currData.some((subItem) => {
            return subItem.type == item.dictName
          })
          if (!result) { // 插入新数据
            that.tableData.push({noticeTypeStr: item.dictName, myField: true})
          }
        })
        // 为了和constitutionType页面顺序一致
        let arr = []
        this.noticeTypeList.forEach((item) => {
          this.tableData.forEach((item2) => {
            if (item2.noticeTypeStr === item.dictName) {
              arr.push(item2)
            }
          })
        })
        this.tableData = arr
        this.copyData = Object.assign([], this.tableData)
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.copyData.length
      })
    },
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
          return this.searchFiledArr.some(d => {
          return o[d] && ((typeof o[d] === 'string') ? o[d].indexOf(newVal) > -1 : o[d].toString().indexOf(newVal) > -1)
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
