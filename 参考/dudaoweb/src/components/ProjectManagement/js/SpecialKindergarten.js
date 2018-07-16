import tableBar from '@/common/components/tableBar'
const itemType = [{ name: 'codeOne', text: 'codeOneSchedule', id: 'OneitemId' },
    { name: 'codeTwo', text: 'codeTwoSchedule', id: 'TwoitemId' },
    { name: 'codeThree', text: 'codeThreeSchedule', id: 'ThreeitemId' }
]
export default {
  components: { tableBar },
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData () {
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/findProcessSupervisionList',
        data: {
          krtenCode: sessionStorage.getItem('krtenCodes')
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
      if (val === 4) {
        sessionStorage.setItem('data', JSON.stringify(name))
        this.$router.push({ path: '/ProjectManagement/SpecialSupervisionMsg' })
      } else {
        sessionStorage.setItem('itemId', name)
        this.$router.push({ path: '/ProjectManagement/CategoryDetails', query: {treeType: val} })
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
