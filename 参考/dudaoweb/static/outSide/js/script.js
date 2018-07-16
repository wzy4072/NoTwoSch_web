
!function(window,$){
	var url = "";
	var ht = location.href.split('.')[0];
  	if (ht=='http://server' || ht.indexOf('http://localhost')>=0 || ht.indexOf('http://192.168.1.10')>=0 ) {
  		url="/Main/base/outSide/json/";
  	}else {
  		url = location.href.split('Main')[0];
  	}
  	var BaseUrl = url;
	var Ins = {		 
		"ajax":function(config){
			var options = {
				"path":"false",
				"fpath":"",
				"method":"post",
				"params":{},
				"responseType":"json",
				"response":function(data,status,xhr){}, //响应回调函数
				"loading":function(xhr,settings){}, //加载回调函数
				"error":function(xhr,errorType,error){}, //错误回调函数
				"success":function(xhr,status){} //请求成功回调函数
			}
			var headers = {};
			for (key in config) {
				options[key] = config[key];
			}
			var newurl = '';
			if(options.fpath){
				newurl = options.fpath;
			}else{
				newurl = url+options["path"]
			}			
			$.ajax({
				type:options["method"],
				url:newurl,
				contentType:'application/json',
				headers:headers,
				timeout:10000,
				data:JSON.stringify(options["params"]),
				beforeSend:options["loading"],
				success:options["response"],
				error:options["error"],
				complete:options["success"]
			});
		}
	}
	window.Ins = Ins;
	window.BaseUrl = BaseUrl;
}(window,jQuery);
 

/**
 * get 对象
 * @param  {[type]} window [description]
 * @param  {[type]} search [description]
 * @return {[type]}        [description]
 */
!function(window,search){
	var GET = {};
	var canshu=search.split("?")[1]==undefined?'':search.split("?")[1];
	if(canshu!=''){
		var strarr = canshu.split("&");
		for(i=0;i<strarr.length;i++){
			var xx = strarr[i];
			var mykey = xx.split('=')[0];
			var myvalue = xx.split('=')[1];
			GET[mykey] = myvalue;
		}
	}
	window.GET = GET;
}(window,location.search);

//公共方法
	function setCookie(name,value){
	var Days = 1;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}


	function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
	} 
 
/**
 * fac 对象
 
 */ 
