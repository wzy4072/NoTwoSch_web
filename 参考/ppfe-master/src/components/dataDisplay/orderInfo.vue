<template>
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
</template>

<script>

</script>

<style>

</style>