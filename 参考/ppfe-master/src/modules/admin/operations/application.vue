<template>
        <div style="padding:30px 50px;">
            <v-spin :spinning="spinning" tip="正在读取数据">
                <v-card title="应用操作">
                    <div slot="extra" v-show="true">
                        <v-button type="primary" @click="addApp">注册</v-button>
                    </div>
                    <v-row>
                        <searchers :searchOptions="searchOptions"
                                   v-on:searchOutput="SearchApps"
                        ></searchers>
                    </v-row>
                    <br>
                    <v-row>
                        <v-col>
                            <v-data-table ref="appTable" :data='appList' :columns='columns' :page-num="pageNo" :page-size="pageSize" :current-data.sync='currentData'>
                                <template slot="th" slot-scope="props">
                                    <strong v-if="props.column.field=='operate'">操作</strong>
                                    <strong v-else v-html="props.title"></strong>
                                </template>
                                <template slot="td" slot-scope="props">
                                    <div v-if="props.column.field=='operate'">
                                        <v-button type="ghost" icon="edit" @click="editInfo(props)"><span>编辑</span></v-button>
                                    </div>
                                    <span v-if="props.column.field=='createdAt'" v-text="timestampToDate(props.content)"></span>
                                    <span v-else v-html="props.content"></span>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-spin>

            <v-modal title="新增应用"
                     okText="确定结果"
                     :visible="addModalShow"
                     @ok="addAppOk"
                     @cancel="addAppCancel">
                <v-row style="height: 220px;">
                    <div>
                        <p style="text-align:center;">图标用于头部导航栏，有固定格式(背景透明，白色，固定宽高)</p>
                        <p style="text-align:center;">请联系美工，或者暂不上传使用默认图标</p>
                        <avatar :id="appAvatar.avatar" :name="appAvatar.name ||'IMG'" :size="50"></avatar>
                        <v-upload name="file" :action="avatarURL" :data="appAvatar.data" drag @change="onChange">
                            <p class="ant-upload-drag-icon">
                                <!--<button class="_btn" style="margin-top:110px">换 头 像</button>-->
                            </p>
                        </v-upload>

                    </div>
                </v-row>
                <v-row>
                    <v-form direction="horizontal">
                        <v-form-item label="应用类型" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                            <v-select placeholder="请选择应用类型" style="width: 120px;"  :data="typeOptions" v-model="newAppData.type"></v-select>
                        </v-form-item>
                        <v-form-item label="应用名称" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                            <v-input type="text" v-model="newAppData.appname" placeholder="请输入应用名称"></v-input>
                        </v-form-item>
                        <v-form-item label="应用网站" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                            <v-input type="text" v-model="newAppData.websiteLink" placeholder="请输入应用网站"></v-input>
                        </v-form-item>
                        <v-form-item label="回调地址" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                            <v-input type="text" v-model="newAppData.callbackLink" placeholder="请输入回调地址"></v-input>
                        </v-form-item>
                        <v-form-item label="登出地址" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                            <v-input type="text" v-model="newAppData.exitLink" placeholder="请输入登出地址"></v-input>
                        </v-form-item>
                        <v-form-item label="数据获取地址" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                            <v-input type="text" v-model="newAppData.dataLink" placeholder="请输入登出地址"></v-input>
                        </v-form-item>
                    </v-form>
                </v-row>
            </v-modal>

            <v-modal title="编辑应用"
                     okText="确定结果"
                     :visible="editModalShow"
                     @ok="editAppOK"
                     @cancel="editAppCancel">
                <v-row style="height: 220px;">
                    <div>
                        <p style="text-align:center;">图标用于头部导航栏，有固定格式(背景透明，白色，固定宽高)</p>
                        <p style="text-align:center;">请联系美工，或者暂不上传使用默认图标</p>
                        <avatar :id="appAvatar.avatar" :name="appAvatar.name ||'IMG'" :size="50"></avatar>
                        <v-upload name="file" :action="avatarURL" :data="appAvatar.data" drag @change="onChange">
                            <p class="ant-upload-drag-icon">
                                <!--<button class="_btn" style="margin-top:110px">换 头 像</button>-->
                            </p>
                        </v-upload>

                    </div>
                </v-row>
                <v-form direction="horizontal">
                    <v-row>
                        <v-col v-for="(value, key) in appDataInfo" :key="editAppItemKey">

                            <v-form-item v-if="key==='appname'" label="应用名称" :label-col="labelCol" :wrapper-col="wrapperCol" required>
                                <v-input type="text" v-model="appDataInfo.appname" placeholder="请输入应用名称"></v-input>
                            </v-form-item>
                            <v-form-item v-else-if="key==='websiteLink'" label="应用网站" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                                <v-input type="text" v-model="appDataInfo.websiteLink" placeholder="请输入应用网站"></v-input>
                            </v-form-item>
                            <v-form-item v-else-if="key==='callbackLink'" label="回调地址" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                                <v-input type="text" v-model="appDataInfo.callbackLink" placeholder="请输入回调地址"></v-input>
                            </v-form-item>
                            <v-form-item v-else-if="key==='exitLink'" label="登出地址" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                                <v-input type="text" v-model="appDataInfo.exitLink" placeholder="请输入登出地址"></v-input>
                            </v-form-item>
                            <v-form-item v-else-if="key==='dataLink'" label="数据获取地址" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                                <v-input type="text" v-model="appDataInfo.dataLink" placeholder="请输入登出地址"></v-input>
                            </v-form-item>
                            <v-form-item v-else-if="key==='createdAt'" label="创建时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                                <span class="ant-form-text">{{ timestampToDate(value) }}</span>
                            </v-form-item>
                            <v-form-item v-else-if="key==='type'" label="类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                                <span class="ant-form-text">{{ appTypeMap(value) }}</span>
                            </v-form-item>

                            <v-form-item v-else :label="key" :label-col="labelCol" :wrapper-col="wrapperCol">
                                <span class="ant-form-text">{{ value }}</span>
                            </v-form-item>
                        </v-col>
                    </v-row>
                </v-form>
            </v-modal>
        </div>
