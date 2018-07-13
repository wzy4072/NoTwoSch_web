<template>
    <div style="padding:30px 50px;" id="role-setting">
        <v-spin :spinning="spinning">

            <v-card title="岗位管理">
                <!-- 管理员 头部表格 -->
                <div class="my-tab admin-tab">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>手机</th>
                                <th>邮箱</th>
                                <th>岗位</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{adminInfo.realName}}</td>
                                <td>{{adminInfo.phone}}</td>
                                <td>{{adminInfo.email}}</td>
                                <td>{{adminInfo.role}}</td>
                                <td class="btns">
                                    <span @click="transferAdmin(adminInfo.roleId)">转让</span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" class="left-td">
                                    <span>*</span>创建公司第一人默认为管理员，若要更换资格请转让管理员</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!--岗位说明表格 -->
                <div class="my-tab role-tab">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <th>岗位</th>
                                <th>人数</th>
                                <th>操作</th>
                                <th>权限</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in roleInfoList" :key="index">
                                <td>{{item.roleName}}</td>
                                <td>{{item.staffTotal}}</td>
                                <td v-if="item.roleId ==adminInfo.roleId" class="btns">
                                    <span @click="getRoleStaffs(item)">查看员工</span>
                                </td>
                                <td v-if="item.roleId !=adminInfo.roleId" class="btns">
                                    <span @click="getRoleStaffs(item)">查看员工</span> |
                                    <span @click="transferRole(item)">添加员工</span>
                                </td>
                                <td class="left-td">{{item.roleIntroduce}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 角色下的员工列表 -->
                <rolestaffs-modal :roleListId="roleListId" :showflag="roleStaffList" @cancel="roleListId = null; roleStaffList = false" @ok="roleListId = null; roleStaffList = false">
                </rolestaffs-modal>

                <!-- 选择员工 -->
                <staffselect-modal :show="staffListShow" v-model="staffModalInfo" @ok="submitStaffs" @cancel="cancelSub">
                </staffselect-modal>
            </v-card>
        </v-spin>
    </div>
</template>

<script>
import roleStaffListModal from '@/components/feedback/roleStaffListModal.vue'
import staffSelectModal from '@/components/dataEntry/staffSelectModal.vue'
import tool from '@/api/tool';
import staffapi from '@/api/company/staff';
export default {
    components: {
        'rolestaffsModal': roleStaffListModal,
        'staffselectModal': staffSelectModal
    },
    data() {
        return {
            adminInfo: {
                //  roleId: '001', realName: '张老师', phone: '18565363366', email: 'zhangTeacher@gmail.com', role: '超级管理员' 
            },
            roleInfoList: [
                // { roleId: -1, roleName: '管理员', staffTotal: 1, roleIntroduce: '创建公司第一人默认为管理员，有添加员工、修改公司信息、创建员工岗位等权限' },
                // { roleId: 2, roleName: '总经理', staffTotal: 2, roleIntroduce: '查询业务单量，查看报表、监督工作效率等' },
                // { roleId: 3, roleName: '报关员', staffTotal: 30, roleIntroduce: '操作报关应用及查看自己的报表' },
                // { roleId: 4, roleName: '报关员', staffTotal: 30, roleIntroduce: '操作报关应用及查看自己的报表' },
            ],
            roleStaffList: false,
            roleListId: null,
            accountRoleId: null,
            staffListInfo: { roleid: null, isadmin: null },
            // roleListInfo:{roleId:null},
            spinning: true,


            staffListShow: false,
            staffModalInfo: {
                cardtitle: '选择员工',
                leftList: [],
                rightList: [],
                isadmin: false
            },
            currentRoleId:null,
        }
    },
   computed: {
        loginContext() {
            return this.$store.getters.loginContext == null ? { currentCorporate: '', person: '' } : this.$store.getters.loginContext;
        }
    },
    created() {
        this.getRoleCountInfo();
    },
    mounted() {

    },
    methods: {
        //岗位列表（概况）
        getRoleCountInfo() {
            staffapi.getRoleCountInfo()
                .then(req => {
                    if (req.success) {
                        this.adminInfo = req.result.adminInfo;
                        this.roleInfoList = req.result.roleInfo;
                    } else {
                        this.$message.info(req.message);
                    }
                    this.spinning = false;
                })
                .catch(err => { this.$message.error(err.message); });
            // this.spinning = false;
        },
        //查看员工
        getRoleStaffs(item) {
            this.roleStaffList = true;
            this.roleListId = item.roleId;
        },
        //管理员转让
        transferAdmin(id) {
            if(!this.getAdminRoles()){
                this.$message.info('当前账户不是管理员，您不能进行该操作' );
                return false;
                //后台尚未限制！！
            }
            this.staffModalInfo.isadmin = true;
            this.currentRoleId = id;
            this.getRoleStaffList(id);
        },
        //普通岗位 拉取职工
        transferRole(item) {
            this.staffModalInfo.isadmin = false;
            this.currentRoleId = item.roleId;
            this.getRoleStaffList(item.roleId);
        },
        //获取角色下的员工列表
        getRoleStaffList(id) {
            staffapi.getRoleStaffList(id)
                .then(req => {
                    if (req.success) {
                        this.staffModalInfo.leftList = req.result.otherRoleStaff;
                        this.staffModalInfo.rightList = req.result.roleStaff;
                        this.staffListShow = true;
                    } else {
                        this.$message.info(req.message);
                    }
                    this.spinning = false;
                })
                .catch(err => { this.$message.error(err.message); });
        },
        //确认提交
        submitStaffs() {
            let selectIds = tool.getArrItemValues(this.staffModalInfo.rightList, 'id');
            var process;
            if(this.staffModalInfo.isadmin) {
                process = staffapi.changeCompanyOwner;
            }else {
                process = staffapi.setRoleStaff;
            }
            process( { roleId: this.currentRoleId, staffIds: selectIds })
                .then(req => {
                    if (req.success) {
                        this.$message.info(req.message );
                        this.staffListShow = false;
                        if(this.staffModalInfo.isadmin){
                            this.$store.dispatch('reloadContext')
                            this.$router.push('/home');
                        }
                        this.getRoleCountInfo();
                    } else {
                        this.$message.info(req.message );
                    }
                })
                .catch(err => { throw err; });
        },
        //取消提交
        cancelSub() {
            this.staffListShow = false;
        },
        //上下文获取当前账号是否是管理员
        getAdminRoles(){
            let rolArr = this.loginContext.currStaff.roles;
            let realAdmin = false;
            if(rolArr){
                for(let i=0;i<rolArr.length;i++){
                    if(rolArr[i].rolecode==2){
                        realAdmin =  true;
                    } 
                }
                return realAdmin;
            }else{
                return false;
            }
        },
    },

}
</script>

<style scoped>
/* 表格样式 */
.my-tab {
  margin: 12px;
}
.my-tab table {
  width: 100%;
  border: 1px solid #e5e6e8;
  border-collapse: collapse;
  font-size: 14px;
}
.my-tab table thead {
  background-color: #fbf7f6;
}
.my-tab table thead tr th {
  text-align: center;
  padding: 12px;
  width: 100px;
}
.my-tab table tbody tr {
  height: 50px;
  border-top: 1px solid #f5f6f8;
}
.my-tab table tbody tr td {
  background-color: #fff;
  text-align: center;
}
.my-tab table tbody tr td.btns {
  color: #07a0e6;
  cursor: pointer;
}

.my-tab table tbody tr td.marktd > span {
  color: #f00;
}

.my-tab table tbody tr td.btns {
  color: #07a0e6;
  cursor: pointer;
}
.my-tab table tbody tr td.left-td {
  text-align: left;
  padding-left: 30px;
}
</style>
