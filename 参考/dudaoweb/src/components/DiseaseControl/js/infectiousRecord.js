import exportBtn from '@/common/components/exportBtn'
import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {exportBtn, tableBar, returnBtn},
  data () {
    return {
      searchstr: '',
      total: 0,
      size: 50,
      currentPage: 1,
      printOb: {// 打印所需
        pageNum: 1,
        title: '幼儿园儿童传染病登记表'
      },
      dialogVisible: false, // 删除弹框
      copyData: [],
      tableData: [], // 表格
      scrColumn: { // 表头（有筛选列模糊搜索字段）
        studentName: { text: '姓名', selected: true, field: 'studentName' },
        sex: { text: '性别', selected: true, field: 'sex' },
        age: { text: '年龄', selected: true, field: 'age' },
        gradeClassName: { text: '班级', selected: true, field: 'gradeClassName' },
        diseaseDateStr: { text: '发病日期', selected: true, field: 'diseaseDateStr' },
        diagnosisDateStr: { text: '诊断日期', selected: true, field: 'diagnosisDateStr' },
        diseaseName: { text: '疾病名称', selected: true, field: 'diseaseName' },
        diagnosisCompany: { text: '确诊单位', selected: true, field: 'diagnosisCompany' },
        reportDateStr: { text: '报告日期', selected: true, field: 'reportDateStr' },
        treatmentMethodStr: { text: '处理办法', selected: true, field: 'treatmentMethodStr' },
        returnDateStr: { text: '返园日期', selected: true, field: 'returnDateStr' },
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
        url: 'disease/healthrecords/selectConfirmedRecord'
      }).then(data => {
        // 处理数据
        data.data.data.forEach((v, k) => {
          v.age = v.studentAge ? this.getAge(v.studentAge) : '-'
          v.diseaseDateStr = v.diseaseDate ? this.$api.getDateAll(v.diseaseDate, '-') : '-'
          v.diagnosisDateStr = v.diagnosisDate ? this.$api.getDateAll(v.diagnosisDate, '-') : '-'
          v.reportDateStr = v.reportDate ? this.$api.getDateAll(v.reportDate, '-') : '-'
          v.treatmentMethodStr = v.treatmentMethod === 1 ? '住院就诊' : v.treatmentMethod === 2 ? '留园隔离观察' : v.treatmentMethod === 3 ? '回家' : '-'
          v.returnDateStr = v.returnDate ? this.$api.getDateAll(v.returnDate, '-') : '-'
        })
        this.copyData = Object.assign([], data.data.data) // 备份数据
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.copyData.length
        // 恢复 分页 初始数据
        this.size = 50
        this.currentPage = 1
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
    addRecord () {
      // 添加检查记录
      this.$router.push({
        path: '/DiseaseControl/addInfectious'
      }
      )
    },
    handleEdit (index, data) { // 编辑
      sessionStorage.setItem('infeRecordData', JSON.stringify(data))
      this.$router.push({
        path: '/DiseaseControl/addInfectious?sourceHtml=infeRecordEdit'
      })
    },
    handleDelete (index, data) { // 删除
      this.$ajax({
        method: 'post',
        url: 'disease/healthrecords/deleteConfirmedRecord',
        data: {
          registerId: data.registerId
        }
      }).then(re => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(err => {
        console.log(err)
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
    searchstr: function (newVal, oldVal) {
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
