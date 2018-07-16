<style scoped>
  .qual-details .com_table tr:first-child{
    background-color:#DCDFE6
  }
  .qual-details .com_table tr td:first-child{
    width:40%;
  }
  .qual-details>div{
    overflow:auto;
    height: 400px;
  }
</style>
<template>
    <div class="ins-container">
        <!-- 页面主体 -->
      <div class="ins-page-main">
         <!-- 表格 -->
        <div class="ins-tab-con">
            <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <span class="com_fs_4">
                    幼儿园教师资历列表
                    </span>
                </span>
                <!-- 复制 打印 -->
                <div class="ins-tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="com_fr" style="width:200px;">
                    <el-input class="input-with-select" placeholder="请输入内容" v-model="searchstr" clearable>
                        <el-button @click="searchFun" icon="el-icon-search" slot="append">
                        </el-button>
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="com_h_full">
                <!-- 表格内容 -->
                <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%">
                    <el-table-column align="center" label="姓名" sortable="" v-if="scrColumn[0].selected">
                        <template slot-scope="scope">
                       <el-button type="text" size="small" @click="openLayer(scope.row,1)">{{scope.row.workerName}}</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="center" label="性别" sortable="" v-if="scrColumn[1].selected" prop="workerGenderName">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="岗位"  show-overflow-tooltip="" prop="workerTypeName" sortable="" v-if="scrColumn[2].selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="任教科目" prop="courseName" show-overflow-tooltip="" sortable="" v-if="scrColumn[3].selected">
                    </el-table-column>
                    <el-table-column align="center" prop="highestEducationName" header-align="center" label="最高学历" show-overflow-tooltip="" sortable="" v-if="scrColumn[4].selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="相关证书" show-overflow-tooltip="" sortable="" v-if="scrColumn[5].selected">
                      <template slot-scope="scope">
                       <a type="text" v-for="(item,key) in scope.row.qualificationsName" style="color:#409eff;" v-text="!key?item:(','+item)" :key="key" @click="openLayer(scope.row,2)"></a>
                     </template>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="更新时间" prop="modifyDate" show-overflow-tooltip="" sortable="" v-if="scrColumn[6].selected" :formatter="transDate">
                    </el-table-column>
                </el-table>
            </div>
        </div>
      </div>
      <!-- 资历详情layer -->
            <el-dialog title="资历详情" :visible.sync="showLayer1" width="50%" class="qual-details">
                <div>
                <table cellspacing="0" cellpadding="0" class="com_table">
                    <tbody>
                      <tr>
                        <td>项目</td>
                        <td>内容</td>
                      </tr>
                      <tr>
                        <td>幼儿园名称</td>
                        <td>{{currRow.krtenName}}</td>
                      </tr>
                      <tr>
                        <td>姓名</td>
                        <td>{{currRow.workerName}}</td>
                      </tr>
                      <tr>
                        <td>性别</td>
                        <td>{{currRow.workerGenderName}}</td>
                      </tr>
                      <tr>
                        <td>任教科目</td>
                        <td>{{currRow.courseName}}</td>
                      </tr>
                      <tr>
                        <td>最高学历</td>
                        <td>{{currRow.highestEducationName}}</td>
                      </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" class="com_table">
                    <tbody>
                      <tr>
                        <td>证书种类</td>
                        <td>证明文件</td>
                      </tr>
                      <tr v-for="(item,key) in currRow.qualificationsName" :key="key">
                        <td>{{item.split('-')[0]}}</td>
                        <td @click="showLayer2=true" style="color:#409eff;">{{item.split('-')[0]}}</td>
                      </tr>
                    </tbody>
                </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="showLayer1 = false">确认</el-button>
                </span>
            </el-dialog>
            <!-- 证书图片layer -->
            <el-dialog title="相关证书" :visible.sync="showLayer2" width="50%">
                <el-carousel trigger="click" indicator-position="outside" height="500px">
                    <el-carousel-item v-for="(item,key) in currRow.qualificationsName" :key="key">
                        <span>{{item}}</span>
                        <img @click="picture(currRow.qualificationsPath[key])" :src="baseUrl+currRow.qualificationsPath[key].slice(1)" class="com_full">
                        <!-- :src="currRow.qualificationsPath[key]" -->
                        <!-- src="../../../static/images/Koala.jpg" -->
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
    </div>
</template>
<script src="./js/FacultyDetails.js"></script>
