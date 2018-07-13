<template>
    <div style="padding-bottom: 20px;">
        <v-spin :spinning="spinning" tip="提交中">
            <div class="reset-section">
                <v-form direction="vertical" :model="resetForm" :rules="rules" ref="resetFormRef2">
                    <v-row>
                        <v-col class="reset-label" span="5" pull="1">
                            <span class="reset-red-star">*&nbsp;</span>设置密码
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="password"
                                         class="reset-input-box"
                                         has-feedback>
                                <v-row>
                                    <v-col :xs="24">
                                        <v-input class="reset-input" v-model="resetForm.password" type="password" placeholder="密码" v-on:input="checkPassword(resetForm.password)"></v-input>
                                    </v-col>
                                    <v-col :xs="{ offset: 24 }">
                                        <ul id="password-strength">
                                            <li class="weak" v-bind:class="{show:passwordStrength.weak}">
                                                <div>
                                                    <div class="strength-bar-bg" >
                                                        <div class="strength-bar weak-bar" ></div>
                                                    </div>
                                                    &nbsp;&nbsp;弱
                                                    </div>
                                            </li>
                                            <li class="medium" v-bind:class="{show:passwordStrength.medium}">
                                                <div class="strength-bar-bg" >
                                                    <div class="strength-bar medium-bar"></div>
                                                </div>
                                                &nbsp;&nbsp;中
                                                </li>
                                            <li class="strong" v-bind:class="{show:passwordStrength.strong}">
                                                <div class="strength-bar-bg" >
                                                    <div class="strength-bar strong-bar"></div>
                                                </div>
                                                &nbsp;&nbsp;强
                                                </li>
                                        </ul>
                                    </v-col>
                                </v-row>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="reset-label" span="5" pull="1">
                            <span class="reset-red-star">*&nbsp;</span>确认密码
                        </v-col>
                        <v-col span="19">
                            <v-form-item prop="password2"
                                         class="reset-input-box"
                                         has-feedback>
                                <v-input class="reset-input"
                                         v-model="resetForm.password2"
                                         type="password"
                                         placeholder="再次确认密码" ></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                </v-form>
                <br>
                <div class="reset-btn-box">
                    <v-button type="primary" name="button" class="reset-next-btn" @click="resetPassword">提交</v-button>
                </div>
            </div>
            
        </v-spin>
    </div>
    
</template>

<script>
    import api from '@/api/root/password';
    
    export default {
        props: {
            id: String,
        },
        data() {
            var validatePass = (rule, value, callback) => {
                if (this.resetForm.password2 != null && this.resetForm.password2 != "") {
                    if (value != this.resetForm.password2) {
                        callback(new Error("与设置密码不符"));
                        return;
                    }
                }
                callback();
            };
            var validatePass2 = (rule, value, callback) => {
                if (this.resetForm.password != value) {
                    callback(new Error("与设置密码不符"));
                    return;
                }
                callback();
            };
            return {
                spinning: false,
                passwordStrength: {
                    weak: false,
                    medium: false,
                    strong: false
                },
                resetForm: {
                    password: null,
                    password2: null,
                },
                rules: {
                    password: api.passwordVerifiedRules.concat({ validator: validatePass }),
                    password2: api.rePasswordVerifiedRules.concat({ validator: validatePass2 })
                }
            }
        },
        methods: {
            resetPassword(){
                this.$refs['resetFormRef2'].validate(ok => {
                    if (ok) {
                        this.spinning = true;
                        console.log(this.id);
                        api.sureResetPassword(this.resetForm.password, this.id)
                            .then(resp => {
                                this.spinning = false;
                                var vm = this;
                                if(resp.success === true) {
                                    this.$router.push({ name: 'resetStepThree', params: { id: this.id}});
                                }else {
                                    this.$message.error(resp.error, 4);
                                }
                            })
                            .catch(error => {
                                this.spinning = false;
                                this.$message.error(error);
                            });
                    } else {
                        this.spinning = false;
                        this.$message.error("请您修正输入");
                    }
                })
            },
            checkPassword: function(password) {
                this.passwordStrength = {
                    weak: false,
                    medium: false,
                    strong: false
                }
                var count = 0;
                if (/\d/.test(password)) {
                    count++;
                }
                if (/[a-z]/.test(password)) {
                    count++;
                }
                if (/[A-Z]/.test(password)) {
                    count++;
                }
                if (/\W/.test(password)) {
                    count++;
                }
                switch (count) {
                    case 1:
                        this.passwordStrength.weak = true
                        break;
                    case 2:
                        this.passwordStrength.medium = true
                        break;
                    case 3:
                    case 4:
                        this.passwordStrength.strong = true
                        break;
                }
            },
           
        },
        computed: {
            verificationCodeText() {
                return this.verificationCodeBtn.text;
            }
        }
    }
</script>

<style>
    @import "/static/css/password-strength.css";
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
        /*color: #fff;*/
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
        width: 200px;
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