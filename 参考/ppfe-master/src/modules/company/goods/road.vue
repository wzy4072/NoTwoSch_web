<template>
    <div style="padding:30px 0px 30px 10px;" id="road-list">
        <v-spin :spinning="spinning">
            <div class="good-main">
                <ul>
                    <li class="intro-section">
                        <div class="shape-top">
                            <div class="shape-cover"></div>
                        </div>
                        <div class="intro-text">
                            <p>深圳公路舱单</p>
                            <p>代理申报服务</p>
                        </div>
                        <div class="shape-bottom">
                            <div class="shape-cover"></div>
                        </div>
                    </li>
                    <li class="section is-focus">
                        <div class="section-body">
                            <div class="label"></div>
                            <h4>公路舱单</h4>
                            <p class="price-number">
                                <span>￥</span>
                                0
                            </p>
                            <p class="description"></p>
                            <p class="good-variation">在平台开通服务入口</p>
                        </div>
                        <div class="section-footer">
                            <v-button type="primary"
                                      :disabled="!canFreeBtnClick"
                                      @click="goToProductOrder"
                                      size="large">马上开通</v-button>
                        </div>
                    </li>
                    <li class="section" v-for="(inner, key) in innersData">
                        <div class="section-body">
                            <div class="label"></div>
                            <h4>{{inner.product.name}}</h4>
                            <p class="price-number">
                                <span>￥</span>
                                {{priceDisplay(inner.product.code)}}
                            </p>
                            <p class="description" style="padding-top: 20px;">
                                <span class="discount-label">优惠</span>
                                <span v-bind:class="{'discount-item': true,
                                      'active': currentNum.inners[inner.product.code]>=50 && currentNum.inners[inner.product.code]<100}">买50单送12单</span>
                                <span v-bind:class="{'discount-item': true,
                                      'active': currentNum.inners[inner.product.code]>=100}">买100单送60单</span>
                                <!--<span>{{currentNum}}</span>-->
                            </p>
                            <p class="good-variation">
                                <listing-stepper v-model="currentNum.inners[inner.product.code]"
                                                 :min="0"
                                                 :max="999"
                                                 :disableInput="disableInput"
                                                 :defaultValue="1"
                                                 :unit="'单'"
                                ></listing-stepper>
                            </p>
                        </div>
                        <div class="section-footer">
                            <v-button type="primary"
                                      @click="goToInnerOrder(inner.product.code)"
                                      size="large">购买</v-button>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="intro">
                <h3>产品介绍</h3>
                <span class="gray-line"></span>
                <div class="text">
                    <h4>适用对象</h4>
                    <p>
                        有深圳公路舱单申报需求全国各地通关服务企业。
                    </p>
                    <br>
                    <h4>适用口岸</h4>
                    <p>
                        文锦渡口岸、深圳湾口岸、皇岗口岸
                    </p>
                    <br>
                    <h4>服务宗旨</h4>
                    <p>
                        共享平台配套增值服务，助力全国通关一体化。
                    </p>
                </div>
                <div class="features">
                    <h4>特点</h4>
                    <ul>
                        <li>
                            <img src="/static/images/goods/CMS/road1.png" alt="">
                            <p>自动生成舱单</p>
                        </li>
                        <li>
                            <img src="/static/images/goods/CMS/road2.png" alt="">
                            <p>支持一车多单导入</p>
                        </li>
                        <li>
                            <img src="/static/images/goods/CMS/road3.png" alt="">
                            <p>申报状态自动跟踪</p>
                        </li>
                        <li>
                            <img src="/static/images/goods/CMS/road4.png" alt="">
                            <p>移动端随时确报服务条款</p>
                        </li>
                    </ul>
                </div>
            </div>
        </v-spin>
    </div>
</template>

