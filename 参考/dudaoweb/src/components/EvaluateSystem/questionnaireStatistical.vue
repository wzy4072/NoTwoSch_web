<template>
    <div class="ins-container pd2">
        <div>
            <!-- 通用筛选 -->
            <div class="ins-tab-label">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="问卷报告" name="0"></el-tab-pane>
                    <el-tab-pane label="回答详情" name="1"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- 问卷报告 -->
        <div class="ins-page-main" style="border:none;">
            <!-- 条件筛选部分 -->
            <div class="ins-page-search">
                <div class="ins-search-con com_w_full" style="margin:0px">
                    问卷名称：
                    <el-select placeholder="请选择" style="width:250px;" v-model="requestData.questionnaireId">
                        <el-option :label="item.questionnaireTitle" :value="item.questionnaireId" v-for="item in questionnaireList" :key="item.questionnaireId">
                        </el-option>
                    </el-select>&nbsp;&nbsp; 统计维度：
                    <el-select placeholder="请选择" style="width:250px;" v-model="checkVdoing">
                        <el-option :label="item.name" :value="item.id" v-for="(item,key) in vdoingList" :key="key">
                        </el-option>
                    </el-select>&nbsp;&nbsp;
                    <span v-if="checkVdoing !==null">
                        选择数据：
                        <el-select placeholder="请选择" style="width:250px;" v-model="checkSpecificOption" multiple collapse-tags>
                            <el-option v-for="item in specificOptionList" :key="item.id" :label="item.name" :value="item.id" v-if="checkVdoing===0||checkVdoing===3||checkVdoing===4">
                            </el-option>
                            <el-option v-for="item in specificOptionList" :key="item.krtenCode" :label="item.krtenName" :value="item.krtenCode" v-if="checkVdoing===1">
                            </el-option>
                            <el-option v-for="item in specificOptionList" :key="item.groupId" :label="item.groupName" :value="item.groupId" v-if="checkVdoing===2">
                            </el-option>
                            <el-option v-for="item in specificOptionList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId" v-if="checkVdoing===5||checkVdoing===7||checkVdoing===8">
                            </el-option>
                            <el-option v-for="item in specificOptionList" :key="item.classId" :label="item.className" :value="item.classId" v-if="checkVdoing===6||checkVdoing===9||checkVdoing===10">
                            </el-option>
                        </el-select>
                    </span>
                    <el-button type="success" size="medium" @click="inquireFun" v-if="activeName === '1'">查询</el-button>
                    <span class="com_dpng" v-if="activeName === '1'">
                        过滤重复IP
                        <el-switch v-model="isFilterIp" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>&nbsp;&nbsp;
                        <el-button type="danger" size="medium" @click="batchRemoveFun">删除</el-button>
                    </span>
                </div>
            </div>
            <div class="ins-page-other-search" v-show="activeName==='0'">
                <div class="com_w_full" style="height:32px;margin-bottom:10px;">
                    显示形式：
                    <el-select placeholder="请选择" style="width:250px;" v-model="requestData.requestType">
                        <el-option :label="item.name" :value="item.id" v-for="item in displayFormatList" :key="item.id">
                        </el-option>
                    </el-select>&nbsp;&nbsp; 显示图形
                    <el-switch v-model="isShowPict" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </div>
                <div class="com_w_full" style="height:32px;margin-bottom:10px;" v-for="(item,key) in requestData.screens" :key="key">
                    筛选答案：
                    <el-select placeholder="请选择" style="width:250px;" v-model="item.subjectId">
                        <el-option :label="re.subjectTitle" :value="re.subjectId" v-for="re in subjectList" :key="re.subjectId">
                        </el-option>
                    </el-select>
                    <el-select placeholder="请选择" style="width:250px;" v-model="item.type">
                        <el-option :label="re.name" :value="re.id" v-for="re in containsList" :key="re.id">
                        </el-option>
                    </el-select>
                    <el-select placeholder="请选择" style="width:250px;" v-model="item.answerId">
                        <el-option :label="re.questionAnswer" :value="re.answerId" v-for="re in subjectList.filter(re => { return re.subjectId === item.subjectId}).length>0?subjectList.filter(re => { return re.subjectId === item.subjectId})[0].answerList:[]" :key="re.answerId">
                        </el-option>
                    </el-select>
                    <i class="el-icon-delete" @click="delFilterFun(key)"></i>
                </div>
                <el-button type="primary" size="medium" @click="addFilterFun">添加筛选条件</el-button>
                <el-button type="success" size="medium" @click="inquireFun">查询</el-button>
            </div>
            <!-- 问卷题目答案图表 -->
            <div class="com_ofy_a questionnaire" v-show="activeName==='0'">
                <div class="com_w_full" style="height:50px;text-align:center;padding:10px 0px;font-size:20px;">
                    {{questionnaireName}}
                </div>
                <div v-for="(re,key) in requestData.requestType===1?gatherQuestionList:columnarQuestionList" :key="re.subjectId">
                    <!-- 题目  -->
                    <div class="com_w_full" style="height:40px;line-height:40px;">{{key + 1}}.{{re.subjectType===1?"【单选题】":re.subjectType===2?"【多选题】":re.subjectType===3?"【填空题】":re.subjectType===4?"【打分题】":''}}{{re.subjectTitle}}{{requestData.requestType === 1? '(本题有效填写人次：' + re.fillinCount + ')':''}}</div>
                    <!-- 表格 -->
                    <table cellspacing="0" class="com_table" style="width:80%;" v-if="re.subjectType===1||re.subjectType===2||re.subjectType===4">
                        <thead>
                            <tr>
                                <th v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===1">选项</th>
                                <th v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===1">小计</th>
                                <th v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===1">比例</th>
                                <th v-if="re.subjectType===4 && requestData.requestType===1">平均分</th>
                                <th v-if="re.subjectType===4 && requestData.requestType===1">求和</th>
                                <th v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===2">选项</th>
                                <th v-if="re.subjectType===4 && requestData.requestType===2">分数</th>
                                <th v-for="(v,k) in colTabTheadList" :key="k" v-if="requestData.requestType===2">{{v.name}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(val,key) in re.answers" :key="key" v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===1">
                                <td>{{val.questionAnswer}}</td>
                                <td>{{val.selectCount}}</td>
                                <td>{{val.ratio}}%</td>
                            </tr>
                            <tr v-if="re.subjectType===4 && requestData.requestType===1">
                                <td>{{re.average}}</td>
                                <td>{{re.sum}}</td>
                            </tr>
                            <tr v-for="(val,key) in re.answers" :key="key" v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===2">
                                <td>{{val.questionAnswer}}</td>
                                <td v-for="(v,k) in colTabTheadList" :key="k">
                                    {{val.answerData[v.id].selectCount}}
                                </td>
                            </tr>
                            <tr v-for="(val,key) in re.answers" :key="key" v-if="re.subjectType===4 && requestData.requestType===2">
                                <td>{{val.questionAnswer}}</td>
                                <td v-for="(v,k) in colTabTheadList" :key="k">
                                    {{val[v.id]}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <el-button type="text" @click="detailedAnswerFun(re.subjectId)" v-if="re.subjectType===3||re.subjectType===4">查看本题详细答案</el-button>
                    <!-- 饼图 -->
                    <div :id="'choicePieEchart' + key" style="width: 600px;height:400px;margin:0px auto;" v-if="(re.subjectType===1 || re.subjectType===2) && requestData.requestType===1" v-show="isShowPict===true"></div>
                    <!-- 柱状图 -->
                    <div :id="'choiceBarEchart' + key" style="width: 600px;height:400px;margin:0px auto;" v-if="(re.subjectType===1 || re.subjectType===2 || re.subjectType===4) && requestData.requestType===2" v-show="isShowPict===true"></div>
                </div>
            </div>
            <!-- 回答详情 -->
            <div class="tab" v-show="activeName === '1'">
                <div class="ins-tab-con" style="padding-bottom:0px;">
                    <!-- 表格title -->
                    <div class="ins-tab-title">
                        <span>
                            <span class="el-icon-menu">
                            </span>
                            <span class="com_fs_4">
                                回答详情
                            </span>
                        </span>
                        <!-- 复制 打印 -->
                        <div class="ins-tabbar-con">
                            <tableBar type="export" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
                        </div>
                    </div>
                    <!-- 表格 内容 -->
                    <div class="com_h_full">
                        <el-table id="a" ref="multipleTable" :data="tableData" tooltip-effect="dark" height="100%" style="width: 100%;" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" align="center" fixed="left" @selection-change="handleSelectionChange">
                            </el-table-column>
                            <el-table-column label="操作" width="150" align="center" fixed="left">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="examineFun(scope.row.attendancerecordsId)">查看</el-button>
                                    <el-button size="mini" type="danger" @click="delAnswerFun(scope.row.attendancerecordsId,scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createrDate" label="提交问卷时间" align="center">
                                <template slot-scope="scope">
                                    {{$api.getDateAll(scope.row.createrDate,'-','hms')}}
                                </template>
                            </el-table-column>
                            <el-table-column label="所用时间" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.attendanceTime+'s'}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="createrName" label="名字" align="center">
                            </el-table-column>
                            <!-- <el-table-column prop="requestMac" label="所用设备" align="center" width="250">
                            </el-table-column> -->
                            <el-table-column v-for="(v,k) in tableColumn" :key="k" :prop="v.index" :label="v.value" align="center">
                                
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="详细答案" :visible.sync="dialogVisible" width="80%">
            <el-table :data="detailedAnswerList" border style="width: 100%;margin-top:10px;" height="500">
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column prop="submitTime" label="提交问卷时间" align="center" width="180">
                </el-table-column>
                <el-table-column prop="answer" label="答案" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="姓名" align="center" width="180">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<style scoped>
.ins-page-main>>>.el-input__inner {
  height: 32px;
}
.ins-page-main>>>.el-range-editor.el-input__inner {
  padding: 0px 10px;
}
.ins-page-main>>>.el-date-editor .el-range-input {
  position: relative;
  bottom: 1px;
}
.ins-page-main>>>.el-date-editor.el-range-editor {
  position: relative;
  top: 1px;
}
.com_table th {
  border-top: 1px solid #e5e5e5;
}
.ins-page-other-search {
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 0px;
  font-size: 14px;
}
</style>
<script src="./js/questionnaireStatistical.js"></script>