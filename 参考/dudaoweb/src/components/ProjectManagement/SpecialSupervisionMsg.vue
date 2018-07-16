<template>
  <div class="full-height">
     <div class="ins-page-search">
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
      <div class="msg-left-title">日志列表</div>
    <div class="msg-left-list" v-if="list.length>0">
      <div :class="['msg-left-item',{'msg-left-item-selected':clickIndex===index}]" v-for="(item,index) in list" @click="itemClick(index)">
        {{item.logTitile}}<br/>
        <span class="sub">{{$api.getDateAll(item.createDate)}}</span>
      </div>
    </div>
    <div class="msg-left-list border center" v-else>暂无</div>
    </div>
     <div class="msg-middle">
      <div class="msg-middle-title">日志内容</div>
      <div class="msg-middle-context" v-if="list.length>0">
        <p class="msg-middle-head">
          {{list[clickIndex].logTitile}}
        </p>
        <p class="msg-middle-sub-head">
          时间: <span class="sub">{{$api.getDateAll(list[clickIndex].createDate,'-','hms')}}</span>
        </p>
        
        <div class="msg-middle-body">
           {{list[clickIndex].logContent}}
        </div>
         <!-- <p class="msg-middle-sub-head">
          <span>附件:</span> <a class="colorF" v-for="(d,s) in list[clickIndex].atts" :key="s" :href="d.attUrl">{{d.attName}}</a>
        </p> -->
        <div class="msg-middle-sub-head">
         <span>附件：</span> 
         <p v-for="(d,s) in list[clickIndex].atts" :key="s"  class="subfile"> <span class="sub " >{{d.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+d.id" >下载附件</a></p>
        </div>
      </div>
      <div class="msg-middle-context center" v-else>
        暂无
      </div>
    </div>
    <div class="msg-right">
      <div class="msg-right-top">
        <div class="msg-right-one">
           <img src="../../assets/images/ampty.png"/>
        </div>
        <el-input
          type="textarea"
          class="msg-textarea"
          maxlength="200"
          v-model="comment.commentContent"
          placeholder="您可以在此输入内容，最多200字">
        </el-input>
        <div class="msg-right-two">
            <el-button class="btn" @click="addComment" type="primary" size="medium" >发送</el-button>
        </div>
      </div>
      <div class="msg-right-middle"></div>
      <div class="msg-right-bottom">
        <div class="msg-middle-title">留言板{{list.length}}</div>
        <div class="msg-right-context"  v-if="list.length>0">
          <div class="msg-right-item" v-for="(o,k) in list[clickIndex]['comments']" :key="k">
            <img src="../../assets/images/minpanel.png"/>
             <p class="msg-middle-head msg-right-item-head">{{o.userActualName}}</p>
            <p class="sub">{{$api.getDateAll(o.createDate,'-','hms')}}</p>
            <p class="msg-middle-sub-head context">{{o.commentContent}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" src="./style/SpecialSupervision.less" scoped></style>
<script src="./js/SpecialSupervisionMsg.js"></script>
<style scoped>
    .msg-textarea>>>textarea {
        height: 100%;
    }
    .border{ border: 1px solid #e5e9f4}
    .center{ text-align: center;padding-top: 20px; color:#606266}
   .subfile{ background: #eee; margin-top: 10px; padding: 5px 10px;}
    .subfile span{font-size: 12px;color: #363747;}
    .subfl{ float: left;}
    .subrt{ float: right; color: #363747;}
   
</style>
