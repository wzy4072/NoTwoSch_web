<template>
    <div style="padding:30px;">
        <v-spin :spinning=" spinningInfo || spinningAva" tip="正在读取数据">
            <v-card title="个人信息" class="card-tle-user">
                <div v-show="false">{{code}}</div>
                <v-row v-show="!spinningInfo && !spinningAva">
                    <v-col span="12">
                        <v-form direction="horizontal" :model="userinfo" :rules="userinfoRules" ref="userinfo">

                            <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">手机 : </v-col>
                                <v-col :span="valSpan">{{userinfo.mobile}}</v-col>
                            </v-row>
                            <v-row class="msg-li">
                                <v-col :span="titleSpan" class="li-tit">真实姓名 : </v-col>
                                <v-col :span="7">{{userinfo.realName}}</v-col>
                                <v-col :span="7">
                                    <v-form-item label="性别" :label-col="{span:6}" :wrapper-col="{span:18}">
                                        <v-radio-group v-model="userinfo.sex" :data="[{value: 1, text: '男'},{value: 0, text: '女'}]"></v-radio-group>
                                    </v-form-item>
                                </v-col>
                            </v-row>
                            <v-form-item label="邮箱" :label-col="labelCol" :wrapper-col="wrapperCol" prop="email">
                                <v-input size="large" v-model="userinfo.email"></v-input>
                            </v-form-item>
                            <div class="emailbt">
                                <div class="btns">
                                    <button style="background-color:#00aee0;" v-show="emailValitState=='goVali' && !userinfo.emailValid" @click.prevent="sendEmail">验证</button>
                                    <button v-show="emailValitState == 'weatVali' && !userinfo.emailValid">等待验证</button>
                                    <button style="background-color:#53c57e;" v-show="userinfo.emailValid">已验证</button>
                                </div>
                                <!-- <div class="valmsg" v-show="valiSended">
                                    <p>验证链接已发送至您的邮箱，请注意查收！</p>
                                    <button style="background-color:#00aee0;" @click="visitEmail">去验证</button>
                                </div> -->
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
                        <button class="_btn" style="background-color:#03a1ea" @click="usersave('userinfo')">保存</button>
                    </v-col>
                    <v-col span="12">
                        <div class="logo-warp">
                            <simple-avatar :gotid="hadBack" :id="imgSourceId" @spin="spinningAva = false"></simple-avatar>
                            <v-upload class="up-btn" name="file" :action="action" :data="extra" @change="onChange" :beforeUpload="beforeUpload">
                                <p class="ant-upload-drag-icon">
                                    <button class="_btn" style="margin-top:80px">上传头像</button>
                                </p>
                            </v-upload>
                            <p style="text-align:center;margin-top:16px;">支持格式jpg、png 文件小于5M 推荐150*150</p>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-spin>
    </div>
</template>

<script>
import perapi from '@/api/person/common';
import comapi from '@/api/company/common';
import passapi from '@/api/root/password';
import tool from '@/api/tool';

// 头像
import api from '@/api/person.js';
import endpoint from '@/api/endpoint.js';
import avatar from '@/components/avatar.vue'
import simpleAvatar from '@/components/dataDisplay/_avatar.vue';

