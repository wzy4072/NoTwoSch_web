<style scoped lang='less'>
  .ins-content-con{
    padding:4% 0 0 3%;
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'教师工资信息管理'"></returnBtn>
    </div>
    <div class="ins-page-con">
			<div class="ins-page-type type1">
        <div class="ins-page-btn" >
					<div class="ins-opa-btn">
            <el-button type="primary" size="small" @click="isEdit=1" v-if="isEdit===0">编辑</el-button>
            <el-button type="success" size="small" @click="saveFn" v-if="isEdit===1">保存</el-button>
            <el-button type="danger" size="small" @click="cancelFn" v-if="isEdit===1">取消</el-button>
          </div>
        </div>
        <div class="ins-page-main">
          <div class="ins-content">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>幼儿园教师工资信息管理</span>
            </div>
            <div class="ins-content-con ins-s-ofx-a">
              <el-form :model="formdata" ref="ruleForms" label-width="200px" :rules="rulesObj">
                <div class="item-content">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="月工资 ≤2200：" prop="wages1">
                        <el-input type="number" v-show="isEdit" v-model.number="formdata.wages1">
                          <template slot="append">人</template>
                        </el-input>
                        <span v-show="!isEdit">{{formdata.wages1?(formdata.wages1+' 人'):''}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="2200＜ 月工资 ≤ 3000：" prop="wages2">
                        <el-input  type="number" v-show="isEdit" v-model.number="formdata.wages2">
                          <template slot="append">人</template>
                        </el-input>
                        <span v-show="!isEdit">{{formdata.wages2?(formdata.wages2+' 人'):''}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>    
                </div>      
                <div class="item-content">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="3000＜ 月工资 ≤ 4500：" prop="wages3">
                        <el-input  type="number" v-show="isEdit" v-model.number="formdata.wages3">
                          <template slot="append">人</template>
                        </el-input>
                        <span v-show="!isEdit">{{formdata.wages3?(formdata.wages3+'人'):''}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>  
                <div class="item-content">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="4500＜ 月工资 ≤ 7000：" prop="wages4">
                        <el-input v-show="isEdit" type="number" v-model.number="formdata.wages4">
                          <template slot="append">人</template>
                        </el-input>
                        <span v-show="!isEdit">{{formdata.wages4?(formdata.wages4+'人'):''}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="7000＜ 月工资：" prop="wages5">
                        <el-input  type="number" v-show="isEdit" v-model.number="formdata.wages5">
                          <template slot="append">人</template>
                        </el-input>
                        <span v-show="!isEdit">{{formdata.wages5?(formdata.wages5+'人'):''}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
        </div>
			</div>
      <el-dialog title="操作提示" :visible.sync="dialogAbolishVisible" width="500px">
        <p class="failInfo">如有内容修改，取消编辑后修改将不会被保存。</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm">确定取消</el-button>
          <el-button type="primary" @click="dialogAbolishVisible = false">继续编辑</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script src="./js/KindDetInfo.js"></script>