<template>
    <div id="app-layout">
        <v-layout>
            <v-sider id="app-sider" collapsible v-model="collapsed" style="background: #fff">
                <v-menu theme="light" mode="inline" :data="functionMenu" @item-click="functionClicked">
                    <template scope="{data}">
                        <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
                        <span class="nav-text">{{data.name}}</span>
                    </template>
                    <template slot="sub" scope="{data}">
                        <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
                        <span class="nav-text">{{data.name}}</span>
                    </template>
                </v-menu>
            </v-sider>
            <v-layout>
                <v-content :style="{ background: '#e9e9eb'}">
                    <router-view></router-view>
                </v-content>
            </v-layout>
        </v-layout>
    </div>
</template>

<style type=text/less>
#app-layout{
    display: flex;
    min-height: 90vh;
    margin: 0;
}
#app-layout .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 16px;
    cursor: pointer;
    transition: color .3s;
}

#app-sider .trigger:hover {
    color: #108ee9;
}
#app-sider .anticon:before {
    font-size: 22px;
}
#app-sider .nav-text {
    font-size: 12px;
}

#app-sider .ant-layout-sider-collapsed .anticon {
    font-size: 16px;
}

#app-sider .ant-layout-sider-collapsed .nav-text {
    display: none;
}
#app-sider .ant-layout-sider-trigger {
    background: #fff;
}
#app-sider .anticon-left:before,.anticon-right:before {
    color: #000;
}
</style>

<script>
import menu from '@/navigations/app/menu.js';

export default {
    props: {
        initHeaderSelected: String,
        initFunctionSelected: String,
    },
    data() {
        return {
            functionMenu: [],
            headerSelected: null,
            functionSelected: null,
            collapsed: false,
        }
    },
    methods: {
        toggle() {
            this.customCollapsed = !this.customCollapsed;
        },
        headerClicked(e) {
            console.log("Header Clicked");
            console.log(e);
            this.$router.push(e[0].link);
            this.headerSelected = e[0].link;
        },
        functionClicked(e) {
            console.log("Function Clicked");
            console.log(e);
            this.$router.push(e[e.length - 1].link);
            this.functionSelected = e[e.length - 1].link;
        }
    },
    computed: {
        defaultFunctionMenu() {
            const ctx = this.$store.getters.loginContext;
            console.log("Computed: Function Menu Changed");
            console.log(ctx);
            return menu.functionMenu(ctx, this.initFunctionSelected);
        },
        loadingContext() {
            console.log("App Loading Context State: " + this.$store.getters.loadingContext);
            return this.$store.getters.loadingContext;
        }
    },
    watch: {
        defaultFunctionMenu(val) {
            console.log("Function Menu Changed Notification");
            console.log(val);
            this.functionMenu = val;
        },
    },
    /* menu active detection */
    created: function () {
        this.$store.dispatch('reloadContext').then(ctx => {
            // no corp defined, jump to define corp
//            if ((ctx.corporates == null || ctx.corporates.length == 0)
//                && this.$router.currentRoute.path == '/home') {
//                this.$router.push('/corporate/new');
//            }
        }).catch(error => {
            console.log(error);
            window.location = '/';
        });
    }
}
</script>
