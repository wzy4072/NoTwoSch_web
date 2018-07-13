<template>
  <div id="app">
  <el-container style="border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :router="true">
        <div v-for="(m,seq) in leftMenu" :key="seq">
        <el-submenu v-if="m.children != null" :key="seq" :index="m.name + seq">
          <template slot="title"><i :class="'el-icon-' + m.icon"></i>{{m.name}}</template>
          <el-menu-item-group>
            <el-menu-item v-for="(sub, sseq) in m.children" :index="sub.route" :key="sseq">
              <i :class="'el-icon-' + sub.icon"></i>{{sub.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :index="m.route" :route="m.route">
          <i :class="'el-icon-' + m.icon"></i>{{m.name}}
        </el-menu-item>
        </div>
      </el-menu>
    </el-aside>
    <el-main>
      <div v-if="accessGranted">
        <router-view></router-view>
      </div>
      <div v-else>
        <div v-if="loggingIn">
          登入中...
        </div>
        <div v-else>
          对不起，您没有系统权限！
        </div>
      </div>
    </el-main>
  </el-container>
  </div>
</template>

<script>
import api from "@/api/context";

export default {
  name: "Shipper",
  data() {
    return {
      context: null,
      leftMenu: [],
      accessGranted: false,
      loggingIn: true
    };
  },
  methods: {
    menuBuilder(context) {
      // XXX 管理员
      if (context.access.length > 0) {
      } else {
        // this.$message("Sorry, Not Authorized: " + context.username);
      }
      return [
        { name: "货物", icon: "menu", route: "/goods" },
        { name: "物料库", icon: "goods", route: "/sku" },
        { name: "ASN", icon: "document", route: "/asn" },
        { name: "报关单", icon: "document", route: "/declaration" },
        {
          name: "中国关务",
          icon: "star-off",
          children: [
            { name: "收发货人", icon: "location-outline", route: "/customs/cn/entity" },
            { name: "手册", icon: "tickets", route: "/customs/cn/registry" },
            {
              name: "SKU归类",
              icon: "edit-outline",
              route: "/customs/cn/classification"
            },
            {
              name: "归并关系",
              icon: "sort",
              route: "/customs/cn/consolidation"
            },
            {
              name: "容器和包装方式",
              icon: "sold-out",
              route: "/customs/cn/container"
            }
          ]
        },
        {
          name: "基础信息",
          icon: "setting",
          children: [
            {
              name: "服务商",
              icon: "phone-outline",
              route: "/service-provider"
            },
            { name: "容器", icon: "rank", route: "/basic/container" }
          ]
        }
      ];
    }
  },
  created() {
    api.current().then(context => {
      this.context = context;
      this.leftMenu = this.menuBuilder(context);
      if (context.access.length > 0) {
        this.accessGranted = true;
      } else {
        this.accessGranted = false;
      }
      this.loggingIn = false;
      // XXX test
      this.accessGranted = true;
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
