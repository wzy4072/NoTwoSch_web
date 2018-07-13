<template>
    <div style="padding:30px 50px;" id="goods-existing">
        <v-spin :spinning="spinning">
            <v-card title="我的产品">
                <div v-if="purchasedProducts.length !== 0">
                    <div class="main">
                        <h3>已开通的产品和服务</h3>
                        <ul>
                            <good-existing v-if="CMSInfo!=null" :goodInfo="CMSInfo"></good-existing>
                            <good-existing v-if="roadInfo!=null" :goodInfo="roadInfo"></good-existing>
                        </ul>
                    </div>
                    <div v-if="roadInfo!=null" class="road-inners">
                        <h3>申报确报单数</h3>
                        <v-data-table :data='roadInnersData'
                                      :columns='roadInnersColumns'>
                            <template slot="th" slot-scope="props">
                                <strong v-if="props.column.field=='operate'">按钮</strong>
                                <strong v-else v-html="props.title"></strong>
                            </template>
                            <template slot="td" slot-scope="props">
                                <div v-if="props.column.field=='operate'">
                                    <v-button type="primary"
                                              class="buy-btn"
                                              @click="goToGoodsList('ROAD')" ><span>购买</span></v-button>
                                </div>
                                <span v-else-if="props.column.field=='now'"
                                      style="color: #00aee0"
                                      v-html="props.content"></span>
                                <span v-else v-html="props.content"></span>
                            </template>
                        </v-data-table>
                    </div>
                </div>
                <div v-else class="empty">
                    <a href="/company/#/goods/listing"><img src="/static/images/goods/empty.png" alt=""></a>
                </div>
            </v-card>
        </v-spin>
    </div>
</template>

<script>
    import goodExisting from "@/components/dataDisplay/goodExisting.vue";
    import api from "@/api/company/goods.js";
    export default {
        components: {
            goodExisting: goodExisting
        },
        data() {
            return {
                spinning: false,
                roadInnersColumns: [
                    {title:"名称",field:'name'},
                    {title:"总单数(单)",field:'total'},
                    {title:"已使用(单)",field:'used'},
                    {title:"现有单数(单)",field:'now'},
                    {title:"赠送单数(单)",field:'presents'},
                    {title:"按钮",field:'operate'},
                ],
                CMSInfo: null,
                roadInfo: null,
                purchasedProducts: [],
            }
        },
        methods: {
            roadInnersData() {
                return api.getCapacity(this.$store.getters.currentCorporate.id)
                    .then(resp => {
                        var arr = JSON.parse(JSON.stringify(resp));
                        return {result: (function() {
                            for (var i = 0; i < arr.length; i++) {
                                arr[i].now =  arr[i].total - arr[i].used;
                            }
                            return arr;
                        })()}
                    })
            },
            getPurchasedProducts() {
                return this.$store.getters.getPurchasedProducts;
            },
            /**
             * 获得报关制单应用信息
             * @NOTE CMS-Client 和 CMS是排他的，不可能两个都存在
             * @param purchasedProducts
             */
            getCMSInfo(purchasedProducts) {
                for(var i = 0;i < purchasedProducts.length; i++) {
                    if(purchasedProducts[i].code === "CMS-Client" || purchasedProducts[i].code === "CMS") {
                        this.CMSInfo = JSON.parse(JSON.stringify(purchasedProducts[i]));
                        this.CMSInfo.code = "CMS";
                        this.CMSInfo.canExtend = true && this.CMSInfo.alias != "FREE";
                        this.CMSInfo.canUpgrade = true;
                        if(purchasedProducts[i].code === "CMS") {
                            this.CMSInfo.variationCode = "CMS";
                            this.CMSInfo.name = "报关申报服务端";
                        }else {
                            this.CMSInfo.variationCode = "CMS-Client";
                            this.CMSInfo.name = "委托服务客户端";
                        }
                    }
                }
            },
            getRoadInfo(purchasedProducts) {
                for(var i = 0;i < purchasedProducts.length; i++) {
                    if(purchasedProducts[i].code === "ROAD") {
                        this.roadInfo =JSON.parse(JSON.stringify(purchasedProducts[i]));
                        this.roadInfo.code = "ROAD";
                        this.roadInfo.canExtend = false;
                        this.roadInfo.Upgrade = false;
                        this.roadInfo.name = "舱单代理申报服务";
                    }
                }
            },
            goToGoodsList(flag) {
                if(flag === "ROAD") {
                    this.$router.push({path: '/goods/listing/ROAD'});
                }
            }
        },
        created() {
            this.purchasedProducts = this.getPurchasedProducts();
            this.getCMSInfo(this.purchasedProducts);
            this.getRoadInfo(this.purchasedProducts);

            
        },
    }
</script>
<style>
    /*覆盖表格的默认样式*/
    #goods-existing .ant-table-tbody>tr>td, 
    #goods-existing .ant-table-thead>tr>th {
        padding: 11px 8px;
    }
    #goods-existing .ant-table-thead > tr {
        background-color: #fbfbfb;  
    }
    #goods-existing .ant-table-thead strong {
        font-weight: normal;
        color: #777;
    }
    #goods-existing .ant-table-tbody td > span{
        font-size: 18px;
        color: #666;
    }
    #goods-existing table th,
    #goods-existing table td {
        text-align: center;
    }
    #goods-existing table td {
        height: 60px;
    }
</style>
<style scoped>
    h3 {
        font-size: 16px;
        margin-bottom: 25px;
        padding-left: 10px;
        border-left: 4px solid #149bd2;
    }
    .main {
        padding-bottom: 30px;
    }
    .main ul:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
    .buy-btn {
        width: 80px;
        height: 30px;
    }
    .empty {
        padding: 50px 0;
        text-align: center;
    }
</style>