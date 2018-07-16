<style scope>
    .btn-wid span{
      width:159px
    }
</style>
<template>
	<div class="ins-container">
		<div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'年级班级管理'"></returnBtn>
        </div>
		<div class="ins-page-con">
            <div class="ins-page-type type1">
            <div class="ins-page-btn">
                <div class="ins-opa-btn">
				<el-button icon="el-icon-check" size="medium" type="primary" @click="levelDialog = true">升级次序配置</el-button>
				<el-button icon="el-icon-check" size="medium" type="primary" @click="comLevUp" :disabled="option.length !== comLevUpType">
				常规年级升级
				</el-button>
				<el-button icon="el-icon-plus" size="medium" type="warning" @click="addButton">添加</el-button>
				<el-button icon="el-icon-edit" size="medium" type="success" :disabled="length1 !== 1" @click="editDialog = true">编辑</el-button>
				<el-button icon="el-icon-delete" size="medium" type="danger" :disabled="length1==0" @click="deleteData">删除</el-button>
			</div>
		</div>
    <!-- 页面主体 -->
		<div class="ins-page-main">
			<div class="ins-table divide">
				<div class="ins-title">
					<span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
					<span>在校年级班级列表</span>
					<!-- 复制 打印 -->
					<div class="tabbar-con">
						<tableBar type="copy,export,printer" tableId="a" :printOb="printOb"></tableBar>
					</div>
					<!-- 搜索 -->
					<div class="title-input">
						<el-input placeholder="请输入内容" v-model="searchstr">
						</el-input>
					</div>
				</div>
				<!-- 表格内容 -->
				<div class="ins-tab-con">
					<!-- 表格内容 --> 
					<el-table :data="tableData" border height="100%" id="a" stripe style="width: 100%;height:100%" @selection-change="selectData">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column type="index" align="center"  width="50" label="序号"></el-table-column>
						<el-table-column prop="gradeType" align="center"  sortable label="年级类型"></el-table-column>
						<el-table-column prop="gradeName" align="center"  sortable label="在校年级名称"></el-table-column>
						<el-table-column prop="gradeCode" align="center"  sortable label="年级代码"></el-table-column>
						<el-table-column prop="classNameStr" align="center" sortable label="班级名称"></el-table-column>
					</el-table>
				</div>
				<!-- page divide -->
            <div class="ins-tab-divide">
                <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
			</div>
				<!-- 升级次序配置 -->
				<el-dialog title="升级次序配置" :visible.sync="levelDialog" width="360px">
				<el-form>
					<el-form-item label="升级次序:" :label-width="formLabelWidth">
						<el-select placeholder="待选择" v-for="(v,k) of option" v-bind:key="k" v-model="option[k].values" 
								@change="Ele(option[k])" @clear="clear(option[k])" style="margin-bottom:10px">
							<el-option
								v-for="item in option"
								:disabled="item.disabled"
								:key="item.confId"
								:label="item.dictName"
								:value="item.dictValue">
							</el-option>
						</el-select>
					<el-input placeholder="毕业班级，自动编号届次数值" v-model="input1" :disabled="true" style="width:217px"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="empty">清空配置</el-button>
					<el-button type="primary" @click="levelTemp" >确 定</el-button>
				</div>
				</el-dialog>
				<!-- 添加年级班级 -->
				<el-dialog title="添加年级班级" :visible.sync="addDialog" width="460px" @close="closeAddCommon">
				<el-form>
					<el-form-item label="年级类型:" :label-width="formLabelWidth" style="width:440px">
					<el-radio-group v-model="tabPosition" @change="changeTemp">
						<el-radio-button label="常规年级" class="btn-wid"></el-radio-button>
						<el-radio-button label="混龄年级" class="btn-wid"></el-radio-button>
						<!-- <el-radio-button label="混龄年级" class="btn-wid" disabled v-if='hlNum === 1' title="只能添加一个混龄年级！"></el-radio-button> -->
					</el-radio-group>
					</el-form-item>
					<el-form-item label="年级名称:" :label-width="formLabelWidth">
					<el-select v-model="addNameSelect" placeholder="待选择" style="width:318px">
						<el-option
						v-for="item in option2"
						:key="item.confId"
						:label="item.dictName"
						:value="item.dictValue">
						</el-option>
					</el-select>
					</el-form-item>
					<el-form-item label="年级代码:" :label-width="formLabelWidth">
					<el-input placeholder="请输入年级代码（格式为：G+年份）" v-model="addCodeInput" style="width:318px" :disabled="temp"></el-input>
					</el-form-item>
					<el-form-item label="班级名称:" :label-width="formLabelWidth">
						<el-input placeholder="请输班级名称" v-for="(v,k) of addList" v-bind:key="k" v-model="addList[k].values" style="width:216px;margin-bottom:10px"></el-input>
						<el-button type="primary" icon="el-icon-plus" size="mini" round @click="addSpec"></el-button>
						<el-button type="danger" icon="el-icon-minus" size="mini" round @click="moveSpec"></el-button>           
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addDialog = false">取 消</el-button>
					<el-button type="primary" @click="addClassSave">确 定</el-button>
				</div>
				</el-dialog>
				<!-- 编辑年级 -->
				<el-dialog title="	" :visible.sync="editDialog" width="460px">
				<el-form>
					<el-form-item label="年级类型:" :label-width="formLabelWidth" style="width:440px">
					<el-radio-group v-model="tabPosition" @change="changeTemp">
						<el-radio-button label="常规年级" class="btn-wid" :disabled="btnType === 0"></el-radio-button>
						<el-radio-button label="混龄年级" class="btn-wid" :disabled="btnType === 1"></el-radio-button>
					</el-radio-group>
					</el-form-item>
					<el-form-item label="年级名称:" :label-width="formLabelWidth">
					<el-select v-model="editNameSelect" placeholder="待选择" style="width:318px" :disabled="stuNum>0">
						<el-option
						v-for="item in option2"
						:key="item.confId"
						:label="item.dictName"
						:value="item.dictValue">
						</el-option>
					</el-select>
					</el-form-item>
					<el-form-item label="年级代码:" :label-width="formLabelWidth">
					<el-input placeholder="请输入年级代码" v-model="editCodeInput" style="width:318px" :disabled="temp || stuNum > 0"></el-input>
					</el-form-item>
					<el-form-item label="班级名称:" :label-width="formLabelWidth">
						<el-input placeholder="请输班级名称" v-for="(v,k) of editList" v-bind:key="k" v-model="editList[k].className" style="width:216px;margin-bottom:10px"></el-input>
						<el-button type="primary" icon="el-icon-plus" size="mini" round @click="editAddSpec"></el-button>
						<el-button type="danger" icon="el-icon-minus" size="mini" round @click="editMoveSpec"></el-button>           
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="editClassSave">确 定</el-button>
				</div>
				</el-dialog>
			</div>
		</div>
    </div>
    </div>
</template>
<script src="./js/classAndGradManagement.js"></script>