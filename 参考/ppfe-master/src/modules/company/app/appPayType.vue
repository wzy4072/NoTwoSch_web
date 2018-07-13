<template>
    <div style="padding:30px;">
        <v-card title='收银台' style="background-color:#fff;">
            <v-row>
                <v-col span="12" class="order-ifo" v-show="appName != null">{{appName}} {{orderInfo.useDay}} 个月使用权</v-col>
                <v-col span="12" class="order-fee">应付金额：<span>￥{{orderInfo.totalFee}}</span></v-col>
            </v-row>
            <v-row class='radio-group'>
                <p>选择支付方式</p>
                <div class="radios">
                    <div class="radi-wrap" :class="{checked:orderInfo.orderType=='BALANCE'}" @click="orderInfo.orderType='BALANCE'">
                        <v-radio v-model="orderInfo.orderType" value="BALANCE" label="BALANCE">余额支付</v-radio>
                    </div>
                    <div class="radi-wrap" :class="{checked:orderInfo.orderType=='PAYMENT'}" @click="orderInfo.orderType='PAYMENT'">
                        <v-radio v-model="orderInfo.orderType" value="PAYMENT" label="PAYMENT">微信付款</v-radio>
                    </div>
                </div>
            </v-row>
            <button class="_btn" @click="createOrder">立即支付</button>
        </v-card>
    </div>

</template>
<script>
    import payapi from '@/api/pay.js';

    export default {
        data() {
            return {
                orderInfo: {
                    body: '应用购买',
                    applicationid: null,
                    paytype: 'WX',
                    totalFee: null,
                    walletId: null,
                    orderType: 'PAYMENT',
                    serviceType: "APPLICATION",
                    behaviorType :'ENTERPRISE',
                    tradeType: 'NATIVE',
                    useDay: null,
                    dateType: null,
                    corporateNum:null,
                },
                appName: null,
                balancce:null,
            }
        },
        created() {
            this.getUrlCode();
            this.getBalancce();
        },
        computed: {
            walletId() {
                return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext.currentCorporate.walletId;
            }
        },
        methods: {
            createOrder() {
                let _this = this;
                if(this.orderInfo.orderType == 'BALANCE' && this.balancce < this.orderInfo.totalFee ){ this.$message.info('您的钱包余额不足，请选择其他方式支付！'); return false; }
             
                this.orderInfo.walletId = this.walletId
                payapi.createOrder(this.orderInfo)
                    .then(resq => {
                        
                        if (resq.success) {
                            this.$message.info('订单生成成功，即将跳转支付界面！');
                            let url = this.orderInfo.orderType  == 'BALANCE' ? '/account/order/payrult/' + resq.result : '/account/order/pay/' + resq.result;
                            setTimeout(function () { _this.$router.push(url) }, 1500);
                        }else{
                            this.$message.error(resq.error, 4);
                        }
                        console.log(resq);
                    })
                    .catch(e => { this.$message.error(e, 4) })
            },
            getUrlCode(){
                let params = eval('(' + decodeURIComponent(this.$route.params.code) + ')');
                    for (let item in params) {
                        if (params.hasOwnProperty(item) && this.orderInfo.hasOwnProperty(item)) { this.orderInfo[item] = params[item] };
                    }
                this.appName = params.appName || null;  
            },
            getBalancce() {
                payapi.getBalancce({ walletId: this.walletId })
                    .then(req => { this.balancce = req; })
                    .catch(message => { this.$message.info('数据请求失败！' + message); });
            },
        },
    }

</script>
<style scoped>
    @import '/static/css/common.css';
    .order-ifo {
        font-size: 18px;
        padding-left: 35px;
        margin-top: 14px;
    }

    .order-fee {
        text-align: right;
        padding-right: 35px;
        font-size: 18px;
    }

    .order-fee span {
        font-size: 32px;
        color: #FF513D;
    }

    .radi-wrap {
        border: 1px solid transparent;
        padding: 12px;
        margin: 12px;
    }
    .radi-wrap:hover{
        cursor:pointer;
    }

    .radi-wrap.checked {
        border: 1px solid #03a1ea;
    }

    .radio-group {

        border: 1px solid #ccc;
        margin: 20px;
    }

    .radio-group>p {
        background: #ccc;
        font-size: 18px;
        line-height: 30px;
        padding: 8px 25px;
    }

    .radio-group .radios {
        padding: 10px;
    }
    ._btn{
        margin-top: 40px;
        margin-bottom: 40px;
    }
</style>