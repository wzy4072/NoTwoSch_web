<style scoped>
/* 轮播图 */
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
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'资历查看'"></returnBtn>
        </div>
              <div class="ins-page-con">
        <div class="ins-page-type type1">
          <!-- 按钮 -->
          <div class="ins-page-btn">
                <div class="ins-opa-btn">
                    <el-button icon="el-icon-plus" @click="feedback" size="small" type="warning">反馈</el-button>
                </div>
          </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
            <div class="ins-table divide">
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span>教职工资历信息列表</span>
                    <!-- 复制 打印 -->
                    <div class="tabbar-con">
                        <tableBar type="copy,export,printer" tableId="a"  :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                    </div>
                    <!-- 搜索 -->
                    <div class="title-input">
                        <el-input class="input-with-select" placeholder="请输入内容" v-model="searchstr" clearable>
                        </el-input>
                    </div>
                </div>
                <!-- 表格内容 -->
                <div class="ins-tab-con">
                    <!-- 表格内容 -->
                    <el-table :data="tableData" @selection-change="check" border height="100%" id="a" stripe style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="left" label="姓名" prop="workerName" sortable v-if="scrColumn.workerName.selected" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" class="ins-s-p0" size="small" @click="show2(scope.row)">{{scope.row.workerName}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="性别" prop="workerGenderName"  sortable v-if="scrColumn.workerGenderName.selected">
                        </el-table-column>
                        <el-table-column align="left" label="岗位" prop="workerTypeName" sortable  v-if="scrColumn.workerTypeName.selected">
                        </el-table-column>
                        <el-table-column align="left" label="教学资历"  prop="teaching"  v-if="scrColumn.teaching.selected">
                        </el-table-column>
                        <el-table-column align="left" label="最高学历" prop="highestEducationName" sortable v-if="scrColumn.highestEducationName.selected">
                        </el-table-column>
                        <el-table-column align="left" label="相关证书" sortable min-width="400" show-overflow-tooltip v-if="scrColumn.qualificationsName.selected">
                        <template slot-scope="scope">
                            <span class="ins-s-hand ins-s-fs-small" v-text="scope.row.qualificationsName" style="color:#409EFF;" @click="certificateClickFn(scope.row.qualificationsArr)"></span>
                            <!-- <a v-for="(v,k) in scope.row.qualificationsArr" :key="k" @click="certificateClickFn(scope.row.qualificationsArr)" style="color:#409eff;">{{v.qualificationsName+ '.png'+';'}}</a> -->
                        </template>
                        </el-table-column>
                        <el-table-column align="left" min-width="110" label="更新时间" prop="educationUpdateDate" sortable v-if="scrColumn.educationUpdateDate.selected">
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页栏 -->
                <div class="ins-tab-divide">
                    <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
            </div>
            <!-- 反馈意见弹窗 -->
            <el-dialog title="反馈" :visible.sync="dialogVisible" width="40%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="反馈内容：" prop="textarea">
                        <el-input placeholder="请输入反馈内容" type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="ruleForm.textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式：" prop="number">
                        <el-input placeholder="请输入联系方式" v-model="ruleForm.number"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="Opinion" size="small">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 弹窗个人详情窗口 -->
            <el-dialog title="资历详情" :visible.sync="dialogVisible2" width="40%" style="height:85%">
                <el-table class="ins-s-mb-10" :data="detailsData" border style="width:100%;">
                    <el-table-column prop="name" align="center" label="项目"></el-table-column>
                    <el-table-column prop="value" align="center" label="内容"></el-table-column>
                </el-table>
                <el-table :data="gridData" border style="width:100%;">
                    <el-table-column prop="type" align="center" label="证书种类"></el-table-column>
                    <el-table-column prop="name" align="center" label="证明文件"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="medium" @click="dialogVisible2=false">返 回</el-button>
                </span>
            </el-dialog>

     <!-- 证书图片显示窗口 -->
    <el-dialog title="相关证书" :visible.sync="showpic" width="50%" @close="handleClose">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item v-for="(item,key) in pictureData" :key="key">
                        <div class="pic-con">
                          <p>{{item.qualificationsName}}</p>
                          <div class="ins-s-hf">
                            <!-- <img @click="picture(item.url)" src="../../../static/images/Koala.jpg" class="ins-s-wf"> -->
                            <img @click="showLargerFn(item)" :src="$api.baseUrl + 'baseInfo/stuInfo/downLoadImg?url=' + item.qualificationsPath.slice(1)">
                          </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>

        </div>
    </div>
        </div>
        </div>
    
</template>
<script src="./js/AptitudeCheck.js"></script>


