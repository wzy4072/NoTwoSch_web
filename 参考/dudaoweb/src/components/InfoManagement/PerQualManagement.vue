<style scope>
</style>
<template>
  <div class="ins-container" v-loading="fullscreenLoading">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'个人资历管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
    <div class="ins-page-type type1">
      <div class="ins-page-btn">
        <div class="ins-opa-btn">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="isShowBtn=1" v-if="isShowBtn===0">编辑</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="addFn" v-if="isShowBtn===1 &&checkTableDataList.length <= 1">新增证书</el-button>
          <el-button type="warning" size="small" icon="el-icon-edit" @click="editFn" v-if="isShowBtn===1 &&checkTableDataList.length <= 1">编辑证书</el-button>
          <el-button type="danger" size="small" icon="el-icon-edit" @click="deleteFn" v-if="isShowBtn===1">删除证书</el-button>
            <el-button type="success" size="small" icon="el-icon-edit" @click="saveFn" v-if="isShowBtn===1">保存</el-button>
        </div>
      </div>
    <div class="ins-page-main">
      <div class="ins-table">
        <div class="ins-title">
          <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
          <span>{{workerData.workerName}}的资历信息（性别：{{workerData.workerGender===1?'男':'女'}} &nbsp;&nbsp;/&nbsp;&nbsp; 任职岗位：{{workerData.workerTypeName}} &nbsp;&nbsp;/&nbsp;&nbsp; 教学资历：{{workerData.teaching}} &nbsp;&nbsp;/&nbsp;&nbsp; 最高学历：{{workerData.highestEducation==1?'小学':workerData.highestEducation==2?'初中':workerData.highestEducation==3?'高中':workerData.highestEducation==4?'中专':workerData.highestEducation==5?'大专':workerData.highestEducation==6?'本科':workerData.highestEducation==7?'硕士':workerData.highestEducation==8?'博士':'其他'}}）</span>
        </div>
        <!-- 表格内容 -->
        <div class="ins-tab-con">
          <el-table id="table_A" ref="multipleTable" :data="tableData" border fit style="width: 100%; height:100%;" height="100%" @select="selectTableFn" @select-all="selectTableFn">
            <el-table-column type="selection" width="55" align="center" header-align="center" :reserve-selection="true" v-if="isShowBtn===1">
            </el-table-column>
            <el-table-column align="center" header-align="center" label="项目" sortable="">
              <template slot-scope="scope">
                {{scope.row.qualificationsName}}
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="内容" sortable="">
              <template slot-scope="scope">
                <a @click="certificateClickFn(scope.row)" style="color:#409eff;">{{scope.row.qualificationsName + '.png' + ';'}}</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :title="dialogName" :visible.sync="dialogPictureVisible" width="800px" v-if="dialogPictureVisible===true">
      <img :src="imgUrl" class="com_w_full" style="height:400px;" @click="showLargerFn(item)">
    </el-dialog>
    <el-dialog :title="dialogAddOrEditTitle" :visible.sync="dialogAddOrEditVisible" width="400px" v-if="dialogAddOrEditVisible===true">
      <el-form ref="form" :model="dialogData" label-width="80px">
        <el-form-item label="常规类型">
          <el-select class="com_full" v-model="dialogData.qualificationsName" placeholder="请选择类型">
            <el-option v-for="(item,key) in certificateType" :key="key" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他类型">
          <el-input v-model="dialogData.otherQualificationsName" :disabled="dialogData.qualificationsName !== '其他类型'"></el-input>
        </el-form-item>
        <el-form-item label="证明文件">
          <el-input style="width:170px;" v-model="dialogData.fileName"></el-input>
          <el-upload class="upload-demo com_fr" :action="uploadUrl" :data="dialogData" name="FILE" :headers="token" :show-file-list="false" :multiple="false" :before-upload="beUploadFn" :on-success="fileUploadSucFn">
            <el-button size="small" type="primary" :loading="fileUploadStatus">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOrEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="winConfirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </div>
  </div>
</template>
<script src="./js/PerQualManagement.js"></script>
