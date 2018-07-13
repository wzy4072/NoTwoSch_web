<template>
    <div>
        <v-spin :spinning="spinning" tip="正在读取数据">
            <h2>企业活跃度</h2>
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
            <v-row>
                <v-col span="12">
                    <v-data-table :data='loadData' :columns='columns' ref="table">
                        <template slot="td" slot-scope="props">
                            <span v-if="props.column.field === 'ACTIVE_CORPORATE'">
                                <a href="javascript:void(0);" @click="showActiveDetail(props.item.dateValue)">{{props.content}}</a>
                            </span>
                            <span v-else v-html="props.content"></span>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col span="12">
                    <v-card v-if="dateValue !=null" v-bind:title="activeCorporateTitle">
                        <v-data-table :data='loadActiveData' :columns='activeColumns' stripe bordered pagination ref="activeTable">
                            <template slot="td" slot-scope="props">
                                <span v-if="props.column.field === 'industry'">
                                    {{industryCodeName[props.item.industry]}}
                                </span>
                                <span v-else v-html="props.content"></span>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
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
                { title: "活跃数量 (占比)", field: 'ACTIVE_CORPORATE' },
                { title: "沉默数量 (占比))", field: 'INACTIVE_CORPORATE' },
            ],

            activeColumns: [
                { title: "企业ID", field: 'id' },
                { title: "企业名称", field: 'name' },
                { title: "行业属性", field: 'industry' },
            ],
            dateValue: null,
            industryCodeName: { 0: '报关行', 1: '货代', 2: '供应链', 3: '电商', 4: '工厂', 5: '物流', 6: '贸易公司', 7: '仓库' }
        }
    },
    created() {
        this.loadChartData();
    },
    computed: {
        activeCorporateTitle() {
            return `${this.dateValue} 活跃企业列表`;
        },
    },
    methods: {
        loadData() {
            return Promise.resolve({ result: this.tableData });
        },
        loadActiveData(param) {
            return api.getActiveCorporate({
                dateValue: this.dateValue, pageNo: param.pageNo, pageSize: param.pageSize,
            }).then(data => {
                return data;
            }).catch(e => {
                console.error(e);
            });
        },
        showActiveDetail(dateValue) {
            this.dateValue = dateValue;
            if (this.$refs.activeTable) {
                this.$refs.activeTable.reload();
            }
        },
        mapLegend(name) {
            let map = {
                ACTIVE_CORPORATE: '活跃企业',
                INACTIVE_CORPORATE: '沉默企业',
            };
            return map[name] ? map[name] : name;
        },
        loadChartData() {
            this.tableData = [];

            api.getCorporateActivity(
                {
                    "types": this.types,
                    "startTime": this.rangeDate[0],
                    "endTime": this.rangeDate[1],
                }
            ).then(data => {

                var r = data.result;
                this.line.xAxis.data = r.xaxis.map(ts => handleTime.epochToDateTime(ts));
                this.line.series = r.seriesValues.map(sv => { return { type: "line", name: this.mapLegend(sv.name), data: sv.data } });
                this.line.legend.data = r.seriesValues.map(sv => this.mapLegend(sv.name));


                // transfer to table data 
                var svmap = new Map(r.seriesValues.map(sv => {
                    return [sv.name, sv.data];
                }));

                r.xaxis.forEach((ts, index) => {
                    let ac = svmap.has('ACTIVE_CORPORATE') ? svmap.get('ACTIVE_CORPORATE')[index] : 0;
                    let ic = svmap.has('INACTIVE_CORPORATE') ? svmap.get('INACTIVE_CORPORATE')[index] : 0;

                    this.tableData.push({
                        dateValue: handleTime.epochToDateTime(ts), INACTIVE_CORPORATE: `${ic} (${(ic / (ac + ic) * 100).toFixed(0)}%)`, ACTIVE_CORPORATE: `${ac} (${(ac / (ac + ic) * 100).toFixed(0)}%)`,
                    });
                });
                this.spinning = false;
            }).catch(e => {
                this.spinning = false;
                console.error(e);
            });
        },
    }
}
</script>
