<style scoped lang="less">
  .dx-list{
    clear: both;
    overflow-y:auto;
    height: 400px;
    .dx-item{
      border-bottom:1px solid #ebeef5;
      padding:15px 20px;
      img{
        position:relative;
        top:-5px;
        float: right;
      }
    }
  }
</style>
<style scoped>
  .el-card .el-input{
    width:150px;
    float: right;
    position: relative;
    top: -6px;
  }
  .el-card >>> .el-card__body{
    padding:0;
  }
</style>

<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <div class="ins-page-title">
        <returnBtn :title="'责任督学分配管理'"></returnBtn>
      </div>
    </div>
    <div class="ins-page-con">
      <div class="ins-page-type type2">
        <div class="ins-page-main">
          <div class="ins-table">
            <div class="ins-tab-title">
              <div class="ins-title">
                <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                <span>幼儿园督学分配</span>
                <!-- 搜索 -->
                <div class="title-input">
                  <el-input size="mini" placeholder="请输入幼儿园名称" v-model="searchstr" clearable>
                  </el-input>
                </div>
              </div>
            </div>
            <!-- 表格内容 -->
            <div class="ins-tab-con">
              <el-table id="table" :data="tableData" border stripe style="width: 100%; height:100%;" height="100%">
                <el-table-column align="center" header-align="center" label="幼儿园名称" prop="krtenName" width="200" sortable>
                </el-table-column>
                <el-table-column align="center" header-align="center" label="分配督学清单">
                  <template slot-scope="scope">
                    <el-tag size="medium" class="ins-s-mr-10 ins-s-mb-10" v-for="(v,k) in scope.row.InspectorsList" :key="k" closable @close="delFun(scope.row,k)">{{v.name}}</el-tag><el-button icon="el-icon-plus" type="success" plain size="mini" @click="openWinFun(scope.row.InspectorsList,scope.$index)">添加督学</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <el-dialog title="添加督学" :visible.sync="dialogVisible" width="500px">
          <el-card>
            <div slot="header" class="clearfix">
              <span>待选督学列表</span>
            </div>
            <div class="dx-list">
              <div v-for="(v,k) in InspectorsList" :key="k" class="dx-item" @click="selectInspectorsFun(v)">
                {{v.superintendentName}}
                <img v-if="v.check==0" src="../../assets/images/circle.png" alt>
                <img v-if="v.check==1" src="../../assets/images/checkGreen.png" alt>
              </div>
            </div>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button type="success" @click="comfireFun">确定</el-button>
            <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script src="./js/supervisorAllotMan.js"></script>


