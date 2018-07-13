<template>
    <div id="homepage">
        <v-row>
            <v-col span="6">
                <div class="avatar-warp">
                    <head-avatar 
                    :id="currentCorporate.logo"
                    ></head-avatar>
                </div>
            </v-col>
            <v-col span="8" class="staff-msg">
                <div class="staff-info">
                    <v-row class="staff-na">
                        <strong>{{loginContext.person.name || ' '}}</strong> <span>,您好！</span>
                        <p class="welcome-text">欢迎使用一站式通关服务平台</p>
                    </v-row>
                    <v-row class="staff-depar weight">
                        <span>{{currentCorporate.name}}</span> 
                    </v-row>
                    <v-row class="staff-depar">
                        <span style="font-size: 14px">岗位：{{getUserRole()}}</span> 
                    </v-row>
                    <v-row>
                        <span style="font-size: 14px">上次登录：{{epochToSecondTime(loginContext.lastLogin)}}</span>
                    </v-row>
                    <router-link to="/companyinfo">
                        <img class="setimg" style="display:block;" src="/static/images/home/tocom.png">
                    </router-link>
                </div>
            </v-col>
            <v-col span="10" class="nav-warp">
                <home-calendar></home-calendar>
            </v-col>
        </v-row>
        <div class="interlayer"></div>
        
        <!--使用指引-->
        <home-guide></home-guide>
        <div class="interlayer"></div>

        <!-- 应用入口-->
        <home-app></home-app>
        <div class="interlayer"></div>
    </div>
</template>
<script>
    import timestampApi from '@/api/tool.js';
    
    import headAvatar from '@/components/dataDisplay/headAvatar.vue'
    
    import homeCalendar from '@/components/dataDisplay/homeCalendar.vue'
    import homeGuide from '@/components/dataDisplay/homeGuide.vue'
    import homeApp from '@/components/dataDisplay/homeApp.vue'
    export default {
        components: {
            'headAvatar': headAvatar,
            'homeCalendar':homeCalendar,
            'homeGuide': homeGuide,
            'homeApp': homeApp
        },
        data() {
            return {
               
                 rolNames:'',
                 haveRoles:false,
            }
        },
        computed: {
            loginContext() {                
                return this.$store.getters.loginContext == null ? { currStaff:null } : this.$store.getters.loginContext;
            },
            currentCorporate() {    
                if(this.$store.getters.loginContext){
                    if(this.$store.getters.loginContext.currentCorporate){
                        return this.$store.getters.loginContext.currentCorporate;
                    }else{
                        return { logo:null ,infoCompletion:0 ,naem:'您尚未加入任何公司'}
                    }
                }else{
                    return null;
                }
            }
        },
        methods:{
            epochToSecondTime(timestamp) {
                return timestampApi.epochToSecondTime(timestamp);
            },
            getUserRole(){
                if(this.loginContext.currStaff && this.loginContext.currStaff.roles ){
                    let rolNames='',rolArr = this.loginContext.currStaff.roles;
                    for(let i=0;i<rolArr.length;i++){
                        rolNames +=' '+rolArr[i].rolename
                        this.haveRoles = rolArr[i].rolecode==2 || rolArr[i].rolecode==1 ? true :false;
                    }
                    return rolNames;
                }else{
                    return '';
                }
                
            },
            getComplet(){
                let compValue = this.currentCorporate.infoCompletion
                if(compValue){
                    return  parseFloat(compValue);
                }else{
                    return 0;
                }
            }
        },
    }

</script>
<style>
    @import '/static/css/common.css';
    @import '/static/css/modal.css';
.avatar-warp{
    background:#fff;
    padding:20px 0 0 20px;
    height:288px;
    border:1px solid #e3e5e8;
    border-right: none;
    border-radius: 300px 0 0 300px;
}
.nav-warp{
    border:1px solid #e3e5e8;
    border-left: none;
}
    #homepage .ant-card-head-title {
        color: #333;
        font-weight: bold;
        font-size: 19px;
    }
    .staff-msg {
        padding: 35px;
        background-color: #fff;
        border-top:1px solid #e3e5e8;
        border-bottom: 1px solid #e3e5e8;
        padding: 20px 0 18px;
        padding: 20px 0 14px;
        
        padding-left: 0;
        height: 288px;
    }


    .staff-msg .staff-info {
        padding: 30px 15%;
        font-size: 14px;
        height: 100%;
        position: relative;
        border: 1px solid #e3e5e8;
        border-left: none;
    }

    .staff-msg .staff-info .setimg {
        position: absolute;
        right: -1px;
        bottom:  -1px;
    }


    .staff-info .staff-na {
        padding-bottom: 22px;
    }

    .staff-info .staff-na>strong {
        font-size: 28px;
        font-family: '黑体';
    }

    .staff-info .staff-na>span {
        font-size: 18px;
    }

    .staff-info .prona {
        margin: 8px 0;
    }

    .staff-info .staff-depar {
        padding: 8px 0;
    }
    .weight{
        font-size: 16px;
    }
    /* 间隔高度 */
    .interlayer {
        height: 20px;
    }
    .welcome-text {
        font-size: 16px;
        color: #00aee0;
    }
</style>
<style>
#homepage{
    padding:30px;
}
</style>
