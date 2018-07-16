<template>
    <div class="ins-container pd2">
        <div>
            <div class="ins-page-search">
                <el-button size="medium" type="primary" @click="dialogVisible = true">添加二维码</el-button>
                <el-button size="medium" type="success" @click="printQrcodeFun">打印二维码</el-button>
            </div>
        </div>
        <div class="ins-page-main" style="padding-bottom:40px;">
            <div class="ins-tab-title" style="position:static;">
                <span class="el-icon-menu"></span>
                <span class="com_fs_4">二维码列表</span>
                （已使用：{{used}}/总数：{{total}}）
            </div>
            <div class="com_full com_ofy_a" style=" padding:25px;">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="(v,k) in qrCodeData" :key="k" style="margin-bottom:10px;">
                        <el-card :body-style="{ padding: '5px' }">
                            <div :id="'qrcode' + k" class="qrcode"></div>
                            <div style="padding: 14px;text-align:center;">
                                <span>{{v.questionnaireName}}({{v.isUser?'已使用':'未使用'}})</span><br/>
                                <el-tooltip class="item" effect="light" :content="v.url" placement="top">
                                    <span>{{v.url}}</span>
                                </el-tooltip>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog title="增加二维码" :visible.sync="dialogVisible" width="500px">
            <span>增加&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input-number v-model="addNumber" controls-position="right" :min="1" size="small"></el-input-number>&nbsp;&nbsp;&nbsp;&nbsp;个二维码</span><br/>
            <span>注：<br/>可生成不同二维码，通过每个二维码进入的问卷仅能提交一次，此方法无法收集用户实名。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCancelFun">取 消</el-button>
                <el-button type="primary" @click="dialogComfireFun">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<style scoped>
.qrcode>>>img {
  margin: 0px auto;
}
</style>
<script src="./js/qrcodeManage.js"></script>