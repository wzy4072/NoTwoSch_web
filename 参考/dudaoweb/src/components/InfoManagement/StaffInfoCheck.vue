<template>
  <div class="ins-container">
      <!-- 面包屑导航 -->
        <div class="ins-tab-label">
       </div>
<div class="ins-page-search" style="margin: 5px;">
    <div class="ins-search-con">
            <el-button icon="el-icon-check" size="medium" type="success">
                保存
            </el-button>
             <el-button icon="el-icon-close" size="medium" type="danger">
                取消
            </el-button>
    </div>
</div>
 <div class="ins-page-main" style="position: relative;">
   <div class="ins-tab-con">
   <!-- 表格标题+表格功能 -->
            <div class="ins-tab-title">
                <span>
                    <span class="el-icon-menu">
                    </span>
                    <i class="com_fs_4">
                        信息补录表
                    </i>
                </span>
            </div>
           <!-- 表格内容 -->
            <div class="com_h_full">
                <!-- 表格内容 -->
               <div class="form-title"><span>基本信息</span><div class="lines"></div></div>
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-col :span="11">
                            <el-form-item label="姓名" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="出生日期" prop="name">
                            <el-form-item prop="date1">
                                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"> 
                                    </el-date-picker>
                                </el-form-item>
                            </el-form-item>
                        </el-col>
                         <el-col :span="11">
                            <el-form-item label="性别" prop="resource">
                                <el-radio-group v-model="ruleForm.resource">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                         <el-col :span="11">
                            <el-form-item label="手机号码" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                          <el-col :span="11">
                             <el-form-item label="证件类型" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择活动区域" size="large">
                                <el-option label="居民身份证" value="shanghai"></el-option>
                                <el-option label="护照" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                             <el-form-item label="政治面貌" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="群众" value="shanghai"></el-option>
                                <el-option label="党员" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                         <el-col :span="11">
                            <el-form-item label="证件号码" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                      <el-col :span="11">
                             <el-form-item label="民族" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="群众" value="shanghai"></el-option>
                                <el-option label="党员" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                         <el-col :span="11">
                             <el-form-item label="最高学历" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="群众" value="shanghai"></el-option>
                                <el-option label="党员" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form>
                    <div class="clear"></div>
                     <div class="form-title"><span>任职信息</span><div class="lines"></div></div>
                     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-col :span="11">
                            <el-form-item label="任职岗位" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="入职时间" prop="name">
                             <el-form-item prop="date1">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"> 
                                </el-date-picker>
                            </el-form-item>
                            </el-form-item>
                        </el-col>
                         <el-col :span="11">
                            <el-form-item label="任教科目" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="离职时间" prop="name">
                             <el-form-item prop="date1">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"> 
                                </el-date-picker>
                            </el-form-item>
                            </el-form-item>
                        </el-col>
                    </el-form>
                    <div class="clear"></div>
                      <div class="form-title"><span>户籍信息</span><div class="lines"></div></div>
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="籍贯所在地" prop="name">
                                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="群众" value="shanghai"></el-option>
                                <el-option label="党员" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        <el-col :span="11">
                            <el-form-item label="户口所在地" prop="name">
                             <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="群众" value="shanghai"></el-option>
                                <el-option label="党员" value="beijing"></el-option>
                                </el-select>
                                <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  placeholder="请输入内容" v-model="textarea3" style="margin-top:10px;">
                                </el-input>
                            </el-form-item>
                        </el-col>
                          <el-col :span="11">
                            <el-form-item label="现居住地址" prop="name">
                             <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                                <el-option label="群众" value="shanghai"></el-option>
                                <el-option label="党员" value="beijing"></el-option>
                                </el-select>
                                <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  placeholder="请输入内容" v-model="textarea3" style="margin-top:10px;">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>

            </div>
             <!-- 分页栏 -->
     </div>
 </div>

</div>
</template>
<script src="">
    export default {
      data () {
        return {
          barNameArr: [],
          total: 0,
          size: 50,
          currentPage: 1,
          fullscreenLoading: false,
          activeName: 'first',
          tableData: [],
          value1: '', // 当前单选
          value2: '', // 当前多选
          date: '', // 当前时间
          tab: 'first', // 当前tab
          searchstr: '', // 当前输入
          scrColumn: [// 表头
                    {text: '姓名', selected: true, align: 'center'},
                    {text: '性别', selected: true},
                    {text: '岗位标签', selected: true},
                    {text: '任教科目', selected: true},
                    {text: '手机号码', selected: true},
                    {text: '政治面貌', selected: true},
                    {text: '最高学历', selected: true},
                    {text: '民族', selected: true},
                    {text: '出生日期', selected: true},
                    {text: '籍贯', selected: true},
                    {text: '证件类型', selected: true},
                    {text: '证件号码', selected: true}
          ],
          printOb: {// 打印所需
            pageNum: 1,
            title: '项目列表'
          },
          ruleForm: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          rules: {
            name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            ],
            date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
            ],
            type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
            ],
            resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
            ],
            desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
            ]
          }
        }
      },
      mounted () { // 进页面默认执行方法
        this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
        this.$nextTick(function () {
          this.$api.countHeight('.ins-tab-label')
          this.refresh()
        })
        let that = this
        window.onresize = function () {
          that.$api.countHeight('.ins-tab-label')
        }
      },
      methods: {
        refresh () {
          this.fullscreenLoading = true
          this.$api.promise({
            method: 'POST',
            url: 'demo/demo',
            data: {}
          }).then((res) => {
            this.fullscreenLoading = false
            if (res.data.code > 0) {
              this.copydata = Object.assign([], res.data.list)
              this.tableData = this.copydata.slice(0, this.size * 1)
              this.total = res.data.list.length
            } else {
              this.$message.error(res.data.desc)
            }
          }).catch((err) => {
            this.fullscreenLoading = false
            this.$message.error('接口异常：' + err)
          })
        },
        handleSizeChange (val) {
          this.size = val
          this.handleCurrentChange()
        },
        handleCurrentChange (val) {
          this.currentPage = val || this.currentPage
          this.tableData = this.copydata.slice(
                    (this.currentPage - 1) * this.size,
                    this.currentPage * this.size
                )
        },
        searchFun () {
          if (this.searchstr !== '') {
            this.fullscreenLoading = true
            this.tableData = this.copydata.filter(o => {
              return Object.keys(o).some(d => {
                return (typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
                    .searchstr) > -1
              })
            })
          } else {
            this.tableData = this.copydata
          }
          this.fullscreenLoading = false
          this.total = this.tableData.length
        }
      }
    }
</script>
<style scoped>
.form-title{position: relative; height: 40px;}
.form-title span{ font-size: 18px; width: 124px;text-align: center;display: block;position: absolute;top: -10px;left: 0px;background: rgb(255, 255, 255);}
.lines{ border-bottom: 1px solid #dcdfe6;    margin-top: 25px;}
.clear{ clear: both;}
</style>

