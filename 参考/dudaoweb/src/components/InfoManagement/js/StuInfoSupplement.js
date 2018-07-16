import { cityData } from '../../../common/js/city_Data'

export default {
  data () {
    var userBirthday = (rule, value, callback) => {
      let thisID = this.ruleForm.certificatesNum
      // 身份证上的生日
      let birthdayforID = ''
      if (thisID) {
        birthdayforID = thisID.slice(6, 10) + '-' + thisID.slice(10, 12) + '-' + thisID.slice(12, 14)
      }
      if (value && this.ruleForm.certificatesType === 1 && birthdayforID !== value) {
        callback(new Error('与身份证上的生日不一致!'))
      } else {
        callback()
      }
    }
    var validID = (rule, value, callback) => {
      if (value && this.ruleForm.certificatesType === 1 && !/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value)) {
        callback(new Error('身份信息有误!'))
      } else {
        callback()
      }
    }

    var isPhoneNumber = (rule, value, callback) => {
      if (!/^0?(13|14|15|17|18)[0-9]{9}$/.test(value)) {
        callback(new Error('请输入电话号码'))
      } else {
        callback()
      }
    }
    return {
      baseUrl: '',
      infoData: {
        greadList: [],
        classList: [],
        national: [],
        cityOptions: []
      },
      ruleForm: {
        studentName: '',
        studentGenderName: '男',
        entranceDate: '',
        entranceCode: '',
        gradeName: '',
        gradeCode: '',
        className: '',
        classCode: '',
        seatNum: '',
        certificatesType: '',
        certificatesNum: '',
        userBirthday: '',
        userNation: '',
        userNationName: '',
        contactTele: '',
        address: []
      },
      rules: {
        studentName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        studentGenderName: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        entranceCode: [
          { required: true, message: '填写格式：当前年份（如：2018）', trigger: 'blur' }
        ],
        gradeCode: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        classCode: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        seatNum: [
          { required: true, message: '请填写座号', trigger: 'blur' }
        ],
        entranceDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        userBirthday: [
          { validator: userBirthday, trigger: 'change' }
        ],
        certificatesNum: [
          { validator: validID, trigger: 'blur' }
        ],
        contactTele: [{ required: true, validator: isPhoneNumber, trigger: 'blur' }]
      }
    }
  },
  mounted () { // 进页面默认执行方法
    this.baseUrl = this.$api.baseUrl
    this.infoData.cityOptions = cityData
    this.getDictConfLsit()
    this.getGrade()
  },
  methods: {
    getDictConfLsit () {
      // 基本信息查询 (民族)
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/selectDictConfLsit',
        data: { 'dictType': 'NATION' } // ALL
      }).then((re) => {
        this.fullscreenLoading = false
        if (re.data.code > 0) {
          this.DictConfLsit = re.data.data
          this.infoData.national = re.data.data.filter(function (v) {
            return v.dictType === 'NATION'
          }).map(function (v) {
            return v.dictName
          })
        } else {
          this.$message.error(re.data.desc)
        }
      })
    },
    getGrade () {
      // 获取在线年级班级列表
      this.fullscreenLoading = true
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/gradeClass/getGradeByKrten',
        data: {}
      }).then((re) => {
        this.fullscreenLoading = false
        if (re.data.code > 0) {
          this.infoData.greadList = re.data.list
          this.infoData.classList = re.data.list.length ? re.data.list[0].classList : []
        } else {
          this.$message.error(re.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    changeGread () {
      var _this = this
      this.infoData.greadList.forEach((v, k) => {
        if (v.gradeCode === _this.ruleForm.gradeCode) {
          _this.infoData.classList = v.classList
          _this.ruleForm.className = v.classList[0].className
          _this.ruleForm.classCode = v.classList[0].classCode
          _this.ruleForm.gradeName = v.gradeName
        }
      })
    },
    submitForm (formName) {
      // 提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 地址转换
          if (this.ruleForm.address) {
            this.ruleForm.addressProvince = this.ruleForm.address[0]
            this.ruleForm.addressCity = this.ruleForm.address[1]
            this.ruleForm.addressArea = this.ruleForm.address[2]
          }
          // 民族转换
          this.DictConfLsit.forEach((v, k) => {
            if (v.dictName === this.ruleForm.userNationName) {
              this.ruleForm.userNation = v.dictCode
            }
          })
          this.fullscreenLoading = true
          let temp = JSON.parse(JSON.stringify(this.ruleForm))
          temp.entranceCode = 'Y' + temp.entranceCode
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/stuInfo/saveStudentList',
            data: [temp]
          }).then((re) => {
            this.fullscreenLoading = false
            if (re.data.code > 0 && re.data.data.missSize === 0) {
              this.$message.success(re.data.desc)
              this.$router.push({path: '/InfoManagement/StuInforManage'})
            } else {
              this.$message.error(re.data.data.missList[0].errorDescription)
            }
          }).catch((err) => {
            this.fullscreenLoading = false
            this.$message.error('接口异常：' + err)
          })
        } else {
          this.$message.error('信息填写有误')
          return false
        }
      })
    }
  }
}