!function(window) {
    var fac = {
        getDateAll: function(tm,reg,hms){  //参数说明：tm为时间戳，reg为需要转换后的格式，可传‘-’，‘/’,不传则默认为年月日格式；hms为具体的时间，可传hms，hm; hms显示时分秒，hm显示小时分钟，不传则不显示。
        	/*将时间戳转成 全时间格式适用于全部情况，可转换成 2011-3-16 16:50:40  2011/3/16 16:50:40 2011年3月16日 16:50:40*/
        	var retime = '';
        	var time; //具体时间
        	var date; //日期
            if (parseInt(tm) > 0) {
                var date = new Date(tm);
                var year = date.getYear() + 1900;
                var month = date.getMonth() + 1;
                month = month < 10 ? '0' + month: month;
                var day = date.getDate();
                day = day < 10 ? ('0' + day): day;
                var h = date.getHours();
                var m = date.getMinutes(); 
                var s = date.getSeconds(); 
                h = h < 10 ? ('0' + h): h;
                m = m < 10 ? ('0' + m): m;
                s = s < 10 ? ('0' + s): s;
                if(reg == '-' || reg == '/'){
                	date = year + reg + month + reg + day;
                }else{
                	date = year + '年' + month + '月' + day + '日';
                }
                if(hms == 'hms'){
                	time = h + ':' + m + ':' + s;
                }else if(hms == 'hm'){
                	time = h + ':' + m;
                }else{
                	time = '';
                }
                if(time == ''){
                	return date;
                }else{
                	return date + ' ' +time;
                }                
            } else {
                return retime;
            }
        },       
        time: function(str) {
            //返回时间戳；str 为空则返回当前时间戳；
            //var timestamp = str ? Date.parse(new Date(str)) : Date.parse(new Date());
            var timestamp = str ? Date.parse(new Date(str)) : Date.parse(new Date());

            return timestamp;
        },
         //选择图片和视频
        chooseImage:function(url,fun){
            if ($("#file_upload").val() === "") {
                    return false;
            }
            $.showLoading();
            var files = event.target.files;
            if (files !== null && files.length !== 0) {                
                var fileName = $("#file_upload").val().split("\\");                    
                    fileName = fileName[fileName.length-1];    
                
                 var baseUrl2 = location.protocol +"//"+ location.host + "/";  //线上地址mark     
                //  php 真机调试 地址
                 if (location.href.indexOf('http://192.168.1.10')>=0||location.href.indexOf('server.')>=0) {  
                   baseUrl2="/Main/base/outSide/json/";//本地联调
                 }
                var actionurl = baseUrl2 + url;
                var a = getCookie("request_token");//null
                $("#picture_form").attr("action", actionurl);
                $("#picture_form").ajaxSubmit({
                    dataType: 'text',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("request_token", a);
                    },
                    success: function(data) {
                        var re = JSON.parse(data);
                        console.dir(re);
                        $.hideLoading();
                        if (re.code == 1) {
                            $.toast("上传成功", "text");                            
                            $("#file_upload").val("");                            
                            re.list[0].fileName = fileName;
                            if (typeof(fun)=='function') {fun(re);} 
                        } else {
                            $.alert(re.desc);
                        }
                    },
                    error: function(xhr) {
                        var message = xhr.responseText.split(/["]/);                        
                        $.alert(message[3]);
                    }
                });
            }
        },
        closeWindow:function (argument) {
          $.getScript("js/WeixinJSBridge.js",function(){  //加载test.js,成功后，并执行回调函数
            console.log("加载js文件");             
             setTimeout(function(){              
               // 微信关闭窗口
               WeixinJSBridge.call('closeWindow');
                window.close();    
            },1000);
             
          });
        },
        //判断是否微信
        isWeiXin: function (){
            var ua = window.navigator.userAgent.toLowerCase();//userAgent//转小写
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){ //micromessenger:微信版本
                return true;
            }else{
                return false;
            }
        },
        isPhoneNumber: function (str){
           //检查是否是手机号 
            return /^0?(13|14|15|18)[0-9]{9}$/.test(str);            
        },
		judgetype:function (url) { 
		//判断附件类型              
                var arr = url.split('.');//通过.分隔字符串，成字符串数组
                var type = arr[arr.length-1].toLowerCase();//取最后一个，就是文件名,转小写
                var attType = "";
                if (type==="jpg"||type==="gif"||type==="png"||type==="jpeg"||type==="bmp") {
                   attType = 1;
                }
                if (type==="avi"||type==="mov"||type==="wmv"||type==="3gp"||type==="mkv"||type==="rmvb") {
                   attType = 3;
                }
                if (type.indexOf("do")!==-1||type.indexOf("xl")!==-1||type.indexOf("pp")!==-1) {
                   attType = 4;
                }                               
               return attType;
            },
	    animateIn:function(url,s,fun){ 
	    	s = s==undefined?200:s;
		   $('body').animate({
           left: 0,
           opacity: 1           
           },
           s, function() {
             	if (typeof(fun)=='function') {
           		fun();
             	}          
          });
		},
	    animateOut:function(url,s,fun){ 
		  s = s==undefined?200:s;
		   $('body').animate({
           left: '-5vw',
           opacity: 0
           },
           s, function() {
             	if (typeof(fun)=='function') {
           		fun();
             	}
                if (url!=='') {
           		 window.location.href = url;
             	}
           
          });
		},
	    hrefbind:function(){ 
	      $(document).on('click', "[data-href]", function(event) {
	      	var _this = this;
	      	fac.animateOut('',200,function () {
	      		window.location.href = _this.getAttribute('data-href');
	      	}) 
		  }); 
		},
	    animatePage:function(){ 
	      fac.animateIn();
          fac.hrefbind();
		}
    };

    window.fac = fac;
} (window);

