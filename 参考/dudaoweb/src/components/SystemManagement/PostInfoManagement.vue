<style scoped>
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'系统岗位信息管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
            <el-button type="warning" icon="el-icon-plus" size="small" @click="Add" v-if="count === 0">添加</el-button>
            <el-button type="success" icon="el-icon-edit" size="small" @click="dialogVisible = true" v-if="count === 1">
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="dialogVisible1=true" v-if="count >= 1">
              删除
            </el-button>
          </div>
        </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
          <div class="ins-table divide">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>岗位信息列表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"></tableBar>
              </div>
              <!-- 搜索 -->
              <div class="title-input">
                <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                </el-input>
              </div>
            </div>
            <div class="ins-tab-con">
              <!-- 表格内容 -->
              <el-table :data="tableData" ref="multipleTable" @selection-change="check" border height="100%" id="a"
                        stripe style="width: 100%;height:100%">
                <el-table-column type="selection" align="center" width="50"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column align="center" label="岗位名称" prop="dictValue" sortable>

                  <template slot-scope="scope">
                    <template v-if="fixation.indexOf(scope.row.dictValue)===-1">
                      <el-button type="text" class="ins-s-p0" size="small" @click="name_function(scope.row)">
                        {{scope.row.dictValue}}
                      </el-button>
                    </template>
                    <template v-else>{{scope.row.dictValue}}</template>
                  </template>

                </el-table-column>
              </el-table>
            </div>
            <!-- page divide -->
            <div class="ins-tab-divide">
              <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total"
                             @current-change="handleCurrentChange" @size-change="handleSizeChange"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
          </div>
          <!-- 弹窗 -->
          <el-dialog title="岗位名称" :visible.sync="dialogVisible" width="40%" :before-close="cancel">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="岗位名称：" prop="postName">
                <el-input v-model="ruleForm.postName" maxlength="10" placeholder="请输入岗位名称"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="Submit">保存</el-button>
          <el-button size="small" @click="cancel()">取 消</el-button>
        </span>
          </el-dialog>
          <!-- 删除弹窗 -->
          <el-dialog title="操作提示" :visible.sync="dialogVisible1" width="30%">
            <span><p>确认删除该教职人员？</p><p>此操作不可撤销</p></span>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible1 = false">取 消</el-button>
          <el-button size="small" type="primary" @click="deletRow">确 定</el-button>
        </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/PostInfoManagement.js"></script>


