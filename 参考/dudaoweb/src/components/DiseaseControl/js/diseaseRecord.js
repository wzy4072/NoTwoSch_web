import exportBtn from '@/common/components/exportBtn'
import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {exportBtn, tableBar, returnBtn},
  data () {
    return {
      searchstr: '', // 表格模糊搜索
      printOb: {// 打印所需
        pageNum: 1,
        title: '儿童晨检、全日观察及患病情况记录表'
      },
      dialogVisible: false, // 删除弹框
      total: 0,
      size: 50,
      currentPage: 1,
      tableData: [], // 表格
      copyData: [],
      scrColumn: { // 表头（有筛选列模糊搜索字段）
        checkDateStr: { text: '检查日期', selected: true, field: 'checkDateStr' },
        studentName: { text: '姓名', selected: true, field: 'studentName' },
        sex: { text: '性别', selected: true, field: 'sex' },
        age: { text: '年龄', selected: true, field: 'age' },
        parentAutobiography: { text: '家长自述', selected: true, field: 'parentAutobiography' },
        abnormalCondition: { text: '异常情况', selected: true, field: 'abnormalCondition' },
        handlingOpinionsTxt: { text: '处理意见', selected: true, field: 'handlingOpinionsTxt' },
        infoStr: { text: '确诊信息', selected: true, field: 'infoStr' },
        otherField: { text: '操作', selected: true, field: 'otherField', noSearch: true } // 功能列（不进行模糊搜索）
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$ajax({
        method: 'get',
        url: 'disease/healthrecords/selectRecordList'
      }).then(data => {
        data.data.data.forEach((v, k) => {
          v.checkDateStr = this.$api.getDateAll(v.checkTime)
          v.age = v.studentAge ? this.getAge(v.studentAge) : '-'
          v.parentAutobiography = v.parentAutobiography ? v.parentAutobiography : '-'
          v.handlingOpinionsType === 1 ? v.handlingOpinionsTxt = '隔离治疗' : v.handlingOpinionsTxt = '在圆观察'
          v.handlingOpinionsTxt = v.handlingOpinionsTxt + '。' + v.handlingOpinions
          v.handlingOpinionsTxt = v.handlingOpinionsTxt ? v.handlingOpinionsTxt : '-'
          // 确诊信息str
          v.infoStr = v.info == '0' ? '待添加' : '已添加'
        })
        this.copyData = Object.assign([], data.data.data) // 备份数据
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.copyData.length
      })
    },
    addRecord () {
      // 添加检查记录
      this.$router.push({
        path: '/DiseaseControl/addRecord'
      })
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
    exportExcel () {
      // 导出excel
    },
    handleEdit (index, data) { // 编辑
      sessionStorage.setItem('recordEdit', JSON.stringify(data))
      this.$router.push({
        path: '/DiseaseControl/addRecord?sourceHtml=recordEdit'
      })
    },
    handleDelete (index, data) { // 删除
      this.$ajax({
        method: 'post',
        url: 'disease/healthrecords/deleteRecords',
        data: {'recordId': data.recordId}
      }).then(re => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    handleClick (data) { // 待添加
      this.$router.push({
        path: '/DiseaseControl/addInfectious?wait=recordWait',
        query: {
          studentId: data.studentId,
          recordId: data.recordId
        }
      })
    },
    getAge (value) {
      let year = new Date(value).getFullYear()
      let curYear = new Date().getFullYear()
      if (year) {
        return curYear - year
      }
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
          return item.selected && !item.noSearch
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
