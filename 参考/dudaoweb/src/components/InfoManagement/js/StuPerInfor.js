import { cityData } from '@/common/js/city_Data'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    var userBirthdayStr = (rule, value, callback) => {
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
    var validIDP = (rule, value, callback) => {
      if (value && this.ruleForm.parentIdType === 1 && !/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value)) {
        callback(new Error('父母身份信息有误!'))
      } else {
        callback()
      }
    }

    var positiveInteger = (rule, value, callback) => {
      if (value && !/^[1-9]\d*$/.test(value)) {
        callback(new Error('请输入正整数'))
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
      activeName: 'first',
      isEdit: false, // 是否编辑状态
      token: { 'authorization': sessionStorage.getItem('user_token') },
      baseUrl: '',
      studentHealth: ['', '健康', '良好', '一般', '差'],
      certificatesType: ['', '身份证', '香港特区护照/身份证', '澳门特区护照/身份证', '台湾居民来往大陆通行证', '护照', '其他'],
      parentIdType: ['', '居民身份证', '护照', '其他'],
      householdsType: ['', '农业户口', '非农户口'],
      yesOrNo: ['否', '是'],
      studentTransborationType: ['', '家长接送', '校车接送', '其他'],
      national: [],
      cityOptions: [],
      infoData: {
        greadList: [],
        classList: [],
        national: []
      },  // 个人信息
      ruleForm: {},
      rules: {
        userBirthdayStr: [
          { validator: userBirthdayStr, trigger: 'change' }
        ],
        certificatesNum: [
          { validator: validID, trigger: 'blur' }
        ],
        parentIdNum: [
          { validator: validIDP, trigger: 'blur' }
        ],
        studentHeight: [
          { validator: (rule, value, callback) => {
            // 正整数和小数
            if (value && !/^[1-9]\d*|^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(value)) {
              callback(new Error('请输入正数'))
            } else if (parseInt(value) > 300) {
              callback(new Error('请输入合理数值'))
            } else {
              callback()
            }
          },
            trigger: 'blur' }
        ],
        childrenListIndex: [{ validator: positiveInteger, trigger: 'blur' }],
        childrenListSize: [{ validator: positiveInteger, trigger: 'blur' }],
        studentDistance: [{ validator: positiveInteger, trigger: 'blur' }],
        contactTele: [{ required: true, validator: isPhoneNumber, trigger: 'blur' }]
      }
    }
  },
  watch: {

  },
  mounted () {
    // 进页面默认执行方法
    this.baseUrl = this.$api.baseUrl
    this.cityOptions = cityData
    this.getDictConfLsit()
    this.getData()
  },
  methods: {
    onChangeUpload (file) {
      // 选择图片并验证
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      this.ruleForm.userPhoto2 = URL.createObjectURL(file.raw)
      // this.$set(this.ruleForm, 'userPhoto2', URL.createObjectURL(file.raw))// 改变数据并且更新视图
    },
    submitUpload () {
      // 上传图片
      this.$refs.upload.submit()
    },
    handleAvatarSuccess (re, file) {
      // 上传图片 成功后
      console.log(re)
      if (re.code > 0) {
        this.ruleForm.userPhoto = re.list[1]
        this.$message.success(re.desc)
      } else {
        this.$message.error(re.desc)
      }
    },
    edit () {
      this.isEdit = true
    },
    getData () {
      // 获取个人信息管理(家长)
      this.fullscreenLoading = true
      this.$ajax({
        method: 'post',
        url: 'baseInfo/stuInfo/stuInfoSelect',
        data: {}
      }).then((re) => {
        this.fullscreenLoading = false
        if (re.data.code > 0) {
           // 性别,民族数字转中文
          re.data.data.stu.studentGenderName = re.data.data.stu.studentGender === 1 ? '男' : '女'
          this.national.forEach((v, k) => {
            if (v.value === re.data.data.user.userNation) {
              re.data.data.user.userNationName = v.lable
            }
          })
          let photoUrl = re.data.data.user.userPhoto ? re.data.data.user.userPhoto.slice(1) : ''
          re.data.data.user.userPhoto2 = this.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + photoUrl
          re.data.data.gradeClass = re.data.data.gradeClass === null ? {} : re.data.data.gradeClass
          re.data.data.parent = re.data.data.parent === null ? {} : re.data.data.parent
          re.data.data.user.userBirthdayStr = this.$api.getDateAll(re.data.data.user.userBirthday, '-')
          re.data.data.user.entranceDateStr = this.$api.getDateAll(re.data.data.user.entranceDate, '-')
          this.ruleForm = Object.assign(re.data.data.gradeClass, re.data.data.stu, re.data.data.parent, re.data.data.user)
          this.ruleForm.address1 = [this.ruleForm.householdsProvince, this.ruleForm.householdsCity, this.ruleForm.householdsArea]
          this.ruleForm.address2 = [this.ruleForm.addressProvince, this.ruleForm.addressCity, this.ruleForm.addressArea]
          this.ruleForm.householdsAddr = this.ruleForm.householdsAddr !== null ? this.ruleForm.householdsAddr : ''
          this.ruleForm.addressAddr = this.ruleForm.addressAddr !== null ? this.ruleForm.addressAddr : ''

          // console.log(this.ruleForm)
          // this.$set(this, 'ruleForm', this.ruleForm)
        } else {
          this.$message.error(re.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
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
          this.national = re.data.data.filter(function (v) {
            return v.dictType === 'NATION'
          }).map(function (v) {
            return {lable: v.dictName, value: v.dictCode}
          })
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
          _this.ruleForm.gradeName = v.gradeName
        }
      })
    },
    submitForm (formName) {
      // 提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 数据验证
          if (this.ruleForm.address1 && this.ruleForm.address2) {
            this.ruleForm.householdsProvince = this.ruleForm.address1[0]
            this.ruleForm.householdsCity = this.ruleForm.address1[1]
            this.ruleForm.householdsArea = this.ruleForm.address1[2]
            this.ruleForm.addressProvince = this.ruleForm.address2[0]
            this.ruleForm.addressCity = this.ruleForm.address2[1]
            this.ruleForm.addressArea = this.ruleForm.address2[2]
          }
          if (this.ruleForm.certificatesType === null && this.ruleForm.certificatesNum) {
            this.$message.error('请选择学生证件类型')
            return
          }
          if (this.ruleForm.parentIdType === null && this.ruleForm.parentIdNum) {
            this.$message.error('请选择家长证件类型')
            return
          }
          this.ruleForm.userBirthday = this.ruleForm.userBirthdayStr === null || this.ruleForm.userBirthdayStr === '' ? '' : this.$api.time(this.ruleForm.userBirthdayStr)
          this.ruleForm.studentGender = this.ruleForm.studentGenderName === '男' ? 1 : 0

          this.fullscreenLoading = true
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/stuInfo/stuInfoUpdate',
            data: this.ruleForm
          }).then((re) => {
            this.fullscreenLoading = false
            if (re.data.code > 0) {
              this.$message.success('修改成功')
              this.getData()
              this.isEdit = false
            } else {
              this.$message.error(re.data.desc)
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
    },
    resetForm (formName) {
      this.$confirm('如有内容修改，取消编辑后修改将不会被保存，确认取消编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].clearValidate()
        this.getData()
        this.isEdit = false
      })
    },
    handleClick (tab, event) {
      var box = document.querySelector('#formBox')
      var item = document.querySelector('#' + tab.name)
      // 滚动到的位置
      var osTop = item.offsetTop - box.offsetTop
      // 设置定时器
      var timer = setInterval(function () {
        // 到达位置，清除定时器
        if (Math.abs(box.scrollTop - osTop) <= 1) {
          clearInterval(timer)
        };
        let thisscroll = 0
        if (box.scrollTop < osTop) {
          thisscroll = osTop - Math.abs(box.scrollTop - osTop) / 2
        } else {
          thisscroll = osTop + Math.abs(box.scrollTop - osTop) / 2
        }
        box.scrollTop = Math.abs(thisscroll)
      }, 30)
      setTimeout(function () {
        // 清除定时器
        clearInterval(timer)
      }, 300)
    }
  }
}
