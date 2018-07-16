import * as cityData from '@/common/js/city_Data'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      barNameArr: [],
      fullscreenLoading: false,
      dialogVisible: false,
      isdisable: false,
      tableData: [],
      teaching: '',
      searchstr: '', // 当前输入
      isClose: false,
      isUedit: false,
      allOptions: {
        certificOptions: [{
          id: 1,
          name: '居民身份证'
        },
        {
          id: 2,
          name: '香港特区护照/身份证明'
        },
        {
          id: 3,
          name: '澳门特区护照/身份证明'
        },
        {
          id: 4,
          name: '台湾居民来往大陆通行证'
        },
        {
          id: 5,
          name: '护照'
        }], // 证件类型
        politicalOptions: [], // 政治面貌
        nationOptions: [], // 民族
        educationOptions: [], // 最高学历
        workerTypeOptions: [], // 岗位
        CoursesOptions: [] // 任教科目
      },
      cityList: cityData.cityData,
      ruleForm: {
        isEdit: 0,
        isShow: 0,
        workerGender: 1,
        checkWorkerCourses: [],
        workerCourses: [],
        certificatesType: '',
        workerCourseString: ''
      },
      rules: {
        workerName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 5,
          message: '长度在 2 到 5 个字符',
          trigger: 'blur'
        }
        ],
        workerGender: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        workerPhone: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        {
          validator: function (rule, value, callback) {
            var MobileRegex = /^1[0-9]{10}$/
            if (!MobileRegex.test(value)) {
              callback(new Error('手机号码格式不正确！'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
        ],
        userBirthday: [{
          type: 'date',
          validator: (rule, value, callback) => {
            if (this.ruleForm.userBirthday) {
              if (this.ruleForm.certificatesType === 1) {
                if (this.ruleForm.certificatesNum) {
                  this.YS.YS_IDValidator(() => { // 新建普通实例
                    this.validID = new window.IDValidator()
                    let birth = this.validID.getInfo(this.ruleForm.certificatesNum).birth
                    if (birth !== this.$api.getDateAll(this.$api.time(value), '-')) {
                      callback(new Error('与身份证上的生日不一致!'))
                    } else {
                      callback()
                    }
                  })
                }
                                // else {
                                //   callback(new Error('生日不能为空！'))
                                // }
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        departureTime: [
          {
            type: 'date',
            validator: (rule, value, callback) => {
              if (this.ruleForm.departureTime) {
                if (this.ruleForm.entryTime - this.ruleForm.departureTime > 0) {
                  callback(new Error('离职日期不能小于入职日期!'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
                // certificatesType: [{
                //     required: true,
                //     message: '请输入证件类型',
                //     trigger: 'change'
                // }],
        certificatesNum: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.certificatesType === 1) {
              this.YS.YS_IDValidator(() => { // 新建普通实例
                this.validID = new window.IDValidator()
                if (!this.validID.isValid(this.ruleForm.certificatesNum)) {
                  callback(new Error('身份信息有误!'))
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        politicalOutlook: [{
          required: true,
          message: '请输入政治面貌',
          trigger: 'change'
        }],
        workerType: [{
          required: true,
          message: '请选择岗位',
          trigger: 'change'
        }]
      }
    }
  },
  mounted () { // 进页面默认执行方法
    this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
    this.$nextTick(function () {
      this.refresh()
    })
    this.$ajax({
      method: 'post',
      url: 'baseInfo/dictConf/selectDictConfLsit',
      data: {
        'dictType': 'ALL'
      }
    }).then(res => {
      res.data.data.forEach(value => {
        switch (value.dictType) {
          case 'POSITION': // =
            this.allOptions.workerTypeOptions.push(value)
            break
          case 'COURSE': // 科目
            this.allOptions.CoursesOptions.push(value) // 科目
            break
          case 'EDUCATION': // 最高学历
            this.allOptions.educationOptions.push(value) // 最高学历
            break
          case 'NATION': // 民族
            this.allOptions.nationOptions.push(value) // 最高学历
            break
          case 'POLITICAL_OUTLOOK': // 政治面貌
            this.allOptions.politicalOptions.push(value) // 最高学历
            break
        }
      })
      return this.$ajax({
        method: 'post',
        url: 'baseInfo/dictConf/selectDictConfLsit',
        data: {
          'dictType': 'POSITION'
        }
      })
    }).then(res => {
      this.allOptions.workerTypeOptions = res.data.data
    }).catch(err => {
      this.$message.error('接口异常：' + err)
    })
  },
  methods: {
    refresh () {
            // 获取上个页面的缓存
      this.fullscreenLoading = true
      if (JSON.parse(sessionStorage.getItem('EditData')).isShow) { // isEdit=0是补录，isEdit=1是查看页面
        this.ruleForm = JSON.parse(sessionStorage.getItem('EditData'))
        this.$set(this.ruleForm, 'checkWorkerCourses', [])
        this.isUedit = true
        this.ruleForm.workerCourses.forEach(re => {
          this.ruleForm.checkWorkerCourses.push(re.courseCode)
        })
                // this.ruleForm.workerCourses = []
        this.$set(this.ruleForm, 'workerCourses', [])
                // 户籍信息
        let arr = ['native', 'households', 'address']
        for (let index = 0; index < arr.length; index++) {
          this.$set(this.ruleForm, arr[index] + 'List', [this.ruleForm[arr[index] + 'Province'], this.ruleForm[arr[index] + 'City'], this.ruleForm[arr[index] + 'Area']])
        }
        this.getarg1()
      }
    },
    searchFun () {
      if (this.searchstr !== '') {
        this.fullscreenLoading = true
        this.tableData = this.copydata.filter(o => {
          return Object.keys(o).some(d => { // .some是循环
            return (typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
                            .searchstr) > -1
          })
        })
      } else {
        this.tableData = this.copydata
      }
      this.fullscreenLoading = false
      this.total = this.tableData.length
    },
    editInfo () {
      this.ruleForm.isShow = 0
      this.isUedit = false
      this.isdisable = true
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let Url
          let myData
          if (this.ruleForm.isEdit === 0) {
            Url = 'baseInfo/staffManage/saveWorkerList'
            myData = [this.ruleForm]
          } else if (this.ruleForm.isEdit === 1) {
            Url = 'baseInfo/staffManage/updateWorker'
            myData = this.ruleForm
          }
          let arr = ['native', 'households', 'address']
          for (let index = 0; index < arr.length; index++) {
            if (this.ruleForm[arr[index] + 'List']) {
              this.ruleForm[arr[index] + 'Province'] = this.ruleForm[arr[index] + 'List'][0]
              this.ruleForm[arr[index] + 'City'] = this.ruleForm[arr[index] + 'List'][1]
              this.ruleForm[arr[index] + 'Area'] = this.ruleForm[arr[index] + 'List'][2]
            }
          }
          if (this.ruleForm.userBirthday) { this.ruleForm.userBirthday = this.$api.time(this.ruleForm.userBirthday) }
          if (this.ruleForm.arg1) { this.ruleForm.arg1 = this.$api.time(this.ruleForm.arg1) }
          this.ruleForm.entryTime = this.$api.time(this.ruleForm.entryTime)
          if (this.ruleForm.departureTime) { this.ruleForm.departureTime = this.$api.time(this.ruleForm.departureTime) }
          this.$set(this.ruleForm, 'workerCourses', [])
          this.allOptions.CoursesOptions.forEach(re => {
            this.ruleForm.checkWorkerCourses.forEach(res => {
              if (re.dictCode === res) {
                let obj = {
                  courseCode: re.dictCode,
                  courseName: re.dictValue
                }
                this.ruleForm.workerCourses.push(obj)
              }
            })
          })
          this.$ajax({
            method: 'POST',
            url: Url,
            data: myData
          }).then(re => {
            this.fullscreenLoading = false
            this.$message.success('保存成功')
            this.getarg1()
            this.ruleForm.isShow = 1
            this.isUedit = true
            if (this.ruleForm.isEdit === 0) {
              if (re.data.data.missList && re.data.data.missList.length > 0) {
                this.$message.error(re.data.data.missList[0].errorDescription)
                this.ruleForm.isShow = 0
                return false
              }
              this.isUedit = false
              this.isClose = true
            }
            this.$set(this.ruleForm, 'workerCourseString', '')
            this.ruleForm.workerCourses.forEach(re => {
              this.ruleForm.workerCourseString += re.courseName + ','
            })
            this.isdisable = false
          }).catch(err => {
            this.fullscreenLoading = false
            this.$message.error('接口异常：' + err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    remoteTag () {
      this.ruleForm.checkWorkerCourses.pop()
    },
    cancelInfo (v) {
            // 如果是编辑状态点击取消按钮执行弹出框
      this.dialogVisible = true
    },
    resetForm (formName) {
            // 确定取消
      this.dialogVisible = false
      this.isdisable = false
      this.isUedit = true
      this.ruleForm.isShow = 1
                // this.$refs[formName].resetFields()
                // 如果是编辑状态点击取消按钮执行
    },
    selValChangeFn (value, index) {
      switch (index) {
        case 'politicalOutlookName': // 政治面貌
          this.ruleForm[index] = this.allOptions.politicalOptions.filter(re => re.dictCode === value)[0].dictValue
          break
        case 'userNationName': // 民族
          this.ruleForm[index] = this.allOptions.nationOptions.filter(re => re.dictCode === value)[0].dictValue
          break
        case 'highestEducationName': // 民族
          this.ruleForm[index] = this.allOptions.educationOptions.filter(re => re.dictCode === value)[0].dictValue
          break
        case 'workerTypeName': // 民族
          this.ruleForm[index] = this.allOptions.workerTypeOptions.filter(re => re.dictCode === value)[0].dictValue
          break
      }
    },
    closeInfo () {
              // 跳转到刘表页面
      this.$router.push({ // 页面跳转
        path: '/InfoManagement/StaffInfoManagement'
      })
    },
    getarg1 () {
      if (this.ruleForm.arg1 === null) {
        return ''
      }
      let arg = new Date(this.ruleForm.arg1)
      let now = new Date()
      let chaYear = now.getFullYear() - arg.getFullYear()
      let chaMonth = now.getMonth() - arg.getMonth()
      let teaching = ''
      if (chaMonth < 0) {
        chaYear -= 1
        chaMonth = 12 + chaMonth
      }
      if (chaYear > 0) {
        teaching = chaYear + '年'
      }
      if (chaMonth > 0) {
        teaching += chaMonth + '月'
      }
      this.teaching = teaching
    }
  }
}
