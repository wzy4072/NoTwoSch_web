<template>
  <div class="full-height">
     <div class="ins-page-searchs">
          <div class="ins-search-con">
              <el-button size="medium" style="margin-left: 10px;" type="primary" @click="returnPre()">
                  <span class="el-icon-search">
                  </span>
                  <span>
                      返回
                  </span>
              </el-button>
          </div>
      </div>
    <div class="msg-left">
    <div class="msg-left-list">
       <div class="msg-step">
     <el-steps direction="vertical" :active="stepStatus">
       <el-step></el-step>
       <el-step></el-step>
       <el-step></el-step>
       <el-step></el-step>
       <el-step></el-step>
       <el-step></el-step>
       <el-step></el-step>
      </el-steps>
      </div>
      <ul>
        <template v-for="(item, index) in steps">
        <li @click="clStep(index)" :class="{'liClick':clickIndex===index}">
          <div class="icond">
            <img v-if="!(index%2)" src="../../assets/images/home.png" />
             <img v-if="index%2" src="../../assets/images/peick.png" />
          </div>
          <div class="msg-middle-head">{{item.stepName}}</div>
          <div class="msg-tip-cot">
          <div :class="['msg-tip',{'msg-tip-pedding':item.stepStatus===1},{'msg-tip-end':item.stepStatus===0}]"></div>
          <div class="msg-tip-text">{{status[item.stepStatus]}}</div>
          </div>
          </li>
          <div v-if="index!==steps.length-1" class="empty"></div>
          </template>
</ul>
</div>
</div>
<!-- 第一步 -->
<div class="msg-middle" v-if="clickIndex===0&&steps[clickIndex]">
    <div class="msg-middle-title">学年专项问题提出
    <!-- <el-button size="medium" type="primary" icon="el-icon-edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus>=clickIndex" @click="editF()" v-show="!edit" class="btn msg-btn">编辑</el-button>  -->
    <el-button size="medium" type="primary" icon="el-icon-edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus>clickIndex&&steps[clickIndex].stepStatus!==2" @click="editF()" v-show="!edit" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <!-- <div class="msg-middle-context" v-if="(!steps[clickIndex].isEdit)&&clickIndex<=stepStatus&&steps[clickIndex].processStepcontents.length>0"> -->
        <div class="msg-middle-context" v-if="clickIndex<=stepStatus&&steps[clickIndex].processStepcontents.length>0">
            <!-- {{steps[clickIndex].processStepcontents[0]['content']}} -->
        <p class="msg-middle-head">
            提升项目：<span v-show="edit&&itemName=='待提交'" @click="dialogVisible=true" class="msg-link">点击设置</span>
                     <span v-show="itemName!=='待提交'" @click="design()" class="msg-link">{{itemName}}</span>
        </p>
        <p class="msg-middle-head">
            具体问题：
        </p>
        <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">具体问题的详细</p>
        <P v-show="edit">
            <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[0]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
            </el-input>
        </P>
       
      <p class="msg-middle-head">
            问题成因自析：
        </p>
        <p v-show="!edit"  v-html="steps[clickIndex].processStepcontents[1]['content']" class="msg-middle-body">问题成因自析</p>
        <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[1]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input>
        
        <p class="msg-middle-head">
            所需专业支援：
        </p>
        <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[2]['content']" class="msg-middle-body">所需专业支援</p>
        <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[2]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input>
        
        <p class="msg-middle-head">
            提升目标和措施:
        </p>
        <p v-show="!edit"  v-html="steps[clickIndex].processStepcontents[3]['content']" class="msg-middle-body">所需专业支援</p>
        <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[3]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input>

          <p class="msg-middle-head">
            预期效果:
        </p>
        <p v-show="!edit"  v-html="steps[clickIndex].processStepcontents[4]['content']" class="msg-middle-body">所需专业支援</p>
        <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[4]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input>
    </div>

    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>每个学年开始后幼儿园负责人需在15个工作日内完成此项工作。</p>
    </div>
