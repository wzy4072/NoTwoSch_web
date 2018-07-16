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
        wages1: [{
          required: true,
          message: '月工资 ≤2200不能为空！',
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
        wages2: [
          {
            required: true,
            message: '2200＜ 月工资 ≤ 3000不能为空！',
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
        wages3: [
          {
            required: true,
            message: '3000＜ 月工资 ≤ 4500不能为空！',
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
        wages4: [
          {
            required: true,
            message: '4500＜ 月工资 ≤ 7000不能为空！',
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
        wages5: [
          {
            required: true,
            message: '7000＜ 月工资不能为空！',
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
      this.$refs['ruleForms'].validate(valid => {
        if (valid) {
          let arr = ['native']
          for (let index = 0; index < arr.length; index++) {
            this.formdata[arr[index] + 'Province'] = this.formdata[arr[index] + 'List'][0]
            this.formdata[arr[index] + 'City'] = this.formdata[arr[index] + 'List'][1]
            this.formdata[arr[index] + 'Area'] = this.formdata[arr[index] + 'List'][2]
          }
          this.formdata.musicClassroom = this.formdata.musicClass === '0' ? null : this.formdata.musicClassroom
          this.formdata.indoorGameField = this.formdata.indoor === '0' ? null : this.formdata.indoorGameField
          this.formdata.outdoorGameField = this.formdata.outdoor === '0' ? null : this.formdata.outdoorGameField
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
