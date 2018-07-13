<template>
    <div id="home-guide">
        <v-card title="平台初始化操作指引">
            <v-row :gutter ="10">
                <v-col :span="8">
                    <div class="guide-left">
                        <img src="/static/images/home/guide-1.png" alt="">
                    </div>
                    <div class="guide-right">
                        <h3>第一步</h3>
                        <p class="guide-text">选择开通 <br>平台软件</p>
                        <v-button class="guide-btn" 
                                  type="error" 
                                  @click="goToListing">开通服务</v-button>
                    </div>
                    <img class="guide-arrow arrow-1" src="/static/images/home/guide-arrow.png" alt="">
                </v-col>
                <v-col :span="8">
                    <div class="guide-left">
                        <img src="/static/images/home/guide-2.png" alt="">
                    </div>
                    <div class="guide-right">
                        <h3>第二步</h3>
                        <p class="guide-text">添加员工 <br>匹配权限</p>
                        <v-button class="guide-btn" 
                                  type="error"
                                  @click="goToStaff">去操作</v-button>
                    </div>
                    <img class="guide-arrow arrow-2" src="/static/images/home/guide-arrow.png" alt="">
                </v-col>
                <v-col :span="8">
                    <div class="guide-left">
                        <img src="/static/images/home/guide-3.png" alt="">
                    </div>
                    <div class="guide-right">
                        <h3>第三步</h3>
                        <p class="guide-text">点击侧面 <br>所需软件</p>
                        <v-button class="guide-btn"
                                  type="error"
                                  @click="goToApp">开始工作</v-button>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </div>
    
</template>

<script>
    export default {
        name: "home-guide",
        data() {
            return {
                
            }
        },
        methods: {
            goToListing() {
                this.$router.push({ path: '/goods/listing' })
            },
            goToStaff() {
                this.$router.push({ path: '/account/staff' })
            },
            /**
             * 临时方法，借道左侧菜单获取链接
             */
            goToApp() {
                var appsLink = {
                    from: null,
                    road: null,
                    length: 0
                }
                var modules = this.$store.getters.loginContext.modules;
                for (var i = 0; i < modules.length; i++) {
                    if(modules[i].icon === "from") {
                        appsLink.from = modules[i].outerLink;
                        appsLink.length++;
                    }
                    if(modules[i].icon === "road") {
                        appsLink.road = modules[i].outerLink;
                        appsLink.length++;
                    }
                }
                console.log(appsLink);
                if(appsLink.length === 0) {
                    return;
                }else if(appsLink.length === 1) {
                    window.location.href = appsLink.from==null ? appsLink.road : appsLink.from;
                }else {
                    // 有CMS时，优先进入CMS
                    window.location.href =  appsLink.from;
                }
                
            }
        }
    }
</script>

<style scoped>
    .guide-right, .guide-left {
        float: left;
    }
    .guide-right {
        padding-left: 30px;
    }
    h3 {
        height: 41px;
        color: #333;
        font-size: 22px;
    }
    .guide-text {
        width: 100px;
        color: #bbb;
        font-weight: bold;
        font-size: 18px;
        padding-bottom: 6px;
    }
    .guide-btn {
        font-size: 14px;
        padding: 0 10px;
    }
    .guide-arrow {
        position: absolute;
        top: 45px;
        left: 300px;
    }
</style>