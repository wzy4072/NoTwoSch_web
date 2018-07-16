<style scoped lang='less'>
  .form-item-con{
    .item-title{
      padding: 8px 0 20px 0; 
      span{ 
        &:first-child{
          color: #3C7AFF;
        }
      }
	  }
    .item-content{
      padding-right: 40px;
      &.left-item{
        border-right:1px dashed #c0c4cc;
      }
      .el-textarea{
        margin-top: 20px;
      }
    }
  }
</style>
<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'个人信息管理'"></returnBtn>
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
              <span>个人信息表</span>
            </div>
            <div class="ins-content-con ins-s-ofx-a">
              <el-form :model="formdata" ref="ruleForms" label-width="120px" :rules="rulesObj">
              <!-- 基本信息 -->
								<div class="form-item-con">
									<div class="item-title">
										<span>|</span>
										<span>基本信息</span>
									</div>
									<!-- 基本信息内容 -->
									<el-row>
										<el-col :span="9">
											<div class="item-content left-item">
                        <!-- 姓名 -->
                        <el-form-item label="姓名：" prop="workerName">
                          <el-input v-show="isEdit" v-model="formdata.workerName" :disabled="true"></el-input>
                          <span v-show="!isEdit" v-text='formdata.workerName'></span>
                        </el-form-item>
                        <!-- 性别 -->
                        <el-form-item label="性别：" prop="workerGender">
                          <el-radio-group v-model="formdata.workerGender" size="small" v-show="isEdit" :disabled="true">
                            <el-radio-button label="1">男
                            </el-radio-button>
                            <el-radio-button label="0">女
                            </el-radio-button>
                          </el-radio-group>
                          <span v-show="!isEdit">{{formdata.workerGender===0?'女':formdata.workerGender===1 ?'男':''}}</span>
                        </el-form-item>
                        <!-- 证件类型 -->
                        <el-form-item label="证件类型：" prop="certificatesType">
                          <el-select class="ins-s-wf" v-model="formdata.certificatesType" :disabled="isDisabled1"  @change="selValChangeFn(formdata.certificatesType,'certificatesType')" placeholder="请选择" v-show="isEdit">
                            <el-option v-for="(item,key) in certificatesTypeList" :key="key" :label="item.name" :value="item.id">
                            </el-option>
                          </el-select>
                          <span v-show="!isEdit" v-text="formdata.certificatesTypeName"></span>
                        </el-form-item>
                        <!-- 证件号码 -->
                        <el-form-item label="证件号码：" prop="certificatesNum">
                          <el-input v-model="formdata.certificatesNum" v-show="isEdit" :disabled="isDisabled2"></el-input>
                          <span v-show="!isEdit" v-text='formdata.certificatesNum'></span>
                        </el-form-item>
                        <!-- 最高学历 -->
                        <el-form-item label="最高学历：">
                          <el-select class="ins-s-wf" v-model="formdata.highestEducation" @change="selValChangeFn(formdata.highestEducation,'highestEducation')" placeholder="请选择" v-show="isEdit" :disabled="isShow.highestEducation === false">
                            <el-option v-for="item in highestEducationList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode">
                            </el-option>
                          </el-select>
                          <span v-show="!isEdit" v-text="formdata.highestEducationName"></span>
                        </el-form-item>
											</div>
										</el-col>
										<el-col :span="9">
                      <div class="item-content">
                        <!-- 出生日期 -->
                        <el-form-item label="出生日期：" prop="userBirthday">
                          <el-date-picker class="ins-s-wf" type="date" placeholder="选择日期" v-model="formdata.userBirthday" v-show="isEdit"></el-date-picker><!--:disabled="isShow.userBirthday === false"-->
                          <span v-show="!isEdit">{{$api.getDateAll(formdata.userBirthday,'-')}}</span>
                        </el-form-item>
                        <!-- 手机号码 -->
                        <el-form-item label="手机号码：" prop="workerPhone">
                          <el-input v-model="formdata.workerPhone" v-show="isEdit"></el-input>
                          <span v-show="!isEdit" v-text='formdata.workerPhone'></span>
                        </el-form-item>
                        <!-- 政治面貌 -->
                        <el-form-item label="政治面貌：" prop="politicalOutlook">
                          <el-select class="ins-s-wf" v-model="formdata.politicalOutlook" @change="selValChangeFn(formdata.politicalOutlook,'politicalOutlook')" placeholder="请选择" v-show="isEdit" :disabled="true">
                            <el-option v-for="item in politicsStatusList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode">
                            </el-option>
                          </el-select>
                          <span v-show="!isEdit" v-text="formdata.politicalOutlookName"></span>
                        </el-form-item>
                        <!-- 民族 -->
                        <el-form-item label="民族：">
                          <el-select class="ins-s-wf" v-model="formdata.userNation" filterable @change="selValChangeFn(formdata.userNation,'userNation')" placeholder="请选择" v-show="isEdit" :disabled="isShow.nation === false">
                            <el-option v-for="item in nationalityList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode">
                            </el-option>
                          </el-select>
                          <span v-show="!isEdit" v-text="formdata.userNationName"></span>
                        </el-form-item>
                      </div>
										</el-col>
									</el-row>
								</div>
                <!-- 任职信息 -->
                <div class="form-item-con">
									<div class="item-title">
										<span>|</span>
										<span>任职信息</span>
									</div>
									<!-- 任职信息内容 -->
									<el-row>
										<el-col :span="9">
											<div class="item-content left-item">
												<!-- 任职岗位 -->
                        <el-form-item label="任职岗位：" prop="workerType">
                          <el-input :disabled="true" v-model="formdata.workerTypeName" v-show="isEdit"></el-input>
                          <span v-show="!isEdit">{{formdata.workerTypeName}}</span>
                        </el-form-item>
                        <!-- 教学资历 -->
                        <el-form-item label="教学资历：" v-if="formdata.workerTypeName==='教师'">
                          <el-date-picker type="date" class="ins-s-wf" value-format="timestamp" placeholder="选择日期" v-model="formdata.arg1"  v-show="isEdit"></el-date-picker>
                          <span v-show="!isEdit">{{teaching}}</span>
                        </el-form-item>
											</div>
										</el-col>
                    <el-col :span="9">
											<div class="item-content">
												<!-- 入职时间 -->
                        <el-form-item label="入职时间：">
                          <el-date-picker type="date" class="ins-s-wf" placeholder="选择日期" v-model="formdata.entryTime" :disabled="true" v-show="isEdit"></el-date-picker>
                          <span v-show="!isEdit">{{$api.getDateAll(formdata.entryTime,'-')}}</span>
                        </el-form-item>
                        <!-- 离职时间 -->
                        <el-form-item label="离职时间：">
                          <el-date-picker type="date" class="ins-s-wf" placeholder="选择日期" v-model="formdata.departureTime" disabled="" v-show="isEdit"></el-date-picker>
                          <span v-show="!isEdit">{{$api.getDateAll(formdata.departureTime,'-')}}</span>
                        </el-form-item>
											</div>
                    </el-col>
									</el-row>
                </div>
                <!-- 户籍信息 -->
								<div class="form-item-con">
									<div class="item-title">
										<span>|</span>
										<span>户籍信息</span>
									</div>
									<!-- 户籍信息内容 -->
									<el-row>
										<el-col :span="9">
											<div class="item-content left-item">
												<!-- 籍贯所在地 -->
                        <el-form-item label="籍贯所在地：">
                          <el-cascader class="ins-s-wf" placeholder="可搜索" v-model="formdata.nativeList" :options="cityList" :props="{value: 'label',children: 'children'}" filterable change-on-select v-show="isEdit"></el-cascader>
                          <span v-show="!isEdit">{{formdata.nativeList===undefined?'':formdata.nativeList.join('')}}</span>
                        </el-form-item>
                        <!-- 户口所在地 -->
                        <el-form-item label="户口所在地：">
                          <el-cascader class="ins-s-wf" placeholder="可搜索" v-model="formdata.householdsList" :options="cityList" :props="{value: 'label',children: 'children'}" filterable change-on-select v-show="isEdit"></el-cascader>
                          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formdata.householdsAddr" v-show="isEdit">
                          </el-input>
                          <span v-show="!isEdit">{{formdata.householdsList===undefined?'':formdata.householdsList.join('')}}{{formdata.householdsAddr}}</span>
                        </el-form-item>
											</div>
										</el-col>
                    <el-col :span="9">
											<div class="item-content">
												<!-- 现居住地址 -->
                        <el-form-item label="现居住地址：">
                          <el-cascader class="ins-s-wf" placeholder="可搜索" v-model="formdata.addressList" :options="cityList" :props="{value: 'label',children: 'children'}" filterable change-on-select v-show="isEdit"></el-cascader>
                          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formdata.addressAddr"  v-show="isEdit">
                          </el-input>
                          <span v-show="!isEdit">{{formdata.addressList===undefined?'':formdata.addressList.join('')}}{{formdata.addressAddr}}</span>
                        </el-form-item>
											</div>
                    </el-col>
									</el-row>
								</div>
              </el-form>
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
  </div>
</template>
<script src="./js/PerInfoManagement.js"></script>