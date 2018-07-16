<template>
<div class="ins-container pd3">
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
                        各学年过程性专项督导统计表
                    </span>
                </span>
            </div>
            <!-- 表格内容 -->
            <div class="com_h_full">
                <!-- 表格内容 -->
                <el-table class="ins-spe-table" :data="tableData" border>
                    <el-table-column align="center" prop="projectName" label="项目名称" sortable="" width="200">
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
    </div>
</div>
</template>
<script src="./js/SpecialKindergarten.js"></script>
<style scoped>
</style>

