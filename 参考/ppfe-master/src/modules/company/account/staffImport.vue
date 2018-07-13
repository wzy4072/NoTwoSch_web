<template>
    <div style="padding:30px;">
        <v-card title="导入员工">
            <div v-show="!upFileSuc">
                <!-- 导入流程 -->
                <v-row class="impt-nav">
                    <div class="lis" v-for="(item,index) in navListNames" :key="index">
                        <span class="lis-no">{{item.nos}}</span>
                        <span class="lis-msg">{{item.msg}}</span>
                    </div>
                </v-row>
                <!-- 下载导入 -->
                <v-row class="ipt-blk">
                    <div class="icon">
                        <v-icon type="download"></v-icon>
                    </div>
                    <div class="blk-msg">
                        <p>按照模板格式，填写要导入员工的信息</p>
                        <!-- <span @click="downloadFile">下载模板</span> -->
                        <a :href="downloadFileHref">下载模板</a>
                    </div>
                </v-row>
                <v-row class="ipt-blk">
                    <div class="icon">
                        <v-icon type="cloud-upload-o"></v-icon>
                    </div>
                    <div class="blk-msg">
                        <p>填写完成，上传员工信息表（仅支持.xls/.xlsx格式，且文件大小不能超过1M）</p>
                        <v-upload :action="fileUpAction" @change="uploadFile" :data="extra" :beforeUpload="beforeUpload">
                            <span>上传文件</span>
                        </v-upload>
                    </div>
                </v-row>
            </div>

            <div v-show="upFileSuc">
                <v-row class="ipt-tit">
                    <v-icon type="download"></v-icon> 导入信息确认</v-row>
                <v-row class="ipt-blk cbks">
                    <div class="cbk-suctit">
                        <v-icon type="check-circle-o"></v-icon> 已成功创建员工信息:
                        <span>{{importInfo.successImportCount}}</span>人</div>
                    <div class="cbk-sucmsg">
                        <p>
                            <span>-</span> 可在
                            <router-link to="/account/staff">
                                <span>员工列表</span>
                            </router-link>中查看导入成功的员工信息</p>
                        <p>
                            <span>-</span> 员工初始化密码已发送至员工手机与邮箱中，请提醒员工查看</p>
                    </div>
                </v-row>
                <router-link to="/account/staff" v-show="importInfo.failImportList.length==0">
                    <v-button type="ghost">返回员工列表</v-button>
                </router-link>
                <v-row class="ipt-blk cbks cbkfail" v-show="importInfo.failImportList.length>0">
                    <div class="cbk-suctit">
                        <v-icon type="question-circle-o"></v-icon>待确认员工:
                        <span>{{importInfo.failImportList.length}}</span>人</div>
                    <div class="cbfail-tb">
                        <v-spin :spinning="resending">

                            <v-form direction="horizontal" :model="importInfo" ref="importForm">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <thead>
                                        <tr>
                                            <th>姓名</th>
                                            <th>手机</th>
                                            <th>邮箱</th>
                                            <th>系统提示</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in importInfo.failImportList" :key="index">
                                            <td>{{item.realName}}</td>
                                            <td class="ipt-td">
                                                <v-form-item :prop="'failImportList.' + index + '.phone'" :rules="{validator: phoneFormat }">
                                                    <span-input v-model="item.phone"></span-input>
                                                </v-form-item>
                                            </td>
                                            <td class="ipt-td">
                                                <v-form-item :prop="'failImportList.' + index + '.email'" :rules="[{required: true, message: '不能为空!'},{type: 'email', message: '格式不正确!'}]">
                                                    <span-input v-model="item.email"></span-input>
                                                </v-form-item>
                                            </td>
                                            <td>{{item.tips}}</td>
                                            <td>
                                                <span @click="delItem(index)">
                                                    <v-icon type="delete"></v-icon>
                                                </span>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </v-form>
                        </v-spin>

                    </div>
                    <v-button type="primary" @click="reSend('importForm')" v-show="importInfo.failImportList.length>0">加入员工列表</v-button>
                    <router-link to="/account/staff">
                        <v-button type="ghost">返回员工列表</v-button>
                    </router-link>
                </v-row>
            </div>
        </v-card>
    </div>
</template>
<script>

import spanInput from '@/components/dataEntry/spanInput.vue'

import config from 'appconfig';
import staffapi from '@/api/company/staff';
import tool from '@/api/tool';

