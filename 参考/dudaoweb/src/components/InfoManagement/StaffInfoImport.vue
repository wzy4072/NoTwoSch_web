<style scoped>
.updata-tip{
    padding: 10px 20px;
    font-size: 14px;
    color: #606266;
    line-height:40px;
    height: 100%;
    border:1px solid #ebeef5;
}
</style>
<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <div class="ins-page-title">
                <span class="ins-back-icon"><i class="el-icon-back"></i></span>批量导入
            </div>
        </div>
        <div class="ins-page-con">
            <div class="ins-page-type type1">
                <div class="ins-page-btn">
                    <div class="ins-opa-btn">
                        <a v-bind:href="urlName" > <el-button type="warning" plain size="mini" v-show="isEdit==false" icon="el-icon-download" style="float: left;" @click="download()" >下载模板</el-button></a>
                        <el-upload class="upload-demo" name="FILE" :auto-upload="true":before-upload="beforeAvatarUpload" :action="UploadUrl()"  v-show="isEdit==false" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :show-file-list="false" style="float:left; margin-left:10px;">
                        <el-button type="primary" plain size="mini" icon="el-icon-upload" >点击上传</el-button>
                        </el-upload>
                        <el-button type="success" size="medium" v-show="isEdit==true" @click="savefun()">保存</el-button>
                        <el-button type="primary " size="medium" v-show="isEdit==true" @click="cancelShow()">取消</el-button>
                    </div>
                </div>
                <div class="ins-page-main">
                    <div class="ins-table">
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span>信息补录表</span>
                        </div>
                        <div class="ins-tab-con">
                            <el-table v-show="isEdit" id="a" :data='previewdata' border stripe height="100%" style="width: 100%;height:100%">
                                <el-table-column type="selection" width="37">
                                </el-table-column>
                                <el-table-column label="姓名"  style="text-align:center;">
                                    <template slot-scope="scope">
                                    <a style="color:#0095f6;" @click="handleJump(scope.$index, scope.row)">{{ scope.row.workerName }}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column v-for="(v,k) in scrColumn" :key="k" :prop="v.field" v-if="v.selected" align="center" :width="v.width" header-align="center" sortable :label="v.text">
                                </el-table-column>
                            </el-table>
                            <div class="updata-tip" v-show='!isEdit'>
                                1、姓名：必填，不能重复，如果系统中已存在该姓名，则默认使用新数据覆盖；<br/>
                                2、性别：必填；<br/>
                                3、任职岗位：必填；<br/>
                                4、手机号码：必填；<br/>
                                5、政治面貌：必填。（包括：中共党员、中共预备党员、共青团员、民革党员、民盟盟员、民建党员、民进党员、农工党党员、致公党党员、九三学社社员、台盟盟员、无党派人士、群众、其他）<br/>
                            </div>
                        </div>
                    </div>
                    <!-- 弹框 -->
                    <el-dialog title="信息填写有误名单" :visible.sync="missListLayer" width="80%">
                        <el-table id="missTable" :data='missList' border stripe height="500px">
                            <el-table-column type="index" width="70px" label="序号" align="center" header-align="center" sortable>
                            </el-table-column>
                            <el-table-column prop="workerName" label="姓名"  align="center" header-align="center" sortable>
                            </el-table-column>
                            <el-table-column prop="workerGenderName" label="性别"  align="center" header-align="center" sortable>
                            </el-table-column>
                            <el-table-column prop="workerTypeName"  label="任职岗位" align="center" header-align="center" sortable>
                            </el-table-column>
                            <el-table-column prop="workerPhone"  label="手机号码" align="center" header-align="center" sortable>
                            </el-table-column>
                            <el-table-column prop="politicalOutlookName" label="政治面貌" align="center" header-align="center" sortable>
                            </el-table-column>
                            <el-table-column prop="errorDescription" show-overflow-tooltip label="错误描述" align="center" header-align="center" sortable>
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
                        <p class="failInfo">确认取消上传?</p>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="cancel()">确定</el-button>
                            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                        </span>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./js/StaffInfoImport.js"></script>
