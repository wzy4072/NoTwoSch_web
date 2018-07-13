<template>
    <div style="padding:30px 50px;">
        <v-card :title="cardTitle">
            <v-form direction="vertical">
                <v-row>
                    <v-col span="6">
                        <v-form-item label="岗位名称">
                            <v-input type="text" placeholder="岗位名称" size="large" v-model="roleName"></v-input>
                        </v-form-item>
                    </v-col>
                    <v-col span="2"></v-col>
                    <v-col span="6">
                        <v-form-item label="职务描述">
                            <v-input type="text" placeholder="职务描述" size="large" v-model="roleDescript"></v-input>
                        </v-form-item>
                    </v-col>
                </v-row>
                <br>
                <!--<v-row>-->
                    <!--<powers-select :powersEntry="powersEntry"></powers-select>-->
                <!--</v-row>-->
                <!--<br>-->
                <v-row>
                    <v-col span="24">
                        <h3>平台权限管理</h3>
                        <br>
                        <v-card title="平台权限">
                            <v-row>
                                <v-checkbox :indeterminate="platformPowersConfig['indeterminate']" 
                                            v-model="platformPowersConfig['allChecked']" 
                                            @click="checkAllPlatform()"
                                            disabled>
                                    全选
                                </v-checkbox>
                            </v-row>
                            <v-row>
                                <v-checkbox-group :data="platformOptions" 
                                                  v-model="platformSelectedPowers" 
                                                  @change="setPlatformState()">
                                </v-checkbox-group>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
                <br>
                <v-row>
                    <v-col span="8">
                        <v-form-item>
                            <!--<v-button type="primary" @click="addRoleSubmit" >确定</v-button>-->
                            <v-button type="" @click="returnBack" >返回</v-button>
                        </v-form-item>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
        
    </div>
</template>

<script>
    import api from '@/api/company/acount';
