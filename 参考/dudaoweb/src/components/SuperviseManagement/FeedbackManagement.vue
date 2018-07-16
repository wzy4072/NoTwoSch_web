<style scoped>
  .el-dialog .feedback-content{
    height:200px;
    border:1px solid #ebeef5;
    overflow: auto;
    border-radius:4px;
    -o-border-radius:4px;
    -moz-border-radius:4px;
    -webkit-border-radius:4px;
    padding: 5px;
    background-color: #F8F9FB;
  }
  .qual-details .com_table tr:first-child{
    background-color:#DCDFE6
  }
  .qual-details .com_table tr td:first-child{
    width:40%;
  }
  .qual-details>div{
    overflow:auto;
    height: 400px;
  }
  .feedback-input{
    height:100px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .feedback-input .el-textarea{
    width:85%;
    float: left;
    height: 100%;
    box-sizing: border-box;
  }
  .feedback-input .el-textarea >>> .el-textarea__inner{
    height:100%;
    border-top-right-radius:0;
    border-bottom-right-radius:0;
    -webkit-border-top-right-radius:0;
    -webkit-border-bottom-right-radius:0;
    -o-border-top-right-radius:0;
    -o-border-bottom-right-radius:0;
    -moz-border-top-right-radius:0;
    -moz-border-bottom-right-radius:0;
  } 
  .feedback-input .submit-feedback{
    width:15%;
    height: 100%;
    float: left;
    background: #409EFF;
    color: #fff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-left: none;
    cursor: pointer;
    text-align: center;
  }
  .feedback-input .submit-feedback:hover{
    background-color:#3C7AFF;
  }
  .feedback-input .submit-feedback span{
    position: relative;
    top: 25px;
  }
  .feedback-record{
    height:300px;
    border:1px solid rgb(169, 169, 169);
    padding: 15px;
    overflow: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #F8F9FB;
  }
  .feedback-record .record-item{
    margin-bottom: 15px;
    position: relative;
    padding-left: 60px;
  }
  /* 头像 */
  .record-item .portrait{
    position: absolute;
    left: 0;
    width:48px;
    height: 48px;
  }
  /* 轮播图 */
  .pic-con{
    position:relative;
    padding-top:34px;
    height:100%;
  }
  .pic-con p{
    position:absolute;
    top:0;
    height:34px;
    width: 100%;
  }
</style>
<template>
   <div class="ins-container">
      <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'反馈管理'"></returnBtn>
            <!-- tab页 -->
        <div class="ins-tab-label">
          <el-tabs v-model="tab" @tab-click="getPageData()">
              <el-tab-pane label="核实中" name="first">
                  核实中
              </el-tab-pane>
              <el-tab-pane label="已完结" name="second">
                  已完结
              </el-tab-pane>
          </el-tabs>
        </div>
        </div>
      <div class="ins-page-con">
        <div class="ins-page-type type2">
      <div class="ins-page-main">
        <div class="ins-table divide">
            <div class="ins-title">
            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
            <span>我的反馈记录列表</span>
                <!-- 复制 打印 -->
                <div class="tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="title-input">
                    <el-input  placeholder="请输入内容" v-model="searchstr" clearable>
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
                <!-- 表格内容 -->
                <el-table :data="tableData" border height="100%" id="a" stripe style="width: 100%;height:100%">
                    <el-table-column align="left" width="150px;" label="反馈时间" prop="feedbackTime" sortable v-if="scrColumn.feedbackTime.selected">
                    </el-table-column>
                    <el-table-column align="left" label="反馈内容" sortable v-if="scrColumn.fixField.selected">
                        <template slot-scope="scope">
                       <el-button type="text" class="ins-s-p0" size="small" @click="openLayer(scope.row,2)">查看</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="left" label="反馈跟踪" v-if="scrColumn.trackCountStr.selected"  show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                       <el-button type="text" class="ins-s-p0" size="small" @click="openLayer(scope.row,3)" v-text="scope.row.trackCountStr"></el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="left" label="幼儿园名称" prop="krtenName" show-overflow-tooltip sortable v-if="scrColumn.krtenName.selected">
                    </el-table-column>
                    <el-table-column align="left" label="姓名" show-overflow-tooltip sortable v-if="scrColumn.workerName.selected">
                    <template slot-scope="scope">
                       <el-button type="text" class="ins-s-p0" size="small" @click="openLayer(scope.row,4)">{{scope.row.workerName}}</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="left" label="性别" prop="workerGender" show-overflow-tooltip sortable v-if="scrColumn.workerGender.selected">
                    </el-table-column>
                    <el-table-column align="left" label="岗位" prop="workerType" show-overflow-tooltip sortable v-if="scrColumn.workerType.selected">
                    </el-table-column>
                    <el-table-column align="left" label="教学资历" prop="teaching" show-overflow-tooltip sortable v-if="scrColumn.teaching.selected">
                    </el-table-column>
                    <el-table-column align="left" label="最高学历" prop="highestEducation" show-overflow-tooltip sortable v-if="scrColumn.highestEducation.selected">
                    </el-table-column>
                    <el-table-column align="left" width="200px;" label="相关证书" show-overflow-tooltip sortable v-if="scrColumn.qualificationsName.selected">
                    <template slot-scope="scope">
                        <span class="ins-s-hand ins-s-fs-small" v-text="scope.row.qualificationsName" style="color:#409EFF;" @click="openLayer(scope.row,1)"></span>
                     </template>
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
          <!-- 证书图片layer -->
            <el-dialog title="相关证书" :visible.sync="showLayer1" width="50%">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item v-for="(item,key) in currRow.qualifications" :key="key">
                        <div class="pic-con">
                          <p>{{item.name}}</p>
                          <div class="ins-s-hf">
                            <!-- <img @click="picture(item.url)" src="../../../static/images/Koala.jpg" class="ins-s-wf"> -->
                            <img @click="picture(item.url)" :src="baseUrl+item.url.slice(1)" class="ins-s-wf">
                          </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
            <!-- 反馈内容layer -->
            <el-dialog title="反馈内容" :visible.sync="showLayer2" width="50%">
              <el-form label-width="100px" class="ins-com-item">
                <el-form-item label="反馈人：">
                  <span>{{currRow.feedbackPersonName}}</span>
                </el-form-item>
                <el-form-item label="联系方式：">
                  <span>{{currRow.feedbackPersonTel}}</span>
                </el-form-item>
                <el-form-item label="反馈时间：">
                  <span>{{currRow.feedbackTime}}</span>
                </el-form-item>
                <el-form-item label="反馈内容：">
                  <div class="feedback-content">{{currRow.feedbackContent}}</div>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="showLayer2 = false">确认</el-button>
              </span>
            </el-dialog>
            <!-- 反馈跟踪layer -->
            <el-dialog title="反馈跟踪记录" :visible.sync="showLayer3" width="50%">
                <!-- 反馈输入 -->
                <div class="feedback-input">
                  <el-input type="textarea" placeholder="请输入内容" v-model="myFeedback"></el-input><div class="submit-feedback" title="提交反馈" @click="submitFeedback()">
                    <span>提交<br/>反馈</span>
                  </div>
                </div>
                <!-- 反馈记录 -->
                <div class="feedback-record">
                  <div v-for="(item,key) in currRow.tracks" class="record-item" :key="key">
                    <div class="portrait">
                      <img src="../../assets/images/portrait_def.png" alt="头像" class="ins-s-hf ins-s-wf">
                    </div>
                    <p style="color: #909399;">
                      <span>{{item.createByStr}}</span>
                      <span>（{{item.createTime}}）</span>
                    </p>
                    <p>{{item.trackContent}}</p>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="showLayer3 = false">返回</el-button>
                </span>
            </el-dialog>
            <!-- 资历详情layer -->
            <el-dialog title="资历详情" :visible.sync="showLayer4" width="50%" class="qual-details">
                  <el-table class="ins-s-mb-10" :data="detailsData1" border style="width:100%;" stripe>
                    <el-table-column prop="name" align="left" label="项目"></el-table-column>
                    <el-table-column prop="value" align="left" label="内容"></el-table-column>
                </el-table>
                <el-table :data="detailsData2" border style="width:100%;" stripe>
                    <el-table-column prop="type" align="left" label="证书种类"></el-table-column>
                    <el-table-column prop="name" align="left" label="证明文件"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="showLayer4 = false">确认</el-button>
                </span>
            </el-dialog>
   </div>
</template>
<script src="./js/FeedbackManagement.js"></script>