</div>
<!-- 第二步 -->
<div class="msg-middle" v-if="clickIndex===1">
    <div class="msg-middle-title">专项问题解决建议
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="editF()" v-show="!edit"  v-if="(!steps[clickIndex].isEdit)&&stepStatus==2" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <!-- <div class="msg-middle-context" v-if="(!steps[clickIndex].isEdit)&&stepStatus>=2"> -->
    <div class="msg-middle-context" v-if="stepStatus>=2&&steps[clickIndex].processStepcontents.length>0">
        <div class="uploaddiv" style="margin:20px 0px;">
          <el-upload v-show="edit" class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
              <a size="small" class="upload" type="primary">添加附件</a>
            </el-upload>
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata" id="ue" :config="config" ref="Ue"></ue>
                </div>
            </div>
            <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">文字内容文字内容</p>
            <div class="msg-middle-sub-head" v-show="!edit"  v-if="steps[clickIndex].processStepcontents[0].attachments" >
                <span>附件：</span>
                 <p  v-for="(b,s) in steps[clickIndex].processStepcontents[0].attachments" :key="s" class="subfile"> <span class="sub " >{{b.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+b.id">下载附件</a></p>
            </div>
        </div>
    </div>
    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>幼儿园提交“学年专项问题提出”后，责任督学需在15个工作日内完成此项工作。</p>
    </div>
</div>
<!-- 第三步 -->
<div class="msg-middle" v-if="clickIndex===2">
    <div class="msg-middle-title">上学期效果自评
        <el-button size="medium" type="primary" icon="el-icon-edit" @click="editF()" v-show="!edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus==3" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <!-- <div class="msg-middle-context" v-if="(!steps[clickIndex].isEdit)&&stepStatus>=3"> -->
        <div class="msg-middle-context" v-if="stepStatus>=3&&steps[clickIndex].processStepcontents.length>0">
         <div class="uploaddiv" style="margin:20px 0px;">
          <el-upload v-show="edit" class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
              <a size="small" class="upload" type="primary">添加附件</a>
            </el-upload>
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata" id="ue"  :config="config" ref="Ue"></ue>
                </div>
            </div>
            <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">文字内容文字内容</p>
            <div class="msg-middle-sub-head" v-show="!edit"  v-if="steps[clickIndex].processStepcontents[0].attachments" >
                <span>附件：</span>
                 <p  v-for="(b,s) in steps[clickIndex].processStepcontents[0].attachments" :key="s" class="subfile"> <span class="sub " >{{b.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+b.id" >下载附件</a></p>
            </div>
        </div>
    </div>
    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>上学期结束前15个工作日内，幼儿园需完成此项工作。</p>
    </div>
</div>
<!-- 第四步 -->
<div class="msg-middle" v-if="clickIndex===3">
    <div class="msg-middle-title">上学期效果总结
     
        <el-button size="medium" type="primary" icon="el-icon-edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus==4" @click="editF()" v-show="!edit" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <div class="msg-middle-context" v-if="stepStatus>=3&&steps[clickIndex].processStepcontents.length>0">
        <!-- <div class="msg-middle-context" v-if="(!steps[clickIndex].isEdit)&&stepStatus>=3"> -->
        <div class="msg-middle-head">
            督导数据:
            <div class="uploaddiv" style="margin:20px 0px;">
          <el-upload v-show="edit" class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
              <a size="small" class="upload" type="primary">添加附件</a>
            </el-upload>
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata" id="ue" :config="config" ref="Ue"></ue>
                </div>
            </div>
            <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">文字内容文字内容</p>
            <div class="msg-middle-sub-head" v-show="!edit"  v-if="steps[clickIndex].processStepcontents[0].attachments" >
                <span>附件：</span>
                 <p  v-for="(b,s) in steps[clickIndex].processStepcontents[0].attachments" :key="s" class="subfile"> <span class="sub " >{{b.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+b.id" >下载附件</a></p>
            </div>
        </div>
        </div>
        <p class="msg-middle-head">
            园所典型亮点:
        </p>
        <p  v-if="steps[clickIndex].processStepcontents[1]" v-show="(!edit)&&steps[clickIndex].processStepcontents[1]" v-html="steps[clickIndex].processStepcontents[1]['content']" class="msg-middle-body">具体问题的详细</p>
        <div   v-if="steps[clickIndex].processStepcontents[1]" v-show="edit">

            <!-- <el-input  v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[1]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
            </el-input> -->
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata1" id="ue1" :config="config1" ref="Ue1"></ue>
                </div>
            </div>    
        </div>
        <!-- 问题成因自析 -->
        <p class="msg-middle-head">
            突出问题与解决方案及效果分析:
        </p>
        <p v-if="steps[clickIndex].processStepcontents[2]"   v-show="(!edit)&&steps[clickIndex].processStepcontents[2]"  v-html="steps[clickIndex].processStepcontents[2]['content']" class="msg-middle-body">问题成因自析</p>
        <!-- <el-input v-if="steps[clickIndex].processStepcontents[2]"  v-show="edit&&steps[clickIndex].processStepcontents[2]" type="textarea" v-model="steps[clickIndex].processStepcontents[2]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
          <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata2" id="ue2" :config="config2" ref="Ue2"></ue>
                </div>
            </div>  
        <p class="msg-middle-head">
            下学期目标
        </p>
        <p v-if="steps[clickIndex].processStepcontents[3]" v-show="(!edit)&&steps[clickIndex].processStepcontents[3]"  v-html="steps[clickIndex].processStepcontents[3]['content']" class="msg-middle-body">所需专业支援</p>
        <!-- <el-input v-if="steps[clickIndex].processStepcontents[3]"  v-show="edit&&steps[clickIndex].processStepcontents[3]" type="textarea" v-model="steps[clickIndex].processStepcontents[3]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
        <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                   <ue :maindata.sync="maindata3"  id="ue3" :config="config3" ref="Ue3"></ue>
                </div>
            </div>  
    </div>
    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>幼儿园提交“上学期效果自评”后，责任督学需在15个工作日内完成此项工作。</p>
    </div>
</div>
<!-- 第五步 -->
<div class="msg-middle" v-if="clickIndex===4">
    <div class="msg-middle-title">下学期效果自评
        <el-button size="medium" type="primary" icon="el-icon-edit" @click="editF()" v-show="!edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus==5" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <div class="msg-middle-context" v-if="stepStatus>=4&&steps[clickIndex].processStepcontents.length>0">
    <!-- <div class="msg-middle-context" v-if="(!steps[clickIndex].isEdit)&&stepStatus>=4"> -->
          <div class="uploaddiv" style="margin:20px 0px;">
          <el-upload v-show="edit" class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
              <a size="small" class="upload" type="primary">添加附件</a>
            </el-upload>
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata" id="ue"  :config="config" ref="Ue"></ue>
                </div>
            </div>
            <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">文字内容文字内容</p>
            <div class="msg-middle-sub-head" v-show="!edit"  v-if="steps[clickIndex].processStepcontents[0].attachments" >
                <span>附件：</span>
                 <p  v-for="(b,s) in steps[clickIndex].processStepcontents[0].attachments" :key="s" class="subfile"> <span class="sub " >{{b.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+b.id">下载附件</a></p>
            </div>
        </div>
    </div>
    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>下学期结束前15个工作日内，幼儿园需完成此项工作。</p>
    </div>
</div>
<!-- 第六步 -->
<div class="msg-middle" v-if="clickIndex===5">
    <div class="msg-middle-title">下学期效果总结
     <el-button size="medium" type="primary" icon="el-icon-edit" @click="editF()" v-show="!edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus==6" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <div class="msg-middle-context" v-if="stepStatus>=5&&steps[clickIndex].processStepcontents.length>0">
        <div class="msg-middle-head">
            督导数据:
            <div class="uploaddiv" style="margin:20px 0px;">
                <el-upload v-show="edit" class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
                    <a size="small" class="upload" type="primary">添加附件</a>
                </el-upload>
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata" id="ue" :config="config" ref="Ue"></ue>
                </div>
            </div>
            <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">文字内容文字内容</p>
            <div class="msg-middle-sub-head" v-show="!edit"  v-if="steps[clickIndex].processStepcontents[0].attachments" >
                <span>附件：</span>
                 <p  v-for="(b,s) in steps[clickIndex].processStepcontents[0].attachments" :key="s" class="subfile"> <span class="sub " >{{b.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+b.id">下载附件</a></p>
            </div>
        </div>
        </div>
        <p class="msg-middle-head">
            园所典型亮点:
        </p>
         <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[1]['content']" class="msg-middle-body">问题成因自析</p>
        <!-- <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[1]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
         <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata1" id="ue1" :config="config1" ref="Ue1"></ue>
                </div>
            </div>    
        <!-- 问题成因自析 -->
        <p class="msg-middle-head">
            突出问题与解决方案及效果分析:
        </p>
        <p v-show="!edit" v-if="steps[clickIndex].processStepcontents" v-html="steps[clickIndex].processStepcontents[2]['content']" class="msg-middle-body">所需专业支援</p>
        <!-- <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[2]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
          <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata2" id="ue2" :config="config2" ref="Ue2"></ue>
                </div>
            </div>  
        <p class="msg-middle-head">
            学年效果总结
        </p>
        <p v-show="!edit"  v-html="steps[clickIndex].processStepcontents[3]['content']" class="msg-middle-body">所需专业支援</p>
        <!-- <el-input v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[3]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
          <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata3" id="ue3" :config="config3" ref="Ue3"></ue>
                </div>
            </div>  
    </div>
    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>幼儿园提交“下学期效果自评”后，责任督学需在15个工作日内完成此项工作。</p>
    </div>
</div>
<!-- 第七步 -->
<div class="msg-middle" v-if="clickIndex===6">
    <div class="msg-middle-title">学年督学工作评价
        <el-button size="medium" type="primary" icon="el-icon-edit" v-if="(!steps[clickIndex].isEdit)&&stepStatus==7" @click="editF()" v-show="!edit" class="btn msg-btn">编辑</el-button>
        <el-button size="medium" type="primary" @click="save(2)" class="btn msg-btn" v-show="edit"><img src="../../assets/images/submit.png" />提交</el-button>
        <el-button size="medium" class="btn msg-btn" @click="save(1)" v-show="edit"><img src="../../assets/images/save.png" /> 保存</el-button>
        <el-button size="medium" class="btn msg-btn" @click="cancelEdit()" v-show="edit"><img src="../../assets/images/eidt.png" />放弃编辑</el-button>
    </div>
    <div class="msg-middle-context" v-if="stepStatus>=7&&steps[clickIndex].processStepcontents.length>0">
        <div class="msg-middle-head">
              问题发现情况:
            <div class="uploaddiv" style="margin:20px 0px;">
                <el-upload v-show="edit" class="upload-demo" name="FILE"  :headers="token" :auto-upload="true" :before-remove="beforeRemove"  :before-upload="beforeAvatarUpload" :action="UploadUrl()" :onSuccess="uploadSuccessFun" :onError="uploadErrorFun" :file-list="fileList"  :show-file-list="true" >
                    <a size="small" class="upload" type="primary">添加附件</a>
                </el-upload>
            <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata" id="ue" :config="config" ref="Ue"></ue>
                </div>
            </div>    
            <p v-show="!edit" v-html="steps[clickIndex].processStepcontents[0]['content']" class="msg-middle-body">文字内容文字内容</p>
            <div class="msg-middle-sub-head" v-show="!edit"  v-if="steps[clickIndex].processStepcontents[0].attachments" >
                <span>附件：</span>
                 <p  v-for="(b,s) in steps[clickIndex].processStepcontents[0].attachments" :key="s" class="subfile"> <span class="sub " >{{b.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+b.id">下载附件</a></p>
            </div>
        </div>
        </div>
        <p class="msg-middle-head">
            问题解决情况及效果:
        </p>
        <p   v-show="!edit" v-html="steps[clickIndex].processStepcontents[1]['content']" class="msg-middle-body">具体问题的详细</p>
        <!-- <P   v-show="edit">
            <el-input  v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[1]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
            </el-input>
        </P> -->
         <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata1" id="ue1" :config="config1" ref="Ue1"></ue>
                </div>
            </div>    
        <!-- 问题成因自析 -->
        <p class="msg-middle-head">
            责任督学工作态度:
        </p>
        <p    v-show="!edit"  v-html="steps[clickIndex].processStepcontents[2]['content']" class="msg-middle-body">问题成因自析</p>
        <!-- <el-input  v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[2]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
         <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata2" id="ue2" :config="config2" ref="Ue2"></ue>
                </div>
            </div>    
        <p class="msg-middle-head">
            责任督学纪律作风：
        </p>
        <p  v-show="!edit"  v-html="steps[clickIndex].processStepcontents[3]['content']" class="msg-middle-body">所需专业支援</p>
        <!-- <el-input  v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[3]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
        <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata3" id="ue3" :config="config3" ref="Ue3"></ue>
                </div>
            </div>    
          <p class="msg-middle-head">
            责任督学专业能力：
        </p>
        <p v-show="!edit"  v-html="steps[clickIndex].processStepcontents[4]['content']" class="msg-middle-body">所需专业支援</p>
        <!-- <el-input   v-show="edit" type="textarea" v-model="steps[clickIndex].processStepcontents[4]['content']" :row="5" class="msg-min-area" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input> -->
         <div v-show="edit"  style="margin:20px 0px;">
                <div class="uploaddiv mart50">
                    <ue :maindata.sync="maindata4" id="ue4" :config="config4" ref="Ue4"></ue>
                </div>
            </div>    
    </div>
    <div class="msg-middle-context noneclass" v-else>
        <p>暂无信息</p>
        <p>责任督学提交“下学期效果总结”后，幼儿园需在15个工作日内完成此项工作。</p>
    </div>
</div>
<div class="msg-right">
    <div class="msg-right-top">
        <div class="msg-right-one">
            <img src="../../assets/images/ampty.png" />
        </div>
        <el-input type="textarea" v-model="comment.commentContent" class="msg-textarea" maxlength="200" placeholder="您可以在此输入内容，最多200字">
        </el-input>
        <div class="msg-right-two">
            <el-button class="btn" @click="addComment" type="primary" size="medium" :disabled="steps[clickIndex].stepStatus!==2">发送</el-button>
        </div>
    </div>
    <div class="msg-right-middle"></div>
    <div class="msg-right-bottom">
        <div class="msg-middle-title">留言板</div>
        <div class="msg-right-context">
            <template v-if="steps[clickIndex]">
            <div class="msg-right-item"  v-for="item in steps[clickIndex]['comments']">
                <img :src="item.userImg" v-if="item.userImg"/>
                <img src="../../assets/images/ampty.png"  v-else/>
                <p class="msg-middle-head msg-right-item-head">{{item.userActualName}}</p>
                <p class="sub">{{$api.getDateAll(item.createDate,'','hms')}}</p>
                <p class="msg-middle-sub-head context">{{item.commentContent}}</p>
            </div>
          </template>
        </div>
    </div>
</div>
<el-dialog title="提升项目选择" width="500px" :visible.sync="dialogVisible">
    <div style="height:600px;overflow-y:scroll ">
        <el-table class="ins-spe-table" style="width：100%" :data="data" border @row-click="rowclick" >
            <el-table-column align="left" prop="menuName" label="">
                <template slot-scope="scope">
                    <p :class="'space'+scope.row.level">{{scope.row.menuName}}</p>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div style="  text-align: right">
        <el-button type="success" @click="Determine" class="btn">确定</el-button>
        <el-button type="danger" @click="dialogVisible=false" class="btn">取消</el-button>
    </div>
</el-dialog>

</div>
</template>
<script src="./js/CategoryDetails.js"></script>
<style lang="less" scoped>
    @import "./style/SpecialSupervision.less";
    .space0{
        text-indent: 10px;
    }
    .space1{
        text-indent: 25px;
    }
    .space2{
        text-indent: 40px;
    }
    .space3{
        text-indent: 55px;
    }
    .space4{
        text-indent: 70px;
    }
    .space5{
        text-indent: 85px;
    }
    .msg {
        &-step {
            padding: 18px 0 18px 14px;
            height: 100%;
            float: left;
            width: 50px;
        }
        &-tip {
            position: absolute;
            width: 50px;
            height: 50px;
            top: 11px;
            left: 11px;
            background: #00A8FF;
            transform: rotate(-45deg);
            border-top-right-radius: @msg-title-radius;
            &-pedding {
                background: #18BE6C;
            }
            &-end {
                background: #ADADAD;
            }
            &-cot {
                width: 71px;
                height: 37px;
                overflow: hidden;
                position: absolute;
                transform: rotate(45deg);
                right: -23px;
                top: -7px;
            }
            &-text {
                position: absolute;
                left: 14px;
                top: 17px;
                color: #ffff;
                font-size: @msg-context-font;
            }
        }
        &-btn {
            float: right;
            margin: 8px 10px 0 0;
            & img {
                vertical-align: middle;
                margin-top: -4px;
                margin-right: 5px;
            }
        }
        &-link {
            color: #3c7bff;
            cursor: pointer;
        }
        &-dialog {
            height: 500px;
            .overflow();
        }
    }

    .msg-left-list>ul {
        float: left;
        height: 100%;
        list-style: none;
        &>.empty {
            height: 9%;
        }
        &>.liClick {
            background: #61a5ff;
            border-color: #68A9FF;
            &>.icond {
                background: #2e88ff;
            }
            &>.msg-middle-head {
                color: #ffffff;
            }
            &:hover {
                background: #61a5ff;
                border-color: #68A9FF;
                &>.icond {
                    background: #2e88ff;
                }
                &>.msg-middle-head {
                    color: #ffffff;
                }
            }
        }
        &>li {
            width: 258px;
            height: 54px;
            border-radius: @msg-title-radius;
            border: 1px solid @msg-border-color;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            /* Firefox 4 */
            -webkit-transition: all 0.2s ease-in-out;
            /* Safari 和 Chrome */
            -o-transition: all 0.2s ease-in-out;
            &:hover {
                background: #e9f4ff;
                border-color: #68A9FF;
                &>.icond {
                    background: #8bc3fc;
                }
                &>.msg-middle-head {
                    color: #68A9FF;
                }
            }
            &>.icond {
                height: 54px;
                width: 50px;
                background: #DAEBFD;
                border-top-left-radius: @msg-title-radius;
                border-bottom-left-radius: @msg-title-radius;
                -moz-transition: all 0.2s ease-in-out;
                /* Firefox 4 */
                -webkit-transition: all 0.2s ease-in-out;
                /* Safari 和 Chrome */
                -o-transition: all 0.2s ease-in-out;
                float: left;
                & img {
                    margin: 11px 0 0 11px;
                }
            }
            &>.msg-middle-head {
                display: inline-block;
                padding: 16px 0 0 13px;
                -moz-transition: all 0.2s ease-in-out;
                /* Firefox 4 */
                -webkit-transition: all 0.2s ease-in-out;
                /* Safari 和 Chrome */
                -o-transition: all 0.2s ease-in-out;
            }
        }
    }
.subfile{ background: #eee; margin-top: 10px; padding: 5px 10px;}
.subfile span{font-size: 12px;color: #363747;}
.subfl{ float: left;}
.subrt{ float: right; color: #363747;}
.ins-page-searchs{padding: 4px 0px;width: 100%;height: 44px;font-size: 14px;}
</style>

<style scoped>
    a {
        color: #409EFF
    }

    .msg-textarea>>>textarea {
        height: 100%;
    }

    .msg-min-area {
        margin-top: 10px;
    }

    .msg-min-area>>>textarea {
        height: 200px;
    }

    .noneclass {
        font-size: 16px;
        color: #363747;
        text-align: center;
        padding-top: 30%
    }

    .noneclassp {
        line-height: 45px;
    }
</style>
