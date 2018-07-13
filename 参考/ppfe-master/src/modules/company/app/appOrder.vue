<template>
    <div id="member">
        <!-- 头部 -->
        <v-row>
            <v-col span="6">
                <div style="background:#fff;padding:20px 0 0 20px;height:288px;    border-radius: 300px 0 0 300px;">
                        <head-avatar 
                        :id="loginContext==null ? null : loginContext.person.avatar"
                        :name="loginContext==null ? null : loginContext.person.username"
                        ></head-avatar>
                </div>
            </v-col>
            <v-col span="11"> <head-com :appList="appList" :isPending="isPending" ></head-com> </v-col>
            <v-col span="7"> <head-balance :balance="balance" walLink='/account/wallet' ></head-balance> </v-col>
        </v-row>
        <br/>
        <!-- 单价介绍 -->
        <v-card title="应用价格：">
            <v-row>
                <table border="1" class="price-tab">
                    <thead>
                        <tr>
                            <th></th>
                            <th v-for="ths in priceTabData[0].price">{{ths.monthNa}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tds in priceTabData">
                            <td class="app-na">{{tds.appName}}</td>
                            <td v-for="price in tds.price">￥{{price.value}}</td>
                            <td style="border:none;width:20%"></td>
                        </tr>
                    </tbody>
                </table>
            </v-row>

            <v-row class="goods-par">
                <p class="goods-tit"> 选购服务：</p>
            </v-row>
            <v-row class="goods-par">
                <span>选择服务</span>
                <div class="slfbt-wrap">
                    <select v-model="orderInfo.appId" class="self-bts selec">
                        <option  v-for="item in priceTabData" :value="item.appId">{{item.appName}}</option>
                    </select>
                </div>
            </v-row>
            <v-row class="goods-par">
                <span>使用时间</span>
                <div class="slfbt-wrap">
                    <select v-model="orderInfo.monthVal" class="self-bts selec" @change="changeMonth(orderInfo.monthVal)">
                        <option  v-for="item in priceTabData[0].price" :value="item.monthVal" >{{item.monthNa}}</option>
                    </select>
                </div>
            </v-row>
            <v-row class="goods-par">
                <span>使用人数</span>
                <div class="slfbt-wrap">
                    <button @click="changePeNo('-5')" class="self-bts numbt bt-m">-</button><span class="self-bts numbt bt-msg"> {{orderInfo.corporateNum}}</span><button @click="changePeNo('5')" class="self-bts numbt bt-p">+</button>
                </div>
            </v-row>
            <v-row class="goods-par price">
                <span>人数加价</span><strong style="color:#FF513D;">￥{{orderInfo.corporateNum * 20}}</strong>
                <!-- //每个人加价20//1个月 最少三人 +5N 其他最少5人 +5N -->
            </v-row>
            <v-row class="goods-par price">
                <span>总 价 格</span><strong style="color:#FF513D;">￥{{orderInfo.corporateNum * 20 + appPrice() }}</strong><span>{{appPrice()}}+{{orderInfo.corporateNum * 20}}</span>
            </v-row>
            <v-row class="goods-par">
                <button class="_btn" @click="choseOrderType" :disabled="haveRead==1">立即购买</button>
            </v-row>
            <v-row>
                <v-checkbox v-model="haveRead" :true-value="0" :false-value="1">已阅读并同意签署
                    <router-link to="/***">《企业版服务协议》</router-link>
                </v-checkbox>
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
                balance:null,
                currentCorporate:null,
                
                isPending:null,
                appList:{"applications":[],"other":[]},
                priceTabData: [
                    { appName: '应用A', appId: 1, price: [{ monthNa: '1个月', monthVal: 1, value: 1000 }, { monthNa: '12个月', monthVal: 12, value: 1760 }, { monthNa: '18个月', monthVal: 18, value: 2680 }, { monthNa: '24个月', monthVal: 24, value: 3650 }] },
                    { appName: '应用B', appId: 2, price: [{ monthNa: '1个月', monthVal: 1, value: 1000 }, { monthNa: '12个月', monthVal: 12, value: 1760 }, { monthNa: '18个月', monthVal: 18, value: 2680 }, { monthNa: '24个月', monthVal: 24, value: 3650 }] },
                    { appName: '应用C', appId: 3, price: [{ monthNa: '1个月', monthVal: 1, value: 1000 }, { monthNa: '12个月', monthVal: 12, value: 1950 }, { monthNa: '18个月', monthVal: 18, value: 2900 }, { monthNa: '24个月', monthVal: 24, value: 3850 }] },
                    { appName: '应用D', appId: 4, price: [{ monthNa: '1个月', monthVal: 1, value: 1000 }, { monthNa: '12个月', monthVal: 12, value: 1950 }, { monthNa: '18个月', monthVal: 18, value: 2900 }, { monthNa: '24个月', monthVal: 24, value: 3850 }] },
                ],
                haveRead: 0,
                appName: "",
                orderInfo: {
                    corporateNum: 5,
                    appId: 2,
                    monthVal: 12,
                    appName: null,
                },
            }
        },
        computed: {
            loginContext() {
                return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext;
            },
        },
        watch:{
            loginContext(val){
                    if( val != null){ this.isPending = val.currentCorporate.isPending == 'Authentication_Pass' ? '已认证' :'未认证'; }
            }
        },
        created(){
            this.getBalancce();
            this.getAppList(this.loginContext.currentCorporate.id);
            if(this.$route.params.id){ this.orderInfo.appId = this.$route.params.id; }
            if( this.loginContext.currentCorporate != null){ 
                this.isPending = this.loginContext.currentCorporate.isPending == 'Authentication_Pass' ? '已认证' :'未认证'; 
                this.orderInfo.corporateNum = this.loginContext.currentCorporate.useNum;
            }

        },
        methods: {
            changePeNo(num) {
                let lastUseNum = this.loginContext.currentCorporate.useNum;
                let useNum = this.orderInfo.corporateNum;
                if(lastUseNum == null || lastUseNum == 0 ){
                    //如果 未购买过应用
                    if ((useNum == 5 || useNum == 3) && num == '-5' ) { return false; }
                    this.orderInfo.corporateNum += parseInt(num);
                }else{
                    //如果购买过应用
                    if (this.orderInfo.corporateNum == lastUseNum  && num == '-5') { return false; }
                    this.orderInfo.corporateNum += parseInt(num);
                }
            },
            choseOrderType() {

                // 公司是否已认证 
                if(this.loginContext.currentCorporate.isPending != 'Authentication_Pass'){
                    this.$message.info('您的公司目前不是已认证状态，不能购买应用，请先通过企业认证！',4); 
                    return false;
                }
                //购买前要判断 是否已购买
                let appArr = this.appList.applications;
                for( let i=0;i<appArr.length;i++){
                    if(appArr[i].id == this.orderInfo.appId){
                        this.$message.info('该应用您已经购买，不能重复购买！' );
                        return false;
                    }
                };
                //购买前要判断  人数 
                if(this.orderInfo.corporateNum< this.loginContext.currentCorporate.useNum){
                    this.$message.info('适用人数不能小于已购买的应用人数，请重新选择！' ); 
                    return false;
                }
                const code = `{
                 appName:'${this.orderInfo.appName}',
                 useDay:${this.orderInfo.monthVal},
                 dateType:'MONTH',
                 corporateNum:${this.orderInfo.corporateNum},
                 applicationid:${this.orderInfo.appId},
                 totalFee:0.01}`;
                //  totalFee:${this.appPrice()}}`; 
                this.$router.push('/apps/ordertype/' + encodeURIComponent(code));

            },
            changeMonth(val) { 
                let lastUseNum = this.loginContext.currentCorporate.useNum;
                let useNum = this.orderInfo.corporateNum;
                if(lastUseNum == null || lastUseNum == 0){
                    this.orderInfo.corporateNum = val == 1 ? 3 : 5;
                }else{
                    this.orderInfo.corporateNum = lastUseNum;
                }
             },
            appPrice() {
                this.$message('lodash 模块移除 内部filter方法不能使用 使用请替换tool下的getItems');
                // let priceObj = _.filter(this.priceTabData, { appId:  parseInt(this.orderInfo.appId) })
                // this.orderInfo.appName = priceObj[0].appName;
                // let month = _.filter(priceObj[0].price, { monthVal: this.orderInfo.monthVal });
                // return month[0].value;
            },
            getBalancce() {
                 payapi.getBalancce({ walletId: this.loginContext.currentCorporate.walletId })
                    .then(req => { this.balance = req;})
                    .catch(message => { this.$message.info('数据请求失败！' + message); });
            },
            getAppList(id){
                payapi.getAppList(id)
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

    table.price-tab {
        border: none;
        border-collapse: collapse;
        width: 80%;
    }

    table.price-tab thead tr,
    table.price-tab tbody tr {
        text-align: center;
        height: 46px;
        font-size: 16px;
    }

    table.price-tab tbody tr {
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    table.price-tab thead th,
    table.price-tab tbody td {
        border: none;
    }

    table.price-tab tbody td {
        color: #FF513D;
        border-right: 1px solid #ccc;
    }

    table.price-tab tbody tr td.app-na {
        color: #000;
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