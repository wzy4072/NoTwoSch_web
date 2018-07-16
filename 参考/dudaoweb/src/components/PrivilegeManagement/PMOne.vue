<style scoped>
      .privilege-management{
            border:none;
            padding: 0;
            overflow: hidden;
      }
   .privilege-management .item-con{
      height: 100%;
      font-size: 15px;
      position: relative;
      padding-top:110px; 
   }
   
   .privilege-management .item-con>.item-top{
      background-color:#eaecf2;
         top: 0;
         position: absolute;
         height:110px;
         width: 100%;
      border-top-right-radius:6px;
      border-top-left-radius:6px;
      padding: 15px;
   }
   .item-top .opa-con{
      font-size: 16px;
      line-height: 29px;
      color:#606266;
   }
   .item-top .search-con{
      height: 36px;
      margin-top: 15px;
   }
   .privilege-management .search-con >>>.el-input__inner{
      height: 100%;
   }
   .privilege-management .content-con{
      height: 100%;
      overflow:auto;
      border: 1px solid #e6e6e6;
      border-top:none;
   }
   .content-con .el-tree{
      padding-top:5px;
   }
   .content-con li{
      padding:10px 15px;
      cursor: pointer;
   }
   .content-con li i{
      cursor: pointer;
      float:right;
      margin-right:10px;
      position:relative;
      top: 3px;
      opacity: 1;
   }
   .content-con li i.el-icon-delete{
      color:#F56C6C;
   }
   .content-con li i.el-icon-edit{
      color:#409EFF;
   }
   .content-con li i:hover{
      opacity: 0.6;
   }
   .content-con li.selected{
      background-color:#F1F6FF;
      color:#4B98FF;
   }
</style>
<template>
   <div class="ins-container">
      <div class="ins-page-top">
            <!-- page title -->
            <returnBtn :title="'权限管理'"></returnBtn>
            <!-- tab页 -->
            <div class="ins-tab-label">
            <el-tabs v-model="roleType">
                  <el-tab-pane label="幼儿园" name="2">幼儿园</el-tab-pane>
                  <el-tab-pane label="教育局" name="1">教育局</el-tab-pane>
            </el-tabs>
         </div>
      </div>
      <!-- 页面主体 -->
      <div class="ins-page-con">
            <div class="ins-page-type type2">
            <div class="ins-page-main">
                <div class="ins-content no-title">
                    <!-- content -->
                    <div class="ins-content-con privilege-management">
         <el-row :gutter="8" class="ins-s-hf">
            <el-col :span="8" class="ins-s-hf">
               <div class="ins-s-hf">
                  <div class="item-con">
                        <div class="item-top" style="background-color:#719fff;">
                              <div class="opa-con" style="color:#fff;">
                                    角色列表
                                    <el-button class="ins-s-fr" size="mini" type="success" @click="addRoleLayer=true"><span class="el-icon-plus ins-s-mr-5"></span>添加角色</el-button>
                              </div>
                              <div class="search-con">
                                    <el-input  v-model="searchStr1" class="ins-s-hf" placeholder="可按角色搜索" clearable></el-input>
                              </div>
                        </div>
                     <div class="content-con">
                        <ul>
                           <li v-for="(item,key) in roleList" :class="{'selected':item.selected}" v-show="item.searched" :key="key" @click="changeRole(item)">
                              <span v-text="item.roleName"></span>
                              <i class="el-icon-delete" title="删除" style="margin:0" @click="opaFun(3,item)"></i>
                              <i class="el-icon-edit" title="编辑" @click="editRoleLayer=true;editRoleData.roleName=item.roleName;editRoleData.roleId=item.roleId;"></i>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </el-col>
            <el-col :span="8" class="ins-s-hf">
               <div class="ins-s-hf">
                  <div class="item-con">
                        <div class="item-top">
                              <div class="opa-con">
                                    PC端菜单权限
                                    <el-button class="ins-s-fr" size="mini" type="success" @click="opaTree(1)"><span class="el-icon-edit ins-s-mr-5"></span><span v-text="opaStatus1==1?'编辑':'保存'"></span></el-button>
                              </div>
                              <div class="search-con">
                        <el-input  v-model="searchStr2" class="ins-s-hf" placeholder="可按菜单名称搜索" clearable></el-input>
                              </div>
                        </div>
                     <div class="content-con tree1">
                        <el-tree highlight-current empty-text="无数据" :data="menu1" node-key="resId" :props="defaultProps" default-expand-all :filter-node-method="filterNode1" ref="tree1" show-checkbox>
                                 </el-tree>
                     </div>
                  </div>
               </div>
            </el-col>
            <el-col :span="8" class="ins-s-hf">
               <div class="ins-s-hf">
                  <div class="item-con">
                        <div class="item-top">
                              <div class="opa-con">
                                    移动端菜单权限
                        <el-button size="mini" type="success" class="ins-s-fr"  @click="opaTree(2)"><span class="el-icon-edit ins-s-mr-5"></span><span v-text="opaStatus2==1?'编辑':'保存'"></span></el-button>
                              </div>
                              <div class="search-con">
                        <el-input  v-model="searchStr3" class="ins-s-hf" placeholder="可按菜单名称搜索" clearable></el-input>
                              </div>
                        </div>
                     <div class="content-con tree2">
                        <el-tree highlight-current empty-text="无数据" :data="menu2" node-key="resId" :props="defaultProps" default-expand-all :filter-node-method="filterNode2" ref="tree2" show-checkbox>
                                 </el-tree>
                     </div>
                  </div>
               </div>
            </el-col>
         </el-row>
         <!-- 新建角色弹框 -->
         <el-dialog title="新建角色" :visible.sync="addRoleLayer" width="520px"> 
            <el-form :model="addRoleData" :rules="opaRoleRules" ref="addRoleForm" label-width="100px" style="padding-left:5%;" >
               <el-form-item label="角色名称：" prop="roleName">
                  <el-input  style="width:300px;" v-model="addRoleData.roleName" class="ins-s-hf" placeholder="请输入角色名称" clearable></el-input>
               </el-form-item>
               <el-form-item label="复用权限：" prop="region">
                  <el-select placeholder="请选择" style="width:300px;" v-model="addRoleData.multiplexId" clearable>
                        <el-option :key="key" :label="item.roleName" :value="item.roleId" v-for="(item,key) in roleList">
                           <span style="float: left">{{ item.roleName }}</span>
                           <span style="float: right; color: #8492a6; font-size: 13px">{{'角色'+(item.isUse?'已使用':'未使用')}}</span>
                        </el-option>
                     </el-select>
               </el-form-item>
               <p style="padding: 10px 0px 10px 19px;">温馨提示：选择后，可复用某已有角色的所有权限设置</p>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button type="primary" @click="opaFun(1)">确 定</el-button>
            </span>
         </el-dialog>
         <!-- 编辑角色弹框 -->
         <el-dialog title="编辑角色" :visible.sync="editRoleLayer" width="520pxpx">
            <el-form :model="editRoleData" :rules="opaRoleRules" ref="editRoleForm" label-width="100px" style="padding-left:5%;" >
               <el-form-item label="角色名称：" prop="roleName">
                  <el-input  style="width:300px;" v-model="editRoleData.roleName" class="ins-s-hf" placeholder="请输入角色名称" clearable></el-input>
               </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button type="primary" @click="opaFun(2)">确 定</el-button>
            </span>
         </el-dialog>
      </div>
   </div>
   </div>
   </div>
   </div>
   </div>
</template>
<script src="./js/PMOne.js"></script>