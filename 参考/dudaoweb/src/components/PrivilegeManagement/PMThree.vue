<!-- 权限管理（教育局） -->
<style scoped>
   .privilege-management{
        border: none;
        padding: 0;
        overflow: hidden;
   }
   .privilege-management .item-con{
      height: 100%;
      font-size: 15px;
      position: relative;
      padding-top:76px; 
   }
   .item-con .item-title{
      background-color: #719fff;
      height:38px;
      line-height: 38px;
      padding-left: 10px;
      position: absolute;
      top: 0;
      width:100%;
      color:#fff;
          border-top-right-radius:5px;
      border-top-left-radius:5px;
   }
   .item-con .item-head{
      height:38px;
      line-height: 38px;
      position: absolute;
      top: 38px;
      width: 100%;
      padding-left:10px;
      border:1px solid #e6e6e6;
      border-top:none;
   }
   .item-con .item-content{
      height:100%;
      overflow: auto;
      border: 1px solid #e6e6e6;
    border-top:none;
   }
   .item-content li{
      border-bottom:1px solid #e6e6e6;
              line-height: 40px;
        padding-left: 10px;
      height: 40px;
      box-sizing: border-box!important;
      cursor:pointer;
   }
   .item-content li.selected{
    background-color:#F1F6FF;
      color:#4B98FF;
   }
   .limit-details >>>.el-tabs__content{
      display:none;
   }
   .limit-details .details-main{
      border:1px solid #e6e6e6;
      height:400px;
      overflow: auto;
   }
   .limit-details >>>.el-tabs__header{
      margin-bottom:10px;
   }
   .details-main{
      padding:10px;
   }
   .person-set{
      height:420px;
   }
   .person-set .set-item{
      height:100%;
      position:relative;
      padding-top: 78px;
   }
   .person-set .title-con{
      height: 34px;
      line-height: 34px;
      padding-left:10px; 
      position:absolute;
      top: 0px;
      width: 100%;
       border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      background-color: #719fff;
      color:#fff;
   }
   .person-set .search-con{
      height: 44px;
      padding:3px 8px 6px 8px;
      width:100%;
      position:absolute;
      top: 34px;
    background-color: #719fff;
   }
   .person-set .search-con >>>.el-input__inner{
      height: 100%;
   }
   .person-set .item-tree-con,.person-set .item-list-con{
      height:100%;
   }
   .person-set .item-tree-con{
      padding:5px;
      overflow: auto;
          border: 1px solid #e6e6e6;
   }
   .person-set .item-list-con{
      position: relative;
      padding-top:35px; 
      overflow: hidden;
            border:1px solid #e6e6e6;

   }
   .item-list-con .list-con-title{
      position: absolute;
      top: 0;
      width: 100%;
      border-bottom:1px solid #e6e6e6;
      overflow:hidden;
      padding: 5px 0;
   }
   .item-list-con ul{
      position: absolute;
      top: 35px;
      height: 100%;
      width: 100%;
      overflow: auto;
   }
