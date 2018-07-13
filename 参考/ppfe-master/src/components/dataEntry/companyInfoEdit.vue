<template>
    <div style="padding:30px;">
        <v-spin :spinning=" spinningInfo || spinningAva" tip="正在读取数据.">
            <v-card title="企业信息">
                <v-row  v-show=" !spinningInfo && !spinningAva">
                    <v-col span="12">
                        <v-form direction="horizontal" :model="companyInfo" :rules="companyRules" ref="company">
                            <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">企业ID : </v-col>
                                <v-col :span="valSpan" class="info-warp">{{companyInfo.corporateMark}}</v-col>
                            </v-row>
                            <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">企业名称 : </v-col>
                                <v-col :span="valSpan" class="info-warp">{{companyInfo.name}}</v-col>
                            </v-row>
                            <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">企业联系人 : </v-col>
                                <v-col :span="valSpan" class="info-warp">{{companyInfo.contactsName}}</v-col>
                            </v-row>
                            <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">联系人手机 : </v-col>
                                <v-col :span="valSpan" class="info-warp">{{companyInfo.contactsMobile}}</v-col>
                            </v-row>
                            <!-- <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">联系人邮箱 : </v-col>
                                <v-col :span="valSpan" class="info-warp">{{companyInfo.contactsEmail}}</v-col>
                            </v-row> -->

                            <!-- <v-form-item label="联系人职务 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="contactsDuties">
                                <v-input size="large" v-model="companyInfo.contactsDuties"></v-input>
                            </v-form-item> -->
                            <v-form-item label="企业座机 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="contactsTel">
                                <v-input size="large" v-model="companyInfo.contactsTel"></v-input>
                            </v-form-item>
                            <!--<v-form-item label="18位信用代码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="creditCode">-->
                                <!--<v-input size="large" v-model="companyInfo.creditCode"></v-input>-->
                            <!--</v-form-item>-->
                            <!--<v-form-item label="海关代码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="hsCode">-->
                                <!--<v-input size="large" v-model="companyInfo.hsCode"></v-input>-->
                            <!--</v-form-item>-->
                            <!--&lt;!&ndash; 申报关区 &ndash;&gt;-->
                            <!--<v-form-item label="常用申报关区 " :label-col="{span: 12}" :wrapper-col="{span: 12}" prop="customArea" style="width:49%;display:inline-block;" ref="customArea">-->
                                <!--<v-input size="large" v-model="companyInfo.customArea"></v-input>-->
                            <!--</v-form-item>-->
                            <!--<v-form-item :wrapper-col="{span: 15}" prop="custom" style="padding-left:8%;width:49%;display:inline-block;">-->
                                <!--<v-input size="large" :value="frontAdd.custom" placeholder="请输入关区代码" disabled></v-input>-->
                            <!--</v-form-item>-->
                            <v-form-item label="企业地址" :label-col="labelCol" :wrapper-col="wrapperCol" prop="address">
                                <v-input size="large" v-model="companyInfo.address"></v-input>
                            </v-form-item>
                        </v-form>
                        <button class="_btn" @click="saveCom('company')">保存</button>
                    </v-col>
                    <v-col span="12">
                        <div class="logo-warp" >
                            <div class="avt-bdr">
                                <simple-avatar
                       :gotid="hadBack"
                        :id="companyInfo.logoResourceId"
                        :isCom="true"
                        @spin="spinningAva = false"
                        ></simple-avatar>
                            </div>
                            <v-upload class="up-btn" name="file" :action="action" :data="extra" @change="onChange" :beforeUpload="beforeUpload">
                                <p class="ant-upload-drag-icon">
                                    <button class="_btn" style="margin-top:28px">更换企业logo</button>
                                </p>
                            </v-upload>
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
import perapi from '@/api/person/common';
import endpoint from '@/api/endpoint';
import api from '@/api/person.js';
import tool from '@/api/tool.js';

