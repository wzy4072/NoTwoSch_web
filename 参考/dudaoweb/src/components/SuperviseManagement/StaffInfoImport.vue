<style scoped>
.com_listtxt{padding: 10px 20px; font-size: 14px;color: #606266;  line-height:40px;}
</style>
<template>
  <div class="ins-container">
      <!-- 面包屑导航 -->
        <div class="ins-tab-label">
       </div>
<div class="ins-page-search" style="margin: 5px;">
    <div class="ins-search-con">
            <el-button type="warning" plain size="mini" v-show="isEdit==false"  icon="el-icon-download" style="float: left;" @click="download()" >下载模板</el-button>
            <!--<el-upload class="upload-demo"  v-show="isEdit==false" action="/api/imports/word2Html" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :show-file-list="false" style="float:left; margin-left:10px;" >
                <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload> -->
            <el-upload class="upload-demo" action="/staffManage/showWorkerList" v-show="isEdit==false" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :show-file-list="false" style="float:left; margin-left:10px;">
              <el-button type="primary" plain size="mini" icon="el-icon-upload">点击上传</el-button>
            </el-upload>
            <el-button type="success" size="medium" v-show="isEdit==true" >保存</el-button>
            <el-button type="primary " size="medium" v-show="isEdit==true" >取消</el-button>
    </div>
</div>
 <div class="ins-page-main" style="position: relative;">
   <div class="ins-tab-con">
   <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <i class="com_fs_4">
                        信息补录表
                    </i>
                </span>
            </div>
           <!-- 表格内容 -->
            <div class="com_h_full">
               <el-table v-show="isEdit" id="a" :data='previewdata' border stripe height="100%" style="width: 100%;height:100%">
                    <el-table-column type="selection" width="37">
                    </el-table-column>
                    <el-table-column label="姓名"  style="text-align:center;">
                        <template slot-scope="scope">
                        <a style="color:#0095f6;" @click="handleJump(scope.$index, scope.row)">{{ scope.row.name }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(v,k) in scrColumn" :key="k" :prop="v.field" v-if="v.selected" align="center" :width="v.width" header-align="center" sortable :label="v.text">
                    </el-table-column>
                    </el-table>
               <div class="com_listtxt" v-show='!isEdit'>
                    1、姓名：必填，不能重复，如果系统中已存在该姓名，则默认使用新数据覆盖；<br/>


                    2、性别：必填；<br/>


                    3、任职岗位：必填；<br/>


                    4、任教科目：选填；<br/>


                    5、手机号码：必填；<br/>


                    6、政治面貌：必填，群众、中共党员、共青团员、其他；<br/>


                    7、证件类型、证件号码：必填，身份证件类型和身份证号必须对应；<br/>


                    8、民族：选填，如“汉族”，不在56个民族中时，请填“其他”；<br/>


                    9、出生、入职、离职日期：选填，格式为“年-月-日”；<br/>


                    10、籍贯所在地：选填；格式为“xx省xx市xx县区”；<br/>


                    11、户口所在地：选填；格式为“xx省xx市xx县区+详细地址”；<br/>


                    12、现居住地址：选填；格式为“xx省xx市xx县区+详细地址”；<br/>
               </div>
               </div>
             <!-- 分页栏 -->
     </div>
 </div>
</div>
</template>
<script src="./js/StaffInfoImport.js"></script>
