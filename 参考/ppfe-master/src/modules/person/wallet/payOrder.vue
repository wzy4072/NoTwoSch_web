<template>
        <div>
                <v-spin :spinning="loading" tip="页面加载中。。。">
                    <pay-order
                    :orderInfo="orderInfo"
                    :payUrl="payUrl"
                    :payResault="payResault"
                    ></pay-order>
                </v-spin>
        </div>
    </template>
    <script>
        import payOrder from '@/components/dataEntry/payOrder.vue'
        import payapi from '@/api/pay';
        export default {
            components:{
                'payOrder':payOrder,
            },
            data(){
                return {

                orderInfo:{},//{"outTradeNo":"201709231337213841000501462ybgcz","orderType":"RECHARGE","moery":0.01,"date":1506145041384,"details":null}
                payUrl:null,
                inteval:0,
                payResault:null,
                loading:false,
                }
            },
            created(){
                let _this = this;
                this.getPayUrl();
                //_this.getOrderInfo();
                _this.inteval =  setInterval(function(){ _this.getPayResault(); },3000);
            },
            beforeRouteLeave (to, from, next) {
                clearInterval(this.inteval);
                next();
            },
            methods:{
                //获取 付款链接 2
                getPayUrl(){
                    let _this = this;
                    payapi.getPayCode({outTradeNo:this.$route.params.code})
                    .then(resp => { 
                        if(resp.success){
                              _this.payUrl = resp.result.code; 
                                _this.orderInfo = resp.result;
                             }else{  
                                 this.$message.info('付款二维码获取失败，请尝试刷新页面！'+resp.error); 
                                 }
                    })
                    .catch(message => { 
                        this.$message.info('数据请求失败！' + message); 
                    });
                },
                //获取 付款结果
                getPayResault(){
                    let _this = this;
                    payapi.getPayResault({outTradeNo:this.$route.params.code}).then(req => {
                        if(req){
                            _this.payResault = req;
                            clearInterval(_this.inteval);
                            this.$message.info('付款成功，跳转至付款成功页！');
                            _this.loading = true;
                            let url = _this.orderInfo.orderType=='RECHARGE' ? '/account/order/rcarult/' + this.$route.params.code:'/account/order/payrult/' + this.$route.params.code; //根据 orderType 区分 充值 还是 购买（无论是服务还是app）
                            setTimeout(function(){ _this.$router.push(url); },1000);
                            }
                        }).catch(message => { this.$message.info('数据请求失败！' + message); });
                },
                //获取 订单信息
                // getOrderInfo() {
                //     let _this = this;
                //     payapi.getOrderInfo({ outTradeNo: this.$route.params.code })
                //         .then(req => { 
                //             _this.orderInfo = req;
                //             console.log(req);
                //             console.log('未付款成功的订单信息');
                //          })
                //         .catch(message => {
                //             this.$message.info('数据请求失败！' + message);
                //         });
                // }


            }
        }
    </script>