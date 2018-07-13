<template>
    <div style="padding:30px;">
        <v-card title="基础信息" :loading="loading" class="card-tle-user">
            <div slot="extra">
                <router-link to="/home">返回</router-link>
            </div>
            <v-row>
                <v-col span="12">
                <v-spin :spinning="spinning" tip="加载中...">
                    <v-form direction="horizontal" :model="userinfo" :rules="userinfoRules" ref="userinfo">
                        <v-form-item label="账号 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="username">
                            <v-input size="large" disabled v-model="userinfo.username"></v-input>
                        </v-form-item>
                        <v-form-item label="电话 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="mobile">
                            <v-input size="large" v-model="userinfo.mobile"></v-input>
                        </v-form-item>
                        <v-form-item label="邮箱 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="email">
                            <v-input size="large" v-model="userinfo.email"></v-input>
                        </v-form-item>
                        <div class="emailbt">
                            <div class="btns">
                                <button style="background-color:#00aee0;" v-show="emailValitState=='goVali' && !userinfo.isBindingEmail" @click.prevent="sendEmail">验证</button>
                                <button v-show="emailValitState == 'weatVali' && !userinfo.isBindingEmail">等待验证</button>
                                <button style="background-color:#53c57e;" v-show="userinfo.isBindingEmail">已验证</button>
                            </div>
                            <div class="valmsg" v-show="valiSended">
                                <p>验证链接已发送至您的邮箱，请注意查收！</p>
                                <button style="background-color:#00aee0;" @click="visitEmail">去验证</button>
                            </div>
                        </div>
                        <v-form-item label="昵 称 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="name">
                            <v-input size="large" v-model="userinfo.name"></v-input>
                        </v-form-item>
                        <v-form-item label="真实姓名 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="realName">
                            <v-input size="large" v-model="userinfo.realName"></v-input>
                        </v-form-item>
                        <div class="sexpos">
                            <v-form-item   :wrapper-col="{span: 24}" prop="sex" class="sexitem">
                                <v-radio v-model="userinfo.sex" label="1">男</v-radio>
                                <v-radio v-model="userinfo.sex" label="0">女</v-radio>
                            </v-form-item>
                        </div>
                        <v-form-item label="生日 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="birthday">
                            <v-date-picker v-model="userinfo.birthday" clearable style="width:100%;"></v-date-picker>
                        </v-form-item>
                        <v-form-item label="毕业院校 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="school">
                            <v-input size="large" v-model="userinfo.school"></v-input>
                        </v-form-item>
                        <v-form-item label="QQ号 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="qq">
                            <v-input size="large" v-model="userinfo.qq"></v-input>
                        </v-form-item>
                        <v-form-item label="微信号 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="wx">
                            <v-input size="large" v-model="userinfo.wx"></v-input>
                        </v-form-item>
                    </v-form>
                </v-spin>
                    <button class="_btn" style="background-color:#03a1ea" @click="usersave('userinfo')">提 交 </button>
                </v-col>
                <v-col span="12">
                    <div>
                        <avatar :id="person.avatar" :name="person.name ||'IMG'" :size="150" :rounded="true"></avatar>
                        <v-upload name="file" :action="action" :data="extra" drag @change="onChange" :beforeUpload="beforeUpload">
                            <p class="ant-upload-drag-icon">
                                <button class="_btn" style="margin-top:80px">上传头像</button>
                            </p>
                        </v-upload>
                        <p style="text-align:center;">支持格式jpg、png 文件小于5M 推荐150*150</p>
                    </div>
                </v-col>
            </v-row>

        </v-card>
    </div>
</template>

