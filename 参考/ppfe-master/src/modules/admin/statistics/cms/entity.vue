<template>
    <div>
        <v-spin :spinning="spinning" tip="正在读取数据">
            <h2>申报单位与单量</h2>
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
                { title: "申报单位", field: 'DECL_ENTITY' },
                { title: "累计申报单位", field: 'DECL_ENTITY_TOTAL' },
                { title: "申报单量", field: 'DECL' },
                { title: "累计申报单量", field: 'DECL_TOTAL' },
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
                DECL: '单量',
                DECL_ENTITY: '申报单位',
                //DECL_TOTAL: '累计单量',
                //DECL_ENTITY_TOTAL: '累计申报单位',
            };
            return map[name] ? map[name] : name;
        },
        loadChartData() {
             this.tableData = [] ;
            api.getDeclEntity(
                {
                    "types": this.types,
                    "startTime": this.rangeDate[0],
                    "endTime": this.rangeDate[1],
                }
            ).then(data => {

                var r = data.result;
                this.line.xAxis.data = r.xaxis.map(ts => handleTime.epochToDateTime(ts));

                let actualSeries = r.seriesValues.filter(sv => this.mapLegend(sv.name) !== sv.name);

                this.line.series = actualSeries.map(sv => { return { type: "line", name: this.mapLegend(sv.name), data: sv.data } });
                this.line.legend.data = actualSeries.map(sv => this.mapLegend(sv.name));

                // transfer to table data 
                var svmap = new Map(r.seriesValues.map(sv => {
                    return [sv.name, sv.data];
                }));

                r.xaxis.forEach((ts, index) => {
                    let decl = svmap.has('DECL') ? svmap.get('DECL')[index] : 0;
                    let entity = svmap.has('DECL_ENTITY') ? svmap.get('DECL_ENTITY')[index] : 0;
                    let decl_total = svmap.has('DECL_TOTAL') ? svmap.get('DECL_TOTAL')[index] : 0;
                    let entity_total = svmap.has('DECL_ENTITY_TOTAL') ? svmap.get('DECL_ENTITY_TOTAL')[index] : 0;

                    this.tableData.push({ dateValue: handleTime.epochToDateTime(ts), DECL: decl, DECL_ENTITY: entity, DECL_TOTAL: decl_total, DECL_ENTITY_TOTAL: entity_total });
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
