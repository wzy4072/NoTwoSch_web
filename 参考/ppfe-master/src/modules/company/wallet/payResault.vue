<template>
        <div>
            
            <recharge 
            :bread="bread"
            type="buy"
            >
                <template>
                    <div v-show="payResultFlag" id="rec-suc">
                        <div class="rech-img"> <img src="/static/images/home/rechargeSuc.png" alt=""> </div>
                        <v-row class="ord-info">
                            <div> 恭喜您购买成功！</div>
                            <!-- <p>支付时间：{{orderInfo.date}}</p> -->
                        </v-row>
                        <!-- <v-row class="order-group">
                             <div class="order">
                                <p>订单详情：</p>
                                <div><span>应用名称：</span><strong>{{orderInfo.details.appName}}</strong></div>
                                <div><span>使用时长：</span><strong>{{orderInfo.details.useDay}}个月</strong></div>
                                <div><span>使用人数：</span><strong>{{orderInfo.details.useNum}}人</strong></div>


                            </div>
                        </v-row>-->
                        <v-row class="bts-group">
                                <!-- <router-link to="/apps/order"> <button class="_btn">继续购买</button></router-link>
                                <router-link :to="'/apps/order/addstaff/'+orderInfo.details.applicationid "> <button class="_btn ghost">扩充人数</button></router-link>
                                <router-link to="/home"> <button class="_btn ghost">去使用</button></router-link> -->
                                <router-link to="/voucher/list"> <button class="_btn">查看凭证</button></router-link>
                        </v-row> 
                    </div>
                    <div v-show="!payResultFlag">
                            正在查询...
                    </div>

                </template>
            </recharge>
        </div>
    </template>
    
    <script>
        import payapi from '@/api/pay.js'
        import recharge from '@/components/dataEntry/recharge.vue';
        import tool from '@/api/tool';

        export default {
            components: {
                'recharge': recharge,
            },
            data() {
                return {
                    payResultFlag:false,
                    bread: [{ name: '平台服务', href: '' }, { name: '购买应用', href: '' }],
                    orderInfo: {
                        date:null,
                        details:{appName:null,useDay:null,useNum:null}
                    },
                }
            },
            created() {
                let _this = this;
                _this.getOrderInfo();
            },
            methods: {
                // 获取 付款结果
                getOrderInfo() {
                    let _this = this;
                    payapi.getOrderInfo({ outTradeNo: this.$route.params.code })
                        .then(req => { 
                                this.payResultFlag = true;
                                // //付款成功，刷新上下文 重载当前 公司应用人数
                                this.$store.dispatch("reloadContext");
                                _this.orderInfo.date = tool.epochToDateTime(req.date);//时间戳转换
                        })
                        .catch(message => {
                            this.$message.info('数据请求失败！' + message);
                        });
                }
            }
        }
    
    </script>
    
    <style scoped>
        @import '/static/css/common.css';
        #rec-suc .rech-img {
            text-align: center;
            padding: 35px 0 12px;
        }
    
        #rec-suc .ord-info>div{
            text-align: center;
            font-size: 28px;
            margin: 16px;
            color: #FB5C38;
        }
        #rec-suc .ord-info>p{
            text-align: center;
            font-size: 14px;
            margin:12px 0;
        }
    
        #rec-suc .ord-time {
            text-align: center;
            font-size: 16px;
        }
    
        #rec-suc .ord-bts {
            text-align: center;
        }
    
        #rec-suc ._btn {
            display: inline-block;
            margin: 35px 12px;
        }
    
        #rec-suc ._btn.mny {
            border: 1px solid #ccc;
            color: #666;
            background-color: #fff;
        }
.order{
    width: 388px;
            margin:0 auto;
border:1px solid #ccc;
padding-bottom: 12px;
        }
        .order>p{
            font-size: 16px;
            background: #ccc;
            padding: 6px 14px;
            margin-bottom: 12px
        }
        .order>div{
            padding-left: 20px;
            margin: 12px 0;
        }
        .order>div>span,.order>div>strong{
            font-size: 14px;
        } 
        .bts-group{
        text-align: center;
        margin-bottom: 120px;
    }
    .bts-group ._btn{
        display: inline-block;
        margin: 0 20px;
    }

    </style>