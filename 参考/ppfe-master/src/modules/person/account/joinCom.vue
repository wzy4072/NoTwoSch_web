<template>
    <div style="padding:30px;">
        <v-card title="加入公司" class="card-init">
            <div class="com-list">
                <com-list></com-list>
            </div>
            <button class="_btn  cro-com" @click="joinComFlag=true">加入公司</button>
        </v-card>

        <v-modal title="加入公司" 
                    :width="690" 
                    :visible="joinComFlag" 
                    @cancel="joinComFlag=false">
                        <div>
                            <v-form direction="horizontal" :model="joinInfo" :rules="joinRules" ref="joinInfo">
                                <v-form-item label="企业名称 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="name">
                                    <v-input size="large" v-model="joinInfo.name"></v-input>
                                </v-form-item>
                                <v-form-item label="企业ID " :label-col="labelCol" :wrapper-col="wrapperCol" prop="corporateMark">
                                    <v-input size="large" v-model="joinInfo.corporateMark"></v-input>
                                </v-form-item>
                                <v-form-item label="真实姓名 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="relName">
                                    <v-input size="large" v-model="joinInfo.relName"></v-input>
                                </v-form-item>

                                <v-form-item label="备注 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="mark">
                                    <v-input size="large" v-model="joinInfo.mark"></v-input>
                                </v-form-item>
                            </v-form>
                        </div>
                        <div slot="footer">
                            <button class="_btn" @click="ensureJoin('joinInfo')">确 定</button>
                        </div>
                    </v-modal>

        <!-- 加入公司申请 提交成功 -->
        <msg-model 
        src='/static/images/home/alreadySubmit.png' 
        title='加入公司' 
        msgTitle="已经提交申请！"
         msg='请保持电话的畅通，我们正在赶往联系您的路上！' 
        :showFlag="joinComState"
        @ensreClick="joinComState=false">
        </msg-model>


    </div>

</template>

<script>
    import msgModel from '@/components/msgModel.vue';
    // import editStaffModal from '@/components/dataEntry/staffEdit.vue';
    import comList from '@/components/dataDisplay/comList.vue';
    import comapi from '@/api/company/common';

    export default {
        components: {
            'msgModel': msgModel,
            // 'editModal': editStaffModal,
            'comList': comList,
        },
        data() {
            return {
                joinInfo: { contactsName: "", corporateMark: "", mark: '' },
                joinRules: {
                    name: [{ required: true, message: '必填信息' }],
                    corporateMark: [{ required: true, message: '必填信息' }],
                    relName: [{ required: true, message: '必填信息' }],
                },
                joinComFlag:false,
                joinComState:false,
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },


            }
        },
        methods: {
           ensureJoin(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        comapi.joinCompany(_this.joinInfo).then(
                            req => {
                                if (req.success) {
                                    this.$message.info('请求成功！');
                                    _this.joinComState = true;
                                } else {
                                    this.$message.info('数据请求失败！' + req.message);
                                }
                            })
                            .catch(err => {
                                _this.$message.info('数据请求失败！' + err.message);
                            });
                    } else {
                        _this.$message.info('数据验证未通过，请重新填写！');
                        return false;
                    }
                });
            },
        }

    }
</script>
<style scoped>
        @import '/static/css/common.css';
    @import '/static/css/modal.css';
        .com-list{
        margin-bottom: 38px;
    }
    .cro-com{
        margin:0;
                margin-left:35px;

    }
</style>