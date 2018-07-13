<template>
    <div id="CMS-list">
        <div class="good-main">
            <li class="section intro-section" slot="introSection">
                <div class="section-body">
                    <div class="label"></div>
                    <h4>报关管理软件</h4>
                    <p class="strong-text">适用企业：</p>
                    <p class="normal-text">报关公司、货代公司</p>
                    <ul class="features">
                        <li><span></span>&nbsp;在线接单</li>
                        <li><span></span>&nbsp;自动审单</li>
                        <li><span></span>&nbsp;智能制单</li>
                        <li><span></span>&nbsp;无忧申报</li>
                    </ul>
                </div>
            </li>
            <purchase-list :isClient="isClient"></purchase-list>
        </div>
        <div class="intro">
            <h3>产品介绍</h3>
            <div class="text">
                <h4>报关申报管理软件</h4>
                <span class="gray-line"></span>
                <p>
                    报关申报管理平台，是开放式的功能服务平台，将原本一个软件里的功能实现独立，各独立功能间又能实现数据协同互联，数据始于模板导入和API接口，在海运舱单、陆运舱单、商检申报、报关单申报的彼此模块间流转，最终达到复杂个性的报关目的。平台可以导入和接收报关单、可以导入海运舱单、可以导入、申报、确报和接收公路舱单、可以在云报关实现一次导入全部共享。
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
                        <img src="/static/images/goods/CMS/declare1.png" alt="">
                        <p>在线接收报关委托</p>
                    </li>
                    <li>
                        <img src="/static/images/goods/CMS/declare2.png" alt="">
                        <p>一键制单减少录入</p>
                    </li>
                    <li>
                        <img src="/static/images/goods/CMS/declare3.png" alt="">
                        <p>自动审单控制差错</p>
                    </li>
                    <li>
                        <img src="/static/images/goods/CMS/declare4.png" alt="">
                        <p>放行单证自动回传</p>
                    </li>
                </ul>
            </div>
            <div style="padding-left: 15px;">
                <compare-table></compare-table>
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
                isClient: false,
                
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
    
    .good-unit-change {
        position: absolute;
        top: -8px;
        left: 65px;
        width: 122px;
        padding-bottom: 20px;
        text-align: center;
        font-size: 14px;
    }
    .good-unit-change .extra{
        display: inline-block;
        width: 140px;
        position: absolute;
        top: -14px;
        left: 112px;
        color: #00aee0;
    }
    .good-unit-change .extra img {
        position: relative;
        top: 4px;
        left: 0;
    }
    .good-unit-change ul {
        display: inline-block;
        border: 1px solid #ddd;
        width: 122px;
        height: 27px;
    }
    .good-unit-change li{
        float: left;
        line-height: 25px;
        width: 60px;
        height: 25px;
        cursor: pointer;
        background-color: #fff;
    }
    .good-unit-change li.is-active {
        background-color: #ddd;
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