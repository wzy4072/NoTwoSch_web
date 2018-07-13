<template>
    <div>
        <v-modal :title="optionsEntry.flag ==='expenses' ? '消费记录': '充值记录'"
                 :visible="optionsEntry.isShow"
                 @ok="handleOk"
                 @cancel="handleCancel">
            <v-row>
                <v-date-picker range v-model="rangeDateSelect" format="yyyy-MM-dd" ></v-date-picker>
                <v-button type="primary" @click="search">查询</v-button>
            </v-row>
            <br>
            <v-row >
                <v-data-table :data='loadList' :columns='columns' ref="dataTab">
                    <template slot="td" slot-scope="props">
                        <span v-if="props.column.field=='createdAt'" v-text="timestampToDate(props.content)"></span>
                        <span v-else v-html="props.content"></span>
                    </template>
                </v-data-table>
            </v-row>
        </v-modal>

    </div>
</template>

<script>
    import personApi from '@/api/admin/person.js';
    import companyApi from '@/api/admin/company.js';
    import timestampApi from '@/api/tool.js';
    
    export default {
        props:['optionsEntry'],
        data(){
            var result = ['',''];
            result[1] = this.dateFormat(new Date(), "yyyy-MM-dd");
            result[0] = this.dateFormat(new Date(Date.parse(new Date) - 1000*60*60*24*30), "yyyy-MM-dd");
            
            return {
                pageNo: 1,
                pageSize: 10,
                rangeDateSelect: result,
                currentData: [],
                columns:[
                    {title:"应用",field:'appName'},
                    {title:"金额",field:'totalFee'},
                    {title:"创建时间",field:'createdAt'}
                ], 
            }
        },
        created(){
            
        },
        computed: {
            
        },
        methods:{
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
//            rangeDateChange: function() {
//                
//            },
            /**
             * 时间格式化方法
             * @param date Date对象实例
             * @param fmt 格式
             * @returns {*}
             */
            dateFormat(date, fmt) {
                var o = {
                    "y+": date.getFullYear(),
                    "M+": date.getMonth() + 1,                 //月份
                    "d+": date.getDate(),                    //日
                    "h+": date.getHours(),                   //小时
                    "m+": date.getMinutes(),                 //分
                    "s+": date.getSeconds(),                 //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S+": date.getMilliseconds()             //毫秒
                };
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)){
                        if(k == "y+"){
                            fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
                        }
                        else if(k=="S+"){
                            var lens = RegExp.$1.length;
                            lens = lens==1?3:lens;
                            fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
                        }
                        else{
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        }
                    }
                }
                return fmt;

            },
            loadList(prams) {
                // 没有传入钱包id时，直接新建一个promise返回空
                if(!this.optionsEntry.walletId) {
                    return new Promise((resolve, reject) => {resolve()}).then(req => {
                        return {"result":[],"totalCount":0,"pageNo":1,"pageSize":10};
                    })
                }
                
                var user = this.optionsEntry.user;
                var flag = this.optionsEntry.flag;
                var walletId = this.optionsEntry.walletId;
                var sTime = this.rangeDateSelect[0] || null;
                var eTime = this.rangeDateSelect[1] || null;
                // 谁用，就用谁的接口文件
                var api = (function() {
                    if(user === "person") {
                        return personApi
                    }else if(user === "company") {
                        return companyApi
                    }
                })();
                // 查消费调消费的接口，查充值就调充值的接口
                var getList = (function() {
                    if(flag === "expenses") {
                        return api.getExpenses
                    }else if(flag === "recharge") {
                        return api.getRecharge
                    }
                })();
                
                var result = getList({
                    walletId,
                    sTime,
                    eTime,
                    pageNo: prams.pageNo,
                    pageSize: prams.pageSize,
                })
                    .then(resp => {
//                        if(resp.success === true) {
//                            return resp.result
//                        }else {
//                            this.$message.error(resp.error);
//                        }
                        return resp
                    })
                    .catch(e => {this.$message.error(e)})
                return result;
            },
            search() {
                this.$refs.dataTab.reload();
            },
            handleOk() {
                this.optionsEntry.isShow = false;
                this.pageNo = 1;
                this.pageSize = 10;
                this.currentData = []
            },
            handleCancel() {
                this.optionsEntry.isShow = false;
                this.pageNo = 1;
                this.pageSize = 10;
                this.currentData = []
            }
        },
        watch: {
            optionsEntry: {
                handler: function (val, oldVal) {
                    if(val.isShow === false) {
                        return
                    }
                },
                deep: true
            }
        }
    }

</script>
<style scoped>
    
</style>