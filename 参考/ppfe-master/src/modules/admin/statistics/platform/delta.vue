<template>
    <div>
        <v-spin :spinning="spinning" tip="正在读取数据">
            <h2>增量用户分析</h2>
            <v-row>
                <v-col span="4">
                    <v-date-picker v-model="rangeDate" @confirm="loadChartData" range size="lg"></v-date-picker>
                </v-col>
            </v-row>
            <v-row>
                <div class="echarts" style="width: 1200px;height:400px;">
                    <IEcharts :option="line" :notMerge="notMerge" :loading="loading"></IEcharts>
                </div>
            </v-row>

            <v-data-table :data='loadData' :columns='columns' ref="table"></v-data-table>
        </v-spin>
    </div>
</template>

<script>
import api from '@/api/admin/statistics/report.js';
import handleTime from '@/api/tool.js';
import IEcharts from 'vue-echarts-v3/dist/vue-echarts.js';
export default {
    components: {
        IEcharts
    },
    data() {
        var rangeDate = [];
        rangeDate[0] = handleTime.epochToDateTime(Date.parse(new Date()) - 7 * 24 * 60 * 60 * 1000);
        rangeDate[1] = handleTime.epochToDateTime(Date.parse(new Date()));
        return {
            spinning: false,
            loading: false, // 图表loading状态
            notMerge: true,
            line: { // 图表数据
                legend: {
                    data: []
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            rangeDate: rangeDate,  // 时间选择

            tableData: [],
            columns: [
                { title: "日期", field: 'dateValue' },
                { title: "企业数", field: 'CORPORATE' },
                { title: "用户", field: 'USER' },
                { title: "注册用户", field: 'USER_SELF_REG' },
                { title: "邀请用户", field: 'USER_INVITE_REG' },
            ],
        }
    },
    created() {
        this.loadChartData();
    },
    methods: {
        loadData() {
            return Promise.resolve({ result: this.tableData });
        },
        mapLegend(name) {
            let map = {
                USER: '用户数',
                CORPORATE: '企业数',
                ACTIVE_USER: '活跃用户数',
                INACTIVE_USER: '沉默用户数',
                USER_INVITE_REG: '邀请用户数',
                USER_SELF_REG: '注册用户数'
            };
            return map[name] ? map[name] : name;
        },
        loadChartData() {
            this.tableData = [];
            api.getPlatformDelta(
                {
                    "types": this.types,
                    "startTime": this.rangeDate[0],
                    "endTime": this.rangeDate[1],
                }
            ).then(data => {
                //Mock data 
                //var r = {"success":true,"message":null,"result":{"xaxis":[1510329600000,1510416000000,1510502400000,1510588800000],"seriesValues":[{"name":"CORPORATE","data":[10.0,12.0,14.0]},{"name":"USER_INVITE_REG","data":[12.0,34.0]},{"name":"USER_SELF_REG","data":[6.0,4.0]},{"name":"USER","data":[20.0,30.0,30.0,34.0]},{"name":"ACTIVE_USER","data":[12.0,23.0,23.0]},{"name":"INACTIVE_USER","data":[12.0,7.0,7.0]}]},"error":null};
                var r = data.result;
                this.line.xAxis.data = r.xaxis.map(ts => handleTime.epochToDateTime(ts));
                this.line.series = r.seriesValues.map(sv => { return { type: "line", name: this.mapLegend(sv.name), data: sv.data } });
                this.line.legend.data = r.seriesValues.map(sv => this.mapLegend(sv.name));

                // transfer to table data 
                var svmap = new Map(r.seriesValues.map(sv => {
                    return [sv.name, sv.data];
                }));

                r.xaxis.forEach((ts, index) => {
                    this.tableData.push({                        dateValue: handleTime.epochToDateTime(ts),
                        USER: svmap.has('USER') ? svmap.get('USER')[index] : "",
                        CORPORATE: svmap.has('CORPORATE') ? svmap.get('CORPORATE')[index] : "",
                        ACTIVE_USER: svmap.has('ACTIVE_USER') ? svmap.get('ACTIVE_USER')[index] : "",
                        INACTIVE_USER: svmap.has('INACTIVE_USER') ? svmap.get('INACTIVE_USER')[index] : "",
                        USER_INVITE_REG: svmap.has('USER_INVITE_REG') ? svmap.get('USER_INVITE_REG')[index] : "",
                        USER_SELF_REG: svmap.has('USER_SELF_REG') ? svmap.get('USER_SELF_REG')[index] : "",
                    });
                });

                this.$refs.table.reload();

                this.spinning = false;
            }).catch(e => {
                this.spinning = false;
                console.error(e);
            });
        },
    }
}
</script>