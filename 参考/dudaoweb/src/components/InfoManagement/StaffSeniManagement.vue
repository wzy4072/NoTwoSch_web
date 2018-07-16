<style scoped>
  .card{
    color:#409EFF;
    cursor: pointer;
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <div class="ins-page-title">
        <span class="ins-back-icon"><i class="el-icon-back"></i></span>教职工资历管理
      </div>
    </div>
    <div class="ins-page-con">
    <div class="ins-page-type type2">
      <div class="ins-page-main">
        <div class="ins-table divide">
          <div class="ins-title">
            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
            <span>教职工资历信息列表</span>
            <!-- 复制 打印 -->
            <div class="tabbar-con">
              <tableBar type="copy,export,printer" tableId="table_A" :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
            </div>
            <!-- 搜索 -->
            <div class="title-input">
              <el-input placeholder="请输入内容" v-model="searchstr" clearable>
              </el-input>
            </div>
          </div>
          <!-- 表格内容 -->
          <div class="ins-tab-con">
            <el-table id="table_A" stripe :data="tableData" border fit style="width: 100%; height:100%;" height="100%">
              <el-table-column align="center" label="姓名" sortable width="100" prop="workerName" v-if="scrColumn.workerName.selected">
                <template slot-scope="scope">
                  <el-button type="text" class="ins-s-p0" size="small" @click="nameClickFn(scope.row)">{{scope.row.workerName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" label="性别" prop="workerGenderName" sortable width="100" v-if="scrColumn.workerGenderName.selected">
              </el-table-column>
              <el-table-column align="center" label="岗位" show-overflow-tooltip prop="workerTypeName" sortable v-if="scrColumn.workerTypeName.selected">
              </el-table-column>
              <el-table-column align="center" width="120" label="教学资历" show-overflow-tooltip prop="teaching" sortable v-if="scrColumn.teaching.selected">
              </el-table-column>
              <el-table-column align="center" width="120" label="最高学历" prop="highestEducationName" sortable v-if="scrColumn.highestEducationName.selected">
              </el-table-column>
              <el-table-column align="center" label="相关证书" prop="qualificationsArrStr" sortable min-width="400" show-overflow-tooltip v-if="scrColumn.qualificationsArrStr.selected">
                <template slot-scope="scope">
                  <span class="card" @click="certificateClickFn(scope.row.qualificationsArr)">{{scope.row.qualificationsArrStr}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" align="center" label="更新时间" prop="modifyDate_" sortable :formatter="dateFormatFn" v-if="scrColumn.modifyDate_.selected">
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页栏 -->
          <div class="ins-tab-divide">
            <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="800px" @close="handleClose">
      <el-carousel trigger="click" indicator-position="outside" height="500px" :autoplay='false' @change="certificateChangeFn">
        <el-carousel-item v-for="(item,key) in pictureData" :key="key" >
          <img @click="showLargerFn(item)" :src="$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + item.qualificationsPath.slice(1)" class="com_full">
        </el-carousel-item>
      </el-carousel>
      <!-- <img :src="imgUrl" class="com_w_full" style="height:400px;" @click="showLargerFn(item)"> -->
    </el-dialog>
  </div>
  </div>
</template>
<script src="./js/StaffSeniManagement.js"></script>
<style scoped>

</style>
