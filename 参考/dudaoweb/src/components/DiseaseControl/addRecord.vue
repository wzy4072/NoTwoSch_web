<style scoped lang="less">
  .add-record{
    height:100%;
    position:relative;
    padding-left: 300px;
    .stu-tree{
      width:280px;
      position: absolute;
      left: 0;
      height: 100%;
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
        <div class="ins-page-main">
          <div class="add-record">
            <div class="stu-tree">
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
            <div class="ins-content">
              <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>检查内容</span>
              </div>
              <div class="ins-content-con">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
                  <el-form-item label="检查类型：" prop="checkType">
                    <el-radio-group v-model="ruleForm.checkType">
                      <el-radio :label="1">晨检记录</el-radio>
                      <el-radio :label="2">午检记录</el-radio>
                      <el-radio :label="3">全日观察</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="检查日期：" required>
                    <el-col :span="14">
                      <el-form-item prop="checkTime">
                        <el-date-picker class="ins-s-wf" type="date" placeholder="选择日期" v-model="ruleForm.checkTime" value-format="timestamp"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="异常情况记录：" prop="abnormalCondition">
                    <el-col :span="14">
                      <el-input type="textarea" v-model="ruleForm.abnormalCondition" placeholder="可在此详细输入意见"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="处理意见：">
                    <el-col :span="14">
                      <el-radio-group v-model="ruleForm.handlingOpinionsType">
                        <el-radio :label="1">隔离治疗</el-radio>
                        <el-radio :label="2">在园观察</el-radio>
                      </el-radio-group>
                      <el-input type="textarea" v-model="ruleForm.handlingOpinions" placeholder="可在此详细输入意见"></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
              </div>
            </div>
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
      </div>
    </div>
  </div>
</template>
<script src="./js/addRecord.js"></script>
