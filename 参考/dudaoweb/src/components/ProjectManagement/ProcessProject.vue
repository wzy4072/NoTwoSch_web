<style scoped>
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
        <!-- page title -->
        <div class="ins-page-title">
            <returnBtn :title="'学年过程性专项督导'"></returnBtn>
        </div>
        <!-- tab页 -->
    </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
       <p class="failInfo">
             <el-input-number v-model="InputNumber1" controls-position="right" :min="null" :value="null"></el-input-number>
             <span>-</span>
             <el-input-number v-model="InputNumber2" controls-position="right"  :min="null" :value="null"></el-input-number>
             <span>学年过程性专项督导</span>
       </p>
        <p class="failInfo">保存新项目后，各幼儿园默认显示此最新保存的项目</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveFuc()">保存</el-button>
          <el-button type="primary" @click="dialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
          <!-- 页面主体 -->
    <div class="ins-page-con">
        <!-- tab1: search + table -->
        <div class="ins-page-type type1" >
            <!-- 搜索栏 -->
            <div class="ins-page-search">
              
                <div class="ins-opa-btn">
                    <el-button size="small" type="primary" @click="showDialog(1)" >
                      <span class=" ins-s-mr-10"></span>新建督导项目
                    </el-button>
                </div>
            </div>
            <div class="ins-page-main">
                <div class="ins-table divide">
                    <!-- title -->
                    <div class="ins-title">
                        <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                        <span>过程性专项督导项目列表</span>
                        <!-- 复制 打印 -->
                      
                        <!-- 搜索 -->
                        
                    </div>
                    <!-- content -->
                    <div class="ins-tab-con">
                      <el-table :data="tableData" height="100%" id="a" border="" style="width: 100%;height:100%;">
                      <el-table-column align="center" label="项目名称" prop="projectName"  >
                      </el-table-column>
                      <el-table-column label="操作"  header-align="center"  class-name='hide'>
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            @click="showDialog(2,scope.$index, scope.row)">编辑名称</el-button>
                          <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    </div>
                    <!-- page divide -->
                    <!-- <div class="ins-tab-divide">
                        <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
      <!-- <div class="ins-page-main">
       <div class="ins-table divide">
             <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>过程性专项督导项目列表</span>
            </div>
        <div class="ins-tab-con">
          <div class="ins-tab-con">
            <el-table :data="tableData" height="100%" id="a" border="" style="width: 100%;height:100%;">
              <el-table-column align="center" label="项目名称" prop="projectName"  >
              </el-table-column>
               <el-table-column label="操作"  header-align="center"  class-name='hide'>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="showDialog(2,scope.$index, scope.row)">编辑名称</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        </div>
      </div> -->
    </div>
  
</template>
<script src="./js/ProcessProject.js"></script>
