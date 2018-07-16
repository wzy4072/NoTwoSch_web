<style scoped>
  .spanText {
    color: #47a7ff;
  }

  .spanText:hover {
    cursor: pointer;
  }

  .changeWeidu {
    display: inline-block;
    height: 32px;
    padding: 0 5px;
    font-size: 14px;
  }

  .changeWeidu:hover {
    cursor: pointer;
  }

  .weiduAction {
    border-bottom: 1px solid #ddd;
  }

  .data-tag {
    background: #8DD9FD;
    color: #009A61;
    height: 30px;
    margin-right: 10px;
  }
</style>
<template>
  <div class='ins-container'>
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="'异动数量统计'"></returnBtn>
      <!-- tab页 -->
      <div class="ins-tab-label">
        <el-tabs v-model='activeName' @tab-click='handleClick'>
          <el-tab-pane label='统计表' name='first'>统计表</el-tab-pane>
          <el-tab-pane label='统计图' name='second'>统计图</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="ins-page-con">
      <!-- 搜索栏 -->
      <div class="ins-page-type type1">
        <div class='ins-page-search'>
          <div class='ins-search-con'>
            现读年级：
            <el-select v-model="nowGrade" multiple collapse-tags style="margin-left: 20px;" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="ins-search-con">
            统计时间：
            <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期"
                            style="width:350px;" type="daterange" v-model="date">
            </el-date-picker>
          </div>
          <div class="ins-opa-btn">
            <el-button size="small" type="primary" @click="queryBtn">
              <span class="el-icon-search ins-s-mr-10"></span>查询
            </el-button>
          </div>
        </div>
        <!-- 页面主体 -->
        <div class='ins-page-main'>
          <div v-if="activeName === 'first'" class='ins-table divide'>
            <!-- title -->
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
              <span><span v-text="startDate"></span> - <span v-text="endDate"></span> 时间段异动数量统计表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"
                          :scrColumn1.sync="scrColumn"></tableBar>
              </div>
              <!-- 搜索 -->
              <div class="title-input">
                <el-input placeholder="请输入搜索内容" v-model="input5" clearable>
                </el-input>
              </div>
            </div>
            <!-- content -->
            <div class='ins-tab-con'>
              <el-table :data='tableData' id="a" height='100%' border=''>
                <el-table-column align='center' label='年级' sortable='' v-if="scrColumn.gradeName.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.gradeName === '合计'">{{scope.row.gradeName}}</span>
                    <span v-else class='spanText' @click="showDieg('gradeName',scope.$index, scope.row)">{{scope.row.gradeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='转班' show-overflow-tooltip='' sortable=''
                                 v-if="scrColumn.zhuanban.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.zhuanban !== 0" class='spanText'
                          @click="showDieg('1',scope.$index, scope.row)">{{scope.row.zhuanban}}</span>
                    <span v-if="scope.row.zhuanban === 0">{{scope.row.zhuanban}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='转入' show-overflow-tooltip='' sortable=''
                                 v-if="scrColumn.zhuanru.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.zhuanru !== 0" class='spanText'
                          @click="showDieg('2',scope.$index, scope.row)">{{scope.row.zhuanru}}</span>
                    <span v-if="scope.row.zhuanru === 0">{{scope.row.zhuanru}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='转出' show-overflow-tooltip='' sortable=''
                                 v-if="scrColumn.zhuanchu.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.zhuanchu !== 0" class='spanText'
                          @click="showDieg('3',scope.$index, scope.row)">{{scope.row.zhuanchu}}</span>
                    <span v-if="scope.row.zhuanchu === 0">{{scope.row.zhuanchu}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='休学' show-overflow-tooltip='' sortable=''
                                 v-if="scrColumn.xiuxue.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.xiuxue !== 0" class='spanText' @click="showDieg('4',scope.$index, scope.row)">{{scope.row.xiuxue}}</span>
                    <span v-if="scope.row.xiuxue === 0">{{scope.row.xiuxue}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='复学' show-overflow-tooltip='' sortable=''
                                 v-if="scrColumn.fuxue.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.fuxue !== 0" class='spanText' @click="showDieg('5',scope.$index, scope.row)">{{scope.row.fuxue}}</span>
                    <span v-if="scope.row.fuxue === 0">{{scope.row.fuxue}}</span>
                  </template>
                </el-table-column>
                <el-table-column align='center' header-align='center' label='退学' show-overflow-tooltip='' sortable=''
                                 v-if="scrColumn.tuixue.selected">
                  <template slot-scope='scope'>
                    <span v-if="scope.row.tuixue !== 0" class='spanText' @click="showDieg('6',scope.$index, scope.row)">{{scope.row.tuixue}}</span>
                    <span v-if="scope.row.tuixue === 0">{{scope.row.tuixue}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- page divide -->
            <div class="ins-tab-divide">
              <el-pagination :current-page="currentPage4" :page-size="size" :page-sizes="[50,100,200,300]"
                             :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
            <el-dialog :title="dialogTitle + '学生异动名单'" :visible.sync="dialogChangeTeacher" width="800px" height="700px"
                       id="dialogOne">
              <div>
                <div style="margin-top:10px;">
                  <el-table :data="tableData9" height="100%" border="" style="width: 100%;height:400px;">
                    <el-table-column align="center" label="年级" prop="gradeName" sortable="">
                    </el-table-column>
                    <el-table-column align="center" label="年级代码" prop="gradeCode" sortable="">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="班级" prop="className"
                                     show-overflow-tooltip="" sortable="">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="姓名" prop="studentName"
                                     show-overflow-tooltip="" sortable="">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="入学代码" prop="entranceCode"
                                     show-overflow-tooltip="" sortable="">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="异动类型" prop="transactionTypeStr"
                                     show-overflow-tooltip="" sortable="">
                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="操作时期" prop="transactionDate"
                                     show-overflow-tooltip="" sortable="">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="dialogChangeTeacher">确定</el-button>
              </span>
            </el-dialog>
          </div>
          <div v-if="activeName === 'second'" class='ins-table divide'>
            <!-- title -->
            <div class="ins-title">
              <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt=""></span>
              <span><span v-text="startDate"></span> - <span v-text="endDate"></span> 时间段异动数量</span>
              <div style="display:inline-block;margin: 0 20px;">
                <el-radio label="1" v-model="activeWeidu">年级维度图</el-radio>
                <el-radio label="2" v-model="activeWeidu">类型维度图</el-radio>
              </div>
            </div>
            <div class='ins-tab-con'>
              <div ref="main" class="ins-s-mt-10" style="width: 100%;height:100%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/transactionCount.js"></script>


