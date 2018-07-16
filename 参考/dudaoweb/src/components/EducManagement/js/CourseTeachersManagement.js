import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: {tableBar, returnBtn},
  data () {
    return {
      copyData: [], // table数据副本
      tableData: [], // table数据
      subTableData: [], // 弹框table当前数据
      subCopyTableData: [], // 弹框table所有数据
      printOb: {
        pageNum: 1,
        title: '任课教师列表'
      },
      searchstr: '', // table模糊搜索字段
      subsearchstr: '', // 弹框table模糊搜索字段
      searchFiledArr: [ // table 需要搜索的字段
        {field: 'gradeCode', value: null},
        {field: 'gradeName', value: null},
        {field: 'gradeWorkerName', value: null}
      ],
      subSearchFiledArr: [ // 弹框table 需要搜索的字段
        {field: 'workerName', value: null},
        {field: 'workerGender', value: null},
        {field: 'workerPhone', value: null},
        {field: 'courseName', value: null},
        {field: 'workerType', value: null}
      ],
      changeTeacherName: {},
      changeTeaObj: {
        index: '',
        str: {}
      },
      dialogChangeTeacher: false,
      dialogVisible: false,
      showTwoInfoStr: 0,
      editOrBtn: 0,
      showInputOrSpan: 0,
      cloums: [],
      chooseUserData: {},
      chooseUserIndex: null,
      chooseUserStatus: 0,
      chooseUserNum: null,
      delBtn: true
    }
  },
  mounted () {
    this.getTableData() // 获取table数据
  },
  methods: {
    getTableData () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/getTeacherAdminList'
      })
      .then(data => {
        this.cloums = data.data.data[0].classList[0].courseList
        let arr = []
        data.data.data.forEach((v, k) => {
          v.gradeWorkerName = v.workerName
          if (v.classList && v.classList.length > 0) {
            v.classList.forEach((v1, k1) => {
              if (k1 === 0) {
                v1.rowSpanNum = v.classList.length
              }
              v1.gradeName = v.gradeName
              v1.gradeId = v.gradeId
              v1.gradeCode = v.gradeCode
              v1.gradeWorkerName = v.gradeWorkerName
              v1.courseList.forEach((v2, k2) => {
                v1['courseWorker' + k2] = v2.workerName
                v1['courseWorkerCode' + k2] = v2.courseCode
                v1['courseWorkerName' + k2] = v2.courseName
                v1['courseWorkerId' + k2] = v2.teacherCourseId
              })
              arr.push(v1)
            })
          }
        })
        let arr1 = JSON.parse(JSON.stringify(arr))
        this.copyData = arr1
        this.tableData = arr
      })
    },
    getPersonList (row, k) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/getKrtenWorkerList'
      }).then(re => {
        let arr = JSON.parse(JSON.stringify(re.data.data))
        arr.forEach((v, k1) => {
          if (v.workerName === row['courseWorker' + k]) {
            this.chooseUserNum = k1
          }
        })
        this.subCopyTableData = re.data.data
        this.subTableData = Object.assign([], this.subCopyTableData)
      })
    },
    showTwoInfo () {
      this.showTwoInfoStr = 1
    },
    delChangeUser () {
      this.chooseUserData = {}
      this.changeTeacherName = {}
      this.chooseUserNum = null
      this.delBtn = false
    },
    changeName (str, index, row, k) {
      if (row['courseWorker' + k]) {
        this.delBtn = true
      } else {
        this.delBtn = false
      }
      this.YS.YS_jquery().then(function ($) {
        $('.hiddenSpan .el-radio__label').html('')
      })
      this.chooseUserStatus = 0
      this.chooseUserData = row
      this.chooseUserIndex = k
      // 获取弹框待选人员列表数据
      this.getPersonList(row, k) // radio选框待优化->参考GradeClassTeaManagement
      setTimeout(function () {
        let inputList = document.getElementsByName('teacherName')
        for (let i = 0; i < inputList.length; i++) {
          inputList[i].checked = false
        }
      }, 100)
      this.dialogChangeTeacher = true
      this.changeTeaObj.index = index
      this.changeTeaObj.str = str
    },
    linChange (index, row) {
      this.chooseUserStatus = 1
      this.changeTeacherName = row
      this.delBtn = true
    },
    saveTeacher () {
      if (!this.changeTeacherName) {
        this.$message({
          message: '请选择人员!',
          type: 'error'
        })
        return false
      }
      let obj = this.changeTeaObj
      this.dialogChangeTeacher = false
      this.tableData[obj.index][obj.str] = this.changeTeacherName.workerName
      let indexStr = obj.str.split('courseWorker')[1]
      let senddata = {
        workerId: this.changeTeacherName.workerId,
        courseCode: this.tableData[obj.index]['courseWorkerCode' + indexStr],
        courseName: this.tableData[obj.index]['courseWorkerName' + indexStr],
        gradeCode: this.tableData[obj.index].gradeCode,
        classCode: this.tableData[obj.index].classCode,
        teacherCourseId: this.tableData[obj.index]['courseWorkerId' + indexStr]
      }
      if (!senddata.workerId) {
        senddata.workerId = null
      }
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/eduAdminMang/setTeacherCourse',
        data: senddata
      }).then(data => {
        that.$message({
          message: '保存成功!',
          type: 'success'
        })
        that.changeTeacherName = ''
        that.getTableData()
      })
    },
    showEditOrBtn (v, str) {
      if (v === 0) {
        this.editOrBtn = 1
        this.showInputOrSpan = 1
        setTimeout(function () {
          let inputList = document.getElementsByClassName('el-input__inner')
          for (let i = 0; i < inputList.length; i++) {
            inputList[i].setAttribute('style', 'text-align:center;')
          }
        }, 10)
      } else if (v === 1) {
        this.editOrBtn = 0
        this.showInputOrSpan = 0
      }
      if (str === 'save') {
        let sendArr = []
        this.copyData.forEach((v, k) => {
          this.tableData.forEach((v1, k1) => {
            if (v.classId === v1.classId) {
              this.cloums.forEach((val, key) => {
                if (v1['courseWorker' + key] !== v['courseWorker' + key]) {
                  let obj = {
                    workerName: v1['courseWorker' + key],
                    courseCode: v1['courseWorkerCode' + key],
                    courseName: v1['courseWorkerName' + key],
                    gradeCode: v1.gradeCode,
                    classCode: v1.classCode,
                    teacherCourseId: v1['courseWorkerId' + key]
                  }
                  sendArr.push(obj)
                }
              })
            }
          })
        })
        let that = this
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/eduAdminMang/batchSetTeacherCourse',
          data: {list: sendArr}
        })
        .then(data => {
          if (data.data.desc) {
            that.$alert(data.data.desc, '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
          that.getTableData()
        })
      } else if (str === 'fail') {
      } else if (str === 'none') {
        this.showTwoInfoStr = 0
      } else if (str === 'goonFail') {
        this.dialogVisible = false
        let arr = JSON.parse(JSON.stringify(this.copyData))
        this.tableData = arr
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        if (row.rowSpanNum) {
          return {
            rowspan: row.rowSpanNum,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    changeCon () {
      this.showTwoInfoStr = 0
      let status = 0
      this.copyData.forEach((v, k) => {
        this.tableData.forEach((v1, k1) => {
          if (v.classId === v1.classId) {
            this.cloums.forEach((val, key) => {
              if (v1['courseWorker' + key] !== v['courseWorker' + key]) {
                status = 1
              }
            })
          }
        })
      })
      if (status === 1) {
        this.dialogVisible = true
      } else {
        this.editOrBtn = 0
        this.showInputOrSpan = 0
      }
    },
    close () { // 选择人员取消时，查询表单刷新
      this.dialogChangeTeacher = false
      this.getTableData()
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
