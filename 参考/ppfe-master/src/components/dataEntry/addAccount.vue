<template>
    <v-modal title="添加账户" closable :width="690" :visible="show" @cancel="cancel" @ok="ensureAdd('accountInfo')">
        <v-form direction="horizontal" :model="accountInfo" :rules="rules" ref="accountInfo">
            <v-form-item label="姓名" :label-col="labelCol" :wrapper-col="wrapperCol" prop="personName">
                <v-input size="large" v-model="accountInfo.personName" placeholder="请输入真实姓名"></v-input>
            </v-form-item>
            <v-form-item label="手机" :label-col="labelCol" :wrapper-col="wrapperCol" prop="tel">
                <v-input size="large" v-model="accountInfo.tel" placeholder="请输入正确的手机号"></v-input>
            </v-form-item>
            <v-form-item label="邮箱" :label-col="labelCol" :wrapper-col="wrapperCol" prop="email">
                <v-input size="large" v-model="accountInfo.email" placeholder="请输入常用邮箱"></v-input>
            </v-form-item>
            <v-form-item label="企业ID" :label-col="labelCol" :wrapper-col="wrapperCol" prop="corpId">
                <v-input size="large" v-model="accountInfo.corpId" placeholder="请输入企业ID"></v-input>
            </v-form-item>
            <v-form-item label="密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="password">
                <v-input size="large" type="password" v-model="accountInfo.password" placeholder="请输入密码"></v-input>
            </v-form-item>
            <!-- <v-form-item label="企业id" :label-col="labelCol" :wrapper-col="wrapperCol" prop="corpId">
                <v-select size="lg" :data="corpOptions" v-model="accountInfo.corpId">
                     <template scope="{data}">
                                    {{data.label}}-{{data.value}}
                     </template>
                </v-select>
            </v-form-item> -->

        </v-form>
    </v-modal>
</template>

<script>
import psn from '@/api/admin/person';
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
            accountInfo: {personName:null, corpId:null, tel:null, email:null,password:null, industry:null},
            // corpOptions:[],
            rules: {
                tel: [{ required: true, message: '不能为空！' }, { validator: phoneFormat }],
                personName: [{ required: true, message: '不能为空！' }],
                email: [{ required: true, message: '不能为空！' }, { type: 'email', message: '邮箱格式不正确！' }],
                password: [{ required: true, message: '不能为空！' },{min:6,message:'至少6位！'}],
                corpId: [{ required: true, message: '不能为空！' }],
            },
        }
    },
   
    watch: {
        show() {
             this.accountInfo = {personName:null, corpId:null, tel:null, email:null,password:null}
        },
    },
    methods: {
        ensureAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    psn.addAccount(this.accountInfo)
                        .then(req => {
                            if (req.success) {
                                this.$message.info(req.message);
                                this.$emit('ok')
                            } else {
                                this.$message.info(req.message);
                            }
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
.sexitem {
  padding-left: 35px;
}
.mark-info {
  padding-left: 18%;
  color: #da0101;
}
</style>
