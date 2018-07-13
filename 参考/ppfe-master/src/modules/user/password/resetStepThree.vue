<template>
    <div id="register-success">
        <div class="success-img-box">
            <img src="static/images/root/register_success.png" alt="">
        </div>
        <p class="success-title">密码修改成功!</p>
        <div class="success-text"><span>{{ count }}</span>秒钟后自动跳转至登录页面 <a href="/" style="color: #00aee0">点此跳转></a></div>
    </div>
</template>

<script>
    
    export default {
        data() {
            return {
                count: 5,
                timer: ""
            }
        },
        created() {
            this.timer = setInterval(this.goToLogin, 1000);

        },
        methods: {
            goToLogin() {
                this.count--;

                if(this.count === 0) {
                    clearInterval(this.timer);
                    window.location.href = "/"
                }
            }
        },
        computed: {

        },
    }
</script>
<style>
    #register-success {
        text-align: center;
        padding-bottom: 160px;
    }
    .success-img-box {
        padding-bottom: 25px;
    }
    .success-title {
        font-size: 28px;
        color: #00aee0;
        padding-bottom: 20px;
    }
    .success-text {
        font-size: 16px;
        color: #999;
    }
</style>
