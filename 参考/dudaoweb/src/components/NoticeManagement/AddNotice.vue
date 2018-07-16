<style scoped>
   .add-notice{
      padding:10px 0 10px 2%;
   }
   .add-notice >>> .el-upload__tip {
      display: inline-block;
      margin: 0 0 0 10px;
   }
</style>
<template>
   <div class="ins-container">
     <div class="ins-page-top">
        <!-- page title -->
        <returnBtn :title="session?'编辑公告':'新增公告'"></returnBtn>
     </div>
     <!-- 页面主体 -->
    <div class="ins-page-con">
      <div class="ins-page-type type1">
      <!-- 按钮栏 -->
      <div class="ins-page-btn">
         <!-- 左侧按钮 -->
              <div class="ins-opa-btn">
               <el-button @click="addNotice(1)" size="small" type="success">发布公告</el-button>
               <el-button @click="addNotice(0)" size="small" type="success">存为草稿</el-button>
            </div>
         </div>
      <!-- 页面主体 -->
      <div class="ins-page-main">
                <div class="ins-content">
                  <!-- title -->
                    <div class="ins-title">
                      <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
                      <span>公告内容</span>
                    </div>
                    <!-- content -->
                    <div class="ins-content-con">
         <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="公告类型：" prop="noticeType">
               <el-select v-model="formData.noticeType" placeholder="请选择公告类型" clearable>
                  <el-option :label="item.dictValue" :value="item.dictCode" v-for="(item,key) in noticeTypeList" :key="key"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="公告名称：" prop="title" style="width:750px;">
               <el-input v-model="formData.title" clearable placeholder="请输入公告名称，最多50字"></el-input>
            </el-form-item>
            <el-form-item style="width:750px;" label="公告正文：" prop="content">
               <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 12}" v-model="formData.content"></el-input>
            </el-form-item>
            <el-form-item label="公告附件：" prop="atts" style="width:750px;">
               <el-upload :action="baseUrl+'/baseInfo/noticeSys/uploadFile'"
                  :headers="{'authorization':token}"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove" 
                  :limit="20"
                  :on-success="handleSuccess"
                  :on-exceed="handleExceed"
                  :file-list="formData.atts">
                  <el-button size="mini" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">最多20个，每个小于20MB，格式（.jpg.png.doc.docx.ppt.pptx.txt.xlsx.xls.pdf）</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="发布范围：" prop="releaseScopeArr">
               <el-checkbox-group v-model="formData.releaseScopeArr">
                  <el-checkbox label="1" name="releaseScope">教育局职工</el-checkbox>
                  <el-checkbox label="2" name="releaseScope">幼儿园教职工</el-checkbox>
                  <el-checkbox label="3" name="releaseScope">幼儿园家长</el-checkbox>
               </el-checkbox-group>
            </el-form-item>
         </el-form>
      </div>
   </div>
   </div>
   </div>
   </div>
   </div>
</template>
<script src="./js/AddNotice.js"></script>