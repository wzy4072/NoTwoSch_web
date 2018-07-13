<template>
    <div style="padding:30px 50px;" id="team-setting">
        <v-card title="部门管理">
            <div class="team-extra" slot="extra" v-show="true">
                <v-form>
                    <v-form-item>
                        <v-button type="primary" @click="showCreate">+新增部门</v-button>
                    </v-form-item>
                    <v-form-item>
                        <v-row>
                            <v-col span="16">
                                <v-input class="team-search-input" v-model="query" placeholder="搜索部门" @key.native.prevent.enter="reloadTeamData">
                                </v-input>
                            </v-col>
                            <v-col span="8">
                                <v-button class="team-search-btn"  icon="search" type="ghost" @click="reloadTeamData"></v-button>
                            </v-col>
                        </v-row>
                    </v-form-item>
                </v-form>
            </div>
            <!-- table -->
            <v-data-table :data='loadTeamData' :columns='columns' ref="teamTable" stripe pagination>
                <template slot="emptytext" scope="props">
                    <v-tag color="orange">没找到数据</v-tag>
                </template>
                <template slot="td" scope="props">
                    <div v-if="props.column.field=='name'">
                        <v-row align="middle" :gutter="2">
                            <v-col span="3">
                                <!--<img :src="props.item.avatar" width="48" height="48"></img>-->
                            </v-col>
                            <v-col span="17">
                                {{props.item.name}}
                            <br/> {{props.item.email}}
                        </v-col>
                        </v-row>
                    </div>
                    <div v-else-if="props.column.field=='operations'">
                        <span class="team-edit-section" @click="showDelete(props)">删除</span>
                        &nbsp;&nbsp; |&nbsp;&nbsp;
                        <span class="team-edit-section" @click="showEdit(props)">编辑</span>
                        &nbsp;&nbsp; |&nbsp;&nbsp;
                        <span class="team-edit-section" @click="showAddStaff(props)">成员</span>
                        
                    </div>
                    <span v-else v-html="props.content"></span>
                </template>
            </v-data-table>
            <br>
            <!--<v-button type="danger">删除部门</v-button>-->
        </v-card>
        
        <v-modal :visible="createModalShow" 
                 title="新建部门" 
                 @ok="createTeam" 
                 @cancel="createCancel">
            <v-form direction="vertical">
                <v-form-item label="部门名字" required>
                    <v-input v-model="teamName" placeholder="部门名称"></v-input>
                </v-form-item>
                <v-form-item label="部门描述">
                    <v-input v-model="teamDescription" placeholder="部门描述"></v-input>
                </v-form-item>
            </v-form>
        </v-modal>
        
        <v-modal :visible="editModalShow" 
                 title="编辑部门" 
                 @ok="editTeam" 
                 @cancel="editCancel">
            <v-form direction="vertical">
                <v-form-item label="部门名字" required>
                    <v-input v-model="editTeamName" placeholder="部门名称"></v-input>
                </v-form-item>
                <v-form-item label="部门描述">
                    <v-input v-model="editTeamDescription" placeholder="部门名称"></v-input>
                </v-form-item>
            </v-form>
        </v-modal>

        <v-modal title="请确定是否删除"
                 :visible="deleteModalShow"
                 @ok="submitDeleteTeam"
                 @cancel="deleteCancel">
            <p>真的要删除该部门吗？</p>
        </v-modal>
        
        <staff-select-modal :addStaffEntry="addStaffEntry"></staff-select-modal>
    </div>
</template>

<script>
    import api from '@/api/company/acount';
    import staffSelectModal from '@/components/dataEntry/staffSelectModal.vue'
    
    export default {
        components: {
            staffSelectModal: staffSelectModal
        },
        data() {
            return {
                query: null,
                createModalShow: false,
                teamName: null,
                teamDescription: "",
                
                editModalShow: false,
                editTeamName: null,
                editTeamDescription: "",
                editTeamID: null,

                deleteModalShow: false,
                deleteTeamID: "",
                
                
                // 传入staffSelectModal组件的项
                addStaffEntry: {
                    flag: "team",
                    isShow: false,
                    id: null,
                    name: null,
                    // 回调，调用增加员工到部门的api
                    callback: function(staffIds, teamId) {
                        api.addStaffToTeam(this.$store.getters.currentCorporate.id, staffIds, teamId)
                            .then(req => {
                                console.log(req);
                            })
                            .catch(err => {
                                this.$message.error(err);
                            })
                    }
                },
                
                columns: [
                    { title: "部门", field: 'name' },
                    { title: "操作", field: 'operations' },
                ],
            };
        },
        methods: {
            loadTeamData(pager) {
                var result = api.teams(this.$store.getters.currentCorporate.id, this.query, pager.pageNo, pager.pageSize, pager.sortColumns)
                    .then(req => req)
                    .catch(err => {
                        this.$message.error(err);
                    })
                return result;
            },
            reloadTeamData() {
                this.$refs.teamTable.reload();
            },
            
            showCreate() {
                this.createModalShow = true;
            },
            createTeam() {
                if(!this.teamName) {
                    this.$message.error("必须输入部门名");
                    return;
                }
                api.createTeam(this.$store.getters.currentCorporate.id, this.teamName, this.teamDescription).then(data => {
                    this.$message.info("已创建部门");
                    this.createModalShow = false;
                    this.teamName = null;
                    this.teamDescription = "";
                    this.reloadTeamData();
                }).catch(err => {
                    this.$message.error(err);
                    this.createModalShow = false;
                });
            },
            createCancel() {
                this.createModalShow = false;
                this.teamName = null;
                this.teamDescription = "";
            },

            showEdit(props) {
                this.editTeamName = props.item.name;
                this.editTeamID = props.item.id;
                this.editTeamDescription = props.item.description;
                this.editModalShow = true;
            },
            editTeam() {
                api.editTeam(this.$store.getters.currentCorporate.id, this.editTeamName, this.teamDescription, this.editTeamID).then(data => {
                    this.editModalShow = false;
                    this.teamName = null;
                    this.teamDescription = "";
                    this.reloadTeamData();
                }).catch(err => {
                    this.$message.error(err);
                    this.editModalShow = false;
                });
            },
            editCancel() {
                this.editModalShow = false;
            },

            showDelete(props){
                this.deleteModalShow = true;
                this.deleteTeamID = props.item.id
            },
            submitDeleteTeam() {
                api.deleteTeam(this.$store.getters.currentCorporate.id, this.deleteTeamID).then(request => {
                    this.$refs.teamTable.refresh();
                    this.deleteModalShow = false;
                }).catch(err => {
                    this.$message.error(err);
                });
            },
            deleteCancel(){
                this.deleteModalShow = false;
            },
            
            showAddStaff(props) {
                this.addStaffEntry.id = props.item.id;
                this.addStaffEntry.name = props.item.name;
                this.addStaffEntry.isShow = true;
            },
        },
        created() {
            
        }
    }
</script>
<style>
    #team-setting .team-edit-section {
        color: #00aee0;
        cursor: pointer;
    }
    #team-setting .team-extra{
        float: right;
        margin-top: -5px;
    }
    #team-setting .team-search-btn {
        border-left: 0;
        border: 1px solid rgb(217, 217, 217);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    #team-setting .team-search-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
</style>

