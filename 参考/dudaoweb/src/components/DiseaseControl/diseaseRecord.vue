<style scoped>
</style>
<template>
    <div class="ins-container">
      <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'晨午检记录表'"></returnBtn>
      </div>
      <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
            <el-button @click="addRecord()" type="primary" size="small" style="float:left;margin-right:10px;"  >添加检查记录</el-button>
            <!-- <exportBtn tableId="a" tableName="晨午检记录表" size="small"></exportBtn> -->
          </div>
        </div>
        <div class="ins-page-main">
          <div class="ins-table divide">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>儿童晨检、全日观察及患病情况记录表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="tab" :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
              </div>
              <!-- 搜索 -->
              <div class="title-input">
                <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                </el-input>
              </div>
            </div>
            <div class="ins-tab-con">
              <el-table :data="tableData" height="100%" id="tab" stripe border style="width: 100%;height:100%;">
                <el-table-column align="center" label="检查日期" prop="checkDateStr"  min-width="150" v-if="scrColumn.checkDateStr.selected">
                </el-table-column>
                <el-table-column align="center" label="姓名" prop="studentName" v-if="scrColumn.studentName.selected">
                </el-table-column>
                <el-table-column align="center" label="性别" prop="sex" v-if="scrColumn.sex.selected">
                </el-table-column>
                <el-table-column align="center"  label="年龄" prop="age"  v-if="scrColumn.age.selected">
                </el-table-column>
                <el-table-column align="center" label="家长自述" prop="parentAutobiography" show-overflow-tooltip v-if="scrColumn.parentAutobiography.selected">
                </el-table-column>
                <el-table-column align="center"  label="异常情况" prop="abnormalCondition" show-overflow-tooltip v-if="scrColumn.abnormalCondition.selected">
                </el-table-column>
                <el-table-column align="center"  label="处理意见" min-width="150" prop="handlingOpinionsTxt" show-overflow-tooltip v-if="scrColumn.handlingOpinionsTxt.selected">
                </el-table-column>
                <el-table-column align="center"  label="确诊信息"  prop="infoStr" v-if="scrColumn.infoStr.selected">
                  <template slot-scope="scope">
                      <el-button type="text" class="ins-s-p0" title="点击进行添加" size="medium" @click="handleClick(scope.row)" v-show="scope.row.info=='0'">待添加</el-button>
                      <span v-show="scope.row.info!=='0'">已添加</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150" align="center" v-if="scrColumn.otherField.selected">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)" plain>删除</el-button>
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
        <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
          <p class="failInfo">确认删除?</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditOrBtn(1,'goonFail')">确定删除</el-button>
            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script src="./js/diseaseRecord.js"></script>
