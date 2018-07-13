<template>
    <div style="padding:30px;">
        <v-card title="消息中心" v-show="getTypesSuc">
            <v-row>
                <v-col span="20">
                    <!-- <v-badge v-for="(item,index) in typeList" :key="index" :dot="item.unread != 0" class="btns">
                        <v-button @click="checkMsgType(item,index)" :type="item.typeName=='公告' ? 'ghost' : 'primary'" size="large">{{item.typeName}}</v-button>
                        <div v-show="item.typeName == accountTypeName" class="panel-warp"><div class="panel"></div></div>
                    </v-badge> -->
                    <div v-for="(item,index) in typeList" :key="index" class="btns">
                        <v-badge :dot="item.unread != 0">
                            <!-- :class="item.unread != 0 ? 'red-point' :''"  -->
                            <v-button @click="checkMsgType(item,index)" :type="item.typeName=='公告' ? 'ghost' : 'primary'" size="large">{{item.typeName}}</v-button>
                        </v-badge>
                    </div>
                </v-col>
                <v-col span="4">
                    <v-button type="ghost" size="large" @click="markReaded">
                        <v-icon type="eye-o"></v-icon>标为已读</v-button>
                    <v-button type="ghost" size="large" @click="delMessages">
                        <v-icon type="delete"></v-icon>删除</v-button>
                </v-col>
            </v-row>
            <v-row class='table-row'>
                <!-- <v-spin :spinning="spinning"> -->
                <v-data-table :data='loadData' 
                :columns='columns' 
                checkType="checkbox" @checkall="checkAll" @clickrow="checkRow" :rowClickChecked="false" ref="messageTable">
                <!-- :pagination="true" :pageSize="100"  -->
                    <template slot="td" slot-scope="props">
                        <div v-if="props.column.field=='content'" :class="{'conten-warp':true,'unread':!props.item.hadRead}"  @dblclick="showMessageDetial(props.item)">
                            <div :class="props.item.hadRead ? 'point-cont' : 'red-point point-cont'" v-html="props.item.content"></div>
                        </div>
                        <div v-else-if="props.column.field=='issueDate'">
                            <div>{{handleTime(props.item.issueDate)}}</div>
                        </div>
                        <span v-else v-html="props.content"></span>
                    </template>
                </v-data-table>
                <div v-show="false">{{code}}</div>
                <!-- </v-spin> -->
            </v-row>
        </v-card>
        <!-- 信息详情modal -->
        <v-modal title="信息详情" :visible="showMsgDetial" @ok="closeMessageModal" @cancel="closeMessageModal">
            <div class="msg-cont">
                <p style="font-size: 16px;" v-html="messageItem.content"></p>
                <span>{{handleTime(messageItem.issueDate)}}</span>
            </div>
            <div slot="footer"></div>
        </v-modal>

        <!-- 删除询问modal -->
        <v-modal title="删除" :visible="delMessageShow" @ok="ensureDelMessage" @cancel="delMessageShow = false">
            <p style="padding-left: 64px;font-size: 16px;">确认删除？</p>
            <div slot="footer">
                <v-button key="cancel" type="error" size="large" @click="ensureDelMessage">
                    删除
                </v-button>
                <v-button key="confirm" type="ghost" size="large" @click="delMessageShow = false">
                    取消
                </v-button>
            </div>
        </v-modal>
    </div>
</template>

<script>

// import endpoint from '@/api/endpoint.js'
import msgapi from '@/api/company/message';
import staffapi from '@/api/company/staff';
import perapi from '@/api/person';
import tool from '@/api/tool.js';

