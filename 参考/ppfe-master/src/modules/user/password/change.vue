<template>
    <div id="change-password">
        <v-row>
            <v-col class="change-titel" :xs="{ span: 12, offset: 6    }">修改密码</v-col>
        </v-row>
        <v-row>
            <v-col :xs="2" :sm="8" :md="8" :lg="9"></v-col>
            <v-col :xs="20" :sm="8" :md="8" :lg="6">
                <v-spin :spinning="spinning" tip="提交中">
                    <v-form direction="vertical" :model="changeForm" :rules="rules" ref="changeFormRef">
                        <v-form-item label="原密码" prop="oldPassword" has-feedback>
                            <v-input class="regist-input" v-model="changeForm.oldPassword" type="password" placeholder="请输入原密码" ></v-input>
                        </v-form-item>
                        <v-form-item label="设置密码" prop="password" has-feedback>
                            <v-row>
                                <v-col :xs="24">
                                    <v-input class="regist-input" v-model="changeForm.password" type="password" placeholder="密码" v-on:input="checkPassword(changeForm.password)"></v-input>
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
                        
                        <v-form-item label="再次确认密码" prop="password2" has-feedback>
                            <v-input class="regist-input" v-model="changeForm.password2" type="password" placeholder="再次确认密码" ></v-input>
                        </v-form-item>
                    </v-form>

                    <div class="change-btn-box">
                        <button type="button" name="button" class="next-btn" @click="changePassword">确认</button>
                    </div>
                </v-spin>
            </v-col>
            <v-col :xs="2" :sm="8" :md="8" :lg="9"></v-col>
        </v-row>
    </div>
</template>

<script>
    import api from '@/api/root/password';
    
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (this.changeForm.password2 != null && this.changeForm.password2 != "") {
                    if (value != this.changeForm.password2) {
                        callback(new Error("密码不符"));
                        return;
                    }
                }
                callback();
            };
            var validatePass2 = (rule, value, callback) => {
                if (this.changeForm.password != value) {
                    callback(new Error("密码不符"));
                    return;
                }
                callback();
            };
            
            return {
                current: 1,
                steps: [
                    {
                        title: "确认用户信息",
                        index: 0
                    },
                    {
                        title: "重置密码",
                        index: 1
                    }
                ],
                spinning : false,
                
                passwordStrength: {
                    weak: false,
                    medium: false,
                    strong: false
                },
                changeForm: {
                    oldPassword: null,
                    password: null,
                    password2: null,
                },
                rules: {
                    oldPassword: [
                        { required: true, message: '输入原密码', trigger: 'blur' },
                    ],
                    password: api.passwordVerifiedRules.concat({ validator: validatePass }),
                    password2: api.rePasswordVerifiedRules.concat({ validator: validatePass2 })
                }
            }
        },
        methods: {
            loginOut() {
                api.loginOut()
                    .then(resp => {
                        window.location.href = "/#/login";
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
            },
            changePassword(){
                this.$refs['changeFormRef'].validate(ok => {
                    if (ok) {
                        this.spinning = true;
                        api.sendChangePassword(this.changeForm.oldPassword, this.changeForm.password)
                            .then(resp => {
                                this.spinning = false;
                                var vm = this;
                                if(resp.success === true) {
                                    this.$message.success("修改密码成功，即将跳转到登录页", 4);
                                    setTimeout(function() {
                                        vm.loginOut();
                                    }, 5000);
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
            sucessModalCancel: function() {
                this.sucessModalVisible = false;
            }
        },
        computed: {
            verificationCodeText() {
                return this.verificationCodeBtn.text;
            }
        }
    }
</script>

<style>
    @import '/static/css/password-strength.css';
    @media only screen and (max-width: 750px) {
        #change-password .change-step-box {
            display: none;
        }
        #change-password #password-strength {
            display: none !important;
        }
    }
    @media only screen and (min-width: 1530px) {
        #change-password .ant-form {
            width: 367px;
            margin: 0 auto;
        }
        #change-password .change-btn-box {
            width: 367px;
            margin: 0 auto;
        }
    }
    #change-password .change-hide {
        display: none;
    }
    #change-password .change-titel {
        padding-top: 70px;
        padding-bottom: 30px;
        font-size: 22px;
        text-align: center;
    }
    #change-password .change-step-box {
        position: relative;
        left: 50%;
        margin-left: -200px;
        width: 400px;
        padding-bottom: 60px;
        /*border-bottom: 1px solid #000;*/
    }
    #change-password .ant-steps-tail {
        background-color: #ddd;
    }
    #change-password .ant-steps-tail > i {
        background-color: #ddd; 
    }
    #change-password .ant-steps-head,#change-password .ant-steps-title {
        background-color: #ececec;
    }
    #change-password .regist-input {
        height: 38px;
        font-size: 15px;
    }
    #change-password .verifi-box {
        position: relative;
        height: 82px;
    }
    #change-password .verifi-box .has-feedback:after {
        display: none;
    }
    #change-password .verifi-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    #change-password .verifi-btn {
        height: 38px;
        width: 100%;
        background-color: #f7f7f7;
        color: #00aee0;
        border: 1px solid rgb(217, 217, 217);
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    #change-password .next-btn {
    height: 42px;
    width: 100%;
    font-size: 18px;
    background-color: #00aee0;
    color: #fff;
    }
    
    #changeModal .sucessIcon {
        font-size: 50px;
        color: #00a854;
    }
    #changeModal p {
        text-align: center;
    }
    #changeModal .sucess-text {
        font-size: 20px;
    }
    #changeModal .sucess-text span{
        color: #00aee0;
    }
</style>