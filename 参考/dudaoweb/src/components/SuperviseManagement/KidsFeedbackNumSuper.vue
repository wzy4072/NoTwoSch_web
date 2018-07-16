<template>
<div class="ins-container">
    <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'幼儿园反馈数量监督'"></returnBtn>
    </div>
      <div class="ins-page-con">
        <div class="ins-page-type type1">
    <!-- 搜索栏 -->
    <div class="ins-page-search">
        <div class="ins-search-con">
            统计幼园：
            <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择" v-model="searchData.krtenCodes">
                <el-option :key="item.krtenCode" :label="item.krtenName" :value="item.krtenCode" v-for="item in allSu">
                </el-option>
            </el-select>
        </div>
         <div class="ins-search-con">
            反馈类型：
            <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择"  v-model="searchData.feedBackType">
                <el-option :key="item.value" :label="item.text" :value="item.value" v-for="item in typeSelect">
                </el-option>
            </el-select>
        </div>
        <div class="ins-search-con">
            统计时间：
            <el-date-picker size="medium"  value-format="yyyy-MM-dd" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:250px;" type="daterange" v-model="searchData.date">
            </el-date-picker>
        </div>
        <div class="ins-opa-btn">
            <el-button size="small" style="margin-left: 10px;" type="primary" @click="refresh">
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
            <!-- 表格标题+表格功能 -->
            <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                <span><span v-show="searchData.date[0]">{{searchData.date[0]}} 到 {{searchData.date[1]}} 时间段</span>督学反馈数量统计表</span>
                <!-- 复制 打印 -->
                <div class="tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a"  :printOb="printOb"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="title-input">
                    <el-input class="input-with-select" placeholder="请输入幼儿园名称" v-model="searchstr">
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
                <!-- 表格内容 -->
                <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%"
                 :summary-method="getSummaries" :span-method="objectSpanMethod">
                    <el-table-column align="center" label="序号" prop="index" width="100">
                    </el-table-column>
                    <el-table-column align="center" label="幼儿园名称"  prop="krtenName" >
                    </el-table-column>
                    <el-table-column align="center"  label="反馈类型"  prop="feedBackTypeStr">
                    </el-table-column>
                    <el-table-column align="center" label="反馈件数"  prop="total" >
                    </el-table-column>
                    <el-table-column align="center" label="处理件数"  prop="finish" >
                    </el-table-column>
                    <el-table-column align="center" label="未处理件数"  prop="unFinish" >
                    </el-table-column>
                </el-table>
            </div>
            <!-- page divide -->
      <div class="ins-tab-divide">
          <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
      </div>
        </div>
        </div>
        </div>
    </div>
</div>
</template>
<script src="./js/KidsFeedbackNumSuper.js">
</script>
