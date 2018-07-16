import returnBtn from '@/common/components/returnBtn'
export default {
  components: {returnBtn},
  data () {
    return {
      options: [{
        value: '1',
        label: '按年级筛选'
      }, {
        value: '2',
        label: '级联菜单'
      }],
      value: '1'
    }
  },
  mounted () {
  },
  methods: {
    addRecord () {

    },
    exportExcel () { // 导出excel

    }
  }
}
