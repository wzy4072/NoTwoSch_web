<template>
<div class="ins-container">
  <div class="ins-page-top">
        <!-- page title -->
        <div class="ins-page-title">
            <span class="ins-back-icon"><i class="el-icon-back"></i></span>学生流动及流失率监控
        </div>
  </div>
  <!-- 页面主体 -->
    <div class="ins-page-con">
    <div class="ins-page-type type1">
    <div class="ins-page-search">
      <div class="ins-search-con">
        统计幼园：
        <el-select size="medium" :collapse-tags="true" multiple placeholder="所有幼儿园" v-model="schoolName">
            <el-option
              v-for="item in kindergarten"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="ins-search-con">
        统计时间：
        <el-date-picker size="medium" v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
        <div class="ins-opa-btn">
            <el-button size="small" type="primary" @click="query">
                <span class="el-icon-search"></span>
                <span>查询</span>
            </el-button>
        </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-main">
      <div class="ins-table divide">
        <div class="ins-title">
          <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
          <span>各幼儿园学生流动及流失率统计表</span>
          <!-- 复制 打印 -->
            <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
            </div>
          <!-- 搜索 -->
          <div class="title-input">
              <el-input placeholder="请输入内容" v-model="searchstr">
              </el-input>
          </div>
          </div>
        <!-- 表格内容 -->
        <div class="ins-tab-con">
          <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%">
            <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="krtenName" align="center" v-if="scrColumn[0].selected" sortable label="学校名称"></el-table-column>
            <el-table-column prop="startNum" align="center" v-if="scrColumn[1].selected" sortable label="期初学生人数"></el-table-column>
            <el-table-column prop="endNum" align="center" v-if="scrColumn[2].selected" sortable label="期末学生人数"></el-table-column>
            <el-table-column prop="addNum" align="center" v-if="scrColumn[3].selected" sortable label="本期增加学生人数"></el-table-column>
            <el-table-column prop="lossNum" align="center" v-if="scrColumn[4].selected" sortable label="本期流失学生人数"></el-table-column>
            <el-table-column prop="lossNumRate" align="center" v-if="scrColumn[5].selected" sortable label="本期学生流失率%"></el-table-column>
            <el-table-column prop="totalAddRate" align="center" v-if="scrColumn[6].selected" sortable label="本期流动总量流动率%"></el-table-column>
            <el-table-column prop="totalLossRate" align="center" v-if="scrColumn[7].selected" sortable label="本期流动差量流动率%"></el-table-column>
            <el-table-column prop="outRate" align="center" v-if="scrColumn[8].selected" sortable label="本期流出量流动率%"></el-table-column>
            <el-table-column prop="inRate" align="center" v-if="scrColumn[9].selected" sortable label="本期流进量流动率%"></el-table-column>
        </el-table>
        </div>
        <!-- 分页栏 -->
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
<script src="./js/studentsChurnRateSuper.js"></script>