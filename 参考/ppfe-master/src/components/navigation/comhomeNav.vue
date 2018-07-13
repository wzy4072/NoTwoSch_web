<template>
    <v-card title="系统设置">
        <v-row >
            <v-col v-for="(item,index) in navMsg" :key="index" span="8" class="navli" >
                <v-row >
                    <v-col span="12" class="li-img"><img :src="item.img"> </v-col>
                    <v-col span="12" class="li-msgs">
                        <div >{{item.title}}</div>
                        <p>{{item.p1}}</p>
                        <p>{{item.p2}}</p>
                        <router-link :to="item.btHref">
                        <v-button type="error">去操作</v-button>
                        </router-link>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
    
</template>
<script>
    export default {
        data() {
            return {
                navMsg:[
                    {img:'/static/images/home/hnav_import.png',title:'批量导入',p1:'下载标准模板',p2:'一建录入所有员工信息',btHref:'/account/importstaff'},
                    {img:'/static/images/home/hnav_add.png',title:'新增员工',p1:'添加员工进入公司',p2:'设置员工对应岗位',btHref:'/account/staff'},
                    {img:'/static/images/home/hnav_team.png',title:'岗位查看',p1:'岗位及权限查看',p2:'按岗位批量导入员工',btHref:'/account/role'}
                    ],
            }
        },
        methods:{
        }
    }
</script>
<style scoped>
   
   .li-img{
text-align: center;
   }
.navli:not(:last-child) .li-msgs {
     border-right: 1px solid #EEEEEE;
   }
   
   .li-msgs>div{
    font-size: 16px;
    font-weight: 600;
    font-family: '黑体';
    padding: 8px 0;
   }
   .li-msgs>p{
        font-size: 14px;
        padding: 4px 0;
   }
</style>