export default {
    components: {
        'avatar': avatar,
        'simpleAvatar': simpleAvatar
    },
    props: {
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
            titleSpan: 6,
            valSpan: 14,
            //图片和信息两项加载完毕后再停止加载动画
            spinningInfo: true,
            spinningAva: true,
            userinfo: {},
            hadBack: false,
            userinfoRules: {
                email: [{ required: true, message: '不能为空！' }, { type: 'email', message: '格式不正确！' }],
                qq: [{ pattern: /^[0-9]+$/, message: "请输入数字！" }, { max: 11, message: "长度不超过11位！" }],
                wx: [{ lmax: 20, message: "长度不能超过20" }],
            },
            imgSourceId: null,
            //邮箱验验证状态
            emailValitState: 'goVali',
            valiSended: false,
            emailHomeSate: "",
        }
    },
    computed: {
        extra() {
            return { sid: this.$store.getters.loginContext != null ? this.$store.getters.loginContext.sessionId : null }
        },
        code() {
            if (this.$route.params.code) { this.bindEmail(); }
            return this.$route.params.code;
        }
    },
    created() {
        this.reload();  // 头像
        this.getUserInfo();
    },
    methods: {
        //获取信息
        getUserInfo() {
            perapi.getUserInfo()
                .then(req => {
                    if (req.success) {
                        req.result.birthday = req.result.birthday == null ? '' : tool.epochToDateTime(req.result.birthday);
                        this.userinfo = req.result;
                        this.spinningInfo = false;
                    } else {
                        this.$message.info('请求失败！' + req.message);
                    }
                })
                .catch(err => {
                    console.log('获取用户信息失败');
                    this.$message.info('数据请求失败！' + err.message);
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
        //上传头像文件
        onChange(info) {
            if (info.file.status === 'done') {
                this.imgSourceId = info.file.response.id;
            } else if (info.file.status === 'error') {
                console.log(info.file.name + ' 上传失败.')
            }
        },
        //关联头像
        relateSource() {
            api.changeAvatar(this.imgSourceId).then(resp => {
                this.$store.dispatch("reloadContext");
                this.reload();
            });
        },
        //更新头像
        reload() {
            api.current().then(req => {
                if (req.success) {
                    this.imgSourceId = req.result.avatarResourceId;

                    this.hadBack = true;
                } else {
                    this.$message.info('数据请求失败！' + req.message);
                }
            }).catch(m => { this.$message.error(m.message, 4); });
        },
        //保存修改
        usersave(formName) {
            var _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.relateSource();
                    let userData = {};
                    userData.mobile = _this.userinfo.mobile
                    userData.realName = _this.userinfo.realName
                    userData.email = _this.userinfo.email
                    userData.sex = _this.userinfo.sex
                    userData.birthday = _this.userinfo.birthday
                    userData.school = _this.userinfo.school
                    userData.qq = _this.userinfo.qq
                    userData.wx = _this.userinfo.wx
                    userData.avatarResourceId = _this.userinfo.avatarResourceId
                    userData.emailValid = _this.userinfo.emailValid

                    // userData.id = _this.userinfo.id
                    perapi.saveUserInfo(userData).then(
                        req => {
                            if (req.success) {
                                _this.$message.info('保存成功', 4)
                                
                                document.dispatchEvent(window.YBG_headInfoChangingTrigger);
                                
                                this.getUserInfo();
                                this.$store.dispatch('reloadContext')
                            }
                        })
                        .catch(err => {
                            _this.$message.info(err.message);
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
            if (this.userinfo.email == '' || this.userinfo.email == null) { this.$message.info('请输入邮箱！'); return false; }
            perapi.sendEmail(this.userinfo.email).then(
                req => {
                    if (req.success) {
                        this.valiSended = true;
                        this.emailValitState = 'weatVali';
                        this.emailHomeSate = perapi.gaveEmailEnter(this.userinfo.email);
                    } else {
                        this.$message.info(req.message,4);
                    }
                }
            )
                .catch(message => { this.$message.info('数据请求失败！' + message); })
        },
        getSexLabel(val) {
            if (val !== null && val !== '') {
                return val == 1 ? '男' : '女';
            } else {
                return '性别：未设置'
            }
        },
        //访问邮箱登录主页
        visitEmail() {
            window.open(this.emailHomeSate);
        },
        bindEmail() {
            let _this = this;
            console.log('绑定邮箱动作开始执行');
            perapi.bindEmail(this.$route.params.code)
                .then(req => {
                    this.$message.info(req.message, 4);
                    this.$router.push('/userinfo');
                    if (req.success) {
                        this.getUserInfo();
                    }
                })
                .catch(err => {
                    this.$message.info('访问失败！' + err.message);
                })
        },
    },
}

</script>
<style scoped>
@import "/static/css/common.css";
.msg-li {
  height: 56px;
  line-height: 32px;
  font-size: 14px;
  padding-bottom: 24px;
}
.li-tit {
  text-align: right;
  padding-right: 14px;
}

.logo-warp {
  text-align: center;
}
.up-btn {
  display: block;
}

.sexpos,
.emailbt {
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
.sexpos .sexitem {
  position: absolute;
  left: 62%;
  top: -42px;
}
</style>
<style>
.ant-upload-list-item {
  display: none;
}
</style>

