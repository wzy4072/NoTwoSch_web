<template>
  <div class="full-height">
     <div class="ins-page-search">
        <div class="ins-search-con">
           <el-select v-model="curprojectId" placeholder="请选择" size="small" style="float:left;margin-right:20px; width:300px;">
            <el-option
              v-for="item in getProcessArr"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
          <!-- <el-button @click="searchFun()" type="primary" size="medium" style="float:left;margin-right:10px;"  >查询</el-button> -->
        </div>
      </div>
    <div class="msg-left" style="width:40%">
      <div class="msg-left-title">日志列表</div>
      <div style="height:100%;overflow-y: scroll; padding-bottom:40px;" v-if="krtenlist.length>0">
      <div class="msg-left-list" v-for="(item,key) in krtenlist" :key="key"   >
        <div class="msg-left-list-title">
          <span class="KindergarteName">{{item.krtenName}}</span>
          <span class="handle" @click="addlog(item,1)"> <i class="addIcon"></i> 新建日志</span>
          <div class="clear"></div>
        </div>
        <div >
          <!-- {{item.list[0]}} -->
          <!-- <div v-if="item.list[0]">{{item.list[0].list}}</div> -->
          <div v-if="item.list[0]">
          <div class="msg-left-item"    v-for="(data,index) in item.list[0].list" :key="index" @click="changeItem(item,index)">
          <span style="float:left" v-if="data.logStatus=='0'">【草稿】</span>
          <span  style="float:left">{{data.logTitile}}</span>
          <span class="sub"  style="float:right;padding-right:20px;">{{$api.getDateAll(data.createDate,'-')}}</span>
        </div></div>
        </div>
      </div>
    </div>
    <div style="height:100%;padding-bottom:40px; padding-top:50px; text-align:center;"  v-else>暂无幼儿园信息</div>
    </div>
     <div class="msg-middle" style="width:55%;float:right;margin-right:2%;">
      <div class="msg-middle-title">
        <span class="logContent">日志内容 </span> 
         <span v-if="logDetail.logStatus=='0'" class="editLog" @click="addlog(logArr,2)"><i class="addIcon"></i> 编辑</span>
      </div>
      <div class="clear"></div>
      <div class="msg-middle-context" style="padding-right:20px;" v-if="logList.length>0">
        <p class="msg-middle-head">
          {{logDetail.logTitile}}
        </p>
        <p class="msg-middle-sub-head">
          时间: <span class="sub">{{$api.getDateAll(logDetail.createDate,'-','hms')}}</span>
        </p>
        <div class="msg-middle-body">
           {{ logDetail.logContent}}
        </div>
        <div class="msg-middle-sub-head">
         <span>附件：</span> 
         <p  v-for="(item,key) in logDetail.atts" :key="key" class="subfile"> <span class="sub " >{{item.attName}}</span><a class="subrt" :href="baseUrl+'baseInfo/noticeSys/download/'+item.id">下载附件</a></p>
        </div>
      </div>
        <div  class="msg-middle-context" style="padding-right:20px;" v-else>
          <p style="text-align:center;padding-top:50px;"> 暂未添加日志</p>
        </div>
    </div>
  </div>
</template>
<script src="./js/LogManagement.js"></script>
<style lang="less" src="./style/logManagement.less" scoped></style>
<style scoped>
.msg-textarea >>> textarea {
  height: 100%;
}
.KindergarteName{ float: left; line-height: 40px;}
.handle{ float: right; margin-right: 20px;  padding:7px 20px; border-radius: 5px; border: 1px solid #ccc }
.addIcon{background: url(../../assets/images/fileAdd.png)no-repeat left;padding: 10px;}
.clear{clear: both;}
.logContent{ float: left; line-height: 40px;}
.editLog{float: right;border-radius: 5px; border: 1px solid #ccc ;font-size: 14px; margin:5px 20px 0px 0px; padding: 7px 20px; }
.subfile{ background: #eee; margin-top: 10px; padding: 5px 10px;}
.subfile span{font-size: 12px;color: #363747;}
.subfl{ float: left;}
.subrt{ float: right; color: #363747;}
</style>

