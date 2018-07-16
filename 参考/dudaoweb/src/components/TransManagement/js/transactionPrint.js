import tableBar from '@/common/components/tableBar'
export default {
  components: {tableBar},
  data () {
    return {
      status: '',
      printData: []
    }
  },
  mounted () {
    let senddata = JSON.parse(sessionStorage.getItem('transPrintData'))
    this.getData(senddata)
    this.status = this.$route.query.transStatru
    setTimeout(function () {
      let ele = document.getElementsByClassName('WordSection1')[0]
      let style = document.createElement('style')
      // let cs = document.createElement('mytable')
      style.type = 'text/css'
      style.href = 'newcss.css'
      style.rel = 'stylesheet'
      let str = '.bgColor{background:#F2F2F2;width:25%;}.autoSpan{word-break:normal;width:auto;display:block;white-space:pre-wrap;word-wrap:break-word;overflow:hidden;} .mytable{border-collapse:collapse;width:100%;}.mytable th,.mytable td{border: 1px solid #5E5E5E;height: 25px;text-align: center; padding: 10px 0;}.mytable td.bottomContent{padding: 60px 0;}.text_one{margin-top: 25px;}.text_two{margin-top: 25px;}'
      style.innerHTML = str
      let bothInsert = document.getElementById('bothInsert')
      ele.insertBefore(style, bothInsert)
    }, 2000)
  },
  methods: {
    getData (senddata) {
      let that = this
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/stuTransaction/selectStuTransactionList',
        data: senddata
      })
      .then(data => {
        that.printData = data.data.data
        that.printData.forEach((v, k) => {
          v.transactionDate = that.$api.getDateAll(that.$api.time(v.transactionDate), '-')
          v.returnDate = that.$api.getDateAll(that.$api.time(v.returnDate), '-')
        })
        console.log(this.printData)
      })
      .then(err => {
        console.log(err)
      })
    },
    htmlExport () {
      let that = this
      that.YS.YS_jquery().then(function ($) {
        window.jQuery = $
        setTimeout(function () {
          that.YS.YS_wordExport(function () {
            setTimeout(function () {
              var option = {
                maxWidth: 1020,
                css: '@page WordSection1{size:841.95pt 42.0cm;margin:36.0pt 36.0pt 36.0pt 36.0pt;background:red;}div.WordSection1{page:WordSection1;font-size:30px;}'
              }
              $('.WordSection1').wordExport('学生转班确认单', option)
            }, 1500)
          })
        }, 300)
      })
    },
    htmlPrint () {
      let newstr = document.getElementById('printHtml').innerHTML // 得到需要打印的元素HTML
      let oldstr = document.body.innerHTML // 保存当前页面的HTML
      document.body.innerHTML = newstr
      window.print()
      document.body.innerHTML = oldstr
    }
  }
}
