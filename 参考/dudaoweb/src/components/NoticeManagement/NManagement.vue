<style scoped>
   .item-content, .item-atts{
      position: relative;
      padding-left: 74px;
      margin-bottom: 5px;
   }
   .item-content>span,.item-atts>span{
      position: absolute;
      left:0;
      width:70px;
   }
   .item-atts a{
      display: inline-block;
      border: 1px solid #ddd;
      padding: 0 2px;
      color: #606266;
      margin: 0 5px 5px 0!important;
   }
   .item-atts a:hover{
      color:#409EFF;
      border-color:#409EFF;
   }
</style>
<template>
   <div class="ins-container">
      <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'公告管理'"></returnBtn>
      </div>
      <!-- 页面主体 -->
      <div class="ins-page-con">
        <div class="ins-page-type type1">
          <div class="ins-page-btn">
            <div class="ins-opa-btn">
               <el-button icon="el-icon-plus" size="small" type="success" @click="tableOpa(5)">新建</el-button>
               <el-button icon="el-icon-delete" size="small" type="danger" @click="tableOpa(4)">批量删除</el-button>
            </div>
          </div>
      <!-- 页面主体 -->
      <div class="ins-page-main">
        <div class="ins-table divide">
            <div class="ins-title">
                  <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                  <span class="com_fs_4">教育局公告列表</span>
               <!-- 搜索 -->
               <div class="title-input">
                  <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                  </el-input>
               </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
               <el-table :data="tableData" border height="100%" id="tab" stripe style="height:100%;width:100%;" @selection-change="selectChange">
                  <el-table-column align="center" type="selection" width="55"></el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="公告名称" prop="title" sortable>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="公告类型" prop="noticeTypeStr" sortable>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="发布范围" prop="publicRangeStr" sortable>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="公告状态" prop="noticeStatusStr" sortable>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="创建人" prop="sendName" sortable>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="创建时间" prop="createTime" sortable>
                  </el-table-column>
                  <el-table-column align="center" label="操作" sortable fixed="right" width="200">
                     <template slot-scope="scope">
                        <el-button icon="el-icon-edit" v-if="!scope.row.noticeStatus" plain size="mini" type="success" @click="tableOpa(1,scope.row)">编辑</el-button>
                        <el-button icon="el-icon-view" v-if="scope.row.noticeStatus==1" plain size="mini" type="success" @click="tableOpa(2,scope.row)">查看</el-button>
                        <el-button icon="el-icon-delete" plain size="mini" type="danger" @click="tableOpa(3,scope.row)">删除</el-button>
                     </template>
                  </el-table-column>
               </el-table>
            </div>
            <!-- page divide -->
                    <div class="ins-tab-divide">
                        <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[20,50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
         </div>
      </div>
         <!-- 公告详情弹框 -->
         <el-dialog title="公告详情" :visible.sync="noticeDetailsLayer" width="50%">
            <div class="notice-details">
               <div>
                  <span style="width:70px;display:inline-block;text-align:right;">创建人：</span>
                  <span v-text="currNotice.sendName"></span>
               </div>
               <div>
                  <span>发布时间：</span>
                  <span v-text="currNotice.createTime"></span>
               </div>
               <div>
                  <span>公告类型：</span>
                  <span v-text="currNotice.noticeTypeStr"></span>
               </div>
               <div>
                  <span>公告名称：</span>
                  <span v-text="currNotice.title"></span>
               </div>
               <div class="item-content">
                  <span>公告正文：</span>
                  <div v-text="currNotice.content?currNotice.content:'无内容'"></div>
               </div>
               <div class="item-atts">
                  <span>公告附件：</span>
                  <div>
                     <span v-show="!currNotice.atts||!currNotice.atts.length">无附件</span>
                     <a :href="baseUrl+'baseInfo/noticeSys/download/'+item.attId" v-for="(item,key) in currNotice.atts" :key="key">
                        <span class="el-icon-document"></span>
                        <span v-text="item.attName"></span>
                        <span class="el-icon-download"></span>
                     </a>
                  </div>
               </div>
               <div>
                  <span>发布范围：</span>
                  <span v-text="currNotice.publicRangeStr"></span>
               </div>
            </div>
            <span slot="footer" class="dialog-footer">
               <el-button type="primary" @click="noticeDetailsLayer=false">确 定</el-button>
            </span>
         </el-dialog>
      </div>
   </div>
   </div>
</template>
<script src="./js/NManagement.js"></script>