import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      searchstr: '',
      tableData: [],
      copyData: [],
      InspectorsList: [],
      tableIndex: null,
      searchFiledArr: [ // 无筛选列模糊搜索字段数组
        {field: 'krtenName', value: null}
      ],
      dialogVisible: false
    }
  },
  mounted () {
    this.getTableDataFun()
    this.$ajax({// TODO: 获取督导员列表
      method: 'post',
      url: 'baseInfo/eduInfoManager/selectEduList',
      data: {}
    }).then(re => {
      this.InspectorsList = re.data.list
      this.InspectorsList.forEach(v => { // 添加判断勾选字段
        v.superintendentId = v.superintendentId + ''
        this.$set(v, 'check', 0)
      })
    }).catch(err => {
      this.$message.error('接口异常：' + err)
    })
  },
  methods: {
    getTableDataFun () { // TODO: 获取表格数据
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/infoManage/selectAreaKrtenList',
        data: {}
      }).then(re => {
        this.fullscreenLoading = false
        re.data.data.forEach(v => { // 修改数据格式
          v.InspectorsList = []
          let nameList = v.pesrsons ? v.pesrsons.split(',') : []
          let idList = v.superIds ? v.superIds.split(',') : []
          v.InspectorsNum = nameList.length
          if (nameList.length === idList.length) {
            nameList.forEach((v1, k1) => {
              if (v1) {
                let obj = {name: v1, id: idList[k1]}
                v.InspectorsList.push(obj)
              }
            })
          }
        })
        this.copyData = Object.assign([], re.data.data)
        this.tableData = re.data.data
      }).catch(err => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    delFun (row, index) { // TODO: 删除督学
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/infoManage/deleteSuperintendentInfo',
        data: {
          superintendentId: row.InspectorsList[index].id,
          krtenCode: row.krtenCode
        }
      }).then(re => {
        this.fullscreenLoading = false
        row.InspectorsList.splice(index, 1)// 本地处理数据
        this.$message.success('删除成功!')
      }).catch(err => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    },
    openWinFun (value, index) { // TODO: 打开督学列表弹窗
      this.dialogVisible = true
      this.tableIndex = index
      this.InspectorsList.forEach(v1 => {
        v1.check = 0
      })
      if (value.length > 0) {
        value.forEach(v => {
          this.InspectorsList.forEach(v1 => {
            if (v.id === v1.superintendentId) {
              v1.check = 1
            }
          })
        })
      }
    },
    selectInspectorsFun (value) { // TODO: 选择督学（多选）
      value.check = value.check === 1 ? 0 : 1
    },
    comfireFun () { // TODO:选择督学确认
      this.fullscreenLoading = true
      let dataObj = {
        superintendentIds: [],
        krtenCode: this.tableData[this.tableIndex].krtenCode
      }
      this.InspectorsList.forEach(v => {
        if (v.check) {
          dataObj.superintendentIds.push(v.superintendentId)
        }
      })
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/infoManage/saveSuperintendentInfo',
        data: dataObj
      }).then(re => {
        this.fullscreenLoading = false
        this.tableData[this.tableIndex].InspectorsList = []
        this.InspectorsList.forEach(v => { // 本地处理数据
          if (v.check) {
            let obj = {name: v.superintendentName, id: v.superintendentId}
            this.tableData[this.tableIndex].InspectorsList.push(obj)
          }
        })
        this.dialogVisible = false
      }).catch(err => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
    }
  },
  watch: {
    searchstr (newVal, oldVal) { // 无筛选列模糊搜索
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.filter(o => {
          return this.searchFiledArr.filter((item) => {
            return !item.noSearch
          }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
      } else {
        this.tableData = this.copyData
      }
    }
  }
}
