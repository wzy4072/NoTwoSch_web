<template>
    <div id="home-app">
        <v-card title="常用服务快速入口">
            <v-row :gutter ="10">
                <v-col :span="8">
                    <div class="app-img-box">
                        <img src="/static/images/home/app-1.png" alt="">
                    </div>
                    <p class="app-text">报关申报管理软件</p>
                    <v-button class="app-btn" 
                              type="error" 
                              @click="entry('CMS')">进&nbsp;&nbsp;入</v-button>
                </v-col>
                <v-col :span="8">
                    <div class="app-img-box">
                        <img src="/static/images/home/app-2.png" alt="">
                    </div>
                    <p class="app-text">委托报关管理软件</p>
                    <v-button class="app-btn" 
                              type="error" 
                              @click="entry('CMS-Client')">进&nbsp;&nbsp;入</v-button>
                </v-col>
                <v-col :span="8">
                    <div class="app-img-box">
                        <img src="/static/images/home/app-3.png" alt="">
                    </div>
                    <p class="app-text">公路舱单申报</p>
                    <v-button class="app-btn" 
                              type="error" 
                              @click="entry('ROAD')">进&nbsp;&nbsp;入</v-button>
                </v-col>
            </v-row>
        </v-card>
        <v-modal title="没有该应用或没有权限"
                 :visible="noAppVisible"
                 @ok="noAppOk"
                 @cancel="noAppCancel">
            <p style="font-size: 18px">您尚未开通该应用，是否去开通？</p>
            <br>
            <p>已经购买该应用？请前往"系统设置"——"员工设置"中匹配权限</p>
        </v-modal>
    </div>
    
</template>

<script>
    export default {
        name: "home-app",
        data() {
            return {
                purchasedProducts: [],
                noAppVisible: false,
                clickedAppCode: null,
                purchasedProductsLink: {}
            }
        },
        methods: {
            entry(appCode) {
                if(this.isPurchasedApp(appCode)) {
                    window.location.href = this.purchasedProductsLink[appCode];
                }else {
                    this.clickedAppCode = appCode;
                    this.noAppVisible = true;
                }
            },
            noAppOk() {
                this.noAppVisible = false;
                var vm = this;
                setTimeout(function() {
                    vm.$router.push({ path: '/goods/listing/'+vm.clickedAppCode })
                }, 0)
            },
            noAppCancel() {
                this.noAppVisible = false;
            },
            isPurchasedApp(appCode) {
                var flag = false;
                for (var i = 0; i < this.purchasedProducts.length; i++) {
                    if(appCode === this.purchasedProducts[i]){
                        flag = true
                    }
                }
                return flag;
            },
            getState() {
                return this.$store.getters.getPurchasedProducts;
            },
            renewState(alreadyGoods) {
                for(var i = 0;i < alreadyGoods.length; i++) {
                    this.purchasedProducts.push(alreadyGoods[i].code);
                }
            },
            /**
             * 获取链接
             * @NOTE 临时方法，借道左侧菜单获取
             */
            writeProductsLink() {
                var modules = this.$store.getters.loginContext.modules;
                for (var i = 0; i < modules.length; i++) {
                    if(modules[i].icon === "from") {
                        this.purchasedProductsLink.CMS = modules[i].outerLink;
                        this.purchasedProductsLink["CMS-Client"] = modules[i].outerLink;
                    }
                    if(modules[i].icon === "road") {
                        this.purchasedProductsLink.ROAD = modules[i].outerLink;
                    }
                }
            }
        },
        created() {
            this.renewState(this.getState());
            this.writeProductsLink();
        }
    }
</script>

<style scoped>
    #home-app {
        text-align: center;
    }
    .app-text {
        color: #333;
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 10px;
    }
    .app-btn {
        font-size: 14px;
        width: 72px;
        height: 32px;
    }
    .app-img-box {
        height: 170px;
    }
</style>