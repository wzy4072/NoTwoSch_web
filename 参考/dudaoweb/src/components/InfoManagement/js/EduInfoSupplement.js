import returnBtn from '@/common/components/returnBtn'
export default{
  components: { returnBtn }, // 表格功能组件 返回键
  data () {
    return {
      isShow: true,
      isShowItem: 0,
      dialogVisible: false,
      flag: 0,
      sourceHtml: '',
      certificatesTypeOptions: [{
        value: 1,
        label: '居民身份证'
      }, {
        value: 2,
        label: '香港特区护照'
      }, {
        value: 3,
        label: '澳门特区护照'
      }, {
        value: 4,
        label: '护照'
      }],
      jobOptions: [],
      form: {// 表单的数据
        superintendentName: '', // 职工姓名
        superintendentTel: '',
        superintendentGender: 1,
        certificatesType: '',
        superintendentPosition: '', // 职工职位code
        // superintendentPositionName: '', // 职工职位名称
        certificatesTypeOptions: '',
        certificatesNum: ''
      },
      rules: {// 表单的验证
        superintendentName: [
          { required: true, message: '名字不能为空', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        superintendentGender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        superintendentTel: [ { required: true, message: '手机号码不能为空', trigger: 'blur' },
        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号码格式有误！', trigger: 'blur'}],
        superintendentPosition: [{ required: true, message: '请选择职务', trigger: 'change' }],
        certificatesNum: [{pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur'}]

      }
    }
  },
  computed: {
  },
  watch: {
    form: {      // 注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler (curVal, oldVal) { // 监听对象form变化，新值==旧值没做任何编辑
        if (curVal === oldVal) {
          this.flag = 1
        }
      },
      deep: true}
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/workerSelect',
        data: {}
      }).then((re) => {
        this.jobOptions = Object.assign([], re.data.list)
        console.log()
      }).catch((err) => {
        this.$message.error('错误提示：' + err)
      })
      this.sourceHtml = this.getUrlParameter('sourceHtml')
      // 编辑:从后端获取数据
      if (this.sourceHtml === 'userEdit') {
        this.form = Object.assign({}, JSON.parse(sessionStorage.getItem('userInfo')))
        this.form.superintendentPosition = this.form.superintendentPosition.toString()
        this.isShow = false
        this.isShowItem = 2
      }
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$delete(this.form, 'certificatesTypeOptions')
         // console.log(this.form)
          let url
          if (this.sourceHtml === 'userEdit') {
            url = 'baseInfo/eduInfoManager/updateEduInfo'
          } else {
            url = 'baseInfo/eduInfoManager/addEduInfo'
          }
          this.$ajax({
            method: 'POST',
            url: url,
            data: this.form
          }).then((re) => {
            this.$message.success('提交成功')
            this.isShow = false
            this.isShowItem = 1
          }).catch((err) => {
            this.$message.error('错误提示:' + err)
          })
        }
      })
    },
    close () {
      this.$router.push({
        path: '/InfoManagement/EduInfomation'
      })
    },
    edit () {
      this.isShow = true
      this.isShowItem = 3
    },
    cancel () {
      if (this.flag === 1) {
        this.dialogVisible = true
      } else {
        this.isShow = false
        this.isShowItem = 2
      }
    },
    confrimCancel () {
      this.isShow = false
      this.isShowItem = 2
      this.refresh()
      this.dialogVisible = false
    },
    changejob (value) {
      let superintendentPositionName = this.jobOptions.filter((re) => { return re.dictCode === value })[0].dictValue
      this.$set(this.form, 'superintendentPositionName', superintendentPositionName)
      console.log(superintendentPositionName)
    },
    getUrlParameter (field) { // 获取网址上参数
      let GET = {}
      let canshu = window.location.hash.split('?')[1] === undefined ? '' : window.location.hash.split('?')[1]
      if (canshu !== '') {
        let strarr = canshu.split('&')
        for (let i = 0; i < strarr.length; i++) {
          let xx = strarr[i]
          let mykey = xx.split('=')[0]
          let myvalue = xx.split('=')[1]
          GET[mykey] = myvalue
        }
      }
      return GET[field]
    }
  }

}
