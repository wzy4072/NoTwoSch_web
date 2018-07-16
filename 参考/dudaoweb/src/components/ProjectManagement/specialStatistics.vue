<style scoped>
  .managerTitle{ padding-left:20px;background:#eee;height: 40px;  color:#303133;    font-size: 14px; line-height:40px; }
  .table{ 
    width:100%;
    display: table;
    border-collapse: collapse;
    border-spacing: 2px;
    border-color: grey;
    overflow-y: scroll;
  }
  .table thead {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
      color: #909399;
      font-weight: 500;
      font-size:15px;
  }
  .table tr {
      display: table-row;
      vertical-align: inherit;
      border-color: inherit;
      text-align:center;
      line-height:30px;
      color: #909399;
      font-size:14px;
  }
  .table tr td,.table tr th{
    border:1px solid #ebeef5;
  }
</style>
<template>
    <div class="ins-container pd3">
      <div class="ins-page-search">
        <div class="ins-search-con">
           <el-select style="min-width:250px;" v-model="curkindergartenArr" placeholder="请选择">
             <el-option
              v-for="item in kindergartenArr"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </div>
        <div >
          <el-tabs v-model="activeName">
            <el-tab-pane label="综合统计" name="0"></el-tab-pane>
            <el-tab-pane v-for="(item,key) in all" :key="key" :label="item.name"  :name="key+1+''"></el-tab-pane> 
          </el-tabs>
        </div>
      </div>

      <div class="ins-page-main" style="padding-top:45px;">
        <div class="ins-tab-con">
          <div class="ins-tab-title">
            <span>
                <span class="el-icon-menu">
                </span>
                <i class="com_fs_4">
                  {{activeName==='1'?'组织与管理范畴统计':activeName==='2'?'教与学范畴统计':activeName==='3'?'幼儿发展范畴统计':'综合统计'}}
                </i>
            </span>
          </div>
          <!-- 表格内容 -->
          <div class="com_h_full" style="overflow-y:scroll">
           <table  v-show="activeName==='0'" class="table" >
             <thead>
             <tr>
               <th>排序</th>
               <th>范畴/维度/指标名称</th>
               <th>数量</th>
               <th>占比</th>
             </tr>
             </thead>
             <tbody>
             <tr v-for="(val,key,index) in tableData" :key="index">
               <td>{{index+1}}</td>
               <td>{{key}}</td>
               <td>{{val}}</td>
               <td>{{(val/total).toFixed(2)*100}}%</td>
             </tr>
             </tbody>
           </table>
          <div v-show="activeName!=='0'">
              <div class="managerTitle">一级维度排名</div>
               <el-table :data="data[0]"  id="a" border="" >
              <el-table-column align="center" label="排序" type="index" width="80" >
              </el-table-column>
              <el-table-column align="center" label="范畴/维度/指标名称" prop="dictName"  >
              </el-table-column>
              <el-table-column align="center" label="数量" prop="count"  >
              </el-table-column>
              <el-table-column align="center" label="占比" >
              <template slot-scope="scope">
                <span>{{getTotal(data[0],'count')?(scope.row.count/getTotal(data[0],'count')).toFixed(2)*100:0}}%</span>
              </template>
              </el-table-column>
            </el-table>
             <div class="managerTitle">二级维度排名</div>
               <el-table :data="data[1]"  id="a" border="" >
              <el-table-column align="center" label="排序" type="index" width="80" >
              </el-table-column>
              <el-table-column align="center" label="范畴/维度/指标名称" prop="dictName"  >
              </el-table-column>
              <el-table-column align="center" label="数量" prop="count"  >
              </el-table-column>
               <el-table-column align="center" label="占比" >
              <template slot-scope="scope">
                <span>{{getTotal(data[1],'count')?(scope.row.count/getTotal(data[1],'count')).toFixed(2)*100:0}}%</span>
              </template>
              </el-table-column>
            </el-table>
             <div class="managerTitle">三级维度排名</div>
               <el-table :data="data[2]"  id="a" border=""  >
              <el-table-column align="center" label="排序" type="index" width="80" >
              </el-table-column>
              <el-table-column align="center" label="范畴/维度/指标名称" prop="dictName"  >
              </el-table-column>
              <el-table-column align="center" label="数量" prop="count"  >
              </el-table-column>
              <el-table-column align="center" label="占比" >
              <template slot-scope="scope">
                <span>{{getTotal(data[2],'count')?(scope.row.count/getTotal(data[2],'count')).toFixed(2)*100:0}}%</span>
              </template>
              </el-table-column>
            </el-table>
             <div v-if="data[3]&&data[3].length>0" >
             <div class="managerTitle">指标排名</div>
               <el-table :data="data[3]" id="a" border=""  >
              <el-table-column align="center" label="排序" type="index"  width="80">
              </el-table-column>
              <el-table-column align="center" label="范畴/维度/指标名称" prop="dictName"  >
              </el-table-column>
              <el-table-column align="center" label="数量" prop="count"  >
              </el-table-column>
              <el-table-column align="center" label="占比" >
              <template slot-scope="scope">
                <span>{{getTotal(data[3],'count')?(scope.row.count/getTotal(data[3],'count')).toFixed(2)*100:0}}%</span>
              </template>
              </el-table-column>
            </el-table>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script src="./js/specialStatistics.js"></script>

