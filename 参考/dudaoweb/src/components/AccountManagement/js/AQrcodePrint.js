import returnBtn from '@/common/components/returnBtn'
export default {
  components: {returnBtn},
  data () {
    return {
      url: 'http://' + window.location.hostname,
      dom: [],
      dateHtml: [],
      list: ''
    }
  },
  mounted () { // 进页面默认执行方法
    this.list = JSON.parse(sessionStorage.getItem('Useid'))
    var activeName = sessionStorage.getItem('activeName')
    this.dateHtml = []
    var datalist = []
    var obj = {}
    var info = {}
    this.list.forEach((v, k) => {
      obj = {}
      info = {}
      if (activeName === '1') { // 教职工
        info.name = v.WORKER_NAME + '(' + v.DICT_VALUE + ')'
      }
      if (activeName === '2') { // 家长
        if (v.PARENT_RELATIONSHIP) { // 判断是否有家长
          info.name = v.STUDENT_NAME + v.PARENT_RELATIONSHIP + '(' + v.GRADE_NAME + v.CLASS_NAME + '班)'
        } else {
          info.name = v.STUDENT_NAME + '(' + v.GRADE_NAME + v.CLASS_NAME + '班)'
        }
      }
      if (activeName === '3') { // 教育局
        info.name = v.SUPERINTENDENT_NAME + '(' + v.DICT_VALUE + ')'
      }
      obj.userId = v.USER_ID
      info.USER_ID = v.USER_ID
      info.USER_LOGIN_NAME = v.USER_LOGIN_NAME
      info.USER_INIT_PWD = v.USER_INIT_PWD
      datalist.push(obj)
      this.dateHtml.push(info)
    })

    this.$ajax({
      method: 'POST',
      url: 'baseInfo/personalCenter/printCode',
      data: datalist
    })
        .then(res => { // 成功
        })
        .catch(err => {
          this.$message.error('接口异常：' + err)
        })
    this.$nextTick(() => {
      this.qrcodeList = new Array(this.dateHtml.length)
      this.YS.YS_qrcode().then(() => {
        this.dateHtml.forEach((value, index) => {
          this.qrcodeList[index] = new window.QRCode('qrcode' + index, {
            text: value.USER_ID,
            width: 110,
            height: 110
          })
        })
      })
    })
    console.log(this.dateHtml)
  },
  methods: {// 方法
    printQrcodeFun () {
      var children = Array.prototype.slice.call(document.querySelectorAll('.ins-page-main'))
      this.dom = Array.prototype.slice.call(children[0].children)
      // console.log(this.dom)
      this.$message('打印预览可能在浏览器后面！')
      this.YS.YS_lodop(() => {
        var LODOP
        try {
          LODOP = window.getLodop()
          LODOP.PRINT_INIT('打印控件 英之泰打印')
          var thisCss = '.boy{border: 1px solid #c0c4cc;width:40%;height:470px;overflow: hidden;float:left;margin-left: 5px;}.text{width:95%;color: #606266;line-height:25px;}.text ul li{ list-style:none;border-bottom: 1px dashed #c0c4cc;font-size:12px;}.pic{margin-top: -8px;line-height: 20px;color: #606266;}.pic ul li{font-size:12px;list-style:none;}.title{margin-top: -13px;}.qrcode{padding-left: 8px;}'
          for (let index = 0; index < this.dom.length; index += 4) {
            var One = ''
            var Two = ''
            var Three = ''
            var Four = ''
            var count1 = ''
            var count2 = ''
            var count3 = ''
            One = this.dom[index].outerHTML
            count1 = index + 1
            if (count1 < this.dom.length) {
              Two = this.dom[count1].outerHTML
            } else {
              Two = ''
            }
            count2 = index + 2
            if (count2 < this.dom.length) {
              Three = this.dom[count2].outerHTML
            } else {
              Three = ''
            }
            count3 = index + 3
            if (count3 < this.dom.length) {
              Four = this.dom[count3].outerHTML
            } else {
              Four = ''
            }
            var strBodyStyle = '<style>' + thisCss + '</style>'
            var strFormHtml = strBodyStyle + '<body>' + One + Two + Three + Four + '</body>'
            LODOP.ADD_PRINT_HTML('10mm', '12mm', '90%', '85%', strFormHtml)
            LODOP.NewPage()
          }
          LODOP.PREVIEW()
        } catch (error) {
          this.$message.error('请先安装打印控件！')
        }
      })
    }
  }
}
