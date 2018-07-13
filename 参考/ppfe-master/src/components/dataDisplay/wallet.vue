<template>
    <div id="wal-card">
        <v-card :title="walletInfo.name" class="card">
            <v-row class="bal" :gutter="32" ref="aaa">
                <v-col span="12" class="bal-img">
                    <img src="/static/images/home/wallet.png" alt="">
                </v-col>
                <v-col span="12" class="bal-msg">
                    <p>余额（元）</p>
                    <h1>{{walletInfo.balance}}</h1>
                    <router-link :to="recharUrl">
                        <button class="_btn">充值</button>
                    </router-link>
                </v-col>
            </v-row>

            <v-tabs active-tab-key="key1" class="bal-tab">
                <v-tab-pane tab-key="key1" tab="消费记录">
                    <wallet-table :loadData="consData" @tabseach="consTabsearch" @pushRef="pushConsRef"> </wallet-table>
                </v-tab-pane>
                <v-tab-pane tab-key="key2" tab="充值记录">

                    <wallet-table :loadData="rchrData" @tabseach="rchrTabsearch" @pushRef="pushRchrRef"> </wallet-table>

                </v-tab-pane>
            </v-tabs>
        </v-card>
    </div>
</template>
<script>
    import walletTable from '@/components/dataDisplay/walletTable.vue';
    export default {
        props: ['walletInfo', 'rchrData', 'consData', 'recharUrl'],
        components: {
            'walletTable': walletTable
        },
        data() {
            return {
            }
        },
        created() {

        },
        methods: {
            //消费记录查询
            consTabsearch(date) {
                this.$emit('consTabsearch', date);
            },
            //充值记录
            rchrTabsearch(date) {
                this.$emit('rchrTabsearch', date);
            },
            //向 父级抛出组件对象
            pushRchrRef(tabRef) {
                this.$emit('pushRchrRef', tabRef);
            },
            //向 父级抛出组件对象
            pushConsRef(tabRef) { this.$emit('pushConsRef', tabRef); },
        }
    }

</script>
<style scoped>
    @import '/static/css/common.css';
    .card {
        background: #fff;
    }

    .bal {
        height: 262px;
        padding-top: 70px;
        background-color: #f5f5f5;
        text-align: center;
    }

    .bal .bal-img {
        text-align: right;
        padding-top: 40px;
    }

    .bal .bal-msg {
        text-align: left;
    }

    .bal .bal-msg p {
        font-size: 16px;
    }

    .bal .bal-msg h1 {
        font-size: 46px;
        font-family: '黑体';
        font-weight: bolder;
        color: #ff5b3b;
    }

    ._btn {
        margin: 0;

        background: #ff5b3b;
    }

    .bal-tab {
        padding: 30px;
    }
</style>
<style>
    #wal-card .ant-card-body {
        padding: 0;
    }
</style>