<script>
    import api from "@/api/company/goods.js"
    import listingStepper from "@/components/dataEntry/listingStepper.vue"
    
    export default {
        components: {
            listingStepper: listingStepper
        },
        data() {
            return {
                /*
                * 对于一个产品，首先，有版本(Variation)的区别；其次有saleUnit的区别；最后，还有应用内购买(Inners)的区别
                * 在公路舱单里，版本只有一个，没有saleUnit，但是这里兼容多个Variation;
                * */
                spinning: false,
                disableInput: false,
                currentNum: {},
                currentPrices: {},
                currentVariation: null,
                currentInners: null,
                currentDiscount: {},
                productInfo: {},
                variationsData: {},
                innersData: {},
                productId: null,
                pricesData: {},
            }
        },
        computed: {
            canFreeBtnClick() {
                var alreadyGoods = this.getState();
                var roadInfo = {};
                for(var i = 0;i < alreadyGoods.length; i++) {
                    if(alreadyGoods[i].code === "ROAD") {
                        roadInfo = alreadyGoods[i];
                    }
                }
                console.log(!roadInfo.alias);
                return !roadInfo.alias;
            },
        },
        methods: {
            priceDisplay(innerCode) {
                var price = this.pricesData.inners[innerCode] * this.currentNum.inners[innerCode];
                if(parseInt(price + "") === price) {
                    return price;
                }else {
                    return price.toFixed(2);
                }
            },
            goToProductOrder() {
                this.$router.push({
                    name: 'goodsOrder',
                    params: {
                        info: JSON.stringify({
                            code: "ROAD",
                            variationCode: "USAGE",
                            saleUnit: null,
                            qty: 1,
                            behavior: "ENTERPRISE",
                            currency: "CNY",
                            type: "VOUCHER"
                        })
                    }
                });
            },
            goToInnerOrder(code) {
                if(this.currentNum.inners[code] <= 0) {
                    return;
                }
                this.$router.push({
                    name: 'goodsOrder',
                    params: {
                        info: JSON.stringify({
                            code: code,
                            variationCode: code,
                            saleUnit: null,
                            qty: this.currentNum.inners[code],
                            behavior: "ENTERPRISE",
                            currency: "CNY",
                            type: "VOUCHER"
                        })
                    }
                }); 
            },
            chooseVariation(code) {
                this.currentVariation = code;
                this.currentPrices.variations = this.pricesData.variations[code]
            },
            arrangeVariationPrice(variations, variationPrices, value) {
                var obj = {};
                for (var i = 0; i < variations.length; i++) {
                    var code = variations[i].code;
                    if(value !== undefined) {
                        obj[code] = value;
                    }else {
                        for (var j = 0; j < variationPrices.length; j++) {
                            if(code === variationPrices[j].variationCode) {
                                obj[code] = variationPrices[j].unitPrice;
                            }
                        }
                    }
                }
                return obj;
            },
            /**
             * 得到结构化的应用内购买价格
             * @NOTE  应用内购买项虽然也有版本数组，但实际只有一个，直接取第一项
             * @param inners
             * @param value
             */
            arrangeInnerPrice(inners, value) {
                var obj = {};
                for (var i = 0; i < inners.length; i++) {
                    if(value !== undefined) {
                        obj[inners[i].product.code] = null;
                    }else {
                        obj[inners[i].product.code] = inners[i].prices[0].unitPrice;
                    }
                }
                return obj;
            },
            arrangeInners(inners, value) {
                var obj = {};
                for (var i = 0; i < inners.length; i++) {
                    if(value !== undefined) {
                        obj[inners[i].product.code] = value;
                    }else {
                        obj[inners[i].product.code] = inners[i];
                    }
                }
                return obj;
            },
            arrangeVariations(variations) {
                var obj = {};
                for (var i = 0; i < variations.length; i++) {
                    var code = variations[i].code;
                    obj[code] = variations[i]
                }
                return obj;
            },
            getState() {
                return this.$store.getters.getPurchasedProducts;
            },
        },
        created() {
            this.spinning = true;
            // "公路舱单"的url编码
            api.getGoodsList("%E5%85%AC%E8%B7%AF%E8%88%B1%E5%8D%95")
                .then(resp => {
                    var data = resp;
                    var result = data.result[0];
                    this.productInfo = result.product;
                    this.productId = result.id;
                    this.variationsData = this.arrangeVariations(result.product.variations);
                    this.pricesData = {
                        "variations": this.arrangeVariationPrice(result.product.variations, result.prices),
                        "inners": this.arrangeInnerPrice(result.inners)
                    };
                    this.currentPrices = {
                        "variations": null,
                        "inners": this.arrangeInnerPrice(result.inners, null),
                        "total": 0
                    };
                    this.currentNum = {
                        "variations": 1,
                        "inners": this.arrangeInners(result.inners, 1)
                    };
                    this.innersData = this.arrangeInners(result.inners);
                    this.currentVariation = data.result[0].product.variations[0].code;
                    this.spinning = false;
                })
                .catch(err => {
                    this.spinning = false;
                    this.$message.error(err, 4);
                });
            
        },
        watch: {
            
        },
    }
