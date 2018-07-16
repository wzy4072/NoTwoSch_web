import tablebar from '@/common/components/tableBar'
import returnBtn from '@/common/components/returnBtn'
export default {
  components: { tablebar, returnBtn },
  data () {
    return {
      inquireObj: {
        workerTypes: '',
        time: null
      },
      workerTypesList: [],
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableData: [
        { name: '期初员工人数', value: '' },
        { name: '期末原员工人数', value: '' },
        { name: '本期增加员工人数', value: '' },
        { name: '本期员工流失人数', value: '' },
        { name: '本期员工流失率', value: '' },
        { name: '本期流动总量流动率', value: '' },
        { name: '本期流动差量流动率', value: '' },
        { name: '本期流出量流动率', value: '' },
        { name: '本期流进量流动率', value: '' }
      ],
      copytableData: []
    }
  },
  mounted () {
    this.$ajax({
      method: 'POST',
      url: 'baseInfo/dictConf/selectDictConfLsit',
      data: {
        dictType: 'POSITION'
      }
    }).then(res => {
      this.fullscreenLoading = false
      this.workerTypesList = res.data.data
    })
  },
  methods: {
    getDataFn () {
      if (this.inquireObj.workerTypes.length === 0 || this.inquireObj.time === null) {
        this.$message.warning('岗位或者时间不能为空！')
        return false
      }
      // 查询数据
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/infoManage/selectWorkerLossRate',
        data: {
          workerTypes: this.inquireObj.workerTypes.join(','),
          beginDate: this.$api.getDateAll(this.$api.time(this.inquireObj.time[0]), '-', ''),
          endDate: this.$api.getDateAll(this.$api.time(this.inquireObj.time[1]), '-', '')
        }
      })
        .then(res => {
          this.fullscreenLoading = false
          this.tableData[0].value = res.data.data.cq ? res.data.data.cq + '人' : '0人'
          this.tableData[1].value = res.data.data.mq ? res.data.data.mq + '人' : '0人'
          this.tableData[2].value = res.data.data.zj ? res.data.data.zj + '人' : '0人'
          this.tableData[3].value = res.data.data.ls ? res.data.data.ls + '人' : '0人'
          this.tableData[4].value = res.data.data.lsRate ? (res.data.data.lsRate * 100).toFixed(2) + '%' : '0%'
          this.tableData[5].value = res.data.data.ldzlRate ? (res.data.data.ldzlRate * 100).toFixed(2) + '%' : '0%'
          this.tableData[6].value = res.data.data.ldclRate ? (res.data.data.ldclRate * 100).toFixed(2) + '%' : '0%'
          this.tableData[7].value = res.data.data.lclldRate ? (res.data.data.lclldRate * 100).toFixed(2) + '%' : '0%'
          this.tableData[8].value = res.data.data.ljlldRate ? (res.data.data.ljlldRate * 100).toFixed(2) + '%' : '0%'
          this.copytableData = Object.assign([], this.tableData)
        })
    }
  }
}
