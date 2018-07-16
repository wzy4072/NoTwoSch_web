<template>
    <div class="ins-container pd2">
        <div>
            <div class="ins-page-search">
                <el-button size="medium" type="primary" @click="newGroupFun">新建分组</el-button>
                <el-button size="medium" type="danger" @click="batchDelGroupFun">删除</el-button>
            </div>
        </div>
        <div class="ins-page-main" style="padding-bottom:40px;">
            <div class="ins-tab-title" style="position:static;">
                <span class="el-icon-menu"></span>
                <span class="com_fs_4">问卷人员分组</span>
            </div>
            <div class="com_full com_ofy_a" style=" padding:25px;">
                <el-row>
                    <el-col :span="8" v-for="(v,k) in maindata" :key="v.groupId">
                        <el-card class="box-card" style="margin:10px;">
                            <div slot="header" class="clearfix">
                                <el-checkbox v-model="v.check">{{v.groupName}}</el-checkbox>
                                <i class="el-icon-delete" @click="deleteGroupFun(v.groupId,k)" style="float: right; padding: 3px 5px;color: #606266;"></i>
                                <i class="el-icon-edit" @click="editGroupFun(v)" style="float: right; padding: 3px 5px;color: #606266;"></i>
                            </div>
                            <span v-for="(val,key) in v.sonList" :key="key" class="text item">
                                {{val.name}}{{key=== v.sonList.length-1?'':';'}}
                            </span>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="1000px">
            <el-row :gutter="20">
                <el-col :span="14">
                    <div style="height:400px;padding-bottom:50px;">
                        <div class="com_w_full" style="height:40px;line-height:40px;">
                            分组名称：
                            <el-input placeholder="请输入，最多可输入15字"  v-model="groupData.groupName" :maxlength="15" clearable style="width:475px;">
                            </el-input>
                        </div>
                        <div class="ins-tab-con" style="margin-top:10px;padding-bottom:0px;">
                            <div class="ins-tab-title">
                                <span>
                                    <span class="el-icon-menu">
                                    </span>
                                    <span class="com_fs_4">
                                        已选组员名单
                                    </span>
                                </span>
                            </div>
                            <div class="com_h_full com_ofy_a" style="border:1px solid #dcdfe6;">
                                <el-table :data="groupData.people" border style="width: 100%">
                                    <el-table-column prop="name" label="姓名" align="center">
                                    </el-table-column>
                                    <el-table-column prop="address" label="操作" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="danger" size="medium" @click="delGroupMenberFun(scope.row,scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div style="height:400px;padding-bottom:50px;">
                        <div class="com_w_full" :class="{active:dialogVisible1}" @click="dialogVisible1=true;manualInput=''" style="height:40px;line-height:40px;text-align:center;border:1px solid #dcdfe6;border-radius: 4px;">
                            手动添加组员
                        </div>
                        <div class="com_full" style="margin-top:10px;padding-bottom:40px;border:1px solid #dcdfe6;">
                            <div class="ins-tab-title" style="position:static;">
                                <span>
                                    <span class="el-icon-menu">
                                    </span>
                                    <span class="com_fs_4">
                                        候选名单
                                    </span>
                                </span>
                            </div>
                            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                            </el-input>
                            <el-tree class="filter-tree com_ofy_a" style="height:260px;" :data="treeData" node-key="currentId" :default-checked-keys="checkTreeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree" @check="treeNodeCheckFun" show-checkbox>
                            </el-tree>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogComfireFun">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="手动添加组员" :visible.sync="dialogVisible1" width="500px">
            <el-input type="textarea" :rows="4" placeholder="手动输入的每个人名以回车换行，支持从excel中复制" v-model="manualInput">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="addDialogComfireFun">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style scoped>
.active {
  background-color: #67c23a;
  color: #fff;
}
</style>
<script src="./js/groupPeople.js"></script> 