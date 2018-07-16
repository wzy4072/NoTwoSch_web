import * as cityData from '@/common/js/city_Data'
import returnBtn from '@/common/components/returnBtn'
let currKrtenCode = null
export default {
  components: { returnBtn },
  data () {
    return {
      isEdit: 0,
      isDisabNormal: false, // 是否禁选 规范化幼儿园 按钮
      formdata: {},
      dialogAbolishVisible: false,
      rulesObj: {
        krtenName: [{
          required: true,
          message: '幼儿园名称不能为空！',
          trigger: 'blur'
        }],
        nativeList: [{
          required: true,
          message: '所在地区不能为空！',
          trigger: 'blur'
        }],
        runSchoolCode: [
          {
            required: true,
            message: '办学编码不能为空！',
            trigger: 'blur'
          }
        ],
        nativeAddress: [
          {
            required: true,
            message: '详细地址不能为空！',
            trigger: 'blur'
          }
        ],
        schoolNatrue: [
          {
            required: true,
            message: '幼儿园性质不能为空！',
            trigger: 'blur'
          }
        ],
        schoolLevel: [
          {
            required: true,
            message: '幼儿园等级不能为空！',
            trigger: 'blur'
          }
        ],
        areaCovered: [{
          required: true,
          message: '占地面积不能为空！',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '请填写正确的数值!'
        }],
        classroomNum: [{
          required: true,
          message: '教室数量不能为空！',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '请填写正确的数值!'
        }],
        fulldayFee: [{
          required: true,
          message: '全日制保教费不能为空！',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (Number(value) < 0) {
              callback(new Error('请填写正数！'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        boardingFee: [
          {
            validator: (rule, value, callback) => {
              if (Number(value) < 0) {
                callback(new Error('请填写正数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        // outdoorGameField: [
        //   {
        //     type: 'number',
        //     message: '请填写正确的数值!'
        //   }
        // ],
        // indoorGameField: [
        //   {
        //     type: 'number',
        //     message: '请填写正确的数值!'
        //   }
        // ],
        // musicClassroom: [
        //   {
        //     type: 'number',
        //     message: '请填写正确的数值!'
        //   }
        // ],
        vacationFee: [
          {
            validator: (rule, value, callback) => {
              if (Number(value) < 0) {
                callback(new Error('请填写正数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        foodFee: [
          {
            validator: (rule, value, callback) => {
              if (Number(value) < 0) {
                callback(new Error('请填写正数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        trusteeshipFee: [
          {
            validator: (rule, value, callback) => {
              if (Number(value) < 0) {
                callback(new Error('请填写正数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        schoolbusFee: [
          {
            validator: (rule, value, callback) => {
              if (Number(value) < 0) {
                callback(new Error('请填写正数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        areaTel: [{
          required: true,
          validator: (rule, value, callback) => {
            // 判断 固话 + 手机号码
            let mb = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
            let ph = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
            if (!ph.test(value) && !mb.test(value)) {
              callback(new Error('请填写正确的电话号码'))
            } else {
              callback()
            }
            // if (/^\d+$/.test(value) === true && value.length === 11) {
            //   callback()
            // } else {
            //   callback(new Error('请填写正确的电话号码'))
            // }
          },
          trigger: 'blur'
        }],
        krtenIntroduction: [
          {
            validator: (rule, value, callback) => {
              if (value.length <= 2000) {
                callback()
              } else {
                callback(new Error('最多2000字！'))
              }
            },
            trigger: 'blur'
          }
        ],
        krtenManagerIntroduction: [
          {
            validator: (rule, value, callback) => {
              if (value.length <= 2000) {
                callback()
              } else {
                callback(new Error('最多2000字！'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      certificatesTypeList: [{
        id: '1',
        name: '公办幼儿园'
      },
      {
        id: '2',
        name: '民办幼儿园'
      }
      ], // 证件类型
      politicsStatusList: [{
        id: '1',
        name: '省一级幼儿园'
      },
      {
        id: '2',
        name: '市一级幼儿园'
      },
      {
        id: '3',
        name: '区一级幼儿园'
      },
      {
        id: '4',
        name: '尚未评级'
      }],
      nationalityList: [], // 名族
      highestEducationList: [], // 最高学历
      isShow: {
        nation: true,
        highestEducation: true,
        userBirthday: true
      },
      cityList: cityData.cityData
    }
  },
  mounted () {
    currKrtenCode = JSON.parse(sessionStorage.getItem('LoginUser')).krtenCode
    this.getFormDataFn() // 获取form表单数据
  },
  methods: {
    getFormDataFn () { // 获取form表单数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'get',
        url: 'baseInfo/kindergapten/selectKrtenInfo?krtenCode=' + currKrtenCode
      }).then(re => {
        this.fullscreenLoading = false
        this.$set(this, 'formdata', re.data.data)
        if (this.formdata.nativeProvince && this.formdata.nativeCity && this.formdata.nativeArea) {
          this.formdata.nativeList = [this.formdata.nativeProvince, this.formdata.nativeCity, this.formdata.nativeArea]
        } else {
          this.formdata.nativeList = []
        }
        if (this.formdata.schoolNatrue === null) {
          this.formdata.schoolNatrue = 1
        }
        if (this.formdata.schoolLevel === null) {
          this.formdata.schoolLevel = 1
        }
        this.$set(this.formdata, 'outdoor', this.formdata.outdoorGameField === null ? '0' : '1')
        this.$set(this.formdata, 'indoor', this.formdata.indoorGameField === null ? '0' : '1')
        this.$set(this.formdata, 'musicClass', this.formdata.musicClassroom === null ? '0' : '1')
        this.formdata.outdoorGameField = this.formdata.outdoorGameField === -1 ? null : this.formdata.outdoorGameField
        this.formdata.indoorGameField = this.formdata.indoorGameField === -1 ? null : this.formdata.indoorGameField
        this.formdata.musicClassroom = this.formdata.musicClassroom === -1 ? null : this.formdata.musicClassroom
      }).catch(err => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    saveFn () {
      this.$refs['ruleForms'].validate(valid => {
        if (valid) {
          let arr = ['native']
          let temp = JSON.parse(JSON.stringify(this.formdata))
          for (let index = 0; index < arr.length; index++) {
            temp[arr[index] + 'Province'] = temp[arr[index] + 'List'][0]
            temp[arr[index] + 'City'] = temp[arr[index] + 'List'][1]
            temp[arr[index] + 'Area'] = temp[arr[index] + 'List'][2]
          }
          temp.musicClassroom = temp.musicClass === '0' ? null : (temp.musicClassroom ? temp.musicClassroom : -1)
          temp.indoorGameField = temp.indoor === '0' ? null : (temp.indoorGameField ? temp.indoorGameField : -1)
          temp.outdoorGameField = temp.outdoor === '0' ? null : (temp.outdoorGameField ? temp.outdoorGameField : -1)
          this.fullscreenLoading = true
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/kindergapten/updateKrtenInfo',
            data: temp
          }).then(re => {
            this.fullscreenLoading = false
            this.$message.success('保存成功！')
            this.getFormDataFn()
            this.isEdit = 0
          }).catch(err => {
            this.fullscreenLoading = false
            this.$message.error('接口异常：' + err)
          })
        } else {
          return false
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
    }

  },
  watch: {
    'formdata.schoolLevel': function (newVal, oldVal) { // 幼儿园等级 1,2,3=>规范化幼儿园固定选中‘是’
      if (newVal != 4) {
        this.isDisabNormal = true
        this.formdata.isNormalizationKrten = 1
      } else {
        this.isDisabNormal = false
      }
    }
  }
}
