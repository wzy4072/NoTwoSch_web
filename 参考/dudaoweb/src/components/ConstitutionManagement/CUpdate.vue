<style scoped>
   .constitution-form{
      padding:10px 0 10px 2%;
   }
   .constitution-form >>> .el-upload__tip {
      display: inline-block;
      margin: 0 0 0 10px;
   }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="session?'编辑资料':'新增资料'"></returnBtn>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
        <!-- 按钮栏 -->
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
              <el-button size="small" type="warning" @click="$router.push({ path: '/ConstitutionManagement/CMTwo' })">
                <span class="el-icon-back ins-s-mr-5"></span><span>返回</span>
               </el-button>
              <el-button size="small" type="success" @click="submit">
                <span class="el-icon-check ins-s-mr-5"></span><span>提交审批</span>
               </el-button>
            </div>
         </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
          <div class="ins-content">
            <!-- title -->
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
              <span>资料内容</span>
      </div>
            <!-- content -->
            <div class="ins-content-con constitution-form">
         <el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="资料名称：" prop="noticeTypeStr" style="width:750px;" label-width="130px">
              <el-select v-model="pageData.noticeType" placeholder="请选择资料类型" @change="selectGet" >
                <el-option :label="item.dictName" :value="item.dictCode" v-for="(item,key) in noticeTypeList" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资料上传说明：" prop="noticeTypeCom" style="width:750px;" label-width="130px">
            	<span class="el-form-item__label">{{pageData.noticeTypeCom ? pageData.noticeTypeCom : '无'}}</span>
              <!-- <el-input v-model="pageData.noticeTypeCom" placeholder=""></el-input> -->
            </el-form-item>
            <el-form-item label="版本简述：" prop="content" style="width:750px;" label-width="130px">
              <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 12}" v-model="pageData.content"></el-input>
            </el-form-item>
            <el-form-item label="资料附件：" prop="atts" style="width:750px;" label-width="130px">
              <el-upload :action="baseUrl+'/baseInfo/noticeSys/uploadFile'"
                  :headers="{'authorization':token}"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :limit="20"
                  :on-success="handleSuccess"
                  :on-exceed="handleExceed"
                  :file-list="pageData.atts">
                  <el-button size="mini" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">最多20个，每个小于10MB，格式（.jpg.png.doc.docx.ppt.pptx.txt.xlsx.xls.pdf）</div>
              </el-upload>
            </el-form-item>
         </el-form>
      </div>
   </div>
        </div>
      </div>
  </div>
  </div>
</template>
<script src="./js/CUpdate.js"></script>
