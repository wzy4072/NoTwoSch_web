import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      tableData: [], // table数据
      copyData: [], // table数据副本
      searchstr: '', // table模糊搜索字段
      subTableData: [], // 弹框table当前数据
      subCopyTableData: [], // 弹框table所有数据
      subsearchstr: '', // 弹框table模糊搜索字段
      searchFiledArr: [ // table 需要搜索的字段
        {field: 'gradeCode', value: null},
        {field: 'gradeName', value: null},
        {field: 'gradeDean', value: null}
      ],
      subSearchFiledArr: [ // 弹框table 需要搜索的字段
        {field: 'workerName', value: null},
        {field: 'workerGender', value: null},
        {field: 'workerPhone', value: null},
        {field: 'workerType', value: null}
      ],
      printOb: {
        pageNum: 1,
        title: '年级班级主任列表'
      },
      dialogChangeTeacher: false, // 人员选择弹框
      dialogCancelEdit: false, // 取消编辑弹框
      isHideEdit: false, // 是否隐藏编辑按钮
      showInputOrSpan: false, // true：显示编辑输入框 false：显示文本内容
      subCurrCheck: {}, // 弹框 table 当前选中行数据
      currClickField: null, // 当前table行 点击 字段
      currClickRow: {} // 当前table行 点击数据
    }
  },
  mounted () {
    this.getTableData() // 获取table数据
    this.getPersonList() // 获取弹框待选人员列表数据
  },
  methods: {
    getTableData () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/getGradeHeadTeacherList'
      }).then(re => {
        let arr = []
        let array = []
        re.data.data.forEach((v, k) => {
          var filter = array.filter((m, d) => {
            return m.gradeCode === v.gradeCode
          })
          var type = typeof v.managerType === 'string' ? v.managerType.split(',') : []
          var name = v.workerName.split(',')
          type.forEach(function (o, k) {
            switch (o) {
              case '1':
                v.gradeDean = name[k]
                break
              case '2':
                v.classTeach = name[k]
                break
              case '3':
                v.viceClass = name[k]
                break
              case '4':
                v.governess = name[k]
                break
            }
          })
          if (filter.length === 0) {
            if (v.className !== '') {
              array.push({
                classCode: v.classCode,
                gradeName: v.gradeName,
                gradeCode: v.gradeCode,
                workerName: v.gradeDean,
                gradeClassId: v.gradeClassId,
                class: [v]
              })
            } else {
              array.push({
                classCode: v.classCode,
                gradeName: v.gradeName,
                gradeCode: v.gradeCode,
                workerName: v.gradeDean,
                gradeClassId: v.gradeClassId,
                class: []
              })
            }
          } else {
            if (v.className !== '') {
              v.gradeDean = filter[0].workerName
              v.gradeId = filter[0].gradeClassId
              filter[0].class.push(v)
            }
          }
        })
        array.forEach((v, k) => {
          v.gradeWorkerName = v.workerName
          if (v.class && v.class.length > 0) {
            v.class.forEach((v1, k1) => {
              if (k1 === 0) {
                v1.rowSpanNum = v.class.length
              }
              arr.push(v1)
            })
          }
        })
        this.copyData = arr
        this.tableData = JSON.parse(JSON.stringify(this.copyData))
      })
    },
    getPersonList () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/getKrtenWorkerList'
      }).then(re => {
        this.subCopyTableData = re.data.data
        this.subTableData = Object.assign([], this.subCopyTableData)
      })
    },
    editName (str, index, row) { // table 点击 编辑
      this.$set(this.subCurrCheck, 'workerName', row[str])
      this.currClickField = str
      this.currClickRow = row
      this.dialogChangeTeacher = true
    },
    savePersonSet () { // 保存人员设置
      if (!this.subCurrCheck.workerName) {
        this.$message.warning('请选择人员!')
        return false
      }
      let sendData = {}
      let typeValue = {classTeach: 2, viceClass: 3, governess: 4}
      let temp = this.currClickRow
      if (this.currClickField === 'gradeDean') {
        sendData.gradeClassId = temp.gradeId
        sendData.type = 1
      } else {
        sendData.gradeClassId = temp.classId
        sendData.classCode = temp.classCode
        sendData.className = temp.className
        sendData.type = typeValue[this.currClickField]
      }
      sendData.gradeCode = temp.gradeCode
      sendData.gradeName = temp.gradeName
      if (this.subCurrCheck.workerId === undefined) { // 未操作直接保存需遍历取出数据
        let temp1 = this.subCopyTableData.filter((item) => {
          return item.workerName == this.subCurrCheck.workerName
        })[0]
        sendData.workerId = temp1.workerId
        sendData.userId = temp1.userId
      } else {
        sendData.workerId = this.subCurrCheck.workerId
        sendData.userId = this.subCurrCheck.userId
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/setGradeClassTeacher',
        data: sendData
      }).then(data => {
        this.dialogChangeTeacher = false
        this.$message.success('保存成功')
        // 重新获取数据
        this.getTableData()
        this.getPersonList()
      })
    },
    showEditOrBtn (type) {
      let sendArr = []
      this.copyData.forEach((v, k) => {
        this.tableData.forEach((v1, k1) => {
          if (v.classId === v1.classId) {
            if (v1.gradeDean !== v.gradeDean) {
              let sendObj = {
                workerName: v1.gradeDean,
                gradeClassId: v1.gradeId,
                type: 1,
                update: !v1.gradeDean ? '' : (!v.gradeDean ? '0' : '1'),
                gradeCode: v1.gradeCode,
                classCode: v1.classCode,
                className: v1.className,
                gradeName: v1.gradeName
              }
              sendArr.push(sendObj)
            }
            if (v1.classTeach !== v.classTeach) {
              let sendObjTwo = {
                workerName: v1.classTeach,
                gradeClassId: v1.classId,
                type: 2,
                update: !v1.classTeach ? '' : (!v.classTeach ? '0' : '1'),
                gradeCode: v1.gradeCode,
                gradeName: v1.gradeName,
                classCode: v1.classCode,
                className: v1.className
              }
              sendArr.push(sendObjTwo)
            }
            if (v1.viceClass !== v.viceClass) {
              let sendObjTwo = {
                workerName: v1.viceClass,
                gradeClassId: v1.classId,
                type: 3,
                update: !v1.viceClass ? '' : (!v.viceClass ? '0' : '1'),
                gradeCode: v1.gradeCode,
                gradeName: v1.gradeName,
                classCode: v1.classCode,
                className: v1.className
              }
              sendArr.push(sendObjTwo)
            }
            if (v1.governess !== v.governess) {
              let sendObjTwo = {
                workerName: v1.governess,
                gradeClassId: v1.classId,
                type: 4,
                update: !v1.governess ? '' : (!v.governess ? '0' : '1'),
                gradeCode: v1.gradeCode,
                gradeName: v1.gradeName,
                classCode: v1.classCode,
                className: v1.className
              }
              sendArr.push(sendObjTwo)
            }
          }
        })
      })
        // let unique = function (arr, k) {
        //   let n = {}
        //   let r = []
        //   for (let i = 0; i < arr.length; i++) {
        //     if (!n[arr[i][k]]) {
        //       n[arr[i][k]] = true
        //       r.push(arr[i])
        //     }
        //   }
        //   return r
        // }
        // sendArr = unique(sendArr, 'gradeClassId')
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/batchSetGradeClassTeacher',
        data: { list: sendArr }
      }).then(data => {
        sendArr = []
        if (data.data.desc) {
          that.$alert(data.data.desc, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              console.log('')
            }
          })
        }
        that.getTableData()
      })
    },
    cancelFun () { // 确认取消
      this.dialogCancelEdit = false
      this.isHideEdit = false
      this.showInputOrSpan = false
      this.tableData = JSON.parse(JSON.stringify(this.copyData))
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        if (row.rowSpanNum) {
          return {rowspan: row.rowSpanNum, colspan: 1}
        } else {
          return {rowspan: 0, colspan: 0}
        }
      }
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = JSON.parse(JSON.stringify(this.copyData)).filter(o => {
          return this.searchFiledArr.some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.copyData))
      }
    },
    subsearchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.subTableData = this.subCopyTableData.filter(o => {
          return this.subSearchFiledArr.some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this.subTableData = this.subCopyTableData
      }
    }
  }
}
