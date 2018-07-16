<style scoped lang="less">
  .add-infectious{
    display:flex;
    flex-direction: row;
    width: 100%;
    height:100%;
    .stu-tree{
      width:280px;
      margin-right: 20px;
      .item-con{
        height: 100%;
        font-size: 15px;
        position: relative;
        padding-top:110px;
        .item-top{
          background-color:#eaecf2;
          top: 0;
          position: absolute;
          height:110px;
          width: 100%;
          border-top-right-radius:6px;
          border-top-left-radius:6px;
          padding: 15px;
          .opa-con{
            font-size: 16px;
            line-height: 29px;
            color:#606266;
          }
          .search-con{
            height: 36px;
            margin-top: 15px;
          }
        }
        .content-con{
          height: 100%;
          overflow:auto;
          border: 1px solid #e6e6e6;
          border-top:none;
          .el-tree{ padding-top:5px; }
        } 
      }
    }
    .ins-content{
      flex: 1;
      .seck-name .el-radio{
        margin: 0 30px 15px 0;
      }
    }
  }
</style>
<style scoped>
  .search-con >>>.el-input__inner{
    height: 100%;
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
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
          <div class="add-infectious">
            <!-- 待选人员 -->
            <div class="stu-tree" v-show="treeShow">
              <div class="item-con">
                <div class="item-top">
                  <div class="opa-con">
                    待选学生列表
                  </div>
                  <div class="search-con">
                    <el-input class="ins-s-hf" placeholder="按姓名搜索" v-model="filterText"></el-input>
                  </div>
                </div>
                <div class="content-con">
                  <el-tree
                    empty-text="无数据"
                    class="filter-tree"
                    show-checkbox
                    :data="treeData"
                    node-key="id"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="tree">
                  </el-tree>
                </div>
              </div>
            </div>
            <!-- 检查内容 -->
            <div class="ins-content">
              <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>检查内容</span>
              </div>
              <div class="ins-content-con">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
                  <el-form-item label="发病日期：" required>
                    <el-col :span="14">
                      <el-form-item prop="diseaseDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.diseaseDate" value-format="timestamp" class="ins-s-wf"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="诊断日期：" required>
                    <el-col :span="14">
                      <el-form-item prop="diagnosisDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.diagnosisDate" value-format="timestamp" class="ins-s-wf"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="诊断单位：" required>
                    <el-col :span="14">
                      <el-form-item prop="diagnosisCompany">
                        <el-input v-model="ruleForm.diagnosisCompany"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="疾病类型：" prop="diseaseType">
                    <el-radio-group v-model="ruleForm.diseaseType">
                      <el-radio :label="1">普通疾病</el-radio>
                      <el-radio :label="2">传染疾病(保存后将信息同步至传染疾病登记表)</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="疾病名称：" required prop="diseaseName">
                    <el-col :span="14">
                      <el-form-item prop="diseaseCode" >
                        <el-radio-group class="seck-name" v-model="ruleForm.diseaseCode" v-show="ruleForm.diseaseType===1">
                          <el-radio v-for="(item,key) in diseaseCodeArry" :key="key" :label="item.id">{{item.diseaseName}}</el-radio>
                          <el-radio  label="0"><el-input v-model="myselfDiseaseName"></el-input></el-radio>
                        </el-radio-group>
                        <el-radio-group class="seck-name" v-model="ruleForm.diseaseCode" v-show="ruleForm.diseaseType===2">
                          <el-radio v-for="(item,key) in diseaseCodeArry2" :key="key" :label="item.id">{{item.diseaseName}}</el-radio>
                          <el-radio  label="0"><el-input v-model="myselfDiseaseName"></el-input></el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="报告日期：" required>
                    <el-col :span="14">
                      <el-form-item prop="reportDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.reportDate" value-format="timestamp" class="ins-s-wf"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="处理办法：" required>
                    <el-radio-group v-model="ruleForm.treatmentMethod">
                      <el-radio :label="1">住院就诊</el-radio>
                      <el-radio :label="2">留园隔离观察</el-radio>
                      <el-radio :label="3">回家</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="返园日期：" >
                    <el-col :span="14">
                      <el-form-item prop="returnDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.returnDate" class="ins-s-wf"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/addInfectious.js"></script>
