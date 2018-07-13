<template>
    <v-spin :spinning="spinning" tip="处理中">
        <div id="register-content">
            <!-- 注册步骤条-->
            <div class="register-step">
                <div>
                    <img v-show="$router.currentRoute.name === 'registerStep1'" 
                         src="/static/images/root/register_step_1.png" 
                         alt="">
                    <img v-show="$router.currentRoute.name === 'registerStep2'"
                         src="/static/images/root/register_step_2.png" 
                         alt="">
                </div>
                <div class="register-step-text" 
                     v-show="$router.currentRoute.name === 'registerStep1' || $router.currentRoute.name === 'registerStep2'">
                    <p v-bind:class="{ 'register-step-text-1': true, 'on-step': $router.currentRoute.name === 'registerStep1' }">验证手机</p>
                    <p v-bind:class="{ 'register-step-text-2': true, 'on-step': $router.currentRoute.name === 'registerStep2'}">填写信息</p>
                    <p class="register-step-text-3">注册成功</p>
                </div>
            </div>
            <div v-show="$router.currentRoute.name === 'register'"
                 style="padding-bottom: 700px"
                 >加载中，若等待超过5秒，请按F5刷新</div>
            <!-- 注册具体内容-->
            <router-view></router-view>
        </div>
    </v-spin>
</template>

<script>
import api from '@/api/root/register.js';


export default {
    data() {
        return {
            step: 1,
            spinning: false,
        }
    },
    methods: {
        /**
         * 注册会话初始化并传递来源信息
         * @NOTE 1、如果路由要去是注册下面的子路由，不必重新开始一个会话
         *       2、source指来源，形式如register/{source}，用于标识来源(qq、微信等)
         * @param vm vue实例的指针
         * @param to 路由去向
         */
        initSession(vm, to) {
            if(/[123]\/.+/.test(to.path)) {
                return;
            }else {
                var source = /[register]?\/(.*)$/.exec(to.path)[1];
                if(source === "register" || /R_N/.test(source)) {
                    source = "";
                }
                api.registerInit(source)
                    .then(resp => {
                        if(resp.success === true) {
                            vm.$router.push({ name: 'registerStep1', params: { id: resp.result}})
                        }else {
                            vm.$message.error(resp.error, 8);
                        }
                    })
                    .catch(err => {
                        vm.$message.error(err, 8);
                    })

            }
        }
    },
    computed: {
        
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.initSession(vm,to);
        })
    },
    watch: {
        '$route' (to, from) {
            this.initSession(this, to);
        }
    }
}
</script>
<style>
    
    #register-content {
        padding-top: 60px;
        width: 700px;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
    }
    .register-step {
        text-align: center;
        padding-bottom: 60px;
    }
    .register-step-text p {
        display: inline-block;
        font-size: 16px;
        color: #aaa;
    }
    .register-step-text p.on-step{
        color: #666;
    }
    .register-step-text-1 {
        position: relative;
        left: -154px;
    }
    .register-step-text-3 {
        position: relative;
        left: 154px;
    }
    
</style>
