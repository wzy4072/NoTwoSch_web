<template>
    <v-spin :spinning="spinning" tip="处理中">
        <div id="list-content" style="padding: 50px 0">
            <ul>
                <li v-for= " productData in listData "
                    class= "product-item">
                    <div class="left">
                        
                    </div>
                    <div class="right">
                        <h3 style="text-align: center">{{productData.product.name}}</h3>
                        <div>
                            <span>产品介绍：</span>
                            <span>{{productData.product.description}}</span>
                        </div>
                        <div>
                            <span>价格：</span>
                            <span>{{currentPrice[productData.product.code]}}</span>
                        </div>
                        <div>
                            <span>类型：</span>
                            <!-- 这里有冗余是因为vue中v-if和v-for不推荐写在一个元素中，实际只有chooseVariation传参的区别 -->
                            <ul v-if="hasSaleUnit(productData.product.code)">
                                <li v-for=" variation in productData.product.variations"
                                    @click="chooseVariation(variation, productData.product.code)"
                                    v-bind:class="{ 'active': currentVariations[productData.product.code].code === variation.code }">
                                    {{variation.alias}}  {{variation.code}}
                                </li>
                            </ul>
                            <ul v-else>
                                <li v-for=" variation in productData.product.variations"
                                    @click="chooseVariation(variation, productData.product.code, variation.code)"
                                    v-bind:class="{ 'active': currentVariations[productData.product.code].code === variation.code }">
                                    {{variation.alias}}  {{variation.code}}
                                </li>
                            </ul>
                        </div>

                        <div v-if="hasSaleUnit(productData.product.code)">
                            <span>购买单位：</span>
                            <ul >
                                <li v-for=" (value, key) in pricesData[productData.product.code][currentVariations[productData.product.code].code]"
                                    @click="chooseUnit(key, value, productData.product.code)"
                                    v-bind:class="{ 'active': currentUnits[productData.product.code] === key }">
                                    {{key}}
                                </li> 
                            </ul>
                        </div>
                        <div>
                            <span>购买数量：</span>
                            <v-input-number :min="1" 
                                            :max="99"
                                            v-model="currentQuantity[productData.product.code]"
                            ></v-input-number>
                        </div>
                        <div>
                            <!--<span>类型介绍：</span><span>这是描述这是描述这是描述这是描述</span>-->
                        </div>
                        <br>
                        <div>
                            <v-button type="primary"
                                      @click="goToPay(productData.product.code, productData.id)"
                                      size="large">点击购买</v-button>
                        </div>
                    </div>
                    
                </li>
            </ul>
        </div>
    </v-spin>
</template>

<script>
    import api from "@/api/root/pay.js";

export default {
    data() {
        return {
            spinning: false,
            listData: [],
            pricesData: {},
            currentVariations: {},
            currentPrice: {},
            currentUnits: {},
            currentQuantity: {},
            buyerInfo: {
                type: "corporate",
                id: null
            }
        }
    },
    methods: {
        hasSaleUnit(productCode) {
            var prices = this.pricesData[productCode];
            for(var key in prices) {
                if(typeof prices[key] === "object") {
                    return true
                }else {
                    return false
                }
            }
        },
        chooseVariation(variation, productCode, variationCode) {
            this.currentVariations[productCode] = variation;
            if(variationCode) {
                var price = this.pricesData[productCode][variationCode];
                this.currentPrice[productCode] = price;
            }else {
                this.clearUnits(productCode);
            }
            
        },
        chooseUnit(unit, price, productCode) {
            this.currentUnits[productCode] = unit;
            this.currentPrice[productCode] = price;
        },
        clearUnits(productCode) {
            this.currentUnits[productCode] = null;
            this.currentPrice[productCode] = null;
        },
        goToPay(productCode, productID) {
            if(!productCode || !productID || !this.currentVariations[productCode].code || this.buyerInfo.id != null) {
                return;
            }
            var options = {
                productId: productID,
                variationCode: this.currentVariations[productCode].code, 
                quantity: this.currentQuantity[productCode],              
                currency: 'CNY',          
                buyer: this.buyerInfo
            };
            
            this.$router.push({
                name: 'orderView',
                params: {
                    info: JSON.stringify(options)
                }
            });
        },
        arrangePrice(list) {
            var obj = {};
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if(!(item.variationCode in obj)) {
                    obj[item.variationCode] = {}
                }
                if(item.saleUnit) {
                    obj[item.variationCode][item.saleUnit] = item.unitPrice;
                }else {
                    obj[item.variationCode] = item.unitPrice;
                }
            }
            return obj;
        },
        sortPricesData(list) {
            var obj = {};
            for (var i = 0; i < list.length; i++) {
                obj[list[i].product.code] = this.arrangePrice(list[i].prices);
            }
            return obj;
        },
        initStructuredObj(list, initData) {
            var obj = {};
            for (var i = 0; i < list.length; i++) {
                obj[list[i].product.code] = initData || null;
            }
            return obj;
        },
        show401Modal () {
            var vm = this;
            this.$modal.confirm({
                title: '您当前未登录，请先登录',
                content: "",
                onOk: function () {
                    vm.$router.push("/login")
                },
                onCancel: function () {}
            })
        }
    },
    computed: {
        
    },
    created() {
       this.spinning = true;
       api.getBuyerInfo()
           .then(resp => {
               if(resp && resp.companyList && resp.companyList[0] && resp.companyList[0].id != null) {
                   this.buyerInfo.id = resp.companyList[0].id;
               }else {
                   this.$message.error("购买产品必须创建公司或成为公司成员", 4);
               }
           })
           .catch(err => {
               this.spinning = false;
               if(err.status === 401) {
                   this.show401Modal();
               }
           });
       api.getGoodsList(this.$route.query.q || null)
           .then(resp => {
               this.listData = resp.result;
               this.pricesData = this.sortPricesData(this.listData);
               
               this.currentVariations = this.initStructuredObj(this.listData, {});
               this.currentPrice = this.initStructuredObj(this.listData, null);
               this.currentUnits = this.initStructuredObj(this.listData, null);
               this.currentQuantity = this.initStructuredObj(this.listData, 1);
               
               this.spinning = false;
           })
           .catch(err => {
               this.spinning = false;
               this.$message.error(err, 4);
           })
    },
    watch: {
        
    }
}
</script>
<style scoped>
    .product-item {
        margin: 0 auto;
        width: 800px;
        font-size: 16px
    }
    .product-item .left, .product-item .right {
        float: left;
    }
    .product-item:before, .product-item:after, .product-item ul:before, .product-item ul:after {
        clear: both;
        display: table;
        content: " ";
    }
    .product-item li {
        float: left;
        margin-right: 30px;
        border: 1px solid #eee;
        padding: 3px 10px;
        cursor: pointer;
    }
    .product-item li.active {
        border: 1px solid #e3393c !important;
    }
</style>
