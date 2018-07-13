<template>
    <!-- 客服顾问 -->
        <v-card title="客服顾问" >
            <v-row type="flex" justify="space-between">
                <v-col span="4">
                    <v-popover   placement="right" >
                        <div class="servimg img1"></div>
                        <div slot="content"><img class="ewm-img" src="/static/images/home/ybg_person_chat.jpg" alt=""></div>
                    </v-popover>
                    <p>客服微信号</p>
                </v-col>
                <v-col span="4">
                        <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=84b770154fbe6efb68947a6ec4b421c34b3130a40de1088d048bd086d53df931">
                        <div class="servimg img2"></div>
                        </a>
                    <p>报关业务交流群</p>
                </v-col>
                <v-col span="4">
                        <v-popover   placement="right" >
                                <div class="servimg img3"></div>
                                <div slot="content"><img class="ewm-img" src="/static/images/home/ybg_qq.jpg" alt=""></div>
                            </v-popover>
                    <p>客服顾问号</p>
                </v-col>
                <v-col span="4">
                        <v-popover   placement="right" >
                                <div class="servimg img4"></div>
                                <div slot="content"><img class="ewm-img" src="/static/images/home/ybg_pub_chat.png" alt=""></div>
                            </v-popover>
                    <p>微信公众号</p>
                </v-col>
            </v-row>
        </v-card>
</template>


<style scoped>
    /*客服顾问*/
    .servimg {
        height: 68px;
        width: 82px;
        background: no-repeat url('/static/images/home/quke_serv.png')
    }
    .servimg.img1 {
        background-position: 0 0;
    }

    .servimg.img2 {
        background-position: -114px 0;
    }

    .servimg.img3 {
        background-position: -211px 0;
    }

    .servimg.img4 {
        background-position: -299px 0;
    }
    .ewm-img{
        width:120px;
        height: 120px;
    }
</style>