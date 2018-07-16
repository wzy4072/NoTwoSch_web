
import tableBar from '@/common/components/tableBar'
export default {
  components: {
    tableBar
  },
  data () {
    return {
      token: '', // token 信息
      tableData: [], // 表格数据
      useData: null, // 二维码已使用的张数
      activeName: '5', // 当前tab
      checkQuestionnaire: '', // check问卷
      questionnaireList: [], // 问卷数组
      printOb: {
        // 打印所需
        pageNum: 1,
        title: '项目列表'
      },
      scrColumn: [
        // 表格列显示
        { text: '序号', selected: true },
        { text: '姓名', selected: true },
        { text: '性别', selected: true },
        { text: '岗位', selected: true },
        { text: '任教科目', selected: true },
        { text: '手机号码', selected: true },
        { text: '是否提交', selected: true }
      ],
      searchstr: '', // 搜索字段
      currentPage: 1, // 当前页数
      size: 50, // 每页条数
      total: 200 // 总条目数
    }
  },
  mounted () {
    this.getQuestionListFun()
    this.getTableDataFun()
    this.token = {'authorization': sessionStorage.getItem('user_token')}
  },
  methods: {
    getTableDataFun () {
      // 获取表格数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/selectProcess',
        data: {
          'questionnaireId': this.checkQuestionnaire,
          'userType': this.activeName
        }
      })
        .then(re => {
          this.fullscreenLoading = false
          this.tableData = re.data.list
          this.useData = re.data.data
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常' + err)
        })
    },
    getQuestionListFun () {
      // 获取问卷列表数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'feedback/question/selectQuesList',
        data: {}
      })
        .then(re => {
          this.fullscreenLoading = false
          this.questionnaireList = re.data.list
          this.checkQuestionnaire = re.data.list[0].questionnaireId
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常' + err)
        })
    },
    handleClick () { // tab切换fn
      switch (this.activeName) {
        case '0':
          this.scrColumn = [
            { text: '序号', selected: true },
            { text: '姓名', selected: true },
            { text: '性别', selected: true },
            { text: '岗位', selected: true },
            { text: '任教科目', selected: true },
            { text: '手机号码', selected: true },
            { text: '是否提交', selected: true }
          ]
          this.getQuestionListFun()
          break
        case '1':
          this.scrColumn = [
            { text: '序号', selected: true },
            { text: '姓名', selected: true },
            { text: '性别', selected: true },
            { text: '年级', selected: true },
            { text: '班级', selected: true },
            { text: '手机号码', selected: true },
            { text: '是否提交', selected: true }
          ]
          this.getQuestionListFun()
          break
        case '2':
          this.scrColumn = [
            { text: '浏览量', selected: true },
            { text: '填写人数', selected: true }
          ]
          this.getQuestionListFun()
          break
        default:
          break
      }
    },
    searchFun () { // 搜索fun
    }
  }
}
