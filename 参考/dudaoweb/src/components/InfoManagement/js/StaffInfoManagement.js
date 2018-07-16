import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      tablename: '基本信息',
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      activeName: '0',
      tableData: [],
      copyData: [],
      searchstr: '', // 当前输入
      dialogVisible: false, // 弹出框不显示
      scrColumn: [ // 表头（特殊筛选列增加field字段->不同于标准页）
        { text: '姓名', selected: true, field: 'workerName' },
        { text: '性别', selected: true, field: 'workerGenderName' },
        { text: '岗位', selected: true, field: 'workerTypeName' },
        { text: '手机号码', selected: true, field: 'workerPhone' },
        { text: '政治面貌', selected: true, field: 'politicalOutlookName' },
        { text: '教学资历', selected: true, field: 'teaching' },
        { text: '最高学历', selected: true, field: 'highestEducationName' },
        { text: '民族', selected: true, field: 'userNationName' },
        { text: '出生日期', selected: true, field: 'changeUserBirthday' },
        { text: '籍贯', selected: true, field: 'nativeProvinces' },
        { text: '证件类型', selected: true, field: 'certificatesTypeName' },
        { text: '证件号码', selected: true, field: 'certificatesNum' },
        { text: '入职日期', selected: false, field: 'changeEntryTime' },
        { text: '离职日期', selected: false, field: 'changeDepartureTime' },
        { text: '在职时长', selected: false, field: 'allIntime' },
        { text: '人员状态', selected: false, field: 'isdeparture' },
        { text: '户籍地址', selected: false, field: 'householdsAddrs' },
        { text: '现居住地址', selected: true, field: 'addressAddrs' }
      ],
      printOb: { // 打印所需
        pageNum: 1,
        title: '教职工基本信息列表'
      },
      multipleSelection: [], // 选中数据的数组
      isDeleshow: false
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/staffManage/selectWorkerList',
        data: {}
      }).then((res) => {
        this.fullscreenLoading = false
        if (res.data.code > 0) {
          res.data.list.forEach(o => {
            o.teaching = ''
            if (o.arg1 !== null) {
              let arg = new Date(o.arg1)
              let now = new Date()
              let chaYear = now.getFullYear() - arg.getFullYear()
              let chaMonth = now.getMonth() - arg.getMonth()
              if (chaMonth < 0) {
                chaYear -= 1
                chaMonth = 12 + chaMonth
              }
              if (chaYear > 0) {
                o.teaching = chaYear + '年'
              }
              if (chaMonth > 0) {
                o.teaching += chaMonth + '月'
              }
            }
          })
          this.copyData = Object.assign([], res.data.list)
          this.tableData = this.copyData.slice(0, this.size * 1)
          this.total = res.data.list.length
          this.tableData.forEach((o) => {
                        // 证件类型
            switch (o.certificatesType) {
              case 1: // 身份证
                o.certificatesTypeName = '居民身份证'
                break
              case 2: // 香港特区护照
                o.certificatesTypeName = '香港特区护照'
                break
              case 3: // 澳门特区护照
                o.certificatesTypeName = '澳门特区护照'
                break
              case 4: // 台湾居民来往大陆通行证
                o.certificatesTypeName = '台湾居民来往大陆通行证'
                break
              case 5: // 护照
                o.certificatesTypeName = '护照'
                break
              case 6: // 其他
                o.certificatesTypeName = '其他'
                break
            }
                        // 任教科目
            o.workerCourseString = ''
            o.workerCourses.forEach(function (v) {
              o.workerCourseString += v.courseName + ','
            })
                        // 出生日期，入职日期，离职日期 在职时长
                        // 判断是否在职
            if (!o.entryTime) {
              o.allIntime = ''
              o.isdeparture = '在职'
            } else if (!o.departureTime) {
              let newDepartureTime = Date.parse(new Date())
              o.allIntime = Math.floor((newDepartureTime - o.entryTime) / 86400000) + '天'
              o.isdeparture = '在职'
            } else {
              o.allIntime = Math.floor((o.departureTime - o.entryTime) / 86400000) + '天'
              o.isdeparture = '离职'
            }
            o.changeUserBirthday = this.$api.getDateAll(o.userBirthday, '-')
            o.changeEntryTime = this.$api.getDateAll(o.entryTime, '-')
            o.changeDepartureTime = this.$api.getDateAll(o.departureTime, '-')

            if (!o.householdsProvince) { o.householdsProvince = '' }
            if (!o.householdsCity) { o.householdsCity = '' }
            if (!o.householdsArea) { o.householdsArea = '' }
            if (!o.householdsAddr) { o.householdsAddr = '' }

            if (!o.addressProvince) { o.addressProvince = '' }
            if (!o.addressCity) { o.addressCity = '' }
            if (!o.addressArea) { o.addressArea = '' }
            if (!o.addressAddr) { o.addressAddr = '' }

            if (!o.nativeProvince) { o.nativeProvince = '' }
            if (!o.nativeCity) { o.nativeCity = '' }
            if (!o.nativeArea) { o.nativeArea = '' }

            o.householdsAddrs = o.householdsProvince + o.householdsCity + o.householdsArea + o.householdsAddr
            o.addressAddrs = o.addressProvince + o.addressCity + o.addressArea + o.addressAddr
            o.nativeProvinces = o.nativeProvince + o.nativeCity + o.nativeArea
          })
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copyData.slice(
                (this.currentPage - 1) * this.size,
                this.currentPage * this.size
            )
    },
    handleClick (tab, event) {
      this.tablename = tab.label
      this.printOb.title = '教职工' + tab.label + '列表'
      switch (tab.index) {
        case '0':
                    // 基本信息
          this.scrColumn.forEach(function (o, k) {
            if (k < 12) {
              o.selected = true
            }
            if (k >= 12) {
              o.selected = false
            }
          })
          break
        case '1':
                    // 任职信息
          this.scrColumn.forEach(function (o, k) {
            if (k >= 4 && k < 12) {
              o.selected = false
            }
            if (k >= 12 && k < 16) {
              o.selected = true
            }
            if (k >= 16) {
              o.selected = false
            }
          })
          this.scrColumn[3]['selected'] = false
          break
        case '2':
                    // 户籍信息
          this.scrColumn.forEach(function (o, k) {
            if (k >= 4 && k < 16) {
              o.selected = false
            }
            if (k >= 16) {
              o.selected = true
            }
          })
          break
        case '3':
                    // 全部信息
          this.scrColumn.forEach(function (o, k) {
            o.selected = true
          })
          break
      }
    },
    dateFormat (row, column, cellValue) {
      return this.$api.getDateAll(row.entryTime, '-')
    },
    infoImport () {
            // 跳转到导入页面
      this.$router.push({ // 页面跳转
        path: '/InfoManagement/StaffInfoImport'
      })
    },
    supplement (val) {
            // isEdit=0是补录，isEdit=1是查看页面
            // isShow=0是补录，isShow=1是查看页面
      if (val) {
        val.isEdit = 1
        val.isShow = 1
        sessionStorage.setItem('EditData', JSON.stringify(val))
      } else {
        let obj = {}
        for (const key in this.tableData[0]) {
          obj[key] = null
        }
        obj.isEdit = 0
        obj.isShow = 0
        obj.workerGender = 1
        sessionStorage.setItem('EditData', JSON.stringify(obj))
      }
            // 跳转到补录页面
      this.$router.push({ // 页面跳转
        path: '/InfoManagement/StaffInfoSupplement'
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      if (this.multipleSelection.length !== 0) {
        this.isDeleshow = true
      } else {
        this.isDeleshow = false
      }
    },
    checkSelectable (row) {
            // return row.date !== '2016-05-01'
      return row
    },
    deleteShowdialog () {
      this.dialogVisible = true
    },
    deleteItem () {
      console.log(this.multipleSelection)
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/staffManage/deleteStaff',
        data: this.multipleSelection
      }).then((res) => {
        if (res.data.code > 0) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageData()
        } else {
          this.$message.error(res.data.desc)
        }
      })
    }
  },
  watch: {
    searchstr (newVal, oldVal) {
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.scrColumn.filter((item) => { return item.selected }).some(d => {
          return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
        })
      })
      } else {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      )
      }
    }
  }
}
