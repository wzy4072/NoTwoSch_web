<template>
    <div id="app-layout">
        <v-layout>
            <v-header id="v-header">
                <div class="header-left fl">
                    <img class="fl" src="/static/images/root/logo3.0.png" alt="">
                    <span class="fl"></span>
                    <p class="fl">{{ $route.meta.title }}</p>
                </div>
                <div v-if="isHeaderRightAndFootShow" 
                     class="header-right fr">
                    <router-link to="/login" class="root-router">登录</router-link> <span></span>
                    <i  class="root-router"  @click="updateData()" style="font-style: normal;cursor: pointer">注册</i>
                </div>
                
            </v-header>
            
            <v-content id="v-content">
                <router-view></router-view>
            </v-content>
            
            <v-footer id="v-footer"
                      v-if="isHeaderRightAndFootShow">
                <my-footer></my-footer>
            </v-footer>
        </v-layout>
    </div>
</template>

<script>
    import myFooter from "@/components/dataDisplay/footer.vue"
    
    export default {
        components: {
            myFooter
        },
        data() {
            return {
                // route: 
            }
        },
        methods: {
            
            updateData() {
                var flag = ("R_N"+ Math.random()).replace(/\./, "");
                this.$router.push({ name: 'register', params: { random: flag }})
            },
        },
        computed: {
            isHeaderRightAndFootShow() {
                return  !/\/listing/.test(this.$route.path) && !/\/order/.test(this.$route.path)
            }
        },
        created: function () {
            this.$message.config({ top: 118,  duration: 3 });
        },
    }
</script>

<style scoped>
.fl {
    float: left;
}
.fr {
    float: right;
}
body {
    padding: 0;
}
#v-content, #v-footer {
    background-color: #fff;
}

/* header */
#v-header {
    height: 100px;
    background-color: #fff;
    padding-left: 120px;
    padding-right: 120px;
    font-weight: 500;
    border-bottom: 1px solid #ddd;
}
.header-left {
    font-size: 20px;
    color: #666;
    position: relative;
    top: 10px;
}
.header-left img {
    padding-right: 20px;
}
.header-left p {
    padding-left: 20px;
    position: relative;
    top: 10px;
}
.header-left span {
    position: relative;
    top: 19px;
    display: inline-block;
    height: 50px;
    width: 2px;
    background-color: #ddd;
}
.header-right {
    position: relative;
    top: 20px;
}
.header-right span {
    position: relative;
    top: 3px;
    display: inline-block;
    height: 16px;
    width: 1px;
    background-color: #666;
}
.header-right .root-router{
    font-size: 14px;
    margin-left: 10px;
    margin-right: 10px;
    color: #666;
}
#v-footer {
    padding: 0;
}
</style>
<style>
.ant-message .ant-message-custom-content>span{
    font-size:15px;
}
</style>



