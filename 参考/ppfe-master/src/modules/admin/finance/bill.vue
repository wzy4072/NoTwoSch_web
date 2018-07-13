<template>
        <div style="padding:30px 50px;">
            <v-spin :spinning="spinning" tip="正在读取数据">
                <v-card title="流水查看">
                    <v-row>
                        <v-col :md="6">
                            <v-date-picker range v-model="rangeDateSelect" format="yyyy-MM-dd"></v-date-picker>
                        </v-col>
                        <v-col :md="6">
                            <v-input placeholder="流水号" v-model="flowNumberSelect" style="width: 80%;"></v-input>
                        </v-col>
                        <v-col :md="6">
                            <v-input placeholder="对方户名" v-model="oppositeAccountSelect" style="width: 80%;"></v-input>
                        </v-col>
                        <v-col :md="6">
                            <v-button type="primary" icon="search" @click="searchFinanceList"><span>搜索</span></v-button>
                        </v-col>
                    </v-row>
                    <br>
                    <v-row>
                        <v-col>
                            <v-data-table ref="financeTable" 
                                          :data='financeList' 
                                          :columns='columns' 
                                          :page-num="pageNo" 
                                          :page-size="pageSize" 
                                          :current-data.sync='currentData'>
                                <template slot="td" slot-scope="props">
                                    <span v-if="props.column.field=='time'" v-text="timestampToDate(props.content)"></span>
                                    <span v-else v-html="props.content"></span>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    
                </v-card>
            </v-spin>
        </div>
</template>
<script>
    import api from '@/api/admin/finance.js';
    import timestampApi from '@/api/tool.js';
    
    export default{
        props: ['id'],
        components: {
            
        },
        data(){
            return {
                spinning: false,

                flowNumberSelect: "",
                oppositeAccountSelect: "",
                rangeDateSelect:['',''],
                
                currentData: [],
                pageNo: 1,
                pageSize: 10,
                columns:[
                    {title:"日期",field:'time'},
                    {title:"流水号",field:'flowNo'},
                    {title:"摘要",field:'summary'},
                    {title:"收入",field:'income'},
                    {title:"支出",field:'expend'},
                    {title:"余额",field:'balance'},
                    {title:"收款账号",field:'paymentAccount'},
                    {title:"对方帐号",field:'oppoSiteName'},
                    {title:"对方户名",field:'oppoSiteAccount'},
                ],
                
            }
        },
        created(){

        }, 
        computed: {
            
        },
        watch: {
           
        },
        methods:{
            
            financeList(prams) {
                var flowNum = this.flowNumberSelect || null;
                var oppositeAccount = this.oppositeAccountSelect || null;
                var stime =this.rangeDateSelect[0] || null;
                var etime =this.rangeDateSelect[1] || null;
                
                console.log(stime);
                console.log(etime);
                var result = api.getFinanceBill({
                    "target": this.id,
                    "flowNum": flowNum,
                    "oppositeAccount": oppositeAccount,
                    "stime": stime,
                    "etime": etime,
                    "pageNo": prams.pageNo,
                    "pageSize": prams.pageSize,
                })
                    .then(resp => {
                        if(resp.success === true) {
                            return resp.result
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                return result;
                
                // temp code
//                return new Promise((resolve, reject) => {resolve()}).then(req => {
//                    return {"result":[{
//                        "time":123123123,
//                        "flowno":123,
//                        "summary":321,
//                        "income":1232,
//                        "expend":4312,
//                        "balance":1232,
//                        "paymentaccount":12312,
//                        "oppositename":3123,
//                        "oppositeaccount":21321,
//                        }
//                    ],"totalCount":1,"pageNo":1,"pageSize":10};
//                })
            },
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            searchFinanceList() {
                this.$refs.financeTable.reload();
            },
        }
    }
</script>
<style>

</style>