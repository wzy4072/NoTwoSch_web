<template>
    <div class="headnav">
        <v-row :gutter="8">
            <v-col span="12" class="navcol">
                <v-badge :count="messageCount">
                       <router-link to='/message'>
                            <div class="qukenav qknav1"></div></router-link>
                </v-badge>
                <p>{{navInfo.msgName}}</p>
            </v-col>
            <v-col span="12" class="navcol">
                    <div class="qukenav qknav2" @click="vistiOpen(navInfo.guideLink)"></div>
                <p>{{navInfo.guideName}}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col span="12" class="navcol">
                <div class="qukenav qknav3" @click="vistiOpen(navInfo.searchLink)"></div>
                <p>{{navInfo.searchName}}</p>
            </v-col>
            <v-col span="12" class="navcol">
                    <div class="qukenav qknav4" @click="vistiOpen(navInfo.comLink)"></div>
                    <p>{{navInfo.comName}}</p>
            </v-col>
        </v-row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                 navInfo: {
                    msgName: '消息', msgCount: 0, msgLink:'/message',
                    guideName: '指南',guideLink:'http://www.yunbaoguan.cn/home/guide.html#section-11',
                    searchName: '查询', searchLink:'http://www.yunbaoguan.cn/Yunbaike/HSsearch.html',
                    comName: '资讯', comLink: 'http://www.customs.gov.cn'
                 },
            }
        },
          computed: {           
             messageCount() {
                 let num = this.$store.getters.getMessageCount;
                return  parseInt(num) || null;
            },
        },
        methods:{
            vistiLink(href){ if(href == ''){ return false; }  else{  window.location.href=href; } },
            vistiOpen(href){ if(href == ''){ return false; }  else{  window.open(href); }  },
        }
    }
</script>
<style scoped>
    .headnav {
        height: 286px;
        background-color: #fff;
    }

    .headnav .navcol {
        text-align: center;
        margin-top: 48px;
    }

    .headnav .navcol p {
        margin-top: 4px;
        font-size: 16px;
    }

    .headnav .navcol .qukenav {
        height: 40px;
        width: 40px;
        background-size: cover;
        margin: 0 auto;
        background: no-repeat url('/static/images/home/headqukenav.png');
        cursor: pointer;
    }

    .headnav .navcol .qukenav.qknav1 {
        background-position: 0 0;
    }

    .headnav .navcol .qukenav.qknav2 {
        background-position: -57px 0;
    }

    .headnav .navcol .qukenav.qknav3 {
        background-position: -114px 0;
    }

    .headnav .navcol .qukenav.qknav4 {
        background-position: -172px 0;
    }

   
</style>
<style>
    /* 徽标 */
    .headnav .navcol .ant-badge-count {
        right: -16px;
    }
</style>