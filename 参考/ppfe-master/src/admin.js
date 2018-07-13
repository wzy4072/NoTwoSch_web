import Vue from 'vue'
import VueRouter from 'vue-router'
import VueBeauty from 'vue-beauty'
import Admin from './Admin.vue'
import routes from './navigations/admin/routes.js'
import api from '@/api/admin/common';


//import css
// import 'vue-beauty/package/style/vue-beauty.min.css'

Vue.use(VueRouter)
Vue.use(VueBeauty)


const router = new VueRouter({
  routes: routes.routes
})

new Vue({
    el: '#admin',
    render: h => h(Admin),
    router: router,
    watch:{
        "$route" : 'checkLogin'
    },
    methods:{
        checkLogin(){
            if(this.$router.currentRoute.path === "/login") {
                return
            }
            api.checkLogin()
                .then(resp => {})
                .catch(e => {
                    if(e.status === 401) { 
                        this.$router.push("/login");
                    }else if(e.data){ // 能获取到状态值的其他情况
                        this.$message.error(e.data, 4);
                    }else { // 网络连接失败的情况
                        this.$message.error(e, 4);
                    }
                })
        }
    },
    created: function () {
        this.$message.config({ top: 118,  duration: 3 });
    }
})

