import returnBtn from '@/common/components/returnBtn'
let currKrtenCode = null
export default {
  components: { returnBtn },
  data () {
    return {
      isEdit: 0,
      formdata: {},
      dialogAbolishVisible: false,
      rulesObj: {
        principaStaffSalary: [{
          required: true,
          message: '校长及教学人员薪酬不能为空！',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (Number(value) < 0 || value.toString().indexOf('.') > -1) {
              callback(new Error('请填写整数数值！'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        nonteachStaffSalary: [
          {
            required: true,
            message: '非教学人员薪酬不能为空！',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (Number(value) < 0 || value.toString().indexOf('.') > -1) {
                callback(new Error('请填写整数数值！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        landRentManagementFee: [
          {
            required: true,
            message: '用地租金、管理费不能为空！',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (Number(value) < 0 || value.toString().indexOf('.') > -1) {
                callback(new Error('请填写整数数值！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        teachingSuppliesFee: [
          {
            required: true,
            message: '教学用品不能为空！',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (Number(value) < 0 || value.toString().indexOf('.') > -1) {
                callback(new Error('请填写整数数值！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        staffTrainingFee: [
          {
            required: true,
            message: '员工培训及专业发展不能为空！',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (Number(value) < 0 || value.toString().indexOf('.') > -1) {
                callback(new Error('请填写整数数值！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        otherFee: [
          {
            required: true,
            message: '其他开资不能为空！',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (Number(value) < 0 || value.toString().indexOf('.') > -1) {
                callback(new Error('请填写整数数值！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
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
        this.formdata.nativeList = [this.formdata.nativeProvince, this.formdata.nativeCity, this.formdata.nativeArea]
        this.$set(this.formdata, 'outdoor', this.formdata.outdoorGameField === null ? '0' : '1')
        this.$set(this.formdata, 'indoor', this.formdata.indoorGameField === null ? '0' : '1')
        this.$set(this.formdata, 'musicClass', this.formdata.musicClassroom === null ? '0' : '1')
      }).catch(err => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    saveFn () {
      debugger
      this.$refs['ruleForms'].validate(valid => {
        debugger
        if (valid) {
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/kindergapten/updateKrtenInfo',
            data: this.formdata
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

  }
}
