<style scoped>
.print-item {
    width:300px;
    border: 1px solid #EEF0F8;
    float: left;
    margin-left: 5px;
    margin-top: 5px;
    height: 635px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
}
.print-item .item-title{
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background-color:#719FFF;
    color:#fff;
    padding:0 15px;
    height:44px;
    line-height: 44px;
    font-size: 16px;
}
.print-item .item-info{
    background-color: #F7F9FE;
}
.item-info li{
    border-bottom: 1px solid #EEF0F8;
    line-height: 35px;
    height:35px;
    padding:0 15px;
}
.item-tip {
  text-indent: 15px;
  margin-top: 5px;
  line-height: 30px;
  color: #606266;
}
.item-tip ul li{
    padding:0 15px;
}
@media screen and (max-width: 1024px) {
  .pic {
    text-indent: 15px;
    margin-top: 5px;
    line-height: 30px;
    color: #606266;
    overflow: hidden;
    width: 100%;
    height: 59%;
  }
}
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'二维码打印'"></returnBtn>
        </div>
        <div class="ins-page-con">
        <div class="ins-page-type type1">
        <div class='ins-page-btn'>
            <div class='ins-opa-btn'>
                <el-button size="small" type="primary" @click="printQrcodeFun">打印</el-button>
            </div>
        </div>
        <div class="ins-page-main">
            <div class="ins-s-ofy-a ins-s-wf ins-s-hf">
            <div class="print-item" v-for="(item,k) in dateHtml" :key="item.USER_ID">
                <!-- 顶部人员信息 -->
                <div class="item-title">{{item.name}}</div>
                <!-- 文字部分 -->
                <ul class="item-info">
                    <li :title="url">PC端网址：{{url}}</li>
                    <li :title="item.USER_LOGIN_NAME">PC端账号：{{item.USER_LOGIN_NAME}}</li>
                    <li>PC端初始密码：{{item.USER_INIT_PWD}}</li>
                </ul>
                <div style="padding:10px 15px;width:160px;"><el-tag type="success">2 步完成微信绑定</el-tag></div>
                <!-- 图片部分 -->
                <div class="item-tip">
                    <ul> 
                        <li>1、打开微信扫码关注公众号</li>
                        <li><img src="../../assets/images/qrcode_for258.jpg" width="125px" height="125px"></li>
                        <li>2、再次打开微信扫码绑定账号</li>
                        <li :id="'qrcode' + k" style="padding: 12px 5px 12px 40px;"></li>
                        <li style="color:#AEAEAE;">账号绑定成功！可在公众号免密登录</li>
                        <li style="color:#AEAEAE;">温馨提示：为保护账号安全，</li>
                        <li style="color:#AEAEAE;">登陆后请尽快修改初始密码。</li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
        </div>
        </div>
    </div>
</template>
<script src="./js/AQrcodePrint.js"></script>