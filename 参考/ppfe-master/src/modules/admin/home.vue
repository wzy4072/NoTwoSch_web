<template>
    <div id="app-layout">
        <v-layout>
            <v-sider collapsible v-model="collapsed">
                <div class="logo"></div>
                <v-menu theme="dark" mode="inline" :data="menus" @item-click="functionClicked">
                    <template slot-scope="{data}">
                        <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
                        <span class="nav-text">{{data.name}}</span>
                    </template>
                    <template slot="sub" slot-scope="{data}">
                        <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
                        <span class="nav-text">{{data.name}}</span>
                    </template>
                </v-menu>
            </v-sider>
            <v-layout>
                <v-content :style="{ background: '#e9e9eb'}">
                    <transition name="move" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </v-content>
            </v-layout>
        </v-layout>
    </div>
</template>

<style>
#app-layout {
  display: flex;
  min-height: 100vh;
  margin: 0;
}
#app-layout .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;
}

#app-layout .trigger:hover {
  color: #108ee9;
}

#app-layout .logo {
  height: 32px;
  background: #333;
  border-radius: 6px;
  margin: 16px;
}

#app-layout .ant-layout-sider-collapsed .anticon {
  font-size: 16px;
}

#app-layout .ant-layout-sider-collapsed .nav-text {
  display: none;
}
</style>

<script>
import api from '@/api/admin/common';
export default {
    data() {
        return {
            menus: [
                { name: '首页', link: '/home', icon: 'home' },
                { name: '公司操作', link: '/company', icon: 'team' },
                { name: '个人操作', link: '/person', icon: 'user' },
                { name: '应用操作', link: '/application', icon: 'appstore' },
                { name: '产品操作', link: '/product', icon: 'shop' },
                { name: '财务流水', link: '/financeaccount', icon: 'bank' },
                // { name: '促销管理', link: '/promotion', icon: 'bank' },
                {
                    name: '统计分析', link: '/statistics', icon: 'area-chart',
                    groups: [{
                        groupName: '平台信息',
                        list: [
                            { name: '全量用户统计', link: '/statistics/platform/total', icon: 'area-chart' },
                            { name: '增量用户统计', link: '/statistics/platform/delta', icon: 'area-chart' }
                        ]
                    }, {
                        groupName: "报关制单",
                        list: [
                            { name: '企业活跃度', link: '/statistics/cms/person', icon: 'area-chart' },
                            { name: '申报单位与单量', link: '/statistics/cms/entity', icon: 'area-chart' },
                            { name: '区域与申报口岸', link: '/statistics/cms/area', icon: 'area-chart' },
                            { name: '申报通道', link: '/statistics/cms/channel', icon: 'area-chart' }
                        ]
                    }]
                },
                { name: '凭证管理', link: '/voucher/imanag', icon: 'bank' },
                
            ],
            functionSelected: null,
            collapsed: false,
        }
    },
    methods: {
        functionClicked(e) {
            this.$router.push(e[e.length - 1].link);
            this.functionSelected = e[e.length - 1].link;
        }
    },
    computed: {

    },
    watch: {

    },
    created: function () {

    }
}
</script>