<template>
    <div style="padding-bottom: 480px;">
        <v-spin :spinning="spinning" tip="处理中">
            <div v-show="step === 0">
                <div class="register-tips">
                    <h3 class="tips-header">温馨提示</h3>
                    <ul>
                        <li>若您是贵公司第一个注册的用户，登陆后可邀请您的同事一起加入云报关。</li>
                        <li>若您不是贵公司第一个注册的用户，可以要求创建账号同事帮您加入，加入成功后你们将同属一家公司，便于后续工作的开展。</li>
                    </ul>
                </div>
                <div class="register-section">
                    <v-form direction="vertical"
                            :model="registrationForm"
                            :rules="rules1"
                            ref="registrationFormRef1" >
                        <v-row>
                            <v-col class="register-label" span="5" pull="1">
                                <span class="register-red-star">*&nbsp;</span>手机号
                            </v-col>
                            <v-col span="19">
                                <v-form-item prop="tel"
                                             class="register-input-box"
                                             has-feedback>
                                    <v-input class="register-input"
                                             v-model="registrationForm.tel"
                                             type="text"
                                             placeholder="请输入手机号"></v-input>
                                </v-form-item>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="register-label" span="5" pull="1">
                                
                            </v-col>
                            <v-col span="12">
                                <v-form-item prop="verifiedImageWord"
                                             class="register-input-box"
                                             has-feedback
                                             style="width: 200px;"
                                >
                                    <v-input class="register-input"
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
                    <v-row class="register-next-box">
                        <v-col span="20" push="4">
                            <v-button class="register-next-btn step-1-btn" type="primary" size="large" @click="validateImageWord">获取动态密码</v-button>
                        </v-col>
                    </v-row>
                </div>

            </div>
            <div v-show="step === 1">
                <div class="register-tips">
                    <h3 class="tips-header">温馨提示</h3>
                    <ul>
                        <li>若您是贵公司第一个注册的用户，登陆后可邀请您的同事一起加入云报关。</li>
                        <li>若您不是贵公司第一个注册的用户，可以要求创建账号同事帮您加入，加入成功后你们将同属一家公司，便于后续工作的开展。</li>
                    </ul>
                </div>
                <div class="register-section">
                    <v-form direction="vertical"
                            :model="registrationForm"
                            :rules="rules2"
                            ref="registrationFormRef2">
                        <v-row>
                            <v-col class="register-label" span="4">
                                手机号
                            </v-col>
                            <v-col span="20" push="1">
                                <v-form-item class="register-input-box">
                                    <v-input class="register-input register-tel-disable"
                                             v-model="registrationForm.tel"
                                             type="text"
                                             :disabled="telDisable"></v-input>
                                </v-form-item>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col span="18">
                                <v-row>
                                    <v-col class="register-label" span="6" pull="1">
                                        <span class="register-red-star">*&nbsp;</span>验证码
                                    </v-col>
                                    <v-col span="18">
                                        <v-form-item  prop="verificationCode"
                                                      style="width: 200px;"
                                                      :validate-status="verificationCodeState"
                                                      :help="verificationCodeHelp"
                                                      has-feedback>
                                            <v-input class="register-input"
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
                                          @click="getVerificationCode(registrationForm.tel)">{{verificationCodeText}}</v-button>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row class="register-next-box">
                        <v-button class="register-next-btn register-next-btn-2"
                                  type="primary"
                                  @click="validateCode">下一步</v-button>
                    </v-row>
                </div>
            </div>
        </v-spin>
        
    </div>
</template>

<script>
import api from '@/api/root/register.js';
import URLconfig from 'appconfig';

export default {
    props: {
        id: String,
    },
    data() {
        var validateTel = (rule, value, callback) => {
            api.isTelRegistered(value)
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
            reloadImagTag: 0,
            // 校验码地址
            verifiedImageURL: "",
            // 验证码图片是否初始化
            isVerifiedImageInit: false,
            
            // 第二步不能输入手机号码
            telDisable: true,
            verificationCodeBtn: {
                text: "重新获取",
                isDisable: false,
            },
            
            registrationForm: {
                tel: null,
                verificationCode: null,
                verifiedImageWord: null
            },
            
            verificationCodeState: "",
            verificationCodeHelp: "",
            
            rules1: {
                tel: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {
                        type: "string",
                        pattern: "^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$",
                        message: '请输入正确的手机格式',
                        trigger: 'blur'
                    },
                    {
                        type: "string",
                        max: 11,
                        message: '请输入正确的手机格式',
                        trigger: 'change'    
                    },
                    {validator: validateTel, trigger: 'blur'}
                ],
                verifiedImageWord: [
                        {
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'
                        }
                    ],
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
        },
        /**
         * 验证手机验证码
         */
        validateCode() {
            this.$refs['registrationFormRef2'].validate(ok => {
                if (ok) {
                    this.spinning = true;
                    
                    api.verifyCode(this.registrationForm.tel, this.registrationForm.verificationCode, this.id)
                        .then(resp => {
                            this.spinning = false;
                            if(resp.success === true) {
                                this.$router.push({ name: 'registerStep2', params: { id: this.id}})
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
                    
                    api.isPassVerification(this.registrationForm.tel ,this.registrationForm.verifiedImageWord, this.id)
                        .then(resp => {
                            this.spinning = false;
                            if(resp.success === true) {
                                this.disableVerificationBtn();
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
        backToStep1() {
            this.step--;
        }
    },
    computed: {
        verificationCodeText() {
            return this.verificationCodeBtn.text;
        },
        captchaImg() {
            return URLconfig.endpointUrl + "/registration/patchca/" + this.id + "?"+ this.reloadImagTag;
        },
    },
}
</script>
<style>
    .register-step-text p {
        display: inline-block;
        font-size: 16px;
        color: #aaa;
    }
    .register-step-text p.on-step{
        color: #666;
    }
    .register-step-text-1 {
        position: relative;
        left: -154px;
    }
    .register-step-text-3 {
        position: relative;
        left: 154px;
    }
    .register-section, .register-tips {
        float: left;
    }
    .register-tips {
        width: 240px;
        height: 355px;
        background-color: #f7f7f7;
        padding: 35px 35px;
        margin-right: 20px;
        font-size: 13px;
    }
    .register-tips h3 {
        text-align: center;
        font-size: 20px;
        color: #00aee0;
        padding-bottom: 20px;
    }
    .register-tips li {
        position: relative;
        left: 7px;
        list-style-type: square;
        line-height: 23px;
        padding-bottom: 15px;
    }
    .register-section {
        width: 430px;
        height: 355px;
        border: 1px solid #ddd;
        padding: 40px 30px;
        font-size: 16px;
    }
    .register-label {
        position: relative;
        top: 10px;
        text-align: right;
        font-size: 16px;
    }
    .register-next-box {
        padding-top: 30px;
    }
    .register-next-btn {
        width: 200px;
        height: 42px;
        font-size: 20px;
        background-color: #00aee0;  
    }
    .register-next-btn-2 {
        position: relative;
        left: 66px;
    }
    .register-input {
        height: 42px;
        width: 300px;
        font-size: 15px;
    }
    .register-input-box {
        width: 300px;
    }
    .register-tel-disable {
        position: relative;
        left: -6px;
        width: 200px;
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
    .register-back {
        position: relative;
        left: 65px;
        top: 8px;
        color: #00aee0;
        cursor: pointer;
    }
    .register-red-star {
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
