
export default {
  data () {
    return {
      data: [],
      all: [],
      kindergartenArr: [],
      curkindergartenArr: null,
      InputNumber1: 1,
      InputNumber2: 1,
      dialogVisible: false,
      activeName: '0',
      tableData: {},
      AllTable: [],
      total: '' // 综合统计total
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$ajax({
        method: 'get',
        url: 'procedural/Processsspm/selectProcesssspList'
      }).then(re => {
        this.kindergartenArr = re.data.data
        if (this.kindergartenArr) {
          this.curkindergartenArr = this.kindergartenArr[0].projectId
        }
      })
    },
    gettableData () {
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/selectItemStatistics',
        data: {'projectId': this.curkindergartenArr}
      }).then(re => {
        // 过滤数量为0的数据 + 计算总数
        this.total = 0
        for (const key in re.data.data[0]) {
          if (re.data.data[0].hasOwnProperty(key)) {
            let temp = re.data.data[0][key]
            this.total += Number(temp)
            if (temp) {
              this.tableData[key] = temp
            }
          }
        }
        this.AllTable = this.dealData(re.data.list)
        function fun (arr, result) {
          if (arr && arr.length) {
            let temp = []
            arr.forEach((item) => {
              item.child && item.child.length && (temp = temp.concat(item.child))
            })
            temp.length && result.push(temp)
            fun(temp, result)
          }
        }
        this.all = []
        this.AllTable.forEach((item, key) => {
          let result = []
          result.push(item.child)
          fun(item.child, result)
          this.all.push({
            name: item.dictName,
            child: result
          })
        })
      })
    },
    // 根据字段算合计
    getTotal (array, field) {
      let sum = 0
      array.forEach((item) => {
        sum += Number(item[field])
      })
      return sum
    },
    dealData (ary, data) {
      var data = data || (function (ary) {
        var tempAry = []
        var idList = []
        ary.forEach(function (item) {
          idList.push(item.confId)
        })
        function deb (confId, idList) {
          var flag = true
          for (var ida in idList) {
            if (confId === idList[ida]) {
              flag = false
            }
          }
          return flag
        }

        for (var i = 0, len = ary.length; i < len; i++) {
          if (ary[i].parentId === undefined || (ary[i].parentId !== undefined && deb(ary[i].parentId, idList))) {
            var obj = {
              dictName: ary[i].dictName,
              confId: ary[i].confId,
              count: ary[i].count
            }
            tempAry.push(obj)
          }
        }
        return tempAry
      }(ary))

      var temp = 0
      if (data.constructor === Array) {
        for (var i = 0, len = data.length; i < len; i++) {
          for (var j = 0, lenA = ary.length; j < lenA; j++) {
            if (ary[j].parentId !== -1) {
              if (ary[j].parentId === data[i].confId) {
                var obj = {
                  dictName: ary[j].dictName,
                  confId: ary[j].confId,
                  count: ary[j].count
                }
                data[i].child = data[i].child || []
                data[i].child.push(obj)
                temp++
              }
            }
          }
        }
      }

      if (temp > 0) {
        if (data.constructor === Array) {
          for (var n = 0, lenB = data.length; n < lenB; n++) {
            data[n].child = this.dealData(ary, data[n].child ? data[n].child : [])
            if (data[n].child.length === 0) {
              delete data[n].child
            }
            delete data[n].confId
          }
        }
      } else {
        for (var n = 0, lenB = data.length; n < lenB; n++) {
          delete data[n].confId
        }
      }
      return data
    }
  },
  watch: {
    curkindergartenArr (newVal, oldVal) {
      this.gettableData()
    },
    activeName (newVal) {
      if (newVal != 0) {
        this.data = this.all[Number(newVal) - 1].child
      }
    }
  }
}
