<template>
<div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'师资力量监督'"></returnBtn>
        </div>
        <div class="ins-page-con">
        <div class="ins-page-type type1">
      <div class="ins-page-search">
          <div class="ins-search-con">
              统计幼园：
              <el-select size="medium" :collapse-tags="true" multiple placeholder="请选择" style="width:220px;" v-model="currKindergarten">
                  <el-option :key="key" :label="item.krtenName" :value="item.krtenCode" v-for="(item,key) in kindergartenArr">
                  </el-option>
              </el-select>
          </div>
          <div class="ins-search-con">
              统计岗位：
              <el-select size="medium" :collapse-tags="true" multiple placeholder="请选择" style="width:180px;" v-model="currPost">
                  <el-option :key="key" :label="item.DICT_NAME" :value="item.DICT_CODE" v-for="(item,key) in postArr">
                  </el-option>
              </el-select>
          </div>
          <div class="ins-search-con">
              起始时间：
              <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:250px;" type="daterange" v-model="currDate">
              </el-date-picker>
          </div>
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
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>师资力量统计表</span>
                <!-- 复制 打印 -->
                <div class="tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="title-input">
                    <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
                <!-- 表格内容 -->
                <el-table :data="tableData" border id="a" stripe style="width: 100%;height:100%" height="100%" show-summary :summary-method="getSummaries" >
                    <el-table-column align="center" prop="index" label="序号" type="index" sortable  width="100">
                    </el-table-column>
                    <el-table-column align="center" prop="krtenName" v-if="scrColumn.krtenName.selected" label="幼儿园名称" sortable width="200">
                      <template slot-scope="scope">
                       <el-button class="ins-s-p0" type="text" size="small" @click="jumpPage(scope.row.krtenName)">{{scope.row.krtenName}}</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="教职工人数" prop="workerNum" show-overflow-tooltip sortable v-if="scrColumn.workerNum.selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="中专人数" prop="middlezhuanNum" show-overflow-tooltip sortable v-if="scrColumn.middlezhuanNum.selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="大专人数" prop="zhuanNum" show-overflow-tooltip sortable v-if="scrColumn.zhuanNum.selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="本科人数" prop="unversityNum" show-overflow-tooltip sortable v-if="scrColumn.unversityNum.selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="硕士人数" prop="masterNum" show-overflow-tooltip sortable v-if="scrColumn.masterNum.selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="博士人数" prop="doctorNum" show-overflow-tooltip sortable v-if="scrColumn.doctorNum.selected">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="其他" prop="otherNum" show-overflow-tooltip sortable v-if="scrColumn.otherNum.selected">
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
<script src="./js/FacultySupervision.js"></script>
<style scoped>
</style>

