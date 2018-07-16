<style scoped>
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
  .feedback-content{
    height:200px;
    border:1px solid #ebeef5;
    overflow: auto;
    border-radius:4px;
    -o-border-radius:4px;
    -moz-border-radius:4px;
    -webkit-border-radius:4px;
    padding: 5px;
    background-color: #F8F9FB;
    margin-bottom:10px;
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
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'反馈记录'"></returnBtn>
        </div>
          
          <div class="ins-page-con">
        <div class="ins-page-type type1">
          <div class="ins-page-btn">
              <div class="ins-opa-btn">
                  <el-button  size="small" @click="openLayer(1)" type="danger">删除</el-button> <!-- v-if="show===0"-->
                  <el-button  size="small" @click="openLayer(2)" type="success">完结反馈</el-button><!-- v-if="End===1"-->
              </div>
          </div>
        <div class="ins-page-main">
            <div class="ins-table divide">
                <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>我的反馈记录列表</span>
                    <div class="tabbar-con">
                        <tableBar type="copy,export,printer" tableId="a"  :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                    </div>
                    <!-- 搜索 -->
                    <div class="title-input">
                        <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                        </el-input>
                    </div>
                </div>
                <!-- 表格内容 -->
                <div class="ins-tab-con">
                    <!-- 表格内容 -->
                    <el-table :data="tableData" @selection-change="check" border height="100%" id="a" stripe="" style="width: 100%;height:100%">
                        <el-table-column type="selection" align="left" width="50"></el-table-column>
                        <el-table-column align="left" label="反馈时间" width="150" prop="feedbackTime" sortable v-if="scrColumn.feedbackTime.selected">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="反馈内容"  v-if="scrColumn.fixField.selected">
                            <template slot-scope="scope">
                                <el-button type="text" class="ins-s-p0" size="small" @click="details(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="反馈状态" prop="feedbackStatus" sortable v-if="scrColumn.feedbackStatus.selected">
                        </el-table-column>
                        <el-table-column  show-overflow-tooltip align="left" label="反馈跟踪"  v-if="scrColumn.trackCountStr.selected">
                            <template slot-scope="scope">
                                <el-button type="text" class="ins-s-p0" size="small" @click="Track(scope.row)" v-text="scope.row.trackCountStr"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="姓名" prop="workerName"  sortable v-if="scrColumn.workerName.selected" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" class="ins-s-p0" size="small" @click="show2(scope.row)" v-text="scope.row.workerName"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="性别" prop="workerGender"  sortable v-if="scrColumn.workerGender.selected">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="岗位" prop="workerType" sortable v-if="scrColumn.workerType.selected">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="教学资历" prop="teaching"  v-if="scrColumn.teaching.selected">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="left" label="最高学历" prop="highestEducation" sortable v-if="scrColumn.highestEducation.selected">
                        </el-table-column>
                        <el-table-column align="left" label="相关证书"  v-if="scrColumn.qualificationsName.selected" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="ins-s-hand ins-s-fs-small" v-text="scope.row.qualificationsName" style="color:#409EFF;" @click="paper(scope.row)"></span>
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
            <!-- 查看反馈内容弹窗 -->
            <el-dialog title="反馈内容" :visible.sync="information" width="50%">
                <div class="feedback-content">{{textarea}}</div>
                <p>{{tim}}</p>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="information = false">返 回</el-button>
                </span>
            </el-dialog>

            <!-- 弹窗个人详情窗口 -->
            <el-dialog title="资历详情" :visible.sync="Personal" width="50%" style="height:85%">
                <el-table class="ins-s-mb-10" :data="detailsData" border style="width:100%;" stripe>
                    <el-table-column prop="name" align="left" label="项目"></el-table-column>
                    <el-table-column prop="value" align="left" label="内容"></el-table-column>
                </el-table>
                <el-table :data="gridData" border style="width:100%;" stripe>
                    <el-table-column prop="type" align="left" label="证书种类"></el-table-column>
                    <el-table-column prop="name" align="left" label="证明文件"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="Personal=false" size="small">返 回</el-button>
                </span>
            </el-dialog>
            <!-- 证书图片layer -->
            <el-dialog title="相关证书" :visible.sync="showpic" width="50%">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item v-for="(item,key) in currRow.qualifications" :key="key">
                        <div class="pic-con">
                          <p>{{item.name}}</p>
                          <div class="ins-s-hf">
                            <img @click="picture(item.url)" :src="baseUrl+item.url.slice(1)" class="ins-s-wf">
                          </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
            <!-- 反馈内容已完结弹窗 -->
            <el-dialog title="反馈跟踪记录" :visible.sync="endContent" width="50%">
                <div class="feedback-record">
                    <div v-for="(item,key) in dialogue" class="record-item" :key="key">
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
                    <el-button type="primary" size="small" @click="endContent = false">返 回</el-button>
                </span>
            </el-dialog>
            <!-- 反馈内容新信息弹窗 -->
            <el-dialog title="反馈跟踪记录" :visible.sync="Record" width="50%">
                <!-- 反馈输入 -->
                <div class="feedback-input">
                  <el-input type="textarea" placeholder="请输入内容" v-model="text"></el-input><div class="submit-feedback" title="提交反馈" @click="Submit1()">
                    <span>提交<br/>反馈</span>
                  </div>
                </div>
                <!-- 反馈记录 -->
                <div class="feedback-record">
                  <div v-for="(item,key) in dialogue" class="record-item" :key="key">
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
                    <el-button  @click="dialogVisible = true" size="small">完结反馈</el-button>
                    <el-button type="primary"  @click="Record = false" size="small">返 回</el-button>
                </span>
            </el-dialog>
            <!-- 完结反馈确认 -->
            <el-dialog title="操作提示" :visible.sync="dialogVisible" width="30%">
                <span>确认完结此反馈？此操作不可撤销</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="Submit" size="small">确 定</el-button>
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 删除确认 -->
            <el-dialog title="操作提示" :visible.sync="deleteDialog" width="30%">
                <span>确认删除此举报记录？此操作不可撤销</span>
                <span slot="footer" class="dialog-footer">
                     <el-button type="primary" @click="delet" size="small">确 定</el-button>
                    <el-button @click="deleteDialog = false" size="small">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
    </div>
    </div>
    
</template>
<script src="./js/FeedbackRecord.js"></script>


