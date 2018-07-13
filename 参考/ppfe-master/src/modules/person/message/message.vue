<template>
    <div style="padding:30px;">
        <v-card title="消息中心">
            <v-tabs active-tab-key="1">
                <v-button @click="haveReadMessage"  slot="extra" icon="eye-o" style="margin-right: 5px;">标为已读</v-button>
                <v-button @click="deleteMessage" slot="extra" icon="delete" style="margin-right: 5px;">删除</v-button>
                <v-tab-pane tab-key="1" tab="提示消息">
                    <v-data-table check-type="checkbox" :data='loadPromptMessage' :columns='promptMessageColumns' ref="promptMessageTable" size="small"  stripe>
                        <template slot="td" scope="props">
                            
                            <span v-if="props.column.field=='createdAt'" v-text="timestampToDate(props.content)"></span>
                            <span v-else v-html="props.content"></span>
                        </template>
                    </v-data-table>
                </v-tab-pane>
                <v-tab-pane tab-key="2" tab="操作消息">
                    <v-data-table check-type="checkbox" :data='loadOperationMessage' :columns='operationMessageColumns' ref="operationMessageTable" size="small" stripe pagination>
                        <template slot="td" scope="props">

                            <span v-if="props.column.field=='createdAt'" v-text="timestampToDate(props.content)"></span>
                            <div v-else-if="props.column.field=='operationDetail'" >
                                <v-button v-for="(item, index) in props.content" :key="index" @click="operationBtnCallback(item)"  style="margin-right: 5px;">{{ item.linktxt}}</v-button>
                            </div>
                            <span v-else v-html="props.content"></span>
                        </template>
                    </v-data-table>
                </v-tab-pane>
                <v-tab-pane tab-key="3" tab="公告消息">
                    <!--<v-data-table check-type="checkbox" :data='loadBulletinMessage' :columns='bulletinMessageColumns' ref="bulletinMessageTable" size="small" stripe pagination>-->

                    <!--</v-data-table>-->
                </v-tab-pane>
            </v-tabs>
        </v-card>

    </div>
</template>

<script>
    import endpoint from '@/api/endpoint.js'
    import api from '@/api/person/message.js';
    import timestampApi from '@/api/tool.js';
    
    export default {
        data() {
            return {
                // 当处于操作消息页，应该除去所有已读状态
                isOperationMessageTab: false,
                // 需求中只有公告消息需要显示已读按钮，所以需要判断是不是公告消息tab
                isBulletinMessageTab: false,
                // 被选中的消息
                selectedMessages: [],
                promptMessageColumns: [
                    { title: "信息内容", field: 'content' },
                    { title: "时间", field: 'createdAt' },
                ],
                operationMessageColumns: [
                    { title: "信息内容", field: 'content' },
                    { title: "时间", field: 'createdAt' },
                    { title: "操作", field: 'operationDetail' },
                ],
                bulletinMessageColumns: [
                    { title: "信息内容", field: 'content' },
                    { title: "时间", field: 'createdAt' },
                ]
            };
        },
        computed: {

        },
        methods: {
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            
            loadPromptMessage() {
                var result = api.getPromptMessage()
                    .then(req=>{
                        // vue-beauty的数据表只能接受固定格式的数据，这里按照要求的格式处理了一下
                        var temp = {};
                        temp.result = req;
                        return temp;
                    })
                    .catch(err => {
                        this.$message.error(err);
                    })
                return result;
            },
            loadOperationMessage() {
                var result = api.getOperationMessage()
                    .then(req=>{
                        // vue-beauty的数据表只能接受固定格式的数据，这里按照要求的格式处理了一下
                        var temp = {};
                        temp.result = req;
                        return temp;
                    })
                    .catch(err => {
                        this.$message.error(err);
                    })
                return result;
            },
            loadBulletinMessage() {

            },
            reloadAllTable() {
                this.$refs.promptMessageTable.reload();
                this.$refs.operationMessageTable.reload();
//                this.$refs.promptMessageTable.reload();
            },
            /**
             * 操作消息中按钮的回调
             * 
             * @NOTE 按钮是动态的，通过动态改变ajax的url来让后台知晓点击了那一个
             * @param item
             */
            operationBtnCallback(item) {
                console.log(item);
                endpoint.current_http().get(item.linkurl)
                    .then(resp => {
                        this.$message.info(resp.data.message);
                    })
                    .catch(error => {
                        if (error.response) {
                            this.$message.error(error.response);
                        } else {
                            this.$message.error(error);
                        }
                    });
            },
            deleteMessage() {
                var ids = [];
                var msgs = this.$refs.promptMessageTable.getCheckedData();
                msgs = msgs.concat(this.$refs.operationMessageTable.getCheckedData());
                for (var i = 0; i < msgs.length; i++) {
                    ids[i] = msgs[i].id;
                }
                api.setMessageDeleted(ids)
                    .then(resp => {
                        this.$message.info(resp.message);
                        this.reloadAllTable();
                    })
                    .catch(err => {
                        this.$message.error(err);
                        this.reloadAllTable();
                    });
            },
            haveReadMessage() {
                var ids = [];
                var msgs = this.$refs.promptMessageTable.getCheckedData();
                msgs = msgs.concat(this.$refs.operationMessageTable.getCheckedData());
                for (var i = 0; i < msgs.length; i++) {
                    ids[i] = msgs[i].id;
                }
                api.setMessageRead(ids)
                    .then(resp => {
                        console.log(resp);
                        this.$message.info(resp.message);
                        this.reloadAllTable();
                    })
                    .catch(err => {
                        this.$message.error(err);
                        this.reloadAllTable();
                    });
            },
        },
        mounted() {
            `
            
            `
        },
        created() {
//            api.getOperationMessage()
        }
    }
</script>

<style>

</style>