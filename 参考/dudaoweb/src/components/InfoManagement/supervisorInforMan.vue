<style scoped>
.formTitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 5px 0 12px;
  background-color: #409eff;
  color: #fff;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
</style>
<template>
	<div class="ins-container">
    <div class="ins-page-top">
			<returnBtn :title="'督导室信息管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
		    <div class="ins-page-btn">
					<div class="ins-opa-btn">
				    <el-button type="primary" size="small" @click="isEdit=1" v-if="isEdit===0">编辑</el-button>
				    <el-button type="success" size="small" @click="saveFn" v-if="isEdit===1">保存</el-button>
				    <el-button type="danger" size="small" @click="dialogAbolishVisible = true" v-if="isEdit===1">取消</el-button>
			    </div>
		    </div>
		    <div class="ins-page-main">
          <div class="ins-content">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>盐田区督导室信息表</span>
            </div>
            <div class="ins-content-con">
              <el-form ref="ruleForm" :model="formData" :rules="rulesObj" label-width="100px">
                <el-form-item label="机构名称：" prop="areaName">
                  <el-col :span="12">
                    <el-input v-model="formData.areaName" v-if="isEdit===1"></el-input>
                    <span v-if="isEdit===0">{{formData.areaName}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="所在地区：" prop="nativeList">
                  <el-col :span="12">
                    <el-cascader class="com_w_full" v-if="isEdit===1" v-model="formData.nativeList" :options="cityList" :props="{value: 'label',children: 'children'}" filterable change-on-select></el-cascader>
                    <span v-if="isEdit===0">{{formData.nativeStr}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="详细地址：">
                  <el-col :span="12">
                    <el-input  v-model="formData.nativeAddress" v-if="isEdit===1"></el-input>
                    <span v-if="isEdit===0">{{formData.nativeAddress}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="联系电话：">
                  <el-col :span="12">
                    <el-input v-model="formData.areaTel" v-if="isEdit===1"></el-input>
                    <span v-if="isEdit===0">{{formData.areaTel}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="联系传真：">
                  <el-col :span="12">
                    <el-input v-model="formData.areaFax" v-if="isEdit===1"></el-input>
                    <span v-if="isEdit===0">{{formData.areaFax}}</span>
                  </el-col>
                </el-form-item>
                <el-form-item label="联系邮箱：">
                  <el-col :span="12">
                    <el-input v-model="formData.areaEmail" v-if="isEdit===1"></el-input>
                    <span v-if="isEdit===0">{{formData.areaEmail}}</span>
                  </el-col>
                </el-form-item>
              </el-form>      
            </div>
		      </div>
          <el-dialog title="操作提示" :visible.sync="dialogAbolishVisible" width="500px">
            <p class="failInfo">如有内容修改，取消编辑后修改将不会被保存。</p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="resetForm('ruleForm')">确定取消</el-button>
              <el-button type="primary" @click="dialogAbolishVisible = false">继续编辑</el-button>
            </span>
          </el-dialog>
	      </div>
	    </div>
	  </div>
	</div>
</template>
<script src="./js/supervisorInforMan.js"></script>