//    import powersSelect from '@/components/dataEntry/powersSelectOld.vue'
    
    export default {
        components: {
//            powersSelect: powersSelect
        },
        props: {
            
        },
        data() {
            return {
                cardTitle: "",
                flag: "",
                
                roleName: "",
                roleDescript: "",
                roleID: "",
//                powersEntry: [],
                
                activeIndexMore:[],
                
                apps: [],
                platformPowers: [],
                
                // 已勾选的平台权限列表
                platformSelectedPowers: [],
                // 所有的平台权限列表
                allPlatformPowers: [],
                // 按多选框格式书写的平台权限列表
                // 此处有bug，不预制数据会导致选项暂时出不来，应用的就没有这个问题，待后解决
                platformOptions: [],
                // 平台权限全选与样式配置对象
                platformPowersConfig: {},

                
            }
        },
        computed: {
            
        },
        watch: {
            '$route': function () {
                this.roleName = this.$route.params.roleName;
            },
            platformSelectedPowers:function () {
                
            }
        },
        methods: {
            loadData(roleId) {
                // 如果用户在当前页面刷新，roleId为undefined，此时不应该请求
                if(!roleId) {
                    return
                }
                api.loadroleInfo(roleId)
                    .then(resp => {
                        var data = resp;
                        this.platformPowers = data.molus;
                        this.powersEntry = data.certificates || [];
                        // {moduleid: 1, moduleName: "基础设置", status: 0}
                        // 已勾选的平台权限列表
                        this.platformSelectedPowers = (function() {
                            var arr = [];
                            for (var i = 0; i < data.molus.length; i++) {
                                if(!!data.molus[i].status) {
                                    arr.push("" + data.molus[i].moduleid)
                                }
                            }
                            return arr;
                        })();
                        // 所有的平台权限列表
                        this.allPlatformPowers = (function() {
                            var arr = [];
                            for (var i = 0; i < data.molus.length; i++) {
                                arr.push("" + data.molus[i].moduleid)
                            }
                            return arr;
                        })();
                        // 按多选框格式书写的平台权限列表
                        this.platformOptions = (function() {
                            var arr = [];
                            for (var i = 0; i < data.molus.length; i++) {
                                var obj = {}
                                obj.label = data.molus[i].moduleName;
                                obj.value = "" + data.molus[i].moduleid;
                                obj.disabled = true;
                                arr.push(obj);
                            }
                            return arr;
                        })();
                        // 平台权限全选与样式配置对象
                        this.platformPowersConfig = (function() {
                            var obj = {};
                            var flag = true;
                            for (var i = 0; i < data.molus.length; i++) {
                                var status = data.molus[i].status;
                                if(!status) {
                                    flag = false;
                                }
                            }
                            if(flag) {
                                obj.allChecked = true;
                                obj.indeterminate = false;
                            }else {
                                obj.allChecked = false;
                                obj.indeterminate = false;
                            }
                            return obj
                        })();
                        
                    })
                    .catch(err => {
                        this.$message.error(err.data.message, 4);
                    });
            },
            /**
             * 返回折叠框的index
             * @NOTE vue要求panel的index返回String而不是Number
             * @param index
             * @returns {string}
             */
            panelIndex(index) {
                return index+1+""
            },
//            addRoleSubmit() {
//                // 平台权限选中的id数组
//                var activePlatformPowers = this.platformSelectedPowers.slice(0);
//                // 如果是编辑角色
//                if(this.flag === "edit") {
//                    api.editRole(this.roleName, this.roleID,this.roleDescript, activePlatformPowers)
//                        .then(resp => {
//                            if(resp.success === true) {
//                                this.$message.success(resp.message);
//                                this.$router.push('/account/role');
//                            }else {
//                                this.$message.error(resp.message);
//                            }
//                        })
//                        .catch(e => {this.$message.error(e, 4)});
//                }
//                // 如果是复制新增角色
//                if(this.flag === "create") {
//                    api.editRole(this.roleName, "", this.roleDescript, activePlatformPowers)
//                        .then(resp => {
//                            if(resp.success === true) {
//                                this.$message.success(resp.message);
//                                this.$router.push('/account/role');
//                            }else {
//                                this.$message.error(resp.message);
//                            }
//                        })
//                        .catch(e => {this.$message.error(e, 4)});
//                }
//                
//            },
            returnBack() {
                this.$router.push('/account/role');
            },
            

            checkAllPlatform() {
                if (this.platformSelectedPowers.length == this.allPlatformPowers.length) {
                    this.platformSelectedPowers = [];
                    this.platformPowersConfig['allChecked'] = false;
                    this.platformPowersConfig['indeterminate'] = false;
                } else {
                    this.platformSelectedPowers = JSON.parse(JSON.stringify(this.allPlatformPowers));
                    this.platformPowersConfig['allChecked'] = true;
                    this.platformPowersConfig['indeterminate'] = false;
                }
            },
            setPlatformState() {
                this.platformPowersConfig['indeterminate'] =  this.platformSelectedPowers.length > 0 && this.platformSelectedPowers.length < this.platformOptions.length;
                this.platformPowersConfig['allChecked'] = this.platformSelectedPowers.length == this.platformOptions.length;
            }
        },
        created() { 
            // 角色编辑页面的执行需要由角色页面传参，如果用户在当前页面刷新将导致问题，此时需要回到角色页面
            if(this.$route.params.id) {
                this.roleName = this.$route.params.roleName;
                this.roleDescript = this.$route.params.description;
                this.roleID = this.$route.params.id;
                this.flag = this.$route.params.flag;
                this.loadData(this.$route.params.id);
                if(this.$route.params.flag === "create") {
                    this.cardTitle = "复制并新建岗位";
                }
                if(this.$route.params.flag === "edit") {
                    this.cardTitle = "编辑岗位";
                }
            }else {
                this.$router.push('/account/role');
            }
            
        }
    }
    
</script>

<style>
    
</style>