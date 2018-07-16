<template>
  <div class="ins-container pd2">
  <!-- 面包屑导航 -->
  <!-- tab页 -->
<div class="ins-page-search">
    <div class="ins-search-con">
            <el-button type="warning"  plain size="medium" @click="addQuestion()">新建问卷</el-button>
            <el-button type="warning"  plain size="medium" @click="addQuestionTwo()" >创建副本</el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="medium" @click="deleteShowdialog()" >删除</el-button>
            <el-button type="danger" icon="el-icon-download" plain size="medium" @click="downLoad()">下载</el-button>
    </div>
</div>
<el-dialog title="确认删除此问卷" :visible.sync="dialogVisible" width="500px">
        <p class="failInfo">将删除所有用户此问卷已填的相关信息?</p>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteItem()">确定</el-button>
            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
        </span>
</el-dialog>
<el-dialog title="分享问卷" :visible.sync="shareDialog" width="500px">
         <p class="failInfo">
             <!-- <el-input v-model="sharebdUrl" placeholder="请输入内容"></el-input>
             <el-button type="primary" @click="execCommand()">复制</el-button> -->
             <input type="text" id="text" v-model="sharebdUrl" style="width:80%">
            <span slot="footer" class="dialog-footer">
                <el-button @click="copytxt()" size="mini">复制</el-button>
            </span>
         </p>
         <p class="failInfo">注：对象用户可通过链接进入问卷，但无法收集系统外用户的实名。</p>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="shareDialog = false">确定</el-button>
        </span>
</el-dialog>
<el-dialog title="操作提示" :visible.sync="publishDialog" width="500px">
        <p class="failInfo">确认发布此问卷?</p>
         <p class="failInfo">问卷发布后，如有用户填写信息，则不可再更改问卷内容?</p>
        <span slot="footer" class="dialog-footer">
            <el-button @click="publish()">确定</el-button>
            <el-button type="primary" @click="publishDialog = false">取消</el-button>
        </span>
</el-dialog>

<div class="wordPrint" id="wordPrint" style="display:none" >
    <div v-for="(value,key) in getWordList" :key="key">{{value.questionnaireTitle}}
    <div v-if="value.isbr"><br/></div>
    </div>
</div>
 <div class="ins-page-main" style="position: relative;">
   <div class="ins-tab-con">
   <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <span class="com_fs_4">
                        问卷记录列表
                    </span>
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
                    <el-table-column align="center" type="selection"  width="55" :selectable="checkSelectable" class-name="checkbox">
                    </el-table-column>
                    <el-table-column align="center" label="问卷名称" prop="questionnaireTitle" sortable=""  >
                    <template slot-scope="scope">
                         <a style="color:#0095f6;"  @click="goThroughQues(scope.row)">{{ scope.row.questionnaireTitle }}</a>
                    </template>
                    </el-table-column>
                    <el-table-column align="center" label="创建时间" prop="createrDate" sortable=""  >
                    </el-table-column>
                     <el-table-column align="center" label="发布范围" prop="publishRange" sortable=""  >
                    </el-table-column>
                     <el-table-column align="center" label="填写人数" prop="Proportion" sortable=""  >
                        <template slot-scope="scope">
                         <a style="color:#0095f6;"  @click="writeSchedule(scope.row.questionnaireId)">
                            <div class='pFull process' v-if="!scope.row.systemInner"> <span class='pSun' :class="setClass(scope.row.Pnum)"  :style="{width:scope.row.Pnum+'%'}" ></span>{{scope.row.filled+'/'+scope.row.totalNum}}</div>
                             <div class='process' v-if="scope.row.systemInner"> <span class='pSun'></span>{{scope.row.filled }}</div>
                         </a>
                    </template> 
                    </el-table-column>
                    <el-table-column align="center" label="问卷浏览量" prop="questionnairePageviews" sortable=""  >
                    </el-table-column>
                    <el-table-column align="center" label="填写比例" prop="percent" sortable=""  >
                    </el-table-column>
                    <el-table-column align="center" label="平均填写时间" prop="attendanceTime" sortable=""  >
                    </el-table-column>
                    <el-table-column align="center" label="问卷状态" prop="questionnaireStatusTxt" sortable=""  >
                    </el-table-column>
                    <!-- <el-table-column v-for="(v,k) in scrColumn" :key="k" :prop="v.field" align="center" header-align="center" sortable :label="v.text" v-if="scrColumn[k].selected"></el-table-column> -->
                      <el-table-column align="center" label="操作" prop="city" min-width="300">
                        <template slot-scope="scope">
                            <el-button  plain="" size="mini" type="warning" @click="publishShowdialog(scope.row.questionnaireId)"  v-if="scope.row.questionnaireStatus === 0">
                                发布问卷
                            </el-button>
                            <el-button  plain="" size="mini" type="primary" @click="start(scope.row.questionnaireId)"  v-if="scope.row.questionnaireStatus === 2" >
                                开始回收
                            </el-button>
                            <el-button plain="" size="mini" type="success" @click="stop(scope.row.questionnaireId)" v-if="scope.row.questionnaireStatus === 1">
                                暂停回收
                            </el-button>
                            <el-button plain="" size="mini" type="danger"  @click="shareShowdialog(scope.row)" v-if="scope.row.questionnaireStatus === 1">
                                分享
                            </el-button>
                             <el-button plain="" size="mini" type="warning" @click="getCode(scope.row.questionnaireId)" v-if="scope.row.questionnaireStatus === 1">
                                 二维码
                             </el-button>
                        </template>
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
<style scoped>
.pFull {
    width: 100%;
    position: relative;
    z-index: 2;
    background: #ccc;
}
.process {
    cursor: pointer;
}
.pSun {
    min-width: 1px;
    height: 100%; 
    position: absolute;
    left: 0;
    z-index: -1;
    background: #87b7c3; 
}
.Pnumcss33 {
    background: #f4abab;
}
.Pnumcss66 {
    background: #fadeba;
}
.Pnumcss99 {
    background: #c9ec86;
}
.Pnumcss100 {
    background: #c1e7f4;
}
</style>
<script src="./js/questionnaireSurvey.js"></script>