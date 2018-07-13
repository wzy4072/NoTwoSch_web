<template>
    <div>
        <v-row class="bread">
            <v-breadcrumb separator=">">
                <v-breadcrumb-item v-for="item in bread" href="item.href" :key="item.name">{{item.name}}</v-breadcrumb-item>
            </v-breadcrumb>
        </v-row>
        <div style="padding:30px;" id="recharge">
            <v-card :title="type== 'recharge' ? '充值' : '应用购买' ">
                <slot>
                    <!-- 这里是嵌入组件内的内容位置   -->
                </slot>
                <div class="notice" v-show="type =='recharge'">
                    <p class="tit"> 温馨提示：</p>
                    <p>1.充值成功后，若余额未到账，请咨询客服</p>
                    <p>2.单笔充值金额的最小额度为10元，最大金额是20000元</p>
                    <p>3.充值完成后，您可以进入“钱包” - “充值记录” 页面查看</p>
                </div>
            </v-card>
        </div>
    </div>
</template>

<script>
 // type : buy或者 recharge
    export default {
        props:['bread','type'],
        data() {
            return {
            }
        }
    }

</script>

<style scoped>
    @import '/static/css/common.css';
     .bread {
        background-color: #fff;
        padding: 25px;
        height: 62px;
        line-height: 12px;
    }

    .notice {
        color: #666;
        border-top: 1px solid #e8e9ea;
        padding:50px 30px 130px; 
    }

    .notice>p {
        font-size: 16px;
        margin: 16px 0;
    }
    .notice p.tit{
        margin-bottom: 18px;
    }
    
</style>
<style>
    #recharge .ant-card-body{
        padding:0;
    }
</style>