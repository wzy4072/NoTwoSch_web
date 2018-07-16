<template>
    <div class="ins-container pd2">
        <!-- 面包屑导航 -->
        <!-- tab页 -->
        <div class="ins-page-search" style="margin:5px 0px;">
            <div class="ins-search-con">
                <el-button type="primary" plain size="medium" @click="saveQuestion()">保存</el-button>
                <el-button type="danger" plain size="medium" @click="cancleSave()">取消</el-button>
                <el-button type="success" plain size="medium" @click="addQuestionDialog()">批量添加</el-button>
                <el-button type="warning" plain size="medium" @click="preview()">预览问卷</el-button>
            </div>
        </div>
        <el-dialog title="操作提示" :visible.sync="dialogVisible" width="500px">
            <p class="failInfo">确认取消删除?</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteItem()">确定删除</el-button>
                <el-button type="primary" @click="dialogVisible = false">确定取消</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="操作提示" :visible.sync="saveDialogVisible" width="500px">
            <p class="failInfo">保存成功！</p>
            <p class="failInfo">如需发布问卷，请在管理列表发布。</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goList()">确定</el-button>
            </span>
        </el-dialog> -->
        <el-dialog title="操作提示" :visible.sync="editDialogVisible" width="500px">
            <p class="failInfo">确认取消编辑问卷?</p>
            <p class="failInfo">
                已编辑的问卷题目将不会被保存， 建议先保存此问卷
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">继续编辑</el-button>
                <el-button type="primary" @click="confirm()">确定取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="批量添加题目" :visible.sync="multiDialogVisible" width="700px">
            <p class="failInfo">
                <el-input type="textarea" autosize :rows="9" placeholder="
            题目1的题目内容【单选题】
            选项1的内容
            选项2的内容

            题目1的题目内容【多选题】
            选项1的内容
            选项2的内容

            题目3的题目内容【填空题】

            题目4的题目内容【评分题】
            5分

            段落说明的文字内容【段落说明】" v-model="batchList">
                </el-input>
            </p>
            <p class="failInfo">
                以上内容为批量添加各题型的示例，
                <span @click='slViewFun()' style="color:#f00;cursor:pointer">点此查看</span>对应预览效果。</br>

                添加规则：</br>

                1 第一行为题目，中间不要换行，不用加题目序号（即不用加1、2等）；</br>

                2 回车后，下一行开始为选项行， 选项不要空行，一个选项单独一行；</br>

                3 选项结束后, 一个空行,表示问题的结束, 换下一个新问题；</br>

                4 如果下面没有选项，直接空一行, 默认为填空题；</br>

                5.如果下面没有选项，直接空一行,且题目后方加上“[分数题]”，则默认为分数题；</br>

                5 多选题需在题目后方加上“[多选题]”，否则视为单选题；</br>

                6 段落说明需在其后方加上“[段落说明]“，否则视为填空题。</br>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addQuestionList()">确认添加</el-button>
                <el-button type="primary" @click="multiDialogVisible = false">确定取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="预览效果" :visible.sync="previewDialogVisible" width="400px" style="margin-left:30%;">
            <p class="failInfo">【单选题】1.题目1的题目内容</p>
            <p class="failInfo"> <input type="radio">选项1的内容</p>
            <p class="failInfo"> <input type="radio">选项2的内容</p>
            <br/>
            <p class="failInfo">【多选题】2.题目1的题目内容</p>
            <p class="failInfo"> <input type="checkbox">选项1的内容</p>
            <p class="failInfo"> <input type="checkbox">选项2的内容</p>
            <br/>
            <p class="failInfo">【填空题】3.题目1的题目内容</p>
            <p class="failInfo"> <input type="text"></p>
            <br/>
            <p class="failInfo">【打分题】4.题目1的题目内容</p>
            <p class="failInfo"> <input type="radio">1<input type="radio">2<input type="radio">3<input type="radio">4<input type="radio">5</p>
            <br/>
            <p class="faiInfo" style="background:#eee">段落说明的文字内容</p>
        </el-dialog>
        <!-- 预览问卷 -->
        <el-dialog title="预览问卷" :visible.sync="previewlistDialog" width="800px" >
            <div style="height:650px;overflow-y: scroll;">
            <div class="faiInfo">
                <span style="font-size:25px;padding:15px;display: block; text-align: center;">
                    {{topic.questionnaireTitle}}
                </span>
            </div>
            <div class="faiInfo">
                <span style="font-size:16px;word-wrap:break-word;">{{topic.questionnaireExplain}}
                </span>
                <span style="font-size:16px; color: blue;" v-if="topic.isRealName==1">
                    ——该问卷为实名问卷
                </span>
                <span style="font-size:16px; color: blue;" v-if="topic.isRealName==0">
                    ——该问卷为匿名问卷
                </span>
            </div>
            <div class="faiInfo">
                <ul>
                    <li v-for="(value,key) in topicList" :key="key" class="topiclist">
                        <!-- 单选题 -->
                        <div class="panel" v-if="value.subjectType==1">
                            <span style="color: red;">*</span>
                            <label for="">
                                <span>{{value.arg1}}</span>.
                                <span class="quest_topictype">(单选题)</span>
                            </label>
                            <span>{{value.subjectTitle}}</span>
                            <div class="panelbody">
                                <ul>
                                    <li v-for="(item,key2) in value.answerList" :key="key2">
                                        <div class="input-group">
                                            <span class="input-group-addon">
                                                <input type="radio" disabled=""></span>
                                            <label style="font-weight: normal;">
                                                <span style="padding: 0 10px;">{{item.questionAnswer}}</span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- 多选题 -->
                        <div class="panel" v-if="value.subjectType==2">
                            <span style="color: red;">*</span>
                            <label for="">
                                <span>{{value.arg1}}</span>.
                                <span class="quest_topictype">(多选题)</span>
                            </label>
                            <span>{{value.subjectTitle}}</span>
                            <div class="panelbody">
                                <ul>
                                    <li v-for="(item,key2) in value.answerList" :key="key2">
                                        <div class="input-group">
                                            <span class="input-group-addon">
                                                <input type="checkbox" disabled=""></span>
                                            <label style="font-weight: normal;">
                                                <span style="padding: 0 10px;">{{item.questionAnswer}}</span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 填空题 -->
                        <div class="panel panel-info" v-if="value.subjectType==3">
                            <div class="panel-heading form-inline">
                                <div class="form-group" style="width:100%">
                                    <label for="">
                                        <span>{{value.arg1}}</span>.
                                        <span class="quest_topictype">(填空题)</span>
                                    </label>
                                    <span>{{value.subjectTitle}}</span>
                                    </br>
                                    <input type="text" class="form-control" style="width:70%" placeholder="请输入你的答案">
                                </div>
                            </div>
                        </div>
                        <!-- 打分题 -->
                        <div class="panel panel-info" v-if="value.subjectType==4">
                            <div class="panel-heading form-inline">
                                <div class="form-group" style="width:100%">
                                    <label for="">
                                        <span>{{value.arg1}}</span>.
                                        <span class="quest_topictype">(打分题)</span>
                                    </label>
                                    <span>{{value.subjectTitle}}</span>
                                    </br>
                                    <input type="radio">1
                                    <input type="radio">2
                                    <input type="radio">3
                                    <input type="radio">4
                                    <input type="radio">5
                                </div>
                            </div>
                        </div>
                        <div class="panel panel-info" v-if="value.subjectType==5">
                                <div class="panel-heading form-inline">
                                    
                                    <div class="form-group" style="width:100%;word-wrap:break-word;">
                                        <span>{{value.subjectTitle}}</span>
                                        <!-- <el-input type="textarea" v-model=""></el-input> -->
                                    </div>
                                </div>
                        </div>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="previewlistDialog = false">返回</el-button>
            </span>
            </div>
        </el-dialog>
        <div class="ins-page-main" style="position: relative; margin:7px 0px 0px;border:none;padding-bottom: 10px;">
            <!-- <div class="com_h_full" > -->
                <div class="question lf">
                    <div class="ins-tab-title2">
                        <span>
                            <span class="com_fs_4 spanlf">
                                问卷内容
                            </span>
                            <span class="com_fs_4 marlf40 spanlf">插入题目</span>
                        </span>
                        <ul class="btnList">
                            <li @click="addTopic(1)" class="addbtn">单选题</li>
                            <li @click="addTopic(2)" class="addbtn">多选题</li>
                            <li @click="addTopic(3)" class="addbtn">填空题</li>
                            <li @click="addTopic(4)" class="addbtn">打分题</li>
                            <li @click="addTopic(5)" class="addbtn">段落说明</li>
                        </ul>
                    </div>
                    <div style="height: 100%; overflow-y: auto;">
                        <div class="questiontem">
                            <el-form ref="form" :model="topic" label-width="5px">
                                <el-form-item label="">
                                    <el-input v-model="topic.questionnaireTitle" placeholder="请填写问卷标题，最多20字"></el-input>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-input type="textarea" v-model="topic.questionnaireExplain" placeholder="请填写问卷说明最多500字，可不填"></el-input>
                                </el-form-item>
                                <el-form-item v-for="(value,key) in topicList" :key="key">
                                    <!-- 单选题 -->
                                    <div class="panel panel-info" v-if="value.subjectType==1">
                                        <div class="panel-heading form-inline">
                                            <div class="form-group" style="width:100%">
                                                <label for="">
                                                    <span>{{value.arg1}}</span>.
                                                    <span class="quest_topictype">(单选题)</span>
                                                </label>
                                                <input type="text" class="form-control" v-model="value.subjectTitle" style="width:70%" placeholder="请输入单选题题目">
                                                <label>
                                                    <input type="checkbox" v-model="value.subjectIsOptiontype">必答题</label>
                                                <div class="fr" role="group">
                                                    <span class="glyphicon icon_list_up" @click="topicsUp(key)"></span>
                                                    <span class="glyphicon icon_list_down" @click="topicsDown(key)"></span>
                                                    <span class="glyphicon icon_list_del" @click="topicsDel(key)"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="panel-body">
                                            <ul>
                                                <li v-for="(item,key2) in value.answerList" :key="key2">
                                                    <div class="input-group">
                                                        <span class="input-group-addon">
                                                            <span class="glyphicon icon_list_add" @click="topicsAnswerListAdd(key,key2)"></span>
                                                            <span class="glyphicon icon_list_up" @click="topicsAnswerListUp(key,key2)"></span>
                                                            <span class="glyphicon icon_list_down" @click="topicsAnswerListDown(key,key2)"></span>
                                                            <span class="glyphicon icon_list_del" @click="topicsAnswerListDel(key,key2)"></span>
                                                        </span>
                                                        <span class="input-group-addon">
                                                            <input type="radio" disabled=""></span>
                                                        <input type="text" class="form-control" v-model="item.questionAnswer" style="width:80%" placeholder="请在此输入选项">
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- 多选题 -->
                                    <div class="panel panel-info" v-if="value.subjectType==2">
                                        <div class="panel-heading form-inline">
                                            <div class="form-group" style="width:100%">
                                                <label for="">
                                                    <span>{{value.arg1}}</span>.
                                                    <span class="quest_topictype">(多选题)</span>
                                                </label>
                                                <input type="text" class="form-control" v-model="value.subjectTitle" style="width:70%" placeholder="请输入题目">
                                                <label>
                                                    <input type="checkbox" v-model="value.subjectIsOptiontype">必答题</label>
                                                <div class="fr" role="group">
                                                    <span class="glyphicon icon_list_up" @click="topicsUp(key)"></span>
                                                    <span class="glyphicon icon_list_down" @click="topicsDown(key)"></span>
                                                    <span class="glyphicon icon_list_del" @click="topicsDel(key)"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="panel-body">
                                            <ul>
                                                <li v-for="(item,key2) in value.answerList" :key="key2">
                                                    <div class="input-group">
                                                        <span class="input-group-addon">
                                                            <span class="glyphicon icon_list_add" @click="topicsAnswerListAdd(key,key2)"></span>
                                                            <span class="glyphicon icon_list_up" @click="topicsAnswerListUp(key,key2)"></span>
                                                            <span class="glyphicon icon_list_down" @click="topicsAnswerListDown(key,key2)"></span>
                                                            <span class="glyphicon icon_list_del" @click="topicsAnswerListDel(key,key2)"></span>
                                                        </span>
                                                        <span class="input-group-addon">
                                                            <input type="checkbox" disabled="">
                                                        </span>
                                                        <input type="text" class="form-control" v-model="item.questionAnswer" style="width:80%" placeholder="请输入选项">
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="form-group" v-if="value.maxSelect!=null"> 最多可选
                                            <el-input-number v-model="value.maxSelect" :min="2" :max="value.answerList.length" label="描述文字"></el-input-number>
                                            <!-- <el-button-group>
                                                <el-button plain icon="el-icon-minus" size="mini" @click="topicsDelMaxSelect(key)"></el-button>
                                                <el-button plain size="mini">{{value.maxSelect}}</el-button>
                                                <el-button plain icon="el-icon-plus" size="mini" @click="topicsAddMaxSelect(key)"></el-button>
                                                <el-button plain icon="el-icon-plus" size="mini" disabled=""></el-button>
                                            </el-button-group> -->
                                        </div>
                                    </div>
                                    <!-- 填空题 -->
                                    <div class="panel panel-info" v-if="value.subjectType==3">
                                        <div class="panel-heading form-inline">
                                            <div class="form-group" style="width:100%">
                                                <label for="">
                                                    <span>{{value.arg1}}</span>.
                                                    <span class="quest_topictype">(填空题)</span>
                                                </label>
                                                <input type="text" class="form-control" v-model="value.subjectTitle" style="width:70%" placeholder="请输入题目">
                                                <label>
                                                    <input type="checkbox" v-model="value.subjectIsOptiontype">必答题</label>
                                                <div class="fr" role="group">
                                                    <span class="glyphicon icon_list_up" @click="topicsUp(key)"></span>
                                                    <span class="glyphicon icon_list_down" @click="topicsDown(key)"></span>
                                                    <span class="glyphicon icon_list_del" @click="topicsDel(key)"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 打分题 -->
                                    <div class="panel panel-info" v-if="value.subjectType==4">
                                        <div class="panel-heading form-inline">
                                            <div class="form-group" style="width:100%">
                                                <label for="">
                                                    <span>{{value.arg1}}</span>.
                                                    <span class="quest_topictype">(打分题)</span>
                                                </label>
                                                <input type="text" class="form-control" v-model="value.subjectTitle" style="width:70%" placeholder="请输入题目">
                                                <label>
                                                    <input type="checkbox" v-model="value.subjectIsOptiontype">必答题</label>
                                                <div class="fr" role="group">
                                                    <span class="glyphicon icon_list_up" @click="topicsUp(key)"></span>
                                                    <span class="glyphicon icon_list_down" @click="topicsDown(key)"></span>
                                                    <span class="glyphicon icon_list_del" @click="topicsDel(key)"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group"> 最大分值
                                            <template>
                                                <el-input-number size="mini" v-model="value.maxSelect" @change="handleChange" :min="1" :max="10" label=""></el-input-number>
                                            </template>
                                        </div>
                                    </div>
                                    <!-- 段落说明 -->
                                    <div class="panel panel-info" v-if="value.subjectType==5">
                                        <div class="panel-heading form-inline">
                                            <div class="form-group" style="width:100%">
                                                <el-input type="textarea" :rows="2" placeholder="请输入段落说明内容，最多200字" :maxlength="200" style="width:90%" v-model="value.subjectTitle"></el-input>
                                                <!-- <textarea type="text" class="form-control" v-model="value.subjectTitle" style="width:90%" placeholder="请在此输入段落说明内容，最多200字"></textarea> -->
                                                <div class="fr" role="group">
                                                    <span class="glyphicon icon_list_up" @click="topicsUp(key)"></span>
                                                    <span class="glyphicon icon_list_down" @click="topicsDown(key)"></span>
                                                    <span class="glyphicon icon_list_del" @click="topicsDel(key)"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <div class="tree fr com_h_full">
                    <div style="height:100%;border-radius: 5px;overflow: hidden;border: 1px solid #62d5da; padding-bottom:250px;">
                        <div class="HeadButtonlist camanusearch">
                            <div class="ins-tab-title2">
                                <span class="com_fs_4 spanlf">问卷范围</span>
                            </div>
                            <div style="padding:10px 0px 10px 4%;width:98%;">
                                <ul class="outSystemUl">
                                    <li>
                                        <template>
                                            <el-radio v-model="topic.isRealName" label="0">不记名问卷</el-radio>
                                            <el-radio v-model="topic.isRealName" label="1"> 
                                            <el-tooltip class="item" effect="dark" content="若选中为实名问卷，则会收集问卷用户姓名。否则不收集，无论是否实名，智慧英泰系统内部每个用户，都只能提交一次相同的问卷" placement="top-start">
                                            <el-button style="border:none">实名问卷</el-button>
                                            </el-tooltip></el-radio>
                                        </template>
                                    </li>
                                    <li>
                                        <label for="outSystem">
                                            <input type="checkbox" id="outSystem" v-model="topic.isShareType"> 分享到致慧英泰系统外用户</label>
                                    </li>
                                    <li>
                                        <label for="qrCode">
                                            <input type="checkbox" id="qrCode" v-model="topic.isQrcodeType"> 使用匿名防刷票二维码</label>
                                    </li>
                                </ul>
                                <div class="form-group has-feedback com_input">
                                    <span class="glyphicon glyphicon-search form-control-feedback p_l_0" style="padding-top:2px;"></span>
                                    <el-input placeholder="可按照部门、年级进行搜索" v-model="filterText"></el-input>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="helplconline" style="margin-bottom:0px;"></div> -->
                        <div style="overflow:auto;background:#fff;padding: 10px 20px;height:100%">
                            <!-- //树 -->
                            <el-tree :data="treeData" show-checkbox default-expand-all node-key="currentId" ref="tree" :filter-node-method="filterNode" highlight-current :props="defaultProps">
                            </el-tree>
                        </div>
                        <!-- <div class="helplconline" style="margin-bottom:0px;"></div> -->
                    </div>
                </div>
            <!-- </div> -->
        </div>
    </div>

    </div>
