<template>
        <div style="padding:30px 50px;">
            <v-spin :spinning="spinning" tip="正在读取数据">
                <v-card title="财务账户">
                    
                    <br>
                    <v-row>
                        <v-col>
                            <v-data-table ref="financeTable" 
                                          :data='financeList' 
                                          :columns='columns' 
                                          :page-num="pageNo" 
                                          :page-size="pageSize" 
                                          :current-data.sync='currentData'>
                                <template slot="th" slot-scope="props">
                                    <strong v-if="props.column.field=='operate'">操作</strong>
                                    <strong v-else v-html="props.title"></strong>
                                </template>
                                <template slot="td" slot-scope="props">
                                    <div v-if="props.column.field=='operate'">
                                        <v-button type="ghost" icon="edit" @click="checkBill(props)"><span>查看流水</span></v-button>
                                    </div>
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
        components: {
            
        },
        data(){
            return {
                spinning: false,
                
                currentData: [],
                pageNo: 1,
                pageSize: 10,
                columns:[
                    {title:"账户名",field:'financeName'},
                    {title:"余额",field:'balance'},
                    {title:"操作",field:'operate'}
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

                var query = [];
                
                var result = api.getFinanceList({
                    "query": query,
                    "pageNo": prams.pageNo,
                    "pageSize": prams.pageSize,
                    "sort": {}
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
                
            },
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            searchFinanceList() {
                this.$refs.financeTable.reload();
            },
            checkBill(props) {
                var id = props.item.id;
                console.log(id);   
                this.$router.push('/financebill/' + id);
            }
        }
    }
</script>
<style>

</style>