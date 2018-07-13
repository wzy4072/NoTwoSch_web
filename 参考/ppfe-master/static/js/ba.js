/**
 * Baidu Analytics
 */
var bacode = window['BAIDU_ANALYTICS'];
if (bacode != '' && bacode != '__BAIDU_ANALYTICS__') {
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?" + bacode;
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
}