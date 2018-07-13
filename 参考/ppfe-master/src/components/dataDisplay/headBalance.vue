<template>
    <div class="head he3">
        <div>
            <p class="p1">钱包</p>
            <p class="p2">余额(元)</p>
            <p class="p3">{{balance}}</p>
            <div class="imgwrap"><router-link :to="walLink" > <img src="/static/images/home/wallet.png" alt=""> </router-link></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['balance','walLink'],
        data() {
            return {

            }
        }
    }
</script>
<style scoped>
    @import '/static/css/common.css';
    .head {
        height: 288px;
        background-color: #fff;
    }

    .head.he3 {
        padding: 15px;
    }

    .head.he3>div {
        background: #f5f5f5;
        border: 1px solid #dcdcdc;
        height: 100%;
    }

    .head.he3>div p {
        color: #999;
        text-align: center;
    }

    .head.he3>div p.p1 {
        font-size: 18px;
        font-weight: 800;
        padding: 20px 0;
    }

    .head.he3>div p.p3 {
        font-size: 32px;
        color: #03a1ea;
    }

    .head.he3>div div.imgwrap {
        padding-top: 20px;
        text-align: center;
    }
</style>