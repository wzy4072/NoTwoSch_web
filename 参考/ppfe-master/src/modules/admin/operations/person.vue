<template>
    <div style="padding:30px 50px;">
        <v-spin :spinning="spinning" tip="正在读取数据">
            <v-card title="个人操作">
                <v-row>
                    <v-col span="22">
                    <searchers :searchOptions="searchOptions" v-on:searchOutput="SearchPeople"></searchers>

                    </v-col>
                     <v-col span="2">
                         <v-button type="ghost" @click="showAddModal = true">新增用户</v-button>
                    </v-col>
                </v-row>
            
                <br>
                <v-row>
                    <v-col>
                        <v-data-table ref="peopleTable" :data='peopleList' :columns='columns' :page-num="pageNo" :page-size="pageSize" :current-data.sync='currentData'>
                            <template slot="th" slot-scope="props">
                                <strong v-if="props.column.field=='operate'">操作</strong>
                                <strong v-else v-html="props.title"></strong>
                            </template>
                            <template slot="td" slot-scope="props">
                                <div v-if="props.column.field=='operate'">
                                    <v-button type="ghost" @click="lookRecharge(props)">
                                        <span>充值记录</span>
                                    </v-button>
                                    <v-button type="ghost" @click="lookExpenses(props)">
                                        <span>消费记录</span>
                                    </v-button>
                                </div>
                                <span v-else-if="props.column.field=='sex'" v-text="getSex(props.content)"></span>
                                <span v-else-if="props.column.field=='createdAt'" v-text="timestampToDateTime(props.content)"></span>
                                <span v-else v-html="props.content"></span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

            </v-card>
        </v-spin>
        <consume-list :optionsEntry="optionsEntry"></consume-list>
        <add-account :show="showAddModal" @cancel="showAddModal=false" @ok="showAddModal=false"></add-account>
    </div>
</template>
<script>
import api from '@/api/admin/person.js';
import timestampApi from '@/api/tool.js';
import consumeList from '@/components/feedback/consumeList.vue';
import searchers from '@/components/dataEntry/adminHeadSearchers.vue';
import addAccount from '@/components/dataEntry/addAccount.vue';

export default {
    components: {
        consumeList: consumeList,
        searchers: searchers,
        addAccount:addAccount
    },
    data() {
        return {
            spinning: false,
            // 传入搜索器的配置项
            searchOptions: {
                show: false
            },
            // 搜索器的输出项
            searchOutput: {
                usernameSelect: "",
                realNameSelect: "",
                rangeDateSelect: ['', ''],
            },
            currentData: [],
            pageNo: 1,
            pageSize: 10,
            columns: [
                // {title:"个人id",field:'id'},
                // {title:"用户名",field:'username'},
                { title: "真实姓名", field: 'realName' },
                { title: "性别", field: 'sex' },
                { title: "公司名称", field: 'corporateName' },
                { title: "手机号码", field: 'mobile' },
                { title: "QQ号", field: 'qq' },
                { title: "邮箱", field: 'email' },
                { title: "毕业院校", field: 'school' },
                { title: "创建时间", field: 'createdAt' },
                { title: "操作", field: 'operate' },
            ],
            // 传入金额记录（充值或消费记录）弹出框的配置项
            optionsEntry: {
                // 钱包id
                walletId: "",
                // 使用者，是个人版还是公司版 person/company
                user: "",
                // 查询的是充值还是消费记录 recharge/expenses
                flag: "",
                // 显示与否
                isShow: false,
            },
            //展示添加用户
            showAddModal:false,
        }
    },
    created() {
        this.searchOptions = {
            show: true,
            caller: "person",
            searchers: [
                {
                    type: "date",
                    name: "rangeDateSelect"
                },
                {
                    type: "input",
                    placeHolder: "邮箱",
                    name: "email"
                },
                // 王泽阳 20180102 1用户名字段隐藏，显示公司名称 realname 改为realName 2查询添加公司名字段 ,其他驼峰查询参数改为下划线start

                {
                    type: "input",
                    placeHolder: "公司名称",
                    name: "corporateName"
                },
                //end
                {
                    type: "input",
                    placeHolder: "真实姓名",
                    name: "realNameSelect"
                },
                {
                    type: "select",
                    labels: [{value:true,label:'创建公司'},{value:false,label:'未创建公司'}],
                    name: "personId"
                }
            ]
        }
    },
    computed: {

    },
    watch: {

    },
    methods: {
        /**
         * 返回个人列表
         * @NOTE query不写在data里的原因是后台限制没有搜索项就不能传query下的对应的个对象
         * @param prams
         * @returns {Promise<T>|Promise.<T>|Promise<TResult|T>}
         *  
         */
        peopleList(prams) {
            var email = this.searchOutput.email || null;
            var realName = this.searchOutput.realNameSelect || null;
            var sCreate = this.searchOutput.rangeDateSelect[0] || null;
            var eCreate = this.searchOutput.rangeDateSelect[1] || null;
            // 王泽阳 20180102 1用户名字段隐藏，显示公司名称 realname 改为realName 2查询添加公司名字段 ,其他驼峰查询参数改为下划线start
            var corporateName = this.searchOutput.corporateName || null;
            var personId = this.searchOutput.personId // 值可能是 false 所以不能 || null
            var query = [];
            if (corporateName) {
                query.push({
                    "column": "corporate_name",
                    "filterRange": corporateName,
                    "operat": "like"
                })
            };
            if(personId !== null && personId !== undefined && personId !== '' ) {
                query.push({
                    "column": "person_id",
                    "filterRange": personId,
                    "operat": "is"
                })
            };

            if (email) {
                query.push({
                    "column": "email",
                    "filterRange": email,
                    "operat": "like"
                })
            };
            if (realName) {
                query.push({
                    "column": "real_name",
                    "filterRange": realName,
                    "operat": "like"
                })
            };
            if (sCreate) {
                query.push({
                    "column": "created_at",
                    "filterRange": sCreate,
                    "operat": ">="
                })
            };
            if (eCreate) {
                query.push({
                    "column": "created_at",
                    "filterRange": eCreate,
                    "operat": "<="
                })
            };
            // end  

            var result = api.getPeopleList({
                "query": query,
                "pageNo": prams.pageNo,
                "pageSize": prams.pageSize,
                "sort": {}
            })
                .then(resp => {
                    if (resp.success === true) {
                        return resp.result
                    } else {
                        this.$message.error(resp.error);
                    }
                })
                .catch(e => { this.$message.error(e) })
            return result;
        },
        timestampToDate(timestamp) {
            return timestampApi.epochToDateTime(timestamp);
        },
        timestampToDateTime(timestamp) {
            return timestampApi.epochToSecondTime(timestamp);
        },
        getSex(sex) {
            if (sex == 1) {
                return '男';
            } else if (sex == 0) {
                return '女';
            } else {
                return null;
            }
        },
        SearchPeople(searchOutput) {
            this.searchOutput = searchOutput;
            this.$refs.peopleTable.reload();
        },
        lookRecharge(prop) {
            this.optionsEntry.walletId = prop.item.walletId;
            this.optionsEntry.user = "person";
            this.optionsEntry.flag = "recharge";
            this.optionsEntry.isShow = true;
        },
        lookExpenses(prop) {
            this.optionsEntry.walletId = prop.item.walletId;
            this.optionsEntry.user = "person";
            this.optionsEntry.flag = "expenses";
            this.optionsEntry.isShow = true;
        },
    }
}
</script>
<style>
.companyInfos li {
  font-size: 16px;
}
</style>