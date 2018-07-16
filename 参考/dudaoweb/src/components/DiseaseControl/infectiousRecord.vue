<style scoped>
</style>
<template>
    <div class="ins-container">
      <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="'幼儿园儿童传染病登记表'"></returnBtn>
      </div>
      <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
            <el-button @click="addRecord()" type="primary" size="small">传染疾病登记</el-button>
            <!-- <exportBtn tableId='a' tableName="儿童传染病登记表"></exportBtn> -->
          </div>
        </div>
        <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
          <p class="failInfo">确认删除?</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditOrBtn(1,'goonFail')">确定删除</el-button>
            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
          </span>
        </el-dialog>
        <div class="ins-page-main">
          <div class="ins-table divide">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>幼儿园儿童传染病登记表</span>
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
              <el-table :data="tableData" height="100%" id="tab" border style="width: 100%;height:100%;">
                <el-table-column align="center" label="姓名" prop="studentName" v-if="scrColumn.studentName.selected">
                </el-table-column>
                <el-table-column align="center" label="性别" prop="sex" v-if="scrColumn.sex.selected">
                </el-table-column>
                <el-table-column align="center"  label="年龄" prop="age"  v-if="scrColumn.age.selected">
                </el-table-column>
                <el-table-column align="center" label="班级" prop="gradeClassName" v-if="scrColumn.gradeClassName.selected">
                </el-table-column>
                <el-table-column align="center"  label="发病日期" min-width="100" prop="diseaseDateStr" v-if="scrColumn.diseaseDateStr.selected">
                </el-table-column>
                <el-table-column align="center"  label="诊断日期" min-width="100" prop="diagnosisDateStr" v-if="scrColumn.diagnosisDateStr.selected" >
                </el-table-column>
                <el-table-column align="center"  label="疾病名称" prop="diseaseName" v-if="scrColumn.diseaseName.selected" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center"  label="确诊单位" prop="diagnosisCompany" v-if="scrColumn.diagnosisCompany.selected" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center"  label="报告日期" min-width="100" prop="reportDateStr" v-if="scrColumn.reportDateStr.selected" >
                </el-table-column>
                <el-table-column align="center"  label="处理办法" prop="treatmentMethodStr" v-if="scrColumn.treatmentMethodStr.selected">
                </el-table-column>
                <el-table-column align="center"  label="返园日期" min-width="100" prop="returnDateStr" v-if="scrColumn.returnDateStr.selected">
                </el-table-column>
                <el-table-column label="操作" min-width="150" v-if="scrColumn.otherField.selected" align="center" >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  </div>
</template>
<script src="./js/infectiousRecord.js"></script>
