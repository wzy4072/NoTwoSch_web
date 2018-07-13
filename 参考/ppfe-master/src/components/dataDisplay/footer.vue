<template>
    <div id="footer">
        <ul>
            <li class="section-1">
                <h3 class="title"><span>产品与服务</span></h3>
                <p><a href="http://www.yunbaoguan.cn/home/goods.html">产品</a></p>
                <p><a href="http://www.yunbaoguan.cn/home/service.html">服务</a></p>
                <p><a href="http://www.yunbaoguan.cn/home/advisory.html">顾问</a></p>
                <p><a href="http://www.yunbaoguan.cn/home/plugin.html">插件</a></p>
            </li>
            <span class="line fl"></span>
            <li class="section-2">
                <h3 class="title"><span>教程和帮助</span></h3>
                <p><a href="http://www.yunbaoguan.cn/home/guide.html">入门指南</a></p>
                <p><a href="http://www.yunbaoguan.cn/Yunbaike/HSsearch.html">查询</a></p>
            </li>
            <span class="line fl"></span>
            <li class="section-3">
                <h3 class="title"><span>公司介绍</span></h3>
                <p><a href="http://www.yunbaoguan.cn/about/index.html">关于我们</a></p>
                <p><a href="http://www.yunbaoguan.cn/about/hr.html">加入我们</a></p>
                <p><a href="http://www.yunbaoguan.cn/home/friends.html">合作伙伴</a></p>
            </li>
            <span class="line fl"></span>
            <li class="section-4">
                <h3 class="title"><span>在线交流</span></h3>
                <div class="main">
                    <p><img src="/static/images/root/footer/tel.png" alt=""> 0755-82837000-555</p>
                    <p><img src="/static/images/root/footer/mail.png" alt=""> service@yunbaoguan.cn</p>
                    <p><img src="/static/images/root/footer/QQ.png" alt=""> 2108396994</p>
                </div>
            </li>
            <li class="section-5">
                <div class="main">
                    <img class="weixin" src="/static/images/root/footer/weixin.png" alt="">
                    <img src="/static/images/root/footer/customerService.png" alt="">
                </div>
            </li>
        </ul>
        <div class="ownInfo"><span>Copyright © 深圳市慧通关网络科技有限公司 <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备13061315号</a></span>
            (Build: {{buildNumber}})
        </div>
        
    </div>
</template>
<script>
    export default {
        
        data() {
            return {
            }
        },
        created() {

        },
        methods: {
            
        },
        computed: {
            buildNumber() {
                return window['BUILD_NUMBER'];
            }
        },
    }

</script>
<style scoped>
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    #footer {
        height: 245px;
        /*overflow: hidden;*/
        background-color: #373d41;
        color: #bbb;
        padding-top: 27px;
    }
    #footer ul {
        width: 1100px;
        height: 157px !important;
        position: relative;
        left: 50%;
        margin-left: -550px;
        margin-bottom: 30px;
    }
    #footer li {
        float: left;
        margin-right: 40px;
        margin-left: 40px;
    }
    #footer h3 {
        text-align: center;
        margin: 0;
        padding-bottom: 20px;
        color: #ddd;
    }
    #footer .line {
        display: inline-block;
        position: relative;
        top: 47px;
        height: 107px;
        border-right: 1px solid #60666a;
    }
    #footer li p {
        margin-bottom: 8px;
        letter-spacing: 1px;
    }
    #footer h3 span {
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2px;
        padding-bottom: 5px;
    }
    #footer p {
        text-align: center;
    }
    #footer a{
        color: #bbb;
    }
    #footer a:hover {
        color: #56d9ff;
        padding-bottom: 4px;
        border-bottom: 1px solid #56d9ff;
    }

    #footer .section-4 p {
        text-align: left;
    }
    #footer .section-4 h3 span {
        position: relative;
        left: -20px;
    }
    #footer .section-4 h3 {
        text-align: center;
    }
    #footer .section-4 img {
        margin-right: 3px;
    }
    #footer .section-5 {
        margin-left: 20px;
    }
    #footer .section-5 .main {
        padding-top: 30px;
    }
    #footer .section-5 .weixin {
        margin-right: 12px;
    }
    #footer .ownInfo {
        text-align: center;
        color: #fff;
    }
    #footer .ownInfo a {
        color: #fff;
    }
</style>