</style>
<template>
   <div class="ins-container">
         <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'权限管理'"></returnBtn>
         </div>
      <!-- 页面主体 -->
      <div class="ins-page-con">
            <div class="ins-page-type type2">
            <div class="ins-page-main">
                <div class="ins-content no-title">
                    <!-- content -->
                    <div class="ins-content-con privilege-management">
         <el-row :gutter="8" class="ins-s-hf">
            <el-col :span="12" class="ins-s-hf">
               <div class=" ins-s-hf">
                  <div class="item-con">
                     <div class="item-title">系统角色列表</div>
                     <div class="item-head">
                        <div style="width:200px;text-align:center;float:left;">角色名称</div>
                        <div style="width:200px;text-align:center;float:right;border-left:1px solid #e6e6e6;">操作</div>
                     </div>
                     <div class="item-content">
                        <ul>
                           <li :class="{'selected':item.selected}" :key="key" v-for="(item,key) in roleList" @click="changeRole(item)">
                              <div style="width:200px;text-align:center;height:100%;float:left;" v-text="item.roleName"></div>
                              <div style="width:200px;text-align:center;height:100%;float:right;line-height: 38px;border-left:1px solid #e6e6e6;">
                                 <el-button size="mini" @click="limitsDetails(item.roleId)">权限明细</el-button>
                                 <el-button size="mini" @click="personSetFun(item)">人员设置</el-button>
                              </div>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </el-col>
            <el-col :span="12" class="ins-s-hf">
               <div class=" ins-s-hf">
                  <div class="item-con">
                     <div class="item-title">{{currRole.roleName}}-角色人员名单</div>
                     <div class="item-head">
                        <div style="width:200px;text-align:center;float:left;">人员姓名</div>
                        <div style="width:200px;text-align:center;float:right;border-left:1px solid #e6e6e6;">职务</div>
                     </div>
                     <div class="item-content">
                        <ul>
                           <li v-for="(item,key) in personList" :key="key">
                              <div style="width:200px;height:100%;text-align:center;float:left;" v-text="item.userName"></div>
                              <div style="width:200px;height:100%;text-align:center;float:right;line-height: 38px;border-left:1px solid #e6e6e6;">
                                 <span v-text="item.dictValue"></span>
                              </div>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </el-col>
         </el-row>
         <!-- 权限明细 -->
         <el-dialog title="权限明细" :visible.sync="limitDetailsLayer" width="500px">
            <div class="limit-details">
               <el-tabs v-model="currTab">
                  <el-tab-pane label="PC端" name="1">PC端</el-tab-pane>
                  <el-tab-pane label="移动端" name="2">移动端</el-tab-pane>
               </el-tabs>
               <div class="details-main ins-s-ofy-a">
                  <el-tree highlight-current empty-text="无数据" :data="roleMenu" node-key="id" :props="defaultProps2" default-expand-all ref="tree1">
                  </el-tree>
               </div>
            </div>
            <span slot="footer" class="dialog-footer">
               <el-button type="primary" @click="limitDetailsLayer = false">确 定</el-button>
            </span>
         </el-dialog>
         <!-- 角色人员设置 -->
         <el-dialog title="角色人员设置" :visible.sync="personSetLayer" width="620px"><!-- :before-close="setOpaFun(1)" -->
            <div class="person-set">
               <el-row :gutter="8" class="ins-s-hf">
                  <el-col :span="12" class="ins-s-hf">
                     <div class=" ins-s-hf">
                        <div class="set-item">
                           <div class="title-con">{{currRole.roleName}}-角色已选人员名单</div>
                           <div class="search-con">
                              <el-input  v-model="searchStr1" class="ins-s-hf" placeholder="可按姓名搜索" clearable></el-input>
                           </div>
                           <div class="item-list-con">
                              <div class="list-con-title">
                                 <div style="width:35%;float:left;text-align:center;">姓名</div><div style="width:45%;float:left;text-align:center;">职务</div><div style="width:20%;float:left;text-align:center;">操作</div>
                              </div>
                              <ul>
                                 <li v-show="item.searched" :key="key" v-for="(item,key) in personList_c" style="padding: 5px 0;overflow:hidden;border-bottom:1px solid #e6e6e6;">
                                    <div style="width:35%;float:left;text-align:center;" v-text="item.userName"></div><div style="width:45%;float:left;text-align:center;">
                                    <span v-text="item.dictValue"></span>
                                    </div><div style="width:20%;float:left;text-align:center;color:#F56C6C;cursor:pointer;" @click="removePerson(item,key)">移除</div>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </el-col>
                  <el-col :span="12" class="ins-s-hf">
                     <div class=" ins-s-hf">
                        <div class="set-item">
                           <div class="title-con">{{currRole.roleName}}-角色候选人员名单</div>
                           <div class="search-con">
                              <el-input  v-model="searchStr2" class="ins-s-hf" placeholder="可按姓名，角色搜索" clearable></el-input>
                           </div>
                           <div class="item-tree-con">
                              <el-tree highlight-current empty-text="无数据" :data="allPersonList" node-key="userId" @check="handleCheck" :props="defaultProps1" default-expand-all :filter-node-method="filterNode" ref="tree2" show-checkbox>
                                 </el-tree>
                           </div>
                        </div>
                     </div>
                  </el-col>
               </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
               <el-button @click="setOpaFun(2)" type="danger" class="ins-s-fl">清空设置</el-button>
               <el-button @click="setOpaFun(1)">取 消</el-button>
               <el-button type="primary" @click="setOpaFun(3)">保 存</el-button>
            </span>
         </el-dialog>
      </div>
      </div>
      </div>
      </div>
      </div>
   </div>
</template>
<script src="./js/PMThree.js"></script>
