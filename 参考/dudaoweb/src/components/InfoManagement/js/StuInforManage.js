import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
let titleData = [[ // 所有表头
  { text: '姓名', field: 'studentName', selected: true },
  { text: '年级', field: 'gradeName', selected: true },
  { text: '年级代码', field: 'gradeCode', selected: true, width: 120 },
  { text: '班级', field: 'className', selected: true, width: 80 },
  { text: '座号', field: 'seatNum', selected: true, width: 80 },
  { text: '入学代码', field: 'entranceCode', selected: true, width: 120 },
  { text: '性别', field: 'studentGenderName', selected: true, width: 80 }
], [
  // 基本信息
  { text: '民族', field: 'userNationName', selected: true, width: 80 },
  { text: '身高', field: 'studentHeight', selected: true, width: 80 },
  { text: '血型', field: 'bloodType', selected: true, width: 80 },
  { text: '健康状况', field: 'studentHealth', selected: true, width: 120 },
  { text: '第几胎', field: 'childrenListIndex', selected: true, width: 90 },
  { text: '家庭子女数', field: 'childrenListSize', selected: true, width: 130 },
  { text: '入学日期', field: 'entranceDate', selected: true, width: 120 },
  { text: '出生日期', field: 'userBirthday', selected: true, width: 120 },
  { text: '证件类型', field: 'certificatesType', selected: true, width: 120 },
  { text: '证件号码', field: 'certificatesNum', selected: true },
  { text: '现居住地址', field: 'addressAddr', selected: true, width: 130 },
  { text: '家长联系电话', field: 'contactTele', selected: true, width: 160 },
  // 家长信息
  { text: '家长姓名', field: 'parentName', selected: true },
  { text: '家长关系', field: 'parentRelationship', selected: true },
  { text: '家长联系电话', field: 'contactTele', selected: true },
  { text: '家长工作单位', field: 'workUnit', selected: true },
  { text: '是否为监护人', field: 'isGuardian', selected: true },
  { text: '证件类型', field: 'parentIdType', selected: true },
  { text: '证件号码', field: 'parentIdNum', selected: true },
  // 户籍信息
  { text: '现居住地址', field: 'addressAddr', selected: true },
  { text: '户口性质', field: 'householdsType', selected: true },
  { text: '籍贯所在地', field: 'householdsArea', selected: true },
  { text: '户口所在地', field: 'householdsAddr', selected: true },
  // 其他信息
  { text: '是否为独生子女', field: 'onlyChildren', selected: true },
  { text: '是否为港澳台侨外', field: 'studentGatqw', selected: true },
  { text: '是否为留守儿童', field: 'studentLeftBehine', selected: true },
  { text: '是否为进城务工人员随迁子女', field: 'studentRuralUrbanChild', selected: true },
  { text: '是否为孤儿', field: 'studentOrphan', selected: true },
  { text: '是否为烈士或优抚子女', field: 'studentMartyr', selected: true },
  { text: '残疾人类型', field: 'studentDisableType', selected: true },
  { text: '上下学交通方式', field: 'studentTransborationType', selected: true },
  { text: '是否乘坐校车', field: 'studentSchoolBus', selected: true },
  { text: '上下学交通距离(KM)', field: 'studentDistance', selected: true }
]]
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      searchstr: '', // 模糊搜索字符串
      activeName: '0', // 当前tab
      isSelection: 0, // 按钮显示
      tableData: [],
      copyData: [],
      scrColumn: [], // 表头（特殊筛选列增加field字段->不同于标准页）
      printOb: {
        pageNum: 1,
        title: '学生基本信息列表'
      },
      total: 0, // 数据总条数
      size: 50, // 每页数据条数
      currentPage: 1 // 当前页数
    }
  },
  mounted () {
    // 初始加载数据
    this.scrColumn = titleData[0].concat(titleData[1].slice(0, 12))
    this.intPage()
  },
  methods: {
    handleClick (tab, event) {
      var start, end
      switch (tab.name) {
        case '0':
          start = 0
          end = 12
          this.printOb.title = '学生基本信息列表'
          break
        case '1':
          start = 12
          end = 19
          this.printOb.title = '学生家长信息列表'
          break
        case '2':
          start = 19
          end = 23
          this.printOb.title = '学生户籍信息列表'
          break
        case '3':
          start = 23
          end = 33
          this.printOb.title = '学生其他信息列表'
          break
        case '4':
          start = 0
          end = 33
          this.printOb.title = '学生全部信息列表'
          break
        default:
          break
      }
      this.scrColumn = titleData[0].concat(titleData[1].slice(start, end))
    },
    // 加载所有数据的方法
    intPage () {
      var _this = this
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'baseInfo/stuInfo/selectStuListByKrten/1', // +1
        data: {}
      }).then((re) => {
        this.fullscreenLoading = false
        if (re.data.code > 0) {
          let studentHealthStr = ['', '健康', '良好', '一般', '差']
          let certificatesType = ['', '身份证', '香港特区护照/身份证', '澳门特区护照/身份证', '台湾居民来往大陆通行证', '护照', '其他']
          let parentIdTypeStr = ['', '居民身份证', '护照', '其他']
          let householdsType = ['', '农业户口', '非农户口']
          let yesOrNo = ['否', '是']
          let studentTransborationType = ['', '家长接送', '校车接送', '其他']
          re.data.list.forEach(function (v, k) {
            v.studentHealth = studentHealthStr[v.studentHealth]
            v.certificatesType = certificatesType[v.certificatesType]
            v.parentIdType = parentIdTypeStr[v.parentIdType]
            v.householdsType = householdsType[v.householdsType]
            v.onlyChildren = v.childrenListSize === 1 ? '是' : '否'
            v.entranceDate = _this.$api.getDateAll(v.entranceDate, '-')
            v.userBirthday = _this.$api.getDateAll(v.userBirthday, '-')
            v.studentGatqw = yesOrNo[v.studentGatqw]
            v.studentLeftBehine = yesOrNo[v.studentLeftBehine]
            v.studentOrphan = yesOrNo[v.studentOrphan]
            v.studentRuralUrbanChild = yesOrNo[v.studentRuralUrbanChild]
            v.studentMartyr = yesOrNo[v.studentMartyr]
            v.studentDisableType = yesOrNo[v.studentDisableType]
            v.studentTransborationType = studentTransborationType[v.studentTransborationType]
            v.studentSchoolBus = yesOrNo[v.studentSchoolBus]
            v.isGuardian = yesOrNo[v.isGuardian]
          })
          this.copyData = re.data.list
          this.total = re.data.list.length
          this.tableData = this.copyData.slice(0, this.size * 1)
        } else {
          this.$message.error(re.data.desc)
        }
      })
    },
    handleJump (index, row) {
      // 表内事件
      console.log(index, row)
      this.$router.push({ path: '/InfoManagement/StuInfoCheck', query: { stduentId: row.stduentId } })
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
    handleSelectionChange (SelecList) {
      this.SelecList = SelecList
      if (SelecList.length > 0) {
        this.isSelection = 1
      } else {
        this.isSelection = 0
      }
    },
    delStu () {
      let sendData = this.SelecList.map((v, k) => {
        return {
          'stduentId': v.stduentId,
          'userId': v.userId
        }
      })
      this.$confirm('确认删除该学生?此操作不可撤销!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fullscreenLoading = true
        this.$ajax({
          method: 'post',
          url: 'baseInfo/stuInfo/deleteStudent',
          data: sendData
        }).then((re) => {
          this.fullscreenLoading = false
          if (re.data.code > 0) {
            this.$message.error(re.data.desc)
            this.intPage()
          } else {
            this.$message.error(re.data.desc)
          }
        })
      })
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.scrColumn.filter((item) => { return item.selected }).some(d => {
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
