<template>
    <div style="padding:30px 50px;" id="goods-pay">
        <v-spin :spinning="spinning">
            <v-card title="支付">
                <h3>订单信息</h3>
                <order-info :orderInfo="orderInfo"></order-info>
                <div v-if="orderInfo.price !== 0">
                    <h3>支付方式</h3>
                    <div class="pay-way">
                        <div class="wenxin pay-way-section">
                            <img src="/static/images/goods/weixin_pay.png" alt="">
                            <span>微信支付</span>
                        </div>
                    </div>
                </div>
                
                <div class="pay-sure">
                    <div class="main">
                        <div v-if="orderInfo.dctPrice">
                            <p class="discount-label" >
                                原方案剩余时长抵现金额：
                            </p>
                            <p class="discount-number">
                                ￥{{orderInfo.dctPrice}}
                            </p>
                        </div>
                        <div v-if="orderInfo.price !== 0">
                            <p v-bind:class="{'label-less': !orderInfo.dctPrice,'label': true}">
                                应付金额：
                            </p>
                            <p class="money-number">
                                ￥{{orderInfo.price}}
                            </p>
                        </div>
                    </div>
                    <div class="submit">
                        <v-button type="primary"
                                  @click="surePay"
                                  class="sure-button"
                                  size="large">{{orderInfo.price === 0 ? "确认开通" : "确认付款"}}</v-button>
                        <p>如需申请发票，更多发票相关问题，请 <a href="javascript:;">点击查看</a></p>
                    </div>
                </div>
            </v-card>
        </v-spin>
        <v-modal :title="orderInfo.price === 0 ? ' ' : '扫码支付'"
                 :maskClosable="maskClosable"
                 @ok="weixinOk"
                 @cancel="weixinCancel"
                 :visible="weixinVisible">
            <div class="weixinQRcode"
                 v-show="!paySuccess"
            >
                <h5>支付金额</h5>
                <h4>￥ {{orderInfo.price}}</h4>
                <v-spin :spinning="QRspinning">
                    <div id="imgBox"></div>
                </v-spin>
                <p>请使用微信扫码支付</p>
            </div>
            <div v-show="paySuccess" class="pay-success">
                <v-icon class="success-icon" type="check-circle"></v-icon>
                <p>{{orderInfo.price === 0 ? "开通成功" : "支付成功"}}</p>
            </div>
            <div slot="footer" v-show="paySuccess">
                <v-button key="confirm"
                          type="primary"
                          size="large"
                          @click="weixinOk">
                    确 定
                </v-button>
            </div>
        </v-modal>
    </div>
</template>

<script>
    import api from "@/api/company/goods.js";
    import QRCode from "arale-qrcode"
    import orderInfo from "@/components/dataDisplay/orderViewInfo.vue";
    
    export default {
        props:["info"],
        components: {
            orderInfo: orderInfo
        },
        data() {
            return {
                spinning: false,
                QRspinning: false,
                maskClosable:false,
                weixinVisible: false,
                orderInfo: {},
                payPramas: {},
                QRcodeURL: "",
                paySuccess: false,
                orderID: "",
                timer: "",
            }
        },
        computed: {
            
        },
        methods: {
            
            surePay() {
                this.spinning = true;
                api.getOrder({
                    order: {
                        code: this.orderInfo.code,
                        variationCode: this.orderInfo.variationCode,
                        saleUnit: this.orderInfo.saleUnit,
                        qty: this.orderInfo.qty,
                        type: this.orderInfo.type,
                        behavior: "ENTERPRISE",
                        currency: "CNY"
                    },
                    type: "WX"
                })
                    .then(resp => {
                        this.spinning = false;
                        if (resp.success) {
                            var result = JSON.parse(JSON.stringify(resp.result));
                            if(result.ignorePay) {
                                this.weixinVisible = true;
                                this.paySuccess = true;
                                return
                            }
                            this.QRcodeURL = result.qrUrl;
                            this.orderID = result.orderId;
                            this.weixinVisible = true;
                            this.QRspinning = true;
                            var vm = this;
                            setTimeout(function() {
                                try{
                                    vm.setPayImg(this.QRcodeURL);
                                    vm.QRspinning = false;
                                }catch(e) {
                                    
                                }
                            },600);
                            this.pollSuccess();
                        } else {
                            this.$message.error(resp.error );
                        }
                    })
                    .catch(err => {
                        this.spinning = false;
                        this.$message.error(err );
                    });
                
            },
            weixinOk() {
                this.weixinVisible = false;
                this.$router.push("/goods/listing");
                document.getElementById('imgBox').innerHTML = "";
            },
            weixinCancel() {
                this.weixinVisible = false;
                clearInterval(this.timer);
                document.getElementById('imgBox').innerHTML = "";
            },
            pollSuccess() {
                var vm = this;
                this.timer = setInterval(function() {
                    if(document.getElementById('imgBox') && 
                        document.getElementById('imgBox').getElementsByTagName("CANVAS").length === 0) {
                        vm.setPayImg(vm.QRcodeURL);
                        vm.QRspinning = false;
                    }
                    api.pollSuccessState(vm.orderID)
                        .then(resp => {
                            if (resp) {
                                document.getElementById('imgBox').innerHTML = "";
                                vm.paySuccess = true;
                                clearInterval(vm.timer);
                            }
                        })
                        .catch(err => {
                            this.$message.error(err, 4);
                        });
                }, 1000)
            },
            setPayImg(val) {
                let qrcode = new QRCode({
                    text: val,
                    width: 300,
                    height: 300,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                });
                document.getElementById('imgBox').appendChild(qrcode);
            }
        },
        created() {
            this.orderInfo = {};
            var options = JSON.parse(unescape(this.info));
            this.spinning = true;
            api.getOrderView(options)
                .then(resp => {
                    this.spinning = false;
                    if (resp.success) {
                        this.orderInfo = resp.result;
                        this.orderInfo.code = options.code;
                        this.orderInfo.type = options.type;
                        this.orderInfo.variationCode = options.variationCode;
                    } else {
                        this.$message.error(resp.error );
                    }
                })
                .catch(err => {
                    this.spinning = false;
                    this.$message.error(err );
                });
        },
        beforeRouteLeave (to, from, next) {
            next(function() {
                this.orderInfo = {};
                this.$router.push(to.path);
            })
        }
    }
