<template>
    <div id="CMS-list">
        <v-tabs :active-tab-key="CMSVersion">
            <v-tab-pane tab-key="CMS"
                        :calss="{'active': true}"
                        tab="报关申报服务端">
                <c-m-s-declare></c-m-s-declare>
            </v-tab-pane>
            <v-tab-pane v-if="isRoadShow"
                        tab-key="CMS-Client"
                        tab="委托服务客户端" >
                <c-m-s-client></c-m-s-client>
            </v-tab-pane>
        </v-tabs>
    </div>
</template>

<script>
    
    import feature from '@/components/feature';
    import CMSDeclare from "@/modules/company/goods/CMSDeclare.vue";
    import CMSClient from "@/modules/company/goods/CMSClient.vue";
    export default {
        props: {
            CMSVersion: {
                type: String,
                default: "CMS"
            }
        },
        components: {
            CMSDeclare: CMSDeclare,
            CMSClient: CMSClient    
        },
        data() {
            return {
                isRoadShow: false,
                
            }
        },
        computed: {
            
        },
        methods: {
            
        },
        created() {
            if(feature.hasFeature('ROAD')) {
                this.isRoadShow = true;
            }
            
        }
    }
</script>
<style>
    #CMS-list .good-variation img {
        position: relative;
    }
    #CMS-list .ant-tabs-bar {
        margin-bottom: 10px;
    }
    #CMS-list .ant-tabs-ink-bar-animated {
        display: none;
    }
    #CMS-list .ant-tabs-nav {
        height: 41px;
        position: relative;
        left: 433px;
        border: 0;
    }
    #CMS-list .ant-tabs-tab {
        width: 130px;
        height: 40px;
        font-size: 14px;
        padding: 9px 0 0 15px;
        border: 1px solid #ddd;
    }
    #CMS-list .ant-tabs-tab-active {
        background-color: #ff5b3b;
        color: #fff !important;
        border-color: #ff5b3b;
    }
    #CMS-list .ant-tabs-tab.ant-tabs-tab-active:hover {
        color: #fff !important;
    }
    #CMS-list .ant-tabs-tab:hover {
        color: #999 !important;
    }
</style>