</template>
<style scoped>
.ins-tab-title2 {
  border-bottom: 1px solid #e6e6e6;
  height: 40px;
  width: 100%;
  padding: 0 5px 0 12px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: #409eff;
  color: #fff;
}
.marlf40 {
  margin-left: 40px;
}
.spanlf {
  display: block;
  float: left;
  line-height: 40px;
}
.lf {
  float: left;
}
.fr {
  float: right;
}
.btnList {
  display: block;
}
.btnList li {
  float: left;
}
.addbtn {
  font-size: 14px;
  margin: 8px auto auto 30px;
  padding: 0px 9px;
  border: 1px solid #fff;
  border-radius: 10px;
  cursor: pointer;
}
.question {
  width: 73%;
  height: 100%;
  padding-bottom: 40px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
}
.questiontem {
  padding: 20px 30px;
  border: 1px solid #eee;
}
.outSystemUl {
  font-size: 14px;
  color: #606266;
  line-height: 32px;
}
.tree {
  width: 25%;
}
.panel {
  width: 100%;
  border: 1px solid #bce8f1;
  margin-bottom: 20px;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  padding: 20px;
}
.glyphicon {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: "Glyphicons Halflings";
  font-style: normal;
  /* font-weight: normal; */
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.topicCss .glyphicon,
label {
  cursor: pointer;
}
.form-group {
  margin-bottom: 20px;
}
.form-control {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 1;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.quest_gz_sm {
  font-size: 12px;
  padding: 0px;
}

.quest_add_sl {
  float: left;
  width: 100%;
  display: none;
  border: 1px solid #ccc;
  padding: 4px;
  margin-bottom: 10px;
}

.quest_add_sl .itemsl {
  float: left;
  width: 100%;
  height: 20px;
  line-height: 20px;
  position: relative;
}

.quest_add_sl .itemsl .leftdivsl {
  float: left;
  width: 200px;
}

.quest_add_sl .itemsl .rightdivsl {
  float: left;
}
.quest_topictype {
  color: #00a9f4;
  margin-left: 20px;
  font-weight: 100;
}
.input-group {
  margin-bottom: 20px;
}
.chk_realname + label:after {
  content: "非实名";
}
.chk_realname:checked + label:after {
  content: "实名";
}
.icon_list_add {
  background: url("../../assets/images/icon_list.png") no-repeat -5px -4px;
  width: 20px;
  height: 20px;
}
.icon_list_add:hover {
  background: url("../../assets/images/icon_list.png") no-repeat -5px -36px;
}
.icon_list_del {
  background: url("../../assets/images/icon_list.png") no-repeat -95px -4px;
  width: 20px;
  height: 20px;
}
.icon_list_del:hover {
  background: url("../../assets/images/icon_list.png") no-repeat -95px -36px;
}
.icon_list_up {
  background: url("../../assets/images/icon_list.png") no-repeat -35px -4px;
  width: 20px;
  height: 20px;
}
.icon_list_up:hover {
  background: url("../../assets/images/icon_list.png") no-repeat -35px -36px;
}
.icon_list_down {
  background: url("../../assets/images/icon_list.png") no-repeat -65px -4px;
  width: 20px;
  height: 20px;
}
.icon_list_down:hover {
  background: url("../../assets/images/icon_list.png") no-repeat -65px -36px;
}
.topicCss .input-group-addon {
  padding: 5px 12px;
}
</style>
<script src="./js/newQuestionnaire.js"></script>