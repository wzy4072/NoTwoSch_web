<template>
    <div id="company-layout">
        <div class="min">
            <div>
                <!--<bread-crumb></bread-crumb>-->
            </div>
            <div class="menu-box">
                <v-menu theme="light" 
                        class="menu" 
                        mode="inline" 
                        :data="functionMenu" 
                        @item-click="functionClicked">
                    <template slot-scope="{data}">
                        <div class="menu-item">
                            <a :href="data.link" :target="data.target" style="display:inline">
                                <span class="icon-box">
                                 <img v-if="isIconShow(data.imgName)"
                                      :src="'/static/images/menu/'+data.imgName+'.png'"
                                      alt="">
                             </span>
                                <span>{{data.name}}</span>
                            </a>
                            <v-badge v-if="data.vuexGetter"
                                     class="menu-badge"
                                     :count="getInfoFromVuex(data.vuexGetter)"
                            ></v-badge>
                        </div>
                    </template>
                    <!--下拉菜单母项-->
                    <template slot="sub" slot-scope="{data}">
                        <span class="icon-box">
                            <img v-if="isIconShow(data.imgName)"
                                 :src="'/static/images/menu/'+data.imgName+'.png'"
                                 alt="">
                        </span>
                        <a :href="data.link" :target="data.target" style="display:inline">{{data.name}}</a>
                    </template>

                </v-menu>
            </div>
            <v-content class="content">
                <router-view></router-view>
            </v-content>
        </div>
        <div id="v-footer">
            <my-footer></my-footer>
        </div>
    </div>
</template>



<script>
import menu from '@/navigations/company/menu.js';
import myFooter from "@/components/dataDisplay/footer.vue"
import breadCrumb from "@/components/navigation/breadCrumb.vue"

import msgapi from '@/api/company/message';

export default {
    props: {
        initHeaderSelected: String,
        initFunctionSelected: String,
    },
    components: {
        myFooter,
        breadCrumb
    },
    data() {
        return {
            functionMenu: [],
            headerSelected: null,
            functionSelected: null,
            collapsed: false,
            menuImgMap: {
                companyInfo: 1,
                from: 1,
                road: 1,
                message: 1,
                setting: 1,
                userInfo: 1,
                goodsList: 1,
                myproduct: 1
            }
        }
    },
    methods: {
        /**
         * 是否显示菜单图标
         * @NOTE 在增加菜单图标的时候要同步更新里面的map
         *       虽然可以在img的onerror里将这个img搞消失，但是要考虑到尽量减少错误
         * @param imgName
         */
        isIconShow(imgName) {
            if(!imgName) {
                return false;
            }
            
            if(this.menuImgMap[imgName] === 1) {
                return true;
            }else {
                return false;
            }
        },
        functionClicked(e) {
            if (e[e.length - 1].outerLink) {
                window.location.href = e[e.length - 1].outerLink;
                return
            }
            this.$router.push(e[e.length - 1].link);
            this.functionSelected = e[e.length - 1].link;
        },
        //未读信息个数
        unreadTotle() {
            msgapi.unreadTotle()
                .then(req => {
                    if (req.success) {
                        if(req.result!=0 || req.result!=null){
                            this.$store.dispatch('messageCount', req.result)
                        }else{
                            this.$store.dispatch('messageCount', 0)
                        }
                    } else {
                        console.log(req.message);
                    }
                    this.functionMenu = this.defaultFunctionMenu;
                })
                .catch(err => { this.dispatchReload() });
        },
        dispatchReload() {
            this.$store.dispatch('reloadContext')
                .then(ctx => {
                    
                })
                .catch(error => {
                    window.location = '/';
                });
        },
        getInfoFromVuex(vuexGetter) {
            return this.$store.getters[vuexGetter];
        },
    },
    computed: {
        defaultFunctionMenu() {
            const ctx = this.$store.getters.loginContext;
            return menu.functionMenu(ctx, this.initFunctionSelected);
        },
        loadingContext() {
            return this.$store.getters.loadingContext;
        },
    },
    watch: {
        defaultFunctionMenu(val) {
            this.functionMenu = val;
        },
    },
    /* menu active detection */
    created: function () {
        this.unreadTotle();
        this.$message.config({ top: 118,  duration: 3 });
    }
}


</script>


<style scoped>
#company-layout {
    min-width: 1430px;
    width: 100%;
    background-color: #f3f6f6;
    overflow: auto;
    zoom: 1;
}
#company-layout .min {
    width: 1430px;
    min-height: 730px;
    margin: 0 auto;
}
#company-layout .min .menu-box {
  float: left;
  width: 200px;
  height: 100px;
  font-size: 16px;
}
#company-layout .min .menu {
  position: relative;
  top: 30px;
  width: 200px;
  display: inline-block;
  vertical-align: top;
  border: 1px solid #e9e9e9;
}
#company-layout .min .content {
  float: left;
  vertical-align: top;
  width: 1230px;
  display: inline-block;
}
#v-footer {
    width: 100%;
    min-width: 1280px;
    float: left;
}
</style>
<style>
.ant-card .ant-card-head {
  margin: 0 30px;
  padding: 0;
}
.ant-card-bordered {
  border: 1px solid #e3e5e8;
}
.ant-card-head {
  border-bottom: 1px solid #e3e5e8;
}
.ant-menu-submenu-title:hover, .ant-menu-item:hover {
  background-color: #e4f6fb;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #e4f6fb;
}
.ant-menu-item-selected:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-left: 3px solid #108ee9;
  transform: scaleZ(0.0001);
  transition: all 0.2s;
}
.ant-menu-inline .ant-menu-item:after,
.ant-menu-vertical .ant-menu-item:after {
  content: "";
  border: none;
}

.ant-menu-submenu-title a, .ant-menu-item a {
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
}
.ant-menu-item-selected a {
    color: #0e77ca;
}
.ant-menu-item-selected a:active {
    text-decoration: none;
}
.ant-menu-inline .ant-menu-item,
.ant-menu-inline .ant-menu-submenu-title,
.ant-menu-vertical .ant-menu-item,
.ant-menu-vertical .ant-menu-submenu-title,
.ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  line-height: 70px;
  height: 70px;
  font-size: 15px;
}
.ant-menu-item .anticon,
.ant-menu-submenu-title .anticon {
  margin-top: -2px;
}
.icon-box {
    position: relative;
    top: 4px;
    padding-right: 8px;
}
/* 消息个数 徽标样式 */
.point{
    width:18px;
    /* padding:2px; */
    display:inline-block;
    height: 18px;
    line-height: 18px;
    border-radius: 100%;
    background-color: #f00;
    color:#fff;
    text-align: center;
}
.menu-item .ant-badge-count{
    top: -1px;
    right: -4px;
}
.menu-item a {
    position: absolute;
    top: 0;
    left: 0;
    width: 199px;
    height: 70px;
    padding-left: 25px;
}  
.menu-badge {
    margin-left: 97px;
}
.ant-menu-submenu ul li.ant-menu-item a {
    padding-left: 55px;
}

.ant-message .ant-message-custom-content>span{
    font-size:15px;
}
</style>

