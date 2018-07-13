<template>
    <div>
        <div v-if="show">
            <v-row>
                <h3>产品模块选择</h3>
            </v-row>
            <v-row v-for="(app, appIndex) in modulesEntry" :key="appIndex" style="margin-bottom: 10px;">
                <v-col span="24">
                    {{app.appName}}：&nbsp;&nbsp;&nbsp;
                <v-checkbox 
                    v-if="appOptions[app.appid].length > 0" 
                    :indeterminate="appOperationsConfig[app.appid]['indeterminate']" 
                    v-model="appOperationsConfig[app.appid]['allChecked']" 
                    @click="selectAll(app.appid)">
                    全选
                </v-checkbox>
                </v-col>
                <v-col span="24">
                    <v-checkbox-group 
                        :data="appOptions[app.appid]" 
                        v-model="appSelectedOperations[app.appid]" 
                        @change="changeState(app.appid)">
                    </v-checkbox-group>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
    

    export default {
        /**
         * modulesEntry的值
         *      [
         *          appName: "",
         *          appid: "",
         *          modules: [
         *              moduleName: "",
         *              status: 0
         *          ]
         *      ]
         */
        props:['modulesEntry'],
        data() {
            return {
                show: false,
                appSelectedOperations: {},
                allOperations: {},
                appOptions: {},
                appOperationsConfig: {},
                
            }
        },
        computed: {
            
        },
        created() {
            
        },
        mounted() {
            this.getData();
        },
        methods: {
            /**
             * 从传入项获取appSelectedOperations、allOperations等四项数据
             */
            getData() {
                var powers = this.modulesEntry;
                // 已勾选的应用权限列表
//            {appid: [模块id]}
                this.appSelectedOperations = (function() {
                        if(!powers.length) {
                            return {}
                        }
                        var obj = {};
                        for (var i = 0; i < powers.length; i++) {
                            var arr = [];
                            for (var j = 0; j < powers[i].modules.length; j++) {
                                var id = "" + powers[i].modules[j].moduleid;
                                var status = powers[i].modules[j].status;
                                if(!!status) {
                                    arr.push(id);
                                }
                            }
                            obj[powers[i].appid] = arr;
                        }
                        return obj;
                })();
                // 所有的应用权限列表
//            {appid: [模块id]}
                this.allOperations = (function() {
                    if(!powers.length) {
                        return {}
                    }
                    var obj = {};
                    for (var i = 0; i < powers.length; i++) {
                        var arr = [];
                        for (var j = 0; j < powers[i].modules.length; j++) {
                            var id = "" + powers[i].modules[j].moduleid;
                            arr.push(id);
                        }
                        obj[powers[i].appid] = arr;
                    }
                    return obj;
                })();
                // 按多选框格式书写的应用权限列表
//            {appid:[
//                {label: 模块名, value: 模块id},
//            ]}
                this.appOptions = (function() {
                    if(!powers.length) {
                        return {}
                    }
                    var obj = {};
                    for (var i = 0; i < powers.length; i++) {
                        var arr = [];
                        for (var j = 0; j < powers[i].modules.length; j++) {
                            var id = "" + powers[i].modules[j].moduleid;
                            var name = "" + powers[i].modules[j].modulename;
                            arr.push({
                                label: name,
                                value: id
                            });
                        }
                        obj[powers[i].appid] = arr;
                    }
                    return obj;
                })();
                // 应用权限全选与样式配置对象
//            {appid:{
//                allChecked: 值全选 true为全选
//                indeterminate: 样式全选 ture为非全选
//            }}
                this.appOperationsConfig = (function() {
                    if(!powers.length) {
                        return {}
                    }

                    var obj = {};
                    for (var i = 0; i < powers.length; i++) {
                        var appObj = {};
                        var flag = true;
                        for (var j = 0; j < powers[i].modules.length; j++) {
                            var status = powers[i].modules[j].status;
                            if(!status) {
                                flag = false;
                            }
                        }
                        if(flag) {
                            appObj.allChecked = true;
                            appObj.indeterminate = false;
                        }else {
                            appObj.allChecked = false;
                            appObj.indeterminate = false;
                        }
                        obj[powers[i].appid] = appObj
                    }
                    return obj
                })();
                this.show = true;
            },
            selectAll(appid) {
                if (this.appSelectedOperations[appid].length == this.allOperations[appid].length) {
                    this.appSelectedOperations[appid] = [];
                    this.appOperationsConfig[appid]['allChecked'] = false;
                    this.appOperationsConfig[appid]['indeterminate'] = false;
                } else {
                    this.appSelectedOperations[appid] = JSON.parse(JSON.stringify(this.allOperations[appid]));
                    this.appOperationsConfig[appid]['allChecked'] = true;
                    this.appOperationsConfig[appid]['indeterminate'] = false;
                }
//                console.log(this.appSelectedOperations);
            },
            changeState(appid) {
                console.log(appid);
                this.appOperationsConfig[appid]['indeterminate'] =  this.appSelectedOperations[appid].length > 0 && this.appSelectedOperations[appid].length < this.appOptions[appid].length;
                this.appOperationsConfig[appid]['allChecked'] = this.appSelectedOperations[appid].length == this.appOptions[appid].length;

                var powers = [];
                for(var key in this.appSelectedOperations) {
                    for (var i = 0; i < this.appSelectedOperations[key].length; i++) {
                        powers.push(this.appSelectedOperations[key][i])
                    }
                }
                this.$emit('powers', powers);
            },
        },
        watch: {
            modulesEntry: {
                handler: function (val, oldVal) {
                    this.getData();
                },
                deep: true
            }
        }
    }
</script>

<style>

</style>