<template>
    <v-spin :spinning="spinning" tip="正在读取数据">
        <h2>申报通道</h2>
        <v-row>
            <v-col span="4" push="16">
                <v-date-picker v-model="rangeDate" @confirm="loadChartData" range size="lg"></v-date-picker>
            </v-col>
        </v-row>
        <v-row>
            <IEcharts :option="pie" :loading="loading" @ready="onReady" @click="onClick" :style="{height:'480px'}"></IEcharts>
        </v-row>
    </v-spin>
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
            // 图表数据
            pie: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '申报通道',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: "{d}% - {b}"
                            },
                        },
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            // 图表loading状态
            loading: false,
            // 时间选择
            rangeDate: rangeDate,
        }
    },
    created() {
        this.loadChartData();
    },
    methods: {
        loadChartData() {
            api.getChannelPercentage(
                {
                    "startTime": this.rangeDate[0],
                    "endTime": this.rangeDate[1],
                }
            ).then(data => {
                // Mock data 
                // [{ value: 335, name: '国际贸易单一窗口' },{ value: 310, name: 'QP' },{ value: 234, name: '均有' },];
                this.pie.series[0].data = data.result.map(v => {
                    return { name: this.passageNameCN(v.name),value: v.value };
                });
                this.spinning = false;
            }).catch(e => {
                this.spinning = false;
                console.error(e);
            });
        },
        passageNameCN(code) {
            if (code == null) {
                return "未知"
            }
            const nameCN = { 0: 'QP', 1: '单一窗口' };
            return nameCN[code] ? nameCN[code] : code;
        },
        onReady(instance) {
            console.log(instance);
        },
        onClick(parmas) {
            console.log(parmas);
        },
    }
}
</script>
