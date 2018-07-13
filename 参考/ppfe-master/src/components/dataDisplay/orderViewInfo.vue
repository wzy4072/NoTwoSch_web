<template>
    <ul class="order">
        <li :class="{'hasFiveItem': isSaleUnitShow && isDateShow && isElasticShow}">
            <div class="order-title">
                <img src="/static/images/goods/window.png" alt="">
                <h5>{{orderInfo.alias}}</h5>
                <p>{{orderInfo.name}}</p>
            </div>
            <div v-if="isSaleUnitShow" class="order-way">
                <h5>付费方式</h5>
                <p>{{saleUnit}}</p>
            </div>
            <div class="order-price">
                <h5>版本价格</h5>
                <p>￥{{orderInfo.productPrice}}</p>
            </div>
            <div class="order-price">
                <h5>数量</h5>
                <p>{{orderInfo.qty}}</p>
            </div>
            <div v-if="isDateShow" class="order-dead-line">
                <h5>到期时间</h5>
                <p>{{expireDate}}</p>
            </div>
            <div v-if="isElasticShow"
                 class="elastic">
                <h5>优惠</h5>
                <p v-for="elastic in orderInfo.elastics">
                    {{elastic.name}}
                </p>
            </div>
        </li>
    </ul>
</template>

<script>
    import timeHandler from "@/api/tool.js";
    
    export default {
        props: {
            "orderInfo": {
                type: Object
            },
        },
        data() {
            return {
                
            }
        },
        computed: {
            expireDate() {
                return timeHandler.epochToDateTime(this.orderInfo.expireDate);
            },
            saleUnit() {
                var map = {
                    "year": "年付",
                    "month": "月付",
                };
                return map[this.orderInfo.saleUnit];
            },
            isElasticShow(){
                return (this.orderInfo.elastics &&
                    this.orderInfo.elastics.length !== 0 &&
                    this.orderInfo.elastics[0].name !== null)
            },
            isSaleUnitShow() {
                return this.orderInfo.saleUnit != null
            },
            isDateShow() {
                return this.orderInfo.expireDate != null
            }
        },
        created() {
            
        },
        watch: {
            
        }
    }
</script>

<style scoped>
    .order > li {
        width: 915px;
        height: 160px;
        border: 1px solid #e8e9ea;
        background-color: #fdfdfd;
    }
    .order > .hasFiveItem {
        width: 1060px;
    }
    .order p {
        font-size: 18px;
        color: #333;
    }
    .order h5 {
        font-size: 14px;
        padding-bottom: 30px;
        color: #666;
    }
    .order > li > div {
        float: left;
    }
    .order .order-title {
        position: relative;
        text-align: center;
        width: 250px;
        height: 160px;
        color: #139bd4;
    }
    .order .order-title img{
        position: absolute;
        top: 26px;
        left: 48px;
    }
    .order .order-title h5 {
        position: absolute;
        top: 40px;
        left: 80px;
        color: #139bd4;
        font-size: 25px;
        font-weight: bold;
    }
    .order .order-title p {
        position: absolute;
        top: 75px;
        left: 73px;
        color: #139bd4;
        font-size: 25px;
    }
    .order-way, .order-price, .order-dead-line {
        text-align: center;
        padding-top: 45px;
        width: 160px;
        height: 160px;
    }
    .elastic {
        text-align: center;
        padding-top: 45px;
        width: 160px;
    }
    .elastic p {
        font-size: 16px !important;
    }
</style>