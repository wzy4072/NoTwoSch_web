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
      constitutionList: [], // 章程列表
      noticeTypeList: [], // 章程类型列表
      searchstr: '', // 表格模糊查询
      tableData: [],
      copyData: [],
      currRow: {}, // 当前章程
      historyLayer: false, // 历史版本章程弹框
      detailsLayer: false, // 章程详细信息弹框
      detailsLayerData: {}, // 详情数据
      searchFiledArr: ['scoreStr', 'title', 'version', 'noticeTypeStr', 'sendName'] // 模糊查询 字段
    }
  },
  mounted () {
    this.baseUrl = this.$api.baseUrl
    // 获取token
    this.token = sessionStorage.getItem('user_token')
    this.getTypeList() // 获取章程类型列表
  },
  methods: {
    getTypeList () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/dictConf/selectDictConfListByType',
        data: {
          'dictType': 'NOTICE_CATEGORY_ZC'
        }
      }).then(res => {
        this.noticeTypeList = res.data.list
        this.getPageData() // 获取章程列表
      })
    },
    getPageData () {
      let that = this
      this.$ajax({
        method: 'get',
        url: 'baseInfo/statuteMang/getStatuteListKrten'
      }).then(res => {
        let typeList = []
        this.constitutionList = res.data.list
        this.tableData = this.constitutionList.map((item) => {
          typeList.push(item.type)
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
          let result = that.constitutionList.some((subItem) => {
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
    tableOpa (type, row) {
      if (type == 4) { // 4 历史版本
        this.historyLayer = true
        this.currRow = row
      } else if (type == 3 || !type) { // 3 or 0 查看
        this.detailsLayer = true
        row.atts = this.getAttr(row)
        this.detailsLayerData = row
        // 处理创建时间
        this.detailsLayerData.createTime = this.$api.getDateAll(this.detailsLayerData.createTime, '-', 'hm')
      } else { // 编辑 + 更新
        if (type == 1) { // 1 编辑
          sessionStorage.setItem('CmCurrConstitution', JSON.stringify(row))
        } else { // 2 更新
          sessionStorage.removeItem('CmCurrConstitution')
        }
        this.$router.push({ path: '/ConstitutionManagement/CUpdate' })
      }
    }
  },
  watch: {
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
