<template>
    <div>
        <div v-bind:class="{'good-compare': true, 'show-less': showLess, 'isClient': isClient}">
            <table>
                <thead>
                <tr>
                    <!--<th></th>-->
                    <th class="th-top th-left">方案对比</th>
                    <th class="th-top">免费版</th>
                    <th class="th-top">{{isClient ? '管理版' : '团队版'}}</th>
                    <th class="th-top">定制版</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colspan='6'>
                        <div class="caption caption-1">
                            <span>基本功能</span>
                        </div>
                        <table>
                            <tr>
                                <th>支持团队数量</th>
                                <td>2名成员</td>
                                <td>8/15/30名成员</td>
                                <td>私有部署定制</td>
                            </tr>
                            <tr>
                                <th>空间容量</th>
                                <td>1G</td>
                                <td>10G/50G/100G</td>
                                <td>可定制</td>
                            </tr>
                            <tr>
                                <th>个性化模版</th>
                                <td>2个</td>
                                <td>8个起</td>
                                <td>不限</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan='6'>
                        <table>
                            <div class="caption caption-2">
                                <span>功能</span>
                            </div>
                            <tr v-if="!isClient">
                                <th>申报单位</th>
                                <td><span>1个</span></td>
                                <td><span>不限</span></td>
                                <td><span>不限</span></td>
                            </tr>
                            <tr>
                                <th>一键导入</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr>
                                <th>自动生成附件</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr>
                                <th>逻辑审核</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>商品收录</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="isClient">
                                <th>在线下单</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>操作习惯设置</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>业务报表</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr>
                                <th>实时进程</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="isClient">
                                <th>供应商管理</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="isClient">
                                <th>导入模版设置</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="isClient">
                                <th>加贸手册管理</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="isClient">
                                <th>商品合规库</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>商品合并</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>商品分隔</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>物料信息</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                            <tr v-if="!isClient">
                                <th>在线协同</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span>定制</span></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan='6'>
                        <table>
                            <div class="caption caption-3">
                                <span>申报路径</span>
                            </div>
                            <tr>
                                <th>单一窗口</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                            <tr>
                                <th>QP系统</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan='6'>
                        <table>
                            <div class="caption caption-4">
                                <span>服务支持</span>
                            </div>
                            <tr>
                                <th>5✖8小时客服在线</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                            <tr>
                                <th>阿里云安全加密</th>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                            <tr>
                                <th>成为合作供应商</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                            <tr>
                                <th>客服快速通道</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                            <tr>
                                <th>附带企业自身LOGO</th>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="no"><img src="/static/images/goods/no.png" alt=""></span></td>
                                <td><span class="yes"><img src="/static/images/goods/yes.png" alt=""></span></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="show-more-box">
            <v-button class="show-more-btn"
                      @click="switchShow"
            >{{btnText}}</v-button>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            isClient: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                showLess: true,
            }
        },
        computed: {
            btnText() {
                return this.showLess ? "查看全部" : "收起";
            }
        },
        methods: {
            switchShow() {
                this.showLess = !this.showLess;
            }
        }
    }
</script>

<style scoped>
    .good-compare > table {
        position: relative;
        width: 97%;
        border-collapse: collapse;
    }
    .good-compare table table {
        /*position: relative;*/
        width: 100%;
        border-collapse: collapse;
    }
    .good-compare .th-top {
        font-size: 18px;
        border-top: 1px solid #f3f3f3;
        color: #333;
        background-color: #f2f9fc;
    }
    .good-compare .th-left {
        text-align: left;
        padding-left: 30px;
    }
    .good-compare th,.good-compare td {
        width: 300px;
        height: 50px;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
        color: #666;
    }
    .good-compare table table th {
        text-align: left;
        padding-left: 85px;
    }
    .good-compare caption, .good-compare table table tr, .good-compare thead {
        line-height: 50px;
        border-bottom: 1px solid #f3f3f3;
    }
    .good-compare .caption {
        position: absolute;
        left: 0;
        padding: 10px 22px;
        width: 65px;
        background-color: #fff;
        border-right: 1px solid #f3f3f3;
        border-bottom: 1px solid #f3f3f3;
    }
    .good-compare .caption span {
        display: inline-block;
        height: 100%;
        position: relative;
        top: 50%;
    }
    .good-compare .caption-1 {
        top: 52px;
        height: 153px;
    }
    .good-compare .caption-2 {
        top: 205px;
        height: 613px;
    }
    .good-compare .caption-3 {
        top: 818px;
        height: 102px;
    }
    .good-compare .caption-4 {
        top: 920px;
        height: 255px;
    }
    .good-compare.isClient .caption-2 {
        height: 510px;
    }
    .good-compare.isClient .caption-3 {
        top: 716px;
    }
    .good-compare.isClient .caption-4 {
        top: 818px;
        height: 203px;
    }
    .good-compare .caption-1 span {
        margin-top: -46px;
    }
    .good-compare .caption-2 span {
        margin-top: -23px;
    }
    .good-compare .caption-3 span {
        margin-top: -49px;
    }
    .good-compare .caption-4 span {
        margin-top: -46px;
    }
    .good-compare.show-less {
        height: 205px !important;
        overflow: hidden;
    }
    .show-more-box {
        width: 97%;
        padding-top: 20px;
        text-align: center;
    }
    .show-more-btn {
        width: 100px;
        height: 30px;
        font-size: 14px;
    }
</style>