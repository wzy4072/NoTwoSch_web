import tableBar from '@/common/components/tableBar'
const itemType = [{ name: 'codeOne', text: 'codeOneSchedule', id: 'OneitemId' },
    { name: 'codeTwo', text: 'codeTwoSchedule', id: 'TwoitemId' },
    { name: 'codeThree', text: 'codeThreeSchedule', id: 'ThreeitemId' }
]
export default {
  components: { tableBar },
  data () {
    return {
      tableData: [],
      kindergartenArr: [],
      currKindergarten: ''
    }
  },
  mounted () {
    this.$ajax({
      method: 'post',
      url: 'procedural/Processsspm/selectProcesssspList'
    }).then((res) => {
      this.kindergartenArr = res.data.data
      if (res.data.data.length > 0) {
        this.currKindergarten = res.data.data[0].projectId
        this.getPageData()
      }
    })
  },
  methods: {
    getPageData () {
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/findProcessSupervisionList',
        data: {
          projectId: this.currKindergarten
        }
      }).then((res) => {
        this.tableData = res.data.list.map(o => {
          Array.isArray(o.items) && o.items.forEach((d, k) => {
            // d.itemName === '' ? o[itemType[k].name] = '待提出' : o[itemType[k].name] = d.itemName
            o[itemType[k].name] = d.itemName
            o[itemType[k].text] = d.schedule
            o[itemType[k].id] = d.itemId
          })
          return o
        })
      })
    },
    jumpPage (name, val) {
      if (val === 1) {
        sessionStorage.setItem('itemId', name)
        this.$router.push({ path: '/ProjectManagement/CategoryDetails' })
      } else if (val === 2) {
        sessionStorage.setItem('data', JSON.stringify(name))
        this.$router.push({ path: '/ProjectManagement/SpecialSupervisionMsg' })
      }
    },
    getTagType (val) {
      let num = parseFloat(val)
      switch (true) {
        case num === 0:
          return 'info'
        case num === 100:
          return 'success'
        case num < 100 > 0:
          return ''
      }
    }
  }
}
