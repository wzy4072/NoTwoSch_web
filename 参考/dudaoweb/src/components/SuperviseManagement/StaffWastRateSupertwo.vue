<template>
   <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'教职工流失率监督'"></returnBtn>
        </div>
        <div class="ins-page-con">
        <div class="ins-page-type type1">
         <!-- 搜索栏 -->
         <div class="ins-page-search">
            <div class="ins-search-con">
               统计幼园：
               <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择" style="width:220px;" v-model="currKindergarten">
                     <el-option :key="key" :label="item.krtenName" :value="item.krtenCode" v-for="(item,key) in kindergartenArr">
                     </el-option>
               </el-select>
            </div>
            <div class="ins-search-con" >
               统计岗位：
               <el-select size="medium" :collapse-tags="true" multiple="" placeholder="请选择" style="width:180px;" v-model="currPost">
                     <el-option :key="key" :label="item.DICT_NAME" :value="item.DICT_CODE" v-for="(item,key) in postArr">
                     </el-option>
               </el-select>
            </div>
            <div class="ins-search-con" >
               统计时间：
               <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:250px;" type="daterange" v-model="currDate">
               </el-date-picker>
            </div>
            <!-- 按钮 查询 -->
            <div class="ins-opa-btn">
               <el-button size="small" type="primary" @click="getPageData()">
                   <span class="el-icon-search">
                   </span>
                   <span>
                       查询
                   </span>
               </el-button>
            </div>
        </div>
      <!-- 页面主体 -->
      <div class="ins-page-main">
         <!-- 表格 -->
        <div class="ins-table divide">
            <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                <span>教职工流失率统计列表</span>
                <!-- 复制 打印 -->
                <div class="tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="title-input">
                    <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
               <el-table show-summary :summary-method="getSummaries" :data="tableData" border id="a" stripe style="width: 100%;height:100%" height="100%">
                  <el-table-column align="center" label="序号"  sortable="" width="80" type="index" prop="index">
                  </el-table-column>
                  <el-table-column align="center" label="学校名称" prop="krtenName" sortable="" v-if="scrColumn[0].selected">
                  </el-table-column>
                  <el-table-column align="center" label="期初员工人数" prop="start" sortable="" v-if="scrColumn[1].selected">
                  </el-table-column>
                  <el-table-column align="center" label="期末原员工人数" prop="end" sortable="" v-if="scrColumn[2].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期员工增加人数" prop="come" sortable="" v-if="scrColumn[3].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期员工流失人数" prop="go" sortable="" v-if="scrColumn[4].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期员工流失率" prop="liushilvRate" sortable="" v-if="scrColumn[5].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期流动总量流动率" prop="ldzlliushilvRate" sortable="" v-if="scrColumn[6].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期流动差量流动率" prop="ldclliushilvRate" sortable="" v-if="scrColumn[7].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期流出量流动率" prop="lclliudonglvRate" sortable="" v-if="scrColumn[8].selected">
                  </el-table-column>
                  <el-table-column align="center" label="本期流进量流动率" prop="ljlliudonglvRate" sortable="" v-if="scrColumn[9].selected">
                  </el-table-column>
               </el-table>
            </div>
            <!-- 分页栏 -->
            <div class="ins-tab-divide">
                <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[20,50,150,200]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
         </div>
      </div>
      </div>
      </div>
   </div>
</template>
<script src="./js/StaffWastRateSupertwo.js"></script>
