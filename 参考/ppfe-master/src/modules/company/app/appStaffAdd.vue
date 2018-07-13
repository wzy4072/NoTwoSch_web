<template>
    <div id="member">
        <!-- 头部 -->
        <v-row>
            <v-col span="6">
                <div style="background:#fff;padding:20px 0 0 20px;height:288px;    border-radius: 300px 0 0 300px;">
                    <head-avatar :id="loginContext==null ? null : loginContext.person.avatar" :name="loginContext==null ? null : loginContext.person.username"></head-avatar>
                </div>
            </v-col>
            <v-col span="11">
                <head-com :appList="appList" :isPending="isPending"></head-com>
            </v-col>
            <v-col span="7">
                <head-balance :balance="balance"></head-balance>
            </v-col>
        </v-row>
        <br/>
        <!-- 单价介绍 -->
        <v-card title="增加用户：">
            <v-row class="goods-par">
                <p class="goods-tit"> 选购信息：</p>
            </v-row>
            <v-row class="goods-par">
                <span>人数选择</span>
                <div class="slfbt-wrap">
                    <button @click="changePeNo('-5')" class="self-bts numbt bt-m">-</button><span class="self-bts numbt bt-msg"> {{orderInfo.corporateNum}}</span><button @click="changePeNo('5')" class="self-bts numbt bt-p">+</button>
                </div><span>以5的倍数增加</span>
            </v-row>

            <v-row class="goods-par price">
                <span>总 价 格</span><strong style="color:#FF513D;">￥{{(orderInfo.corporateNum-appUseNum)*20}}</strong>
            </v-row>

            <v-row class="goods-par">
                <button class="_btn" @click="choseOrderType" :disabled="haveRead==1">立即购买</button>
            </v-row>

            <v-row>
                <v-checkbox v-model="haveRead" :true-value="0" :false-value="1">已阅读并同意签署 <router-link to="/***">《企业版服务协议》</router-link> </v-checkbox>
            </v-row>
        </v-card>
    </div>
</template>
<script>
    import payapi from '@/api/pay.js';
    import headAvatar from '@/components/dataDisplay/headAvatar.vue'
    import headBalance from '@/components/dataDisplay/headBalance.vue'
    import headComInfo from '@/components/dataDisplay/headComInfo.vue'

    export default {
        components: {
            'headBalance': headBalance,
            'headAvatar': headAvatar,
            'headCom': headComInfo
        },
        data() {
            return {
                appList: { "applications": [], "other": [] },
                isPending: null,
                balance: null,
                haveRead:0,
                orderInfo: {
                    body: '应用人数添加',
                    serviceType: "INCREMENTAL",
                    corporateNum:5,
                },
                appUseNum:null,

            }
        },
        computed: {
            loginContext() {
                return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext;
            },
        },
        created() {
            this.getBalancce();
            this.getAppList();
            this.isPending = this.loginContext.currentCorporate.isPending == 'Authentication_Pass' ? '已认证' : '未认证';
            //获取 已购买应用的人数 ，只能累加 不能少于 
            this.appUseNum = this.loginContext.currentCorporate.useNum;
            this.orderInfo.corporateNum = this.loginContext.currentCorporate.useNum;
        },
        methods: {
            choseOrderType() {

                const code = `{
                    body: '应用人数添加',
                    applicationid:${this.$route.params.id},
                    serviceType: "INCREMENTAL",
                    corporateNum: ${this.orderInfo.corporateNum},
                    // totalFee: ${(this.orderInfo.corporateNum-this.appUseNum)*20},
                    totalFee:0.01}`;
                this.$router.push('/apps/ordertype/' + encodeURIComponent(code));
            },
            changePeNo(num) {
                if (this.orderInfo.corporateNum <= this.appUseNum  && num == '-5') { return false; }
                this.orderInfo.corporateNum += parseInt(num);
            },
            getBalancce() {
                if(this.loginContext.currentCorporate.walletId == null ){return false;}
                payapi.getBalancce({ walletId: this.loginContext.currentCorporate.walletId })
                    .then(req => { this.balance = req; })
                    .catch(message => { this.$message.info('数据请求失败！' + message); });
            },
            getAppList() {
                payapi.getAppList(this.loginContext.currentCorporate.id)
                    .then(res => { this.appList = res; })
                    .catch(e => { this.$message.error(e, 4) })
            },
        },
    }
</script>
<style>
    @import '/static/css/common.css';
    #member {
        padding: 30px;
    }
        .goods-par {
            margin: 12px 0;
        }
    
        .goods-par .goods-tit {
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            padding-left: 8px;
            background-color: #FEF0ED;
        }
    
        .goods-par>span {
            margin: 0 14px;
        }
    
        .goods-par.price>strong {
            font-size: 26px;
        }
    
        .slfbt-wrap {
            display: inline-block;
        }
    
        .self-bts {
            height: 32px;
            line-height: 32px;
            border: 1px solid #ccc;
        }
    
        .numbt {
            width: 32px;
            text-align: center;
            background: #fff;
            display: inline-block;
            font-size: 16px;
        }
    
        .numbt.bt-msg {
            width: 100px;
            border-left: none;
            border-right: none;
        }
    
        .selec {
            width: 164px;
            font-size: 14px
        }
    
        .goods-par ._btn {
            margin: 20px 12px;
        }

</style>