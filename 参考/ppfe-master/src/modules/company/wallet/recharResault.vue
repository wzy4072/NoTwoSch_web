<template>
        <div>
            
            <recharge 
            :bread="bread"
            type='recharge'
            >
                <template>
                    <div v-show="recharFlag" id="rec-suc">
                        <div class="rech-img"> <img src="/static/images/home/rechargeSuc.png" alt=""> </div>
                        <p class="ord-info"> 恭喜您成功充值￥{{orderInfo.moery}}</p>
                        <p class="ord-time">充值时间:{{orderInfo.date}}</p>
                        <div class="ord-bts">
                            <!-- <router-link to="/施工中。。。"><button class="_btn">开通VIP</button></router-link> -->
                            <router-link to="/account/wallet"><button class="_btn ghost">查看余额</button></router-link>
                        </div>
                    </div>
                    <div v-show="!recharFlag">
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
                    recharFlag:false,
                    bread: [{ name: '企业钱包', href: '' }, { name: '充值', href: '' }],
                    orderInfo: {
                        moery:null,
                        date:null,

                    },
                }
            },
            created() {
                let _this = this;
                _this.getOrderInfo();
            },
            methods: {
                // 获取订单信息---
                getOrderInfo() {
                    let _this = this;
                    payapi.getRecharOrderInfo(this.$route.params.code)
                        .then(req => { 
                            this.recharFlag=true;
                            _this.orderInfo = req.result; 
                            _this.orderInfo.date = tool.epochToDateTime(req.result.date); //时间戳转换
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
    
        #rec-suc .ord-info {
            text-align: center;
            font-size: 28px;
            margin: 16px;
            color: #FB5C38;
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
    

    </style>