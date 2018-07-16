/* eslint-disable */
import 'babel-polyfill'
import axios from 'axios'
const debug = (process.env.NODE_ENV !== 'production')
const ajax = function (config, pathUrl) {
  const loading = this.$loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  if (pathUrl) {
    config.url = pathUrl + config.url
  }
  return axios(config).then(res => {
    let success = true
    loading.close()
    switch (res.data.code) {
      case -1:// 未知异常
      case 0:// 失败
        success = false
        // this.$message.error(res.data.desc)
        console.error(res.data.desc)
        break
      case -4:// 无访问权限
        success = false
        this.$message.error('无访问权限')
        break
      case 1:// 成功
        success = true
        break
    }
    return new Promise(function func (resolve, reject) {
      // do somthing, maybe async
      if (success) {
        return resolve(res)
      }else{
        return reject(res)
      }
    })
  })
}
axios.interceptors.request.use(function (config) {
  config.headers.authorization = sessionStorage.getItem('user_token')// 将接口返回的token信息配置到接口请求中
  return config
}, function (error) {
  return Promise.reject(error)
})
// http response 拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.code === -2 || response.data.code === -3 || response.data.code === -5) { // 具体的判断token失效的参数
    sessionStorage.removeItem('user_token')
    sessionStorage.removeItem('LoginUser')
    if (util.getCookie('token')) {
      this.$ajax({
        method: 'get',
        url: 'auth/getServiceToken',
        params: {loginAuthToken: util.getCookie('token'),type:2}
      }).then(res => {
        sessionStorage.setItem('user_token', res.data.token)
        sessionStorage.setItem('LoginUser', JSON.stringify(res.data.data))
        this.$router.push({ path: '/' })
      })
    } else {
      util.delCookie('token')
      if(sessionStorage.getItem('LoginType') ==1){
        window.location.href = '/#/login_kind'// 需求方要求一旦出错立即跳转登录，所以采取这种侵入式的手段。
      }else{
        window.location.href = '/#/login_edu'// 需求方要求一旦出错立即跳转登录，所以采取这种侵入式的手段。
      }
    }
  } else if (response.data.code === -6) {
    sessionStorage.removeItem('user_token')
    sessionStorage.removeItem('LoginUser')
    util.delCookie('token')
    if(sessionStorage.getItem('LoginType') ==1){
      window.location.href = '/#/login_kind'// 需求方要求一旦出错立即跳转登录，所以采取这种侵入式的手段。
    }else{
      window.location.href = '/#/login_edu'// 需求方要求一旦出错立即跳转登录，所以采取这种侵入式的手段。
    }
  } else {
    return response
  }
}, function (error) {
  return Promise.reject(error)
})
let util = {
  promise: function (config) {
    if (debug) {
      config.url = 'api/' + config.url
      return ajax.call(this, config)
    } else {
      return ajax.call(this, config, this.$api.baseUrl)
    }
  },
  getDateAll: function (tm, reg, hms) {
    // 参数说明：tm为时间戳，reg为需要转换后的格式，可传‘-’，‘/’,不传则默认为年月日格式；hms为具体的时间，可传hms，hm; hms显示时分秒，hm显示小时分钟，不传则不显示。
    /* 将时间戳转成 全时间格式适用于全部情况，可转换成 2011-3-16 16:50:40  2011/3/16 16:50:40 2011年3月16日 16:50:40 */
    var retime = ''
    var time // 具体时间
    if (parseInt(tm) > 0) {
      var date = new Date(tm)
      var year = date.getYear() + 1900
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = date.getDate()
      day = day < 10 ? ('0' + day) : day
      var h = date.getHours()
      var m = date.getMinutes()
      var s = date.getSeconds()
      h = h < 10 ? ('0' + h) : h
      m = m < 10 ? ('0' + m) : m
      s = s < 10 ? ('0' + s) : s
      if (reg === '-' || reg === '/') {
        date = year + reg + month + reg + day
      } else {
        date = year + '年' + month + '月' + day + '日'
      }
      if (hms === 'hms') {
        time = h + ':' + m + ':' + s
      } else if (hms === 'hm') {
        time = h + ':' + m
      } else {
        time = ''
      }
      if (time === '') {
        return date
      } else {
        return date + ' ' + time
      }
    } else {
      return retime
    }
  },
  time: function (str) {
    // 返回时间戳；str 为空则返回当前时间戳；
    // var timestamp = str ? Date.parse(new Date(str)) : Date.parse(new Date());
    var timestamp = str ? Date.parse(new Date(str)) : Date.parse(new Date())
    return timestamp
  },
// 手动加载js
  reloadAbleJSFn: function (id, newJS, fn) {
    let oldjs = null
    oldjs = document.getElementById(id)
    if (oldjs) oldjs.parentNode.removeChild(oldjs)
    var scriptObj = document.createElement('script')
    scriptObj.src = newJS
    scriptObj.type = 'text/javascript'
    scriptObj.id = id
    scriptObj.onload = fn
    document.getElementsByTagName('head')[0].appendChild(scriptObj)
  },
  // 获取cookie
  setCookie: function (name, value, day) {
    var date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date
  },
   // 获取cookie
  getCookie: function (name) {
    var reg = RegExp(name + '=([^;]+)')
    var arr = document.cookie.match(reg)
    if (arr) {
      return arr[1]
    } else {
      return ''
    }
  },
   // 删除cookie
  delCookie: function (name) {
    this.setCookie(name, null, -1)
  },
  // 小数转百分数
  decimalToPercent: function (num, digit) { // 参数： 小数+位数
    return isNaN(Number(num)) ? '0%' : (Number((Number(num) * 100).toFixed(digit)) + '%')
  },
  // 计算页面搜索栏宽度
  countWidth: function (arr1, arr2) {
    var arr3 = [true, true, true, false]
    // 计算搜索区总宽度
    var w = document.querySelectorAll('.ins-page-search')[0].clientWidth // 总宽度
    var availableWidth = w - arr2[arr2.length - 1]
    // var w2 = 0 // 搜索条件宽度
    // var w3 = document.querySelectorAll('.ins-opa-btn')[0].clientWidth // 按钮宽度（除search）
    // var availableWidth = w - w3 - 50 - 100  // 减去 间隔+search按钮
    // var searchArr = document.querySelectorAll('.ins-page-search .ins-search-con')
    // searchArr.forEach(function (val) {
    //   w2 += (val.clientWidth + 5)
    // })
    if (availableWidth < arr1[arr1.length - 1]) {
      arr3[arr3.length - 1] = true
      availableWidth -= 98// 剩余可用宽度
      for (var i = arr1.length - 2; i >= 0; i--) {
        for (var j = 0, temp = 0; j < i; j++) {
          temp += arr1[j]
        }
        if (availableWidth - arr1[i] < temp) {
          arr3[i] = false
        } else {
          arr3[i] = true
        }
      }
    } else {
      arr3[arr3.length - 1] = false
      for (var k = arr3.length - 2; k >= 0; k--) {
        arr3[k] = true
      }
    }
    return arr3
  },
  getUrlParameter (field) { // 获取网址上参数
    let GET = {}
    let canshu = window.location.hash.split('?')[1] === undefined ? '' : window.location.hash.split('?')[1]
    if (canshu !== '') {
      let strarr = canshu.split('&')
      for (let i = 0; i < strarr.length; i++) {
        let xx = strarr[i]
        let mykey = xx.split('=')[0]
        let myvalue = xx.split('=')[1]
        GET[mykey] = myvalue
      }
    }
    return GET[field]
  },
  bytesToSize(bytes) { // 字节单位转换MB
    if (bytes === 0) return '0 B';
    var temp = '';
    var k = 1024,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    temp = (bytes / Math.pow(k, i)).toPrecision(3);
    switch (sizes[i]) {
      case 'B':
        return (temp / Math.pow(1024,2)).toPrecision(3);
      break;
      case 'KB':
        return (temp / 1024).toPrecision(3);
      break;
      case 'MB':
        return temp;
    }
  },
  downloadFile(url, name) { // 不能显式定义a标签时的下载
    var a = document.createElement('a')
    var event = new MouseEvent('click')

    a.download = name || ''
    a.href = url

    a.dispatchEvent(event)
  }
}
if(!debug){ // 生产模式
  if (sessionStorage.getItem('baseUrl')&&sessionStorage.getItem('baseUrl')!=='/api/') {
    util.baseUrl = sessionStorage.getItem('baseUrl')
  } else {
    axios({
      method: 'get',
      url: 'static/address.json'
    }).then(res => {
      util.baseUrl = res.data.address
      sessionStorage.setItem('baseUrl', util.baseUrl)
    })
  }
}else{ // 开发模式
  util.baseUrl = '/api/'
}
export default util
