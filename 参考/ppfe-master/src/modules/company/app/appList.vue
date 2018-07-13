<template>
    <div style="padding:30px;">
        <app-list
        :appList="appList"
        ></app-list>
    </div>
</template>
<script>
    import appList from '@/components/dataDisplay/appList.vue';
    import payapi from '@/api/pay.js';
    export default {
        components:{
            'appList':appList,
        },
        data: function () {
            return {
               
                appList:{applications:[],other:[]},
            }
        },
        computed: {           
            companyId(){
                return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext.currentCorporate.id;
            },
            // walletId(){
            //     return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext.currentCorporate.walletId;
            // }
        },
        created(){
            if(this.companyId != null){this.getAppList(this.companyId)}
        },
        // watch:{
        //     companyId(val){ 
        //         if(val != null){this.getAppList(val)}
        //     },
        // },
        methods: {
            getAppList(id){
                payapi.getAppList(id)
                .then(res => { this.appList = res; })
                .catch(e => { this.$message.error(e, 4) })
            },
            // createOrder(id,orderType) {
            //     let _this = this;
            //     _this.orderInfo.orderType = orderType;  //决定 现金付款 余额付款 免费试用
            //     _this.orderInfo.walletId = id;
            //     payapi.createOrder(_this.orderInfo)
            //     .then(resq => {
            //         if (true) {
            //             _this.$message.info('订单生成成功，即将跳转支付界面！');
            //             let url = name == 'BALANCE' ? '/account/order/payrult/' + resq : '/account/order/pay/' + resq;
            //             setTimeout(function(){ this.$router.push(url) },1500);
            //         }
            //         console.log(resq);
            //     })
            //     .catch(e => { this.$message.error(e, 4) })
            // },
            // tryApp(param){ //{appName:name,orderType:type}
            //     if(this.getAppId(param.appName,this.appList.applications)){ this.$message.warning('您已经拥有该应用！', 4); return false; }
            //     let id = this.getAppId(param.appName,this.appList.other);
            //     if(id){ this.createOrder(id,param.orderType);}else{ this.$message.warning('应用尚未上架！', 4); return false;}
            // },
            // buyApp(param){
            //     if(this.getAppId(param.appName,this.appList.applications)){ this.$message.warning('您已经拥有该应用！', 4); return false; }
            //     let id = this.getAppId(param.appName,this.appList.other);
            //     if(id){ this.createOrder(id,param.orderType);}else{ this.$message.warning('应用尚未上架！', 4); return false;}
            // },
            // getAppId(name,arr){
            //     for(let i=0;i<arr.length;i++){ if(arr[i].appname == name){return arr[i].id;} };
            //     return null;
            // },
        },
    }
</script>
<style scoped>
    @import '/static/css/common.css';
</style>