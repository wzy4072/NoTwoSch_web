<style scoped>
.descCss {
  padding: 20px 80px;
  color: #666;
}

.hideFile {
  position: relative;
}
.hideFile input[type="file"] {
  cursor: pointer;
  opacity: 0;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
<template>
    <div class="ins-container pd3">
        <div>
            <!-- 搜索栏 -->
            <div class="ins-page-search">
                <div class="ins-search-con">
                    <a :headers="token" v-bind:href="baseUrl+'baseInfo/staffManage/download?templateNumber=importKSSStudentInfo.xlsx'" > <el-button type="warning" size="medium" style="float:left; " v-show="isEdit==false" plain>下载模板</el-button></a>                   
                    <el-upload class="upload-demo" :action="baseUrl+'baseInfo/stuInfo/showStudentList'"  name="FILE" :headers="token"  v-show="isEdit==false" :onSuccess="upload" :onError="upload" :show-file-list="false" style="float:left; margin-left:10px;">
                    <el-button type="primary" plain size="mini" icon="el-icon-upload" style="padding:8px 15px">上传文件</el-button>
                    </el-upload>    
                    <el-button type="success" size="medium" v-show="isEdit==true" @click="submitForm('AForm')">保存</el-button>
                    <el-button type="primary " size="medium" v-show="isEdit==true" @click="resetForm('AForm')">取消</el-button>
                </div>
            </div>
        </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
            <div class="ins-tab-con" style="padding-bottom:0">
                <!-- 表格标题+表格功能 -->
                <div class="ins-tab-title">
                    <span>
                        <span class="el-icon-menu">
                        </span>
                        <span class="com_fs_4">
                            信息补录表
                        </span>
                    </span>
                </div>
                <!-- 表格内容 -->
                <div class="com_h_full">

                    <el-table v-show="isEdit" id="a" :data='tableData' border stripe height="100%" style="width: 100%;height:100%">
                        <el-table-column v-for="(v,k) in scrColumn" :key="k" :prop="v.field"  align="center" :width="v.width" header-align="center" sortable :label="v.text">
                        </el-table-column>
                    </el-table>

                    <div class="descCss" v-show='!isEdit'>
                        <h3>学生信息导入模板填写说明</h3>
                        <p>1、*姓名：必填；</p>
                        <p>2、*性别：必填；</p>
                        <p>3、*入学日期：必填，格式为“年-月-日”；</p>
                        <p>4、*入学代码：必填，入学代码填写规范：Y+当前年份（如：Y2018）；</p>
                        <p>5、*年级：必填；</p>
                        <p>6、*年级代码：必填，入学代码填写规范：G+当前年份（如：G2018）；</p>
                        <p>7、*班级：必填；</p>
                        <p>8、*座号：必填，必须为正整数，且班级内的学生座号不可重复；</p>
                        <p>9、*家长联系电话：必填。</p>
                    </div>

                </div>
                <!-- 分页栏 -->
            </div>
            <!-- 其他 -->
            <div>
            </div>
            <el-dialog title="导入学生信息有误名单" :visible.sync="missListLayer" width="80%">
                 <div class="miss-layer">
                    <el-table id="missTable" :data='missTable' border stripe height="500px">
                        <el-table-column type="index" width="70px" label="序号" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="studentName" label="姓名"  align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="studentGenderName" label="性别"  align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="entranceDateStr"  label="入学日期" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="entranceCode"  label="入学代码" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="gradeName" label="年级" align="center" header-align="center" sortable>
                        </el-table-column>
                         <el-table-column prop="className" label="班级" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="userBirthday" label="出生日期" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="errorDescription" show-overflow-tooltip label="错误描述" align="center" header-align="center" sortable>
                        </el-table-column>
                    </el-table>
            </div>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/StuInfoImport.js"></script>

 
