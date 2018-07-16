
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      dialogVisible: false, // 返回确认弹框
      ruleForm: {
        checkType: 1, // 检查类型
        checkTime: '', // 检查日期
        abnormalCondition: '', // 异常情况记录
        handlingOpinionsType: 1, // 处理意见 (1.隔离 2.留园)
        handlingOpinions: '', // 处理意见详细
        krtenCode: ''
      },
      rules: {
        checkType: [
          { required: true, message: '请选择检查类型', trigger: 'change' }
        ],
        checkTime: [
          {'message': '请选择日期', 'required': true, trigger: 'change'}
        ],
        abnormalCondition: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    this.getTreeData()
    let editRecord = this.$api.getUrlParameter('sourceHtml')
    // 编辑:从后端获取数据
    if (editRecord === 'recordEdit') {
      this.ruleForm = Object.assign({}, JSON.parse(sessionStorage.getItem('recordEdit')))
      console.log(this.ruleForm)
      let userId = this.ruleForm.studentId ? this.ruleForm.studentId : []
      // let userArr = this.ruleForm.studentId ? this.ruleForm.studentId : []
      // let idArr = []
      // idArr = userArr.map(re => {
      //   return re.id
      // })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([userId], true)
      })
    }
    this.ruleForm.krtenCode = JSON.parse(sessionStorage.getItem('LoginUser')).krtenCode
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTreeData () {
      this.$ajax({
        method: 'POST',
        url: '/baseInfo/stuInfo/selectStudentTreeByKrten'
      })
      .then(data => {
        data.data.list.forEach((v, k) => {
          v.label = v.gradeName
          v.id = v.gradeId
          v.children = v.classList
          v.classList.forEach((v2, k2) => {
            v2.label = v2.className
            v2.id = v.classId
            v2.children = v2.students
            v2.students.forEach((v3, k3) => {
              v3.label = v3.studentName
              v3.id = v3.stduentId
            })
          })
        })
        console.log(data.data.list)
        this.treeData = data.data.list
      })
      .catch(err => {
        this.$message.error('错误信息：' + err)
      })
    },
    saveInfo (fromName) {
     // 检查是否选择人
      let getNodes = []
      getNodes = this.$refs.tree.getCheckedNodes()
      if (getNodes.length <= 0) {
        this.$message.error('请选择添加的人')
        return false
      }
      // 去掉父节点
      let newArry = []
      getNodes.forEach(re => {
        if (!re.children) {
          let obj = {
            'id': re.id,
            'label': re.label
          }
          newArry.push(obj)
        }
      })
      let sendData = []
     // this.$set(this.ruleForm, 'userId', newArry)
      newArry.forEach((v, k) => {
        let obj = this.ruleForm
        this.$set(obj, 'studentId', v.id)
        sendData.push(obj)
      })
      console.log(sendData)
     // 保存
     // 编辑和保存在一个接口
      this.$refs[fromName].validate((valid) => {
        if (valid) {
         // 验证通过
          this.$ajax({
            method: 'post',
            url: 'disease/healthrecords/saveRecordList',
            data: sendData
          }).then(re => {
            this.$message.success('保存成功')
            this.$router.push({path: '/DiseaseControl/diseaseRecord'})
          }).catch(err => {
            this.$message.error('错误信息：' + err)
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
