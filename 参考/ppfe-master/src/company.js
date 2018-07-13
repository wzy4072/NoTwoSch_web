import Vue from 'vue'
import VueRouter from 'vue-router'
import VueBeauty from 'vue-beauty'
import company from './Company.vue'
import routes1 from './navigations/company/routes.js'
import routeData from './navigations/company/routeData.js'
import store from './store'
import webSocket from './api/company/webSocket'

Vue.use(VueRouter);
Vue.use(VueBeauty);


store.dispatch('reloadContext')
    .then(ctx => {
        var trueRoutes = editRouter(routes1.routes, ctx.modules);
        
        const router = new VueRouter({
            routes: trueRoutes
        });
    
        router.beforeEach((to, from, next) => {
            document.title = to.meta.title;
            next();
        });

        // webSocket消息监听
        // webSocket.wsMonitor(store ,"ws://localhost:8181", "test");
        
        new Vue({
            el: '#company',
            store,
            render: h => h(company),
            router: router
        })
    })
    .catch(error => {
        let urlArr = window.location.href.split('/');
        let urlLen = urlArr.length;
        if(urlArr[urlLen -2] =='userinfo' && urlArr[urlLen -1] !=''){
            window.location = '/#/login/'+ urlArr[urlLen -1];
            return ;
        }
        window.location = '/';
    });

/**
 * 路由数据解析对象
 * @type {{getter 获取, calculate 计算}}
 */
var resolveData = (function() {
    var result = [];
    return {
        getter: function() {
            return result;
        },
        calculate: function(source) {
            var arr = source.slice(0);
            for (var i = 0; i < arr.length; i++) {
                if(!arr[i].isRoot) {
                    result.push(arr[i].code)
                }else {
                    this.calculate(arr[i].children)
                }
            }
            return this;
        }
    }
})();

/**
 * 路由编辑
 * @param routes 所有路由
 * @param powers 权限数据
 * @returns {*} 控制后的路由
 */
function editRouter(routes, powers) {
    var frontendMap = routeData.frontendMap;
    var powerMap = routeData.powerMap;
    var backendData = JSON.parse(JSON.stringify(powers));
    var passCodeArr = resolveData.calculate(backendData).getter();
    
    for (var i = 0; i < passCodeArr.length; i++) {
        var router = powerMap[passCodeArr[i]];
        if(router !== undefined) {
            powerMap[passCodeArr[i]] = true;
        }
    }
    
    for(var key in powerMap) {
        for (var i = 0; i < routes.length; i++) {
            if(frontendMap[key].name === routes[i].name && !powerMap[key] ) {
                routes.splice(i,1);
            }
        }
    }
    return routes;
}


