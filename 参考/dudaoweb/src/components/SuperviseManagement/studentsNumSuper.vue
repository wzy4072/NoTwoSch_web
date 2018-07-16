<template>
<div class="ins-container">
  <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'学生人数监控'"></returnBtn>
    </div>
  <div class="ins-page-con">
        <div class="ins-page-type type1">
    <div class="ins-page-search">
      <div class="ins-search-con">
        统计幼园：
        <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择" style="width:240px;" v-model="schoolName1">
          <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in kindergarten"></el-option>
        </el-select>
      </div>
      <div class="ins-search-con">
        统计时间：
        <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:250px;" type="daterange" v-model="date"></el-date-picker>
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
    <!-- 表格 -->
    <div class="ins-table divide">
      <!-- 表格标题+表格功能 -->
      <div class="ins-title">
        <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
        <span>各幼儿园学生人数统计表</span>
        <!-- 复制 打印 -->
        <div class="tabbar-con">
          <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"></tableBar>
        </div>
        <!-- 搜索 -->
        <div class="title-input" >
          <el-input  placeholder="请输入内容" v-model="searchstr">
          </el-input>
        </div>
      </div>
      <div class="ins-tab-con">
        <!-- 表格内容 -->
        <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%" v-if='schoolName.length === 1'>
          <el-table-column type="index" align="center" width="50"  label="序号"></el-table-column>
          <el-table-column prop="gradeName" align="center"  sortable label="年级名称"></el-table-column>
          <el-table-column prop="stuNum" align="center" sortable label="人数"></el-table-column>                 
        </el-table>
        <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%" v-else>
          <el-table-column type="index" align="center" width="50"  label="序号"></el-table-column>
          <el-table-column prop="KRTEN_NAME" align="center"  sortable label="学校名称"></el-table-column>
          <el-table-column prop="stuCount" align="center" sortable label="总人数"></el-table-column>                 
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
<script src="./js/studentsNumSuper.js"></script>