<template>
<v-card title="增值服务:">
    <v-row :gutter ="10">
        <v-col class="msg-warp" v-for="(item,index) in imgList" :key="index" :span="6">
            <a :href="item.href" target="_blank">
            <img :src="'/static/images/home/'+item.src" alt="">
            </a>
            <p>{{item.intr}}</p>
        </v-col>
    </v-row>
</v-card>
        
</template>
<script>
    import comapi from '@/api/company/common'
    import tool from '@/api/tool';
    import config from 'appconfig';

    export default {
        // components: {},
        data() {
            return {
                imgList: [
                    {src:'app_excel.png',intr:'EXCEL制单助手', href:config.officialWebsite +'/home/plugin.html'},
                    {src:'app_cddl.png',intr:'舱单代理服务', href:config.officialWebsite +'/home/service.html'},
                    {src:'app_aeo.png',intr:'AEO认证辅导', href:config.officialWebsite +'/home/advisory.html'},
                    {src:'app_ygl.png',intr:'商品归类查询', href:config.officialWebsite +'/Yunbaike/HSsearch.html'},
                ],
            }
        },       
        methods: {
        },
    }

</script>
<style scoped>

.msg-warp>img{
    width:100%;
    display: block;
}
.msg-warp>p{
    text-align: center;
    font-size: 14px;
    margin-top: 16px;
}
</style>