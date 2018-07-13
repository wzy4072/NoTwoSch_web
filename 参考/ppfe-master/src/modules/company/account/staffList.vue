<template>
    <div style="padding:30px;">
        <v-card title="员工管理">
            <v-row class="top-btns">
                <v-button type="primary" @click="showAddStaff=true">
                    <span>+新增员工</span>
                </v-button>
                <!-- <v-button @click="getAllRoles">配置权限</v-button> -->
                <router-link to="/account/importstaff">
                    <v-button type="ghost">
                        <span>导入员工</span>
                    </v-button>
                </router-link>
                <v-input-group compact class="sch-ipt">
                    <v-input v-model="searchQuery" style="width:200px" placeholder="姓名/手机/邮箱"></v-input>
                    <!-- 
                    -->
                    <v-button type="primary" icon="search" @click="tableSearch"></v-button>
                </v-input-group>
            </v-row>

            <!-- checkType="checkbox" @checkall="checkAll" @clickrow="checkRow" :rowClickChecked="false"  -->
            <v-data-table :data='getStaffList' :columns='columns' :pagination="false" :pageSize="100" ref="staffTable">
                <template slot="th" slot-scope="props">
                    <strong v-if="props.column.field=='id'">操作</strong>
                    <strong v-else v-html="props.title"></strong>
                </template>
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='id'" class="edit-btns">
                        <span @click="editStaff(props.item,props.index)">编辑</span>
                        <!-- <span @click="getSingleRoles(props.item)"> | 分配凭证</span>  -->
                        <!-- <span style="cursor:pointer;" v-show="getReinvitShow(props.inviteDate)"@click="reInvite(props.item)"> | 重发邀请</span>  -->
                    </div>
                    <div v-else-if="props.column.field=='orderNo'">
                        <span>{{props.index
                            <9 ? '0'+ (props.index +1) : (props.index+1) }}</span>
                    </div>
                    <div v-else-if="props.column.field=='sex'">
                        <span>{{getSex(props.item.sex)}}</span>
                    </div>
                    <div v-else-if="props.column.field=='role'">
                        <span>{{props.item.role ==null || props.item.role =='' ? '未设置' : props.item.role}}</span>
                    </div>
                    <div v-else-if="props.column.field=='blocked'">
                        <span>{{props.item.blocked == 1 ? '激活' :'未激活' }}</span>
                    </div>
                    <div v-else-if="props.column.field=='delete'">
                        <span style="cursor:pointer;" @click="delStaff(props.item)">
                            <v-icon type="delete"></v-icon>
                        </span>
                    </div>
                    <span v-else v-html="props.content">
                    </span>
                </template>
            </v-data-table>
        </v-card>

        <!-- 添加员工 -->
        <add-staff :show="showAddStaff" @ok="addStaffSuc" @cancel="showAddStaff = false">
        </add-staff>
        <!-- 设置岗位 -->
        <set-jobs :show="showEditingStaff" v-model="editingStaff" @ok="setJobsuccess" @cancel="cancelEditing"></set-jobs>
        <!-- 删除员工  -->
        <v-modal title="删除" :visible="delStaffShow" @ok="ensureDelStaff" @cancel="cancelDelStaff">
            <p style="padding-left: 64px;font-size: 16px;">确认删除员工“ {{accountStaff.realName}} ”吗？</p>
            <div slot="footer">
                <v-button key="cancel" type="error" size="large" @click="ensureDelStaff">
                    删除
                </v-button>
                <v-button key="confirm" type="ghost" size="large" @click="cancelDelStaff">
                    取消
                </v-button>
            </div>
        </v-modal>

    </div>

</template>
<script>
import addStaffModal from '@/components/dataEntry/addStaffModal.vue';
import setJobsModal from '@/components/dataEntry/setJobsModal.vue';

import staffapi from '@/api/company/staff';
import perapi from '@/api/person/common';
import tool from '@/api/tool';

