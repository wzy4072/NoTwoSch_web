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
        <returnBtn :title="'任课教师管理'"></returnBtn>
      </div>
      <!-- 搜索栏 -->
      <div class="ins-page-con">
        <div class="ins-page-type type1">
      <div class="ins-page-btn">
        <div class="ins-opa-btn">
          <el-button v-show="editOrBtn===0" @click="showEditOrBtn(0)" type="success" size="small" icon="el-icon-edit">批量编辑</el-button>
          <el-button v-show="editOrBtn===1" @click="showEditOrBtn(1,'save')" type="success" size="small" icon="el-icon-check">保存</el-button>
          <el-button v-show="editOrBtn===1" @click="changeCon" type="danger" size="small" icon="el-icon-close">取消</el-button>
        </div>
      </div>
      <div class="ins-page-main">
        <div class="ins-table">
          <div class="ins-title">
            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png"></span>
            <span>任课教师列表</span>
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
            <el-table :data="tableData" height="100%" id="myTable" stripe :span-method="objectSpanMethod" border style="width: 100%;height:100%;">
              <el-table-column align="center" label="年级代码" prop="gradeCode" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="年级名称" prop="gradeName" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="年级主任" prop="gradeWorkerName" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="班级" prop="className" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="center" label="班级主任" prop="workerName" show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-for="(v,k) in cloums" :key="k" align="center" :label="v.courseName" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-if="showInputOrSpan === 1" size="small" v-model="scope.row['courseWorker' + k]"></el-input>
                  <el-button title="点击进行编辑" type="text" class="ins-s-p0" size="small" @click="changeName(('courseWorker' + k),scope.$index, scope.row,k)" v-if="showInputOrSpan === 0">{{scope.row['courseWorker' + k]?scope.row['courseWorker' + k]:'--'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog title="人员选择" :visible.sync="dialogChangeTeacher" width="800px" height="700px" id="dialogOne">
              <div class="ins-table">
                <div class="ins-title">
                  <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                  <span>待选人员列表</span>
                  <span>
                    （所选人员：
                    <span v-if="chooseUserStatus===0 && chooseUserData" v-text="chooseUserData['courseWorker'+chooseUserIndex]||'暂无选中人员'">
                    </span>
                    <span v-if="chooseUserStatus===1 && changeTeacherName" v-text="changeTeacherName.workerName||'暂无选中人员'">
                    </span>
                    <i v-if="delBtn" class="el-icon-circle-close ins-s-hand" @click="delChangeUser"></i>）
                  </span>
                  <!-- 搜索 -->
                  <div class="title-input">
                    <el-input  placeholder="请输入内容" v-model="subsearchstr" clearable>
                    </el-input>
                  </div>
                </div>
                <div class="ins-tab-con">
                  <el-radio-group class="ins-s-wf">
                    <el-table :data="subTableData" height="300px" border style="width: 100%;height:500px;">
                      <el-table-column align="center" fixed="left" label="-">
                        <template slot-scope="scope">
                          <input type="radio" :name="'teacherName'+scope.$index" @click="linChange(scope.$index,scope.row)" :value="scope.row.workerName" v-model="chooseUserData['courseWorker'+chooseUserIndex]">
                          <!-- <el-radio v-model="chooseUserNum" :label="scope.$index" @click.native="linChange(scope.$index,scope.row)" class="hiddenSpan"></el-radio> -->
                        </template> 
                      </el-table-column>
                      <el-table-column align="center" fixed="left" label="姓名" prop="workerName" sortable >
                      </el-table-column>
                      <el-table-column align="center" label="性别" prop="workerGender" sortable >
                      </el-table-column>
                      <el-table-column align="center" label="岗位" prop="workerType" show-overflow-tooltip sortable>
                      </el-table-column>
                      <el-table-column align="center" label="任教科目" prop="courseName" show-overflow-tooltip sortable>
                      </el-table-column>
                      <el-table-column align="center" label="手机号码" prop="workerPhone" show-overflow-tooltip sortable>
                      </el-table-column>
                    </el-table>
                  </el-radio-group>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="saveTeacher">保存</el-button>
                <el-button type="primary" @click="close">取消</el-button>
              </span>
          </el-dialog>
          <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
        <p class="failInfo">取消后已填内容不会被保存</p>
        <p class="failInfo">确认取消编辑?</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEditOrBtn(1,'goonFail')">确定取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">继续编辑</el-button>
        </span>
      </el-dialog>
        </div>
      </div>
    </div>
    </div>
    </div>
</template>
<script src="./js/CourseTeachersManagement.js"></script>
