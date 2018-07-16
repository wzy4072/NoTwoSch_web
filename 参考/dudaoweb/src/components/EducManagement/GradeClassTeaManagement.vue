<style scoped>
  .failInfo{
    text-align: center;
    font-size: 20px;
    margin: 20px 0;
  }
  /* 解决编辑状态下无纵向滚动条 */
  .el-table >>> .el-table__body-wrapper{
    overflow-y: auto;
  }
</style>
<template>
    <div class="ins-container">
      <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'年级班级主任管理'"></returnBtn>
      </div>
      <!-- 搜索栏 -->
      <div class="ins-page-con">
        <div class="ins-page-type type1">
      <div class="ins-page-btn">
        <div class="ins-opa-btn">
          <el-button v-show="!isHideEdit" @click="isHideEdit = true;showInputOrSpan = true" type="success" size="small" icon="el-icon-edit">批量编辑</el-button>
          <el-button v-show="isHideEdit" @click="showEditOrBtn(1)" type="success" size="small" icon="el-icon-check">保存</el-button>
          <el-button v-show="isHideEdit" @click="dialogCancelEdit=true" type="danger" size="small" icon="el-icon-close">取消</el-button>
        </div>
      </div>
      <!-- 页面主体 -->
      <div class="ins-page-main">
        <div class="ins-table">
          <div class="ins-title">
            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png"></span>
            <span>年级班级主任列表</span>
            <!-- 复制 打印 -->
            <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="myTable" :printOb="printOb"></tableBar>
            </div>
            <!-- 搜索 -->
            <div class="title-input" style="width:300px;">
                <el-input placeholder="请输入年级代码、年级名称、年级主任" v-model="searchstr" clearable>
                </el-input>
            </div>
          </div>
          <!-- 表格内容 -->
          <div class="ins-tab-con">
            <el-table :data="tableData" height="100%" id="myTable" :span-method="objectSpanMethod" border stripe style="width: 100%;height:100%;">
              <el-table-column align="center" label="年级代码" prop="gradeCode">
              </el-table-column>
              <el-table-column align="center" label="年级名称" prop="gradeName">
              </el-table-column>
              <el-table-column align="center" label="年级主任" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-if="showInputOrSpan" size="small" v-model="scope.row.gradeDean" class="inputMeStyle"></el-input>
                  <el-button title="点击进行编辑" type="text" class="ins-s-p0" size="small" @click="editName('gradeDean',scope.$index, scope.row)" v-if="!showInputOrSpan">{{scope.row.gradeDean?scope.row.gradeDean:'--'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" label="班级" prop="className" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="主班教师" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-if="showInputOrSpan" size="small" v-model="scope.row.classTeach"></el-input>
                  <el-button title="点击进行编辑" type="text" class="ins-s-p0" size="small" @click="editName('classTeach',scope.$index, scope.row)" v-if="!showInputOrSpan">{{scope.row.classTeach?scope.row.classTeach:'--'}}</el-button>
                </template>
              </el-table-column>
               <el-table-column align="center" label="副班教师"  show-overflow-tooltip>
               <template slot-scope="scope">
                  <el-input v-if="showInputOrSpan" size="small" v-model="scope.row.viceClass"></el-input>
                  <el-button title="点击进行编辑" type="text" class="ins-s-p0" size="small" @click="editName('viceClass',scope.$index, scope.row)" v-if="!showInputOrSpan">{{scope.row.viceClass?scope.row.viceClass:'--'}}</el-button>
                </template>
              </el-table-column>
                <el-table-column align="center" label="保育员"  show-overflow-tooltip>
                  <template slot-scope="scope">
                  <el-input v-if="showInputOrSpan" size="small" v-model="scope.row.governess"></el-input>
                  <el-button title="点击进行编辑" type="text" class="ins-s-p0" size="small" @click="editName('governess',scope.$index, scope.row)" v-if="!showInputOrSpan">{{scope.row.governess?scope.row.governess:'--'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-dialog title="操作提示" :visible.sync="dialogCancelEdit" width="500px">
        <p class="failInfo">取消后已填内容不会被保存</p>
        <p class="failInfo">确认取消编辑?</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFun">确定取消</el-button>
          <el-button type="primary" @click="dialogCancelEdit = false">继续编辑</el-button>
        </span>
      </el-dialog>
          <el-dialog title="人员选择" :visible.sync="dialogChangeTeacher" width="700px" id="dialogOne">
            <div class="ins-table">
              <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>待选人员列表</span>
                <span>（当前所选人员：
                  <span>
                    <span>{{subCurrCheck.workerName?subCurrCheck.workerName:'暂无选中人员'}}</span>
                    <i class="el-icon-circle-close ins-s-hand" v-show="subCurrCheck.workerName" @click="subCurrCheck={}"></i>
                  </span>）
                </span>
                <!-- 搜索 -->
                <div class="title-input">
                  <el-input  placeholder="请输入内容" v-model="subsearchstr" clearable>
                  </el-input>
                </div>
              </div>
              <div class="ins-tab-con">
                <el-radio-group v-model="subCurrCheck.workerName" class="ins-s-wf">
                <el-table :data="subTableData" height="400px" border style="width: 100%;height:400px;">
                  <el-table-column align="left" label="姓名">
                    <template slot-scope="scope">
                      <span @click="subCurrCheck = Object.assign({},scope.row)">
                        <el-radio :label="scope.row.workerName">{{scope.row.workerName}}</el-radio>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="性别" prop="workerGender" sortable >
                  </el-table-column>
                  <el-table-column align="left" label="岗位" prop="workerType" show-overflow-tooltip sortable>
                  </el-table-column>
                  <el-table-column align="left" label="手机号码" prop="workerPhone" show-overflow-tooltip sortable>
                  </el-table-column>
                </el-table>
                </el-radio-group>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="savePersonSet">保存</el-button>
              <el-button type="primary" @click="dialogChangeTeacher = false">取消</el-button>
            </span>
          </el-dialog>
    </div>
    </div>
    </div>
</template>
<script src="./js/GradeClassTeaManagement.js"></script>