export default {
    data() {
        return {
            getTypesSuc: false,
            show: true,
            typeList: [{ typeName: '提示', unread: 0 }, { typeName: '公告', unread: 1 }],
            accountTypeName: null,
            columns: [
                { title: "信息内容", field: 'content', width: '80%' },
                { title: "时间", field: 'issueDate' },
            ],
            tableData: [],
            checkedIds: [],
            spinning: false,
            showMsgDetial: false,
            messageItem: { content: '', issueDate: '' },
            //删除
            delMessageShow: false,
        };
    },
    created() {
        this.getMsgTypeList();
        console.log(this.$route.params.code);
    },
    wacth: {
        accountTypeName(val) {
            console.log('消息渠道名字变化：' + val);
            this.$refs.messageTable.reload();
        },
    },
    mounted() { },
    computed: {
        code() {
            // console.log('cod:');
            //  console.log(this.$route.params.code);
            //  return this.$route.params.code;
            let param = {}, str = this.$route.params.code;
            if (!str) { return null; }
            let arr = str.split('&');
            for (let i = 0; i < arr.length; i++) { param[arr[i].split('=')[0]] = arr[i].split('=')[1]; };
            this.handleInivte(param);
            return param;
        }
    },

    methods: {

        //渠道列表
        getMsgTypeList() {
            msgapi.getMsgType()
                .then(req => {
                    if (req.success) {
                        this.getTypesSuc = true;
                        this.typeList = req.result;
                        if (this.accountTypeName == null && this.typeList.length > 0) {
                            this.accountTypeName = this.typeList[0].typeName;
                            this.$refs.messageTable.reload();
                        }
                    } else {
                        this.$message.info(req.message);
                    };
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //信息列表
        loadData(param) {
            let params = {
                query: [{ column: "typeName", filterRange: this.accountTypeName, operat: "=" }],
                sort: {},
                pageNo: param.pageNo,
                pageSize: param.pageSize,
            };
            this.spinning = true;
            // return staffapi.getRoleCountInfo(params)      //测试请求
            return msgapi.getMessages(params)
                .then(req => {
                    if (req.success) {
                        this.tableData = req.result.result;
                        return req.result;
                    } else {
                        this.$message.info(req.message);
                    };
                    this.spinning = false;
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //全选
        checkAll(val) {
            this.checkedIds = [];
            if (val) {
                for (var i = 0; i < this.tableData.length; i++) {
                    this.checkedIds.push(this.tableData[i].id);
                }
            }
            console.log(this.checkedIds);
        },
        //单选
        checkRow(param) {
            let idIndex = tool._inArray(param.row.id, this.checkedIds);
            if (param.checked) {
                if (idIndex == -1) { this.checkedIds.push(param.row.id); }
            } else {
                if (idIndex != -1) { this.checkedIds.splice(idIndex, 1); }
            }
            console.log(this.checkedIds);
        },
        //切换信息渠道
        checkMsgType(item, index) {
            this.accountTypeName = item.typeName;
            this.$refs.messageTable.reload();
        },
        //查看信息详情
        showMessageDetial(item) {
            this.messageItem = item;
            this.showMsgDetial = true;
        },
        //关闭查看面板并标记已读
        closeMessageModal() {
            this.showMsgDetial = false;
            if (this.messageItem.hadRead) { return false }
            //如果是未读消息则刷新
            msgapi.markReaded({ ids: [this.messageItem.id] })
                .then(req => {
                    if (req.success) {
                        this.$refs.messageTable.reload();
                        this.getMsgTypeList();
                        this.getUnreadTotle();
                    } else {
                        this.$message.info(req.message);
                    };
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //标记已读
        markReaded() {
            if (this.checkedIds.length == 0) {
                this.$message.info('未选中可操作项！', 2);
                return false;
            }
            msgapi.markReaded({ ids: this.checkedIds })
                .then(req => {
                    if (req.success) {
                        this.$refs.messageTable.reload();
                        this.getUnreadTotle();
                        this.getMsgTypeList();
                    } else {
                        this.$message.info(req.message);
                    };
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //删除询问
        delMessages() {
            if (this.checkedIds.length == 0) {
                this.$message.info('未选中可操作项！', 3);
            } else {
                this.delMessageShow = true;
            }
        },
        //确认删除
        ensureDelMessage() {
            msgapi.delMessages({ ids: this.checkedIds })
                .then(req => {
                    if (req.success) {
                        this.delMessageShow = false;
                        this.checkedIds = [];
                        this.getUnreadTotle();
                        this.getMsgTypeList();
                        this.$refs.messageTable.reload();
                    } else {
                        this.$message.info(req.message);
                    };
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //同步左侧菜单未读消息个数
        getUnreadTotle() {
            msgapi.unreadTotle()
                .then(req => {
                    if (req.success) {
                      // 更新头部
                      document.dispatchEvent(window.YBG_headInfoChangingTrigger);
                        this.$store.dispatch('messageCount', req.result)
                    } else {
                        this.$message.info(req.message);
                    };
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        //处理邀请
        handleInivte(params) {
            msgapi.handleInivte(params)
                .then(req => {
                    this.$refs.messageTable.reload();
                    if (req.success) {
                        this.$message.info(req.message, 4);
                        this.$store.dispatch('reloadContext')
                        this.$router.push('/message');
                    } else {
                        this.$message.info(req.message);
                        this.$router.push('/message');
                    };
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        handleTime(val) {
            return val ? tool.epochToSecondTime(val) : '';
        },

    },

}






</script>

<style scoped>
/* @import '/static/css/common.css'; */
.btns {
  margin: 0 12px;
  position: relative;
  display: inline-block;
  vertical-align: top;
}
.panel-warp {
  position: absolute;
  height: 18px;
  width: 18px;
  border: 1px solid #e3e5e8;
  border-left: 1px solid transparent;
  border-bottom: 1px solid transparent;
  top: 37px;
  left: 26px;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  z-index: 100;
}
.panel-warp .panel {
  height: 0;
  width: 0;
  border: 8px solid #f3f3f3;
  border-left: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.table-row {
  margin-top: 13px;
  border: 1px solid #e3e5e8;
}
.msg-cont {
  min-height: 90px;
  font-size: 16px;
  background: url(/static/images/home/ybglogo_mini.png) no-repeat bottom right;
  background-size: 23% auto;
}
.msg-cont > p {
  min-height: 70px;
}
.conten-warp {
  cursor: pointer;
  position: relative;
}
.point-cont {
  width: 870px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.red-point::after {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 10px;
  position: absolute;
  background-color: #f00;
  top: -1px;
  right: 1px;
}
.test-btn {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
}
.unread{
    color: #000;
    font-weight: 800;
}
</style>
