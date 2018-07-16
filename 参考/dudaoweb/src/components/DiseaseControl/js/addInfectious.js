import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      dialogVisible: false, // 返回确认弹框
      waitRecord: '', // 判断条件
      treeShow: true, // 树是否显示
      studentId: '', // 学生id
      recordId: '', // 记录ID
      myselfDiseaseName: '其它疾病在此输入',
      diseaseCodeArry: [
        {id: '1', diseaseName: '发热发烧'},
        {id: '2', diseaseName: '高热惊厥'},
        {id: '3', diseaseName: '鼻炎'},
        {id: '4', diseaseName: '哮喘'},
        {id: '5', diseaseName: '支气管炎'},
        {id: '6', diseaseName: '肺炎'},
        {id: '7', diseaseName: '湿疹'},
        {id: '8', diseaseName: '过敏性皮炎'},
        {id: '9', diseaseName: '胃肠炎'},
        {id: '10', diseaseName: '阑尾炎'}
      ],
      diseaseCodeArry2: [
        {id: '1', diseaseName: '流行性感冒'},
        {id: '2', diseaseName: '手足口病'},
        {id: '3', diseaseName: '水痘'},
        {id: '4', diseaseName: '流行性腮腺炎'},
        {id: '5', diseaseName: '猩红热'},
        {id: '6', diseaseName: '急性出血结膜炎'},
        {id: '7', diseaseName: '痢疾'},
        {id: '8', diseaseName: '麻疹'},
        {id: '9', diseaseName: '风疹'},
        {id: '10', diseaseName: '传染性肝炎'}
      ],
      ruleForm: {
        diseaseDate: Date.parse(new Date()), // 发病日期
        diagnosisDate: Date.parse(new Date()), // 诊断日期
        diseaseType: 2, // 疾病类型
        diagnosisCompany: '', // 诊断单位
        diseaseName: '', // 疾病名称
        reportDate: Date.parse(new Date()), // 报告日期
        treatmentMethod: 1, // 处理办法
        returnDate: Date.parse(new Date()), // 返园日期
        diseaseCode: '1', // 疾病code
        krtenCode: ''
      },
      rules: {
        diseaseDate: [
          { required: true, message: '发病日期', trigger: 'change' }
        ],
        diagnosisDate: [
          { required: true, message: '诊断日期', trigger: 'change' }
        ],
        diagnosisCompany: [
          { required: true, message: '请输入诊断单位', trigger: 'blur' }
        ],
        diseaseType: [
          { required: true, message: '请选择疾病类型', trigger: 'change' }
        ],
        diseaseName: [
          { required: true, message: '请选择疾病名称', trigger: 'change' }
        ],
        reportDate: [
          { required: true, message: '发病日期', trigger: 'change' }
        ],
        treatmentMethod: [
          { required: true, message: '请选择疾病类型', trigger: 'change' }
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
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.getTreeData()
    let editRecord = this.$api.getUrlParameter('sourceHtml')
    this.waitRecord = this.$api.getUrlParameter('wait')
    if (this.waitRecord === 'recordWait') {
      this.treeShow = false
      this.studentId = this.$route.query.studentId
      this.recordId = this.$route.query.recordId
    }
    // 编辑:从后端获取数据
    if (editRecord === 'infeRecordEdit') {
      this.ruleForm = Object.assign({}, JSON.parse(sessionStorage.getItem('infeRecordData')))
      let userId = this.ruleForm.studentId ? this.ruleForm.studentId : []
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([userId], true)
      })
    }
    this.ruleForm.krtenCode = JSON.parse(sessionStorage.getItem('LoginUser')).krtenCode
  },
  filterText (val) {
    this.$refs.tree.filter(val)
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    saveInfo (fromName) {
      if (this.diseaseType === 1) {
        this.diseaseCodeArry.forEach((v, k) => {
          if (v.id === this.ruleForm.diseaseCode) {
            this.ruleForm.diseaseName = v.diseaseName
          }
          if (this.ruleForm.diseaseCode === '0') {
            this.ruleForm.diseaseName = this.myselfDiseaseName
          }
        })
      } else {
        this.diseaseCodeArry2.forEach((v, k) => {
          if (v.id === this.ruleForm.diseaseCode) {
            this.ruleForm.diseaseName = v.diseaseName
          }
          if (this.ruleForm.diseaseCode === '0') {
            this.ruleForm.diseaseName = this.myselfDiseaseName
          }
        })
      }
      let sendData = []
      if (this.waitRecord === 'recordWait') {
        this.$set(this.ruleForm, 'studentId', this.studentId)
        this.$set(this.ruleForm, 'recordId', this.recordId)
        sendData.push(this.ruleForm)
      } else {
         // 保存
      // 判断是否选了人
        let checkNodes = []
        checkNodes = this.$refs.tree.getCheckedNodes()
        if (checkNodes.length <= 0) {
          this.$message.error('请选择要添加的人')
          return false
        }
       // 去掉父节点
        let newArry = []
        checkNodes.forEach(re => {
          if (!re.children) {
            let obj = {
              'id': re.id,
              'label': re.label
            }
            newArry.push(obj)
          }
        })
        newArry.forEach((v, k) => {
          let obj = Object.assign({}, this.ruleForm)
          this.$set(obj, 'studentId', v.id)
          sendData.push(obj)
        })
      }
      this.$refs[fromName].validate((valid) => {
        if (valid) {
           // 验证通过
          this.$ajax({
            method: 'post',
            url: 'disease/healthrecords/addConfirmedRecord',
            data: sendData
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
        this.treeData = data.data.list
      })
      .catch(err => {
        this.$message.error('错误信息：' + err)
      })
    }
  }
}
