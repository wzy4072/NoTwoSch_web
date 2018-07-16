<style scope>
.tip,.tip >>> .el-form-item__label{
    color: #fe3b4e;
}
</style>
<template>
<div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'系统年级信息管理'"></returnBtn>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
                <div class="ins-page-btn">
                <div class="ins-opa-btn">
            <el-button icon="el-icon-plus" size="small" type="primary" :disabled="selectedTemp.length >= 1" @click="openLayer(1)">添加常规年级</el-button>
            <el-button icon="el-icon-plus" size="small" type="warning" :disabled="selectedTemp.length >= 1" @click="openLayer(2)">添加混龄年级</el-button>
            <el-button icon="el-icon-edit" size="small" type="success" :disabled="selectedTemp.length !== 1" @click="editFun">编辑</el-button>
            <el-button icon="el-icon-delete" size="small" type="danger" :disabled="selectedTemp.length==0" @click="deleteFun">删除</el-button>
        </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-main">
        <!-- 表格 -->
        <div class="ins-table divide">
            <!-- 表格标题+表格功能 -->
            <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span>年级信息列表</span>
                <!-- 复制 打印 -->
                <div class="tabbar-con">
                    <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"></tableBar>
                </div>
                <!-- 搜索 -->
                <div class="title-input">
                    <el-input placeholder="请输入内容" v-model="searchstr">
                    </el-input>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
                <!-- 表格内容 -->
                <el-table :data="tableData" border height="100%" stripe style="width: 100%;height:100%" @selection-change="selectData">
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column prop="orderId" align="center" sortable label="年级序号"></el-table-column>
                    <el-table-column prop="gradeType" align="center" sortable label="年级类型"></el-table-column>
                    <el-table-column prop="dictName" align="center" sortable label="年级名称"></el-table-column>
                </el-table>
            </div>
            <!-- page divide -->
            <div class="ins-tab-divide">
                <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
            <el-dialog :title="selectedTemp.length?'编辑常规年级':'添加常规年级'" :visible.sync="addLayer1" width="450px" :before-close="cancel">
                <el-form ref="commonForm" :model="commonForm" :rules="commonRules" label-width="100px">
                    <el-form-item label="年级序号：" prop="gradeIndex">
                        <el-input placeholder="请输年级序号（正整数）" v-model="commonForm.gradeIndex"></el-input>
                    </el-form-item>
                    <el-form-item label="年级名称：" prop="gradeName">
                        <el-input placeholder="请输入常规年级名称" v-model="commonForm.gradeName"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="addGrade">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="selectedTemp.length?'编辑混龄年级':'添加混龄年级'" :visible.sync="addLayer2" width="450px" :before-close="cancel">
                <el-form ref="mixAgeForm" :model="mixAgeForm" :rules="mixAgeRules" label-width="100px">
                    <el-form-item label="年级名称：" prop="mixAgeGradeName">
                        <el-input placeholder="请输入混龄年级名称" v-model="mixAgeForm.mixAgeGradeName"></el-input>
                    </el-form-item>
                    <el-form-item label="温馨提示：" class="tip">
                        <p>混龄年级只能添加一个</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="addGrade">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
    </div>
    </div>
</div>
</template>
<script src="./js/gradeInfoManagement.js"></script>
