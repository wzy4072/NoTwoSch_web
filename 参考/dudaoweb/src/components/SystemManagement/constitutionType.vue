<style scoped>
.tip,.tip >>> .el-form-item__label{
    color: #fe3b4e;
}
.tip {
  line-height: 1.5;
  margin-top: 8px;
}
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'幼儿园上传资料列表'"></returnBtn>
        </div>
            <div class="ins-page-con">
            <div class="ins-page-type type1">
            <div class="ins-page-btn">
                <div class="ins-opa-btn">
                    <el-button type="warning" icon="el-icon-plus" size="small" @click="Add('',1)" v-if="count === 0">添加</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deletDialog=true" v-if="count >= 1">删除</el-button>
                </div>
            </div>
        <div class="ins-page-main">
            <div class="ins-table divide">
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span>幼儿园上传资料列表</span>
                    <!-- 复制 打印 -->
                    <div class="tabbar-con">
                        <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"></tableBar>
                    </div>
                    <!-- 搜索 -->
                    <div class="title-input">
                        <el-input  placeholder="请输入内容" v-model="searchstr" clearable>
                        </el-input>
                    </div>
                </div>
                <div class="ins-tab-con">
                    <!-- 表格内容 -->
                    <el-table :data="tableData" @selection-change="check" border height="100%" id="a" stripe="" style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="center" type="index" label="序号"  width="80">
                        </el-table-column>
                        <el-table-column align="center" label="资料名称" prop="dictName" sortable>
                            <template slot-scope="scope">
                                <el-button type="text" class="ins-s-p0" size="small" @click="name_function(scope.row,2)">{{scope.row.dictName}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="资料上传说明" prop="dictValue">
                        </el-table-column>
                        <el-table-column align="center" label="资料模板">
                          <template slot-scope="scope">
                            <el-button icon="el-icon-view" plain size="mini" type="success" @click="name_function2(scope.row)">模板管理</el-button>
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
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
                    <el-form-item label="资料名称：" prop="constitutionName">
                        <el-input :autosize="{ minRows: 4, maxRows: 8}" type="input" v-model="ruleForm.constitutionName" placeholder="请输入章程名称"></el-input>
                    </el-form-item>
                    <el-form-item label="资料上传说明：" prop="constitutionContent">
                      <el-input :autosize="{ minRows: 4, maxRows: 8}" :type="type==1?'textarea':'input'" v-model="ruleForm.constitutionContent"
                                placeholder="如需描述资料上传内容需求，请在此描述"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="Submit">保 存</el-button>
                    <el-button @click="cancel()">取 消</el-button>
                </span>
            </el-dialog>
            <el-dialog title="模板管理" :visible.sync="dialogVisible2" width="45%">
              <el-form label-width="100px">
                <el-form-item label="模板列表：" :prop="JSON.stringify(atts)">
                  <el-upload :action="baseUrl+'baseInfo/dictConf/uploadFile'"
                             :headers="{'authorization':token}"
                             :on-preview="downloadAttr"
                             :on-remove="handleRemove"
                             :before-remove="beforeRemove"
                             :limit="20"
                             :on-success="handleSuccess"
                             :on-exceed="handleExceed"
                             :file-list="atts"
                             name="FILE">
                    <el-button size="mini" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">最多20个，每个小于10MB，格式（.jpg.png.doc.docx.ppt.pptx.txt.xlsx.xls.pdf）</div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-dialog>
            <!-- 删除弹窗 -->
          <el-dialog title="操作提示" :visible.sync="deletDialog" width="30%">
            <span><p>确认删除该章程？</p><p>此操作不可撤销</p></span>
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
<script src="./js/constitutionType.js"></script>
