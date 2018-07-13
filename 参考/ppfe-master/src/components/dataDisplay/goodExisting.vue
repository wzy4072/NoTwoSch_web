<template>
    <li>
        <h4>{{goodInfo.name}}</h4>
        <div class="good-content">
            <h5>{{getVariationCode()}}</h5>
            <div>
                <span>截至日期：</span>
                <span :class="{'text-content': true, 'align-right': !goodInfo.canExtend && !goodInfo.canUpgrade}">{{getDate()}}</span> 
                <i v-if="goodInfo.canExtend" @click="renew">续费</i>
            </div>
            <div>
                <span>成&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员：</span>
                <span v-html="getPeople()"
                      :class="{'text-content': true, 'align-right': !goodInfo.canExtend && !goodInfo.canUpgrade}"></span>
                <i v-if="goodInfo.canUpgrade" @click="upgrade">升级</i>
            </div>
            <div>
                <span>付费方式：</span>
                <span :class="{'text-content': true, 'align-right': !goodInfo.canExtend && !goodInfo.canUpgrade}">{{getSaleUnit()}}</span>
            </div>
        </div>
    </li>
</template>

<script>
    import timestampApi from '@/api/tool.js';
    
    export default {
        props: {
            goodInfo: {
                type: Object
            }
        },
        data() {
            return {
                peopleMap: {
                    "8": "TEAM8"  ,
                    "15": "TEAM15",
                    "30": "TEAM30",
                    "FREE": "限<i>2</i>名成员"  ,
                    "TEAM8": "限<i>8</i>名成员"  ,
                    "TEAM15": "限<i>15</i>名成员",
                    "TEAM30": "限<i>30</i>名成员",
                },
                salesUnitMap: {
                    month: "月付",
                    year: "年付"
                }
            }
        },
        computed: {
            
        },
        methods: {
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            getDate() {
                return this.goodInfo.endTime == null ? "无限" : this.timestampToDate(this.goodInfo.endTime);
            },
            getPeople() {
                if(this.goodInfo.code === "ROAD") {
                    return "无限制"
                }else if(this.goodInfo.code === "CMS") {
                    return this.peopleMap[this.goodInfo.alias];
                }
            },
            getSaleUnit() {
                return this.goodInfo.salesUnit == null ? "—" : this.salesUnitMap[this.goodInfo.salesUnit];
            },
            getVariationCode() {
                if(this.goodInfo.code === "CMS") {
                    return "管理版";
                }else if(this.goodInfo.code === "ROAD") {
                    return "深圳公路舱单";
                }
                
            },
            renew() {
                if(this.goodInfo.salesUnit == null) {
                    this.$message.error("无期限产品无需续费！", 4);
                    return;
                }
                this.$router.push({
                    name: 'goodsOrder',
                    params: {
                        info: JSON.stringify({
                            code: "CMS",
                            variationCode: this.goodInfo.variationCode,
                            salesUnit: "month",
                            qty: 1,
                            behavior: "ENTERPRISE",
                            currency: "CNY",
                            type: "VOUCHER_EXTEND"
                        })
                    }
                });
            },
            upgrade() {
                this.$router.push("/goods/listing/"+this.goodInfo.variationCode);
            }
        },
        created() {
            
        }
    }
</script>
<style>
    .good-content .text-content i {
        font-style: normal;
        color: #00aee0;
    }
</style>
<style scoped>
    li {
        float: left;
        margin-right: 20px;
        position: relative;
        width: 320px;
        height: 220px;
        border: 1px solid #ddd;
    }
    li:before, li:after {
        content: "";
        position: absolute;
        top: 28px;
        width: 10px;
        height: 20px;
        border: 1px solid #ddd;
        background-color: #fff;
    }
    li:before {
        border-top-left-radius: 0px 0px;
        border-top-right-radius: 100% 50%;
        border-bottom-right-radius: 100% 50%;
        border-bottom-left-radius: 0px 0px;
        border-left: none;
        left: -1px;
    }
    li:after {
        border-radius: 100% 0 0 100%/50%;
        border-right: none;
        right: -1px;
    }
    h4 {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        letter-spacing: 3px;
        text-align: center;
        color: #777;
        border-bottom: 2px dashed #e6e6e6;
    }
    h5 {
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #666;
    }
    span {
        letter-spacing: 2px;
    }
    .good-content {
        padding: 0 20px;
        background-color: #fbfbfb;
        height: 178px;
    }
    .good-content > div {
        position: relative;
        color: #333;
        font-size: 16px;
        height: 36px;
        line-height: 36px;
    }
    .good-content > div span {
        color: #666;
    }
    .good-content > div i {
        position: absolute;
        right: 10px;
        cursor: pointer;
        font-style: normal;
        color: #00aee0;
    }
    .good-content > div s {
        text-decoration: none;
        color: #00aee0;
    }
    .align-right {
        display: inline-block;
        width: 170px;
        text-align: right;
    }
    .text-content {
        font-weight: bold;
    }
</style>