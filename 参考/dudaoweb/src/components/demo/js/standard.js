import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn }, // 表格功能组件 返回键
  data () {
    return {
      total: 0, // 数据总条数
      size: 50, // 每页数据条数
      currentPage: 1, // 当前页数
      tableData: [ // 表格当前页数据
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' },
        { 'weid': '学段', 'biaoq': '小学；初中；高中上海', 'fixField1': '固定内容1' }
      ],
      copyData: [], // 表格所有数据
      searchstr1: '', // 表格模糊查询字段
      searchstr2: '', // 表格模糊查询字段
      scrColumn: { // 表头（有筛选列模糊搜索字段）
        weid: { text: '纬度', selected: true, field: 'weid' },
        biaoq: { text: '标签', selected: true, field: 'biaoq' },
        fixField: { text: '固定内容列', selected: true, value: '固定内容' }, // value 为固定内容默认值
        otherField: { text: '操作', selected: true, noSearch: true } // 不进行模糊搜索列
      },
      // searchFiledArr: ['weid', 'biaoq', 'fixField'], // last version
      searchFiledArr: [ // 无筛选列模糊搜索字段数组
        {field: 'weid', value: null},
        {field: 'biaoq', value: null},
        {value: '固定内容'}, // value 为固定内容默认值
        {field: 'otherField', noSearch: true} // 不进行模糊搜索列
      ],
      options: [ // 选项列表
        { value: '选项1', label: '黄金糕' },
        { value: '选项2', label: '双皮奶' },
        { value: '选项3', label: '蚵仔煎' },
        { value: '选项4', label: '龙须面' },
        { value: '选项5', label: '北京烤鸭' }
      ],
      value1: '', // 当前单选
      value2: '', // 当前多选
      date: '', // 当前时间
      tab: '1', // 当前tab
      printOb: { // 打印所需
        pageNum: 1,
        title: '待打印表格的名称'
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData () {
      this.copyData = Object.assign([], this.tableData) // 实际copyData为获取的所有数据
      this.tableData = this.copyData.slice(0, this.size * 1)
      this.total = this.copyData.length
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
    getSummaries (param) { // 自定义合计方法 参数：columns + data
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === 'weid') {
          sums[index] = '总价'
          return
        }
        if (column.property === 'index') {
          sums[index] = '-'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  },
  watch: {
    searchstr1 (newVal, oldVal) { // 有筛选列模糊搜索
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
    },
    searchstr2 (newVal, oldVal) { // 无筛选列模糊搜索
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.searchFiledArr.filter((item) => {
          return !item.noSearch
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
