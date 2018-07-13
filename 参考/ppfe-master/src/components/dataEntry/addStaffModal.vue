<template>
    <v-modal title="添加员工" closable :width="690" :visible="show" @cancel="cancel" @ok="ensureAdd('staffInfo')">
        <v-spin :spinning="spinning" >

        <v-form direction="horizontal" :model="staffInfo" :rules="staffBaseRules" ref="staffInfo">
            <v-form-item label="手机" :label-col="labelCol" :wrapper-col="wrapperCol" prop="phone">
                <v-input size="large" v-model="staffInfo.phone"  placeholder="请输入正确的手机号"></v-input>
            </v-form-item>
            <v-row>
                <v-col :span="12">
                    <v-form-item label="姓名" :label-col="{span:12}" :wrapper-col="{span:12}" prop="realName">
                        <v-input size="large" v-model="staffInfo.realName" placeholder="请输入真实姓名" ></v-input>
                    </v-form-item>
                </v-col>
                <v-col span="7" class="sexitem">
                    <v-form-item  :wrapper-col="{span: 24}" prop="sex" >
                        <v-radio v-model="staffInfo.sex" label="1">男</v-radio>
                        <v-radio v-model="staffInfo.sex" label="0">女</v-radio>
                    </v-form-item>
                </v-col>
            </v-row>

            <v-form-item label="邮箱" :label-col="labelCol" :wrapper-col="wrapperCol" prop="email">
                <v-input size="large" v-model="staffInfo.email" placeholder="请输入常用邮箱"></v-input>
            </v-form-item>
        </v-form>
        <p class="mark-info">提示：手机和邮箱用于接收激活账户信息，请确保信息的真实性。</p>
        </v-spin>
    </v-modal>
</template>

<script>

import staffapi from '@/api/company/staff';
export default {
    props: ['show'],
    data() {
          var phoneFormat = (rule, value, callback) => {
            if (!/^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
                callback(new Error('手机号码格式不正确！'));
            } else {
                callback();
            }
        };
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            staffInfo: { phone: null, realName: null, email: null, sex: null },
            spinning:false,
            staffBaseRules: {
                phone: [{ required: true, message: '不能为空！' }, { validator: phoneFormat }],
                realName: [{ required: true, message: '不能为空！' }],
                email: [{ required: true, message: '不能为空！' },{type:'email',message:'邮箱格式不正确！'}],
            },
        }
    },
    watch:{
        show(){
            this.staffInfo = { phone: null, realName: null, email: null, sex: null };
        },
    },
    methods: {
        ensureAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.spinning = true;
                    staffapi.addStaff(this.staffInfo)
                        .then(req => {
                            if (req.success) {
                                this.spinning = false;
                                this.$message.info(req.message );
                                this.$emit('ok')
                            } else { 
                                this.$message.info(req.message ); 
                                }
                            this.spinning = false;
                        })
                        .catch(message => { this.$message.info('数据请求失败！' + message); })
                } else { this.$message.info('数据验证未通过，请重新填写！'); return false; }
            })
        },
        cancel() {
            this.$emit('cancel')
        }
    },
}
</script>

<style scoped>
.sexitem{
    padding-left: 35px;
}
.mark-info{
    padding-left: 18%;
    color:#da0101;
}

</style>
