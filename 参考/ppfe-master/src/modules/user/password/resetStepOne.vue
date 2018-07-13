<template>
    <div style="padding-bottom: 20px;">
        <v-spin :spinning="spinning" tip="处理中">
            <div v-show="step === 0">
                <div class="reset-section">
                    <v-form direction="vertical"
                            :model="registrationForm"
                            :rules="rules1"
                            ref="registrationFormRef1" >
                        <v-row>
                            <v-col class="reset-label" span="5" pull="1">
                                <span class="reset-red-star">*&nbsp;</span>登录名
                            </v-col>
                            <v-col span="19">
                                <v-form-item prop="name"
                                             class="reset-input-box"
                                             has-feedback>
                                    <v-input class="reset-input"
                                             v-model="registrationForm.name"
                                             type="text"
                                             placeholder="请输入手机号/邮箱号"></v-input>
                                </v-form-item>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="reset-label" span="5" pull="1">

                            </v-col>
                            <v-col span="12">
                                <v-form-item prop="verifiedImageWord"
                                             class="reset-input-box"
                                             has-feedback
                                             style="width: 200px;"
                                >
                                    <v-input class="reset-input"
                                             v-model="registrationForm.verifiedImageWord"
                                             type="text"
                                             style="width: 200px;"
                                             placeholder="请输入验证码"></v-input>
                                </v-form-item>
                            </v-col>
                            <v-col span="5">
                                <img
                                    id="captchaImg"
                                    :src="captchaImg"
                                    @click="reLoadCaptchaImg"
                                    alt="">
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row class="reset-next-box">
                        <v-button class="reset-next-btn step-1-btn" type="primary" size="large" @click="validateImageWord">下一步</v-button>
                    </v-row>
                </div>

            </div>
            <div v-show="step === 1">
                <div v-if="isTel" class="reset-section">
                    <v-form direction="vertical"
                            :model="registrationForm"
                            :rules="rules2"
                            ref="registrationFormRef2">
                        <v-row>
                            <v-col class="reset-label" span="4">
                                手机号
                            </v-col>
                            <v-col span="20" push="1">
                                <v-form-item class="reset-input-box">
                                    <v-input class="reset-input reset-tel-disable"
                                             v-model="registrationForm.name"
                                             type="text"
                                             :disabled="telDisable"></v-input>
                                </v-form-item>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col span="18">
                                <v-row>
                                    <v-col class="reset-label" span="6" pull="1">
                                        <span class="reset-red-star">*&nbsp;</span>验证码
                                    </v-col>
                                    <v-col span="18">
                                        <v-form-item  prop="verificationCode"
                                                      style="width: 200px;"
                                                      :validate-status="verificationCodeState"
                                                      :help="verificationCodeHelp"
                                                      has-feedback>
                                            <v-input class="reset-input"
                                                     v-model="registrationForm.verificationCode"
                                                     type="text" placeholder="请输入验证码"
                                                     style="width: 200px;" >
                                            </v-input>
                                        </v-form-item>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col span="6">
                                <v-button class="verifi-btn"
                                          type="primary"
                                          v-bind:class="{disabled: verificationCodeBtn.isDisable }"
                                          @click="getVerificationCode(registrationForm.name)">{{verificationCodeText}}</v-button>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row class="reset-next-box">
                        <v-button class="reset-next-btn reset-next-btn-2"
                                  type="primary"
                                  @click="validateCode">下一步</v-button>
                        &nbsp;
                        <!--<span class="reset-back" @click="backToStep1">返回</span>-->
                    </v-row>
                </div>
                <div v-else class="reset-section">
                    <p style="text-align: center">验证邮件已发送到您的邮箱：{{ registrationForm.name }}</p>
                    <p style="text-align: center">10分钟内有效，请立即验证</p>
                    <v-row class="reset-next-box">
                        <v-button class="reset-next-btn step-1-btn" 
                                  type="primary" size="large" 
                                  @click="gotoEmailSite">去验证</v-button>
                    </v-row>
                </div>
            </div>
            <v-modal title="提示"
                     :visible="tipVisible"
                     @ok="tipOk"
                     @cancel="tipCancel">
                <p>请登录您的邮箱通过重置链接进行密码重置！</p>
            </v-modal>
        </v-spin>

    </div>
