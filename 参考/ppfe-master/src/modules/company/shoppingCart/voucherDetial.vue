<template>
    <div id="cardwarp">
        <v-card title="凭证详情：">


            <v-row class="oder-li">
                <v-row class="oder-tit">
                    <span>凭证号:{{voucherInfo.voucherNo}}</span>
                </v-row>
                <v-row class="order-pro">
                    <v-col span="4" class="lis-tit">
                        <div class="tit-bor">
                            <p>{{voucherInfo.productName }} </p>
                            <div :title="voucherInfo.productIntr">{{voucherInfo.productIntr }}</div>
                        </div>
                    </v-col>
                    <v-col span="3" class="app-info">
                        <div>适用人数</div>
                        <p>{{voucherInfo.useNum}}人</p>
                    </v-col>
                    <v-col span="3" class="app-info">
                        <div>使用时间</div>
                        <p>{{voucherInfo.usePeriod}}个月</p>
                    </v-col>
                    <v-col span="4" class="app-info">
                        <div>开始时间</div>
                        <p>
                            <strong>{{formatDate(voucherInfo.startTime)}}</strong>
                        </p>
                    </v-col>
                    <v-col span="4" class="app-info red-ft">
                        <div>结束时间</div>
                        <p>
                            <strong>{{formatDate(voucherInfo.endTime)}}</strong>
                        </p>
                    </v-col>
                    <v-col span="4" class="app-info">
                        <div>订单创建日期</div>
                        <p>
                            <strong>{{formatDate(voucherInfo.createdAt)}}</strong>
                        </p>
                    </v-col>
                </v-row>
            </v-row>
            <v-row class="oder-li">
                <v-row class="oder-tit">
                    <span>产品详情</span>
                </v-row>
                <v-row class="order-intr">
                    <img :src="'data:image/png;base64,'+voucherInfo.productIntrImg">
                </v-row>
            </v-row>
            <v-row class="oder-li">
                <v-row class="oder-tit">
                    <span>产品所包含模块</span>
                </v-row>
                <v-row class="app-inf" v-for="app in voucherInfo.applications" :key="app.appName">
                    <p>{{app.appName}}:</p>
                    <div>
                        <span v-for="rols in app.modules" :key="rols.moduleName" class="rol-module">{{rols.moduleName}}</span>
                    </div>

                </v-row>
            </v-row>

        </v-card>
    </div>

</template>
<script>
    import payapi from '@/api/pay';
    import tool from '@/api/tool';
    export default {
        data: function () {
            return {
                voucherInfo: {},
                // {
                //     voucherNo: '', useNum: '', usePeriod: '', startTime: '', endTime: '', createdAt: '', application: [
                //         { appName: '', roles: '' },
                //     ]
                // },
            }
        },
        created() {
            this.getVoucherInfo()
        },
        methods: {
            getVoucherInfo() {
                payapi.getVoucherInfo(this.$route.params.code)
                    .then(req => {
                        if (req.success) {
                            this.voucherInfo = req.result;
                            // this.getBase(req.result.productIntrImg);
                            // this.getBase(req);
                        }
                    })
                    .catch(err => { this.$message.info('数据请求失败！' + err.message); });
            },
            formatDate(date) {
                return tool.epochToSecondTime(date)
            },

        },
    }
</script>
<style scoped>
    #cardwarp {
        padding: 30px;
    }

    .oder-tit {
        background-color: #E5F5FC;
        padding: 12px 42px;
        position: relative;
    }

    .oder-li {
        border: 1px solid #E8E9EB;
        margin: 20px 0;
    }

    .oder-li p,
    .oder-li div,
    .oder-li button,
    .oder-li span {
        font-size: 14px;
    }

    .lis-tit {
        padding: 20px 30px;
        height: 148px;
    }

    .tit-bor {
        border: 9px solid #f5f5f5;
        padding: 10px;
        height: 100%;
    }

    .tit-bor>p {
        background-color: #Fff;
        position: relative;
        top: -32px;
        margin: 0px 12px;
        padding: 0 8px;
        text-align: center;
        font-size: 24px;
        color: #03a1ea;
        height: 72px;
        overflow: hidden;
    }

    .tit-bor>div {
        text-align: left;
        position: relative;
        top: -30px;
        height: 22px;
        overflow: hidden;
    }

    .order-pro .app-info {
        padding-top: 42px;
        text-align: center;
    }

    .red-ft strong {
        color: #ff5b3b;
    }

    .order-pro .app-info>div {
        padding-bottom: 20px;

    }

    /* .order-intr{ } */

    .app-inf {
        padding: 30px;
    }

    .app-inf>p {
        margin-bottom: 12px;
    }

    .app-inf>div span {
        margin-right: 28px;
    }
</style>