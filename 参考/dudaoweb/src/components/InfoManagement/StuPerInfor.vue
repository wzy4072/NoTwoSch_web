<style scoped>
    .img-con >>> .el-upload{
        height:100%;
        width:100%;
    }
    .radioBox,.radioBox >>> .el-radio-button__inner{width:100%;}
    .radioBox >>> .el-radio-button{
        width:50%;
    }
</style>
<style scoped lang="less">
.img-con {
  border: 1px solid #c5c6c6;
  width: 155px;
  height: 205px;
  padding: 10px;
  position: relative;
}
.img-con img {
  background: #eee;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.img-con input {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.imgUpdata p {
  line-height: 20px;
  color: #767776;
}
.ins-content-con{
    width:100%;
    height:100%;
    overflow-y:auto;
    padding:20px;
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
            &.left-item{
                padding-right: 8%;
                border-right:1px dashed #c0c4cc;
            }
            &.right-item{
                padding-left: 4%;
                padding-right: 4%;
            }
            .img-con{
                .el-icon-plus.avatar-uploader-icon{
                    font-size: 50px;
                    font-weight: normal;
                    position: relative;
                    top: 50%;
                    margin-top: -25px;
                }
            }
        }
    }
}
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'学生个人信息管理'"></returnBtn>
            <!-- tab页 -->
            <div class="ins-tab-label">
                <!-- tab页 -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="first"></el-tab-pane>
                    <el-tab-pane label="家长信息" name="second"></el-tab-pane>
                    <el-tab-pane label="户籍信息" name="third"></el-tab-pane>
                    <el-tab-pane label="其他信息" name="fourth"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
                <div class="ins-page-btn">
                    <div class="ins-opa-btn">
                        <el-button type="warning" size="small" v-show="isEdit==false" @click="edit()">编辑</el-button>
                        <el-button type="success" size="small" v-show="isEdit==true" @click="submitForm('AForm')">保存</el-button>
                        <el-button type="primary " size="small" v-show="isEdit==true" @click="resetForm('AForm')">取消</el-button>
                    </div>
                </div>
                <!-- 页面主体 -->
                <div class="ins-page-main">
                    <div class="ins-content">
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span>学生信息</span>
                        </div>
                        <div class="ins-content-con" id="formBox">
                            <el-form :model="ruleForm" :rules="rules" ref="AForm" label-width="145px">
                                <!-- 基本信息 -->
                                <div class="form-item-con">
                                    <div id="first" class="item-title">
                                        <span>|</span>
                                        <span>基本信息</span>
                                    </div>
                                    <!-- 基本信息内容 -->
                                    <el-row>
                                        <el-col :span="10">
                                            <div class="item-content left-item">
                                                <el-form-item label="姓名：">
                                                    <el-input v-show="isEdit" v-model="ruleForm.studentName" :disabled="true"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.studentName'></span>
                                                </el-form-item>
                                                <el-form-item label="性别：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentGenderName" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="男" style='width:50%;text-align:center;'>
                                                            <i class="man"></i>男</el-radio-button>
                                                        <el-radio-button label="女" style='width:50%;text-align:center;'>
                                                            <i class="woman"></i>女</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='ruleForm.studentGenderName'></span>
                                                </el-form-item>
                                                <el-form-item label="年级：" prop="gread">
                                                    <el-input v-show="isEdit" v-model="ruleForm.gradeName" :disabled="true"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.gradeName'></span>
                                                </el-form-item>
                                                <el-form-item label="年级代码：">
                                                    <span v-text="ruleForm.gradeCode"></span>
                                                </el-form-item>
                                                <el-form-item label="班级：" prop="class">
                                                    <el-input v-show="isEdit" v-model="ruleForm.className" :disabled="true"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.className'></span>
                                                </el-form-item>
                                                <el-form-item label="班级座号：">
                                                    <el-input v-show="isEdit" v-model="ruleForm.seatNum" :disabled="true"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.seatNum'></span>
                                                </el-form-item>
                                                <el-form-item label="入学日期：">
                                                    <span v-text='ruleForm.entranceDateStr'></span>
                                                </el-form-item>
                                                <el-form-item label="入学代码：">
                                                    <span v-text="ruleForm.entranceCode"></span>
                                                </el-form-item>
                                                <el-form-item label="出生日期：" prop="userBirthdayStr">
                                                    <el-date-picker v-show="isEdit" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="ruleForm.userBirthdayStr" style="width: 100%;"></el-date-picker>
                                                    <span v-show="!isEdit" v-text='ruleForm.userBirthdayStr'></span>
                                                </el-form-item>
                                                <el-form-item label="证件类型：">
                                                    <el-select v-show="isEdit" v-model="ruleForm.certificatesType" placeholder="请选择证件类型" style="width:100%">
                                                        <el-option label="身份证" :value="1"></el-option>
                                                        <el-option label="香港特区护照/身份证" :value="2"></el-option>
                                                        <el-option label="澳门特区护照/身份证" :value="3"></el-option>
                                                        <el-option label="台湾居民来往大陆通行证" :value="4"></el-option>
                                                        <el-option label="护照" :value="5"></el-option>
                                                        <el-option label="其他" :value="6"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='certificatesType[ruleForm.certificatesType]'></span>
                                                </el-form-item>
                                                <el-form-item label="证件号码：" prop="certificatesNum">
                                                    <el-input v-show="isEdit" v-model="ruleForm.certificatesNum"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.certificatesNum'></span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="10">
                                            <div class="item-content right-item">
                                                <el-form-item label="电子照片：">
                                                    <div class="img-con">
                                                        <img v-if="ruleForm.userPhoto" v-show="!isEdit" :style="{'background-image':'url('+ruleForm.userPhoto2+')'}" class="avatar">
                                                        <el-upload v-show="isEdit" name="FILE" :headers="token" class="ins-s-wf ins-s-hf" :action="baseUrl+'baseInfo/stuInfo/updateInfoImg'" :show-file-list="false" :on-success="handleAvatarSuccess" :on-change="onChangeUpload" :auto-upload="false" ref="upload">
                                                            <img v-if="ruleForm.userPhoto"  :style="{'background-image':'url('+ruleForm.userPhoto2+')'}" class="avatar">
                                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                        </el-upload>
                                                    </div>
                                                    <div class="imgUpdata" v-show="isEdit">
                                                        <p>大小要求：不超过2Mb</p>
                                                        <p>建议尺寸：300px*400px</p>
                                                        <el-button type="primary" size="mini" @click="submitUpload()">上传照片</el-button>
                                                    </div>
                                                </el-form-item>
                                                <el-form-item label="民族：">
                                                    <el-select v-show="isEdit" v-model="ruleForm.userNation" placeholder="请选择民族" filterable style="width:100%;">
                                                        <el-option v-for="(v,k) in national" :key="k" :label="v.lable" :value="v.value"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='ruleForm.userNationName'></span>
                                                </el-form-item>
                                                <el-form-item label="身高：" prop="studentHeight">
                                                    <el-input v-show="isEdit" v-model="ruleForm.studentHeight">
                                                        <template slot="append">cm</template>
                                                    </el-input>
                                                    <span v-show="!isEdit" v-text="ruleForm.studentHeight?(ruleForm.studentHeight+'cm'):''"></span>
                                                </el-form-item>
                                                <el-form-item label="血型：">
                                                    <el-select v-show="isEdit" v-model="ruleForm.bloodType" placeholder="请选择血型" style="width:100%">
                                                        <el-option label="A型" value="A型"></el-option>
                                                        <el-option label="B型" value="B型"></el-option>
                                                        <el-option label="AB型" value="AB型"></el-option>
                                                        <el-option label="O型" value="O型"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='ruleForm.bloodType'></span>
                                                </el-form-item>
                                                <el-form-item label="健康状况：">
                                                    <el-select v-show="isEdit" v-model="ruleForm.studentHealth" placeholder="请选择健康状况" style="width:100%;">
                                                        <el-option label="健康" :value="1"></el-option>
                                                        <el-option label="良好" :value="2"></el-option>
                                                        <el-option label="一般" :value="3"></el-option>
                                                        <el-option label="较差" :value="4"></el-option>
                                                        <el-option label="差" :value="5"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='studentHealth[ruleForm.studentHealth]'></span>
                                                </el-form-item>
                                                <el-form-item label="孩子第几胎：" prop="childrenListIndex">
                                                    <el-input v-show="isEdit" v-model="ruleForm.childrenListIndex" placeholder="请输入正整数"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.childrenListIndex'></span>
                                                </el-form-item>
                                                <el-form-item label="家庭子女人数：" prop="childrenListSize">
                                                    <el-input v-show="isEdit" v-model="ruleForm.childrenListSize" placeholder="请输入正整数"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.childrenListSize'></span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <!-- 家长信息 -->
                                <div class="form-item-con">
                                    <div id="second" class="item-title">
                                        <span>|</span>
                                        <span>家长信息</span>
                                    </div>
                                    <!-- 家长信息内容 -->
                                    <el-row>
                                        <el-col :span="10">
                                            <div class="item-content left-item">
                                                <el-form-item label="家长姓名：">
                                                    <el-input v-show="isEdit" v-model="ruleForm.parentName"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.parentName'></span>
                                                </el-form-item>
                                                <el-form-item label="家长关系：">
                                                    <el-input v-show="isEdit" v-model="ruleForm.parentRelationship"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.parentRelationship'></span>
                                                </el-form-item>
                                                <el-form-item label="家长联系电话：" prop="contactTele">
                                                    <el-input v-show="isEdit" v-model="ruleForm.contactTele"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.contactTele'></span>
                                                </el-form-item>
                                                <el-form-item label="家长工作单位：">
                                                    <el-input v-show="isEdit" v-model="ruleForm.workUnit"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.workUnit'></span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="10">
                                            <div class="item-content right-item">
                                                <el-form-item label="家长是否为监护人：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.isGuardian" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.isGuardian]'></span>
                                                </el-form-item>
                                                <el-form-item label="家长证件类型：" prop="gread">
                                                    <el-select v-show="isEdit" v-model="ruleForm.parentIdType" placeholder="请选择证件类型" style="width:100%">
                                                        <el-option label="居民身份证" :value="1"></el-option>
                                                        <el-option label="护照" :value="2"></el-option>
                                                        <el-option label="其他" :value="3"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='parentIdType[ruleForm.parentIdType]'></span>
                                                </el-form-item>
                                                <el-form-item label="家长证件号码：" prop="parentIdNum">
                                                    <el-input v-show="isEdit" v-model="ruleForm.parentIdNum"></el-input>
                                                    <span v-show="!isEdit" v-text='ruleForm.parentIdNum'></span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <!-- 户籍信息 -->
                                <div class="form-item-con">
                                    <div id="third" class="item-title">
                                        <span>|</span>
                                        <span>户籍信息</span>
                                    </div>
                                    <!-- 户籍信息内容 -->
                                    <el-row>
                                        <el-col :span="10">
                                            <div class="item-content left-item">
                                                <el-form-item label="户口性质：">
                                                    <el-select v-show="isEdit" v-model="ruleForm.householdsType" placeholder="请选户口性质" style="width:100%">
                                                        <el-option label="农业户口" value="1"></el-option>
                                                        <el-option label="非农业户口" value="2"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='householdsType[ruleForm.householdsType]'></span>
                                                </el-form-item>
                                                <el-form-item label='户口所在地：'>
                                                    <el-cascader v-show="isEdit" expand-trigger='hover' :options='cityOptions' :props="{value: 'label'}" v-model='ruleForm.address1' style='width:100%;'>
                                                    </el-cascader>
                                                    <span v-show="!isEdit" v-text='ruleForm.address1?ruleForm.address1.join("")+ruleForm.householdsAddr:ruleForm.householdsAddr'></span>
                                                </el-form-item>
                                                <el-form-item label="">
                                                    <el-input v-show="isEdit" type="textarea" v-model="ruleForm.householdsAddr" placeholder="请输入详细地址"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="10">
                                            <div class="item-content right-item">
                                                <el-form-item label='现居住地址：'>
                                                    <el-cascader v-show="isEdit" expand-trigger='hover' :options='cityOptions' :props="{value: 'label'}" v-model='ruleForm.address2' style='width:100%;'>
                                                    </el-cascader>
                                                    <span v-show="!isEdit" v-text='ruleForm.address2?ruleForm.address2.join("")+ruleForm.addressAddr:ruleForm.addressAddr'></span>
                                                </el-form-item>
                                                <el-form-item label="">
                                                    <el-input v-show="isEdit" type="textarea" v-model="ruleForm.addressAddr" placeholder="请输入详细地址"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <!-- 其他信息 -->
                                <div class="form-item-con">
                                    <div id="fourth" class="item-title">
                                        <span>|</span>
                                        <span>其他信息</span>
                                    </div>
                                    <!-- 其他信息内容 -->
                                    <el-row>
                                        <el-col :span="10">
                                            <div class="item-content left-item">
                                                <el-form-item label="是否港澳台侨外：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentGatqw" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.studentGatqw]'></span>
                                                </el-form-item>
                                                <el-form-item label="是否留守儿童：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentLeftBehine" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.studentLeftBehine]'></span>
                                                </el-form-item>
                                                <el-form-item label="是否进城务工人员随迁子女：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentRuralUrbanChild" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.studentRuralUrbanChild]'></span>
                                                </el-form-item>
                                                <el-form-item label="是否孤儿：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentOrphan" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.studentOrphan]'></span>
                                                </el-form-item>
                                                <el-form-item label="是否烈士/优抚子女：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentMartyr" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.studentMartyr]'></span>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="10">
                                            <div class="item-content right-item">
                                                <el-form-item label="是否残障儿童：">
                                                    <el-radio-group v-show="isEdit" v-model="ruleForm.studentDisableType" class="radioBox" size="small" style="width:100%;">
                                                        <el-radio-button label="1" style='width:50%;text-align:center;'>是</el-radio-button>
                                                        <el-radio-button label="0" style='width:50%;text-align:center;'>否</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isEdit" v-text='yesOrNo[ruleForm.studentDisableType]'></span>
                                                </el-form-item>
                                                <el-form-item label="上下学交通方式：">
                                                    <el-select v-show="isEdit" v-model="ruleForm.studentTransborationType" placeholder="请选择交通方式" style="width:100%">
                                                        <el-option label="家长接送" :value="1"></el-option>
                                                        <el-option label="校车接送" :value="2"></el-option>
                                                        <el-option label="其他" :value="3"></el-option>
                                                    </el-select>
                                                    <span v-show="!isEdit" v-text='studentTransborationType[ruleForm.studentTransborationType]'></span>
                                                </el-form-item>
                                                <el-form-item label="上下学交通距离：" prop="studentDistance">
                                                    <el-input v-show="isEdit" v-model="ruleForm.studentDistance" placeholder="请输入正整数">
                                                        <template slot="append">千米</template>
                                                    </el-input>
                                                    <span v-show="!isEdit" v-text="ruleForm.studentDistance?(ruleForm.studentDistance+'千米'):''"></span>
                                                </el-form-item>
                                            </div>
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
<script src="./js/StuPerInfor.js"></script>


