<template>
    <div id="reset-password" style="padding-bottom: 20px;padding-top: 100px">
        <v-spin :spinning="spinning" tip="处理中">
            <div class="reset-step-box">
                <!--<p>{{ $router.currentRoute.name }}</p>-->
                <div class="reset-step">
                    <div>
                        <img v-show="$router.currentRoute.name === 'resetStepOne'"
                             src="/static/images/root/register_step_1.png"
                             alt="">
                        <img v-show="$router.currentRoute.name === 'resetStepTwo'"
                             src="/static/images/root/register_step_2.png"
                             alt="">
                    </div>
                    <div class="reset-step-text"
                         v-show="$router.currentRoute.name === 'resetStepOne' || $router.currentRoute.name === 'resetStepTwo'">
                        <p v-bind:class="{ 'reset-step-text-1': true, 'on-step': $router.currentRoute.name === 'resetStepOne' }">验证</p>
                        <p v-bind:class="{ 'reset-step-text-2': true, 'on-step': $router.currentRoute.name === 'resetStepTwo'}">重设</p>
                        <p class="reset-step-text-3">完成</p>
                    </div>
                </div>
            </div>
            <div v-show="$router.currentRoute.name === 'resetpassword'"
                 style="padding-bottom: 300px"
            >加载中，若等待超过5秒，请按F5刷新</div>
            <router-view></router-view>
        </v-spin>
    </div>
</template>

<script>
    import api from '@/api/root/password';

    export default {
        data() {
            return {
                step: 1,
                spinning: false,
            }
        },
        methods: {
            initSession(vm, to) {
                var fromEmail = /\/step2\/([\w-]+)/.exec(to.path);
                
                if(fromEmail) {
                    vm.$router.push({ name: 'resetStepTwo', params: { id: fromEmail[1]}})
                    return;
                }else if (/step[123]\/.+/.test(to.path)) {
                    return;
                }else {
                    this.spinning = true;
                    api.resetInit()
                        .then(resp => {
                            this.spinning = false;
                            if(resp.success === true) {
                                vm.$router.push({ name: 'resetStepOne', params: { id: resp.result}})
                            }else {
                                vm.$message.error(resp.error, 8);
                            }
                        })
                        .catch(err => {
                            this.spinning = false;
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
   
    .reset-step {
        text-align: center;
        padding-bottom: 60px;
    }
    .reset-step-text p {
        display: inline-block;
        font-size: 16px;
        color: #aaa;
    }
    .reset-step-text p.on-step{
        color: #666;
    }
    .reset-step-text-1 {
        position: relative;
        left: -154px;
    }
    .reset-step-text-3 {
        position: relative;
        left: 154px;
    }
    
    
</style>