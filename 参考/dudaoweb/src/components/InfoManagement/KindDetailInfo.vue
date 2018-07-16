<style scoped lang='less'>
  .ins-content-con{
    padding:4% 0 0 3%;
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'园经费信息管理'"></returnBtn>
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
              <span>幼儿园经费支出信息表</span>
            </div>
            <div class="ins-content-con ins-s-ofx-a">
              <el-form :model="formdata" ref="ruleForms" label-width="180px" :rules="rulesObj">
                <div class="item-content">
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="园长及教学人员薪酬：" prop="principaStaffSalary">
                      <el-input v-show="isEdit" type="number" v-model.number="formdata.principaStaffSalary">
                        <template slot="append">元 / 年</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.principaStaffSalary?(formdata.principaStaffSalary+' 元 / 年'):''}}</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="非教学人员薪酬：" prop="nonteachStaffSalary">
                      <el-input  type="number" v-show="isEdit" v-model.number="formdata.nonteachStaffSalary">
                        <template slot="append">元 / 年</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.nonteachStaffSalary?(formdata.nonteachStaffSalary+' 元 / 年'):''}}</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="用地租金、管理费：" prop="landRentManagementFee">
                      <el-input  type="number" v-show="isEdit" v-model.number="formdata.landRentManagementFee">
                        <template slot="append">元 / 年</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.landRentManagementFee?(formdata.landRentManagementFee+' 元 / 年'):''}}</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="教学用品：" prop="teachingSuppliesFee">
                      <el-input  type="number" v-show="isEdit" v-model.number="formdata.teachingSuppliesFee">
                        <template slot="append">元 / 年</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.teachingSuppliesFee?(formdata.teachingSuppliesFee+' 元 / 年'):''}}</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="员工培训及专业发展：" prop="staffTrainingFee">
                      <el-input  type="number" v-show="isEdit" v-model.number="formdata.staffTrainingFee">
                        <template slot="append">元 / 年</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.staffTrainingFee?(formdata.staffTrainingFee+' 元 / 年'):''}}</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
                </div>
                <div class="item-content">
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="其他开资：" prop="otherFee">
                      <el-input  type="number" v-show="isEdit" v-model.number="formdata.otherFee">
                        <template slot="append">元 / 年</template>
                      </el-input>
                      <span v-show="!isEdit">{{formdata.otherFee?(formdata.otherFee+' 元 / 年'):''}}</span>
                    </el-form-item>
                  </el-col>
                  </el-row>
                </div>
              </el-form>
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
    </div>
  </div>
</template>
<script src="./js/KindDetailInfo.js"></script>
