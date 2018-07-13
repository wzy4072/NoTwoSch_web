/**
 * 应用公用头部脚本
 *
 * @NOTE (1)考虑到每个应用的域名、所用框架、库不同，全部使用原生js书写；
 *       (2)为了保证最大程度的兼容性，css样式全部加id指明范围；
 *       (3)在id和class的命名上尽可能加前缀，防止冲突；
 *       (4)头部输出两个js：一个是webpack默认打包方式的，依赖webpack，用于平台；另一个是umd打包，不需要任何依赖，用于各应用
 *      
 */

import URLconfig from 'appconfig';

(function() {
    /**
     * 在父元素下的开头插入子元素
     * @NOTE 我这里需要插入的是一个div而已，就不考虑子元素不是obj的情况了
     * @param ele 父元素
     * @param node 子元素
     */
    function prepend(ele, node){
        var eleIsEmpty = ele.childNodes.length <= 0;
        eleIsEmpty ? ele.appendChild(node) : ele.insertBefore(node, ele.childNodes[0]);
    }
    // 创建并插入锚点
    var headerInit = document.createElement("div");
    headerInit.id = "common-header";
    prepend(document.body, headerInit);
    // 加载基础模版
    headerInit.innerHTML = '<div id=common-header-title><div class=header-title-left><a href="/"><img src="" id=common-header-brand></a></div><div class=header-title-right><p id=common-header-company-name>云报关</p><p class=header-title-text>一站式通关服务平台</p></div></div><div id=common-header-nav><a class=header-info-jump id=header-info-jump href="/"><img src=""><p>主页</p></a><div id=common-header-nav-box class=_nav><a href="javascript:;"><img src=""><p>查询工具</p></a></div></div><div id=common-header-info><a class=header-info-message id=header-info-message href="/"><img src=""><p>消息</p><span id=common-header-red-dot></span></a><div class=header-info-img-box><img src="" id=common-header-profile-picture><ul id=header-info-select-items><li id=header-info-name>hi&nbsp;,&nbsp;<span></span></li><li><a href="javascript:;" id=common-header-change-password><img src="" alt="">修改密码</a></li><li><a href="javascript:;" id=common-header-exit><img src="" alt="">安全退出</a></li></ul></div></div><div id="common-header-contact"><a id="header-contact-2" target="_blank" href="https://app.singlewindow.cn/cas/login?service=http%3A%2F%2Fsz.singlewindow.cn%3A80%2Fdyck%2Flogin.do%3Fmethod%3DloginStandard%26loginSignal%3D0"><img src=""><p>登录申报</p></a><a id="header-contact-1" target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=23f897c5b89eaf39ae3f1c3c8d99f1440b5e32fdfb9c3a76977690e5baac1ef9"><img src=""><p>QQ服务群</p></a><a id="header-contact-3" target="_blank" href="http://update.singlewindow.cn/SWClientUpdate/default.htm"><img src=""><p>导入端下载</p></a></div><div id=common-header-store><div id=common-header-store-show><div class="inner-store inner-store-hold"><div id=common-header-edit-btn><span id=common-header-btn-text>编辑</span></div><div class=inner-title>置顶应用<span class=inner-title-tip>最多可设置7个置顶应用</span></div><ul id=common-header-stick-top class=header-clearfix></ul></div><div class="inner-store inner-store-no"><div class=inner-title>备选应用</div><ul id=common-header-backup class=header-clearfix></ul></div></div><div id=common-header-store-cover></div></div>';
    
    window.onload = function() {
        // 定义公共变量

        // 识别src以确定前端url
        var BASIC_FRONTEND_URL = getNowBaseURL();
        // 从endpoint配置表确定后端接口url
        var BASIC_BACKEND_URL = URLconfig.endpointUrl;

        // 右侧DOM元素命名空间
        var domRight = {};
        // 导航条DOM元素命名空间
        var domNav = {};
        // 应用商店DOM元素命名空间
        var domStore = {};
        domAssignmentInit();
        
        // Data 置顶应用列表
        var upApps = [];
        // Data 镜像列表，用于用户编辑时互动，点击保存再存入真正列表
        var mirrorUpApps = upApps;
        // Data 备选应用列表
        var downApps = [];
        // Data 镜像列表，用于用户编辑时互动，点击保存再存入真正列表
        var mirrorDownApps = downApps;

        // 定义工具方法对象
        function Tools() {};
        Tools.prototype = {
            /**
             * 简单封装原生ajax
             * @NOTE 自产自销的封装，提醒一下几个月后回来修改的自己每个参数都要传，否则有问题
             * @param option {method,url,callback,data} 配置对象
             * @returns {boolean}
             *
             */
            ajax: function(option) {
                var method = option.method;
                var data = option.data;
                var url = option.url;
                var callback = option.callback;

                var xhr = new XMLHttpRequest();
                // 打开安全选项
                xhr.withCredentials = true;
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        if(xhr.status === 200)  {
                            callback(xhr.responseText);
                        } else if(xhr.status === 401) {
                            // alert("未登录");
                        }else {
                            // alert("服务器连接异常");
                        }

                    }
                }
                if(method === 'get'){
                    if(typeof data === 'object'){
                        var dataSent = '?';
                        for(var key in data){
                            dataSent+=key+'='+data[key];
                            dataSent+='&';
                        }
                        dataSent = dataSent.slice(0,-1);
                        url = url + (dataSent || "");
                    }
                    xhr.open(method ,url ,true);
                    xhr.setRequestHeader('Accept-Language','utf-8;zh-CN,zh;q=0.8');
                    xhr.send(null);
                }else if(method === 'post'){
                    xhr.open(method ,url ,true);
                    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                    xhr.setRequestHeader('Accept-Language','utf-8;zh-CN,zh;q=0.8');
                    xhr.send(JSON.stringify(data));
                }
            },

            /**
             * 清除所有cookie
             *
             */
            clearCookie: function() {
                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path:/";
                }
            },
            /**
             * 简单封装添加类名
             * @NOTE 暂时使用类替换法，后面有时间写成正则的
             * @param DOM
             * @param className
             */
            addClassName: function(DOM, className) {
                var classVal = DOM.getAttribute("class");
                var calssName = " " + className + " ";
                classVal = " " + classVal + " ";

                classVal = classVal .concat(calssName);
                DOM.setAttribute("class",classVal );
            },
            /**
             * 简单封装删除类名
             * @NOTE 暂时使用类替换法，后面有时间写成正则的
             * @param DOM
             * @param className
             */
            removeClassName: function(DOM, className) {
                var classVal = DOM.getAttribute("class");
                var calssName = " " + className + " ";
                classVal = " " + classVal + " ";

                classVal = classVal .replace(calssName," ");
                DOM.setAttribute("class",classVal );
            }
        };
        var tools = new Tools();

        // 加载静态数据的base64编码的图片
        // 个人中心图标
        var homeBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRCQTc3OTczOTJBNzExRTc4NjZGQjgyMjQ2RDczMkMzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRCQTc3OTc0OTJBNzExRTc4NjZGQjgyMjQ2RDczMkMzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEJBNzc5NzE5MkE3MTFFNzg2NkZCODIyNDZENzMyQzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEJBNzc5NzI5MkE3MTFFNzg2NkZCODIyNDZENzMyQzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5BdetzAAABS0lEQVR42qSUsUoDQRCGNzFHSNSAjUZIYWGjaCWCtRY2wV7wUVLpowiColgoQUHBzi5YaSNaSAgiKLG8U/EbmIRlvc1e4sAHtzc7/87t7n+5OI5NIOqwB7tw6iajKOo/5wJii3ANVXiFdbj3ieUHCC3ArQpJzOh4zVfgE5uGI6g47yv6qbNZxWpwA0uehaTTK503UGwcmvqJob1sWlvwR2wMTmDZZAuZd54kSckVK8IlbJrhYgXOECzaYgewYUYLqTtGsCz3bJ/Bjvl/XEhnP9CCzogib1rfth0gG3oXuMhuSCOruKDlnmYbvofsSuY/9wYFK1EWr6YUHMIDzMG2nnzf23o3P1wxXzTgESZgyxHL5E3XFRKTns69YmmTo5QtCYrl1VLGs4Dkppxcwa6xV3vX346Y/EtzclJPmu+qd+f1Skj+BT57Ar8CDACicUL6oj+ixgAAAABJRU5ErkJggg==";
        // 报关制单图标
        var formBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY0QUVCMDNDQTI4RDExRTdCMjUzOUU5Rjg0NDEyRDcxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY0QUVCMDNEQTI4RDExRTdCMjUzOUU5Rjg0NDEyRDcxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjRBRUIwM0FBMjhEMTFFN0IyNTM5RTlGODQ0MTJENzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjRBRUIwM0JBMjhEMTFFN0IyNTM5RTlGODQ0MTJENzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5OpDYfAAABYElEQVR42szUzytEURTA8fvGw8g0kh+xkMaKWIyM0cjfYGdlaWWpSM1C2YmVLMnWP2BhZSFZkB1lIZlioygbo4mu723Oyyvvzb0zLJz6zPt13+mcM7entNbKooALvGDRtl45JDyTZLd4Rt4l4RAmkUMGSYyiqKuxLNcm8TGmkEKPvDeBsSDhLEr6O86RRVnXjnmshK7fMOfxs6uUWsASbvCKa+RVNT7QCh9ludcsa5owIs/3cWgq3JPZDDrMs5YrU1xCKvDQqxqPNung04942I0NdDok2sYJdHAjKmE7suiS6uMiKWuULWEJuTpbTvw4+auIqrAPa0g7tLyFS1vLZm+NYyC8MGbdgUvCRxT+9QzNPtxBPyox73lyXMepreW0zC9lmWHwB8buw+DmHWbq7NQLz7BFjpVfjO5dCvJNhU/owCbuY8ZQK4LP2zCOzPcww8kqpqVS3UCFZk8+oPglwAC7enzxfplh1AAAAABJRU5ErkJggg==";
        // 默认头像图片
        var profileBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDREFBN0FDQTI4QzExRTdBQjAzQzJGMTMyNzE4M0IxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDREFBN0FEQTI4QzExRTdBQjAzQzJGMTMyNzE4M0IxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNEQUE3QUFBMjhDMTFFN0FCMDNDMkYxMzI3MTgzQjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNEQUE3QUJBMjhDMTFFN0FCMDNDMkYxMzI3MTgzQjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6N7O4BAAAPfklEQVR42rxZ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";
        // logo图片
        var logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExRkUzMkFDQTI4RTExRTdCQTZBOTMzRDg3RjVDRjVEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjExRkUzMkFEQTI4RTExRTdCQTZBOTMzRDg3RjVDRjVEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTFGRTMyQUFBMjhFMTFFN0JBNkE5MzNEODdGNUNGNUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTFGRTMyQUJBMjhFMTFFN0JBNkE5MzNEODdGNUNGNUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Mv6SZAAAGwUlEQVR42txaaWxUVRQ+s3aZdrpBW8piobVlkbVFBVRSBCIocQEVEg1o4g80RmMMwcQAaoyailEThRA1xURAEgPqD0MLNiqlGls2BTqUQNmK3ZjOdDr7zPM7d94rM0NnusMMJ/k6r++9++75znbvu/epJEmiYZLxQBlQChQD+cAowACoABvQDjQBJqAOqAYuD0fnqiESmQCsBVYDUwf5jNPAHuBb4OKgNWEig8BMYC/gk4ZPfPIzZw5Gp4E2yAYqAL80cuKX+8geKSJPA2bp1olZ7nPYiOiBL6XbJ9tkHaLq2VeypwA/AEvp9kolsFKufAOuWsnAQWAexYbUAosB+0CI6IFfgEUUW3IIWA64wy+oIzT4NAZJsDwMfNZfjzwrD1CxLGvCdQwnkgecAtJjnEgnMA1ojhRa5XFAgmQdyyN5ZI48kVNRfIgkT1CPhntkUxyRIFnXTeEeuQs4H6WKxar4gULggqL4c3FIQomoF4I9wu8EUyg+5Sy/yDERfrO7RPEtBeoYHcEHKmVquYTFjZz+00TLthMdOR9yehYTKYoFBb1I1WOdbgqfMB3FOYcvcHZr434qN50gq5Uox28Jvq2YiRSMlHLcv9njJ7uv7wWOOrOL5lRfoy/Od/WMduWNVirBuZNWb8DsxjRaXXSIdvrKqWDbhuDmk7T4Mzr8oR6/RB48SYchR6NSkXqQw6TJ5qEVta3UDXNn6NWUl6ihGWl6WjI6kZbnJoXcW5qRQE/lJdNpq0f87wT5r5pstHqcgeam6wJT35wyvOplEk2fgFp1LmTKwlXrJnO9daqTdjR1USIY6IFEjUocG7QqeiQnid4uTutV8a8v2mhyio4WZCUEXutaHVR73U1TU3V0xeGlFpePPoaV74PSNQtzQzzX7fMTa8JGU1HAeF1eP6Vp1aL/PsSt7e3s5FQtrYR1nPCMC724MH7yMVspVRt53NxyplNYVSHCFkUz2jz5BvG9V+w01agLaXfC4qZFh1vEMets0KgxZEsiGpLA6JVJKfRqgTEqEyaC1KGQu9ZOSBHo9zvodZdQhhP2cIdLEJqXmSBIKO6uanXSxlNmumD3Ukm6PqR9Eby4q3QUWeGBqw4fbcB9i0cn0ZN5SaL9PUZ9XyrYmEhbOJFeJzV4oge+R+6SSljthrv3N9tFWNnApAs3pOnUVAjlvHKoBHJATyuQF6UgweEZssKBkFVyhkOP+9pYZKQy5FI/xcw5ckBZJdnwr5laEUduPInR5vaTFYpx+XPgf/61w2rZCRo6tmiMUJjFhWus9Mq/2siC+2vl+F9S0yLCYwtCiwll6TWUgANuxs9gjlzVuMT6YCQrKsy6+nZKRvhWzMkSucE5mozf/GQtZeojhnWVVp6rCCIH25wiJ5hAGxJzGmK50KATSZ6i4WRXC+tlQBNtUClj5TgrxidpqKHLI5L8XiQ0K8Chsq6+gy4i2b0grAYxzqGqBTkiH04iJJeCsD+o5Dj9PnoU1U6ZqzOhd6ek05t3Rwwck1Z+mQoMPmVjxO/CP1pEpzUP5fZYPeqsDWWWQ4JDrANGeL6ugyoXZJMWSuei5FaUjBKe+umand74x0wv5aeQEpnzkUvnlo4VBngMys9NT6AdszPJiH65mnFk8K3swShynIn8GnyGk/X3did9PiPzJhJcDi/DwlNQToMLYgvC0WTz0kSDFhb30QmEHRNgJTiXeMT+8KxFhOb9UHzNOENPWx28ORFhwwMhe6V8eoYYa75Bzj0Az3Ff/ZBqtbw/cUZJ6HcaOsWVGlSiD9D5rsvdglgTqs0elM7ph5ppX3PoGtmD6PC3B3Pg+jQkvJ9SZQOwkjyqz8f12Uhyrm4q2YPBwt74BB5dNTZZPIuLxlb8X1zVTJtRAZ3RZwaN/FKomPw75ewqjAOvFxpFUrPC75ss9OLRDnqvwdJTUg+0OHp9YhaSkfNF6RjpJIoAe+USDMEW5uq1rzm0/c//OUQ+fTQto6eKHUHBeK0glSoudaMA+aIR+T54fyQ/2l4HSAmw1Jtd0lWHt9f7unFPo80j+eRNh5ePd0jr6trF8dZGi3TG6o7aLlLffeypTAxfxN4PPB5n7yE/Ak+ELweVAH/fCctB9cDuOPLGboXEHb1kyhfWx4E31geTCK5a4dgmxa5sH8jWW6xu9PAsZBn1stFzx2y9RZsR2uVZcWUMkKiUdbFHLsb9257efptzQh/vHww8M5KfcOy8BZ9w7BzJTziCMWsEP6qZNRidhuszpzVD2JZoAHbRED9zGiqRcFL84dlceT05nwIfninrSsEfnp2VJ6jVw7Wl8b8AAwCKVoErifMAlwAAAABJRU5ErkJggg=="
        var truckBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwRDhDMTQ1QUQ2QjExRTc4N0Y3RjA4Q0RFOERFRjA1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwRDhDMTQ2QUQ2QjExRTc4N0Y3RjA4Q0RFOERFRjA1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBEOEMxNDNBRDZCMTFFNzg3RjdGMDhDREU4REVGMDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBEOEMxNDRBRDZCMTFFNzg3RjdGMDhDREU4REVGMDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz54kw5MAAAB2klEQVR42pzUz0tUURjG8TOZQ5qathANcRmBIJpToeZG/BNcBCHYIhUEI6IQw426rtZBi1DCH+lSUMGVtYly7UKEhBRchKaipnP7vsNz4Xgb9Y4vfLjnnvPe9545555JpIMTFyPy8QntLn58TcQsfhff8QHzKDkndx/38Sxu8dtYQTm2/IGEu5L1gcClg6tZ+usxqKWwsKdLcaQZb100EwoXhw/60YzZzLhzm/IbZd6L4kQmz595CktqzyFcL1vnCmzkUPzUTB7gmwo9xi1UogUzqMFfl2PYzBuxiBd4kyXnMxpweJniC7im9ittZKBlqcUxfign5+LX8Qit+ulHmS/MuaQKv0ZRZH9iF7eYkLOizV0iwg0t1PU5fuEnXnp5aV2jJ66Pb3oVa+j5L58TGtgpRZfaIxhSe0Bjd3RfpnvT7+UPq90bBIEzdh8uy1MMoxvv1beOt9rMlPpGsaw9sb3o5Ph/1Km0/Hdc7UxUhTOfxYHeXO/NrEF9G/IFx+oL3fNmWhcZmwwLVWFKnQ/Rgl3MoBo3lVekpSnGNPbRJPbsKG5Yvr3QeTPNxzj+YE+FC7zxqCQmsI0dtZPhLzHRv1z7ep5oTcdwcMHXZmehA3n218H6nyr2T4ABAG6MkSb8zgr2AAAAAElFTkSuQmCC";
        var changeBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI5MUZDMkExRDU2RjExRTc5OUM5Q0NGOTg2QjBCOTIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI5MUZDMkEyRDU2RjExRTc5OUM5Q0NGOTg2QjBCOTIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjkxRkMyOUZENTZGMTFFNzk5QzlDQ0Y5ODZCMEI5MjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjkxRkMyQTBENTZGMTFFNzk5QzlDQ0Y5ODZCMEI5MjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7iJvVNAAAA5ElEQVR42pySvQ7BUBSAr6ZUJDYv4GEsFovBTxM/EWEwMtIaTR5AvIaB1WyUEKxsJgOhvpO0iaCaOsnX057e757bk0YGlp1VShUgpj4jDicYWYP+TgqWPWyQVjqXDsxgAcabqMENji9SHpYinmHOjmv1I5DaJBOqrN2KGHGP9EtqkaRbUSSp6SogkOqkCpSQNjwnuc/oAVJNukAZae+W07KRHiDloIl0eHkVhavmI5mu1H2TJB5w13wapqDnDeJbfD0qwjhoaJr6MzzRCeE4nii/WSKEKGsN+cYlTJjkJYQ4fQowAInTQm8t6Uh8AAAAAElFTkSuQmCC";
        var exitBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJEQTQ4NzcxRDU2RjExRTc5RTdFQkIzRjQwNDJENDVDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJEQTQ4NzcyRDU2RjExRTc5RTdFQkIzRjQwNDJENDVDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkRBNDg3NkZENTZGMTFFNzlFN0VCQjNGNDA0MkQ0NUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkRBNDg3NzBENTZGMTFFNzlFN0VCQjNGNDA0MkQ0NUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4PZ8OHAAAAwklEQVR42pRSbRHCMAxNuQqYhEkYDnAAEpCAAtqiAAmTMAfMAcUBEoaC8nK0/FnS697dW3tNXr4W43zoiMiBA63x8u56IQUWvOd7EOwLVcDiHjwhQ9VRwo4/LUIfbh3Yr8SN4NnMCDBsFqO6N7cHTiWAFcpjw7ES5wk+4Le3ioOpiE2xW6G8iCMqQ+OqzuCB22jv+TfpKf/WKGauYCkZ/y9Yz5lXNKVEW2kgHBEjgaOQ7VNK1NaTF98rux2zXcRXgAEAhophIJTAPO8AAAAASUVORK5CYII=";
        var qqBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNBM0Y3NjYyRjI4RjExRTc4RjRDRTY2MTRGNTc3QjRBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNBM0Y3NjYzRjI4RjExRTc4RjRDRTY2MTRGNTc3QjRBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0EzRjc2NjBGMjhGMTFFNzhGNENFNjYxNEY1NzdCNEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0EzRjc2NjFGMjhGMTFFNzhGNENFNjYxNEY1NzdCNEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ZgCXJAAABlklEQVR42qTVSyhEURgH8DPTrVkaeTRZTdlYeUxCNOWRZGMhUooUFpKS10JSs5TGSlnLQqEsUGws2VlIijITJe+yQWNz/M/tO7qOe899zL9+M809353v3HPvnAlzzpmNJGzCLXxCFtahxqHekd3BGa7PqJ8GBvubflhmzrmAQ4hSbQIidHwbMv/OsHSLQk4z80uqa4EHm/FvmNYt0YDL0ogJJLh7pqwNwpaL6dIszQa8wzFzTxrK5QfZoBd6NCetQS0UMG8ZURs0a4qv4RQmmPd0qg0imuIhqINBHw2qYFY2SMKwpjhDDfymXjZY0hTdwxNUBmhQKl5C3HxYHdMEr3DFgmXS0Aw+wgnss+CZkzfZboZ74gqhI48GZaJBHy3FnTKYhWIw8mhg3uQteIMVZSwGL7ADCwG+exEO5J7RTXu+Nc8QhxjVpLj37Kp7UTvElRmU0DKtQgVdkdeILaVaPqbywBi00l6fgxvaIsTNHod5n0skzm0M6X8GvxF/LCl6L4QPODfXmLEvaIMGKKKxM9pVj34EGABIRt7SukCDbAAAAABJRU5ErkJggg==";
        var singleABase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAWCAYAAABUpxX0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRGMjQ3NDNCRjlBQjExRTc4NjJCQUY4MTA2QjI0NjQ4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRGMjQ3NDNDRjlBQjExRTc4NjJCQUY4MTA2QjI0NjQ4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REYyNDc0MzlGOUFCMTFFNzg2MkJBRjgxMDZCMjQ2NDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REYyNDc0M0FGOUFCMTFFNzg2MkJBRjgxMDZCMjQ2NDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6l7q6IAAABqUlEQVR42tRXPU/DMBC9BBpGov6CbIiNn1BmFlYkEF0YEWGjU9IRiaGsTEH8AT4mpgbxB7owwNLCwJYoYgIJZM7Vi2RZTdO0qhSf9HK2Fd+9uzy3CQkhHMYlIxH1thQ8HYsvPSI6IXPs3ObLQT57y35o52FIyfcvXb0kdPr8OV7fe/yg++FXXUgfSdLNfGYx1las8bhhW9TA2GHv2FZdSDelPAQZZjYZaDnpDtRRd3SM73SR3TJaGEs/qBjfwz4J+dMaK/PWMki3kTRihEiar89qbRQeKfv6iNdX7hMFCOchPUDCAMmziqQzeJcxQqw7NONdu1fXb7co6GpJ0kNlHMA/KY/em7J3gEJ9eFnsLtbzIuayMtLXCB6gclWHrZKu+yA4QsfXMXZRbLgM0tGETsZKhyJgVm3nfrRIl6eRDhU56PIgJI0r5IkgDU/R+KScpD3JuMpBDLVDoR+UuGJzfEikB+8uo9O6dRfIEYFopkhsS5PI9oRGFB9yvGCfyfcmAyB5CmP/xlPGpiF8Jc9UavqGccz4Y7zWmPAGY59xQcqHbWrKh+2/AAMANg9Lg8681DIAAAAASUVORK5CYII=";
        var singleBBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAgCAYAAADqgqNBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ1RDFGQUJCRjlBQjExRTc5REQxQzVDNjI4Mjk1NjUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ1RDFGQUJDRjlBQjExRTc5REQxQzVDNjI4Mjk1NjUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDVEMUZBQjlGOUFCMTFFNzlERDFDNUM2MjgyOTU2NTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDVEMUZBQkFGOUFCMTFFNzlERDFDNUM2MjgyOTU2NTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz59fBNiAAADrUlEQVR42qyXS0iUURTHx3Gy7DW2MCtNxxYuelALe4Bh0wszEwpcSAgNQaCE0qJdQUZUC6tFGEX0sLDSTQQVZZtGoaJN2ANRy5i01NRsfOJrnP5X/l+cPu4888Bv7v3O/e493733nHPvWPx+vyVKjoJ+0AkORjNGjPqJQuaDQRDL53FgZxm22CzRyRjoAkNgHhgFE5EOYg3RngRugV7QDPKonwaHOfsf4BAwljAftICf4CpIDDh6kD3ZCvr8/8o42AlSQI/QtwI72A+mTH26wGadjUCGs8GIXy/qAwY0+l8aw4YMAafZjm7Zc8Ez0M6l/MT9VeVbMAwemReQffpAA2hin9dgks+PgTPYnhdw4KdgBFwHPnAPfAPfwWWww9QvBmwEN7nXX0E1WAgu0UcecNw9fzuJUHOBG+AOyARvQBZ4AZaBlwwlFWaLQRlIYd8OcJae72XYbQLdNKbG2A7qQTEonJkk17+U+3UcPAF7wQmQzL0qYlJJE3uWJ/Y0W+iXgHy2K30qOANyQB04AkZVYjI6KG9crnG8QjBGAx2gGWSxbZ0wnkpdLngvnNULdmvGzQCZwUItFvwWBur49TEa44nU2UABeCXamgLZCGY8jmGl5IswatEYt5va5jK8lPQGshEsw6l0eYX1VeAuyAFx1A1o+sSDfeA+Pd1Cb484wxlLfxH4xCwnuJTPhU45aQuYNL13UrNi2mV3iDLB9OJqUEEHCiXd4BxIN42hxtygM67CycO6G7g0X1pqyteV4rlSOKcK2QOin4tjNrLdbdgwXjCURuk1GY4Hw2xvAIvoZIaod5ZyO5S0ib7lnJiXB4+HH3LMGubRmwwWsF7Lc9wsPczvStKZcpVUsfSwrsr1wB2u8Xae6UpKmG5H+exjmcG0qeSdON89xEs81DdamdPrTcYaqZdhV0xDa0AruM22KfAQfAQreCCVaCagDKeBBBlqDjqck/tl1B0ap9slEo8/wJm+VtPP8Kcq7rlfl+HKQ8R9tTD0gbGs+Cz0pzT9XGJSTsNOJFfdJGGgmsnDyxBTOb1GJBd7OGNaI7hsTop6jXCoQe57LZ/niMiYtatzP28nReA8LxA+3oa2gAq+p5yv09TXqRnPHemfBiM6ysFKU5ua/QVwmvd6KR4R78atyaGMO1RFY8gjYlL3Eds4S7XE13h6BXrfbZr9zLONSpemQ5Xpa6VM807n5Z+Gsmj+9thCGAklQ5b/EJvl/6QtjL9cFm6RP9LLxGzh0j3/EWAAg5Wq6fHR8iYAAAAASUVORK5CYII=";
        var messageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVGRjdCQ0YyMEJEODExRThBQTE5OUMwNUEyRjBBNTY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVGRjdCQ0YzMEJEODExRThBQTE5OUMwNUEyRjBBNTY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUZGN0JDRjAwQkQ4MTFFOEFBMTk5QzA1QTJGMEE1NjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUZGN0JDRjEwQkQ4MTFFOEFBMTk5QzA1QTJGMEE1NjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5PZJ88AAABQElEQVR42qzUu0oDQRiG4dnFUzygSIykEeMBJCgWoihE7A3eg6VXkBQ2tnoVttpaewO2CgE7LQwqCAkRTUDHd+RfWOPsrjvxgwfCJPvt7GxmlNZaJaiijQ4qSb9PKpvXv5OPu8ZX9kzgDDeW72o4UlGx3GUbLR2fd1whm/TI67JWf8mDmIwq9HGn06WG86g1LCOn0uUFJeSDgXDhBoZSFq7hCZu2wimVPoNizla4qNzSj0J3YR+WHAvHMd1dOOL4yCZZWcsfhTmZumtmsRXslAIude9pmn1uZljFquo9wzg0hQv4+IfCZyx7THOHDycYwz06ZiXwiVd5i15wlqAhL9GX8QHMoImK972hlRrFfuj1t7GHFVmSjIy/4RjXuJA/tckjTtGKO1yLaGA3NFaWxS+6ntgHqONW1GUs8povAQYAsahENN364kUAAAAASUVORK5CYII=";
        
        (function() {
            document.getElementById("common-header-profile-picture").src = profileBase64;
            document.getElementById("common-header-brand").src = logoBase64;
            // document.getElementById("common-nav-config").getElementsByTagName("IMG")[0].src = configBase64;
            document.getElementById("common-header-change-password").getElementsByTagName("IMG")[0].src = changeBase64;
            document.getElementById("common-header-exit").getElementsByTagName("IMG")[0].src = exitBase64;
            document.getElementById("header-contact-1").getElementsByTagName("IMG")[0].src = qqBase64;
            document.getElementById("header-contact-2").getElementsByTagName("IMG")[0].src = singleABase64;
            document.getElementById("header-contact-3").getElementsByTagName("IMG")[0].src = singleBBase64;
            document.getElementById("header-info-message").getElementsByTagName("IMG")[0].src = messageBase64;
            domRight.jumpToHome.getElementsByTagName("IMG")[0].src = homeBase64;
            loadNavImg();
        })();
        // 加载动态数据
        loadPersonInfo("/foundation/head");
        
        // 绑定业务逻辑
        
        // 
        document.getElementsByClassName("header-title-left")[0].getElementsByTagName("A")[0].href = BASIC_FRONTEND_URL + "/company";
        // 右侧用户信息菜单
        domRight.userInfo.addEventListener('mouseenter', switchExitShow);
        domRight.userInfo.addEventListener('mouseleave', function() {
            domRight.exitBtnBox.style.display = 'none';
        });
        // 修改密码
        document.getElementById("common-header-change-password").href = BASIC_FRONTEND_URL + "/company/#/changepassword";
        domRight.jumpToHome.href = BASIC_FRONTEND_URL + "/company/#/home";
        domNav.message.href = BASIC_FRONTEND_URL + "/company/#/message";
        // 展示屏蔽应用商店功能
        // 退出
        domRight.exitBtn.addEventListener("click", loginOut);
        // 更新头部数据
        window.YBG_headInfoChangingTrigger = new Event('infoChanged');
        document.addEventListener('infoChanged', function (e) {
            var getInfoURL = "/foundation/head";
            loadPersonInfo(getInfoURL);
        }, false);


        // 定义业务方法
        /**
         * 初始化dom变量数据
         */
        function domAssignmentInit() {
            // DOM 返回个人/企业中心
            domRight.jumpToHome = document.getElementById("header-info-jump");
            // DOM 用户头像
            domRight.profilePicture = document.getElementById("common-header-profile-picture");
            // DOM 用户信息区域
            domRight.userInfo = document.getElementsByClassName("header-info-img-box")[0];
            // DOM 包含用户退出按钮的盒子
            domRight.exitBtnBox = document.getElementById("header-info-select-items");
            // DOM 右侧点击头像后出现的退出按钮
            domRight.exitBtn = document.getElementById("common-header-exit");

            // DOM 导航栏置顶列表
            domNav.appBox = document.getElementById("common-header-nav-box");
            // DOM 导航栏消息
            domNav.message = document.getElementById("header-info-message");
        };
        /**
         * 返回当前baseURL
         * @NOTE 返回本文件即commonHeader.js的script标签的来源url，即存放该文件的前端服务器url
         * @returns {*}
         */
        function getNowBaseURL() {
            var scriptArr = document.getElementsByTagName("SCRIPT");
            for (var i = 0; i < scriptArr.length; i++) {
                if(/commonHeader.js/.test(scriptArr[i].src)) {
                    var arr = scriptArr[i].src.match(/^https?:\/\/[\w.:]+\//)[0].split("");
                    arr.pop();
                    return arr.join("");
                }
            }
            // 万一找不到，baseURL是当前域名
            return "";
        };
        /**
         * 不允许页面滚动
         * @NOTE 利用getComputedStyle得到当前的width，加上17赋值回去
         */
        function banBodyScroll() {
            document.body.style.overflowY = 'hidden';
            document.body.style.paddingRight = '17px';

        };
        /**
         * 允许页面滚动
         */
        function allowbodyScroll() {
            document.body.style.overflowY = 'auto';
            document.body.style.paddingRight = '0px';
        };
        /**
         * 加载置顶应用的小图标
         */
        function loadNavImg() {
            var aArr = document.getElementById("common-header-nav-box").getElementsByTagName("A");
            for (var i = 0; i < aArr.length; i++) {
                var text = aArr[i].getElementsByTagName("P")[0].innerText;
                if(text === "报关制单") {
                    aArr[i].getElementsByTagName("IMG")[0].src = formBase64;
                }else if(text === "公路舱单"){
                    aArr[i].getElementsByTagName("IMG")[0].src = truckBase64;
                }else {
                    aArr[i].getElementsByTagName("IMG")[0].src = formBase64;
                }

            }
        };
        /**
         * 加载nav置顶应用HTML
         */
        function loadNavApp() {
            var temp = "";
            for (var i = 0; i < upApps.length; i++) {
                temp +=
                    '<a href='+ upApps[i].url +' target="_Blank">'+
                    '<img src="" alt="">'+
                    '<p>'+ upApps[i].text +'</p>'+
                    '</a>'
            }
            domNav.appBox.innerHTML = temp;
            loadNavImg();
        };
        /**
         * 加载应用商店置顶应用HTML
         * @param isMirror 是不是处于编辑镜像状态下
         */
        function loadStoreUpApp(isMirror) {
            isMirror = isMirror || false;
            var apps = isMirror?mirrorUpApps:upApps;
            var temp = "";
            for (var i = 0; i <apps.length; i++) {
                var img;
                if(apps[i].text === "报关制单") {
                    img = formBase64;
                }else if(apps[i].text === "公路舱单") {
                    img = truckBase64;
                }else {
                    img = formBase64;
                }
                temp +=
                    '<li>'+
                    '<a href='+ apps[i].url +' target="_Blank">'+
                    '<div class="store-section store-make-form">'+
                    '<i class="store-icon"><img src="'+ img +'" alt=""></i>'+
                    '<p class="store-text">'+ apps[i].text +'</p>'+
                    '</div>'+
                    '<span class="common-header-editIcon header-edit-icon-small">'+
                    '</span>'+
                    '</a>'+
                    '</li>'
            }
            domStore.upApps.innerHTML = temp;
            bandEditIconFn();
        };
        /**
         * 加载应用商店备选应用HTML
         * @param isMirror 是不是处于编辑镜像状态下
         */
        function loadStoreDownApp(isMirror) {
            isMirror = isMirror || false;
            var apps = isMirror?mirrorDownApps:downApps
            var temp = ""
            for (var i = 0; i < apps.length; i++) {
                var img;
                if(apps[i].text === "报关制单") {
                    img = formBase64;
                }else if(apps[i].text === "公路舱单") {
                    img = truckBase64;
                }else {
                    img = formBase64;
                }
                temp +=
                    '<li>'+
                    '<a href='+ apps[i].url +' target="_Blank">'+
                    '<div class="store-section store-make-form">'+
                    '<i class="store-icon"><img src="'+ img +'" alt=""></i>'+
                    '<p class="store-text">'+ apps[i].text +'</p>'+
                    '</div>'+
                    '<span class="common-header-editIcon header-edit-icon-small">'+
                    '</span>'+
                    '</a>'+
                    '</li>'
            }
            domStore.downApps.innerHTML = temp;
            bandEditIconFn();
        };
        /**
         * 保存编辑应用商店的状态
         */
        function saveAppEdit() {
            upApps = mirrorUpApps;
            downApps = mirrorDownApps;
            loadStoreUpApp();
            loadStoreDownApp();
            loadNavApp();
        };
        /**
         * 绑定放大图标事件
         */
        function bandEditIconFn() {
            for (var i = 0; i < domStore.lis.length; i++) {
                domStore.lis[i].addEventListener('mouseover', mouseoverApp);
                domStore.lis[i].addEventListener('mouseout', mouseoutApp);
            }
        };
        /**
         * 阻止应用商店处于标记状态时点击小图标使a标签的跳转
         */
        function preventLinkJump() {
            if(domStore.editBtn.getAttribute("triger") === "1") {
                var links = domStore.main.getElementsByTagName("a");
                for (var i = 0; i < links.length; i++) {
                    links[i].href = "javascript:;"
                }
            }
        };
        /**
         * 应用商店隐藏
         */
        function storeHide() {
            store.style.display = 'none';
            allowbodyScroll();
        };
        /**
         * 切换应用商店显示与否
         * @NOTE 附带处理页面滚动
         */
        function switchStoreShow() {
            if(domStore.store.style.display === 'block') {
                domStore.store.style.display = 'none';
                allowbodyScroll();
            }else {
                domStore.store.style.display = 'block';
                banBodyScroll();
            }
        };
        /**
         * 切换公司列表显示与否
         * @NOTE 附带处理按钮变色
         */
        function switchSelectCompanyShow() {
            if(selectCompany.style.display === 'block') {
                selectCompany.style.display = 'none';
                selectCompanyBtn.style.backgroundColor = '#4faef1';
            }else {
                selectCompany.style.display = 'block';
                selectCompanyBtn.style.backgroundColor = '#1f89d6';
            }
        };
        /**
         * 切换退出按钮显示与否
         */
        function switchExitShow() {
            if(domRight.exitBtnBox.style.display === 'block') {
                domRight.exitBtnBox.style.display = 'none';
            }else {
                domRight.exitBtnBox.style.display = 'block';
            }
        };
        /**
         * 切换应用商店的编辑编辑状态
         */
        function switchAppEdit() {
            var btnText = document.getElementById("common-header-btn-text");
            if(domStore.editBtn.getAttribute("triger") === "0") {
                domStore.editBtn.setAttribute("triger", "1");
                // 阻止a标签跳转
                preventLinkJump();
                tools.addClassName(domStore.main, "header-show");
                btnText.innerText = "保存";
            }else if(domStore.editBtn.getAttribute("triger") === "1") {
                saveAppEdit();
                domStore.editBtn.setAttribute("triger", "0");
                tools.removeClassName(domStore.main, "header-show");
                btnText.innerText = "编辑";
            }else {
                return
            }
        };
        /**
         * 鼠标移入编辑状态的store的应用触发
         * @NOTE 用于放大右上角图标
         */
        function mouseoverApp() {
            tools.removeClassName(this.getElementsByClassName("common-header-editIcon")[0], "header-edit-icon-small");
        };
        /**
         * 鼠标移入编辑状态的store的应用
         * @NOTE 用于缩小右上角图标
         */
        function mouseoutApp() {
            tools.addClassName(this.getElementsByClassName("common-header-editIcon")[0], "header-edit-icon-small");
        };
        /**
         * 点击小图标改变应用状态
         * @param event 事件对象
         */
        function editAppState(event) {
            if(event.target.classList[0] === "common-header-editIcon") {
                var appText = event.target.parentNode.getElementsByClassName("store-text")[0].innerText;
                var flag= true;
                for (var i = 0; i < upApps.length; i++) {
                    if(upApps[i].text === appText) {
                        downApps.push(upApps[i]);
                        upApps.splice(i, 1);
                        loadStoreUpApp(true);
                        loadStoreDownApp(true);
                        preventLinkJump();
                        flag = false;
                    }
                }
                // 超过7个置顶应用，禁止添加置顶应用
                if(mirrorUpApps.length >= 7) {
                    return;
                }
                if(flag) {
                    for (var i = 0; i < downApps.length; i++) {
                        if(downApps[i].text === appText) {
                            upApps.push(downApps[i]);
                            downApps.splice(i, 1);
                            loadStoreUpApp(true);
                            loadStoreDownApp(true);
                            preventLinkJump();
                        }
                    }
                }
            }
        };
        /**
         * 退出登录
         * @NOTE 向后台发送会话终止信号并跳转到登录界面
         */
        function loginOut() {
            tools.clearCookie();
            tools.ajax({
                method: "get",
                url: BASIC_BACKEND_URL + "/foundation/loginout",
                callback: function(resq) {
                    window.location.href =BASIC_FRONTEND_URL + "/#/login";
                },
                data: null
            });
        };
        /**
         * 初始化应用展示数据
         */
        function appDataInit() {
            upApps = [];
            mirrorUpApps = upApps;
            downApps = [];
            mirrorDownApps = downApps;
        };
        /**
         * 加载后台数据
         * @param infoURLPart api地址片段
         */
        function loadPersonInfo(infoURLPart) {
            tools.ajax({
                method: "get",
                url: BASIC_BACKEND_URL + infoURLPart,
                callback: function(resq) {
                    if(resq && resq !== "null") {
                        var temp = resq;
                        temp = JSON.parse(temp);

                        appDataInit();
                        // 用户名
                        if(temp.person && temp.person.personname) {
                            document.getElementById("header-info-name").getElementsByTagName("SPAN")[0].innerText = temp.person.personname;
                        }
                        // 企业名
                        if(temp.companyList[0] && temp.companyList[0].name) {
                            document.getElementById("common-header-company-name").innerText = temp.companyList[0].name;
                        }
                        // 是否有消息
                        if(temp.person.haveNewMessage) {
                            document.getElementById("common-header-red-dot").style.display = "inline-block";
                        }else {
                            document.getElementById("common-header-red-dot").style.display = "none";
                        }

                        if(temp.topApp) {
                            for (var i = 0; i < temp.topApp.length; i++) {
                                upApps.push({
                                    text: temp.topApp[i].name,
                                    url: temp.topApp[i].url,
                                    img: ""
                                })
                            }
                        }
                        
                        // 用户自定义了头像使用base64动态加载头像
                        if(temp.person && temp.person.resourceId) {
                            loadAvatar("common-header-profile-picture", temp.person.resourceId);
                        }
                        // 用户自定义了企业logo使用base64动态加载头像
                        if(temp.companyList[0] && temp.companyList[0].resourceId ) {
                            loadAvatar("common-header-brand", temp.companyList[0].resourceId);
                        }
                    }
                    // 加载动态数据到页面
                    loadNavApp();
                },
                data: null
            })
        };
        function loadAvatar(DOMID, resourceId) {
            tools.ajax({
                method: "get",
                url: BASIC_BACKEND_URL + "/foundation/pictureresource/" + resourceId,
                callback: function(resq) {
                    if(resq && resq !== "null") {
                        var temp = JSON.parse(resq);
                        document.getElementById(DOMID).src = "data:" + temp.contentType + ";base64," + temp.content;
                    }
                },
                data: null
            })
        }
    }
})();