<style scoped>
.spanText {
  color: #47a7ff;
}
.spanText:hover {
  cursor: pointer;
}
.spanShenqing{word-break:normal; width:auto; display:block; white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;}
.el-dialog__body{font-size: 16px;}
</style>
<template>
  <div class='ins-container'>
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'异动明细信息'"></returnBtn>
    </div>
    <div class='ins-page-con'>
      <div class="ins-page-type type1">
        <!-- 搜索栏 -->
        <div class='ins-page-search'>
          <div class="ins-search-con">
            统计时间：
            <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期"
                            style="width:350px;" type="daterange" v-model="date">
            </el-date-picker>
          </div>
          <div class="ins-opa-btn">
            <el-button size="small" type="primary" @click="searchData">
              <span class="el-icon-search ins-s-mr-10"></span>查询
            </el-button>
          </div>
        </div>
        <!--页面主体-->
        <div class='ins-page-main'>
          <div class='ins-table divide'>
            <!-- title -->
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
              <span>异动明细列表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"
                          :scrColumn1.sync="scrColumn"></tableBar>
              </div>
              <!-- 搜索 -->
              <div class="title-input">
                <el-input placeholder="请输入搜索内容" v-model="input5" clearable>
                </el-input>
              </div>
            </div>
            <!-- 表格内容 -->
            <div class='ins-tab-con'>
              <el-table :data='tableData' id="a" height='100%' border=''>
                <el-table-column align='center' label='异动内容' sortable='' v-if="scrColumn.transactionType.selected">
                  <template slot-scope='scope'>
                <span class='spanText' @click="showDieg(scope.row.transactionType,scope.$index, scope.row)">
                  {{transactionTypeStr[parseInt(scope.row.transactionType) - 1]}}
                </span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='年级' prop='gradeName' show-overflow-tooltip='' sortable='' v-if="scrColumn.gradeName.selected">
                </el-table-column>
                <el-table-column align='center' header-align='center' label='年级代码' prop='gradeCode' show-overflow-tooltip='' sortable='' v-if="scrColumn.gradeCode.selected">
                </el-table-column>
                <el-table-column align='center' header-align='center' label='班级' prop='className' show-overflow-tooltip='' sortable='' v-if="scrColumn.className.selected">
                </el-table-column>
                <el-table-column align='center' header-align='center' label='姓名' prop='studentName' show-overflow-tooltip='' sortable='' v-if="scrColumn.studentName.selected">
                </el-table-column>
                <el-table-column align='center' header-align='center' label='入学代码' prop='entranceCode' show-overflow-tooltip='' sortable='' v-if="scrColumn.entranceCode.selected">
                </el-table-column>
                <el-table-column align='center' header-align='center' label='性别' show-overflow-tooltip='' sortable='' v-if="scrColumn.studentGender.selected">
                  <template slot-scope='scope'>
                    <span>{{studentGenderStr[scope.row.studentGender]}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='操作时间' prop='transactionDate' show-overflow-tooltip='' sortable='' v-if="scrColumn.transactionDate.selected">
                </el-table-column>
              </el-table>
            </div>
            <!-- page divide -->
            <div class="ins-tab-divide">
              <el-pagination :current-page="currentPage4" :page-size="size" :page-sizes="[50,100,200,300]"
                             :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
            <el-dialog title="异动详情" :visible.sync="dialogChangeTeacher" width="800px" height="700px" id="dialogOne">
              <div>
                <div style="margin:10px 0;width:100%;height:350px;">
                  <div style="padding-bottom: 15px;border-bottom: 1px solid #ddd;">
                    <el-row>
                      <el-col :span="10">
                        异动类型：<span v-text="transactionTypeStr[transactionData.transactionType - 1]">转班</span>
                      </el-col>
                      <el-col :span="10">
                        操作时间: <span v-text="transactionData.transactionDate">XXXX-XX-XX</span>
                      </el-col>
                    </el-row>
                  </div>
                  <div style="padding: 15px 0;border-bottom: 1px solid #ddd;">
                    <el-row>
                      <el-col :span="10">
                        学生姓名: <span v-text="transactionData.studentName">XXX</span>
                      </el-col>
                      <el-col :span="10">
                        学生性别: <span v-text="transactionData.studentGenderName">XXX</span>
                      </el-col>
                    </el-row>
                    <el-row style="margin:10px 0;">
                      <el-col :span="10">
                        证件类型: <span v-text="transactionData.certificatesType">XXX</span>
                      </el-col>
                      <el-col :span="10">
                        证件号码: <span v-text="transactionData.certificatesNum">XXXXXXXXXXXXXXXXXXXXX</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="16">
                        户籍地址: <span v-text="transactionData.householdsAddress">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
                      </el-col>
                    </el-row>
                  </div>
                  <div style="padding: 15px 0;">
                    <el-row>
                      <el-col :span="10">
                        原年级: <span v-text="transactionData.oldGradeName">小班</span>
                      </el-col>
                      <el-col :span="10">
                        现年级: <span v-text="transactionData.newGradeName">小班</span>
                      </el-col>
                    </el-row>
                    <el-row style="margin:10px 0;">
                      <el-col :span="10">
                        原年级代码: <span v-text="transactionData.oldGradeCode">G2017</span>
                      </el-col>
                      <el-col :span="10">
                        现年级代码: <span v-text="transactionData.newGradeCode">G2017</span>
                      </el-col>
                    </el-row>
                    <el-row style="margin:10px 0;">
                      <el-col :span="10">
                        原入学代码: <span v-text="transactionData.oldEntranceCode">G2017</span>
                      </el-col>
                      <el-col :span="10">
                        现入学代码: <span v-text="transactionData.newEntranceCode">G2017</span>
                      </el-col>
                    </el-row>
                    <el-row style="margin:10px 0;">
                      <el-col :span="10">
                        原班级: <span v-text="transactionData.oldClassName">G2017</span>
                      </el-col>
                      <el-col :span="10">
                        现班级: <span v-text="transactionData.newClassName">G2017</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div style="float:right;width: 690px;min-height:30px;">
                          <span class="spanShenqing" v-text="transactionData.applyReason">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
                        </div>
                        <div style="display: inline-block;">申请理由: </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
            <el-button @click="dialogChangeTeacher = false">确定</el-button>
          </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/transactionDetail.js"></script>

