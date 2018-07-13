<template>
    <div style="padding:30px;">
        <v-spin :spinning=" spinningInfo || spinningAva" tip="正在读取数据.">
        <v-card title="企业信息">
            <v-row v-show=" !spinningInfo && !spinningAva">
                <v-col span="12">
                    <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">企业ID:</v-col><v-col :span="valSpan">{{companyInfo.corporateMark}}</v-col></v-row>
                    <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">企业名称:</v-col><v-col :span="valSpan">{{companyInfo.name}}</v-col></v-row>
                    <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">企业联系人:</v-col><v-col :span="valSpan">{{companyInfo.contactsName}}</v-col></v-row>
                    <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">联系人手机:</v-col><v-col :span="valSpan">{{companyInfo.contactsMobile}}</v-col></v-row>
                    <!-- <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">联系人邮箱:</v-col><v-col :span="valSpan">{{companyInfo.contactsEmail}}</v-col></v-row> -->
                    <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">企业座机:</v-col><v-col   :class="{'no-val':!companyInfo.contactsTel}" :span="valSpan">{{companyInfo.contactsTel}}</v-col></v-row>
                    <!--<v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">18位信用代码:</v-col><v-col :class="{'no-val':!companyInfo.creditCode }" :span="valSpan">{{companyInfo.creditCode}}</v-col></v-row>-->
                    <!--<v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">海关代码:</v-col><v-col :class="{'no-val':!companyInfo.hsCode}" :span="valSpan">{{companyInfo.hsCode}}</v-col></v-row>-->
                    <!--<v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">常用申报关区:</v-col><v-col :class="{'no-val':!companyInfo.customArea }" :span="valSpan">{{companyInfo.customArea}}</v-col></v-row>-->
                    <v-row class="msg-li"><v-col :span="titleSpan" class="li-tit">企业地址:</v-col><v-col :class="{'no-val':!companyInfo.address }" :span="valSpan">{{companyInfo.address}}</v-col></v-row>
                </v-col>
                <v-col span="12" >
                    <div class="ava-warp">
                        <div class="avt-bdr">

                        <simple-avatar
                        :gotid="hadBack"
                        :id="companyInfo.logoResourceId"
                        @spin="spinningAva = false"
                       
                        :isCom="true"
                        ></simple-avatar>
                        </div>
                        
                        <div class="logo-tip">企业LOGO</div>
                    </div>
                </v-col>
            </v-row>
        </v-card>
        </v-spin>
    </div>
</template>
<script>
import avatar from '@/components/avatar.vue';
import simpleAvatar from '@/components/dataDisplay/_avatar.vue';

import comapi from '@/api/company/common';
import tool from '@/api/tool.js';
export default {
    components: {
        'avatar': avatar,
        'simpleAvatar':simpleAvatar
    }, 
    data() {
        return {
            titleSpan:6,
            valSpan:14,
            spinningInfo:true,
            spinningAva:true,

            companyInfo: {
                corporateMark: '',
                name: '',
                contactsName: '',
                contactsMobile: '',
                contactsDuties: '',
                contactsTel: '',
                creditCode: '',
                hsCode: null,
                customArea: null,
                address: '',
                contactsEmail: '',
                logoResourceId: null,
            },
            hadBack:false,
            // 创建公司 自动查找关区名字
            frontAdd: {
                custom: "",
                item: "",
                companyId: "",
                haveCustom: true,
            },
        }
    },
    created() {
        this.getComInfo();
    },
    watch: {
        /*新建公司 海关区域代码*/
        'companyInfo.customArea': {
            handler: function (newVal) { if (newVal != null) { this.getLabel(newVal); } },
            deep: true
        },
    },
    computed: {
        // 头像
        extra() {
            return {
                sid: this.$store.getters.loginContext != null ? this.$store.getters.loginContext.sessionId : null
            }
        },
        loginContext() {
            return this.$store.getters.loginContext == null ? { currentCorporate: { id: null }, person: '' } : this.$store.getters.loginContext;
        },
    },
    methods: {
        getComInfo() {           
            comapi.getComInfo(this.loginContext.currentCorporate.id)
                .then(req => {
                    if (req.success) {
                        tool.geiveValidValue(req.result, this.companyInfo);
                        this.hadBack = true; 
                        this.spinningInfo = false;
                    } else {
                        this.$message.info('数据请求失败！' + req.message );
                    }

                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //海关区域代码 转 文字提示
        getLabel(query) {
            let _this = this;
            if (query.length != 4) { return false; }
            let resault = comapi.getCustomLabel(query);
            _this.frontAdd.custom = resault == null ? '未查询到结果！' : resault;
            _this.frontAdd.haveCustom = resault == null ? true : false;
        },
    }
}
</script>
<style scoped>
.msg-li{
    height: 32px;
    margin-bottom: 24px;
    font-size: 14px;
    padding-bottom: 24px;
}
.msg-li>div{
    padding: 6px 7px;
    height: 32px;
}
.no-val{
    border-radius: 4px;
    border:1px solid #d9d9d9;
}
.li-tit{
    padding: 6px 7px;
    text-align: right;
    padding-right: 14px;
}
.ava-warp{
    text-align: center;
    padding-top:60px;
}
.avt-bdr{
         width:162px;
         height: 162px;
         padding-top:5px;
         margin:0 auto;
         border:1px solid #e9e9e9;
         border-radius: 100%;
}
.logo-tip{
    font-size: 14px;
    margin-top: 12px;
}

</style>