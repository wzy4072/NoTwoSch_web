<template>
<div class="ins-container">
    <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'督学反馈数量监督'"></returnBtn>
    </div>
    <!-- 搜索栏 -->
    <div class="ins-page-con">
        <div class="ins-page-type type1">
    <div class="ins-page-search">
        <div class="ins-search-con">
            统计督学：
            <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择" v-model="searchData.suIds">
                <el-option :key="item.suId" :label="item.suName" :value="item.suId" v-for="item in allSu">
                </el-option>
            </el-select>
        </div>
         <div class="ins-search-con">
            反馈类型：
            <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择" style="width:180px;" v-model="searchData.feedBackType">
                <el-option :key="item.value" :label="item.text" :value="item.value" v-for="item in typeSelect">
                </el-option>
            </el-select>
        </div>
        <div class="ins-search-con">
            统计时间：
            <el-date-picker size="medium" value-format="yyyy-MM-dd" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:250px;" type="daterange" v-model="searchData.date">
            </el-date-picker>
        </div>
        <div class="ins-opa-btn">
            <el-button size="small"  type="primary" @click="refresh">
                <span class="el-icon-search">
                </span>
                <span>
                    查询
                </span>
            </el-button>
        </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-main">
        <!-- 表格 -->
        <div class="ins-table divide">
            <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                <span>
                    <span v-show="searchData.date[0]">{{searchData.date[0]}} 到 {{searchData.date[1]}} 时间段</span>
                       督学反馈数量统计表
                </span>
                <!-- 复制 打印 -->
                <div class="tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a"  :printOb="printOb"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="title-input">
                    <el-input placeholder="请输入督学名称" v-model="searchstr">
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
                <!-- 表格内容 -->
                <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%"
                 :summary-method="getSummaries" :span-method="objectSpanMethod">
                    <el-table-column align="center" label="序号"  prop="index"  width="100">
                    </el-table-column>
                    <el-table-column align="center" label="督学名称"  prop="suName">
                    </el-table-column>
                    <el-table-column align="center"  label="反馈类型"  prop="feedBackTypeStr">
                    </el-table-column>
                    <el-table-column align="center" label="反馈件数"  prop="total">
                    </el-table-column>
                    <el-table-column align="center" label="处理件数"  prop="finish">
                    </el-table-column>
                    <el-table-column align="center" label="未处理件数"  prop="unFinish">
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页栏 -->
            <div class="ins-tab-divide">
                <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[45,90,150,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>
    </div>
    </div>
    </div>
</div>
</template>
<script src="./js/StudyFeedbackNumSuper.js"></script>
