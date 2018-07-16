<template>
<div class="ins-container pd3">
    <div>
      <!-- 搜索栏 -->
      <div class="ins-page-search">
          <div class="ins-search-con">
              <el-select :collapse-tags="true"  placeholder="请选择" style="width:250px;" v-model="currKindergarten">
                  <el-option :key="key" :label="item.projectName" :value="item.projectId" v-for="(item,key) in kindergartenArr">
                  </el-option>
              </el-select>
          </div>
          <div class="ins-search-con">
              <el-button size="medium" style="margin-left: 10px;" type="primary" @click="getPageData()">
                  <span class="el-icon-search">
                  </span>
                  <span>
                      查询
                  </span>
              </el-button>
          </div>
      </div>
    </div>
    <!-- 页面主体 -->
 <el-tabs v-model="tab">
    <el-tab-pane label="责任幼儿园" name="first">  <div class="ins-page-main"><div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <span class="com_fs_4">
                       责任幼儿园统计表
                    </span>
                </span>
            </div>
            <!-- 表格内容 -->
            <div class="com_h_full" style="padding-top:38px">
                <!-- 表格内容 -->
                <el-table class="ins-spe-table" :data="tableData" border>
                    <el-table-column align="center" prop="krtenName" label="幼儿园名称" sortable="" width="200">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="责任督学" prop="superintendentName" show-overflow-tooltip sortable>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="组织与管理范畴" prop="codeOne" show-overflow-tooltip sortable>
                       <template slot-scope="scope">
                         <el-tag size="small" :type="getTagType(scope.row.codeOneSchedule)">{{scope.row.codeOneSchedule}}</el-tag>
                       <el-button type="text" size="small" @click="jumpPage(scope.row.OneitemId,1)">{{scope.row.codeOne}}</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="教与学范畴" prop="codeTwo" show-overflow-tooltip sortable>
                        <template slot-scope="scope">
                         <el-tag size="small" :type="getTagType(scope.row.codeTwoSchedule)">{{scope.row.codeTwoSchedule}}</el-tag>
                       <el-button type="text" size="small" @click="jumpPage(scope.row.TwoitemId,2)">{{scope.row.codeTwo}}</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="幼儿发展范畴" prop="codeThree" show-overflow-tooltip sortable>
                        <template slot-scope="scope">
                        <el-tag size="small" :type="getTagType(scope.row.codeThreeSchedule)">{{scope.row.codeThreeSchedule}}</el-tag>
                       <el-button type="text" size="small" @click="jumpPage(scope.row.ThreeitemId,3)">{{scope.row.codeThree}}</el-button>
                     </template>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="督导日志" prop="logCount" show-overflow-tooltip sortable>
                        <template slot-scope="scope">
                       <el-button type="text" size="small" @click="jumpPage(scope.row,4)">{{scope.row.logCount}}篇</el-button>
                     </template>
</el-table-column>
</el-table>
</div>
</div>
</el-tab-pane>
<el-tab-pane label="其他幼儿园" name="second"><div class="ins-page-main"><div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <span class="com_fs_4">其他幼儿园统计表</span>
                </span>
            </div>
            <!-- 表格内容 -->
            <div class="com_h_full" style="padding-top:38px">
                <!-- 表格内容 -->
                <el-table class="ins-spe-table" :data="tableDataTwo" border>
                    <el-table-column align="center" prop="krtenName" label="幼儿园名称" sortable="" width="200">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="责任督学" prop="superintendentName" show-overflow-tooltip sortable>
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="组织与管理范畴" prop="codeOne" show-overflow-tooltip sortable>
                       <template slot-scope="scope">
                         <el-tag size="small" :type="getTagType(scope.row.codeOneSchedule)">{{scope.row.codeOneSchedule}}</el-tag>
                       <el-button type="text" size="small" @click="jumpPage(scope.row.OneitemId,1)">{{scope.row.codeOne}}</el-button>
                     </template>
</el-table-column>
<el-table-column align="center" header-align="center" label="教与学范畴" prop="codeTwo" show-overflow-tooltip sortable>
    <template slot-scope="scope">
                         <el-tag size="small" :type="getTagType(scope.row.codeTwoSchedule)">{{scope.row.codeTwoSchedule}}</el-tag>
                       <el-button type="text" size="small" @click="jumpPage(scope.row.TwoitemId,1)">{{scope.row.codeTwo}}</el-button>
                     </template>
</el-table-column>
<el-table-column align="center" header-align="center" label="幼儿发展范畴" prop="codeThree" show-overflow-tooltip sortable>
    <template slot-scope="scope">
                        <el-tag size="small" :type="getTagType(scope.row.codeThreeSchedule)">{{scope.row.codeThreeSchedule}}</el-tag>
                       <el-button type="text" size="small" @click="jumpPage(scope.row.ThreeitemId,1)">{{scope.row.codeThree}}</el-button>
                     </template>
</el-table-column>
<el-table-column align="center" header-align="center" label="督导日志" prop="logCount" show-overflow-tooltip sortable>
    <template slot-scope="scope">
                       <el-button type="text" size="small" @click="jumpPage(scope.row.krtenCode,2)">{{scope.row.logCount}}篇</el-button>
                     </template>
</el-table-column>
</el-table>
</div>
</div></el-tab-pane>
</el-tabs>
<!-- 表格 -->
<div class="ins-tab-con">
    <!-- 表格标题+表格功能 -->


</div>
</div>
</template>
<script src="./js/SpecialKindergar.js"></script>
<style scoped>
</style>
