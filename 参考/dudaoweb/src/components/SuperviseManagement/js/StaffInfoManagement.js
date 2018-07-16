import tableBar from '@/common/components/tableBar'
export default {
  components: { tableBar },
  data () {
    return {
      tablename: '基本信息',
      barNameArr: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      activeName: '0',
      tableData: [],
      searchstr: '', // 当前输入
      scrColumn: [ // 表头
                { text: '姓名', selected: true, align: 'center' },
                { text: '性别', selected: true },
                { text: '岗位标签', selected: true },
                { text: '任教科目', selected: true },
                { text: '手机号码', selected: true },
                { text: '政治面貌', selected: true },
                { text: '最高学历', selected: true },
                { text: '民族', selected: true },
                { text: '出生日期', selected: true },
                { text: '籍贯', selected: true },
                { text: '证件类型', selected: true },
                { text: '证件号码', selected: true },
                { text: '入职日期', selected: false },
                { text: '离职日期', selected: false },
                { text: '在职时长', selected: false },
                { text: '人员状态', selected: false },
                { text: '户籍地址', selected: false },
                { text: '人员状态', selected: false }
      ],
      printOb: { // 打印所需
        pageNum: 1,
        title: '项目列表'
      },
      multipleSelection: [], // 选中数据的数组
      isDeleshow: false
    }
  },
  mounted () { // 进页面默认执行方法
    this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
    this.$nextTick(function () {
      this.refresh()
    })
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      this.$api.promise({
        method: 'POST',
        url: 'staffManage/selectWorkerList',
        data: {}
      }).then((res) => {
        this.fullscreenLoading = false
        if (res.data.code > 0) {
          this.copydata = Object.assign([], res.data.list)
          this.tableData = this.copydata.slice(0, this.size * 1)
          this.total = res.data.list.length
          this.tableData.forEach((o) => {
                        // 证件类型
            switch (o.certificatesType) {
              case 1: // 身份证
                o.certificatesTypeName = '身份证'
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
            if (!o.departureTime) {
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
                            // 判断是否在职
          })
        } else {
          this.$message.error(res.data.desc)
        }
      }).catch((err) => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copydata.slice(
                (this.currentPage - 1) * this.size,
                this.currentPage * this.size
            )
    },
    searchFun () {
      if (this.searchstr !== '') {
        this.fullscreenLoading = true
        this.tableData = this.copydata.filter(o => {
          return Object.keys(o).some(d => {
            return (typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
                            .searchstr) > -1
          })
        })
      } else {
        this.tableData = this.copydata
      }
      this.fullscreenLoading = false
      this.total = this.tableData.length
    },
    handleClick (tab, event) {
      this.tablename = tab.label
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
        path: '/SuperviseSystem/StaffInfoImport'
      })
    },
    supplement (val) {
            // isEdit=0是补录，isEdit=1是查看页面
      if (val) {
        val.isEdit = 1
        val.isUpdate = 1
        sessionStorage.setItem('EditData', JSON.stringify(val))
      } else {
        let obj = {}
        for (const key in this.tableData[0]) {
          obj[key] = null
        }
        obj.isEdit = 0
        obj.isUpdate = 0
        obj.workerGender = 1
        sessionStorage.setItem('EditData', JSON.stringify(obj))
      }
            // 跳转到补录页面
      this.$router.push({ // 页面跳转
        path: '/SuperviseSystem/StaffInfoSupplement'
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
    deleteItem () {
            // console.log(this.multipleSelection)
            // console.log(this.tableData)
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.multipleSelection.length; j++) {
          if (this.tableData[i].index === this.multipleSelection[j].index) {
                        // console.log('dd')
            this.tableData.splice(i, 1)
          }
        }
      }
    }
  }
}
