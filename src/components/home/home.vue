
<template>
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
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      context: null,
      leftMenu: [
        { name: "欢迎页", icon: "menu", route: "/welcome" },
        { name: "学生管理", icon: "goods", children :[
          { name: "学生列表",  route: "/stumanage/list" }          
        ]},
        { name: "二维码", icon: "goods", route: "/qrcode" }
      ],
      accessGranted: false,
      loggingIn: true
    };
  },
  methods: {},
  created() {
    var _this = this;
    setTimeout(function() {
      _this.loggingIn = false;
      _this.accessGranted = true;
      _this.$router.push("/welcome");
    }, 1000);

    // 转到主页
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