<script>
    import perapi from '@/api/person/common';
    import comapi from '@/api/company/common';

    import tool from '@/api/tool';

    // 头像
    import api from '@/api/person.js';
    import endpoint from '@/api/endpoint.js';
    import avatar from '@/components/avatar.vue'

    export default {
        components: {
            'avatar': avatar
        },
        props: {
            // 头像
            action: {
                type: String,
                default: endpoint.url + "/resource"
            }
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
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },
                loading: false,
                spinning:true,
                userinfo: {},
                userinfoRules: {
                    username: [{ required: true, message: '必填信息！' }],
                    mobile: [{ required: true, message: '必填信息！' }, { validator: phoneFormat }],
                    name: [{ required: true, message: '必填信息！' }, { max: 20, message: "长度不超过20字节！" }],
                    // realName: [{ required: true, message: '必填信息！' }, { max: 20, message: "长度不超过20字节！" }],
                    // email: [
                    //     { required: true, message: '必填信息！' },
                    //     { type: 'email', message: '邮箱格式不正确！' }
                    // ],

                },
                // 头像
               person: '',
                //邮箱验验证状态
                emailValitState: 'goVali',
                valiSended: false,
                emailHomeSate: "",
            }
        },
        computed: {
            // 头像
            extra() {
                return {
                    sid: this.$store.getters.loginContext != null ? this.$store.getters.loginContext.sessionId : null
                }
            },
        },

        created() {

            this.reload();  // 头像
            this.getUserInfo();  
            

        },
        methods: {
            //获取信息
            getUserInfo(){
                perapi.getUserInfo().then(
                req => {
                    if(req.birthday){ req.birthday = tool.epochToDateTime(req.birthday); }
                    this.spinning = false;
                    this.userinfo = req;
                    this.loading = false;
                }
            )
                .catch(message => {
                    console.log('获取用户信息失败');
                    this.$message.info('数据请求失败！' + message);
                })
            },
            //个人头像上传前
            beforeUpload(fileInfo) {
                    if (fileInfo.size > 1024 * 1024 * 5) {
                        this.$message.info('文件过大，请重新选择！'); return false;
                    }
                    let imgTypeList = ['image/jpeg', 'image/gif', 'image/png'];
                    if (imgTypeList.indexOf(fileInfo.type) == -1) {
                        this.$message.info('格式不对，请重新选择！'); return false;
                    }
                },
            //上传头像
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (info.file.status === 'done') {
                    api.changeAvatar(info.file.response.id).then(resp => {
                        this.reload();
                    });
                } else if (info.file.status === 'error') {
                    console.log(info.file.name + ' 上传失败.')
                }
            },
            //更新头像
            reload() {
                api.current().then(p => {
                    this.person = p;
                    console.log(this.person);
                   //  this.$store.dispatch("reloadContext");
                }).catch(m => {
                    this.$message.error(m);
                });
            },
            //保存修改
            usersave(formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        perapi.saveUserInfo(_this.userinfo).then(
                            req => {
                                _this.$message.info('保存成功！')
                                //更新上下文
                                this.$store.dispatch('reloadContext').then(ctx => {
                                    setTimeout(function(){ _this.$router.push('/home') },1000);
                                })
                            })
                            .catch(message => {
                                _this.$message.info('数据请求失败！' + message);
                            });
                    } else {
                        _this.$message.info('数据验证未通过，请重新填写！');
                        return false;
                    }
                });
            },
            //发送邮件
            sendEmail() {
                //发送邮件api
                var _this = this;
                if(_this.userinfo.email=='' || _this.userinfo.email == null ){ _this.$message.info('请输入邮箱！'); return false;}
                perapi.sendEmail({email:_this.userinfo.email}).then(
                    req => {
                        _this.valiSended = true;
                        _this.emailValitState = 'weatVali';
                        _this.emailHomeSate = perapi.gaveEmailEnter(_this.userinfo.email);
                        console.log('邮箱入口是');
                        console.log(_this.emailHomeSate);
                    }
                )
                .catch(message => { this.$message.info('数据请求失败！' + message); })
            },
            
            //访问邮箱登录主页
            visitEmail() {
                let _this = this;
                window.open(_this.emailHomeSate);
            }
        },


    }

</script>
<style >
    @import '/static/css/common.css';

    .card-tle-user {
        font-size: 14px;
        padding: 20px;
    }

    .ant-upload.ant-upload-drag {
        border: none;
        width: 150px;
        margin: 0 auto;
    }

    .avatar { 
        margin: 0 auto; 
        }
.sexpos,.emailbt {
        position: relative;
        left: 25%;
        top: -16px;
    }

    .emailbt button {
        border: none;
        color: #fff;
        background: #bbb;
        font-size: 14px;
        height: 32px;
        display: inline-block;
        line-height: 32px;
        padding: 0 15px;
        cursor: pointer;
    }

    .emailbt .valmsg {
        margin: 8px 0;
    }

    .emailbt .valmsg p {
        height: 26px;
        line-height: 20px;
    }

    .emailbt .btns {
        position: absolute;
        left: 62%;
        top: -42px;
    }
    .sexpos .sexitem{
        position: absolute;
        left: 62%;
        top: -42px;
    }

    .ant-upload-drag-icon{
        margin-top:-50px;
    }
</style>