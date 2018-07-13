<template>
    <div id="login-cover">
        <div id="login">
            <v-spin :spinning="spinning" tip="登入中">
                <div class="login-left">
                    <img src="/static/images/root/login_bg.png" alt="">
                </div>
                <div class="login-right">
                    <div v-if="lc == null">
                    <h1>登录</h1>
                    <v-form direction="vertical">
                        <v-form-item label="用户名">
                            <v-input class="login-input" v-model="username" type="text" placeholder="请输入邮箱或手机号" size="large"><v-icon type="link"></v-icon></v-input>
                        </v-form-item>
                        <v-form-item label="密码">
                            <v-input class="login-input" v-model="password" type="password" placeholder="请输入密码" size="large"></v-input>
                        </v-form-item>
                        <div>
                            <router-link to="/resetpassword" class="root-router">忘记密码？</router-link>
                        </div>
                        <v-form-item>
                            <v-button class="login-btn" type="primary" html-type="submit" @click.prevent="login">登&nbsp;&nbsp;&nbsp;录</v-button>
                        </v-form-item>
                    </v-form>
                    </div>
                    <div v-else>
                        <h1>您已经登入云报关</h1>
                        <h1><a href="/company/">立即进入</a></h1>
                    </div>
                </div>
            </v-spin>
        </div>
        <div class="login-footer"></div>
    </div>

</template>

<style>
    #login-cover {
        height: 605px;
        background-color: #acd6f3;
    }
    #login{
        margin: auto;
        position: absolute;
        width: 1004px;
        height: 421px;
        top: 162px;
        left: 50%;
        z-index: 10;
        transform: translate(-50%, 0);
    }
    #login .login-left {
        position: relative;
        float: left;
        width: 565px;
        height: 412px;
        z-index: 10;
    }
    #login .login-right {
        position: relative;
        float: right;
        background-color: #fff;
        width: 414px;
        height: 420px;
        padding:28px 32px 0 32px;
        z-index: 10;
    }
    #login .login-right h1 {
        margin-top: 10px;
        margin-bottom: 30px;
        text-align: center;
    }
    #login .login-btn {
        width: 350px;
        height: 50px;
        margin-top: 20px;
        background-color: #00aee0;
        font-size: 22px;
    }
    #login .login-input {
        height: 42px;
        font-size: 15px;
    }
    #login-cover .login-footer {
        position: relative;
        bottom: -457px;
        left: 0;
        background-image: url(/static/images/root/login_bottom.png);
        width: 100%;
        height: 148px;
        z-index: 1;
        background-size: cover;
        background-position: center center;
    }
</style>

<script>

export default {
    data() {
        return {
            lc: null,
            spinning: false,
            username: null,
            password: null,
        }
    },
    methods: {
        login() {
            if(this.username == null || this.password == null || this.password.length < 4) {
                this.$message.error("用户名或密码不符要求");
                return;
            }
            this.spinning = true;
            this.$store.dispatch('login', { username: this.username, password: this.password })
                .then(resp => {
                    this.spinning = false;
                    if(resp.success) {
                        if(resp.result.isInitLogin == 0){
                            window.location = './company/#/initpassword';
                            return;
                        }
                        if(this.$route.params.code){
                            window.location = './company/#/userinfo/'+this.$route.params.code;
                            return;
                        }
                        if(resp.result.locationUrl==null||resp.result.locationUrl==''){
                            window.location = './company/';
                            return;
                        }
                        
                        window.location = resp.result.locationUrl;
                    }else {
                        this.$message.error(resp.error);
                    }

                }).catch(message => {
                    this.spinning = false;
                    this.$message.error(message);
                });
        }
    },
    created: function() {
        if(document.body.clientWidth <= 500) {
            this.$message.error("您可能使用移动端访问本站,请您使用电脑端登录系统", 5);
        }
        this.$store.dispatch('reloadContext').then(ctx => {
            this.lc = ctx;
        })
    }
}
</script>
