import tableBar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
const isRepeat = arr => {
  let result = [false]
  let hash = {}
  for (let i in arr) {
    if (hash[arr[i]]) {
      result[0] = true
      result[1] = arr[i]
      return result
    }
    hash[arr[i]] = true
  }
  return result
}
export default {
  components: { tableBar, returnBtn },
  data () {
    return {
      searchstr: '', // 表格模糊搜索
      deleteDialog: false, // 删除弹框
      opaDialog: false, // 新增+编辑弹框
      opaType: '', // 1是新增，2是编辑
      printOb: {// 打印所需
        pageNum: 1,
        title: '教育局通知类型列表'
      },
      total: 0,
      size: 50,
      currentPage: 1,
      tableData: [],
      copyData: [],
      ruleForm: {
        informName: '', // 编辑+新增通知dictValue
        informId: '' // 编辑+新增通知confId
      },
      newInputList: null, // 新增 通知名称 数组
      rules: { // 表单验证规则
        informName: [
          { required: true, message: '请输入通知名称', trigger: 'manual' },
          {
            validator: (rule, value, callback) => { // 自定义校验规则
              debugger
              // 判断是否输入重复通知
              let temp = isRepeat(this.newInputList)
              if (temp[0]) {
                callback(new Error('请勿输入重复通知名称（' + temp[1] + '）'))
                return false
              }
              // 判断是否重复添加通知
              let state = false // 是否有重复通知 0：false  1：true
              for (let index = 0; index < this.newInputList.length; index++) {
                let item = this.newInputList[index]
                state = this.copyData.some((element) => {
                  return item.trim() == element.dictName
                })
                if (state) { // 存在重复
                  callback(new Error('存在重复通知名称（' + item.trim() + '）'))
                  return false
                }
              }
              callback()
            },
            trigger: 'manual'
          }
        ]
      },
      deleteData: [], // 待删除数据
      searchFiledArr: [
        {field: 'dictValue', value: null}
      ],
      fullscreenLoading: false // 全屏加载框
    }
  },
  mounted () { // 进页面默认执行方法
    this.getTabData() // 获取表格数据
  },
  methods: {
    getTabData () {
      this.fullscreenLoading = true
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/dictConf/selectDictConfListByType',
        data: {
          'dictType': 'NOTICE_CATEGORY_TZ'
        }
      }).then((re) => {
        this.fullscreenLoading = false
        this.copyData = Object.assign([], re.data.list) // 备份数据
        this.tableData = this.copyData.slice(0, this.size * 1)
        this.total = this.copyData.length
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
    openLayer (type, row) { // 打开弹框 1:增加 2:编辑 3:删除
      this.opaType = type
      if (type == 1) {
        this.opaDialog = true
        this.ruleForm.informName = ''
      } else if (type == 2) {
        this.opaDialog = true
        this.ruleForm.informName = row.dictValue
        this.ruleForm.informId = row.confId
      } else {
        this.deleteDialog = true
        this.opaType = 3
      }
    },
    tabOpa (editData) { // 确认操作 1:增加 2:编辑 3:删除
      if (this.opaType == 3) {
        this.fullscreenLoading = true
        this.$ajax({
          method: 'POST',
          url: 'baseInfo/dictConf/deleteBatch',
          data: this.deleteData
        }).then(res => {
          this.fullscreenLoading = false
          this.deleteDialog = false
          this.$message.success('删除成功')
          this.getTabData()
        })
      } else {
        let that = this
        this.newInputList = this.ruleForm.informName.split('\n')
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let sendData = []
            that.newInputList.forEach((val) => {
              let obj = {
                'confId': that.opaType == 1 ? '' : that.ruleForm.informId,
                'dictName': val,
                'dictValue': val,
                'dictDesc': '通知类型',
                'dictType': 'NOTICE_CATEGORY_TZ'
              }
              sendData.push(obj)
            })
            // 请求接口
            that.fullscreenLoading = true
            that.$ajax({
              method: 'POST',
              url: 'baseInfo/dictConf/saveDictConfList',
              data: sendData
            }).then(res => {
              that.fullscreenLoading = false
              that.opaDialog = false
              that.$message.success('操作成功')
              that.getTabData()
            })
          }
        })
      }
    },
    tabCheck (selection) {
      this.deleteData.splice(0, this.deleteData.length)
      selection.forEach((element, index) => {
        this.deleteData.push(element.confId)
      })
    }
  },
  watch: {
    searchstr (newVal, oldVal) { // 无筛选列模糊搜索
      if (newVal.trim() !== '') {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      ).filter(o => {
        return this.searchFiledArr.some(d => {
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
