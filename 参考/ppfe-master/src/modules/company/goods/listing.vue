<template>
    <div style="padding:30px 50px;" id="goods-list">
        <v-card title="产品列表" id="goods-card">
            <v-tabs :active-tab-key="activeTabKey">
                <v-tab-pane tab-key="CMS" tab="报关管理软件">
                    <item-c-m-s :CMSVersion="CMSVersion"></item-c-m-s>
                </v-tab-pane>
                <v-tab-pane tab-key="ROAD"
                            v-if="isRoadShow"
                            tab="舱单共享服务">
                    <item-road></item-road>
                </v-tab-pane>
            </v-tabs>
        </v-card>
    </div>
</template>

<script>
    import itemCMS from "@/modules/company/goods/CMS.vue";
    import itemRoad from "@/modules/company/goods/road.vue";
    import tool from "@/api/tool.js"
    import feature from '@/components/feature'
    export default {
        components: {
            itemCMS: itemCMS,
            itemRoad: itemRoad
        },
        data() {
            return {
                isRoadShow: false,
                activeTabKey: "CMS",
                CMSVersion: "CMS",
                goodCode: null,
            }
        },
        computed: {
            
        },
        methods: {
            jumpToGood(goodCode) {
                if(!goodCode) {
                    return 
                }else if(goodCode === "CMS" || goodCode === "CMS-Client") {
                    this.activeTabKey = "CMS";
                    this.CMSVersion = goodCode;
                }else if(goodCode === "ROAD") {
                    this.activeTabKey = "ROAD";
                }
                
            }
        },
        created() {
            this.goodCode = this.$route.params.goodCode;
            this.jumpToGood(this.goodCode);
            if(feature.hasFeature('ROAD')) {
                this.isRoadShow = true;
            }
        },
        beforeRouteEnter (to, from, next) {
            if(from.name === "goodsOrder") {
                next(vm => {
                    vm.$store.dispatch('reloadContext')
                        .then(ctx => {
                            
                        })
                        .catch(error => {
                            window.location = '/';
                        });
                })
            }else {
                next(vm => {

                })
            }
            
        }
    }
</script>

<style scoped>
    
</style>
<style>
    #goods-card {
        width: 1200px;
        font-family: "Microsoft YaHei", "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    #goods-list .ant-card-head-title {
        font-size: 16px;
        font-weight: bold;
    }
    #goods-list .ant-tabs-bar {
        border-color: transparent;
        margin-bottom: 20px;
    }
    #goods-list .ant-tabs-ink-bar {
        bottom: -1px;
    }
    #goods-list .ant-tabs-nav {
        box-sizing: border-box;
        border-bottom: 2px solid rgb(217, 217, 217);
    }
    #goods-list .ant-tabs-tab {
        margin-right: 0;
        font-size: 16px;
        /*padding: 0;*/
        /*margin: 8px 20px;*/
        /*border-right: 2px solid rgb(217, 217, 217);*/
    }
    #goods-list .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active {
        color: #333;
    }
    #goods-list .ant-tabs-nav .ant-tabs-tab {
        color: #999;
    }
    #goods-list .ant-tabs-nav .ant-tabs-tab:hover {
        color: #333;
    }
</style>