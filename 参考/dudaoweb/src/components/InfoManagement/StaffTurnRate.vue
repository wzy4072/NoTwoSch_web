<style scoped>

</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'教职工流失率'"></returnBtn>
    </div>
    <div class="ins-page-con">
    <div class="ins-page-type type1">
      <div class="ins-page-search">
        <div class="ins-search-con">
          统计岗位：
          <el-select size="medium" v-model="inquireObj.workerTypes" multiple collapse-tags placeholder="请选择">
            <el-option v-for="item in workerTypesList" :key="item.confId" :label="item.dictValue" :value="item.dictCode">
            </el-option>
          </el-select>
        </div>
        <div class="ins-search-con">
          统计时间：
          <el-date-picker size="medium" v-model="inquireObj.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
        <div class="ins-opa-btn">
          <el-button type="primary" size="small" @click="getDataFn">查询</el-button>
        </div>
      </div>
      <div class="ins-page-main">
        <div class="ins-table">
          <div class="ins-title">
            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
            <span>教职工流失率统计表</span>
          </div>
          <!-- 表格内容 -->
          <div class="ins-tab-con">
            <el-table id="table_A" :data="tableData" border fit style="width: 100%; height:100%;" height="100%">
              <el-table-column align="center" header-align="center" label="项目" prop="name" sortable="">
              </el-table-column>
              <el-table-column align="center" header-align="center" label="数值" prop="value" sortable="">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      </div>
      </div>
  </div>
</template>
<script src="./js/StaffTurnRate.js"></script>