<template>
  <div class="content" v-loading.fullscreen.lock="fullscreenLoading" style="padding-bottom:100px;">
    <div class="elcont" style="padding-bottom:40px;">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="height:100%;">
        <el-tab-pane label="用户管理" name="first" style="height:100%;">
          <div class="elcontitle">
            <span class="prolist">项目列表</span>
            <div class="right mar10" style="margin-top:9px">
              <el-button-group>
                <el-tooltip popper-class="tipe" effect="light" content="复制" placement="top">
                  <el-button size="small" plain icon="el-icon-document"></el-button>
                </el-tooltip>
                <el-tooltip popper-class="tipe" effect="light" content="导出" placement="top">
                  <el-button size="small" plain icon="el-icon-upload2"></el-button>
                </el-tooltip>
                <el-tooltip popper-class="tipe" effect="light" content="刷新" placement="top">
                  <el-button size="small" plain icon="el-icon-refresh"></el-button>
                </el-tooltip>
                <el-tooltip popper-class="tipe" effect="light" content="打印" placement="top">
                  <el-button size="small" plain icon="el-icon-printer"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
            <div class="right mar10">
              <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" size="mini" @click="search"></el-button>
              </el-input>
            </div>
          </div>
          <el-table id="a" :data='tableData' border stripe style="width:100%;height:83%;">
            <el-table-column prop="index" align="center" width="100" sortable label="序号"></el-table-column>
            <el-table-column prop="weid" align="center" width="200" sortable label="维度"></el-table-column>
            <el-table-column prop="biaoq" align="left" header-align="center" show-overflow-tooltip sortable label="标签"></el-table-column>
            <el-table-column align="center" prop="city" label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="warning" plain size="mini" @click="dialogVisible = true" icon="el-icon-plus">新建</el-button>
                <el-button type="primary" plain size="mini" @click="dialogVisible = true" icon="el-icon-tickets">查看</el-button>
                <el-button type="success" plain size="mini" @click="dialogVisible = true" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" plain size="mini" @click="open2" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pag">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[50,100,200,300]"
              :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bombtn">
      <el-button type="warning" @click="dialogVisible = true" icon="el-icon-plus">新建</el-button>
      <el-button type="primary" @click="dialogVisible = true" icon="el-icon-tickets">查看</el-button>
      <el-button type="success" @click="dialogVisible = true" icon="el-icon-edit">编辑</el-button>
      <el-button type="danger" @click="open2" icon="el-icon-delete">删除</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [],
        copydata: [],
        total: 0,
        input5: '',
        activeName: 'first',
        dialogVisible: false
      }
    },
    mounted () {
      this.fullscreenLoading = true
      this.$api
        .promise({
          method: 'POST',
          url: 'demo/demo'
        })
        .then(data => {
          this.fullscreenLoading = false
          if (data.data.code > 0) {
            // this.tableData = data.data.list
            this.total = data.data.list.length
          } else {
            this.$message.error(data.data.desc)
          }
        }).catch((err) => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event)
      },
      open2 () {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      handleSizeChange (val) {
        this.size = val
        this.handleCurrentChange()
      },
      handleCurrentChange (val) {
        this.currentPage4 = val || this.currentPage4
        this.tableData3 = this.copydata.slice(
          (this.currentPage4 - 1) * this.size,
          this.currentPage4 * this.size
        )
      },
      search () {
        if (this.input5 !== '') {
          this.fullscreenLoading = true
          this.tableData3 = this.copydata.filter(o => {
            return Object.keys(o).some(d => {
              return (typeof o[d] === 'string') ? o[d].indexOf(this.input5) > -1 : o[d].toString().indexOf(this
                .input5) > -1
            })
          })
        } else {
          this.tableData3 = this.copydata
        }
        this.fullscreenLoading = false
        this.total = this.tableData3.length
      }
    }
  }
</script>
<style scoped>
  .el-main {
    /* background-color: #E9EEF3; */
    /* color: #333; */
    /* text-align: center; */
    /* line-height: 160px; */
  }

  .el-footer {
    /* background-color: #B3C0D1; */
    /* color: #333;
    text-align: center; */
    /* line-height: 45px; */
  }

  body>.el-container {
    /* margin-bottom: 40px; */
  }

  >>>.el-tabs__content {
    height: 100%;
  }

  .elcontitle {
    border-top: 1px solid #e6ebf5;
  }

</style>
