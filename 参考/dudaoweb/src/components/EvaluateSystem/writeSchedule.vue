<template>
	<div class="ins-container pd4">
		<div>
			<div class="ins-tab-label">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="教职工" name="5"></el-tab-pane>
					<el-tab-pane label="学生" name="6"></el-tab-pane>
					<el-tab-pane label="其他" name="7"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="ins-page-search">
				<div class="ins-search-con">
					问卷：
					<el-select placeholder="请选择" style="width:250px;" v-model="checkQuestionnaire">
						<el-option :label="item.questionnaireTitle" :value="item.questionnaireId" v-for="(item,key) in questionnaireList" :key="key">
						</el-option>
					</el-select>
				</div>
			</div>
		</div>
		<div class="ins-page-main">
			<div class="ins-tab-con" style="padding-bottom:0px;">
				<!-- 表格title -->
				<div class="ins-tab-title">
					<span>
						<span class="el-icon-menu">
						</span>
						<span class="com_fs_4">
							{{activeName === '5' ? '教职工问卷填写进度统计表（已提交'+ useData +'未提交）':activeName === '6'?'学生问卷填写进度统计表（已提交'+useData+'未提交）':'系统外数据'}}
						</span>
					</span>
					<!-- 复制 打印 -->
					<div class="ins-tabbar-con">
						<tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
					</div>
					<!-- 搜索 -->
					<div class="com_fr" style="width:200px;">
						<el-input class="input-with-select" placeholder="请输入内容" v-model="searchstr" clearable>
							<el-button @click="searchFun" icon="el-icon-search" slot="append">
							</el-button>
						</el-input>
					</div>
				</div>
				<!-- 表格 内容 -->
				<div class="com_h_full">
					<!-- 表格内容 -->
					<el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%" v-if="activeName==='5'">
						<el-table-column align="center" label="序号"  type="index" v-if="scrColumn[0].selected" width="75">
						</el-table-column>
						<el-table-column align="center" label="姓名" prop="workerName" sortable="" v-if="scrColumn[1].selected" width="100">
						</el-table-column>
						<el-table-column align="center" label="性别" sortable="" v-if="scrColumn[2].selected">
							<template slot-scope="scope">
								{{scope.row.workerGender?"男":"女"}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="岗位" prop="dictValue" sortable="" v-if="scrColumn[3].selected">
						</el-table-column>
						<el-table-column align="center" label="任教科目" prop="courseName" sortable="" v-if="scrColumn[4].selected">
						</el-table-column>
						<el-table-column align="center" label="手机号码" prop="workerPhone" sortable="" v-if="scrColumn[5].selected">
						</el-table-column>
						<el-table-column align="center" label="是否提交" sortable="" v-if="scrColumn[6].selected">
							<template slot-scope="scope">
								{{scope.row.isFilled?"是":"否"}}
							</template>
						</el-table-column>
					</el-table>
					<el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%" v-if="activeName==='6'">
						<el-table-column align="center" label="序号" type="index" v-if="scrColumn[0].selected" width="75">
						</el-table-column>
						<el-table-column align="center" label="姓名" prop="studentName" sortable="" v-if="scrColumn[1].selected" width="100">
						</el-table-column>
						<el-table-column align="center" label="性别" prop="studentGender" sortable="" v-if="scrColumn[2].selected">
							<template slot-scope="scope">
								{{scope.row.studentGender?"男":"女"}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="年级" prop="gradeName" sortable="" v-if="scrColumn[3].selected">
						</el-table-column>
						<el-table-column align="center" label="班级" prop="className" sortable="" v-if="scrColumn[4].selected">
						</el-table-column>
						<el-table-column align="center" label="手机号码" prop="userTele" sortable="" v-if="scrColumn[5].selected">
						</el-table-column>
						<el-table-column align="center" label="是否提交" sortable="" v-if="scrColumn[6].selected">
							<template slot-scope="scope">
								{{scope.row.isFilled?"是":"否"}}
							</template>
						</el-table-column>
					</el-table>
					<el-table :data="tableData" border height="100%" id="a" stripe="" style="width: 100%;height:100%" v-if="activeName==='7'">
						<el-table-column align="center" label="浏览量" prop="questionnairePageviews" sortable="" v-if="scrColumn[0].selected">
						</el-table-column>
						<el-table-column align="center" label="填写人数" prop="filled" sortable="" v-if="scrColumn[1].selected">
						</el-table-column>
					</el-table>
				</div>
				<!-- 分页栏 -->
				<!-- <div class="ins-tab-paging">
					<el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
					</el-pagination>
				</div> -->
			</div>
		</div>
	</div>
</template>
<style scoped>

</style>
<script src="./js/writeSchedule.js">
</script>