export default {
    components: {
        'addStaff': addStaffModal,
        'setJobs': setJobsModal,
    },
    data: function () {
        return {
            columns: [
                { title: "编号", field: 'orderNo' },
                { title: "姓名", field: 'realName' },
                { title: "性别", field: 'sex' },
                { title: "手机", field: 'phone' },
                { title: "邮箱", field: 'email' },
                { title: "编辑", field: 'id' },
                { title: "岗位", field: 'role' },
                { title: "状态", field: 'blocked' },
                { title: "删除", field: 'delete' },

            ],
            tableData: [],
            searchQuery: '',
            //新增员工
            showAddStaff: false,
            //导入员工
            importStaffModal: false,
            //设置岗位
            showEditingStaff: false,
            editingStaff: {},
            editingStaffBackUp: {},
            //删除员工
            accountStaff: { id: '', realName: '' },
            delStaffShow: false,

            //配置权限modal 个人权限查看modal
            powerSetShow: false,
            powersEntry: [],
            staffIds: [],
            singleId: [],
            editSingle: false,

            currentStaffId: null,
        }
    },
    computed: {
        loginContext() {
            return this.$store.getters.loginContext == null ? { currentCorporate: { walletId: null }, person: '' } : this.$store.getters.loginContext;
        },
    },
    methods: {
        //员工列表
        getStaffList(param) {
            return staffapi.getStaffList({
                query: [{
                    column: "type",
                    filterRange: this.searchQuery,
                    operat: "="
                }],
                sort: {},
                pageNo: param.pageNo,
                pageSize: param.pageSize,
            })
                .then(req => {
                    this.tableData = req.result.result
                    this.staffIds = [];
                    return req.result;
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        tableSearch() {
            this.$refs.staffTable.reload();
        },
        //新增员工
        addStaffSuc() {
            this.showAddStaff = false;
            this.$refs.staffTable.reload();
        },

        //一周后邀请过期 重发邀请
        reInvite(item) {
            staffapi.reSendInvite({ id: item.id })
                .then(req => {
                    if (req.success) {
                        this.$message.info('请求成功！');
                        this.$refs.staffTable.reload();
                    } else { this.$message.info(req.message); }
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); })
        },
        //设置岗位成功
        setJobsuccess() {
            let params = {
                id: this.editingStaff.id,
                roleid: this.editingStaff.roleid,
                sex: this.editingStaff.sex,
                voucherNo: this.editingStaff.voucherNo
            };
            staffapi.setStation(params)
                .then(req => {
                    if (req.success) {
                        this.$message.info('请求成功！');
                        this.showEditingStaff = false;
                        this.editingStaff = {};
                        this.$refs.staffTable.reload();
                        document.dispatchEvent(window.YBG_headInfoChangingTrigger);
                        this.$store.dispatch("reloadContext");
                    } else {
                        this.$message.info(req.message);
                    }
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); })
        },
        //取消设置
        cancelEditing() {
            this.showEditingStaff = false;
            this.editingStaff = {};
        },
        //编辑 设置岗位和账号状态
        editStaff(item, index) {
            this.editingStaff = item;
            this.editingStaff.index = index + 1;
            this.showEditingStaff = true;
            this.editingStaffBackUp = JSON.parse(JSON.stringify(this.editingStaff));
        },
        //删除员工
        delStaff(item) {
            this.accountStaff = item;
            this.delStaffShow = true;
        },
        //取消删除
        cancelDelStaff() {
            this.delStaffShow = false;
        },
        //确认删除
        ensureDelStaff() {
            staffapi.delStaff(this.accountStaff.id)
                .then(req => {
                    if (req.success) {
                        this.$message.info('删除成功！', 4);
                        this.delStaffShow = false;
                        this.$refs.staffTable.reload();
                    } else {
                        this.$message.info(req.message);
                    }
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        getSex(val) {
            if (val !== null && val !== '') {
                return val == 1 ? '男' : '女';
            } else {
                return ''
            }
        },
        getReinvitShow(time) {
            // let timeLen = Date.parse(new Date()) - time;
            // return  timeLen > 7*24*60*60*100 ? true :false;
        },
    },

}
</script>
<style scoped>
@import "/static/css/common.css";
.top-btns {
  padding: 20px;
}
.sch-ipt {
  width: 250px;
  float: right;
}
.edit-btns {
  color: #02a0e9;
  cursor: pointer;
}
</style>