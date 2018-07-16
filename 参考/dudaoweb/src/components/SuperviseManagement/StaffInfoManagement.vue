<style scoped>
.clear{clear: both;}
</style>
<template>
  <div class="ins-container pd2">
  <!-- 面包屑导航 -->
  <!-- tab页 -->
<div class="ins-tab-label">
  <el-tabs  v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="0"></el-tab-pane>
    <el-tab-pane label="任职信息" name="1"></el-tab-pane>
    <el-tab-pane label="户籍信息" name="2"></el-tab-pane>
    <el-tab-pane label="全部信息" name="3"></el-tab-pane>
  </el-tabs>
</div>
<div class="ins-page-search">
    <div class="ins-search-con">
            <el-button type="primary" icon="el-icon-upload" plain size="mini" @click="infoImport" v-show="!isDeleshow" >导入</el-button>
            <el-button type="warning" icon="el-icon-upload2" plain size="mini" @click="supplement()" v-show="!isDeleshow">补录</el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="deleteItem()" v-show="isDeleshow">删除</el-button>
    </div>
</div>
 <div class="ins-page-main" style="position: relative;">
   <div class="ins-tab-con">
   <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <i class="com_fs_4">
                        教职工{{tablename}}列表
                    </i>
                </span>
                <!-- 复制 打印 -->
                <div class="ins-tabbar-con">
                    <tableBar type="copy,export,refresh,printer" tableId="a" @refresh="refresh" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="com_fr" style="width:200px;">
                    <el-input class="input-with-select" placeholder="请输入内容" v-model="searchstr">
                        <el-button @click="searchFun" icon="el-icon-search" slot="append">
                        </el-button>
                    </el-input>
                </div>
            </div>
                  <!-- 表格内容 -->
            <div class="com_h_full">
                <!-- 表格内容 -->
                <el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%" @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="selection" width="55" :selectable="checkSelectable">
                    </el-table-column>
                    <el-table-column align="center" label="姓名" prop="workerName" sortable="" v-if="scrColumn[0].selected" >
                      <template slot-scope="scope">
                        <el-button @click="supplement(scope.row)" type="text" size="small" prop="workerId">{{scope.row.workerName}}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="性别" prop="workerGenderName" sortable="" v-if="scrColumn[1].selected">
                     <!-- <template slot-scope="scope">{{multipleSelection}}</template>  -->
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="岗位" prop="workerTypeName" show-overflow-tooltip="" sortable="" v-if="scrColumn[2].selected">
                    </el-table-column>
                    <el-table-column align="center" label="任教科目" prop="workerCourseString" v-if="scrColumn[3].selected">
                    </el-table-column>
                    <el-table-column align="center" label="手机号码" prop="workerPhone"  v-if="scrColumn[4].selected">
                    </el-table-column>
                    <el-table-column align="center" label="政治面貌" prop="politicalOutlookName" v-if="scrColumn[5].selected">
                    </el-table-column>
                    <el-table-column align="center" label="最高学历" prop="highestEducationName" v-if="scrColumn[6].selected">
                    </el-table-column>
                    <el-table-column align="center" label="民族" prop="userNationName"  v-if="scrColumn[7].selected">
                    </el-table-column>
                    <el-table-column align="center" label="出生日期" prop="changeUserBirthday"  v-if="scrColumn[8].selected">
                    </el-table-column>
                    <el-table-column align="center" label="籍贯" prop="nativeProvince"  v-if="scrColumn[9].selected">
                    </el-table-column>
                    <el-table-column align="center" label="证件类型" prop="certificatesTypeName"  v-if="scrColumn[10].selected">
                    </el-table-column>
                    <el-table-column align="center" label="证件号码" prop="certificatesNum"  v-if="scrColumn[11].selected">
                    </el-table-column>
                    <el-table-column align="center" label="入职日期"  prop="changeEntryTime"   v-if="scrColumn[12].selected">
                    </el-table-column>
                    <el-table-column align="center" label="离职日期" prop="changeDepartureTime"  v-if="scrColumn[13].selected">
                    </el-table-column>
                    <el-table-column align="center" label="在职时长" prop="allIntime" v-if="scrColumn[14].selected">
                    </el-table-column>
                    <el-table-column align="center" label="人员状态" prop="isdeparture"  v-if="scrColumn[15].selected">
                    </el-table-column>
                    <el-table-column align="center" label="户籍地址" prop="householdsAddr"  v-if="scrColumn[16].selected">
                    </el-table-column>
                    <el-table-column align="center" label="现居住地址" prop="addressAddr"  v-if="scrColumn[17].selected">
                    </el-table-column>
                </el-table>
            </div>
             <!-- 分页栏 -->
            <div class="ins-tab-paging">
                <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
     </div>
 </div>
</div>
</template>
<script src="./js/StaffInfoManagement.js"></script>

