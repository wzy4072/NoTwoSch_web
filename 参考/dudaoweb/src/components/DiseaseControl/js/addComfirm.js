import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      dialogVisible: false, // 返回确认弹框
      ruleForm: {
        sickDate: Date.parse(new Date()), // 发病日期
        diagnosisDate: Date.parse(new Date()), // 诊断日期
        sickType: '2', // 疾病类型
        sickAddress: '', // 诊断单位
        sickName: '1', // 疾病名称
        reportData: Date.parse(new Date()), // 报告日期
        dealAdvise: '1', // 处理办法
        returnData: Date.parse(new Date())// 返园日期
      },
      rules: {
        sickDate: [
          { required: true, message: '发病日期', trigger: 'change' }
        ],
        diagnosisDate: [
          { required: true, message: '诊断日期', trigger: 'change' }
        ],
        sickAddress: [
          { required: true, message: '请选择诊断单位', trigger: 'blur' }
        ],
        sickType: [
          { required: true, message: '请选择疾病类型', trigger: 'change' }
        ],
        sickName: [
          { required: true, message: '请选择疾病名称', trigger: 'change' }
        ],
        reportData: [
          { required: true, message: '发病日期', trigger: 'change' }
        ],
        dealAdvise: [
          { required: true, message: '请选择疾病类型', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {

  },
  watch: {
  },
  methods: {
    saveInfo (fromName) {
      // 保存
      this.$refs[fromName].validate((valid) => {
        if (valid) {
           // 验证通过
          this.$ajax({
            method: 'post',
            url: 'baseInfo/eduAdminMang/getTeacherAdminList',
            data: this.ruleForm
          }).then(re => {
            this.$message.success('保存成功')
            this.$router.push({path: '/DiseaseControl/infectiousRecord'})
          })
        } else {
          return false
        }
      })
    },
    returnPage () {
      // 返回
      this.$router.go(-1)
    }
  }
}
