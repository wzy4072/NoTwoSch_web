<style scoped>
    .upload-tip{
        padding:20px;
        font-size: 14px;
        color: #606266;
        line-height:40px;
        border:1px solid #ebeef5;
        height:100%;
    }
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
			<returnBtn :title="'批量导入'"></returnBtn>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
				<div class="ins-page-btn">
					<div class="ins-opa-btn">
                        <el-button type="warning" size="small" v-show="!isEdit" icon="el-icon-download">
                            <a v-bind:href="urlName">下载模板</a>
                        </el-button>
                        <el-upload class="ins-s-dpib ins-s-ml-10 ins-s-mr-10" name="FILE" :auto-upload="true" :before-upload="beforeAvatarUpload" :action="UploadUrl()"  v-show="!isEdit" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :show-file-list="false">
                            <el-button type="primary" size="small" icon="el-icon-upload">点击上传</el-button>
                        </el-upload>
                        <el-button type="success" size="small" v-show="isEdit" @click="savefun()">保存</el-button>
                        <el-button type="primary" size="small" v-show="isEdit" @click="dialogVisible=true">取消</el-button>
                    </div>
                </div>
                <div class="ins-page-main">
                    <div class="ins-table">
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span>信息补录表</span>
                        </div>
                        <div class="ins-tab-con">
                            <el-table v-show="isEdit" :data='previewdata' border stripe height="100%" style="width: 100%;height:100%">
                                <el-table-column v-for="(v,k) in scrColumn" :key="k" :prop="v.field" v-if="v.selected" align="center" :width="v.width" header-align="center" sortable :label="v.text">
                                </el-table-column>
                            </el-table>
                            <div class="upload-tip" v-show='!isEdit'>
                                1、*姓名：必填，不能重复，如果系统中已存在该姓名，请添加后缀以区分；<br/>
                                2、*性别：必填；<br/>
                                3、*职务：必填，内容须与系统职务列表（基本信息配置）一致，否则不能导入；<br/>
                                4、*手机号码：必填；<br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
                <p class="failInfo">确认取消上传?</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel()">确定</el-button>
                    <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                </span>
            </el-dialog>
            <!-- 弹框 -->
            <el-dialog title="信息填写有误名单" :visible.sync="missListLayer" width="80%">
                <div class="miss-layer">
                    <el-table id="missTable" :data='missList' border stripe height="500px">
                        <el-table-column type="index" width="70px" label="序号" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="superintendentName" label="姓名"  align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="superintendentGendername" label="性别"  align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="superintendentPositionName"  label="职务" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="superintendentTel"  label="手机号码" align="center" header-align="center" sortable>
                        </el-table-column>
                        <el-table-column prop="errorDescription" show-overflow-tooltip label="错误描述" align="center" header-align="center" sortable>
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/EduInfoImport.js"></script>
