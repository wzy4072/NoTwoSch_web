<style scoped>
.form-title{position: relative; height: 40px;}
.form-title span{ font-size: 18px; width: 124px;text-align: center;display: block;position: absolute;top: -10px;left: 0px;background: rgb(255, 255, 255);}
.lines{ border-bottom: 1px solid #dcdfe6;    margin-top: 25px;}
span{
  color:#606266;
}
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
.formTitle span{color: #fff;}
.partTitle {
  padding: 20px 20px;
}
.partTitle > h4 {
  padding: 0px 7px;
  border-left: 4px solid #538cff;
  color: #6e6e6e;
}
.radioBox .man {
  width: 16px;
  height: 16px;
  margin: 0 10px;
  margin-bottom: -3px;
  background: url("../../assets/images/man1.svg") no-repeat 0px 0px;
  background-size: 100%;
  display: inline-block;
}
.radioBox .is-active .man {
  background: url("../../assets/images/man2.svg") no-repeat 0px 0px;
  background-size: 100%;
}
.radioBox .woman {
  width: 16px;
  height: 16px;
  margin: 0 10px;
  margin-bottom: -3px;
  background: url("../../assets/images/woman1.svg") no-repeat 0px 0px;
  background-size: 100%;
  display: inline-block;
}
.radioBox .is-active .woman {
  background: url("../../assets/images/woman2.svg") no-repeat 0px 0px;
  background-size: 100%;
}
.radioBox>>>.el-radio-button__inner {
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
}
</style>
<template>
  <div class="ins-container">
      <!-- 面包屑导航 -->
        <div class="ins-tab-label">
       </div>
<div class="ins-page-search" style="margin: 5px;">
    <div class="ins-search-con">
            <el-button icon="el-icon-check" size="medium" type="success" v-show="ruleForm.isEdit==0" @click="submitForm('ruleForm')">
                保存
            </el-button>
            <el-button icon="el-icon-edit-outline" size="medium" type="success" v-show="ruleForm.isEdit==1" @click="editInfo">
                编辑
            </el-button>
             <el-button icon="el-icon-close" size="medium" type="danger" v-show="isdisable"  @click="cancelInfo(ruleForm.isEdit)">
                取消
            </el-button>
    </div>
</div>
<el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
<p class="failInfo">取消后已填所有内容不会被保存</p>
<p class="failInfo">确认取消编辑?</p>
<span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">确定取消</el-button>
    <el-button type="primary" @click="dialogVisible = false">继续编辑</el-button>
</span>
</el-dialog>
 <div class="ins-page-main" style="position: relative;">
   <div class="ins-tab-con">
   <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <i class="com_fs_4">
                        信息补录表
                    </i>
                </span>
            </div>
           <!-- 表格内容 -->
            <div class="com_h_full">
                <!-- 表格内容 -->
               <div class="form-title"><span>基本信息</span><div class="lines"></div></div>
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="姓名:" prop="workerName" v-show="ruleForm.isEdit==0">
                            <el-input v-model="ruleForm.workerName"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.workerName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="出生日期:" prop="userBirthday" v-show="ruleForm.isEdit==0">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.userBirthday" style="width: 100%;"> 
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="出生日期:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.userBirthday|changeBirthday}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                         <!-- <el-col :span="11">
                            <el-form-item label="性别:" prop="workerGender" v-show="ruleForm.isEdit==0">
                                    <el-radio-group  v-model="ruleForm.workerGender" class="radioBox" size="small" >
                                        <el-radio-button label="1" style='width:50%;text-align:center;'>
                                            <i class="man"></i>男</el-radio-button>
                                        <el-radio-button label="0" style='width:50%;text-align:center;'>
                                            <i class="woman"></i>女</el-radio-button>
                                            
                                    </el-radio-group>
                                </el-form-item>
                            <el-form-item label="性别:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.workerGender==1?'男':'女' }}</span>
                            </el-form-item>
                        </el-col> -->
                            <el-col :span="11">
                                <el-form-item label="性别:" prop="workerGender">
                                <el-radio-group v-model="ruleForm.workerGender" class="radioBox" size="small" style="width:100%;"v-show="ruleForm.isEdit==0" >
                                    <el-radio-button label="1" style='width:50%;text-align:center;'>
                                    <i class="man"></i>男
                                    </el-radio-button>
                                    <el-radio-button label="0" style='width:50%;text-align:center;'>
                                    <i class="woman"></i>女
                                    </el-radio-button>
                                </el-radio-group>
                                <span v-show="ruleForm.isEdit==1">{{ruleForm.workerGender===1?'男':'女'}}</span>
                                </el-form-item>
                            </el-col>
                        <el-col :span="11">
                            <el-form-item label="手机号码" prop="workerPhone" v-show="ruleForm.isEdit==0">
                                   <el-input v-model="ruleForm.workerPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.workerPhone }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                      <el-row>
                        <el-col :span="11">
                            <el-form-item label="证件类型:" prop="certificatesType" v-show="ruleForm.isEdit==0">
                             <el-select v-model="ruleForm.certificatesType" placeholder="请选择证件类型" size="large" class="com_w_full">
                                  <el-option  v-for="item in allOptions.certificOptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                              </el-select><!-- {{ruleForm.certificatesType}} -->
                            </el-form-item>
                            <el-form-item label="证件类型:"  v-show="ruleForm.isEdit==1">
                              <span>{{ruleForm.certificatesType==1?'身份证':ruleForm.certificatesType==2?'香港特区护照':ruleForm.certificatesType==3?'澳门特区护照':ruleForm.certificatesType==4?'台湾居民来往大陆通行证':ruleForm.certificatesType==5?'护照':'其他' }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="政治面貌:" prop="politicalOutlook" v-show="ruleForm.isEdit==0">
                               <el-select class="com_w_full" v-model="ruleForm.politicalOutlook" placeholder="请选择政治面貌" @change="selValChangeFn(ruleForm.politicalOutlook,'.politicalOutlookName')">
                                <el-option v-for="item in allOptions.politicalOptions"
                                    :key="item.dictCode"
                                    :label="item.dictValue"
                                    :value="item.dictCode">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="政治面貌:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.politicalOutlookName}}</span>
                            </el-form-item>
                        </el-col>
                      </el-row>
                       <el-row>
                                <el-col :span="11">
                            <el-form-item label="证件号码:" prop="certificatesNum" v-show="ruleForm.isEdit==0">
                            <el-input v-model="ruleForm.certificatesNum"></el-input>
                            </el-form-item>
                            <el-form-item label="证件号码:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.certificatesNum }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="民族:" prop="" v-show="ruleForm.isEdit==0">
                               <el-select class="com_w_full" v-model="ruleForm.userNation" placeholder="请选择民族" @change="selValChangeFn(ruleForm.userNation,'userNationName')">
                               <el-option
                                    v-for="item in allOptions.nationOptions"
                                    :key="item.dictCode"
                                    :label="item.dictValue"
                                    :value="item.dictCode">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="民族:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.userNationName }}</span>
                            </el-form-item>
                        </el-col>
                       </el-row>
                         <el-row>
                         <el-col :span="11">
                             <el-form-item label="最高学历:" v-show="ruleForm.isEdit==0">
                                <el-select class="com_w_full" v-model="ruleForm.highestEducation" placeholder="请选择活动区域" @change="selValChangeFn(ruleForm.highestEducation,'highestEducationName')">
                                <el-option
                                    v-for="item in allOptions.educationOptions"
                                    :key="item.dictCode"
                                    :label="item.dictValue"
                                    :value="item.dictCode">
                                </el-option>
                                </el-select>
                            </el-form-item>
                              <el-form-item label="最高学历:"  v-show="ruleForm.isEdit==1">
                              <span>{{ ruleForm.highestEducationName }}</span>
                            </el-form-item>
                        </el-col>
                        </el-row>
                     <div class="form-title"><span>任职信息</span><div class="lines"></div></div>
                       <el-row>
                        <el-col :span="11">
                            <el-form-item label="任职岗位:" prop="workerType" v-show="ruleForm.isEdit==0">
                             <el-select class="com_w_full" v-model="ruleForm.workerType" placeholder="请选择活动区域" @change="selValChangeFn(ruleForm.workerType,'workerTypeName')">
                                <el-option
                                    v-for="item in allOptions.workerTypeOptions"
                                    :key="item.dictCode"
                                    :label="item.dictValue"
                                    :value="item.dictCode">
                                </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="任职岗位:" prop="workerType" v-show="ruleForm.isEdit==1">
                             <span>{{ruleForm.workerTypeName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="入职时间:"  prop="" v-show="ruleForm.isEdit==0" >
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.entryTime" style="width: 100%;"> 
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item  label="入职时间:" prop="" v-show="ruleForm.isEdit==1">
                                <span>{{ruleForm.entryTime|changeBirthday}}</span>
                            </el-form-item>
                        </el-col>
                       </el-row>
                         <el-row>
                        
                         <el-col :span="11">
                            <el-form-item label="任教科目:" prop="" v-show="ruleForm.isEdit==0">
                               <el-select class="com_w_full" v-model="ruleForm.workerCourses" placeholder="请选择活动区域">
                                <el-option
                                    v-for="item in allOptions.CoursesOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item  label="任教科目:" prop="" v-show="ruleForm.isEdit==1">
                                <span>{{ruleForm.workerCourseString}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="离职时间:" prop="" v-show="ruleForm.isEdit==0">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.departureTime" style="width: 100%;"> 
                                </el-date-picker>
                            </el-form-item>
                             <el-form-item  label="离职时间:" prop="" v-show="ruleForm.isEdit==1">
                                <span>{{ruleForm.departureTime|changeBirthday}}</span>
                            </el-form-item>
                        </el-col>
                         </el-row>
                      <div class="form-title"><span>户籍信息</span><div class="lines"></div></div>
                      <el-row>
                      <el-col :span="11">
                               <el-form-item label="籍贯所在地" prop=""  v-show="ruleForm.isEdit==0">
                                <el-cascader  class="com_w_full" :options="cityList"v-model="ruleForm.nativeList" :props="{value: 'label',children: 'children'}" filterable change-on-select>
                                </el-cascader>
                            </el-form-item>
                             <el-form-item  label="籍贯所在地:" prop="" v-show="ruleForm.isEdit==1">
                                <span>{{ruleForm.nativeList===undefined?'':ruleForm.nativeList.join('')}}</span>
                            </el-form-item>
                        </el-col>
                        </el-row>
                        <el-row>
                        <el-col :span="11">
                            <el-form-item label="户口所在地:" prop=""  v-show="ruleForm.isEdit==0">
                                <el-cascader class="com_w_full"  :options="cityList" v-model="ruleForm.householdsList":props="{value: 'label',children: 'children'}"  filterable change-on-select>
                                </el-cascader>
                                <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  placeholder="请输入内容" v-model="ruleForm.householdsAddr" style="margin-top:10px;">
                                </el-input>
                            </el-form-item>
                              <el-form-item  label="户口所在地:" prop="" v-show="ruleForm.isEdit==1">
                                <p>{{ruleForm.householdsList===undefined?'':ruleForm.householdsList.join('')}}</p>
                                 <p>{{ruleForm.householdsAddr}}</p>
                            </el-form-item>
                        </el-col>
                          <el-col :span="11">
                            <el-form-item label="现居住地址:" prop="" v-show="ruleForm.isEdit==0">
                              <el-cascader class="com_w_full"  :options="cityList" v-model="ruleForm.addressList" :props="{value: 'label',children: 'children'}" filterable change-on-select>
                                </el-cascader>
                                <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  placeholder="请输入内容" v-model="ruleForm.presentAddress" style="margin-top:10px;">
                                </el-input>
                            </el-form-item>
                             <el-form-item  label="现居住地址:" prop="" v-show="ruleForm.isEdit==1">
                                <p>{{ruleForm.addressList===undefined?'':ruleForm.addressList.join('')}}</p>
                                 <p>{{ruleForm.addressAddr}}</p>
                            </el-form-item>
                        </el-col>
                        </el-row>
                    </el-form>

            </div>
             <!-- 分页栏 -->
     </div>
 </div>
</div>
</template>
<script src="./js/StaffInfoSupplement.js"></script>