<template>
  <div class="ins-container pd2">
  <!-- 面包屑导航 -->
  <!-- tab页 -->
<div class="ins-page-search">
    <div class="ins-search-con">
            <el-button type="warning"  plain size="medium" @click="editQuestion()">编辑</el-button>
    </div>
</div>
<el-dialog title="操作提示" :visible.sync="editDialogVisible" width="500px">
        <p class="failInfo">确认编辑后正在填写的问卷无法提交。编辑完成且开始之后，问卷才能再次进入、填写、提交。?</p>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editComfrim()">确定编辑</el-button>
            <el-button type="primary" @click="editDialogVisible = false">确定取消</el-button>
        </span>
</el-dialog>
<el-dialog title="问卷范围" :visible.sync="groupDialogVisible" width="500px">
        <p class="failInfo">该问卷已有用户填写，现只能增加发布范围。</p>
		<div class="failInfo">
			 <el-input placeholder="可按照部门、年级进行搜索"  v-model="filterText"></el-input>
		</div>
		<div class="failInfo">
			  <el-tree
				:data="treeData"
				show-checkbox
				default-expand-all
				node-key="userId"
				ref="tree"
				highlight-current
				:props="defaultProps">
			</el-tree>
		</div>
        <span slot="footer" class="dialog-footer">
			<el-button @click="getCheckedNodes">确定</el-button>
            <el-button type="primary" @click="groupDialogVisible = false">取消</el-button>
        </span>
    </el-dialog>
 <div class="ins-page-main" style="position: relative;">
   <div class="ins-tab-con">
   <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <span class="com_fs_4">
                        问卷内容
                    </span>
                </span>
            </div> 
            <div class="com_h_full">
                <div class="bd1 bdr_5  Com_Tablebody_big" style="width: 100%;height: 100%">
					<div style="width: 100%; height: 120px;border-bottom: 1px solid #5CB45C;">
						<span style="font-size:25px;padding:15px;display: block; text-align: center;">
							{{topic.questionnaireTitle}}
						</span>
						<div style="background-color: #efefef;padding:5px;margin: 0 15px;">
							<span style="font-size:16px;" >{{topic.questionnaireExplain}}
							</span>
							<span style="font-size:16px; color: blue;" v-if="topic.isRealName==1">
								 ——该问卷为实名问卷
							</span>
							<span style="font-size:16px; color: blue;" v-if="topic.isRealName==0">
								 ——该问卷为匿名问卷
							</span>
						</div>
					</div>

					<div class="topicCss" style="height:80%;overflow-y: scroll; padding:0px 40px">
						<div  style="padding:20px 40px;">
						</div>
						<ul>
							<li v-for="(value,key) in topicList" :key="key" class="topiclist">
								<!-- 单选题 -->
								<div class="panel" v-if="value.subjectType===1" >
									<span style="color: red;" v-if="value.subjectIsOption===1" >*</span>
									<label for=""><span>{{value.arg1}}</span>.<span class="quest_topictype">(单选题)</span></label>
									<span >{{value.subjectTitle}}</span>
									<div class="panelbody">
										<ul>
											 <li v-for="(item,key2) in value.answerList" :key="key2">                                                 
                                            <div class="input-group">
                                                <span class="input-group-addon">
                                                <input type="radio"  disabled=""></span>
	                                            <label style="font-weight: normal;"><span  style="padding: 0 10px;">{{item.questionAnswer}}</span></label>
											</div>
                                        </li>
										</ul>
								</div>
							</div>
							
                            <!-- 多选题 -->
								<div class="panel" v-if="value.subjectType==2" >
									<span style="color: red;" v-if="value.subjectIsOption===1"  >*</span>
									<label for=""><span>{{value.arg1}}</span>.<span class="quest_topictype">(多选题)</span></label>
									<span >{{value.subjectTitle}}</span>
									<div class="panelbody">
										<ul>
											 <li v-for="(item,key2) in value.answerList" :key="key2">                                                 
                                            <div class="input-group">
                                                <span class="input-group-addon">
                                                <input type="checkbox"  disabled=""></span>
	                                            <label style="font-weight: normal;"><span  style="padding: 0 10px;">{{item.questionAnswer}}</span></label>
											</div>
                                        </li>
										</ul>
								</div>
							</div>
                            <!-- 填空题 -->
                            <div class="panel panel-info" v-if="value.subjectType==3" >
                                <div class="panel-heading form-inline">
                                    <div class="form-group" style="width:100%">
										<span style="color: red;" v-if="value.subjectIsOption===1"  >*</span>
                                        <label for=""><span>{{value.arg1}}</span>.<span class="quest_topictype">(填空题)</span></label>
                                       	<span>{{value.subjectTitle}}</span></br>
									    <input type="text" class="form-control"  style="width:70%"  placeholder="请输入你的答案">
                                    </div>
                                </div>
                            </div>
                                <!-- 打分题 -->
                            <div class="panel panel-info" v-if="value.subjectType==4">
                                <div class="panel-heading form-inline">
                                    <div class="form-group" style="width:100%">
										<span style="color: red;" v-if="value.subjectIsOption===1"  >*</span>
                                        <label for=""><span>{{value.arg1}}</span>.<span class="quest_topictype">(打分题)</span></label>
                                        <span>{{value.subjectTitle}}</span></br>
										<span v-for="(v1,k1) in value.maxSelectArry" :key="k1">
                                             <input type="radio" >{{v1}}
										</span>
                                    </div>
                                </div>
                            </div>
							<!-- 段落说明 -->
							<div class="panel panel-info" v-if="value.subjectType==5">
									<div class="panel-heading form-inline">
										<div class="form-group" style="width:100%">
                                        <span  style="display:block;background-color: #efefef;text-align:center; padding:5px 0px;">{{value.subjectTitle}}</span>
										</div>
									</div>
							</div>
					</li>
				</ul>
			</div>

		</div>
            </div>
     </div>
 </div>
</div>
</template>
<style scoped>
.panelbody{ padding: 15px;}
.topiclist{ margin-bottom: 10px; color: #606266;font-size: 14px;font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;}
.input-group{margin-bottom: 10px;}
</style>
<script src="./js/throughQuestionnaire.js"></script>