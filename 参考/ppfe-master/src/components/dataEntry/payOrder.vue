<template>
    <div  id="pay">
        <div style="background-color:#fff;">
                <v-row class="com-logo">
                    <img  src="\static\images\home\defaultlogo.png" alt="">
                    <!-- <h1  >收银台</h1> -->
                </v-row>
            <v-row class="order-info">
                <v-col span="12" class="order-msg">
                   <p>商品类型：{{orderInfo.body}}</p>

                    <!-- <p>订单编号：{{orderInfo.outTradeNo}}</p>
                    <p>订单类型：{{orderInfo.orderType}}</p>
                    <p>下单日期：{{orderInfo.date}}</p>
                    <p>其他{{orderInfo.details}}</p>
                    <p>付款状态：{{payResault ? '已付款' :'尚未付款'}}</p> -->
                    <p class="out-po">订单金额：<span style="color:#f04134;">{{orderInfo.totalFee}}</span></p>
                </v-col>
            </v-row>
            <v-row  class="com-logo">
                    <v-col span="8" class="imgs">
                        <img style="width:30%;" src="\static\images\home\pay_logo.png" alt="">
                    </v-col>
                    <v-col span="8" class="imgs pay-img">
                        <div id="paycode" style="text-align:center;">
                            <!-- 这里插入二维码 -->
                        </div>
                        <img src="\static\images\home\pay_descrip.png" alt="">
                    </v-col>
                </v-row>
            <!-- <v-row>
                <v-tabs active-tab-key="key1">
                    <v-tab-pane tab-key="key1" tab="微信支付" class="tab tab1">
                       
                    </v-tab-pane>
                    <v-tab-pane tab-key="key2" tab="储蓄卡" class="tab tab2">
                        <h1>努力施工中。。。</h1>
                    </v-tab-pane>
                    <v-tab-pane tab-key="key3" tab="信用卡" class="tab tab3">
                        <h1>努力施工中。。。</h1>
                    </v-tab-pane>
                    <v-tab-pane tab-key="key3" tab="第三方支付" class="tab tab4">
                        <h1>努力施工中。。。</h1>
                    </v-tab-pane>

                </v-tabs>
            </v-row> -->


        </div>
    </div>
</template>

<script>
    //付款链接
    //未付款 订单信息

    import payapi from '@/api/pay.js'
    import QRCode from "arale-qrcode"

    export default {
        props: ['orderInfo', 'payUrl','payResault'],

        data() {
            return {
            }
        },
        watch: {
            payUrl(val) {
                if (val != null) { this.setPayImg(val) }
            }
        },
        methods: {
            setPayImg(val) {
                let qrcode = new QRCode({
                    text: val,
                    width: 300,
                    height: 300,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                });
                document.getElementById('paycode').appendChild(qrcode);
            }
        }
    }
</script>
<style scoped>
    #pay{
        padding:30px;
    }
    .com-logo{
        padding:30px 60px;
    }
    #pay .order-info{
        background-color: #f5f5f5;
        margin:20px 0; 
        padding:0 35px;
    }
    .order-msg {
        padding: 30px;
    }

    .order-msg p {
        font-size: 16px;
        margin: 8px 0;
        text-align: left;
    }

    .order-msg .out-po {
        font-size: 28px;
        font-weight: 800px;
    }

    .tab {
        padding: 30px;
    }

    .tab.tab1 img {
        display: block;
        margin: 0 auto;
    }

    
    div.pay-img.imgs>img{
        display: block;
        width:256px;
        margin: 0 auto;
        
        margin-top: 12px;
    }
</style>