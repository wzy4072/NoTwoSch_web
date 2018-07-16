<style scoped>
  .sick-name .el-radio{
    margin: 0 30px 15px 0;
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'添加记录'"></returnBtn>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type1">
        <div class="ins-page-btn">
          <div class="ins-opa-btn">
            <el-button @click="saveInfo('ruleForm')" type="success" size="small" >保存</el-button>
            <el-button @click="returnPage()" type="primary" size="small"  >返回</el-button>
          </div>
        </div>
        <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
          <p class="failInfo">返回后已填内容不会被保存</p>
          <p class="failInfo">确认返回?</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditOrBtn(1,'goonFail')">确定返回</el-button>
            <el-button type="primary" @click="dialogVisible = false">继续编辑</el-button>
          </span>
        </el-dialog>
        <div class="ins-page-main">
          <div class="ins-content">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>检查内容</span>
            </div>
            <div class="ins-content-con">
              <el-col :span="14">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
                  <el-form-item label="发病日期：" required prop="sickDate">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.sickDate" value-format="timestamp" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="诊断日期：" required prop="diagnosisDate">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.diagnosisDate" value-format="timestamp" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="诊断单位：" required  prop="sickAddress">
                    <el-input v-model="ruleForm.sickAddress"></el-input>
                  </el-form-item>
                  <el-form-item label="疾病类型：" prop="sickType">
                    <el-radio-group v-model="ruleForm.sickType">
                      <el-radio label="1">普通疾病</el-radio>
                      <el-radio label="2">传染疾病(保存后将信息同步至传染疾病登记表)</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="疾病名称：" class="sick-name" required prop="sickName">
                    <el-radio-group v-model="ruleForm.sickName" v-if="ruleForm.sickType==='1'">
                      <el-radio label="1">发热发烧</el-radio>
                      <el-radio label="手足口病">高热惊厥</el-radio>
                      <el-radio label="水痘">鼻炎</el-radio>
                      <el-radio label="流行性腮腺炎">哮喘</el-radio>
                      <el-radio label="猩红热">支气管炎</el-radio>
                      <el-radio label="急性出血结膜炎">肺炎</el-radio>
                      <el-radio label="痢疾">湿疹</el-radio>
                      <el-radio label="麻疹">过敏性皮炎</el-radio>
                      <el-radio label="风疹">胃肠炎</el-radio>
                      <el-radio label="传染性肝炎">阑尾炎</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="ruleForm.sickName" class="sick-name" v-if="ruleForm.sickType==='2'">
                      <el-radio label="1">流行性感冒</el-radio>
                      <el-radio label="手足口病"></el-radio>
                      <el-radio label="水痘"></el-radio>
                      <el-radio label="流行性腮腺炎"></el-radio>
                      <el-radio label="猩红热"></el-radio>
                      <el-radio label="急性出血结膜炎"></el-radio>
                      <el-radio label="痢疾"></el-radio>
                      <el-radio label="麻疹"></el-radio>
                      <el-radio label="风疹"></el-radio>
                      <el-radio label="传染性肝炎"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="报告日期：" required prop="reportData">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.reportData" value-format="timestamp" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="处理办法：">
                    <el-radio-group v-model="ruleForm.dealAdvise">
                      <el-radio label="1">住院就诊</el-radio>
                      <el-radio label="2">留园隔离观察</el-radio>
                        <el-radio label="3">回家</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="返园日期："  prop="returnData" >
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.returnData" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-form>
              </el-col>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/addComfirm.js"></script>