</script>
<style>
    /* 对购买数量的样式变更 */
    #road-list .stepper {
        border-radius: 50%;
        width: 22px;
        height: 22px;
        cursor: pointer;
        border-color: #00aee0;
    }
    #road-list input {
        font-size: 16px;
        background-color: transparent;
        border-top: 0;
    }
    #road-list .unit {
        font-size: 14px;
        color: #333;
    }
    #road-list .minus {
        position: relative;
        left: -10px;
    }
    #road-list .plus {
        position: relative;
        left: 10px;
    }
    #road-list .minus-disabled, #road-list .plus-disabled {
        border-color: #ccc;
    }
    #road-list .stepper::before, #road-list .stepper::after {
        background-color: #00aee0;
    }
    #road-list .minus-disabled::before, #road-list .minus-disabled::after,
    #road-list .plus-disabled::before, #road-list .plus-disabled::after
    {
        background-color: #6c6c6c;
    }
    #road-list .stepper::before {
        /*height: 2px;*/
    }
    #road-list .stepper::after {
        /*width: 2px;*/
    }
</style>
<style scoped>
    .good-main {
        width: 1140px;
    }
    h4 {
        font-size: 18px;
        padding-bottom: 15px;
    }

    h5 {
        font-size: 16px;
        padding-bottom: 10px;
    }
    
    .goods-base > div, .in-app > ul, .in-app > ul > li > div {
        padding-left: 30px;
        font-size: 14px;
    }
    
    .goods-base ul:before, .goods-base ul:after{
        clear: both;
        display: table;
        content: " ";
    }
    .discount-label {
        font-size: 14px;
    }
    .discount-item {
        display: inline-block;
        padding: 0px 3px;
        font-size: 12px;
        border: 1px solid #ddd;
        height: 20px;
        line-height: 20px;
    }
    .discount-item.active {
        color: #fff;    
        background-color: #00aee0;
        border-color: #00aee0;
    }
    .intro-section {
        position: relative;
        float: left;
        width: 260px;
        height: 285px;
        border: 1px solid #ddd;
        margin-right: 20px;
        overflow: hidden;
    }
    .shape-top {
        height: 63px;
        background-color: #b9bebf;
    }
    .shape-top .shape-cover {
        position: absolute;
        top: 34px;
        left: -11px;
        width: 300px;
        height: 47px;
        transform: rotate(7deg);
        background-color: #fff;
    }
    .intro-text {
        height: 157px;
        padding-top: 40px;
        font-size: 26px;
        font-weight: bold;
        text-align: center;
        letter-spacing: 3px;
        color: #139bd4;
    }
    .shape-bottom {
        height: 63px;
        background-color: #b9bebf;
    }
    .shape-bottom .shape-cover {
        position: absolute;
        bottom: 34px;
        left: -11px;
        width: 300px;
        height: 53px;
        transform: rotate(10deg);
        background-color: #fff;
    }
    
    .intro {
        position: relative;
    }
    .intro h3 {
        font-size: 18px;
        padding-left: 20px;
        margin-bottom: 20px;
        border-left: 5px solid #149bd2;
    }
    .intro h4 {
        font-size: 16px;
        padding-bottom: 7px;
    }
    .intro .text, .intro .features{
        position: relative;
        padding-left: 15px;
        font-size: 16px;
        color: #666;
        padding-bottom: 30px;
    }
    .intro .text p {
        line-height: 1.8;
    }
    .intro .gray-line {
        display: inline-block;
        position: absolute;
        top: 11px;
        left: 130px;
        height: 1px;
        width: 1000px;
        background-color: #ddd;
    }
    .intro .features {
        height: 240px;
    }
    .intro .features h4 {
        padding-bottom: 20px;
    }
    .intro .features .gray-line {
        left: 95px;
        width: 1035px;
    }
    .intro .features li {
        float: left;
        width: 280px;
        height: 130px;
        border-left: 1px solid #ddd;
        text-align: center;
    }
    .intro .features li:last-child {
        border-right: 1px solid #ddd;
    }
</style>