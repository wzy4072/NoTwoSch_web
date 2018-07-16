
<style scoped>
    .radioBox >>> .el-radio-button__inner { width: 100%; }
</style>
<style scoped lang='less'>
    .form-item-con{
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
			<returnBtn :title="'教育局用户信息编辑'"></returnBtn>
        </div>
        <div class="ins-page-con">
			<div class="ins-page-type type1">
				<div class="ins-page-btn" >
					<div class="ins-opa-btn">        
                        <el-button certificatesType="primary" size="small"   v-if="isShowItem===0"  @click="submit('form')">确认提交</el-button>  
                        <el-button certificatesType="warning" size="small" v-if="isShowItem===1" @click="close()">关闭</el-button>
                        <el-button certificatesType="danger" size="small"  v-if="isShowItem===2" @click="edit()">编辑</el-button>
                        <el-button certificatesType="primary" size="small"  v-if="isShowItem===3" @click="submit('form')">保存</el-button>
                        <el-button certificatesType="warning" size="small"  v-if="isShowItem===3" @click="cancel()">取消</el-button>
                    </div>
                </div>
                <div class="ins-page-main">
                    <div class="ins-content">
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span>信息编辑表</span>
                        </div>
                        <div class="ins-content-con ins-s-ofx-a">
                            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                                <div class="form-item-con">
                                    <el-row>
										<el-col :span="9">
											<div class="item-content left-item">
                                                <el-form-item label="姓名：" prop="superintendentName">
                                                    <el-input v-model="form.superintendentName" v-show="isShow" placeholder="请输入姓名"></el-input>
                                                    <span v-show="!isShow">{{form.superintendentName}}</span>
                                                </el-form-item>
                                                <el-form-item label="性别：" prop="superintendentGender">
                                                    <el-radio-group v-model="form.superintendentGender" v-show="isShow" class="radioBox ins-s-wf" size="medium">
                                                        <el-radio-button label="1" class="ins-s-wfh ins-s-tc">男</el-radio-button>
                                                        <el-radio-button label="0" class='ins-s-wfh ins-s-tc'>女</el-radio-button>
                                                    </el-radio-group>
                                                    <span v-show="!isShow">{{form.superintendentGender===1?'男':'女'}}</span>
                                                </el-form-item>
                                                <el-form-item label="职务：" prop="superintendentPosition">
                                                    <el-select class="ins-s-wf" v-model="form.superintendentPosition" v-show="isShow" placeholder="请选择职务" @change='changejob(form.superintendentPosition)'>
                                                        <el-option v-for="(item,key) in jobOptions" :key="key" :label="item.dictName" :value="item.dictCode"></el-option>
                                                    </el-select>
                                                    <span v-show="!isShow">{{form.superintendentPositionName}}</span>
                                                </el-form-item>
											</div>
										</el-col>
                                        <el-col :span="9">
											<div class="item-content right-item">
                                                <el-form-item label="手机号码：" prop="superintendentTel">
                                                    <el-input  v-show="isShow" v-model="form.superintendentTel"  placeholder="请输入手机号码"></el-input>
                                                    <span v-show="!isShow">{{form.superintendentTel}}</span>
                                                </el-form-item>
                                                <el-form-item label="证件类型："  prop="certificatesType">
                                                    <el-select v-show="isShow" class="ins-s-wf" v-model="form.certificatesType" placeholder="请选择证件类型">
                                                        <el-option v-for="(item,key) in certificatesTypeOptions" :key="key" :label="item.label" :value="item.value"></el-option>
                                                    </el-select>
                                                    <span v-show="!isShow">{{form.certificatesType==1?'居民身份证':form.certificatesType==2?'香港特区护照':form.certificatesType==3?'澳门特区护照':form.certificatesType==4?'护照':''}}</span>
                                                </el-form-item>
                                                <el-form-item label="证件号码：" prop="certificatesNum">
                                                    <el-input v-show="isShow" v-model="form.certificatesNum" placeholder="请选择证件号码" ></el-input>
                                                    <span v-show="!isShow">{{form.certificatesNum}}</span>
                                                </el-form-item>
											</div>
										</el-col>
                                    </el-row>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </div>
                <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
                    <p class="failInfo">取消后已填内容不会被保存确认取消编辑？</p>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="confrimCancel()">确定取消</el-button>
                        <el-button certificatesType="primary" @click="dialogVisible = false">继续编辑</el-button>
                    </span>
                </el-dialog>
            </div> 
        </div>
    </div>
</template>
<script src="./js/EduInfoSupplement.js"></script>