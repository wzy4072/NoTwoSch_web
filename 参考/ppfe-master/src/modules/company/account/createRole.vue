<template>
    <div style="padding:30px 50px;">
        <v-card title="新增岗位">
            <v-form direction="vertical">
                <v-row>
                    <v-col span="6">
                        <v-form-item label="岗位名称" required>
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
                <v-row>
                    <v-col span="24">
                        <h3>平台权限管理</h3>
                        <br>
                        <v-card title="平台权限">
                            <v-row>
                                <v-checkbox :indeterminate="platformPowersConfig['indeterminate']" 
                                            v-model="platformPowersConfig['allChecked']" 
                                            @click="selectAllPlatform()">
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
                            <v-button type="primary" @click="addRoleSubmit" >确定</v-button>
                            <v-button type="" @click="returnRole" >返回</v-button>
                        </v-form-item>
                    </v-col>
                </v-row>
                <br>
            </v-form>
        </v-card>
    </div>
</template>

<script>
    import api from '@/api/company/acount';
    import powersSelect from '@/components/dataEntry/powersSelect.vue';
    
    export default {
        components: {
            powersSelect: powersSelect
        },
        props: {
            
        },
        data() {

            return {
                roleName: "",
                roleDescript: "",
                activeIndexMore:[],
                
                powers: [],
                
                // 已勾选的平台权限列表
                platformSelectedPowers: ["1"],
                // 所有的平台权限列表
                allPlatformPowers: ["1", "2", "3"],
                // 按多选框格式书写的平台权限列表
                // 此处有bug，不预制数据会导致选项暂时出不来，应用的就没有这个问题，待后解决
                platformOptions: [{label:"", value:"1"},{label:"", value:"2"}, {label:"", value:"3"},{label:"", value:"4"},{label:"", value:"5"},{label:"", value:"6"},{label:"", value:"7"}],
                // 平台权限全选与样式配置对象
                platformPowersConfig: {},
                
            }
        },
        computed: {
            
        },
        created() {
            this.loadData()
        },
        watch: {

        },
        methods: {
            loadData() {
                api.loadroleInfo(0)
                    .then(resp => {
                        var data = resp;
                        this.platformPowers = data.molus;
                        
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
                        this.$message.error(err, 4);
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
            addRoleSubmit() {
                // 平台权限选中的id数组
                var activePlatformPowers = this.platformSelectedPowers.slice(0);
                api.editRole(this.roleName, "", this.roleDescript, activePlatformPowers)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$router.push('/account/role');
                        }else {
                            this.$message.error(resp.message);
                        }
                    })
                    .catch(err => {this.$message.error(err, 4)});
            },
            returnRole() {
                this.$router.push('/account/role');
            },

            selectAllPlatform() {
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
        }
    }
</script>

<style>
    
</style>