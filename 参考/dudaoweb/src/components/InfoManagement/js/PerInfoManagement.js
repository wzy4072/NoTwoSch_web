import * as cityData from '@/common/js/city_Data'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      isEdit: 0,
      formdata: {
        userBirthday: null
      },
      dialogAbolishVisible: false,
      teaching: '',
      rulesObj: {
        workerName: [{
          required: true,
          message: '请填写正确的姓名',
          trigger: 'blur'
        }],
        userBirthday: [{
          type: 'date',
          validator: (rule, value, callback) => {
            if (value) {
              if (this.formdata.certificatesType === 1) {
                if (this.formdata.certificatesNum) {
                  this.YS.YS_IDValidator(() => { // 新建普通实例
                    this.validID = new window.IDValidator()
                    let birth = this.validID.getInfo(this.formdata.certificatesNum).birth
                    if (birth !== this.$api.getDateAll(this.$api.time(value), '-')) {
                      callback(new Error('与身份证上的生日不一致!'))
                    } else {
                      callback()
                    }
                  })
                } else {
                  callback()
                }
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        workerGender: [{
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }],
        workerPhone: [{
          required: true,
          validator: (rule, value, callback) => {
            if (/^\d+$/.test(value) === true && value.length === 11) {
              callback()
            } else {
              callback(new Error('请填写正确的电话号码'))
            }
          },
          trigger: 'blur'
        }],
        politicalOutlook: [{
          required: true,
          message: '请填写正确的政治面貌',
          trigger: 'blur'
        }],
        certificatesNum: [{
          validator: (rule, value, callback) => {
            if (this.formdata.certificatesType === 1) {
              this.YS.YS_IDValidator(() => { // 新建普通实例
                this.validID = new window.IDValidator()
                if (!this.validID.isValid(this.formdata.certificatesNum)) {
                  callback(new Error('身份信息有误!'))
                  debugger
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      },
      certificatesTypeList: [{
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
        name: '境外永久居住证'
      },
      {
        id: 6,
        name: '护照'
      },
      {
        id: 7,
        name: '其他'
      }
      ], // 证件类型
      politicsStatusList: [], // 政治面貌
      nationalityList: [], // 名族
      highestEducationList: [], // 最高学历
      isShow: {
        nation: true,
        highestEducation: true,
        userBirthday: true
      },
      cityList: cityData.cityData,
      isDisabled1: false, // 是否禁用证件类型
      isDisabled2: false // 是否禁用证件号码
    }
  },
  mounted () {
    this.getSelectDataFn() // 获取所有下拉列表数据
  },
  methods: {
    getSelectDataFn () { // 获取所有下拉列表数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/selectDictConfLsit',
        data: {
          dictType: 'ALL'
        }
      }).then(re => {
        this.fullscreenLoading = false
        this.nationalityList = re.data.data.filter(res => res.dictType === 'NATION')
        this.highestEducationList = re.data.data.filter(res => res.dictType === 'EDUCATION')
        this.politicsStatusList = re.data.data.filter(res => res.dictType === 'POLITICAL_OUTLOOK')
        this.getFormDataFn() // 获取form表单数据
      })
    },
    getFormDataFn () { // 获取form表单数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/staffManage/staffInfoSelect',
        data: {}
      }).then(re => {
        this.fullscreenLoading = false
        let obj = Object.assign({}, re.data.data.workerCourse, re.data.data.worker, re.data.data.workerDomicile, re.data.data.user)
        this.formdata.workerTypeName = re.data.data.workerTypeName
        this.formdata.courseName = obj.courseName
        this.formdata.userBirthday = obj.birthDay
        obj.certificatesType && (this.isDisabled1 = true)
        obj.certificatesNum && (this.isDisabled2 = true)
        for (let index in obj) {
          this.$set(this.formdata, index, obj[index])
          switch (index) {
            case 'certificatesType': // 设置证件类型初始值
              this.$set(this.formdata, 'certificatesTypeName', this.certificatesTypeList.filter(re => re.id === obj[index]).length > 0 ? this.certificatesTypeList.filter(re => re.id === obj[index])[0].name : '')
              break
            case 'politicalOutlook': // 设置政治面貌初始值
              this.$set(this.formdata, 'politicalOutlookName', this.politicsStatusList.filter(re => re.dictCode === obj[index]).length > 0 ? this.politicsStatusList.filter(re => re.dictCode === obj[index])[0].dictValue : '')
              break
            case 'userNation': // 设置民族初始值
              this.$set(this.formdata, 'userNationName', this.nationalityList.filter(re => re.dictCode === obj[index]).length > 0 ? this.nationalityList.filter(re => re.dictCode === obj[index])[0].dictValue : '')
              break
            case 'highestEducation': // 设置最高学历初始值
              this.$set(this.formdata, 'highestEducationName', this.highestEducationList.filter(re => re.dictCode === obj[index]).length > 0 ? this.highestEducationList.filter(re => re.dictCode === obj[index])[0].dictValue : '')
              break
            default:
              break
          }
        }

        if (this.formdata.userNation) {
          this.isShow.nation = false
        }
        if (this.formdata.highestEducation) {
          this.isShow.highestEducation = false
        }
        if (this.formdata.userBirthday) {
          this.isShow.userBirthday = false
        }
        let arr = ['native', 'households', 'address']
        for (let index = 0; index < arr.length; index++) {
          this.$set(this.formdata, arr[index] + 'List', [obj[arr[index] + 'Province'], obj[arr[index] + 'City'], obj[arr[index] + 'Area']])
        }
        this.formdata.arg1 = re.data.data.worker.arg1
        this.getarg1(re.data.data.worker.arg1)
      })
    },
    saveFn () {
      this.$refs['ruleForms'].validate(valid => {
        if (valid) {
          debugger
          let arr = ['native', 'households', 'address']
          for (let index = 0; index < arr.length; index++) {
            this.formdata[arr[index] + 'Province'] = this.formdata[arr[index] + 'List'][0]
            this.formdata[arr[index] + 'City'] = this.formdata[arr[index] + 'List'][1]
            this.formdata[arr[index] + 'Area'] = this.formdata[arr[index] + 'List'][2]
          }
          // 形成workerCourses数组
          let [courseCodeList, courseNameList] = [this.formdata.courseCode ? this.formdata.courseCode.split(',') : '', this.formdata.courseName ? this.formdata.courseName.split(',') : '']
          this.formdata.workerCourses = []
          this.formdata.arg1 = this.$api.time(this.formdata.arg1)
          if (courseCodeList.length === courseNameList.length) {
            for (let index = 0; index < courseCodeList.length; index++) {
              let obj = {
                courseCode: courseCodeList[index],
                courseName: courseNameList[index]
              }
              this.formdata.workerCourses.push(obj)
            }
          }
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/staffManage/updateWorker',
            data: this.formdata
          }).then(re => {
            this.fullscreenLoading = false
            this.$message.success('保存成功！')
            this.getFormDataFn()
            this.isEdit = 0
          })
        }
      })
    },
    cancelFn () {
      this.dialogAbolishVisible = true
    },
    resetForm () {
      this.getFormDataFn()
      this.isEdit = 0
      this.dialogAbolishVisible = false
    },
    selValChangeFn (val, index) {
      switch (index) {
        case 'certificatesType':
          this.formdata[index + 'Name'] = this.certificatesTypeList.filter(re => re.id === val)[0].name
          break
        case 'politicalOutlook':
          this.formdata[index + 'Name'] = this.politicsStatusList.filter(re => re.dictCode === val)[0].dictValue
          break
        case 'userNation':
          this.formdata[index + 'Name'] = this.nationalityList.filter(re => re.dictCode === val)[0].dictValue
          break
        case 'highestEducation':
          this.formdata[index + 'Name'] = this.highestEducationList.filter(re => re.dictCode === val)[0].dictValue
          break

        default:
          break
      }
    },
    getarg1 (val) {
      if (val === null) {
        return ''
      }
      let arg = new Date(val)
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
