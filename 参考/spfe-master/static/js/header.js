(function () {
  var head = document.getElementsByTagName('head')[0];
  var cssId = 'commonHeaderCSS';
  var url = window['PASSPORT_URL'];
  if (url === "__PASSPORT_URL__") {
    url = 'http://192.168.3.146:81';
  }
  if (!document.getElementById(cssId)) {
    var link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url + '/commonHeader.css';
    link.media = 'all';
    head.appendChild(link);
  }

  var scriptId = 'commandHeaderJS';
  if (!document.getElementById(scriptId)) {
    var script = document.createElement('script');
    script.id = scriptId;
    script.src = url + '/js/commonHeader/commonHeader.js';
    head.appendChild(script);
  }
})();
