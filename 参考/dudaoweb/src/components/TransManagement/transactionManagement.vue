<style scoped lang='less'>
  /*弹窗表格*/
  #diaTable {
    border: 1px solid #ddd;
    width: 565px;
    height: 350px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 10px;
    overflow: hidden;
  }

  .form-item-con {
    .item-title {
      padding: 8px 0 20px 0;
      span {
        &:first-child {
          color: #3C7AFF;
        }
      }
    }
    .item-content {
      padding-right: 40px;
      &.left-item {
        border-right: 1px dashed #c0c4cc;
      }
      .el-textarea {
        margin-top: 20px;
      }
    }
  }

</style>
<template>
  <div class='ins-container'>
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'异动管理'"></returnBtn>
      <!-- tab页 -->
      <div class="ins-tab-label">
        <el-tabs v-model='activeName' @tab-click='handleClick'>
          <el-tab-pane label='转班' name='zhuanban'>转班</el-tab-pane>
          <el-tab-pane label='转入' name='zhuanru'>转入</el-tab-pane>
          <el-tab-pane label='转出' name='zhuanchu'>转出</el-tab-pane>
          <el-tab-pane label='休学' name='xiuxue'>休学</el-tab-pane>
          <el-tab-pane label='复学' name='fuxue'>复学</el-tab-pane>
          <el-tab-pane label='退学' name='tuixue'>退学</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 页面主体 -->
    <div class='ins-page-con'>
      <div class="ins-page-type type1">
        <!--搜索栏 -->
        <div class='ins-page-search'>
          <template v-if='zhuanru === 0'>
            <template v-if='fuxue === 0'>
              <div class="ins-search-con">
                现读年级：
                <el-select size="medium" placeholder="请选择" style="width:150px;" v-model="nowGrade">
                  <el-option v-for='item in options' :key='item.value' :label='item.label' :value='item.value'>
                  </el-option>
                </el-select>
              </div>
              <div class="ins-search-con">
                现读班级：
                <el-select size="medium" placeholder="请选择" style="width:150px;" v-model="nowClass">
                  <el-option v-for='item in classOptions' :key='item.value' :label='item.label' :value='item.value'>
                  </el-option>
                </el-select>
              </div>
            </template>
            <template v-if='fuxue === 1'>
              <div class="ins-search-con">
                统计时间：
                <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期"
                                style="width:350px;" type="daterange" v-model="date">
                </el-date-picker>
              </div>
            </template>
            <div class="ins-opa-btn">
              <el-button size="small" type="primary" @click="queryBtn()">
                <span class="el-icon-search ins-s-mr-10"></span>查询
              </el-button>
            </div>
            <div class="ins-opa-btn right">
              <el-button v-show='tabChangeStatus.zhuanban' size="small" type="success" @click="showDialogData()">
                <span class="el-icon-document ins-s-mr-10"></span>转班
              </el-button>
              <el-button v-show='tabChangeStatus.zhuanchu' size="small" type="success" @click="showDialogData()">
                <span class="el-icon-document ins-s-mr-10"></span>转出
              </el-button>
              <el-button v-show='tabChangeStatus.xiuxue' size="small" type="success" @click="showDialogData()">
                <span class="el-icon-document ins-s-mr-10"></span>休学
              </el-button>
              <el-button v-show='tabChangeStatus.fuxue' size="small" type="success" @click="showDialogData()">
                <span class="el-icon-document ins-s-mr-10"></span>复学
              </el-button>
              <el-button v-show='tabChangeStatus.tuixue' size="small" type="success" @click="showDialogData()">
                <span class="el-icon-document ins-s-mr-10"></span>退学
              </el-button>
            </div>
          </template>
          <div v-if='zhuanru === 1'>
            <div class="ins-opa-btn left">
              <el-button size="small" type="success" @click="zhuanruSubmit('ruleForm')">
                <span class="el-icon-check ins-s-mr-10"></span>提交
              </el-button>
            </div>
          </div>
          <el-dialog :title="dialogTitle + '操作'" :visible.sync="dialogChange" width="1100px" height="700px"
                     id="dialogOne">
            <div style="position:relative;height: 350px;">
              <div id="diaTable">
                <div style="position:fixed;width:550px;background: #fff;text-align: left">
                  <table id="mytableTwo">
                    <thead>
                    <th style="width:70px;">姓名</th>
                    <th style="width:80px;">入学代码</th>
                    <th style="width:110px;">年级</th>
                    <th style="width:100px;">年级代码</th>
                    <th>班级</th>
                    </thead>
                  </table>
                </div>
                <div style="overflow:auto;height:100%">
                  <table id="mytable">
                    <thead style="visibility: hidden">
                    <th style="width:70px;">姓名</th>
                    <th style="width:80px;">入学代码</th>
                    <th style="width:110px;">年级</th>
                    <th style="width:100px;">年级代码</th>
                    <th>班级</th>
                    </thead>
                    <tbody>
                    <tr v-for="v in multipleSelection">
                      <td>
                        <span v-text="v.studentName"></span>
                      </td>
                      <td>
                        <span v-text="v.entranceCode"></span>
                      </td>
                      <td>
                        <span v-text="v.gradeName"></span>
                      </td>
                      <td>
                        <span v-text="v.gradeCode"></span>
                      </td>
                      <td>
                        <span v-text="v.className"></span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style="position:absolute;right:0;height:100%;width:473px;padding:5px 5px 0 20px;">
                <el-form ref="formTwo" :rules="rules" :model="formTwo" label-width="100px">
                  <el-form-item v-if="tabChangeStatus.zhuanban" label="拟转入年级:" prop='newGradeCode'>
                    <el-select v-model='formTwo.newGradeCode' placeholder='请选择' style='width:100%;'>
                      <el-option v-for='item in options' :key='item.value' :label='item.label' :value='item.value'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.zhuanban" label="拟转入班级:" prop='newClassCode'>
                    <el-select v-model='formTwo.newClassCode' placeholder='请选择' style='width:100%;'>
                      <el-option v-for='item in classOptionsLast' :key='item.value' :label='item.label'
                                 :value='item.value'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.zhuanchu" label="转入学校名称:">
                    <el-input v-model="formTwo.transactionSchoolName"></el-input>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.zhuanchu" label="拟读年级:">
                    <el-input v-model="formTwo.newGradeName" style='width:97%;'></el-input>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.fuxue" label="拟读年级:" prop='newGradeCode'
                                style="margin-left: -10px;">
                    <el-select v-model='formTwo.newGradeCode' placeholder='请选择' style='width:97%;'>
                      <el-option v-for='item in options' :key='item.value' :label='item.label' :value='item.value'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.zhuanchu" label='转出日期:' prop='transactionDate'
                                style="margin-left: -10px;">
                    <el-date-picker v-model='formTwo.transactionDate' type='date' placeholder='yyyy/mm/dd'
                                    style='width:97%;'></el-date-picker>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.xiuxue" label='休学日期:' prop='transactionDate'
                                style="margin-left: -10px;">
                    <el-date-picker v-model='formTwo.transactionDate' type='date' placeholder='yyyy/mm/dd'
                                    style='width:97%;'></el-date-picker>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.xiuxue" label='复学日期:' prop='returnDate'>
                    <el-date-picker v-model='formTwo.returnDate' type='date' placeholder='yyyy/mm/dd'
                                    style='width:100%;'></el-date-picker>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.fuxue" label="拟读班级:" prop='newClassCode'
                                style="margin-left: -10px;">
                    <el-select v-model='formTwo.newClassCode' placeholder='请选择' style='width:97%;'>
                      <el-option v-for='item in classOptionsLast' :key='item.value' :label='item.label'
                                 :value='item.value'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="!tabChangeStatus.zhuanchu" label="预计毕业时间:" id="biyeTime">
                    <span v-text="yujibiyeTime">2017</span>年
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.fuxue" label='复学日期:' prop='returnDate'>
                    <el-date-picker v-model='formTwo.returnDate' type='date' placeholder='yyyy/mm/dd'
                                    style='width:100%;'></el-date-picker>
                  </el-form-item>
                  <el-form-item v-if="tabChangeStatus.tuixue" label='退学日期:' prop='transactionDate'
                                style="margin-left: -10px;">
                    <el-date-picker v-model='formTwo.transactionDate' type='date' placeholder='yyyy/mm/dd'
                                    style='width:97%;'></el-date-picker>
                  </el-form-item>
                  <el-form-item label='申请理由:'>
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="formTwo.applyReason"
                              placeholder="请输入申请理由"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="submit('formTwo')">提交</el-button>
              <el-button @click="failDialog" size="small">取消</el-button>
            </span>
          </el-dialog>
        </div>
        <div class='ins-page-main' v-if='zhuanru === 0'>
          <div class="ins-table divide">
            <!-- title -->
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
              <span>学生列表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"
                          :scrColumn.sync="cloumns"></tableBar>
              </div>
              <!-- 搜索 -->
              <div class="title-input">
                <el-input placeholder="请输入搜索内容" v-model="input5" clearable>
                </el-input>
              </div>
            </div>
            <!-- content -->
            <div class="ins-tab-con">
              <el-table id="a" ref="multipleTable" :data='da' @selection-change="handleSelectionChange" height='100%'
                        border=''>
                <el-table-column type='selection' width='50' align='center'>
                </el-table-column>
                <el-table-column v-for='(v,k) in cloumns' :key='k' align='center' header-align='center' :label='v.text'
                                 :prop='v.field' v-if="v.selected" show-overflow-tooltip='' sortable=''>
                </el-table-column>
              </el-table>
            </div>
            <!-- page divide -->
            <div class="ins-tab-divide">
              <el-pagination :current-page="currentPage4" :page-size="size" :page-sizes="[50,100,200,300]"
                             :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class='ins-page-main' v-if='zhuanru === 1'>
          <div class="ins-content">
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
              <span>转入信息填写</span>
            </div>
            <div class="ins-content-con ins-s-ofx-a">
              <el-form :model='ruleForm' ref='ruleForm' :rules="ruleFormVerify" label-width='120px'
                       class='demo-ruleForm'>
                <div class="form-item-con">
                  <div class="item-title">
                    <span>|</span>
                    <span>学生信息</span>
                  </div>
                  <!--学生信息-->
                  <el-row>
                    <el-col :span="9">
                      <div class="item-content left-item">
                        <el-form-item label='姓名:' prop='stuName'>
                          <el-input v-model='ruleForm.stuName' placeholder='请输入姓名'></el-input>
                        </el-form-item>
                        <el-form-item label='性别:' prop="stuGender">
                          <el-radio-group v-model='ruleForm.stuGender' prop='stuGender' size='medium'
                                          style='width:100%;' id="radioSiyou">
                            <el-radio-button label="男" style='text-align:center;'></el-radio-button>
                            <el-radio-button label="女" style='text-align:center;'></el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label='家长联系电话:' prop='contactTele'>
                          <el-input v-model='ruleForm.contactTele' placeholder='请输入电话号码'></el-input>
                        </el-form-item>
                        <el-form-item label='现居住地址:'>
                          <el-cascader expand-trigger='hover' :options='cityOptions'
                                       :props="{value: 'label',children: 'children'}" v-model='nowAddr'
                                       style='width:100%;'>
                          </el-cascader>
                        </el-form-item>
                        <el-form-item label='民族:' prop='userNation'>
                          <el-select v-model='ruleForm.userNation' placeholder='请选择' style='width:100%;'>
                            <el-option v-for='(v,k) in national' :key='k' :label='v.dictValue' :value='v.dictCode'>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label='证件类型:' prop='certificatesType'>
                        <el-select v-model='ruleForm.certificatesType' placeholder='请选择证件类型' style='width:100%;'>
                          <el-option v-for='(v,k) in papersType' :key='k' :label='v.label' :value='v.value'>
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label='证件号码:' prop='certificatesNum'>
                        <el-input v-model='ruleForm.certificatesNum' placeholder='请输入证件号码'></el-input>
                      </el-form-item>
                      <el-form-item label='出生日期:' prop='userBirthday'>
                        <el-date-picker v-model='ruleForm.userBirthday' type='date' placeholder='yyyy/mm/dd'
                                        style='width:100%;'></el-date-picker>
                      </el-form-item>
                      <el-form-item label='户籍地址:' prop='nowAdd'>
                        <el-cascader expand-trigger='hover' :options='cityOptions'
                                     :props="{value: 'label',children: 'children'}" v-model='householdsAddr'
                                     style='width:100%;'>
                        </el-cascader>
                      </el-form-item>
                      <el-form-item label=''>
                        <el-input v-model='ruleForm.addressAddr' placeholder='请输入详细地址'></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="form-item-con">
                  <div class="item-title">
                    <span>|</span>
                    <span>转入本校信息</span>
                  </div>
                  <!--转入本校信息-->
                  <el-row>
                    <el-col :span="9">
                      <div class="item-content left-item">
                        <el-form-item label='拟读年级:' prop='newGradeCode'>
                          <el-select v-model='ruleForm.newGradeCode' placeholder='请选择年级'
                                     style='width:100%;'>
                            <el-option v-for='(v,k) in options' :key='k' :label='v.label' :value='v.value'>
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <div style="font-size:12px;color: #999;margin-left: 120px;margin-top: -20px;height: 21px;">
                          <div>
                            <span>所匹配年级代码为：<span v-text="gradeCodePipei"></span></span>
                          </div>
                        </div>
                        <el-form-item label='拟读班级:' prop='newClassCode'>
                          <el-select v-model='ruleForm.newClassCode' placeholder='请选择班级' style='width:100%;'>
                            <el-option v-for='(v,k) in classOptions' :key='k' :label='v.label' :value='v.value'>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label='入学代码:' prop='newEntranceCode'>
                        <el-input v-model='ruleForm.newEntranceCode' placeholder='填写格式：Y+当前年份 如：Y2018'>
                          <template slot="prepend">Y</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label='转入日期:' prop='transactionDate'>
                        <el-date-picker v-model='ruleForm.transactionDate' type='date' placeholder='yyyy/mm/dd'
                                        style='width:100%;'></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="form-item-con">
                  <div class="item-title">
                    <span>|</span>
                    <span>转出学校信息</span>
                  </div>
                  <!--转出学校信息-->
                  <el-row>
                    <el-col :span="9">
                      <div class="item-content left-item">
                        <el-form-item label='学校名称' prop='name'>
                          <el-input v-model='ruleForm.name' placeholder='请输入原学校名称'></el-input>
                        </el-form-item>
                        <el-form-item label='转出日期:'>
                          <el-date-picker v-model='ruleForm.transactionDate' type='date' placeholder='yyyy/mm/dd'
                                          style='width:100%;'></el-date-picker>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label='原年级'>
                        <el-input v-model='ruleForm.oldGradeName' placeholder='请输入原学校年级'></el-input>
                      </el-form-item>
                      <el-form-item label='原班级'>
                        <el-input v-model='ruleForm.oldClassName' placeholder='请输入原学校班级'></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="form-item-con">
                  <div class="item-title">
                    <span>|</span>
                    <span>申请理由</span>
                  </div>
                  <!--申请理由-->
                  <el-row>
                    <el-col :span='20'>
                      <el-form-item label='申请理由:'>
                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8}" v-model="ruleForm.applyReason"
                                  placeholder="请输入申请理由"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/transactionManagement.js"></script>