</template>

<script>
    import api from '@/api/root/password.js';
    import personCommon from '@/api/person/common.js';
    import URLconfig from 'appconfig';

    export default {
        props: {
            id: String,
        },
        data() {
            var validateName = (rule, value, callback) => {
                api.isNameRegistered(value)
                    .then(resp => {
                        if(resp.success === true) {
                            callback();
                        }else {
                            callback(new Error(resp.error));
                        }
                    })
                    .catch(error => {
                            this.$message.error(error);
                            callback();
                        }
                    );
            };

            return {
                step: 0,
                spinning: false,
                tipVisible: false,
                isTel: true,
                // 校验码地址
                verifiedImageURL: "",
                // 验证码图片是否初始化
                isVerifiedImageInit: false,
                // 验证码图片随机数
                reloadImagTag: 1,
                // 第二步不能输入手机号码
                telDisable: true,
                verificationCodeBtn: {
                    text: "重新获取",
                    isDisable: false,
                },

                registrationForm: {
                    name: null,
                    verificationCode: null,
                    verifiedImageWord: null
                },

                verificationCodeState: "",
                verificationCodeHelp: "",

                rules1: {
                    name: [
                        {required: true, message: '请输入手机号/邮箱号', trigger: 'blur'},
                        {
                            type: "string",
//                          啊，为什么这个严格的邮箱验证不行，先用简单的验证，后面有时间看源码吧。。
//                            pattern: "(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)|(^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$)",
                            pattern: "(^.+@.+\...+$)|(^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$)",
                            message: '请输入正确的手机号/邮箱号',
                            trigger: 'blur, change'
                        },
                        {validator: validateName, trigger: 'blur'}
                    ],
                    verifiedImageWord: [
                        {
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'
                        }],
                },
                rules2: {
                    verificationCode: [
                        {
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'}
                    ]
                },
            }
        },
        created() {
            
        },
        methods: {
            /**
             * 获得验证码图片
             */
            reLoadCaptchaImg() {
                this.reloadImagTag = Math.random();
                console.log(this.reloadImagTag);
            },
            /**
             * 验证手机验证码
             */
            validateCode() {
                this.$refs['registrationFormRef2'].validate(ok => {
                    if (ok) {
                        this.spinning = true;

                        api.verifyCode(this.registrationForm.verificationCode, this.id)
                            .then(resp => {
                                this.spinning = false;
                                if(resp.success === true) {
                                    this.$router.push({ name: 'resetStepTwo', params: { id: this.id}})
                                }else {
                                    this.$message.error(resp.error, 4);
                                    this.verificationCodeState = "error";
                                    this.verificationCodeHelp = resp.error;
                                }
                            })
                            .catch(msg => {
                                this.spinning = false;
                                this.$message.error(msg);
                            });
                    } else {
                        this.spinning = false;
                        this.$message.error("请您修正输入");
                    }
                })
            },
            /**
             * 图片验证码验证
             */
            validateImageWord() {
                this.$refs['registrationFormRef1'].validate(ok => {
                    if (ok) {
                        this.spinning = true;
                        
                        api.isPassVerification(this.registrationForm.name ,this.registrationForm.verifiedImageWord, this.id)
                            .then(resp => {
                                this.spinning = false;
                                if(resp.success === true) {
                                    this.isTel =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(this.registrationForm.name)
                                    if(this.isTel) {
                                        this.disableVerificationBtn();    
                                    }
                                    this.step = 1;
                                }else {
                                    this.$message.error(resp.error, 4);
                                }
                            })
                            .catch(msg => {
                                this.spinning = false;
                                this.$message.error(msg);
                            });
                    } else {
                        this.spinning = false;
                        this.$message.error("请您修正输入");
                    }
                })
            },
            /**
             * 获取验证码
             * @param tel
             * @returns {boolean}
             */
            getVerificationCode(tel) {
                var btnData = this.verificationCodeBtn;
                var flag = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(tel);
                if(btnData.isDisable) {
                    return false;
                }
                if(!flag) {
                    this.$message.error("请输入手机号");
                    return false;
                }
                
                // 调用api请求
                api.sendVerificationCode(tel, this.id)
                    .then(resp => {
                        if(resp.success === true) {

                        }else {
                            this.$message.error(resp.error, 4);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
                this.disableVerificationBtn();
            },
            /**
             * 禁止点击发送验证码
             */
            disableVerificationBtn() {
                var btnData = this.verificationCodeBtn;
                // 禁止点击60秒，然后启用
                btnData.isDisable = true;
                btnData.text = "60";
                var timer = setInterval(() => {
                    btnData.text--;
                    // 当text为NaN时，也要进去；某些时候偶见NaN，可能是因为js的队列被优先级更高的占用了
                    if(btnData.text === 0 || btnData.text != btnData.text) {
                        clearInterval(timer);
                        btnData.text = "重新获取";
                        btnData.isDisable = false;
                    }
                },1000);
            },
            gotoEmailSite() {
                var emailSite = personCommon.gaveEmailEnter(this.registrationForm.name);
                if (emailSite) {
                    window.open(emailSite);
                }else {
                    this.tipOk();
                }
            },
            tipCancel() {
                this.tipVisible =false;
            },
            tipOk() {
                this.tipVisible =true;
            }
        },
        computed: {
            verificationCodeText() {
                return this.verificationCodeBtn.text;
            },
            captchaImg() {
                return URLconfig.endpointUrl + "/password/forget/patchca/" + this.id + "?"+ this.reloadImagTag;
            },
        },
    }
</script>
<style>
    .reset-step-text p {
        display: inline-block;
        font-size: 16px;
        color: #aaa;
    }
    .reset-step-text p.on-step{
        color: #666;
    }
    .reset-step-text-1 {
        position: relative;
        left: -154px;
    }
    .reset-step-text-3 {
        position: relative;
        left: 154px;
    }
    .reset-section {
        position: relative;
        left: 50%;
        margin-left: -215px;
        width: 430px;
        height: 355px;
        padding: 40px 30px;
        font-size: 16px;
    }
    .reset-label {
        position: relative;
        top: 10px;
        text-align: right;
        font-size: 16px;
    }
    .reset-next-box {
        padding-top: 20px;
    }
    .reset-next-btn {
        position: relative;
        left: 74px;
        width: 200px;
        height: 42px;
        font-size: 20px;
        background-color: #00aee0;
    }
    .reset-next-btn-2 {
        position: relative;
        left: 66px;
    }
    .reset-input {
        height: 42px;
        width: 300px;
        font-size: 15px;
    }
    .reset-input-box {
        width: 300px;
    }
    .reset-tel-disable {
        position: relative;
        left: -6px;
        width: 287px;
    }
    .verifi-btn {
        /*width: 48px;*/
        position: relative;
        top: 3px;
        color: #fff;
        height: 34px;
        background-color: #00aee0;
        border: 1px solid rgb(217, 217, 217);
        border-radius: 0;
    }
    .reset-back {
        position: relative;
        left: 65px;
        top: 8px;
        color: #00aee0;
        cursor: pointer;
    }
    .reset-red-star {
        color: red;
    }
    #captchaImg {
        position: relative;
        left: 26px;
        height: 35px;
    }
    /* 对vue-beaury样式的修正*/
    .ant-select-search__field__placeholder, .ant-select-selection__placeholder {
        margin-top: -6px;
    }
    .ant-select-lg .ant-select-selection--single {
        height: 42px;
    }
    .has-error.has-feedback:after, .has-success.has-feedback:after, .has-warning.has-feedback:after, .is-validating.has-feedback:after {
        top: 4px;
    }
</style>
