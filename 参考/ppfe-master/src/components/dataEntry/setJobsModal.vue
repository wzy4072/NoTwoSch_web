<template>
    <v-modal title="编辑" closable :width="690" :visible="show" @cancel="cancel" @ok="ok">
        <v-spin :spinning="!(!jobListReady && !voucherListReady)">
            <v-row>
                <v-col span="2" class="tab-ths">编号</v-col>
                <v-col span="3" class="tab-ths">姓名</v-col>
                <v-col :span="tabCol" class="tab-ths">手机</v-col>
                <v-col span="3" class="tab-ths">性别</v-col>
                <v-col :span="tabCol" class="tab-ths">岗位</v-col>
                <v-col span="8" class="tab-ths">权限</v-col>
            </v-row>
            <v-row>
                <v-col span="2" class="tab-tds">{{value.index}}</v-col>
                <v-col span="3" class="tab-tds">{{value.realName}}</v-col>
                <v-col :span="tabCol" class="tab-tds">{{value.phone}}</v-col>
                <v-col span="3" class="tab-tds">
                    <v-select style="width: 100%" :data="sexList" v-model="sex">
                    </v-select>
                </v-col>
                <v-col :span="tabCol" class="tab-tds">
                    <v-select v-if="!value.isAdmin" style="width: 100%" :data="jobList" v-model="roleid" />
                    <span v-else>{{value.role}}</span>
                </v-col>
                <v-col span="8" class="tab-tds special">
                    <v-select style="width: 100%" :data="voucherList" v-model="voucherNo" multiple></v-select>
                </v-col>
            </v-row>
        </v-spin>
    </v-modal>
</template>

<script>

import staffapi from '@/api/company/staff';
import comapi from '@/api/company/common';
import payapi from '@/api/pay';
import tool from '@/api/tool';
export default {
    props: {
        value: Object,
        show: Boolean,
    },
    data() {
        return {
            jobListReady: true,
            voucherListReady: true,
            tabCol: 4,
            roleid: this.value.roleid == null ? null : parseInt(this.value.roleid),
            voucherNo: this.value.voucherNo,
            sex: this.value.sex,
            jobList: [],
            voucherList: [],
            sexList: [{ label: "男", value: 1 }, { label: "女", value: 0 }],
        }
    },
    watch: {
        value(val) {
            this.roleid = this.value.roleid == null ? null : parseInt(this.value.roleid)
            this.voucherNo = val.voucherNo ? JSON.parse(JSON.stringify(val.voucherNo)) : val.voucherNo;
            this.sex = val.sex
        },
    },
    created() {
        this.getJobList().then(() => {
            this.jobListReady = false;
        });
        this.getVoucherList().then(() => {
            this.voucherListReady = false;
        });
    },
    methods: {
        //岗位列表
        getJobList() {
            return comapi.getJobsList()
                .then(req => {
                    if (req.success) {
                        this.jobList = req.result;
                    } else {
                        this.$message.info('数据请求失败！' + req.message);
                        this.$emit('cancel')
                    }
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); })

        },
        //凭证列表
        getVoucherList() {
            let _this = this;
            return payapi.getVoucherList()
                .then(data => {

                    this.voucherList =  data.map(v => {
                        return { label: v.voucher.name, value: v.voucher.voucherNo };
                    });

                    //let capacity = data.voucher.optionValues.find(op => op.specName === 'user-count').value ;
                    //let used = data.uesdVoucher.num ;

                    //let variaItem = tool.findItems(req[0].product.variations, { code: req[0].voucher.productVariationCode });
                    //let valuesItem = tool.findItems(variaItem[0].values, { specName: 'user-count' });
                    //_this.currentTableData = { maxUserCount: valuesItem[0].value, name: variaItem[0].alias };
                })
                .catch(err => { throw err; })
        },

        ok() {
            var newVal = JSON.parse(JSON.stringify(this.value));
            newVal.roleid = this.roleid;
            newVal.voucherNo = this.voucherNo;
            newVal.sex = this.sex;
            this.$emit('input', newVal);
            this.$emit('ok', newVal);
        },
        cancel() {
            this.$emit('cancel')
        }
    },
}
</script>
<style scoped>
.tab-ths,
.tab-tds {
  padding: 4px 8px;
}
.special:after{
    font-family: anticon;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\E61D";
    display: inline-block;
    font-size: 7px;
    zoom: 1;
    position: absolute;
    color: #bbb;
    top: 55%;
    transform: translateY(-50%);
    right: 18px;
}
</style>
<style>

.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item:after{
    font-family: anticon;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\E632";
    color: transparent;
    display: inline-block;
    font-size: 12px;
    zoom: 1;
    transition: all .2s ease;
    position: absolute;
    color: #ddd;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    font-weight: 700;
}
.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item.ant-select-dropdown-menu-item-selected:after,
.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item.ant-select-dropdown-menu-item-selected:hover:after{
    color: #108ee9;
    display: inline-block;
}

</style>

