<template>
	<div class="ins-container pd2">
		<div>
			<div class="ins-page-search">
				<div class="ins-search-con">
					<el-button type="success" size="medium" @click="exportWordFun">下载问卷</el-button>
					<el-button type="danger" size="medium" @click="goBackFun">返回</el-button>
				</div>
			</div>
		</div>
		<div class="ins-page-main" id="questionnaire" style="padding:0px 25px 80px 25px;">
			<div class="com_t_c" style="height:40px ;line-height:40px;font-size: 20px;">{{questionnaireName}}&nbsp;&nbsp;&nbsp;&nbsp;
				<span style="font-size: 12px;">填写人：{{writeName}}</span>
			</div>
			<div class="ins-tab-title" style="position:static;">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
			<div class="com_full com_ofy_a">
				<div class="topic" v-for="(re,key) in topicList" :key="re.subjectId">
					<div><span v-if="re.subjectIsOption" style="color:red;">*</span>{{key+1}}.【{{re.subjectType===1?'单选题':re.subjectType===2?'多选题':re.subjectType===3?'填空题':'打分题'}}】{{re.subjectTitle}}</div>
					<el-radio v-model="val.radio" :label="val.answerId" v-for="val in re.answers" :key="val.subjectId" v-if="re.subjectType===1" disabled>{{val.questionAnswer}}</el-radio>
					<el-checkbox style="margin-left:0px;" :checked="val.isSelect===1" v-for="val in re.answers" :key="val.subjectId" v-if="re.subjectType===2" disabled>{{val.questionAnswer}}</el-checkbox>
					<el-input v-model="re.answers[0].answer" v-if="re.subjectType===3" :disabled="true"></el-input>
					<el-radio v-model="re.answers[0].answer" :label="num" v-for="num in re.maxSelect" :key="num" v-if="re.subjectType===4" disabled>{{num + '分'}}</el-radio>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.topic{
	margin:10px;
}
.topic>>>.el-checkbox {
  display: block;
  padding: 10px;
}
</style>
<script src="./js/questionnaireSurveyDet.js"></script>