</template>
<script>
    import api from '@/api/admin/application.js';
    import timestampApi from '@/api/tool.js';
    import endpoint from '@/api/endpoint.js';

    import avatar from '@/components/dataEntry/adminAppIcon.vue';
    import searchers from '@/components/dataEntry/adminHeadSearchers.vue';
    
    export default{
        components: {
            avatar: avatar,
            searchers: searchers,
        },
        data(){
            return {
                // 应用详情col宽度控制
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },

                // 传入搜索器的配置项
                searchOptions: {
                    show: false,
                    caller: "application",
                    searchers: [
                        {
                            type: "input",
                            placeHolder: "应用名称",
                            name: "nameSelected"
                        },
                        {
                            type: "select",
                            labels: [],
                            name: "typeSelected"
                        }
                    ]
                },
                // 搜索器的输出项
                searchOutput: {
                    nameSelected: "",
                    typeSelected: "",
                },
                
                // 应用图标相关
                appAvatar: {
                    avatar: null,
                    name: "test",
                    data: {
                        sid: ""
                    }
                },
                // 应用类型选择框options
                typeOptions: [],
                // 应用类型对应表
                typeMap: {},
                
                spinning: false,
                currentData: [],
                pageNo: 1,
                pageSize: 10,
                columns:[
//                    {title:"应用id",field:'appid'},
                    {title:"应用名称",field:'appname'},
                    {title:"应用id",field:'appid'},
                    {title:"创建日期",field:'createdAt'},
                    {title:"操作",field:'operate'},
                ],
                
                
                editModalShow: false,
                appDataInfo: {},

                addModalShow: false,
                newAppData: {
                    type: "",
                    appname: "",
                    websiteLink: "",
                    callbackLink: "",
                    exitLink: "",
                    dataLink: "",
                    activeid: ""
                }
            }
        },
        created(){
            // 获取
            api.getAppType()
                .then(resp => {
                    if(resp.success === true) {
                        var obj = resp.result;
                        var arr = []
                        for (var key in obj) {
                            var temp = {
                                value: key,
                                label: obj[key]
                            }
                            arr.push(temp)
                        }
                        
                        this.typeMap = obj;
                        this.typeOptions = arr;
                        this.searchOptions.searchers[1].labels = arr;
                        this.searchOptions.show = true;
                    }else {
                        this.$message.success(resp.error);
                    }
                })
                .catch(e => {this.$message.error(e)})
        },
        computed: {
            // 编辑应用时v-for为每一项绑定的key
            editAppItemKey() {
                var key = 1;
                return key++
            },
            // 在app编辑弹出框中的信息中英文映射表
            appInfoTitelMap(title) {
                var map = {
                    id: "数据库id",
                    appid: "应用id",
                    appsecret: ""
                }
            },
            // 应用图标action
            avatarURL() {
                return endpoint.url + "/admin/resource"
            },
            
        },
        watch: {
           
        },
        methods:{
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            appTypeMap(type) {
                return this.typeMap[type];
            },
            
            appList(prams) {
                var name = this.searchOutput.nameSelected || null;
                var type = this.searchOutput.typeSelected || null;
                
                var query = [];
                if(name) {
                    query.push({
                        "column": "appname",
                        "filterRange": name,
                        "operat": "like"
                    })
                };
                if(type) {
                    query.push({
                        "column": "type",
                        "filterRange": type,
                        "operat": "="
                    })
                };
                
                var result = api.getAppList({
                    "query": query,
                    "pageNo": prams.pageNo,
                    "pageSize": prams.pageSize,
                })
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            obj.result = obj.list;
                            return obj;
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                return result;
                
            },
            
            SearchApps(searchOutput) {
                this.searchOutput = searchOutput;
                this.$refs.appTable.reload();
            },
            
            editInfo(props) {
                var id = props.item.id;
                api.getAppInfo(id)
                    .then(resp => {
                        if(resp.success === true) {
                            this.appDataInfo = resp.result;
                            this.appAvatar.avatar = this.appDataInfo.activeid;
                            this.editModalShow = true;
                        }else {
                            this.$message.success(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})

                // temp code
//                this.appDataInfo = {
//                    id:1, 
//                    appname:"testName", 
//                    websiteLink:"www.websiteLink.com", 
//                    callbackLink:"www.callbackLink.com",
//                    exitLink:"www.exitLink.com",
//                    dataLink:"www.dataLink.com",
//                    createdAt:1505318400000,
//                    appid: "312sra-12asd-123xzc",
//                    appsecret: "iij123-jh1231-nb13212"
//                }
//                this.editModalShow = true;
            },
            editAppOK() {
                var options = {
                    id: this.appDataInfo.id,
                    appname: this.appDataInfo.appname,
                    websiteLink: this.appDataInfo.websiteLink,
                    callbackLink: this.appDataInfo.callbackLink,
                    exitLink: this.appDataInfo.exitLink,
                    dataLink: this.appDataInfo.dataLink,
                    activeid: this.appDataInfo.activeid,
                    type: this.appDataInfo.type
                }
                api.editApp(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$refs.appTable.reload();
                            this.editModalShow = false;
                            this.appDataInfo = {};
                            this.appAvatar.avatar = "";
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
            },
            editAppCancel() {
                this.editModalShow = false;
                this.appDataInfo = {};
                this.appAvatar.avatar = "";
            },
            
            addApp() {
                this.addModalShow = true;
            },
            addAppOk() {
                var options = {
                    id: null,
                    appname: this.newAppData.appname,
                    websiteLink: this.newAppData.websiteLink,
                    callbackLink: this.newAppData.callbackLink,
                    exitLink: this.newAppData.exitLink,
                    dataLink: this.newAppData.dataLink,
                    activeid: this.newAppData.activeid,
                    type: this.newAppData.type
                }
                api.editApp(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$refs.appTable.reload();
                            this.addModalShow = false;
                            this.newAppData = {
                                appname: "",
                                websiteLink: "",
                                callbackLink: "",
                                exitLink: "",
                                dataLink: ""
                            }
                            this.appAvatar.avatar = "";
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                
            },
            addAppCancel() {
                this.addModalShow = false;
                this.newAppData = {
                    appname: "",
                    websiteLink: "",
                    callbackLink: "",
                    exitLink: "",
                    dataLink: ""
                }
                this.appAvatar.avatar = "";
            },
            
            onChange(info) {
                console.log(info);
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (info.file.status === 'done') { 
                    console.log(info.file.name + ' 上传成功.')
                    console.log("Resource ID: " + info.file.response.id);
                    if(this.addModalShow === true) {
                        this.newAppData.activeid = info.file.response.id;
                        this.appAvatar.avatar = this.newAppData.activeid;
                    }
                    if(this.editModalShow === true) {
                        this.appDataInfo.activeid = info.file.response.id;
                        this.appAvatar.avatar = this.appDataInfo.activeid;
                    }
                    
                } else if (info.file.status === 'error') {
                    console.log(info.file.name + ' 上传失败.')
                }
            }
        }
    }
</script>
<style>
    .companyInfos li {
        font-size: 16px;
    }
</style>