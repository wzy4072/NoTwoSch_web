<template>
  <div class="full-height bg">
    <div class="ins-page-search"  style="width:80%;margin:20px auto;">
        <div class="ins-search-con">
          <el-button type="primary" size="medium" style="float:left;margin-right:10px;" @click="saveFun(1)"  >保存</el-button>
           <el-button type="primary" size="medium" style="float:left;margin-right:10px;" @click="saveFun(2)" >提交</el-button>
           <el-button  type="primary" size="medium" style="float:left;margin-right:10px;" @click="delet()" >删除</el-button>
        </div>
      </div>
    <div class="bg2" style="width:80%;margin:20px auto;">
     <div class="msg-middle2" >
      <div class="msg-middle2-title">
        <span class="logContent">日志内容 </span> 
         <!-- <span class="editLog"><i class="addIcon"></i> 编辑</span> -->
      </div>
      <div class="clear"></div>
      <div class="msg-middle2-context">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm mar20">
          <el-form-item label="日志名称" prop="logTitile" >
            <el-input v-model="ruleForm.logTitile"></el-input>
          </el-form-item>
           <div class="uploaddiv">
             <el-upload class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
              <a size="small" class="upload" type="primary">添加附件</a>
            </el-upload>
           </div>
          <div class="uploaddiv mart50">
            <ue :maindata.sync="maindata" :config="config" ref ="Ue"></ue>
          </div>
        </el-form>
      </div>
    </div>
    </div>
</div>
</template>
<script src="./js/creatLog.js"></script>
<style lang="less" src="./style/logManagement.less" scoped></style>
<style scoped>
.bg{ background:#e7e9f0;}
.bg2{ background: #fff; border-radius:7px; height: 90%;  }
.logContent{ float: left; line-height: 40px;}
.editLog{float: right;border-radius: 5px; border: 1px solid #ccc ;font-size: 14px; margin:5px 20px 0px 0px; padding: 7px 20px; }
.mar20{ margin:20px 20px 0px 0px;}
.uploaddiv{ margin-left: 30px;}
.upload{ color: dodgerblue;font-size: 14px; }
.mart50{ margin-top: 50px;}

</style>