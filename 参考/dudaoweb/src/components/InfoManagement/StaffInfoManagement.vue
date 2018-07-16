<style scoped>
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'教职工信息管理'"></returnBtn>
            <!-- Tabs切换 -->
            <div class="ins-tab-label">
                <el-tabs  v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="0"></el-tab-pane>
                    <el-tab-pane label="任职信息" name="1"></el-tab-pane>
                    <el-tab-pane label="户籍信息" name="2"></el-tab-pane>
                    <el-tab-pane label="全部信息" name="3"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
                <div class="ins-page-btn">
                    <div class="ins-opa-btn">
                        <el-button type="primary" icon="el-icon-upload" size="small" @click="infoImport" v-show="!isDeleshow" >批量导入</el-button>
                        <el-button type="warning" icon="el-icon-upload2" size="small" @click="supplement()" v-show="!isDeleshow">添加教职工</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteShowdialog()" v-show="isDeleshow">删除</el-button>
                    </div>
                </div>
                <div class="ins-page-main">
                    <div class="ins-table divide">
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span>教职工{{tablename}}列表</span>
                            <!-- 复制 打印 -->
                            <div class="tabbar-con">
                                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
                            </div>
                            <!-- 搜索 -->
                            <div class="title-input">
                                <el-input placeholder="请输入内容" v-model="searchstr">
                                </el-input>
                            </div>
                        </div>
                        <div class="ins-tab-con">
                            <el-table :data="tableData" border height="100%" id="a" stripe style="width: 100%;height:100%" @selection-change="handleSelectionChange">
                                <el-table-column align="center" class-name="checkbox" type="selection"  width="55" :selectable="checkSelectable">
                                </el-table-column>
                                <el-table-column align="center" label="姓名" prop="workerName" sortable v-if="scrColumn[0].selected" >
                                <template slot-scope="scope">
                                    <el-button type="text" class="ins-s-p0" size="small" @click="supplement(scope.row)">{{scope.row.workerName}}</el-button>
                                </template>
                                </el-table-column>
                                <el-table-column align="center" label="性别" prop="workerGenderName" sortable v-if="scrColumn[1].selected">
                                </el-table-column>
                                <el-table-column align="center" header-align="center" label="岗位" show-overflow-tooltip prop="workerTypeName" sortable v-if="scrColumn[2].selected">
                                </el-table-column>
                                <el-table-column align="center" label="手机号码" show-overflow-tooltip prop="workerPhone"  v-if="scrColumn[4].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="政治面貌" show-overflow-tooltip prop="politicalOutlookName" v-if="scrColumn[5].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="最高学历" show-overflow-tooltip prop="highestEducationName" v-if="scrColumn[6].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="教学资历" show-overflow-tooltip prop="teaching" v-if="scrColumn[6].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="民族" prop="userNationName"  v-if="scrColumn[7].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="出生日期" show-overflow-tooltip prop="changeUserBirthday"  v-if="scrColumn[8].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="籍贯" show-overflow-tooltip prop="nativeProvinces"  v-if="scrColumn[9].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="证件类型" show-overflow-tooltip prop="certificatesTypeName"  v-if="scrColumn[10].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="证件号码" show-overflow-tooltip prop="certificatesNum"  v-if="scrColumn[11].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="入职日期" show-overflow-tooltip  prop="changeEntryTime"   v-if="scrColumn[12].selected" sortable>
                                </el-table-column>
                                <el-table-column align="center" label="离职日期" show-overflow-tooltip prop="changeDepartureTime"  v-if="scrColumn[13].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="在职时长" show-overflow-tooltip prop="allIntime" v-if="scrColumn[14].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="人员状态" prop="isdeparture"  v-if="scrColumn[15].selected" sortable>
                                </el-table-column>
                                <el-table-column align="center" label="户籍地址" show-overflow-tooltip prop="householdsAddrs"  v-if="scrColumn[16].selected"  sortable>
                                </el-table-column>
                                <el-table-column align="center" label="现居住地址" show-overflow-tooltip prop="addressAddrs"  v-if="scrColumn[17].selected" sortable>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- 分页栏 -->
                        <div class="ins-tab-divide">
                            <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
            <p class="failInfo">确认取消删除?</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteItem()">确定删除</el-button>
                <el-button type="primary" @click="dialogVisible = false">确定取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./js/StaffInfoManagement.js"></script>

