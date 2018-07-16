<template>
  <div class="content" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="elcont">
      <div class="elcontitle">
        <span class="prolist">项目列表</span>
        <div class="right mar10" style="margin-top:9px">
        <tableBar type="copy,export,refresh,printer" tableId="a" @refresh="refresh" :printOb="printOb" :scrColumn.sync="scrColumn"></tableBar>
        </div>
        <div class="right mar10">
          <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" size="mini" @click="search"></el-button>
          </el-input>
        </div>

      </div>
      <el-table id="a" :data='tableData3' border stripe height="100%" style="width: 100%;height:100%">
        <el-table-column prop="index" v-if="scrColumn[0].selected" align="center" sortable width="100" label="序号">
        </el-table-column>
        <el-table-column prop="weid"  v-if="scrColumn[1].selected" align="center" width="200" sortable label="维度">
        </el-table-column>
        <el-table-column prop="biaoq"  v-if="scrColumn[2].selected" align="left" header-align="center" show-overflow-tooltip sortable label="标签">
        </el-table-column>
        <el-table-column align="center" prop="city" width="400" label="操作">
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
import tableBar from '@/common/components/tableBar'
export default {
  components: {tableBar},
  data () {
    return {
      dialogVisible: false,
      tableData3: [],
      copydata: [],
      fullscreenLoading: false,
      html: '',
      currentPage4: 1,
      total: 0,
      input5: '',
      size: 50,
      scrColumn: [
        {text: '序号', selected: true, align: 'center'},
        {text: '维度', selected: true},
        {text: '标签', selected: true}
      ],
      printOb: {
        pageNum: 1,
        title: '项目列表'
      }
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
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
    },
    refresh () {
      this.fullscreenLoading = true
      this.$api
        .promise({
          method: 'POST',
          url: 'demo/demo'
        })
        .then(data => {
          this.fullscreenLoading = false
          if (data.data.code > 0) {
            this.copydata = Object.assign([], data.data.list)
            this.tableData3 = this.copydata.slice(0, this.size * 1)
            this.total = data.data.list.length
          } else {
            this.$message.error(data.data.desc)
          }
        }).catch((err) => {
          this.fullscreenLoading = false
          this.$message.error('接口异常：' + err)
        })
    }
  },
  watch: {
    currentPage4 () {
      this.printOb.pageNum = this.currentPage4
    }
  }

}
</script>
<style>


</style>
