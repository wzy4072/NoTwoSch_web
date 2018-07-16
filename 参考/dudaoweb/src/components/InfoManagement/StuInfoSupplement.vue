<style scoped>
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
</style>
<style>
.radioBox .el-radio-button--small .el-radio-button__inner {
  padding-left: 40px;
  padding-right: 40px;
}
.radioBox .el-radio-button--small .el-radio-button__inner {
  width: 100%;
}
</style>

<template>
    <div class="ins-container pd3">
        <div>
            <!-- 搜索栏 -->
            <div class="ins-page-search">
                <div class="ins-search-con">
                    <el-button type="success" size="medium" @click="submitForm('AForm')">确认提交</el-button>
                </div>
            </div>
        </div>

        <!-- 页面主体 -->
        <div class="ins-page-main">
            <div class="ins-tab-con" style="padding-bottom:0">
                <!-- 表格标题+表格功能 -->
                <div class="ins-tab-title">
                    <span>
                        <span class="el-icon-menu">
                        </span>
                        <span class="com_fs_4">
                            信息补录表
                        </span>
                    </span>
                </div>
                <!-- 表格内容 -->
                <div class="com_h_full" id="formBox" style="overflow:auto;padding:30px 80px">
                    <!-- 表单内容 -->
                    <el-form :model="ruleForm" :rules="rules" ref="AForm" label-width="200px" class="demo-ruleForm">
                        <el-row :gutter="100">
                            <el-col :span="12">
                                <el-form-item label="姓名:" prop="studentName">
                                    <el-input v-model="ruleForm.studentName"></el-input>
                                </el-form-item>
                                <el-form-item label="性别:" prop="studentGenderName">
                                    <el-radio-group v-model="ruleForm.studentGenderName" class="radioBox" size="small" style="width:100%;">
                                        <el-radio-button label="男" style='width:50%;text-align:center;'>
                                            <i class="man"></i>男</el-radio-button>
                                        <el-radio-button label="女" style='width:50%;text-align:center;'>
                                            <i class="woman"></i>女</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="入学日期:" prop="entranceDate">
                                    <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="ruleForm.entranceDate" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="入学代码:" prop="entranceCode">
                                    <el-input v-model="ruleForm.entranceCode"><template slot="prepend">Y</template></el-input>
                                </el-form-item>
                                <el-form-item label="年级:" prop="gradeCode">
                                    <el-select v-model="ruleForm.gradeCode" @change="changeGread" placeholder="请选择年级" style="width:100%">
                                        <el-option :label="v.gradeName" :value="v.gradeCode" v-for="(v,k) in infoData.greadList" :key="k"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="年级代码:">                                   
                                    <el-input v-model="ruleForm.gradeCode" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="班级:" prop="classCode">
                                    <el-select v-model="ruleForm.classCode" placeholder="请选择班级" style="width:100%">
                                        <el-option :label="v.className" :value="v.classCode" v-for="(v,k) in infoData.classList" :key="k"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="班级座号:" prop="seatNum">
                                    <el-input v-model="ruleForm.seatNum"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--/////////  左右分割 ////////-->
                            <el-col :span="12" style="padding-left:30px;border-left:dashed 1px #ccc">
                                <el-form-item label="证件类型:">
                                    <el-select v-model="ruleForm.certificatesType" placeholder="请选择证件类型" style="width:100%">
                                        <el-option label="身份证" :value="1"></el-option>
                                        <el-option label="香港特区护照/身份证" :value="2"></el-option>
                                        <el-option label="澳门特区护照/身份证" :value="3"></el-option>
                                        <el-option label="台湾居民来往大陆通行证" :value="4"></el-option>
                                        <el-option label="护照" :value="5"></el-option>
                                        <el-option label="其他" :value="6"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="证件号码:" prop="certificatesNum">
                                    <el-input v-model="ruleForm.certificatesNum"></el-input>
                                </el-form-item>
                                <el-form-item label="出生日期:" prop="userBirthday">
                                    <el-date-picker type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" v-model="ruleForm.userBirthday" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="民族:">
                                    <el-select v-model="ruleForm.userNationName" placeholder="请选择民族" filterable style="width:100%;">
                                        <el-option v-for="(v,k) in infoData.national" :key="k" :label="v" :value="v"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label='现居住地址:'>
                                    <el-cascader expand-trigger='hover' :options='infoData.cityOptions' :props="{value: 'label'}" v-model='ruleForm.address' style='width:100%;'>
                                    </el-cascader>
                                </el-form-item>

                                <el-form-item label="">
                                    <el-input type="textarea" v-model="ruleForm.addressAddr" placeholder="请输入详细地址"></el-input>
                                </el-form-item>
                                <el-form-item label="家长联系电话:" prop="contactTele">
                                    <el-input v-model="ruleForm.contactTele"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>

                    <!-- 表单内容 -->

                </div>
                <!-- 分页栏 -->
            </div>
            <!-- 其他 -->
            <div>
            </div>
        </div>
    </div>
</template>
<script src="./js/StuInfoSupplement.js"></script>

 
