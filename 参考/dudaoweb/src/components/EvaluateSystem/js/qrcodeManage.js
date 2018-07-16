export default {
  data () {
    return {
      token: '', // token 信息
      qrCodeData: [],
      total: '',
      used: '',
      dialogVisible: false,
      addNumber: 1
    }
  },
  mounted () {
    this.$ajax({
      method: 'POST',
      url: 'feedback/question/selectQRcodeList',
      data: {
        'questionnaireId': JSON.parse(sessionStorage.getItem('codeId'))
      }
    }).then(re => {
      this.qrCodeData = re.data.list
      this.total = re.data.list.length
      this.used = re.data.list.filter(re => { return re.isUser === 1 }).length
      this.creatQrcodeFun()
    }).catch(err => {
      this.$message.error('接口异常' + err)
    })
    this.token = {'authorization': sessionStorage.getItem('user_token')}
  },
  methods: {
    creatQrcodeFun () {
      this.$nextTick(() => {
        this.qrcodeList = new Array(this.qrCodeData.length)
        this.YS.YS_qrcode().then(() => {
          this.qrCodeData.forEach((value, index) => {
            this.qrcodeList[index] = new window.QRCode('qrcode' + index, {
              text: value.url,
              width: 128,
              height: 128
            })
          })
        })
      })
    },
    printQrcodeFun () { // 打印二维码
      let printData = []
      for (let k = 0; k < this.qrCodeData.length; k += 4) {
        printData.push(this.qrCodeData.slice(k, k + 4))
      }
      this.$message('打印预览可能在浏览器后面！')
      this.YS.YS_lodop(() => {
        var LODOP
        try {
          LODOP = window.getLodop()
          LODOP.PRINT_INIT('打印控件 英之泰打印')
          printData.forEach(res => {
            res.forEach((re, k) => {
              if (k === 0) {
                LODOP.ADD_PRINT_BARCODE(10, 50, 220, 220, 'QRCode', re.url)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(220, 55, '100%', 20, re.name)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(240, 55, '100%', 20, '问卷链接:' + re.url)
              }
              if (k === 1) {
                LODOP.ADD_PRINT_BARCODE(260, 50, 220, 220, 'QRCode', re.url)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(470, 55, '100%', 20, re.name)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(490, 55, '100%', 20, '问卷链接:' + re.url)
              }
              if (k === 2) {
                LODOP.ADD_PRINT_BARCODE(510, 50, 220, 220, 'QRCode', re.url)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(720, 55, '100%', 20, re.name)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(740, 55, '100%', 20, '问卷链接:' + re.url)
              }
              if (k === 3) {
                LODOP.ADD_PRINT_BARCODE(760, 50, 220, 220, 'QRCode', re.url)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(980, 55, '100%', 20, re.name)
                LODOP.SET_PRINT_STYLE('FontSize', 10)
                LODOP.ADD_PRINT_TEXT(1000, 55, '100%', 20, '问卷链接:' + re.url)
              }
            })
            LODOP.NEWPAGEA()
          })
          LODOP.PREVIEW()
        } catch (error) {
          this.$message.error('请先安装打印控件！')
        }
      })
    },
    dialogCancelFun () { // 弹窗取消函数
      this.dialogVisible = false
      this.addNumber = 1
    },
    dialogComfireFun () { // 弹窗确认函数
      this.$ajax({
        method: 'post',
        url: 'feedback/question/generateQRcode',
        data: {
          'questionnaireId': JSON.parse(sessionStorage.getItem('codeId')),
          'count': this.addNumber
        }
      }).then(re => {
        this.YS.YS_jquery().then($ => {
          this.qrCodeData.forEach((re, key) => {
            $('#qrcode' + key).html('')
          })
          this.qrCodeData = re.data.list
          this.total = re.data.list.length
          this.used = re.data.list.filter(re => { return re.isUser === 1 }).length
          this.creatQrcodeFun()
        })
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
      this.dialogVisible = false
    }
  }
}
