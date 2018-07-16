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
			<returnBtn :title="'教职工信息管理'"></returnBtn>
        </div>
        <div class="ins-page-con">
			<div class="ins-page-type type1">
				<div class="ins-page-btn" >
					<div class="ins-opa-btn">
						<el-button icon="el-icon-check" size="small" type="success" v-if="ruleForm.isShow==0" @click="submitForm('ruleForm')">保存</el-button>
						<el-button icon="el-icon-edit-outline" size="small" type="success" v-if="isUedit" @click="editInfo">编辑</el-button>
						<el-button icon="el-icon-close" size="small" type="danger" v-if="isdisable" @click="cancelInfo(ruleForm.isShow)">取消</el-button>
						<el-button icon="el-icon-close" size="small" type="danger" v-if="isClose" @click="closeInfo()">关闭本页</el-button>
					</div>
				</div>
				<div class="ins-page-main">
					<div class="ins-content">
						<div class="ins-title">
							<span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
							<span>信息补录表</span>
						</div>
						<div class="ins-content-con ins-s-ofx-a">
							<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
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
												<el-form-item label="姓名：" prop="workerName" v-show="ruleForm.isShow==0">
													<el-input v-model="ruleForm.workerName"></el-input>
												</el-form-item>
												<el-form-item label="姓名：" v-show="ruleForm.isShow==1">
													<span>{{ ruleForm.workerName }}</span>
												</el-form-item>
												<!-- 性别 -->
												<el-form-item label="性别：" prop="workerGender" v-show="ruleForm.isShow==0">
													<el-radio-group v-model="ruleForm.workerGender" size="small">
														<el-radio-button label="1">男</el-radio-button>
														<el-radio-button label="0">女</el-radio-button>
													</el-radio-group>
												</el-form-item>
												<el-form-item label="性别："  v-show="ruleForm.isShow==1">
													<span v-show="ruleForm.isShow==1">{{ruleForm.workerGender===1?'男':'女'}}</span>
												</el-form-item>
												<!-- 证件类型 -->
												<el-form-item label="证件类型：" prop="" v-show="ruleForm.isShow==0">
													<el-select v-model="ruleForm.certificatesType" placeholder="请选择证件类型" size="large" class="ins-s-wf">
														<el-option v-for="(item,key) in allOptions.certificOptions" :key="key" :label="item.name" :value="item.id">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="证件类型：" v-show="ruleForm.isShow==1">
													<span>{{ruleForm.certificatesType==1?'身份证':ruleForm.certificatesType==2?'香港特区护照':ruleForm.certificatesType==3?'澳门特区护照':ruleForm.certificatesType==4?'台湾居民来往大陆通行证':ruleForm.certificatesType==5?'护照':'' }}</span>
												</el-form-item>
												<!-- 证件号码 -->
												<el-form-item label="证件号码：" prop="" v-show="ruleForm.isShow==0">
													<el-input v-model="ruleForm.certificatesNum"></el-input>
												</el-form-item>
												<el-form-item label="证件号码：" v-show="ruleForm.isShow==1">
													<span>{{ ruleForm.certificatesNum }}</span>
												</el-form-item>
												<!-- 最高学历 -->
												<el-form-item label="最高学历：" v-show="ruleForm.isShow==0">
													<el-select class="ins-s-wf" v-model="ruleForm.highestEducation" placeholder="请选择活动区域" @change="selValChangeFn(ruleForm.highestEducation,'highestEducationName')">
														<el-option v-for="(item,key) in allOptions.educationOptions" :key="key" :label="item.dictValue" :value="item.dictCode">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="最高学历：" v-show="ruleForm.isShow==1">
													<span>{{ ruleForm.highestEducationName }}</span>
												</el-form-item>
											</div>
										</el-col>
										<el-col :span="9">
											<div class="item-content">
												<!-- 出生日期 -->
												<el-form-item label="出生日期：" prop="userBirthday" v-show="ruleForm.isShow==0">
													<el-date-picker type="date" class="ins-s-wf" placeholder="选择日期" v-model="ruleForm.userBirthday">
													</el-date-picker>
												</el-form-item>
												<el-form-item label="出生日期：" v-show="ruleForm.isShow==1">
													<span>{{ $api.getDateAll(ruleForm.userBirthday,'-','')}}</span>
												</el-form-item>
												<!-- 手机号码 -->
												<el-form-item label="手机号码：" prop="workerPhone" v-show="ruleForm.isShow==0">
													<el-input v-model="ruleForm.workerPhone"></el-input>
												</el-form-item>
												<el-form-item label="手机号码：" v-show="ruleForm.isShow==1">
													<span>{{ ruleForm.workerPhone }}</span>
												</el-form-item>
												<!-- 政治面貌 -->
												<el-form-item label="政治面貌：" prop="politicalOutlook" v-show="ruleForm.isShow==0">
													<el-select class="ins-s-wf" v-model="ruleForm.politicalOutlook" placeholder="请选择政治面貌" @change="selValChangeFn(ruleForm.politicalOutlook,'politicalOutlookName')">
														<el-option v-for="(item,key) in allOptions.politicalOptions" :key="key" :label="item.dictValue" :value="item.dictCode">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="政治面貌：" v-show="ruleForm.isShow==1">
													<span>{{ ruleForm.politicalOutlookName}}</span>
												</el-form-item>
												<!-- 民族 -->
												<el-form-item label="民族：" prop="" v-show="ruleForm.isShow==0">
													<el-select class="ins-s-wf" v-model="ruleForm.userNation" placeholder="请选择民族" @change="selValChangeFn(ruleForm.userNation,'userNationName')">
														<el-option v-for="(item,key) in allOptions.nationOptions" :key="key" :label="item.dictValue" :value="item.dictCode">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="民族：" v-show="ruleForm.isShow==1">
													<span>{{ ruleForm.userNationName }}</span>
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
												<el-form-item label="任职岗位：" prop="workerType" v-show="ruleForm.isShow==0">
													<el-select class="ins-s-wf" v-model="ruleForm.workerType" placeholder="请选择活动区域" @change="selValChangeFn(ruleForm.workerType,'workerTypeName')">
														<el-option v-for="(item,key) in allOptions.workerTypeOptions" :key="key" :label="item.dictValue" :value="item.dictCode">
														</el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="任职岗位：" prop="" v-show="ruleForm.isShow==1">
													<span>{{ruleForm.workerTypeName}}</span>
												</el-form-item>
												<!-- 教学资历 -->
												<el-form-item label="教学资历：" v-if="ruleForm.workerTypeName==='教师'">
													<el-date-picker type="date" class="ins-s-wf" v-show="ruleForm.isShow==0" placeholder="选择日期" v-model="ruleForm.arg1"  value-format="timestamp"></el-date-picker>
													<span v-show="ruleForm.isShow==1">{{teaching}}</span>
												</el-form-item>
											</div>
										</el-col>
										<el-col :span="9">
											<div class="item-content">
												<!-- 入职时间 -->
												<el-form-item label="入职时间："  prop="" v-show="ruleForm.isShow==0">
													<el-date-picker type="date" class="ins-s-wf" placeholder="选择日期" v-model="ruleForm.entryTime">
													</el-date-picker>
												</el-form-item>
												<el-form-item label="入职时间：" prop="" v-show="ruleForm.isShow==1">
													<span>{{$api.getDateAll(ruleForm.entryTime,'-','')}}</span>
												</el-form-item>
												<!-- 离职时间 -->
												<el-form-item label="离职时间：" prop="departureTime" v-show="ruleForm.isShow==0">
													<el-date-picker type="date" class="ins-s-wf" placeholder="选择日期" v-model="ruleForm.departureTime">
													</el-date-picker>
												</el-form-item>
												<el-form-item label="离职时间："  prop="" v-show="ruleForm.isShow==1">
													<span>{{$api.getDateAll(ruleForm.departureTime,'-','')}}</span>
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
												<el-form-item label="籍贯所在地：" prop="" v-show="ruleForm.isShow==0">
													<el-cascader class="ins-s-wf" :options="cityList" v-model="ruleForm.nativeList" :props="{value: 'label',children: 'children'}" filterable change-on-select>
													</el-cascader>
												</el-form-item>
												<el-form-item label="籍贯所在地：" prop="" v-show="ruleForm.isShow==1">
													<span>{{ruleForm.nativeList===undefined?'':ruleForm.nativeList.join('')}}</span>
												</el-form-item>
												<!-- 户口所在地 -->
												<el-form-item label="户口所在地：" prop="" v-show="ruleForm.isShow==0">
													<el-cascader class="ins-s-wf" :options="cityList" v-model="ruleForm.householdsList" :props="{value: 'label',children: 'children'}" filterable change-on-select>
													</el-cascader>
													<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.householdsAddr">
													</el-input>
												</el-form-item>
												<el-form-item label="户口所在地：" prop="" v-show="ruleForm.isShow==1">
													<span>{{ruleForm.householdsList===undefined?'':ruleForm.householdsList.join('')}}</span></br>
													<span>{{ruleForm.householdsAddr}}</span>
												</el-form-item>
											</div>
										</el-col>
										<el-col :span="9">
											<div class="item-content">
												<!-- 现居住地址 -->
												<el-form-item label="现居住地址：" prop="" v-show="ruleForm.isShow==0">
													<el-cascader class="ins-s-wf" :options="cityList" v-model="ruleForm.addressList" :props="{value: 'label',children: 'children'}" filterable change-on-select>
													</el-cascader>
													<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.addressAddr">
													</el-input>
												</el-form-item>
												<el-form-item label="现居住地址：" prop="" v-show="ruleForm.isShow==1">
													<span>{{ruleForm.addressList===undefined?'':ruleForm.addressList.join('')}}</span></br>
													<span>{{ruleForm.addressAddr}}</span>
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
            <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
                <p class="failInfo">如有内容修改，取消编辑后修改将不会被保存。</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('ruleForm')">确定取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">继续编辑</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/StaffInfoSupplement.js"></script>
