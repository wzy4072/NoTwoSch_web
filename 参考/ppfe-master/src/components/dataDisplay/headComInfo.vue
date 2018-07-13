<template>
    <div class="head-msg">
        <p class="msg-st"><span>认证状态：</span>
            <span class="stu" :class="{'warn':isPending != '已认证'}" >{{isPending}}</span>
        </p>
        <p class="msg-pot">完成企业认证方可拥有开通应用等权限！</p>
        <router-link :to="'/account/certifi'"><button class="_btn _small" v-show="isPending != '已认证'">认证送大礼</button></router-link>
        <router-link :to="'/account/certifi'"><button class="_btn _small" v-show="isPending == '已认证'">查看认证信息</button></router-link>
        <div class="msg-aplist">
            <span>已开通应用：</span>
            <div class="btns have" v-for="(app,index) in appList.applications"  :key="index">{{app.appname}}</div>
            <div class="btns" v-for="(app,index2) in appList.other" :key="index2">{{app.appname}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        props:['appList','isPending'],
        data(){
            return {
            }
        },
        methods:{
        }
    }
</script>

<style scoped>
        @import '/static/css/common.css';

 .head-msg{
padding:20px;
background-color: #fff;
height: 288px;
        }
        .head-msg .msg-st{
font-family: '黑体';
font-size: 24px;
font-weight: 800;
margin:30px 0 12px;
        }
        .head-msg .msg-st .stu{
            color:#03a1ea;
        }
        .head-msg .msg-st .stu.warn{
            color:#FF513D;
        }
        .head-msg .msg-pot{
            font-size: 20px;
            color:#FF513D;
font-family: '黑体';
margin-bottom: 20px;
        }
        .head-msg  ._btn{
            margin-left: 0;
            margin-bottom: 20px;
        }

        .head-msg .msg-aplist {
font-size: 16px;
        }

        .head-msg .msg-aplist>div.btns{
            background:#ccc;
            padding:2px 8px;
            margin:0 4px;
            display: inline-block;
            border-radius: 4px;
        }
        .head-msg .msg-aplist>div.have{
            background:#03a1ea;
            color:#fff;
        }
        
</style>