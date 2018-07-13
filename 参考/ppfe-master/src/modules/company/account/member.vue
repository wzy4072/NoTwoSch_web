<!-- <template>
    <div id="member">
        <v-card title="会员开通标准价格：">
        <v-row>
            <div class="ant-table ant-table-large">
                <div class="ant-table-content">
                    <div class="ant-table-body">
                        <div class="ant-spin-nested-loading" style="min-height: auto;"><div class="ant-spin-container">
                                <table>
                                    <thead class="ant-table-thead"><tr><th style="cursor: text;width:25%;">人数</th><th style="cursor: text;width:25%;"> 价格</th><th style="cursor: text;width:50%;">会员特权</th></tr></thead>
                                    <tbody class="ant-table-tbody" ><tr class=""><td><span>≤5人</span></td><td><span><span class="monyes">￥80</span>/人/年</span></td><td rowspan="5">
                                            <div class="spans">
                                                <p> 1.一对一专属顾问 </p>
                                                <p> 2.免费参加专家培训课程</p>
                                                <p> 3.优先实现功能需求</p>
                                            </div>
                                            </td>
                                        </tr>
                                        <tr class=""><td><span>≤10人</span></td><td><span><span class="monyes">￥75</span>/人/年</span></td><td><span></span></td></tr>
                                        <tr class=""><td><span>≤15人</span></td><td><span><span class="monyes">￥60</span>/人/年</span></td><td><span></span></td></tr>
                                        <tr class=""><td><span>≤20人</span></td><td><span><span class="monyes">￥50</span>/人/年</span></td><td><span></span></td></tr>
                                        <tr class=""><td><span>&gt;20人</span></td><td><span>联系我们</span></td><td><span></span></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </v-row>
        <v-row class="goods-par">
           <p class="goods-tit"> 选购服务：</p>
        </v-row>
        <v-row class="goods-par">
                <span>使用人数 </span>
                <div style="display:inline-block;">
                    <button @click="changePeNo('-5')" class="numbt bt-m">-</button><span class="numbt bt-msg"> {{orderInfo.corporateNum}}</span><button @click="changePeNo('5')" class="numbt bt-p">+</button> 
                </div>
        </v-row>
        <v-row class="goods-par">
                <span>使用时长 </span>
             <div v-for="item in durations" class="ser-time " :class="{chose:orderInfo.serverYears==item.val}" @click="orderInfo.serverYears = item.val"><div v-show="item.discount !=''" class="discount">{{item.discount}}</div><img v-show="orderInfo.serverYears==item.val" class="check-img" src="/static/images/home/checked.png" alt="">{{item.year}}</div>
        </v-row>
        <v-row class="goods-par"> <span>联系人</span><span>{{orderInfo.content}}</span></v-row>
        <v-row class="goods-par"> <span>价格 ￥</span><span>{{orderInfo.price}}</span></v-row>
        <v-row>
             <button class="_btn" @click="createOrder('BALANCE')" :disabled="haveRead==1">余额付款</button> 
             <button class="_btn" @click="createOrder('PAYMENT')" :disabled="haveRead==1">充值付款</button>
        </v-row>
        <v-row>
               <v-checkbox v-model="haveRead" :true-value="0" :false-value="1" >已阅读并同意签署 <router-link to="/***">《企业版服务协议》</router-link></v-checkbox>
        </v-row>

        </v-card>
    </div>
</template>
<script>
    import payapi from '@/api/pay.js';
    export default {
        // components:{ },
        data: function () {
            return {
                orderInfo: {
                    corporateNum: 5,
                    serverYears: 2,
                    content:'155 8322 0124',
                    price: '2000'
                },
                haveRead:0,
                durations:[
                    {year:'一年',val:'1',discount:''},
                    {year:'二年',val:'2',discount:'9折'},
                    {year:'三年',val:'3',discount:'8折'},
                    {year:'四年',val:'4',discount:'8折'}
                ],
                //服务 订单
                orderInfo2:{
                    body: '充值', 
                    paytype: 'WX',
                    totalFee: 0.01,
                    walletId: null,
                    tradeType: 'NATIVE',
                    serviceType:"ENTERPRISE",//ENTERPRISE  APPLICATION app购买 服务购买 充值不传
                    orderType:'',//RECHARGE   BALANCE   PAYMENT 充值 余额付款 充值付款
                    useDay:1,
                    DateType :'YEAR'
                },
            }
        },
        computed: {
                loginContext() {
                    return this.$store.getters.loginContext == null ? { currentCorporate: '', person: '' } : this.$store.getters.loginContext;
                },
            },
        methods: {          
            createOrder(name) {
                let _this = this;
                _this.orderInfo2.orderType = name;
                _this.orderInfo2.walletId = _this.loginContext.currentCorporate.walletId;

                payapi.createOrder( _this.orderInfo2)
                    .then(resq => {
                        if (true) {
                            _this.$message.info('订单生成成功，即将跳转支付界面！')
                            let url = name == 'BALANCE' ? '/account/order/payrult/' + resq : '/account/order/pay/' + resq;
                            setTimeout(function(){ _this.$router.push(url) },1500);
                        }
                    })
                    .catch(e => { this.$message.error(e, 4) })
            },
            changePeNo(num){
                if (this.orderInfo.corporateNum==5 && num=='-5'){
                      return false;
                    }
                this.orderInfo.corporateNum+=parseInt(num);
            },
        },

    }

</script>
<style scoped>
    @import '/static/css/common.css';
    #member {
        padding: 30px;
    }

    #member .monyes {
        color: #f00;
    }
    #member .spans>p{
font-size: 14px;
padding-left: 16px;
    }
    .numbt{
        width:32px;
        height: 32px;
        line-height: 32px;
        border:1px solid #ccc;
        text-align: center;
        background:#fff;
        display: inline-block;
        font-size: 16px;
    }
    .numbt.bt-msg{
        width: 100px;
        border-left:none;
        border-right: none;
    }
    .goods-par{
        margin:12px 0;
    }
    .goods-par .goods-tit{
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        padding-left: 8px;
        background-color:#FEF0ED;
    }
    .goods-par>span{
        font-size: 16px;
        margin:0 8px;
    }
    /* 选择服务时间 */
    .ser-time{
        height: 32px;
        width: 100px;
        line-height: 32px;
        display:inline-block;
        margin:0 20px;
        position: relative;
        border:1px solid #ccc;
        text-align: center;
        font-size: 16px;
        cursor:pointer;
    }
    .ser-time.chose{
        border-color:#04A1E8;
    }
    .ser-time .discount{
        height: 20px;
        width: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 100%;
        background-color: #f00;
        position: absolute;
        color:#fff;
        font-size: 12px;
        top: -10px;
        right: -10px;
    }
    .ser-time  .check-img{
        position: absolute;
        bottom: 0;
        right: 0;
    }
    

    /* 提交按钮 */
    ._btn{
        display: inline-block;
        margin:0 20px;
    }
._btn:disabled{
    cursor:text;
    background:#f5f5f5;
    color:#ccc;
}
    /* .price-tab{

    } */
</style> -->