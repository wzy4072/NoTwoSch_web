<template>
    <v-spin :spinning="spinning">
        <ul>
            <slot name="introSection"></slot>
            <li class="section free">
                <div class="section-body">
                    <div class="label"></div>
                    <h4>免费版</h4>
                    <p class="price-number">
                        <span>￥</span>
                        0
                    </p>
                    <p class="description">2名成员</p>
                    <p class="good-variation">不限时免费使用</p>
                </div>
                <div class="section-footer">
                    <v-button type="primary"
                              :disabled="!canFreeBtnClick"
                              @click="goToProductOrder()"
                              size="large">马上开通</v-button>
                </div>
            </li>
            <li class="section is-focus">
                <div class="good-unit-change">
                    <ul>
                        <li @click="changeTime('month')"
                            v-bind:class="{ 'is-active': time === 'month' }"
                        >月付</li>
                        <li @click="changeTime('year')"
                            v-bind:class="{ 'is-active': time === 'year' }"
                        >年付</li>
                    </ul>
                    <span class="extra"><img src="/static/images/goods/arrow.png" alt="">&nbsp;最低可达4折哦!</span>
                </div>
                <div class="section-body">
                    <div class="label"></div>
                    <h4>团队版</h4>
                    <p class="price-number">
                        <span>￥</span>
                        {{priceDisplay}}
                    </p>
                    <p class="description">
                        <span v-show="time === 'year'">年省{{saveDisplay}} 合计：{{amountToMonth}}元/月</span>
                    </p>
                    <p class="good-variation">
                        <img :src="reduceImgSrc"
                             @click="changePeople('reduce')"
                             alt=""
                             style="left: -5px">
                        <span >{{people}}</span>名成员
                        <img :src="plusImgSrc"
                             @click="changePeople('plus')"
                             alt=""
                             style="left: 5px">
                    </p>
                </div>
                <div class="section-footer">
                    <v-button type="primary"
                              @click="goToOrder"
                              size="large">{{buyDisplay}}</v-button>
                </div>
            </li>
            <li class="section">
                <div class="section-body">
                    <div class="label"></div>
                    <h4>定制版</h4>
                    <p style="padding-bottom: 40px;">
                        <img src="/static/images/goods/logo.png" alt="" style="    position: relative;top: 10px;left: 78px;height: 100px;">
                    </p>
                </div>
                <div class="section-footer">
                    <p class="space-number">
                        个性化定制需求
                    </p>
                </div>
            </li>

        </ul>
    </v-spin>
</template>