</script>

<style scoped>
    h3 {
        text-align: left;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    
    .pay-way {
        height: 80px;
        border-bottom: 1px solid #ddd;
    }
    .pay-way-section {
        cursor: pointer;
        width: 170px;
        height: 55px;
        border: 2px solid #139bd4;
        font-size: 16px;
        color: #666;
        padding: 10px 30px;
    }
    .pay-way-section span {
        position: relative;
        top: -5px;
    }

    .pay-sure .main {
        height: 120px;
        padding-top: 40px;
        padding-bottom: 50px;
    }
    .pay-sure .main > div {
        height: 40px;
    }
    .pay-sure .main p  {
        float: left;
        text-align: right;
    }
    .pay-sure .discount-label, .pay-sure .label {
        position: relative;
        top: 6px;
        width: 200px;
        text-align: left;
        font-size: 14px;
        color: #333;
    }
    .pay-sure .label-less {
        width: 74px;
    }
    .pay-sure .discount-label {
        top: 2px;
    }
    .pay-sure .discount-number {
        font-size: 16px;
    }
    .pay-sure .money-number {
        font-size: 22px;
        color: #ff6144;
    }
    .sure-button {
        width: 140px;
        height: 45px;
        font-size: 16px;
        
    }
    .pay-sure .submit p{
        padding-top: 10px;
    }
    
    .weixinQRcode {
        text-align: center;
        height: 485px;
        background: url("/static/images/goods/payBackground.png") bottom center no-repeat;
    }
    .weixinQRcode h5 {
        font-size: 16px;
        color: #333;
        padding-top: 50px;
    }
    .weixinQRcode h4 {
        font-size: 22px;
        color: #ff6144;
        padding-top: 5px;
        padding-bottom: 37px;
    }
    .weixinQRcode p {
        font-size: 16px;
        color: #666;
    }
    .weixinQRcode #imgBox {
        height: 260px;
    }
    .pay-success {
        padding-top: 30px;
        text-align: center;
        font-size: 16px;
    }
    .pay-success .success-icon {
        font-size: 60px;
        color: #5cb85c;
        padding-bottom: 20px;
    }
</style>
<style>
    #goods-pay .ant-modal {
        width: 597px;
    }
    #goods-pay .ant-modal-header {
        height: 70px;
        padding: 27px 16px;
    }
    #goods-pay .ant-modal-content {
        padding: 0;
    }
    #goods-pay .ant-modal-title {
        font-size: 18px;
        font-weight: bold;
    }
    #goods-pay .ant-modal-close-x {
        position: relative;
        top: 11px;
    }
    #goods-pay .ant-modal-close-x:before {
        font-size: 18px;
    }
    #goods-pay .ant-modal-footer {
        border-top: 0;
        /*height: 0;*/
    }
    #goods-pay .ant-modal-body {
        padding: 0;
    }
    #goods-pay .weixinQRcode .ant-spin-nested-loading>div>.ant-spin {
        position: absolute;
        left: 0px;
    }
    
</style>