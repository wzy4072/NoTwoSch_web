<template>
    <div id="CMS-client-list">
        <div class="good-main">
            <li class="section intro-section" slot="introSection">
                <div class="section-body">
                    <div class="label"></div>
                    <h4>委托报关管理软件</h4>
                    <p class="strong-text">适用企业：</p>
                    <p class="normal-text">委托报关的货主、工厂、贸易公司等</p>
                    <ul class="features">
                        <li><span></span>&nbsp;物料合规</li>
                        <li><span></span>&nbsp;智能归类</li>
                        <li><span></span>&nbsp;要素管家</li>
                        <li><span></span>&nbsp;在线委托</li>
                    </ul>
                </div>
            </li>
            <purchase-list :isClient="isClient"></purchase-list>
        </div>
        <div class="intro">
            <h3>产品介绍</h3>
            <div class="text">
                <h4>委托服务客户端</h4>
                <span class="gray-line"></span>
                <p>
                    辅助工厂和货主的关务人员准确高效的建立海关商品合规库（智能确认编码及推荐商品要素），将关务数据变得不再复杂，系统逻辑可以避免多处错误，关务合规物料管理方便下次报关申报调出使用。线上绑定报关服务商可实现无纸传递附件和数据，还能在线实时查看报关进度和海关附件。将传统的电话+邮件+快递的方式，变成线上互联网无缝传递，更高效、更简单的实现报关委托和跟进。
                </p>
                <p>
                    此外，云报关还会有更多的效率操作：电子表格导入、免上传报关附件、管理历史报关数据、导入手册数据、查看工作KPI、货主自助查看报关进度、在线委托同行报关（状态自动回传）
                </p>
            </div>
            <div class="features">
                <h4>软件特点</h4>
                <span class="gray-line"></span>
                <ul>
                    <li>
                        <img src="/static/images/goods/CMS/client1.png" alt="">
                        <p>商品信息合规管理</p>
                    </li>
                    <li>
                        <img src="/static/images/goods/CMS/client2.png" alt="">
                        <p>在线发送委托信息</p>
                    </li>
                    <li>
                        <img src="/static/images/goods/CMS/client3.png" alt="">
                        <p>通关状态实时跟踪</p>
                    </li>
                    <li>
                        <img src="/static/images/goods/CMS/client4.png" alt="">
                        <p>报关单证自动下载</p>
                    </li>
                </ul>
            </div>
            <div style="padding-left: 15px;">
                <compare-table :isClient="isClient"></compare-table>
            </div>
        </div>
    </div>
</template>

<script>
    import compareTable from "@/components/dataDisplay/CMSCompareTable"
    import PurchaseList from "@/components/dataEntry/CMSPurchaseList"

    export default {
        components: {
            compareTable: compareTable,
            PurchaseList: PurchaseList
        },
        data() {
            return {
                isClient: true,
                
            }
        },
        computed: {
            
        },
        methods: {
            
        },
        created() {
            
        },
    }
</script>
<style>

</style>
<style scoped>
    @import '/static/css/good-item.css';
    
    .intro-section {
        list-style: none;
    }
    .intro-section .section-body{
        text-align: center;
        font-size: 15px;
        background-color: #fff;
    }
    .intro-section h4 {
        padding-bottom: 20px;
    }
    .intro-section .strong-text{
        color: #333;
        font-weight: bold;
        padding-bottom: 15px;
    }
    .intro-section .normal-text {
        padding-bottom: 10px;
    }
    .intro-section .features {
        padding: 0 25px;
        height: 50px;
    }
    .intro-section .features li {
        float: right;
        width: 100px;
        padding-bottom: 5px;
    }
    .intro-section .features span {
        display: inline-block;
        width: 6px;
        height: 6px;
        margin: 3px 0 0 3px;
        transform-origin: 0 100%;
        transform:rotate(-45deg);
        background: #00aee0;
    }
    
    .intro h3 {
        font-size: 18px;
        padding-left: 20px;
        margin-bottom: 20px;
        border-left: 5px solid #149bd2;
    }
    .intro h4 {
        font-size: 16px;
        padding-bottom: 7px;
    }
    .intro .text, .intro .features{
        position: relative;
        padding-left: 15px;
        font-size: 16px;
        color: #666;
        padding-bottom: 30px;
    }
    .intro .text p {
        line-height: 1.8;
    }
    .intro .gray-line {
        display: inline-block;
        position: absolute;
        top: 11px;
        left: 160px;
        height: 1px;
        width: 970px;
        background-color: #ddd;
    }
    .intro .features {
        height: 240px;
    }
    .intro .features h4 {
        padding-bottom: 20px;
    }
    .intro .features .gray-line {
        left: 95px;
        width: 1035px;
    }
    .intro .features li {
        float: left;
        width: 280px;
        height: 130px;
        border-left: 1px solid #ddd;
        text-align: center;
    }
    .intro .features li:last-child {
        border-right: 1px solid #ddd;
    }
    .intro .features li  {

    }
</style>