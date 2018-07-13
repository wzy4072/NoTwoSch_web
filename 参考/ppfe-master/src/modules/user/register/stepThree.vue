<template>
    <div id="register-success">
        <div class="main">
            <div class="success-img-box">
                <img src="static/images/root/register_success.png" alt="">
            </div>
            <p class="success-title">注册成功!</p>
            <div class="success-main">
                <p class="success-p"><span class="success-dot"></span> 您注册的手机号码为登录云报关平台的第一默认账号。</p>
                <p class="success-p"><span class="success-dot"></span> 若进入您的邮箱验证后，邮箱号码也可作为账号登陆云报关。</p>
            </div>
            <div class="success-text"><span>{{ count }}</span>秒钟后自动跳转到平台首页 <a href="/company/#/home" style="color: #00aee0">点此跳转></a></div>
        </div>
    </div>
</template>

<script>
//import api from '@/api/root/register.js';

export default {
    data() {
        return {
            count: 10,
            timer: ""
        }
    },
    created() {
        this.timer = setInterval(this.goTologin, 1000);
        
    },
    methods: {
        goTologin() {
            this.count--;

            if(this.count === 0) {
                clearInterval(this.timer);
                window.location.href = "/company/#/home"
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
    #register-success .main {
        text-align: center;
    }
    #register-success .success-img-box {
        padding-bottom: 25px;
    }
    #register-success .success-title {
        font-size: 28px;
        color: #00aee0;
        padding-bottom: 20px;
    }
    #register-success .success-text {
        position: relative;
        left: -30px;
        font-size: 16px;
        color: #999;
    }
    #register-success .success-main {
        text-align: left;
        padding-bottom: 20px;
    }
    #register-success .success-p {
        position: relative;
        left: 168px;
        font-size: 16px;
        color: #666;
    }
    #register-success .success-dot {
        position: relative;
        top: -4px;
        display: inline-block;
        border: 2px solid #00aee0;
        border-radius: 50%;
    }
</style>