export default {
    components: {
        'avatar': avatar,
         'simpleAvatar':simpleAvatar

    },
    props: {
        action: { type: String, default: endpoint.url + "/resource" }
    },
    data() {
        var phoneFormat = (rule, value, callback) => {
            if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
                callback(new Error('手机号码格式不正确！'));
            } else {
                callback();
            }
        };
        return {
            titleSpan: 6,
            valSpan: 14,
            spinningInfo: true,
            spinningAva: true,

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
            hadBack :false,
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },

            // 创建公司 自动查找关区名字
            frontAdd: {
                custom: "",
                item: "",
                companyId: "",
                haveCustom: true,
            },
            companyRules: {
                creditCode: [{ len: 18, message: "信用代码必须18位！" }, { pattern: /^[A-Z0-9]+$/, message: "数字或大写字母！" }],
                hsCode: [ { max: 10, message: "不超过10位！" },{ min: 9, message: "不少于8位！" },{ pattern: /^[0-9A-Z]+$/, message: "数字或大写字母！" },],
                customArea: [{ pattern: /^[0-9]+$/, message: '请输入数字！' }, { len: 4, message: "请输入4位！" }],
                contactsTel: [{max:13,message:'长度不超过13位'},{ pattern: /^[0-9-]+$/, message: '请输入数字或-' }, ],
                // contactsTel: [{ pattern: /^([0-9]{4}\-)?[0-9]{7,8}$/, message: '座机号码格式如：xxxxxxx 或 xxxx-xxxxxxx！' }, ],
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
            let _this = this;
            comapi.getComInfo(this.loginContext.currentCorporate.id)
                .then(req => {
                    if (req.success) {
                        tool.geiveValidValue(req.result, _this.companyInfo);
                        _this.hadBack = true; 
                        _this.spinningInfo = false;
                    } else {
                        this.$message.info('数据请求失败！' + req.message );
                    }
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        saveCom(formName) {
            var _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.companyInfo.customArea && this.frontAdd.haveCustom) {
                        this.$message.info('关区代码没有查询到，请重新输入！');
                        return false;
                    };
                    this.relateSource();
                    comapi.saveComInfoChange(this.companyInfo, this.loginContext.currentCorporate.id).then(
                        req => {
                            if (req.success) {
                                this.$message.info('保存成功' );
                                // 更新头部
                                document.dispatchEvent(window.YBG_headInfoChangingTrigger);
                                // this.$message.destroy()
                                // setTimeout(function () { _this.$router.push('/home'); }, 1000)
                            } else {
                                this.$message.info('请求失败' + req.message );
                            }

                        })
                        .catch(err => {
                           this.$message.info('数据请求失败！' + err.message); 
                           });
                } else {
                    this.$message.info('数据验证未通过，请重新填写！');
                    return false;
                }
            });
        },
        beforeUpload(fileInfo) {
            if (fileInfo.size > 1024 * 1024 * 5) {
                this.$message.info('文件过大，请重新选择！'); return false;
            }
            let imgTypeList = ['image/jpeg', 'image/gif', 'image/png'];
            if (imgTypeList.indexOf(fileInfo.type) == -1) {
                this.$message.info('格式不对，请重新选择！'); return false;
            }
        },
        //公司logo 资源和id绑定动作
        onChange(info) {

            if (info.file.status === 'done') {
                this.companyInfo.logoResourceId = info.file.response.id;
            } else if (info.file.status === 'error') {
                console.log(info.file.name + ' 上传失败.')
            }
        },
        //公司logo 资源和id绑定动作
        relateSource() {
            api.changeComAvatar(this.companyInfo.logoResourceId)
            .then(resp => {
                this.$store.dispatch("reloadContext");
            });
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
@import "/static/css/common.css";
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

.li-tit{
    padding: 6px 7px;
    text-align: right;
    padding-right: 14px;
}
.logo-warp {
  text-align: center;
  padding-top: 20px;

}
.avt-bdr{
         width:162px;
         height: 162px;
         padding-top:5px;
         margin:0 auto;
         border:1px solid #e9e9e9;
         border-radius: 100%;
}

.up-btn {
  display: block;
}
</style>
<style>
.ant-upload-list-item{
    display: none;
}
</style>
