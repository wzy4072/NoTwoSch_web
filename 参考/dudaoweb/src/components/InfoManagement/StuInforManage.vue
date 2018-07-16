<style scoped></style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'学生信息管理'"></returnBtn>
      <!-- tab页 -->
      <div class="ins-tab-label">
        <el-tabs  v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
          <el-tab-pane label="家长信息" name="1">家长信息</el-tab-pane>
          <el-tab-pane label="户籍信息" name="2">户籍信息</el-tab-pane>
          <el-tab-pane label="其他信息" name="3">其他信息</el-tab-pane>
          <el-tab-pane label="全部信息" name="4">全部信息</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
              <el-button v-show="!isSelection" type="success" size="small"><router-link to="StuInfoSupplement">添加学生</router-link></el-button>
              <el-button v-show="!isSelection" type="warning" size="small"><router-link to="StuInfoImport">批量导入</router-link></el-button>
              <el-button v-show="isSelection" type="danger" size="small">删除</el-button>
          </div>
        </div>
        <div class="ins-page-main">
          <div class="ins-table divide">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>{{printOb.title}}</span>
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
              </div>
              <div class="title-input">
                <el-input placeholder="请输入搜索内容" v-model="searchstr" clearable>
                </el-input>
              </div>
            </div>
            <div class="ins-tab-con">
              <el-table id="a" :data='tableData'  @selection-change="handleSelectionChange" border stripe height="100%" style="width: 100%;height:100%">
                <el-table-column type="selection" width="50" align="center">
                </el-table-column>
                <el-table-column label="姓名" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" class="ins-s-p0" size="small" @click="$router.push({ path: '/InfoManagement/StuInfoCheck', query: { stduentId: scope.row.stduentId } })">{{scope.row.studentName}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column v-for="(v,k) in scrColumn.slice(1)" v-if="v.selected" show-overflow-tooltip :key="k" :prop="v.field" align="center" sortable :label="v.text">
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
<script src="./js/StuInforManage.js"></script>

 
