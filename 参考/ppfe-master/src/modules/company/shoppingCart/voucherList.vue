<template>
    <div style="padding:30px;">
        <v-card title="凭证列表：">
            <v-spin :spinning="spinning">
                <!-- 当前凭证 -->
                <v-data-table :data='getCurrentVoucher' :columns='currentColumns' :pagination="false" :pageSize="100" ref="currentVoucherTable"></v-data-table>
                <div class="interlayer"></div>

                <!-- 凭证列表 -->
                <v-data-table :data='getVoucherList' :columns='columns' :pagination="false" :pageSize="100" ref="vocuerTable">
                    <template slot="td" slot-scope="props">
                        <div v-if="props.column.field=='personNo'">
                            <div>{{props.item.personNo}} 人</div>
                        </div>
                        <div v-else-if="props.column.field=='handle'" class="btns">
                            <router-link to="/goods/listing">
                                <span v-if="!props.item.purchased">升级权限</span>
                            </router-link>
                            <span v-if="props.item.purchased" @click="openStaffModal(props.item)">添加员工</span>
                        </div>
                        <span v-else v-html="props.content"></span>
                    </template>
                </v-data-table>
            </v-spin>

            <!-- 选择员工 -->
            <staffselect-modal :show="stafflistModalShow" v-model="staffModalInfo" @ok="submitStaffs" @cancel="cancelSelect"></staffselect-modal>
        </v-card>
    </div>
</template>
<script>
import payapi from '@/api/pay';
import tool from '@/api/tool';
import staffSelectModal from '@/components/dataEntry/staffSelectModal.vue'
export default {
    components: {
        'staffselectModal': staffSelectModal
    },

    data: function () {
        return {
            currentColumns: [
                { title: "权限名称", field: 'name' },
                { title: "权限已配置人数", field: 'maxUserCount' },
            ],
            columns: [
                { title: "权限名称", field: 'alias' },
                { title: "限制人数", field: 'maxUserCount' },
                { title: "操作", field: 'handle' },
                { title: "具体权限", field: 'description' },
            ],
            stafflistModalShow: false,
            staffModalInfo: {
                cardtitle: '选择员工',
                leftList: [],
                rightList: [],
                isadmin: false
            },
            spinning: true,
            voucherNo: null,
            currentTableData: [{ personNo: '', name: '' }],
        }
    },
    computed: {
        loginContext() {
            return this.$store.getters.loginContext == null ? { currentCorporate: { walletId: null }, person: '' } : this.$store.getters.loginContext;
        },
    },
    methods: {
        // 凭证列表和未购买产品
        getVoucherList() {
            let _this = this;
            return payapi.getVoucherList()
                .then(req => {
                    _this.spinning = false;
                    if (req.length > 0) {
                        _this.currentTableData = [];
                        let productList = [];
                        for (let i = 0; i < req.length; i++) {
                            let item = _this.handleTableData(req[i]);
                            _this.currentTableData.push(item.currentTableData);
                            productList = productList.concat(item.productTableData);
                        }
                        _this.$refs.currentVoucherTable.reload();
                        return { result: productList, totalCount: 1, pageSize: 10, pageNo: 1 };
                    } else {
                        this.$message.info('您的数据未找到！');
                        return { result: [], totalCount: 1, pageSize: 10, pageNo: 1 };
                    }
                })
                .catch(err => { throw err; });
        },
        //处理table数据，查找当前的值
        handleTableData(item) {
            //查当前凭证已分配人数，如果是0后台直接给空数组
            let usedNo = item.uesdVoucher.num == null ? 0 : item.uesdVoucher.num
            //查当前凭证对应产品中的产品名字
            let variaItem = tool.findItems(item.product.variations, { code: item.voucher.productVariationCode });
            let aliasName = variaItem[0].alias;
            return { currentTableData: { maxUserCount: usedNo, name: aliasName }, productTableData: item.variations }
        },
        //当前凭证
        getCurrentVoucher() {
            return new Promise((resolve, reject) => {
                let data = { result: this.currentTableData, totalCount: 1, pageSize: 10, pageNo: 1 };
                return resolve(data);
            });
        },
        //获取凭证下已分配和未分配职工
        openStaffModal(item) {
            let _this = this;
            _this.voucherNo = item.voucherNo;
            payapi.getVoucherStaffList(item.voucherNo)
                .then(req => {
                    if (req.success) {
                        _this.stafflistModalShow = true;
                        _this.staffModalInfo.leftList = req.result.unassigned;
                        _this.staffModalInfo.rightList = req.result.assigned;
                    }
                })
                .catch(err => { throw err; });
        },
        //分配凭证给员工
        submitStaffs() {
            let selectIds = tool.getArrItemValues(this.staffModalInfo.rightList, 'id');
            let params = { editingPersonIds: selectIds, corpId: this.loginContext.currentCorporate.id, voucherNo: this.voucherNo, pids: selectIds };
            payapi.voucherAllot(params)
                .then(req => {
                    if (req.success) {
                        this.getVoucherList();
                        //
                        document.dispatchEvent(window.YBG_headInfoChangingTrigger);
                        this.$message.info(req.message);
                        this.stafflistModalShow = false;
                    }
                })
                .catch(err => { throw err; });
        },
        //取消分配
        cancelSelect() {
            this.stafflistModalShow = false;
        },
    },
}
</script>
<style>
.interlayer {
  height: 20px;
}
.btns > span {
  cursor: pointer;
  color: #02a0e9;
}
</style>