<script>
    import api from "@/api/company/goods.js";
    import compareTable from "@/components/dataDisplay/CMSCompareTable"

    export default {
        props: {
            isClient: {
                type: Boolean
            },
        },
        data() {
            return {
                spinning: false,
                allDisable: false,
                alreadyInfo: {},
                priceList: {
                    "8": {
                        // 每月定价
                        month: 999,
                        // 年度折扣额
                        year: 6999,
                        // 年节约额
                        savingYear: 4989,
                        // 平均每月
                        amountToMonth: 583
                    },
                    "15": {
                        month: 1999,
                        year: 12999,
                        savingYear: 10989,
                        amountToMonth: 1083
                    },
                    "30": {
                        month: 3999,
                        year: 19999,
                        savingYear: 27989,
                        amountToMonth: 1667
                    }
                },
                time: "month",
                people: "8",
                plusImgSrc: "/static/images/goods/plus_blue.png",
                reduceImgSrc: "/static/images/goods/reduce_grey.png",
                orderInfo: {},
                peopleMap: {
                    "8": "TEAM8"  ,
                    "15": "TEAM15",
                    "30": "TEAM30",
                    "FREE": "2"  ,
                    "TEAM8": "8"  ,
                    "TEAM15": "15",
                    "TEAM30": "30",
                },
                // unit的叫法来源于后台，实际就是time
                unitMap: {
                    "year": "年付",
                    "mouth": "月付"
                },
            }
        },
        computed: {
            priceDisplay() {
                return this.priceList[this.people][this.time];
            },
            saveDisplay() {
                return this.priceList[this.people]["savingYear"];
            },
            amountToMonth() {
                return this.priceList[this.people]["amountToMonth"];
            },
            buyDisplay() {
                if(!this.alreadyInfo.alias || this.alreadyInfo.alias === "FREE"){
                    return "马上抢购";
                }else {
                    return "马上升级";
                }
            },
            canFreeBtnClick() {
                var alreadyGoods = this.getState();
                for(var i = 0;i < alreadyGoods.length; i++) {
                    if(alreadyGoods[i].code === this.callerCode()) {
                        this.alreadyInfo = alreadyGoods[i];
                        return !this.alreadyInfo.alias;
                    }
                }
                return true;
            },
            isAllDisable() {
                var alreadyGoods = this.getState();
                var CMSDeclare = {};
                for(var i = 0;i < alreadyGoods.length; i++) {
                    if(alreadyGoods[i].code === this.contrastCode()) {
                        CMSDeclare = alreadyGoods[i];
                    }
                }
                return CMSDeclare.alias;
            }
        },
        methods: {
            // 调用者的code，要么是CMS-client，要么是CMS
            callerCode() {
                return this.isClient ? "CMS-Client" : "CMS";
            },
            // 与调用者相反的版本code
            contrastCode() {
                return this.isClient ? "CMS" : "CMS-Client";
            },
            changePeople(flag) {
                var num = this.people;
                var alreadyPeople = this.peopleMap[this.alreadyInfo.alias];
                if(flag === "plus") {
                    if(num === "8") {
                        this.people = "15";
                        this.reduceImgSrc = "/static/images/goods/reduce_blue.png";
                    }else if(num === "15") {
                        this.people = "30";
                        this.plusImgSrc = "/static/images/goods/plus_grey.png";
                        this.reduceImgSrc = "/static/images/goods/reduce_blue.png";
                    }
                }else if(flag === "reduce") {
                    if(num === "15") {
                        if(+alreadyPeople >= 8) {
                            this.reduceImgSrc = "/static/images/goods/reduce_grey.png";
                            return;
                        }
                        this.people = "8";
                        this.reduceImgSrc = "/static/images/goods/reduce_grey.png";
                        this.plusImgSrc = "/static/images/goods/plus_blue.png";
                    }else if(num === "30") {
                        if(+alreadyPeople >= 15) {
                            this.reduceImgSrc = "/static/images/goods/reduce_grey.png";
                            return;
                        }
                        if(+alreadyPeople >= 8) {
                            this.reduceImgSrc = "/static/images/goods/reduce_grey.png";
                        }
                        this.people = "15";
                        this.plusImgSrc = "/static/images/goods/plus_blue.png";
                    }
                }
            },
            changeTime(flag) {
                if(flag === "month") {
                    this.time = "month";
                }else if(flag === "year"){
                    this.time = "year";
                }
            },
            goToProductOrder() {
                if(this.alreadyInfo.alias) {
                    return;
                }
                if(this.isAllDisable) {
                    this.$message.error("已经购买另一个版本，请不要重复购买！", 4);
                    return;
                }
                this.$router.push({
                    name: 'goodsOrder',
                    params: {
                        info: JSON.stringify({
                            code: this.callerCode(),
                            variationCode: "FREE",
                            saleUnit: null,
                            qty: 1,
                            behavior: "ENTERPRISE",
                            currency: "CNY",
                            type: "VOUCHER"
                        })
                    }
                });
            },
            goToOrder() {
                if(this.isAllDisable) {
                    this.$message.error("已经购买另一个版本，请不要重复购买！", 4);
                    return;
                }
                
                var type = "VOUCHER";
                if(this.alreadyInfo.alias){
                    type = "VOUCHER_UPGRADE";
                }else {
                    type = "VOUCHER";
                }
                this.$router.push({
                    name: 'goodsOrder',
                    params: {
                        info: JSON.stringify({
                            code: this.callerCode(),
                            variationCode: this.peopleMap[this.people],
                            saleUnit: this.time,
                            qty: 1,
                            behavior: "ENTERPRISE",
                            currency: "CNY",
                            type: type
                        })
                    }
                });
            },
            getState() {
                return this.$store.getters.getPurchasedProducts;
            },
            renewState(alreadyGoods) {
                for(var i = 0;i < alreadyGoods.length; i++) {
                    if(alreadyGoods[i].code === this.callerCode()) {
                        this.alreadyInfo = alreadyGoods[i];
                    }
                }
                if( this.alreadyInfo.alias &&
                    this.alreadyInfo.alias !=="FREE")
                {
                    this.time = this.alreadyInfo.unit || "month";
                    var people = this.peopleMap[this.alreadyInfo.alias];
                    if(people === "8" ) {
                        this.people = "15";
                    }else if(people === "15") {
                        this.people = "30";
                    }else {
                        this.people = people;
                    }

                }
            },
        },
        created() {
            this.renewState(this.getState());
        },
    }
</script>
<style>

</style>
<style scoped>
    @import '/static/css/good-item.css';
    ul {
        height: 285px;
    }
    .good-unit-change {
        position: absolute;
        top: -8px;
        left: 65px;
        width: 122px;
        padding-bottom: 20px;
        text-align: center;
        font-size: 14px;
    }
    .good-unit-change .extra{
        display: inline-block;
        width: 140px;
        position: absolute;
        top: -14px;
        left: 112px;
        color: #00aee0;
    }
    .good-unit-change .extra img {
        position: relative;
        top: 4px;
        left: 0;
    }
    .good-unit-change ul {
        display: inline-block;
        border: 1px solid #ddd;
        width: 122px;
        height: 27px;
    }
    .good-unit-change li{
        float: left;
        line-height: 25px;
        width: 60px;
        height: 25px;
        cursor: pointer;
        background-color: #fff;
    }
    .good-unit-change li.is-active {
        background-color: #ddd;
    }
    .good-main .free .description {
        text-align: center;
        padding-top: 20px;
        height: 30px;
        font-size: 18px;
        color: #333;
    }
</style>