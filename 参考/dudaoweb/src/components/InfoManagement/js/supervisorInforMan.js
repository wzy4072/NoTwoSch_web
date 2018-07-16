import * as cityData from '@/common/js/city_Data'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      isEdit: 0,
      formData: {
        areaName: '',
        nativeAddress: '',
        areaTel: '',
        areaFax: '',
        areaEmail: '',
        nativeStr: '',
        nativeList: []
      },
      dialogAbolishVisible: false,
      cityList: cityData.cityData,
      rulesObj: {
        areaName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        nativeList: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getdata()
  },
  methods: {
    getdata () {
      // 获取数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/infoManage/selectAreaInfo',
        data: {}
      })
        .then(re => {
          this.fullscreenLoading = false
          this.formData.areaId = re.data.data.areaId
          this.formData.areaName = re.data.data.areaName
          this.formData.nativeAddress = re.data.data.nativeAddress
          this.formData.areaTel = re.data.data.areaTel
          this.formData.areaFax = re.data.data.areaFax
          this.formData.areaEmail = re.data.data.areaEmail
          this.formData.nativeList = [re.data.data.nativeProvince, re.data.data.nativeCity, re.data.data.nativeArea]
          this.formData.nativeStr = re.data.data.nativeProvince + '/' + re.data.data.nativeCity + '/' + re.data.data.nativeArea
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    saveFn () { // 保存
      let dataObj = Object.assign({}, this.formData)
      dataObj.nativeProvince = dataObj.nativeList[0]
      dataObj.nativeCity = dataObj.nativeList[1]
      dataObj.nativeArea = dataObj.nativeList[2]
      delete dataObj.nativeStr
      delete dataObj.nativeList
      this.fullscreenLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/infoManage/saveAreaInfo',
            data: dataObj
          }).then(re => {
            this.fullscreenLoading = false
            this.formData.nativeStr = this.formData.nativeList.join('/')
            this.$message.success('保存成功！')
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
    resetForm (formName) {
      this.dialogAbolishVisible = false
      this.isEdit = 0
      this.$refs[formName].resetFields()
      this.getdata()
    }
  }
}
