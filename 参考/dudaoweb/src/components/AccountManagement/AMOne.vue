<style scoped></style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'账户管理（区管理员）'"></returnBtn>
            <!-- Tabs切换 -->
            <div class="ins-tab-label">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="教职工" name="1"></el-tab-pane>
                    <el-tab-pane label="家长" name="2"></el-tab-pane>
                    <el-tab-pane label="教育局" name="3"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- 搜索栏 -->
      <div class="ins-page-con">
        <div class="ins-page-type type1">
        <div class='ins-page-search'>
            <div class='ins-search-con'>
                <!-- 选择幼儿园 查询条件： -->
                <span v-if="activeName!=3">幼儿园：</span>
                <el-select size="medium" v-if="activeName!=3"  v-model="Kindergarten" placeholder="请选择幼儿园">
                    <el-option  v-for="(item,key) in options" :key="key" :label="item.krtenName" :value="item.krtenCode">
                    </el-option>
                </el-select>
                <!-- 教职工筛选条件 -->
                <span v-show="work_show">筛选条件：</span>
                <el-select v-show="work_show" style="width:160px;" size="medium" @change="filter" clearable  v-model="workType" placeholder="岗位">
                    <el-option v-for="(item,key) in work_options" :key="key" :label="item.DICT_NAME" :value="item.DICT_CODE">
                    </el-option>
                </el-select>
                <el-select size="medium" @change="filter" clearable v-show="work_show" v-model="isBinding" style="width:130px;" placeholder="微信绑定状态">
                    <el-option v-for="item in Binding_options" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 家长 筛选条件 -->
                <span v-show="class_show">筛选条件：</span>
                <el-cascader style="width:170px;" size="medium" v-show="class_show" clearable :options="class_options" v-model="class_selected" @change="Parent_filter">
                </el-cascader>
                <el-select size="medium" @change="Parent_filter" clearable v-show="class_show" v-model="classisBinding" style="width:130px;" placeholder="微信绑定状态">
                    <el-option v-for="(item,key) in Binding_options" :key="key" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <!-- 教育局筛选条件 -->
                <span v-show="Superintendent_show">筛选条件：</span>
                <el-select size="medium" @change="Superintendent_filter" style="width:160px;"  clearable v-show="Superintendent_show" v-model="SuperintendentType" placeholder="岗位">
                    <el-option v-for="(item,key) in Superintendent_options" :key="key" :label="item.dictName" :value="item.dictCode">
                    </el-option>
                </el-select>
                <el-select size="medium" @change="Superintendent_filter" clearable v-show="Superintendent_show" v-model="SuperintendentisBinding" style="width:130px;" placeholder="微信绑定状态">
                    <el-option v-for="(item,key) in Binding_options" :key="key" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ins-opa-btn" v-if="activeName!=3">
                <el-button  size="small" icon="el-icon-search" type="primary" @click="infoQuery()">查询</el-button>
            </div>  
            <div class="ins-opa-btn right">
                <!-- 重置 按钮 -->
                <el-button size="small" @click="initial" type="warning">重置密码</el-button>
                <el-button size="small" type="primary" @click="Jump">打印二维码</el-button>
            </div>
        </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
            <div class="ins-table">
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span v-if="activeName==1">幼儿园教职工列表</span>
                    <span v-if="activeName==2">幼儿园家长列表</span>
                    <span v-if="activeName==3">教育局用户列表</span>
                    <!-- 复制 打印 -->
                    <div class="tabbar-con">
                        <tableBar type="copy,export,printer" :tableId='Tabid' :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                    </div>
                    <!-- 搜索 -->
                    <div class="title-input">
                        <el-input placeholder="请输入搜索内容" v-model="searchstr" clearable>
                        </el-input>
                    </div>
                </div>
                <!-- 表格内容 -->
                <div class="ins-tab-con">
                    <!-- 教职工表 -->
                    <el-table v-if="activeName==1" key="t1" :data="tableData1" @selection-change="check" border height="100%" id="a1" stripe style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="center" label="姓名" prop="WORKER_NAME" sortable v-if="scrColumn.WORKER_NAME.selected" width="80">
                        </el-table-column>
                        <el-table-column align="center" label="性别" prop="WORKER_GENDER_STR" sortable v-if="scrColumn.WORKER_GENDER_STR.selected">
                        </el-table-column>
                        <el-table-column align="center" label="岗位" show-overflow-tooltip prop="DICT_VALUE" sortable v-if="scrColumn.DICT_VALUE.selected">
                        </el-table-column>
                        <el-table-column align="center" show-overflow-tooltip label="用户名" prop="USER_LOGIN_NAME" sortable v-if="scrColumn.USER_LOGIN_NAME.selected">
                        </el-table-column>
                        <el-table-column align="center" label="初始密码" prop="USER_INIT_PWD" sortable v-if="scrColumn.USER_INIT_PWD.selected">
                        </el-table-column>
                        <el-table-column align="center" show-overflow-tooltip label="绑定手机" prop="USER_LOGIN_TELE" sortable v-if="scrColumn.USER_LOGIN_TELE.selected">
                        </el-table-column>
                        <el-table-column align="center" label="绑定微信" prop="IS_BINDING" sortable v-if="scrColumn.IS_BINDING.selected">
                        </el-table-column>
                        <el-table-column align="center" label="使用状态" prop="USER_STATUS_STR" sortable v-if="scrColumn.USER_STATUS_STR.selected">
                        </el-table-column>
                        <el-table-column width="180" align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,0)" type="primary" plain size="mini">锁定</el-button>
                                <el-button v-show="scope.row.USER_STATUS==0||scope.row.USER_STATUS==2" @click="prohibitClick(scope.row,1)" type="warning" plain size="mini">激活</el-button>
                                <el-button v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,2)" type="danger" plain size="mini">禁用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 家长表 -->
                    <el-table v-if="activeName==2" key="t2" :data="tableData2" @selection-change="check" border height="100%" id="a2" stripe style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="center" label="学生姓名" prop="STUDENT_NAME" sortable v-if="scrColumn.STUDENT_NAME.selected"></el-table-column>
                        <el-table-column align="center" label="学生年级" prop="GRADE_NAME" sortable v-if="scrColumn.GRADE_NAME.selected"></el-table-column>
                        <el-table-column align="center" label="学生班级" prop="CLASS_NAME" sortable v-if="scrColumn.CLASS_NAME.selected"></el-table-column>
                        <el-table-column align="center" label="家长角色" prop="PARENT_RELATIONSHIP" sortable v-if="scrColumn.PARENT_RELATIONSHIP.selected"></el-table-column>
                        <el-table-column align="center" label="账户类型" prop="IS_MAIN" sortable v-if="scrColumn.IS_MAIN.selected"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip label="用户名" prop="USER_LOGIN_NAME" sortable v-if="scrColumn.USER_LOGIN_NAME.selected"></el-table-column>
                        <el-table-column align="center" label="初始密码" prop="USER_INIT_PWD" sortable v-if="scrColumn.USER_INIT_PWD.selected"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip label="绑定手机" prop="USER_LOGIN_TELE" sortable v-if="scrColumn.USER_LOGIN_TELE.selected"></el-table-column>
                        <el-table-column align="center" label="绑定微信" prop="IS_BINDING" sortable v-if="scrColumn.IS_BINDING.selected"></el-table-column>
                        <el-table-column align="center" label="使用状态" prop="USER_STATUS_STR" sortable v-if="scrColumn.USER_STATUS_STR.selected">
                        </el-table-column>
                        <el-table-column width="150" align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,0)" type="danger" plain size="mini">锁定</el-button>
                                <el-button v-show="scope.row.USER_STATUS==0||scope.row.USER_STATUS==2" @click="prohibitClick(scope.row,1)" type="warning" plain size="mini">激活</el-button>
                                <el-button v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,2)" type="primary" plain size="mini">禁用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 教育局表 -->
                    <el-table v-if="activeName==3" key="t3" :data="tableData3" @selection-change="check" border height="100%" id="a3" stripe style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                         <el-table-column align="center" label="姓名" prop="SUPERINTENDENT_NAME" sortable v-if="scrColumn.SUPERINTENDENT_NAME.selected" width="100">
                        </el-table-column>
                        <el-table-column align="center" label="性别" prop="SUPERINTENDENT_GENDER_STR" sortable v-if="scrColumn.SUPERINTENDENT_GENDER_STR.selected">
                        </el-table-column>
                        <el-table-column align="center" label="职务" show-overflow-tooltip prop="DICT_VALUE" sortable v-if="scrColumn.DICT_VALUE.selected">
                        </el-table-column>
                        <el-table-column align="center" label="用户名" prop="USER_LOGIN_NAME" show-overflow-tooltip sortable v-if="scrColumn.USER_LOGIN_NAME.selected">
                        </el-table-column>
                        <el-table-column align="center" label="初始密码" prop="USER_INIT_PWD" sortable v-if="scrColumn.USER_INIT_PWD.selected">
                        </el-table-column>
                        <el-table-column align="center" label="绑定手机" show-overflow-tooltip prop="USER_LOGIN_TELE" sortable v-if="scrColumn.USER_LOGIN_TELE.selected">
                        </el-table-column>
                        <el-table-column align="center" label="绑定微信" prop="IS_BINDING" sortable v-if="scrColumn.IS_BINDING.selected">
                        </el-table-column>
                        <el-table-column align="center" label="使用状态" prop="USER_STATUS_STR" sortable v-if="scrColumn.USER_STATUS_STR.selected">
                        </el-table-column>
                        <el-table-column width="180" align="center" label="操作">
                           <template slot-scope="scope">
                                <el-button plain v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,0)" type="danger" size="mini">锁定</el-button>
                                <el-button plain v-show="scope.row.USER_STATUS==0||scope.row.USER_STATUS==2" @click="prohibitClick(scope.row,1)" type="warning" size="mini">激活</el-button>
                                <el-button plain v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,2)" type="primary" size="mini">禁用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        </div>
        </div>
    </div>
</template>
<script src="./js/AMOne.js"></script>

