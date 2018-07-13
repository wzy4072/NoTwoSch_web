<template>
    <div style="padding:30px;">

        <div class="form-warp">
            <v-spin :spinning="spinning">
            <v-form direction="horizontal" :model="changePass" :rules="changePassRules" ref="changePass">
                <v-form-item label="新密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="newPass">
                    <v-input size="large" type="password" v-model="changePass.newPass"></v-input>
                </v-form-item>
                <v-form-item label="重复新密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="repeatNewPass">
                    <v-input size="large" type="password" v-model="changePass.repeatNewPass"></v-input>
                </v-form-item>
            </v-form>
            <v-button type="primary" size="large" @click="ensurechange('changePass')">确认 修 改</v-button>
            </v-spin>
        </div>
    </div>
</template>

<script>
import perapi from '@/api/person';
import passapi from '@/api/root/password'
export default {
    //isinit 0 首次登录 // 1 邮箱修改
    props: ['isinit', 'ecode', 'apiname'],
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.changePass.repeatNewPass !== '') {
                    this.$refs.changePass.validateField('repeatNewPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('不能为空！'));
            } else if (value !== this.changePass.newPass) {
                callback(new Error('两次输入不一致!'));
            } else {
                callback();
            }
        }

        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            spinning: false,

            changePass: {
                newPass: '',
                repeatNewPass: '',
            },
            changePassRules: {
                newPass:passapi.passwordVerifiedRules,
                repeatNewPass: [{ required: true, message: '请输入密码' }, { validator: validatePass2 }],
            },
        }
    },
    methods: {
        ensurechange(name) {
            let _this = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinning = true;
                     //isinit 0 首次登录 // 1 邮箱修改
                    let param = this.isinit == 1 ? {code:this.ecode, password:this.changePass.newPass} : {newPassword:this.changePass.newPass};
                    perapi[this.apiname](param).then(
                        req => {
                            this.spinning = false;
                            if (req.success) {
                                this.$message.info('修改成功！' );
                                if(this.isinit== 0 ){
                                    passapi.loginOut();
                                    } //如果是初始登录，要退出登录
                                setTimeout(function () { window.location.href = "/#/login"; }, 1000)
                            } else {
                                this.$message.info('请求失败' + req.message );
                            }
                        })
                        .catch(err => { this.$message.info('数据请求失败！' + err.message); });
                } else {
                    this.$message.info('数据验证未通过，请重新填写！');
                    return false;
                }
            });
        },

    }
}
</script>
<style scoped>
.card div {
  font-size: 20px;
  margin: 8px auto;
}
.form-warp {
  width: 450px;
  height: 350px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 50px;
}
</style>