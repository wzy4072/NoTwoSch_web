import tableBar from '../../../common/components/tableBar'
import { cityData } from '../../../common/js/city_Data'
import returnBtn from '@/common/components/returnBtn'

export default {
  components: {tableBar, returnBtn},
  data () {
    let validateUserBirthday = (rule, value, callback) => {
      let birthdaynew = this.$api.getDateAll(this.$api.time(value), '-')
      if (value) {
        if (this.ruleForm.certificatesNum) {
          let brithday = this.ruleForm.certificatesNum
          let birth = brithday.substring(6, 10) + '-' + brithday.substring(10, 12) + '-' + brithday.substring(12, 14)
          if (birthdaynew !== birth) {
            callback(new Error('请填写正确的出生日期'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    return {
      da: [],
      copyData: [],
      yujibiyeTime: '', // 预计毕业时间
      papersType: [
        {value: 1, label: '居民身份证'},
        {value: 2, label: '香港特区护照/身份证明'},
        {value: 3, label: '澳门特区护照/身份证'},
        {value: 4, label: '台湾居民来往大陆通行证'},
        {value: 5, label: '护照'},
        {value: 6, label: '其他'}
      ],
      national: [],
      searchCoum: ['studentName', 'entranceCode', 'gradeName', 'gradeCode', 'className', 'studentGenderName', 'certificatesTypeStr', 'certificatesNum', 'householdsTypeStr'],
      printOb: {
        pageNum: 1,
        title: '学生列表'
      },
      input5: '',
      editOrBtn: 0,
      currentPage4: 1,
      size: 50,
      total: 0,
      scrColumn: [
        {text: '姓名', selected: true, align: 'center'},
        {text: '入学代码', selected: true},
        {text: '年级', selected: true},
        {text: '年级代码', selected: true},
        {text: '班级', selected: true},
        {text: '性别', selected: true},
        {text: '证件类型', selected: true},
        {text: '证件号码', selected: true},
        {text: '班户籍类型', selected: true}
      ],
      activeName: 'zhuanban',
      nowGrade: '',
      nowClass: '',
      options: [],
      classOptions: [],
      classOptionsLast: [],
      copyOptions: [],
      tabChangeStatus: {
        zhuanban: true,
        zhuanchu: false,
        xiuxue: false,
        fuxue: false,
        tuixue: false
      },
      zhuanru: 0,
      fuxue: 0,
      tiemDate: [],
      startDate: '',
      endDate: '',
      nowAddr: [], // 现居住地址
      householdsAddr: [], // 户籍地址
      ruleForm: { // 转入提交信息
        transactionType: 2,
        stuName: '',
        certificatesType: 1,
        stuGender: '男',
        certificatesNum: '',
        userBirthday: '',
        contactTele: '',
        userNation: '',
        addressProvince: '',
        addressCity: '',
        addressArea: '',
        addressAddr: '',
        householdsProvince: '',
        householdsCity: '',
        householdsArea: '',
        newEntranceCode: '',
        oldGradeCode: '',
        oldGradeName: '',
        newGradeCode: '',
        newGradeName: '',
        newClassCode: '',
        newClassName: '',
        oldClassName: '',
        applyReason: '',
        transactionDate: ''
      },
      gradeCodePipei: '', // 匹配年及代码
      ruleFormVerify: {
        stuName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        certificatesType: [
          { required: true, message: '证件类型不能为空', trigger: 'change' }
        ],
        stuGender: [
          { required: true, message: '性别不能为空', trigger: 'change' }
        ],
        certificatesNum: [
          { required: true, message: '证件号码不能为空', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请填写正确的证件号码', trigger: 'blur' }
        ],
        userBirthday: [
          { validator: validateUserBirthday, trigger: 'blur' }
        ],
        contactTele: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请填写正确的电话号码', trigger: 'blur' }
        ],
        newGradeCode: [
          { required: true, message: '年级不能为空', trigger: 'change' }
        ],
        newClassCode: [
          { required: true, message: '班级不能为空', trigger: 'change' }
        ],
        newEntranceCode: [
          { required: true, message: '入学代码不能为空', trigger: 'change' }
        ],
        transactionDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      date: [
        (new Date(new Date().setFullYear(new Date().getFullYear() - 3))),
        new Date()
      ],
      cityOptions: [], // 城市选择
      cloumns: [
        {text: '姓名', field: 'studentName', selected: true},
        {text: '入学代码', field: 'entranceCode', selected: true},
        {text: '年级', field: 'gradeName', selected: true},
        {text: '年级代码', field: 'gradeCode', selected: true},
        {text: '班级', field: 'className', selected: true},
        {text: '性别', field: 'studentGenderName', selected: true},
        {text: '证件类型', field: 'certificatesTypeStr', selected: true},
        {text: '证件号码', field: 'certificatesNum', selected: true},
        {text: '户籍类型', field: 'householdsTypeStr', selected: true}
      ],
      searchFiledArr: ['studentName', 'entranceCode', 'gradeName', 'className'],
      dialogChange: false,
      formTwo: {
        studentId: [],
        transactionType: null,
        transactionSchoolName: '',
        oldEntranceCode: '',
        oldGradeCode: '',
        oldGradeName: '',
        oldClassCode: '',
        oldClassName: '',
        newGradeCode: '',
        newGradeName: '',
        newClassCode: '',
        newClassName: '',
        transactionDate: '',
        returnDate: '',
        applyReason: ''
      },
      rules: {
        newGradeCode: [
          { required: true, message: '请选择拟读年级', trigger: 'change' }
        ],
        newClassCode: [
          { required: true, message: '请选择拟读班级', trigger: 'change' }
        ],
        transactionDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        returnDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      dialogTitle: '转班',
      senddata: {
        'gradeCode': '',
        'classCode': ''
      },
      multipleSelection: []
    }
  },
  mounted () {
    let now = new Date()
    now.setFullYear(now.getFullYear() - 3)
    this.startDate = this.formatDate(this.date[0])
    this.endDate = this.formatDate(this.date[1])
    this.cityOptions = cityData
    this.getGradeAndClass()
    let that = this
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/dictConf/selectDictConfLsit',
      data: {'dictType': 'POSITION'}
    })
      .then(data => {
        let arr = []
        data.data.data.forEach((v, k) => {
          if (v.dictDesc === '民族') {
            arr.push(v)
          }
        })
        that.national = arr
      })
      .then(err => {
        console.log(err)
      })
  },
  watch: {
    input5 (newVal, oldVal) { // 有筛选列模糊搜索
      if (newVal.trim() !== '') {
        this.da = this.copyData.slice(
          (this.currentPage4 - 1) * this.size,
          this.currentPage4 * this.size
        ).filter(o => {
          return this.cloumns.filter((item) => { return item.selected }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this.da = this.copyData.slice(
          (this.currentPage4 - 1) * this.size,
          this.currentPage4 * this.size
        )
      }
    },
    nowGrade: function (v) {
      this.classOptions = this.getClassOpt(v, this.copyOptions)
      this.nowClass = this.classOptions[0].value
    },
    'formTwo.newGradeCode': function (v) {
      this.classOptionsLast = this.getClassOpt(v, this.copyOptions)
      this.formTwo.newClassCode = this.classOptionsLast[0].value
    },
    'ruleForm.newGradeCode': function (v) {
      this.gradeCodePipei = v
      this.classOptions = this.getClassOpt(v, this.copyOptions)
    },
    nowAddr: function (v) {
      this.ruleForm.addressProvince = v[0]
      this.ruleForm.addressCity = v[1]
      this.ruleForm.addressArea = v[2]
    },
    householdsAddr: function (v) {
      this.ruleForm.householdsProvince = v[0]
      this.ruleForm.householdsCity = v[1]
      this.ruleForm.householdsArea = v[2]
    }
  },
  methods: {
    formatDate (date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = date.getDate()
      day = day < 10 ? ('0' + day) : day
      return year + '-' + month + '-' + day
    },
    getGradeAndClass () { // 获取年级班级
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/selectGradeAndClass'
      })
      .then(data => {
        that.copyOptions = data.data.data
        let opt = []
        data.data.data.forEach(function (v, k) {
          opt.push({
            value: v.gradeCode,
            label: v.gradeName
          })
        })
        that.options = opt
        that.nowGrade = that.options[0].value
        let arr = that.getClassOpt(that.copyOptions[0].gradeCode, that.copyOptions)
        that.nowClass = arr[0].value
        let senddata = {
          'gradeCode': that.nowGrade + '',
          'classCode': that.nowClass + ''
        }
        this.getData(senddata)
      })
      .then(err => {
        console.log(err)
      })
    },
    getData (senddata) { // 获取表格数据
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/selectStuList',
        data: senddata
      })
      .then(data => {
        data.data.data.forEach(function (v, k) {
          v.householdsTypeStr = v.householdsType === 1 ? v.householdsTypeStr = '农业户口' : v.householdsTypeStr = '非农户口'
          switch (v.certificatesType) {
            case 1:
              v.certificatesTypeStr = '身份证'
              break
            case 2:
              v.certificatesTypeStr = '香港特区护照/身份证'
              break
            case 3:
              v.certificatesTypeStr = '澳门特区护照/身份证'
              break
            case 4:
              v.certificatesTypeStr = '台湾居民来往大陆通行证'
              break
            case 5:
              v.certificatesTypeStr = '护照'
              break
            case 6:
              v.certificatesTypeStr = '其他'
              break
          }
        })
        let arr1 = JSON.parse(JSON.stringify(data.data.data))
        this.copyData = arr1
        this.da = data.data.data
        this.total = this.da.length
      })
      .then(err => {
        // this.copyData = []
        // this.da = []
        console.log(err)
      })
    },
    getClassOpt (v, data) {
      let classlist = []
      data.forEach(function (val, k) {
        if (v === val.gradeCode) {
          classlist = val.classList
        }
      })
      let classOpt = []
      classlist.forEach(function (value, key) {
        classOpt.push({
          value: value.classCode,
          label: value.className
        })
      })
      return classOpt
    },
    handleClick (tab, event) {
      if (tab.name !== 'zhuanru') {
        setTimeout(() => {
          this.$refs.multipleTable.clearSelection()
        }, 200)
      }
      this.tabChangeStatus[tab.name] = true
      for (let v in this.tabChangeStatus) {
        if (v === tab.name) {
          this.tabChangeStatus[v] = true
        } else {
          this.tabChangeStatus[v] = false
        }
      }
      if (tab.name === 'zhuanru') {
        this.zhuanru = 1
        this.fuxue = 0
      } else if (tab.name === 'fuxue') {
        this.fuxue = 1
        this.zhuanru = 0
        setTimeout(function () {
          var ele = document.getElementsByClassName('el-input__prefix')
          for (let i = 0; i < ele.length; i++) {
            ele[i].setAttribute('style', 'top:-4px;')
          }
        }, 5)
      } else {
        this.fuxue = 0
        this.zhuanru = 0
      }
      if (tab.name === 'fuxue') {
        this.dialogTitle = '复学'
        this.cloumns.splice(2, 1, {text: '原年级', name: 'gradeName', selected: true})
        this.cloumns.splice(4, 1, {text: '原班级', name: 'className', selected: true})
      } else {
        this.cloumns.splice(2, 1, {text: '年级', name: 'gradeName', selected: true})
        this.cloumns.splice(4, 1, {text: '班级', name: 'className', selected: true})
      }
      switch (tab.name) {
        case 'zhuaban':
          this.dialogTitle = '转班'
          break
        case 'zhuanru':
          this.dialogTitle = '转入'
          break
        case 'zhuanchu':
          this.dialogTitle = '转出'
          break
        case 'xiuxue':
          this.dialogTitle = '休学'
          break
        case 'tuixue':
          this.dialogTitle = '退学'
          break
      }
      let sendData = {
        gradeCode: this.nowGrade,
        classCode: this.nowClass
      }
      let sendTime = {
        'transactionType': 5,
        'beginDate': this.startDate,
        'endDate': this.endDate
      }
      sendTime.beginDate = this.$api.getDateAll(this.$api.time(this.startDate), '-')
      sendTime.endDate = this.$api.getDateAll(this.$api.time(this.endDate), '-')
      if (this.dialogTitle === '复学') {
        this.getData(sendTime)
      } else {
        this.getData(sendData)
      }
      // console.log(tab.name, event)
    },
    searchfunc () {
      if (this.input5 !== '') {
        let tempArr = []
        let that = this
        document.querySelectorAll('.el-table__body-wrapper table tr').forEach(function (tr, key) {
          tr.innerText.trim().replace(/\s/g, '').indexOf(that.input5) > -1 && tempArr.push(key)
        })
        this.da = this.da.filter((o, k) => {
          return tempArr.indexOf(k) > -1
        })
      } else {
        this.da = JSON.parse(JSON.stringify(this.copyData))
      }

      // if (this.input5 !== '') {
      //   this.da = this.copyData.filter(o => {
      //     return Object.keys(o).some(d => { // .some是循环
      //       if (this.searchCoum.indexOf(d) > -1) { // 检索字符串是否存在
      //         if (o[d]) {
      //           return (typeof o[d] === 'string') ? o[d].indexOf(this.input5) > -1 : o[d].toString().indexOf(this.input5) > -1
      //         }
      //       }
      //     })
      //   })
      // } else {
      //   let arr1 = JSON.parse(JSON.stringify(this.copyData))
      //   this.da = arr1
      // }
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    //  分页的跳到当前页面
    handleCurrentChange (val) {
      this.currentPage4 = val || this.currentPage4
      this.tableData3 = this.copydata.slice(
        (this.currentPage4 - 1) * this.size,
        this.currentPage4 * this.size
      )
    },
    showDialogData () {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let entranceCode = this.multipleSelection[0].entranceCode
        if (entranceCode) {
          let date = entranceCode.substring(1)
          this.yujibiyeTime = parseInt(date) + 3
        }
        this.dialogChange = true
      } else {
        this.$message.error('请至少选择一个学生！')
      }
      setTimeout(() => {
        let html = document.getElementById('biyeTime').children[0]
        html.style.width = '110px'
      }, 200)
    },
    failDialog () {
      this.dialogChange = false
      this.formTwo = {
        studentId: [],
        transactionType: null,
        transactionSchoolName: '',
        oldEntranceCode: '',
        oldGradeCode: '',
        oldGradeName: '',
        oldClassCode: '',
        oldClassName: '',
        newGradeCode: '',
        newGradeName: '',
        newClassCode: '',
        newClassName: '',
        transactionDate: '',
        returnDate: '',
        applyReason: ''
      }
      this.$refs.multipleTable.clearSelection()
    },
    submit (formName) {
      let that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          let ids = []
          that.multipleSelection.forEach(function (v, k) {
            ids.push(v.stduentId)
          })
          that.formTwo.transactionType = that.getTransType(that.dialogTitle)
          // that.formTwo.studentId = ids
          that.formTwo.oldEntranceCode = that.da[0].entranceCode
          that.formTwo.oldGradeCode = that.da[0].gradeCode
          that.formTwo.oldGradeName = that.da[0].gradeName
          that.formTwo.oldClassCode = that.da[0].classCode
          that.formTwo.oldClassName = that.da[0].className
          if (that.formTwo.newGradeCode) {
            let newGradeName = that.options.filter(function (item) {
              return item.value === that.formTwo.newGradeCode
            })
            that.formTwo.newGradeName = newGradeName[0].label
          }
          if (that.formTwo.newClassCode) {
            let newClassName = that.classOptionsLast.filter(function (item) {
              return item.value === that.formTwo.newClassCode
            })
            that.formTwo.newClassName = newClassName[0].label
          }
          if (that.formTwo.transactionDate) {
            that.formTwo.transactionDate = that.$api.getDateAll(that.$api.time(that.formTwo.transactionDate), '-')
          }
          if (that.formTwo.returnDate) {
            that.formTwo.returnDate = that.$api.getDateAll(that.$api.time(that.formTwo.returnDate), '-')
          }
          let senddataList = []
          ids.forEach((v, k) => {
          	var senddata = JSON.parse(JSON.stringify(that.formTwo))
            senddata.studentId = v
            senddataList.push(senddata)
          })
          that.$ajax({
            method: 'POST',
            url: 'baseInfo/stuTransaction/transferAndRolloff',
            data: senddataList
          })
          .then(res => {
            console.log(res)
          })
          .then(reserr => {
            console.log(reserr)
          })
          that.$confirm('登记成功', '提交成功', {
            cancelButtonText: '关闭',
            confirmButtonText: '打印异动确认订单',
            type: 'success',
            center: true
          }).then(() => {
            let senddata = {
              'transactionType': null,
              'studentIdlist': ids
            }
            senddata.transactionType = that.getTransType(that.dialogTitle)
            sessionStorage.setItem('transPrintData', JSON.stringify(senddata))
            that.$router.push({path: './transactionPrint', query: {'transStatru': that.dialogTitle}})
            this.dialogChange = false
            this.$refs[formName].resetFields()
            this.formTwo = {
              studentId: [],
              transactionType: null,
              transactionSchoolName: '',
              oldEntranceCode: '',
              oldGradeCode: '',
              oldGradeName: '',
              oldClassCode: '',
              oldClassName: '',
              newGradeCode: '',
              newGradeName: '',
              newClassCode: '',
              newClassName: '',
              transactionDate: '',
              returnDate: '',
              applyReason: ''
            }
            this.$refs.multipleTable.clearSelection()
          }).catch(() => {
            this.dialogChange = false
            this.$refs[formName].resetFields()
            this.formTwo = {
              studentId: [],
              transactionType: null,
              transactionSchoolName: '',
              oldEntranceCode: '',
              oldGradeCode: '',
              oldGradeName: '',
              oldClassCode: '',
              oldClassName: '',
              newGradeCode: '',
              newGradeName: '',
              newClassCode: '',
              newClassName: '',
              transactionDate: '',
              returnDate: '',
              applyReason: ''
            }
            this.$refs.multipleTable.clearSelection()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTransType (str) {
      let type = null
      switch (str) {
        case '转班':
          type = 1
          break
        case '转入':
          type = 2
          break
        case '转出':
          type = 3
          break
        case '休学':
          type = 4
          break
        case '复学':
          type = 5
          break
        case '退学':
          type = 6
          break
      }
      return type
    },
    queryBtn () {
      this.senddata.gradeCode = this.nowGrade
      this.senddata.classCode = this.nowClass
      let sendTime = {
        'transactionType': 5,
        'beginDate': this.startDate,
        'endDate': this.endDate
      }
      sendTime.beginDate = this.$api.getDateAll(this.$api.time(this.startDate), '-')
      sendTime.endDate = this.$api.getDateAll(this.$api.time(this.endDate), '-')
      if (this.dialogTitle === '复学') {
        this.getData(sendTime)
      } else {
        this.getData(this.senddata)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    zhuanruSubmit (formName) {
      let that = this
      that.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (that.ruleForm.newGradeCode) {
            let newGradeName = that.options.filter(function (item) {
              return item.value === that.ruleForm.newGradeCode
            })
            that.ruleForm.newGradeName = newGradeName[0].label
          }
          if (that.ruleForm.newClassCode) {
            let newClassName = that.classOptions.filter(function (item) {
              return item.value === that.ruleForm.newClassCode
            })
            that.ruleForm.newClassName = newClassName[0].label
          }
          let senddata = that.ruleForm
          senddata.stuGender = senddata.stuGender === '男' ? 1 : 0
          if (senddata.userBirthday) {
            senddata.userBirthday = that.$api.getDateAll(that.$api.time(senddata.userBirthday), '-')
          }
          senddata.transactionDate = that.$api.getDateAll(that.$api.time(senddata.transactionDate), '-')
          senddata.newEntranceCode = 'Y' + senddata.newEntranceCode
          that.$ajax({
            method: 'post',
            url: 'baseInfo/stuTransaction/stuTransactionInto',
            data: senddata
          }).then((res) => {
            sessionStorage.setItem('transPrintData', JSON.stringify(senddata))
            that.$refs[formName].resetFields()
            that.ruleForm = { // 转入提交信息
              transactionType: 2,
              stuName: '',
              certificatesType: 1,
              stuGender: '男',
              certificatesNum: '',
              userBirthday: '',
              contactTele: '',
              userNation: '',
              addressProvince: '',
              addressCity: '',
              addressArea: '',
              addressAddr: '',
              householdsProvince: '',
              householdsCity: '',
              householdsArea: '',
              newEntranceCode: '',
              oldGradeCode: '',
              oldGradeName: '',
              newGradeCode: '',
              newGradeName: '',
              newClassCode: '',
              newClassName: '',
              oldClassName: '',
              applyReason: '',
              transactionDate: ''
            }
            that.nowAddr = []
            that.householdsAddr = []
            this.$confirm('登记成功!', '提交成功', {
              cancelButtonText: '关闭',
              confirmButtonText: '打印异动确认订单',
              type: 'success',
              center: true
            }).then(() => {
              let senddata1 = {
                'transactionType': 2,
                'studentIdlist': [res.data.data]
              }
              sessionStorage.setItem('transPrintData', JSON.stringify(senddata1))
              that.$router.push({path: './transactionPrint', query: {'transStatru': that.dialogTitle}})
            }).catch(() => { console.log('err') })
          }).catch((err) => {
            that.$message.error('接口异常：' + err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