export default {
    components: {
        'spanInput': spanInput
    },
    data: function () {
        return {
            navListNames: [{ nos: '1.', msg: '下载模板' }, { nos: '2.', msg: '上传文件' }, { nos: '3.', msg: '创建完成' }, { nos: '4.', msg: '确认信息' }, { nos: '5.', msg: '发送密码' }],
            importInfo: { successImportCount: null, failImportList: [] },
            failImportList: [],     //导入失败列表
            upFileSuc: false,
            downloadFileHref: config.endpointUrl + '/staff/getimporttemplate',
            fileUpAction: config.endpointUrl + '/staff/import',
            resending: false,
        };
    },
    computed: {
        extra() {
            return { sid: this.$store.getters.loginContext != null ? this.$store.getters.loginContext.sessionId : null }
        },
    },
    methods: {
        downloadFile() {
            window.open(config.endpointUrl + '/staff/getimporttemplate');
        },
        beforeUpload(fileInfo) {
            if (fileInfo.size > 1024 * 1024 * 1) {
                this.$message.info('文件过大，请重新选择！'); return false;
            }
            let imgTypeList = ['application/vnd.ms-excel', 'application/x-xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (imgTypeList.indexOf(fileInfo.type) == -1) {
                this.$message.info('格式不对，请重新选择！'); return false;
            }
        },
        uploadFile(info) {
            if (info.file.status === 'done') {
                if (!info.file.response.success) {
                    this.$message.info(info.file.response.message );
                    return false;
                }
                let result = info.file.response.result;
                this.upFileSuc = true;
                this.$message.info('上传成功！' + info.file.name );
                this.importInfo = result;
            } else if (info.file.status === 'error') {
                this.$message.info('文件上传失败了！' + info.file.name );
            }
        },
        //再次保存
        reSend(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    this.$message.info('请检查数据格式！');
                    return false;
                }
            });
            tool.eliminateField(this.importInfo.failImportList, ['phone', 'realName', 'email', 'sex'], true);
            this.resending = true;
            staffapi.importStaffResend({ list: this.importInfo.failImportList })
                .then(req => {
                    if (req.success) {
                        this.importInfo = req.result;
                    } else {
                        this.$message.info(req.message );
                    }
                    this.resending = false;
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        delItem(index) {
            this.importInfo.failImportList.splice(index, 1);
        },
        phoneFormat(rule, value, callback) {
            if (!value) {
                callback(new Error('不能为空！'));
            } else if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
                callback(new Error('手机号码格式不正确！'));
            } else {
                callback();
            }
        }
    },

}
</script>
<style scoped>
.impt-nav {
}
.lis {
  height: 84px;
  line-height: 82px;
  display: inline-block;
  width: 220px;
  min-width: 190px;
  text-align: center;
}

.lis:not(:last-child),
.lis:not(:first-child) {
  background: url(/static/images/home/arrow2.png) no-repeat center center;
}
.lis:first-child {
  background: url(/static/images/home/arrow1.png) no-repeat center center;
}
.lis:last-child {
  background: url(/static/images/home/arrow3.png) no-repeat center center;
}

.lis-no {
  display: inline-block;
  font-size: 42px;
  color: #f9c8bc;
}
.lis-msg {
  vertical-align: top;
  display: inline-block;
  font-size: 24px;
  color: #fefefc;
}

.ipt-blk {
  background: #f5f9fc;
  margin: 12px 0;
}
.ipt-blk .icon {
  display: inline-block;
  font-size: 40px;
  color: #05a0e9;
  padding: 12px 26px;
}
.ipt-blk .blk-msg {
  display: inline-block;
}
.blk-msg p,
.blk-msg span {
  font-size: 14px;
}
.ipt-blk .blk-msg span {
  cursor: pointer;
  color: #05a0e9;
}

.cbks {
  padding: 20px 30px;
}
.ipt-tit {
  font-size: 18px;
  color: #05a0e9;
  font-weight: 600;
}

.cbk-suctit {
  font-size: 14px;
  display: inline-block;
}
.cbk-suctit > i {
  padding-right: 26px;
}
.cbk-suctit > i,
.cbk-suctit > span {
  font-size: 22px;
  color: #05a0e9;
}
.cbk-sucmsg > p > span {
  color: #05a0e9;
}
.cbk-sucmsg {
  display: inline-block;
  vertical-align: middle;
  padding-left: 100px;
}
.cbk-sucmsg > p {
  padding: 4px;
}
.cbkfail .cbk-suctit span,
.cbkfail .cbk-suctit i {
  color: #fe644d;
}
.cbfail-tb {
  margin: 12px;
}
.cbfail-tb table {
  width: 100%;
  border: 1px solid #e5e6e8;
  border-collapse: collapse;
  font-size: 14px;
}
.cbfail-tb table thead {
  background-color: #fbf7f6;
}
.cbfail-tb table thead tr th {
  text-align: center;
  padding: 12px;
  width: 100px;
}
.cbfail-tb table tbody tr {
  height: 50px;
  border-top: 1px solid #f5f6f8;
}
.cbfail-tb table tbody tr td {
  background-color: #fff;
  width: 100px;
  text-align: center;
}
.cbfail-tb table tbody tr td.ipt-td {
  width: 150px;
}
.cbfail-tb table tbody tr td.ipt-td input {
  width: 120px;
}
</style>
<style>
.ant-upload-list {
  display: none;
}
</style>
