<!-- 章程管理 督导员 -->
<style scoped>
   #tab .el-icon-star-off.active,.score-set .el-icon-star-off.active,.history .el-icon-star-off.active{
      color:#ffa400;
   }
   #tab .el-icon-error{
      color:#F56C6C;
   }
   #tab .el-icon-warning{
      color:#E6A23C;
   }
   #tab .el-icon-success{
      color:#67C23A;
   }
    .constitution-details{
      height:300px;
      overflow: auto;
   }
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
      padding: 0 2px;
      color: #606266;
      margin: 0 5px 5px 0!important;
   }
   .item-atts a:hover{
      color:#409EFF;
   }
   .score-set .el-icon-star-off{
      font-size:25px;
   }
   .constitution-details>div{
      margin:3px 0;
   }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'园资料管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
         <div class="ins-page-search">
            <div class="ins-search-con">
               幼儿园：
               <el-select v-model="currKindergarten" placeholder="请选择幼儿园">
                  <el-option :label="item.krtenName" :value="item.krtenCode" v-for="(item,key) in schoolList" :key="key"></el-option>
               </el-select>
            </div>
         </div>
      <div class="ins-page-main">
         <div class="ins-table divide">
            <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                <span>幼儿园资料列表</span>
                <div class="title-input">
                  <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                  </el-input>
               </div>
            </div>
            <div class="ins-tab-con">
               <el-table :data="tableData" border height="100%" id="tab" stripe>
                  <el-table-column align="left" show-overflow-tooltip label="资料名称" sortable>
                     <template slot-scope="scope">
                        <span class="el-icon-error ins-s-mr-5" v-show="!scope.row.noticeStatus"></span><span class="el-icon-warning ins-s-mr-5" v-show="scope.row.noticeStatus==2"></span><span class="el-icon-success ins-s-mr-5" v-show="scope.row.noticeStatus==3"></span><span v-text="scope.row.noticeTypeStr"></span>
                     </template>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="资料上传说明" prop="noticeTypeCom">
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="资料版本号" prop="version" sortable>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="版本简述" prop="content">
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip label="编辑者" prop="sendName">
                  </el-table-column>
                  <el-table-column align="left" label="操作" sortable fixed="right" width="320">
                     <template slot-scope="scope">
                        <div>
                           <el-button icon="el-icon-download" plain size="mini" type="success" @click="name_function2(scope.row, scope.$index)">模板下载</el-button>
                           <template v-if="scope.row.noticeStatus">
                             <el-button icon="el-icon-edit" v-if="scope.row.noticeStatus==2" plain size="mini" type="success" @click="tableOpa(1,scope.row,scope.$index)">审批</el-button>
                             <el-button icon="el-icon-view" v-if="scope.row.noticeStatus==3" plain size="mini" type="success" @click="tableOpa(2,scope.row)">查看</el-button>
                             <el-button icon="el-icon-document" plain size="mini" type="success" @click="tableOpa(3,scope.row)">历史版本</el-button>
                           </template>
                        </div>
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
         <!-- 历史版本弹框 -->
         <el-dialog title="历史版本" :visible.sync="historyLayer" width="70%">
            <div class="ins-table">
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                    <span>历史版本列表</span>
                </div>
                <div class="ins-tab-con">
                    <el-table class="history" height="300px" stripe border :data="currRow.historyData">
            	<el-table-column property="version" label="资料版本号"></el-table-column>
                <el-table-column property="content" label="版本简述"></el-table-column>
                <el-table-column align="center" label="操作" sortable  width="100">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-view" plain size="mini" type="success" @click="tableOpa(0,scope.row)">查看</el-button>
                  </template>
                </el-table-column>
            </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="historyLayer=false"><span class="el-icon-document ins-s-mr-10"></span>确认</el-button>
            </span>
         </el-dialog>
         <!-- 已通过章程 + 待审核章程 + 历史版本章程详情 -->
         <el-dialog title="资料详细信息" :visible.sync="detailsLayer" width="50%">
            <div class="constitution-details">
               <div>
                  <span style="width:70px;display:inline-block;text-align:right;">编辑者：</span>
                  <span v-text="detailsLayerData.sendName"></span>
               </div>
               <div>
                  <span>发布时间：</span>
                  <span v-text="detailsLayerData.createTime"></span>
               </div>
               <div>
                  <span>资料名称：</span>
                  <span v-text="detailsLayerData.noticeTypeStr"></span>
               </div>
               <div>
                  <span>资料上传说明：</span>
                  <span v-text="detailsLayerData.noticeTypeCom"></span>
               </div>
               <div class="item-content">
                  <span>版本简述：</span>
                  <div v-text="detailsLayerData.content?detailsLayerData.content:'无内容'"></div>
               </div>
               <div class="item-atts">
                  <span>资料附件：</span>
                  <div>
                     <span v-show="!detailsLayerData.atts||!detailsLayerData.atts.length">无附件</span>
                     <a :href="baseUrl+'baseInfo/noticeSys/download/'+item.id" title="下载附件" v-for="(item,key) in detailsLayerData.atts" :key="key">
                        <span class="el-icon-document"></span>
                        <span v-text="item.attName"></span>
                        <span class="el-icon-download"></span>
                     </a>
                  </div>
               </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="sureSetScore" v-if="detailsLayerMark==1">审核通过</el-button>
               <el-button type="primary" @click="detailsLayer=false" v-else="!detailsLayerMark">确认</el-button>
            </span>
         </el-dialog>
         <el-dialog title="模板下载" :visible.sync="dialogVisible2" width="45%">
           <div>
             <span v-show="!atts||!atts.length">无附件</span>
             <a :href="baseUrl+'baseInfo/noticeSys/download/'+item.id" title="下载附件" v-for="(item,key) in atts" :key="key" style="color: #666;">
               <span class="el-icon-document"></span>
               <span v-text="item.attName"></span>
               <span class="el-icon-download"></span>
               <br>
             </a>
           </div>
        </el-dialog>
      </div>
      </div>
   </div>
  </div>
</template>
<script src="./js/CMOne.js"></script>
