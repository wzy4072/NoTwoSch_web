<style scoped>
  .tip,.tip >>> .el-form-item__label{
    color: #fe3b4e;
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'幼儿园通知类型管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
            <el-button type="warning" icon="el-icon-plus" size="small" @click="openLayer(1)" v-show="!deleteData.length">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="openLayer(3)" v-show="deleteData.length">删除</el-button>
          </div>
        </div>
        <div class="ins-page-main">
          <div class="ins-table divide">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>幼儿园通知类型列表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="tab" :printOb="printOb"></tableBar>
              </div>
              <!-- 搜索 -->
              <div class="title-input">
                <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                </el-input>
              </div>
            </div>
            <div class="ins-tab-con">
              <el-table :data="tableData" @selection-change="tabCheck" border height="100%" id="tab" stripe style="width: 100%;height:100%">
                <el-table-column type="selection" align="center" width="50"></el-table-column>
                <el-table-column align="center" type="index" label="序号"  width="80" sortable>
                </el-table-column>
                <el-table-column align="center" label="通知类型" prop="dictValue" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" class="ins-s-p0" size="small" @click="openLayer(2,scope.row)">{{scope.row.dictValue?scope.row.dictValue:'--'}}</el-button>
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
        <el-dialog :title="opaType==1?'新增类型':'编辑类型'" :visible.sync="opaDialog" width="450px">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="通知名称：" prop="informName">
              <el-input :autosize="{ minRows: 4, maxRows: 8}" :type="opaType==1?'textarea':'input'" v-model="ruleForm.informName" placeholder="请输入通知名称"></el-input>
            </el-form-item>
            <el-form-item label="温馨提示："  v-if="opaType==1" class="tip">
              <p>
                支持批量添加，内容需以回车换行分隔，如：<br>
                通知名称1 ‘Enter键’ <br>
                通知名称2
              </p>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="tabOpa">保 存</el-button>
            <el-button @click="opaDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 删除弹窗 -->
        <el-dialog title="操作提示" :visible.sync="deleteDialog" width="450px">
          <p>确认删除该通知类型？</p><p>此操作不可撤销</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialog = false">取 消</el-button>
            <el-button type="primary" @click="tabOpa">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script src="./js/InformType1.js"></script>
