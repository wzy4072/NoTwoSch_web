<template>
        <div style="padding:30px;">
            <temp-wallet 
            :walletInfo="walletInfo"
            :recharUrl="recharUrl"
            :rchrData="rechargeData" 
            @rchrTabsearch="rchrTabsearch" 
            @pushRchrRef="getRchrRef"
    
            :consData="consData" 
            @consTabsearch="consTabsearch"
            @pushConsRef="getConsRef"
            ref="refbt2"
            ></temp-wallet>
        </div>
    </template>
    
    <script>
        import tempWallet from '@/components/dataDisplay/wallet.vue';
    
        import payapi from '@/api/pay'
        import tool from '@/api/tool'

        export default {
            components: {
                'tempWallet': tempWallet,
            },
            data() {
                return {
                    walletInfo: {
                        name: '个人钱包',
                        balance:null,
                        link: 'www.google.wzy.com'
                    },
                    consTabDate: { dateSt: '', dateEn: '' },
                    rchrTabDate: { dateSt: '', dateEn: '' },
                    rchrRef:"",
                    consRef:"",
                    recharUrl:'/account/order',//充值金额输入页
                }
            },
            created() {
                    this.getBalancce(); // 获取余额
                    // //默认查询当前一个月的记录
                    var end = new Date(), start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    start = tool.epochToDateTime(start)
                    end = tool.epochToDateTime(end)
                    this.consTabDate.dateSt = start;
                    this.consTabDate.dateEn = end;
                    this.rchrTabDate.dateSt = start;
                    this.rchrTabDate.dateEn = end;
                   
            },
            computed: {
                walletId() {
                    return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext.person.walletId;
                }
            },
            watch:{
                walletId(val){
                    this.getBalancce();
                    this.consRef.reload(); 
                    this.rchrRef.reload();
                }
            },
            methods: {
                getRchrRef(ref){ this.rchrRef = ref;},
                getConsRef(ref){ this.consRef = ref;},
                //更新时间参数 重新查询 表格数据
                consTabsearch(data) { this.consTabDate = data; this.consRef.reload(); },
                rchrTabsearch(data) { this.rchrTabDate = data; this.rchrRef.reload(); },
                consData(param) {
                    if (this.walletId == null) return new Promise((resolve, reject) => { resolve() }).then(req => { return { "result": [], "totalCount": 0, "pageNo": 1, "pageSize": 10 }; });
                    return payapi.getConsume({
                        walletId: this.walletId,
                        sTime: this.consTabDate.dateSt,
                        eTime: this.consTabDate.dateEn,
                        pageNo: param.pageNo,
                        pageSize: param.pageSize
                    })
                        .then(req => { return req; })
                        .catch(message => { this.$message.info('数据请求失败！' + message); });
                },
                rechargeData(param) {
                    if (this.walletId == null) return new Promise((resolve, reject) => { resolve() }).then(req => { return { "result": [], "totalCount": 0, "pageNo": 1, "pageSize": 10 }; });
                    return payapi.getRecharge({
                        walletId: this.walletId,
                        sTime: this.rchrTabDate.dateSt,
                        eTime: this.rchrTabDate.dateEn,
                        pageNo: param.pageNo,
                        pageSize: param.pageSize
                    })
                        .then(req => { return req; })
                        .catch(message => { this.$message.info('数据请求失败！' + message); });
                },
                //获取余额
                getBalancce() {
                    if(this.walletId == null){ console.log('没有钱包id，不查询钱包余额'); return false;}
                    payapi.getBalancce({ walletId: this.walletId })
                        .then(req => {
                            this.walletInfo.balance = req;
                        })
                        .catch(message => { this.$message.info('数据请求失败！' + message); });
                },
               
            }
        }
    
    </script>