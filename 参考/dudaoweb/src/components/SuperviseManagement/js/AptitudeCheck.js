import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
let checkConect = (rule, value, callback) => { // 联系方式 自定义校验方法
  let ph = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
  let mb = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
  if (!ph.test(value) && !mb.test(value)) {
    callback(new Error('请输入正确的联系方式'))
  } else {
    callback()
  }
}
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      barNameArr: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      tableData: [],
      searchstr: '', // 当前输入
      searchCoum: ['workerName', 'workerGender', 'workerType', 'highestEducation'], // 搜索字段
      scrColumn: {
        workerName: { text: '姓名', selected: true, field: 'workerName' },
        workerGenderName: { text: '性别', selected: true, field: 'workerGenderName' },
        workerTypeName: { text: '岗位', selected: true, field: 'workerTypeName' },
        teaching: { text: '教学资历', selected: true, field: 'teaching' },
        highestEducationName: { text: '最高学历', selected: true, field: 'highestEducationName' },
        qualificationsName: { text: '相关证书', selected: true, field: 'qualificationsName' },
        educationUpdateDate: { text: '更新时间', selected: true, field: 'educationUpdateDate' }
      },
      printOb: { // 打印所需
        pageNum: 1,
        title: '教职工资历信息列表'
      },
      dialogVisible2: false,
      dialogVisible: false,
      cuont_index: [],
      pic: null,
      showpic: false,
      detailsData: [
                { name: '姓名', value: '' },
                { name: '性别', value: '' },
                { name: '最高学历', value: '' }
      ],
      gridData: [],
      ruleForm: { // 反馈表单数据
        textarea: null,
        number: null
      },
      rules: { // 校验规则
        number: [ // 校验字段
          { required: true, message: '请输入正确的联系方式', trigger: 'blur' },
          { validator: checkConect, trigger: 'blur' }
        ]
      },
      pictureData: [] // 证书信息
    }
  },
  mounted () { // 进页面默认执行方法
    this.refresh()
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/staffManage/staffQualifications',
        data: {}
      }).then(res => {
        this.fullscreenLoading = false
        res.data.data.forEach(re => {
          re.educationUpdateDate = this.$api.getDateAll(re.educationUpdateDate, '-')
          re.teaching = ''
          re.qualificationsArr = []
          let [nameArr, urlArr] = [re.qualificationsName ? re.qualificationsName.split(',') : '', re.qualificationsPath ? re.qualificationsPath.split(',') : '']
          if (nameArr.length === urlArr.length) {
            for (let index = 0; index < nameArr.length; index++) {
              let obj = {}
              obj.qualificationsName = nameArr[index]
              obj.qualificationsPath = urlArr[index]
              re.qualificationsArr.push(obj)
            }
          }
          if (re.arg1 !== null) {
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
          } else {
            re.teaching = ''
          }
        })
        this.copyData = Object.assign([], res.data.data)
        this.total = this.copyData.length
        this.tableData = this.copyData.slice(0, this.size * 1)
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
    check (selection) { // 表格勾选获取ID和name
      this.cuont_index = []
      if (selection.length) {
        selection.forEach((element, index) => {
          this.cuont_index.push(element.workerId)
        })
      }
    },
    feedback () { // 反馈按钮事件
      if (this.cuont_index.length) {
        this.ruleForm.textarea = ''
        this.dialogVisible = true
      } else {
        this.$message.warning('请先勾选教职工！')
      }
    },
    certificateClickFn (value) { // 点击证书
      this.pictureData = value
      this.showpic = true
    },
    handleClose () { // 弹窗关闭之前事件
      this.pictureData = null
    },
    showLargerFn (value) { // 查看原图
      window.open(this.$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + value.qualificationsPath.slice(1))
    },
    show2 (row) { // 表格名字点击事件
      this.gridData = []
      if (row.qualificationsArr != null && row.qualificationsArr.length > 0) {
        row.qualificationsArr.forEach((element, index) => {
          var obj = {}
          obj.type = element.qualificationsName
          var count = element.qualificationsPath.split('/')
          obj.name = count[3]
          this.gridData.push(obj)
        })
      }
      this.detailsData[0].value = row.workerName
      this.detailsData[1].value = row.workerGenderName
      this.detailsData[2].value = row.highestEducationName
      this.dialogVisible2 = true
    },
    Opinion () { // 确定提交反馈
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var obj = {
            'feedbackContent': this.ruleForm.textarea,
            'feedbackPersonTel': this.ruleForm.number,
            'toFeedbackPersonIds': this.cuont_index,
            'feedbackType': 1
          }
          this.$ajax({
            method: 'POST',
            url: 'feedback/qualifications/addFeedbacks',
            data: obj
          }).then(res => {
            this.$message.success('您的反馈信息已提交成功，我们将在3个工作日内核实并回复您的反馈内容。')
            this.dialogVisible = false
            this.ruleForm.number = ''
            this.cuont_index.length = 0
            this.refresh()
          })
        }
      })
      // var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      // if (this.ruleForm.number === '') {
      //   this.$message.warning('请填写手机号码')
      //   return false
      // }
      // if (!reg.test(this.ruleForm.number)) {
      //   this.$message.warning('请输入正确的电话号码，以确保督导员能联络到您')
      //   return false
      // }
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
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
