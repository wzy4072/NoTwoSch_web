<template>
    <v-card title="凭证管理">
        <v-row>
            <v-form>
                <v-form-item label="公司名">
                    <v-input placeholder="请输入 " v-model="query.companyName"></v-input>
                </v-form-item>
                <v-form-item label="产品">
                    <v-select tags style="width: 240px;" v-model="query.productName" :data="productList" clue="name" label="name"></v-select>
                </v-form-item>
                <v-form-item>
                    <v-button type="primary" @click="search">search</v-button>
                </v-form-item>
            </v-form>
        </v-row>
        <v-row>
            <v-data-table ref='voucherTable' :data='tableDataList' :columns='columns' :page-num="pageNo" :page-size="pageSize">
                <template slot="th" slot-scope="props">
                    <strong v-if="props.column.field=='operate'">操作</strong>
                    <strong v-else v-html="props.title"></strong>
                </template>
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='operate'">
                        <v-button  v-show="props.item.isDisable" type="ghost" icon="unlock" @click="unlockVoucher(props)">
                            <span>启用</span>
                        </v-button>                        
                        <v-button v-show="!props.item.isDisable" type="ghost" icon="lock" @click="lockVoucher(props)">
                            <span>停用</span>
                        </v-button>
                        <v-button  type="error" icon="delete" @click="showDelModal(props)">
                            <span>删除</span>
                        </v-button>
                    </div>
                    <div v-else-if="props.column.field == 'endTime' ">
                        {{switchTime(props.item.endTime)}}
                    </div>
                    <div v-else-if="props.column.field == 'startTime' ">
                        {{switchTime(props.item.startTime)}}
                    </div>
                    <div v-else-if="props.column.field == 'isDisable' ">
                        {{props.item.isDisable === false ? '启用' : '停用'}}
                    </div>
                    
                    <span v-else v-html="props.content"></span>
                </template>
            </v-data-table>
        </v-row>
        <v-modal title="确定删除" type="confirm" :visible="delModalShow" @ok="delVoucher" @cancel="delModalShow = false">
            确定要删除？
        </v-modal>

    </v-card>
</template>
<script>
import searchers from '@/components/dataEntry/adminHeadSearchers.vue';
import productApi from '@/api/admin/product.js';
import api from '@/api/admin/voucher.js';
import tool from '@/api/tool.js';


export default {
    data() {
        return {
            searchOptions: {
                show: false,
            },
            pageNo: 1,
            pageSize: 10,
            query: {
                companyName: '',
                productName: ''
            },
            delModalShow: false,
            columns: [
                { title: "企业名称", field: 'companyName' },
                { title: "产品名", field: 'productName' },
                { title: "状态", field: 'isDisable' },
                { title: "凭证ID", field: 'voucherId' },
                { title: "开始时间", field: 'startTime' },
                { title: "结束时间", field: 'endTime' },
                { title: "操作", field: 'operate' },
            ],
            productList: [],
            delQuery: {},
        }
    },
    methods: {

        search() {
            this.$refs.voucherTable.reload();
        },
        tableDataList(param) {
            var result = api.getVouchers({
                "query": this.query,
                "pageNo": param.pageNo,
                "pageSize": param.pageSize,
            })
                .then(resp => {
                    if (resp.success) {
                        return resp.result;
                    } else {
                        this.$message.error(resp.message)
                    }
                })
                .catch(e => { this.$message.error(e) })
            return result;
        },
        showDelModal(params) {
            this.delQuery = params.item;
            this.delModalShow = true;
        },
        delVoucher() {
            api.delVoucher({ voucherId: this.delQuery.voucherId })
                .then(resp => {
                    if (resp.success == 1) {
                        this.$message.info('删除成功！');
                        this.search();
                        this.delModalShow = false;
                    } else {
                        this.$message.error(resp.message);
                    }
                })
        },
        init() {
            // productApi.getProductList({ query: [], pageNo: 1, pageSize: 10 })
            api.getProductList()
                .then(resp => {
                    if (resp.success) {
                        this.productList = resp.result;
                    } else {
                        this.$message.error(resp.message);
                    }

                })

        },
        switchTime(t) {
            return tool.epochToSecondTime(t);
        },
        lockVoucher(params) {
            api.lockVoucher({ voucherId: params.item.voucherId })
                .then(resp => {
                    if (resp.success == 1) {
                        this.$message.info('停用成功！');
                        this.search();
                    } else {
                        this.$message.error(resp.message);
                    }
                })
        },
        unlockVoucher(params) {
            api.unlockVoucher({ voucherId: params.item.voucherId })
                .then(resp => {
                    if (resp.success == 1) {
                        this.$message.info('启用成功！');
                        this.search();
                    } else {
                        this.$message.error(resp.message);
                    }
                })
        },
    },
    created() {
        this.init();
    }
}
</script>