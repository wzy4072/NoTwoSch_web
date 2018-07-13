<template>
        <div>
            <recharge :bread="bread">
                <template>
                    <p class="tit">请选择您的充值金额 </p>
                    <div class="amout-form">
                        <v-form direction="horizontal" :model="amountList" :rules="amountRules" ref="amountList">
    
                            <div class="radio-group">
                                <div v-for="val in valList" class="radio-btn" :class="{select:amountList.totalFee==val}" @click="amountList.totalFee = val">{{val}}</div>
                                <div class="radio-btn" :class="{select:getClass}" @click="elseNum">其他金额</div>
                                <div class="elsenum" v-show="showIpt"><span>输入金额：</span><input type="text" v-model="amountList.totalFee"></div>
                            </div>
                            <button type="button" @click="subOrder('amountList')" class="_btn">立即支付</button>
                        </v-form>
                    </div>
                </template>
            </recharge>
        </div>
    </template>
    
    <script>
        import payapi from '@/api/pay.js'
        import recharge from '@/components/dataEntry/recharge.vue';
        export default {
            components: {
                'recharge': recharge,
            },
    
            data() {
                return {
                    bread: [{ name: '企业钱包', href: '' }, { name: '充值', href: '' }],
                    // 充值参数
                    amountList: {
                        body: '充值',
                        paytype: 'WX',
                        behaviorType :'PERSONAL',
                        totalFee: 0.01,
                        walletId: null,
                        tradeType: 'NATIVE',
                        orderType: 'RECHARGE',//RECHARGE   BALANCE   PAYMENT 充值 余额付款 充值付款
                        // serviceType:"APPLICATION",//ENTERPRISE  APPLICATION app购买 服务购买 充值不传
                    },

                    amountRules: {},
                    valList: [800, 1000, 3000, 5000, 10000],
                    showIpt: false,
                }
            },
            computed: {
                loginContext() {
                    return this.$store.getters.loginContext == null ? { currentCorporate: '', person: '' } : this.$store.getters.loginContext;
                },
                getClass() {
                    let _this = this; let flag = true;
                    for (let i = 0; i < _this.valList.length; i++) {
                        if (_this.valList[i] == _this.amountList.totalFee) { flag = false; }
                    };
                    return flag;
                }
            },
            methods: {
                subOrder(formName) {
                    let _this = this;
                    _this.amountList.walletId = _this.loginContext.person.walletId;
                    payapi.createOrder(_this.amountList)
                        .then(req => {
                            if(req.success){
                                _this.$message.info('订单生成成功，即将跳转支付界面！')
                                setTimeout(function(){ _this.$router.push('/account/order/pay/' + req.result) },1500);
                            }else{
                                _this.$message.info(req.error,4)
                            }
                        })
                        .catch(error => { _this.$message.info('数据请求失败！' + error.message); });
                },
                elseNum(e) {
                    this.showIpt = !this.showIpt;
                    this.amountList.totalFee = 0;
                },
    
            }
        }
    </script>
    
    <style scoped>
        @import '/static/css/common.css';
        #recharge .tit {
            text-align: center;
            font-size: 28px;
            margin-top: 50px;
            margin-bottom: 30px;
        }
    
        #recharge .amout-form {
            margin-bottom: 50px;
        }
    
        #recharge div.radio-group {
            text-align: center;
            margin: 30px 0;
        }
    
        #recharge div.radio-group div.radio-btn {
            width: 150px;
            height: 56px;
            margin: 0 8px;
            line-height: 56px;
            text-align: center;
            font-size: 16px;
            display: inline-block;
            vertical-align: top;
            border: 1px solid #CACACA;
            cursor: pointer;
        }
    
        #recharge div.radio-group div.select {
            color: #fff;
            background-color: #03A1EA;
            border-color: #03A1EA;
        }
    
        #recharge div.radio-group .elsenum {
            text-align: left;
            padding-left: 20%;
        }
    
        #recharge div.radio-group .elsenum span {
            font-size: 28px;
        }
    
        #recharge div.radio-group .elsenum input {
            height: 42px;
            width: 200px;
            font-size: 20px;
            padding: 0 6px;
            margin: 25px 0;
        }
    
        ._btn {
            margin-top: 30px;
            background: #FE5B3A;
        }
    
        ._btn:hover {
            background: #FE5B3A;
            color: #fff;
        }
    </style>
    <style>
        #recharge .ant-card-body {
            padding: 0;
        }
    </style>