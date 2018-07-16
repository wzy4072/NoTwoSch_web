<template>
    <div class="ins-container">
        <!-- 面包屑导航 -->
        <!-- <div class="ins-page-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(item,key) in barNameArr" :key="key">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <!-- tab页需保留div -->
        <div class="ins-tab-label">
        </div>
        <!-- 按钮 -->
        <div class="ins-page-search">
            <div class="ins-search-con">
                <el-button type="warning" icon="el-icon-plus" plain="" size="mini" @click="Add" v-if="count === 0">添加</el-button>
                <el-button type="success" icon="el-icon-edit" plain="" size="mini" @click="dialogVisible = true" v-if="count === 1">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" plain="" size="mini" @click="deletRow" v-if="count >= 1">删除</el-button>
            </div>
        </div>
        <!-- 页面主体 -->
        <div class="ins-page-main">
            <!-- 表格 -->
            <div class="ins-tab-con">
                <!-- 表格标题+表格功能 -->
                <div class="ins-tab-title">
                    <span>
                        <span class="el-icon-menu">
                        </span>
                        <i class="com_fs_4">
                            岗位信息列表
                        </i>
                    </span>
                    <!-- 复制 打印 -->
                    <div class="ins-tabbar-con">
                        <tableBar type="copy,export,refresh,printer" tableId="a" @refresh="refresh" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
                    </div>
                    <!-- 搜索 -->
                    <div class="com_fr" style="width:200px;">
                        <el-input class="input-with-select" placeholder="请输入内容" v-model="searchstr">
                            <el-button @click="searchFun" icon="el-icon-search" slot="append">
                            </el-button>
                        </el-input>
                    </div>
                </div>
                <!-- 表格内容 -->
                <div class="com_h_full">
                    <!-- 表格内容 -->
                    <el-table :data="tableData" @selection-change="check" border height="100%" id="a" stripe="" style="width: 100%;height:100%">
                        <el-table-column type="selection" align="center" width="50"></el-table-column>
                        <el-table-column align="center" type="index" label="序号"  v-if="scrColumn[0].selected" width="80">
                        </el-table-column>
                        <el-table-column align="center" label="岗位名称" prop="" sortable="" v-if="scrColumn[1].selected">
                            <template slot-scope="scope">
                                <span class="card" @click="name_function(scope.row)">{{scope.row.dictValue}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页栏 -->
                <div class="ins-tab-paging">
                    <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="[50,100,200,300]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
            </div>
            <!-- 其他 -->
            <div>
            </div>
            <!-- 弹窗 -->
            <el-dialog title="岗位名称" :visible.sync="dialogVisible" width="30%">
                <el-input v-model="input_name"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="Submit">保存</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script src="">
import tableBar from '@/common/components/tableBar'
export default {
  components: { tableBar },
  data () {
    return {
      barNameArr: [],
      total: 0,
      size: 50,
      currentPage: 1,
      fullscreenLoading: false,
      tableData: [],
      searchstr: '', // 当前输入
      scrColumn: [
        // 表头
        { text: '序号', selected: true, align: 'center' },
        { text: '岗位名称', selected: true }
      ],
      printOb: {// 打印所需
        pageNum: 1,
        title: '项目列表'
      },
      dialogVisible: false,
      confId: [],
      count: 0,
      input_name: '',
      dictDesc: '',
      dictType: ''
    }
  },
  mounted () { // 进页面默认执行方法
    // this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
    this.$nextTick(function () {
      this.$api.countHeight('.ins-tab-label', '.ins-page-search')
      this.refresh()
    })
    let that = this
    window.onresize = function () {
      that.$api.countHeight('.ins-tab-label', '.ins-page-search')
    }
  },
  methods: {
    refresh () {
      this.fullscreenLoading = true
      this.$api
        .promise({
          method: 'POST',
          url: 'dictConf/selectDictConfLsit',
          data: {'dictType': 'POSITION'}// 岗位传值POSITION
        })
        .then(res => {
          this.fullscreenLoading = false
          if (res.data.code > 0) {
            this.dictDesc = res.data.data[0].dictDesc
            this.dictType = res.data.data[0].dictType
            this.copydata = Object.assign([], res.data.data)
            this.tableData = this.copydata.slice(0, this.size * 1)
            this.total = res.data.data.length
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.tableData = this.copydata.slice(
        (this.currentPage - 1) * this.size,
        this.currentPage * this.size
      )
    },
    searchFun () {
      if (this.searchstr !== '') {
        this.fullscreenLoading = true
        this.tableData = this.copydata.filter(o => {
          return Object.keys(o).some(d => {
            return typeof o[d] === 'string'
              ? o[d].indexOf(this.searchstr) > -1
              : o[d].toString().indexOf(this.searchstr) > -1
          })
        })
      } else {
        this.tableData = this.copydata
      }
      this.fullscreenLoading = false
      this.total = this.tableData.length
    },
    check (selection) { // 表格勾选获取confId和dictValue
      this.confId = []
      if (selection.length) {
        selection.forEach((element, index) => {
          this.confId.push(element.confId)
        })
        this.input_name = selection[0].dictValue
      }
      this.count = selection.length
    },
    Add () { // 表格添加信息
      this.input_name = ''
      this.dialogVisible = true
    },
    deletRow () { // 表格删除数据
      this.fullscreenLoading = true
      this.$api
        .promise({
          method: 'POST',
          url: 'dictConf/postDeleteBatch',
          data: this.confId
        })
        .then(res => {
          this.fullscreenLoading = false
          if (res.data.code > 0) {
            this.dialogVisible = false
            this.$message.success('删除成功')
            this.refresh()
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    name_function (row) { // 表格岗位名称点击时赋值弹窗
      this.confId.push(row.confId)
      this.input_name = row.dictValue
      this.dialogVisible = true
    },
    Submit () {
      if (this.input_name === '') {
        this.$message.warning('保存失败,必须输入岗位名称!')
        return false
      }
      var obj = {// 新增时
        'dictType': this.dictType,
        'dictDesc': this.dictDesc,
        'dictName': this.input_name,
        'dictValue': this.input_name
      }
      if (this.confId.length) { // 编辑时传ID
        obj.confId = this.confId[0]
      }
      // 请求接口
      this.fullscreenLoading = true
      this.$api
        .promise({
          method: 'POST',
          url: 'steeringManage/selectSchoolDeteil',
          data: obj
        })
        .then(res => {
          this.fullscreenLoading = false
          if (res.data.code > 0) {
            this.dialogVisible = false
            this.$message.success('操作成功')
            this.refresh()
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    }
  }
}
</script>

<style>
.card {
  cursor: pointer;
  color: dodgerblue;
}
</style>
