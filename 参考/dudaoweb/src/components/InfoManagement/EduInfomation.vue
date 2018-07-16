<style scoped>
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'教育局用户信息管理'"></returnBtn>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
                <div class="ins-page-btn">
                    <div class="ins-opa-btn">
                        <el-button type="warning" icon="el-icon-plus" size="small" @click="addUser()">添加信息</el-button>
                        <el-button type="primary" icon="el-icon-upload" size="small" @click="infoImport">批量导入</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="multipleSelection.length===0?$message.error('请选择要删除的项'):dialogVisible=true" >删除</el-button>
                    </div>
                </div>
                <div class="ins-page-main">
                    <div class="ins-table divide">
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span>教育局用户信息列表</span>
                            <!-- 复制 打印 -->
                            <div class="tabbar-con">
                                <tableBar type="copy,export,printer" tableId="a"  :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                            </div>
                            <!-- 搜索 -->
                            <div class="title-input">
                                <el-input class="input-with-select" placeholder="请输入内容" v-model="searchstr">
                                </el-input>
                            </div>
                        </div>
                        <div class="ins-tab-con">
                            <el-table :data="tableData" border height="100%" id="a" stripe style="width: 100%;height:100%" @selection-change="handleSelectionChange">
                                <el-table-column align="center" class-name="checkbox" type="selection"  width="55" :selectable="checkSelectable">
                                </el-table-column>
                                <el-table-column align="center" label="姓名" prop="superintendentName" sortable v-if="scrColumn.superintendentName.selected" >
                                    <template slot-scope="scope">
                                        <el-button type="text" class="ins-s-p0" size="small" @click="editComfrim(scope.row)">{{scope.row.superintendentName}}</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="性别" prop="superintendentGenderText" sortable v-if="scrColumn.superintendentGenderText.selected">
                                </el-table-column>
                                <el-table-column align="center" label="职务" show-overflow-tooltip prop="superintendentPositionName" sortable v-if="scrColumn.superintendentPositionName.selected">
                                </el-table-column>
                                <el-table-column align="center" label="手机号码" show-overflow-tooltip prop="superintendentTel" sortable v-if="scrColumn.superintendentTel.selected">
                                </el-table-column>
                                <el-table-column align="center" label="证件类型"  prop="certificatesTypetxt" sortable v-if="scrColumn.certificatesTypetxt.selected">
                                </el-table-column>
                                <el-table-column align="center" label="证件号码" show-overflow-tooltip prop="certificatesNum" sortable v-if="scrColumn.certificatesNum.selected">
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- page divide -->
                        <div class="ins-tab-divide">
                            <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
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
        </div> 
    </div> 
</template>
<script src="./js/EduInfomation.js"></script>