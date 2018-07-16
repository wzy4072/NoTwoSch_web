<template>
<div class="ins-container">
    <div class="ins-page-top">
        <!-- page title -->
        <div class="ins-page-title">
            <returnBtn :title="'参考页面'"></returnBtn>
        </div>
        <!-- tab页 -->
        <div class="ins-tab-label">
            <el-tabs v-model="tab">
                <el-tab-pane label="页面类型1" name="1">
                    页面类型1
                </el-tab-pane>
                <el-tab-pane label="页面类型2" name="2">
                    页面类型2
                </el-tab-pane>
                <el-tab-pane label="页面类型3" name="3">
                    页面类型3
                </el-tab-pane>
                <el-tab-pane label="页面类型4" name="4">
                    页面类型4
                </el-tab-pane>
                <el-tab-pane label="页面类型5" name="5">
                    页面类型5
                </el-tab-pane>
                <el-tab-pane label="页面类型6" name="6">
                    页面类型6
                </el-tab-pane>
                <el-tab-pane label="页面类型7" name="7">
                    页面类型7
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-con">
        <!-- tab1: search + table -->
        <div class="ins-page-type type1" v-show="tab==1">
            <!-- 搜索栏 -->
            <div class="ins-page-search">
                <div class="ins-search-con">
                    单选框：
                    <el-select size="medium" placeholder="请选择" style="width:150px;" v-model="value1">
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                        </el-option>
                    </el-select>
                </div>
                <div class="ins-search-con">
                    多选框：
                    <el-select size="medium" :collapse-tags="true" multiple placeholder="请选择" style="width:190px;" v-model="value2">
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                        </el-option>
                    </el-select>
                </div>
                <div class="ins-opa-btn">
                  <el-button size="small" type="primary" @click="getPageData()">
                    <span class="el-icon-search ins-s-mr-10"></span>查询
                  </el-button>
                </div>
                <div class="ins-opa-btn right">
                  <el-button size="small" type="success" @click="savePageData()">
                    <span class="el-icon-document ins-s-mr-10"></span>保存
                  </el-button>
                </div>
            </div>
            <div class="ins-page-main">
                <div class="ins-table divide">
                    <!-- title -->
                    <div class="ins-title">
                        <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                        <span>表格标题</span>
                        <!-- 复制 打印 -->
                        <div class="tabbar-con">
                            <tableBar type="copy,export,printer" tableId="a" :printOb="printOb" :scrColumn1.sync="scrColumn"></tableBar>
                        </div>
                        <!-- 搜索 -->
                        <div class="title-input">
                          <el-input placeholder="请输入搜索内容" v-model="searchstr1" clearable>
                          </el-input>
                        </div>
                    </div>
                    <!-- content -->
                    <div class="ins-tab-con">
                        <el-table :data="tableData" border height="100%" id="tab" stripe>
                            <el-table-column align="left" label="序号" sortable type="index" width="80">
                            </el-table-column>
                            <el-table-column align="left" label="维度" prop="weid" show-overflow-tooltip sortable v-if="scrColumn.weid.selected">
                                <template slot-scope="scope">
                                    <el-button type="text" class="ins-s-p0" size="small">{{scope.row.weid}}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="标签" prop="biaoq" show-overflow-tooltip v-if="scrColumn.biaoq.selected" sortable>
                            </el-table-column>
                            <el-table-column align="left" label="固定内容列" prop="fixField" show-overflow-tooltip sortable v-if="scrColumn.fixField.selected">
                                <template slot-scope="scope">
                                    <el-button type="text" class="ins-s-p0" size="small">固定内容</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="操作" v-if="scrColumn.otherField.selected" min-width="400">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-plus" plain size="mini" type="warning">
                                    新建
                                </el-button>
                                <el-button icon="el-icon-tickets" plain size="mini" type="primary">
                                    查看
                                </el-button>
                                <el-button icon="el-icon-edit" plain size="mini" type="success">
                                    编辑
                                </el-button>
                                <el-button  icon="el-icon-delete" plain size="mini" type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    <!-- page divide -->
                    <div class="ins-tab-divide">
                        <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- tab2: btn + table -->
        <div class="ins-page-type type1" v-show="tab==2">
            <!-- 按钮栏 -->
            <div class="ins-page-btn">
              <!-- 左侧按钮 -->
              <div class="ins-opa-btn">
                <el-button size="small" type="primary">
                  <span class="el-icon-upload ins-s-mr-10"></span>批量导入
                </el-button>
                <el-button size="small" type="warning">
                  <span class="el-icon-plus ins-s-mr-10"></span>添加教职工
                </el-button>
              </div>
              <!-- 右侧按钮 -->
              <div class="ins-opa-btn right">
                <el-button size="small" type="success">
                  <span class="el-icon-document ins-s-mr-10"></span>编辑
                </el-button>
                <el-button size="small" type="danger">
                  <span class="el-icon-delete ins-s-mr-10"></span>删除
                </el-button>
              </div>
            </div>
            <div class="ins-page-main">
                <div class="ins-table divide">
                    <!-- title -->
                    <div class="ins-title">
                        <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                        <span>表格标题</span>
                        <!-- 复制 打印 -->
                        <div class="tabbar-con">
                            <tableBar type="copy,export,printer" tableId="a" :printOb="printOb"></tableBar>
                        </div>
                        <!-- 搜索 -->
                        <div class="title-input">
                          <el-input placeholder="请输入搜索内容" v-model="searchstr2" clearable>
                          </el-input>
                        </div>
                    </div>
                    <!-- content -->
                    <div class="ins-tab-con">
                        <el-table :data="tableData" border height="100%" id="tab" stripe>
                            <el-table-column align="left" label="序号" sortable type="index" width="80">
                            </el-table-column>
                            <el-table-column align="left" label="维度" prop="weid" show-overflow-tooltip sortable >
                                <template slot-scope="scope">
                                    <el-button type="text" class="ins-s-p0" size="small">{{scope.row.weid}}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="标签" prop="biaoq" show-overflow-tooltip sortable>
                            </el-table-column>
                            <el-table-column align="left" label="固定内容列" prop="fixField" show-overflow-tooltip sortable>
                                <template slot-scope="scope">
                                    <el-button type="text" class="ins-s-p0" size="small">固定内容</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="操作" prop="opa" width="400">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-plus" plain size="mini" type="warning">
                                    新建
                                </el-button>
                                <el-button icon="el-icon-tickets" plain size="mini" type="primary">
                                    查看
                                </el-button>
                                <el-button icon="el-icon-edit" plain size="mini" type="success">
                                    编辑
                                </el-button>
                                <el-button  icon="el-icon-delete" plain size="mini" type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    <!-- page divide -->
                    <div class="ins-tab-divide">
                        <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- tab3：table -->
        <div class="ins-page-type type2" v-show="tab==3">
            <div class="ins-page-main">
                <div class="ins-table divide">
                    <!-- title -->
                    <div class="ins-title">
                        <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                        <span>表格标题</span>
                        <!-- 搜索 -->
                        <div class="title-input">
                          <el-input placeholder="请输入搜索内容" v-model="searchstr2" clearable>
                          </el-input>
                        </div>
                    </div>
                    <!-- content -->
                    <div class="ins-tab-con">
                        <el-table :data="tableData" border height="100%" id="tab" stripe>
                            <el-table-column align="left" label="序号" sortable type="index" width="80">
                            </el-table-column>
                            <el-table-column align="left" label="维度" prop="weid" show-overflow-tooltip sortable >
                            </el-table-column>
                            <el-table-column align="left" label="标签" prop="biaoq" show-overflow-tooltip  sortable>
                            </el-table-column>
                            <el-table-column align="left" label="固定内容列" prop="fixField" show-overflow-tooltip sortable>
                                <template slot-scope="scope">固定内容</template>
                            </el-table-column>
                            <el-table-column align="left" label="操作" prop="opa" width="400">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-plus" plain size="mini" type="warning">
                                    新建
                                </el-button>
                                <el-button icon="el-icon-tickets" plain size="mini" type="primary">
                                    查看
                                </el-button>
                                <el-button icon="el-icon-edit" plain size="mini" type="success">
                                    编辑
                                </el-button>
                                <el-button  icon="el-icon-delete" plain size="mini" type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    <!-- page divide -->
                    <div class="ins-tab-divide">
                        <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- tab5：btn+other -->
        <div class="ins-page-type type1" v-show="tab==5">
            <!-- 按钮栏 -->
            <div class="ins-page-btn">
              <!-- 左侧按钮 -->
              <div class="ins-opa-btn">
                <el-button size="small" type="primary">
                  <span class="el-icon-upload ins-s-mr-10"></span>批量导入
                </el-button>
                <el-button size="small" type="warning">
                  <span class="el-icon-plus ins-s-mr-10"></span>添加教职工
                </el-button>
              </div>
              <!-- 右侧按钮 -->
              <div class="ins-opa-btn right">
                <el-button size="small" type="success">
                  <span class="el-icon-document ins-s-mr-10"></span>编辑
                </el-button>
                <el-button size="small" type="danger">
                  <span class="el-icon-delete ins-s-mr-10"></span>删除
                </el-button>
              </div>
            </div>
            <div class="ins-page-main">
                <div class="ins-content">
                    <!-- title -->
                    <div class="ins-title">
                      <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                      <span>内容标题</span>
                    </div>
                    <!-- content -->
                    <div class="ins-content-con">
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- tab4：search+other -->
        <div class="ins-page-type type1" v-show="tab==4">
            <!-- 搜索栏 -->
            <div class="ins-page-search">
                <div class="ins-search-con">
                    单选框：
                    <el-select size="medium" placeholder="请选择" style="width:150px;" v-model="value1">
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                        </el-option>
                    </el-select>
                </div>
                <div class="ins-search-con">
                    多选框：
                    <el-select size="medium" :collapse-tags="true" multiple placeholder="请选择" style="width:190px;" v-model="value2">
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                        </el-option>
                    </el-select>
                </div>
                <div class="ins-opa-btn">
                  <el-button size="small" type="primary" @click="getPageData()">
                    <span class="el-icon-search ins-s-mr-10"></span>查询
                  </el-button>
                </div>
                <div class="ins-opa-btn right">
                  <el-button size="small" type="success" @click="savePageData()">
                    <span class="el-icon-document ins-s-mr-10"></span>保存
                  </el-button>
                </div>
            </div>
            <div class="ins-page-main">
                <div class="ins-content">
                    <!-- title -->
                    <div class="ins-title">
                      <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                      <span>内容标题</span>
                    </div>
                    <!-- content -->
                    <div class="ins-content-con">
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- tab6：other -->
        <div class="ins-page-type type2" v-show="tab==6">
            <div class="ins-page-main">
                <div class="ins-content">
                    <!-- title -->
                    <div class="ins-title">
                        <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                        <span>内容标题</span>
                    </div>
                    <!-- content -->
                    <div class="ins-content-con">
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- tab7：other -->
        <div class="ins-page-type" v-show="tab==7">
            <div class="ins-spec-con">
                <div class="ins-spec-top">
                    <div class="ins-search-con">
                        单选框：
                        <el-select size="medium" placeholder="请选择" style="width:150px;" v-model="value1">
                            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ins-search-con">
                        多选框：
                        <el-select size="medium" :collapse-tags="true" multiple placeholder="请选择" style="width:190px;" v-model="value2">
                            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ins-search-con">
                        起始时间：
                        <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:350px;" type="daterange" v-model="date">
                        </el-date-picker>
                    </div>
                    <div class="ins-search-con">
                        单选框：
                        <el-select size="medium" placeholder="请选择" style="width:150px;" v-model="value1">
                            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ins-search-con">
                        多选框：
                        <el-select size="medium" :collapse-tags="true" multiple placeholder="请选择" style="width:190px;" v-model="value2">
                            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ins-search-con">
                        起始时间：
                        <el-date-picker size="medium" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" style="width:350px;" type="daterange" v-model="date">
                        </el-date-picker>
                    </div>
                    <div class="ins-opa-btn">
                        <el-button size="small" type="primary">
                        <span class="el-icon-upload ins-s-mr-10"></span>批量导入
                        </el-button>
                        <el-button size="small" type="warning">
                        <span class="el-icon-plus ins-s-mr-10"></span>添加教职工
                        </el-button>
                    </div>
                </div>
                <div class="ins-spec-main">
                    <div class="ins-page-main">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script src="./js/standard.js"></script>
