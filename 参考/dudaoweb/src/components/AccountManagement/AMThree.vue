<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'账户管理（教育局 ）'"></returnBtn>
        </div>
        <div class="ins-page-con">
        <div class="ins-page-type type1">
        <div class='ins-page-search'>
            <div class='ins-search-con'>
                <span>筛选条件：</span>
                <el-select size="medium" @change="Superintendent_filter" clearable  v-model="SuperintendentType" placeholder="按岗位筛选">
                    <el-option v-for="(item,key) in Superintendent_options" :key="key" :label="item.dictName" :value="item.dictCode">
                    </el-option>
                </el-select>
                <el-select size="medium" @change="Superintendent_filter" clearable  v-model="SuperintendentisBinding" placeholder="按微信绑定状态刷选">
                    <el-option v-for="(item,key) in Binding_options" :key="key" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ins-opa-btn right">
                <!-- 重置 按钮 -->
                <el-button size="small" @click="initial" type="warning">重置密码</el-button>
                <el-button size="small" type="primary" @click="Jump">打印二维码</el-button>
            </div>
        </div>
        <div class="ins-page-main">
            <div class="ins-table">
                <div class="ins-title">
                    <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                    <span>教育局用户列表</span>
                    <!-- 复制 打印 -->
                    <div class="tabbar-con">
                        <tableBar type="copy,export,printer" tableId='a' :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                    </div>
                    <!-- 搜索 -->
                    <div class="title-input">
                        <el-input placeholder="请输入内容" v-model="searchstr" clearable>
                        </el-input>
                    </div>
                </div>
                <div class="ins-tab-con">
                    <el-table  :data="tableData" @selection-change="check" border height="100%" id="a" stripe style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="center" label="姓名" prop="SUPERINTENDENT_NAME" sortable v-if="scrColumn.SUPERINTENDENT_NAME.selected" width="100">
                        </el-table-column>
                        <el-table-column align="center" label="性别" prop="SUPERINTENDENT_GENDER_STR" sortable v-if="scrColumn.SUPERINTENDENT_GENDER_STR.selected">
                        </el-table-column>
                        <el-table-column align="center" label="职务" show-overflow-tooltip prop="DICT_VALUE" sortable v-if="scrColumn.DICT_VALUE.selected">
                        </el-table-column>
                        <el-table-column align="center" label="用户名" show-overflow-tooltip prop="USER_LOGIN_NAME" sortable v-if="scrColumn.USER_LOGIN_NAME.selected">
                        </el-table-column>
                        <el-table-column align="center" label="初始密码" show-overflow-tooltip prop="USER_INIT_PWD" sortable v-if="scrColumn.USER_INIT_PWD.selected">
                        </el-table-column>
                        <el-table-column align="center" label="绑定手机" prop="USER_LOGIN_TELE" show-overflow-tooltip sortable v-if="scrColumn.USER_LOGIN_TELE.selected">
                        </el-table-column>
                        <el-table-column align="center" label="绑定微信" prop="IS_BINDING" sortable v-if="scrColumn.IS_BINDING.selected">
                        </el-table-column>
                        <el-table-column align="center" label="使用状态" prop="USER_STATUS_STR" sortable v-if="scrColumn.USER_STATUS_STR.selected">
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="180">
                           <template slot-scope="scope">
                                <el-button v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,0)" type="primary" plain size="mini">锁定</el-button>
                                <el-button v-show="scope.row.USER_STATUS==0||scope.row.USER_STATUS==2" @click="prohibitClick(scope.row,1)" type="warning" plain size="mini">激活</el-button>
                                <el-button v-show="scope.row.USER_STATUS==1" @click="prohibitClick(scope.row,2)" type="danger" plain size="mini">禁用</el-button>
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
<script src="./js/AMThree.js"></script>

