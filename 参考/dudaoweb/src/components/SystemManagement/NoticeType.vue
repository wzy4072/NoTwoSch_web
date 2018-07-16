<style scoped>
    .tip,.tip >>> .el-form-item__label{
        color: #fe3b4e;
    }
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'幼儿园公告类型管理'"></returnBtn>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
        <!-- 按钮 -->
        <div class="ins-page-btn">
            <div class="ins-opa-btn">
                <el-button type="warning" icon="el-icon-plus" size="small" @click="Add('',1)" v-if="count === 0">添加</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="deletDialog=true" v-if="count >= 1">删除</el-button>
            </div>
        </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
            <div class="ins-table divide">
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span>幼儿园公告类型列表</span>
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
                    <el-table :data="tableData" @selection-change="check" border height="100%" id="a" stripe="" style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="center" type="index" label="序号"  v-if="scrColumn[0].selected" width="80">
                        </el-table-column>
                        <el-table-column align="center" label="公告类型" prop="dictValue" sortable v-if="scrColumn[1].selected">
                            <template slot-scope="scope">
                                <el-button type="text" class="ins-s-p0" size="small" @click="name_function(scope.row,2)">{{scope.row.dictValue}}</el-button>
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
            <!-- 弹窗 -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="450px" :before-close="cancel">
                 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="公告名称：" prop="noticeName">
                        <el-input :autosize="{ minRows: 4, maxRows: 8}" :type="type==1?'textarea':'input'" v-model="ruleForm.noticeName" placeholder="请输入公告名称"></el-input>
                    </el-form-item>
                    <el-form-item label="温馨提示："  v-if="type==1" class="tip">
                        <p>
                    支持批量添加，内容需以回车换行分隔，如：<br>
                    公告名称1 ‘Enter键’ <br>
                    公告名称2
                 </p>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="Submit">保 存</el-button>
                    <el-button @click="cancel()">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 删除弹窗 -->
          <el-dialog title="操作提示" :visible.sync="deletDialog" width="30%">
            <span><p>确认删除该公告？</p><p>此操作不可撤销</p></span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deletDialog = false">取 消</el-button>
              <el-button type="primary" @click="deletRow">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        </div>
        </div>
    </div>
</template>
<script src="./js/NoticeType.js"></script>
