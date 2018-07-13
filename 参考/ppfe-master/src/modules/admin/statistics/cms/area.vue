<template>
    <v-spin :spinning="spinning" tip="正在读取数据">
        <h2>区域与申报口岸</h2>
        <v-row>
            <v-col span="4" push="16">
                <v-date-picker v-model="rangeDate" @confirm="loadChartData" range size="lg"></v-date-picker>
            </v-col>
        </v-row>
        <v-row>
            <v-col span="12">
                <IEcharts :option="areapie" :loading="loading" :style="{height:'480px'}"></IEcharts>
            </v-col>
            <v-col span="12">
                <IEcharts :option="portpie" :loading="loading" :style="{height:'480px'}"></IEcharts>
            </v-col>
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
            areapie: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '区域',
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
            portpie: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '口岸',
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

            this.spinning = true;

            var p1 = api.getAreaPercentage(
                {
                    "startTime": this.rangeDate[0],
                    "endTime": this.rangeDate[1],
                }
            ).then(data => {
                // Mock data 
                // [{ value: 335, name: '国际贸易单一窗口' },{ value: 310, name: 'QP' },{ value: 234, name: '均有' },];
                this.areapie.series[0].data = data.result.map(v => {
                    return { name: this.areaNameCN(v.name), value: v.value };

                });

            });

            var p2 = api.getPortPercentage(
                {
                    "startTime": this.rangeDate[0],
                    "endTime": this.rangeDate[1],
                }
            ).then(data => {
                // Mock data 
                // [{ value: 335, name: '国际贸易单一窗口' },{ value: 310, name: 'QP' },{ value: 234, name: '均有' },];
                this.portpie.series[0].data = data.result;
                this.spinning = false;
            });

            Promise.all(p1, p2).then(r => {
                this.spinning = false;
            }).catch(err => {
                this.spinning = false;
            });
        },
        areaNameCN(code) {
            if (code == null) {
                return "未知"
            }
            const codeCN = {
                440000: '广东省',
                440300: '深圳市',
                440301: '市辖区',
                440303: '罗湖区',
                440304: '福田区',
                440305: '南山区',
                440306: '宝安区',
                440307: '龙岗区',
                440308: '盐田区',

                440100: '广州市',
            　　440101: '广州市辖区',
            　　440103: '荔湾区',
            　　440104: '越秀区',
            　　440105: '海珠区',
            　　440106: '天河区',
            　　440111: '白云区',
　　            440112: '黄埔区',
　　            440113: '番禺区',
            　　440114: '花都区',
　　            440115: '南沙区',
            　　440117: '从化区',
            　　440118: '增城区',

                441900: '东莞市',
                442000: '中山市',
                441300: '惠州市',

                310000: '上海市',
                310100: '市辖区',
                310101: '黄浦区',
                310104: '徐汇区',
                310105: '长宁区',
                310106: '静安区',
                310107: '普陀区',
                310109: '虹口区',
                310110: '杨浦区',
                310112: '闵行区',
                310113: '宝山区',
                310114: '嘉定区',
                310115: '浦东新区',
                310116: '金山区',
                310117: '松江区',
                310118: '青浦区',
                310120: '奉贤区',
                310151: '崇明区',
            }
            return codeCN[code] ? codeCN[code] : code;
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
