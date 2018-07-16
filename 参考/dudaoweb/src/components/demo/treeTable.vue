<template>
<div class="content"  v-loading.fullscreen.lock="fullscreenLoading">
  <div class="elcont">
    <div class="elcontitle">
      <span class="prolist">项目列表</span>
      <div class="right mar10">
          <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
          <el-button  slot="append" icon="el-icon-search" size="mini" @click="search"></el-button>
          </el-input>
      </div>
    </div>
    <tree-table :column="column" :data.sync="tableData3" :inputdata.sync = "inputdata" :outdata.sync = "outdata"  id="treed"></tree-table>
  </div>

  <div class="bombtn">
    <el-button type="warning" @click="dialogVisible = true" icon="el-icon-plus">新建</el-button>
    <el-button type="primary" @click="dialogVisible = true" icon="el-icon-tickets">查看</el-button>
    <el-button type="success" @click="dialogVisible = true" icon="el-icon-edit">编辑</el-button>
    <el-button type="danger" @click="open2" icon="el-icon-delete">删除</el-button>
  </div>
  <el-dialog title="新增下级" :visible.sync="addView" width="300px">
    <textarea id="addChildList"></textarea>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addView = false">取 消</el-button>
      <el-button type="primary" @click="addFun()">确 定</el-button>
    </span>
  </el-dialog>
    <el-dialog title="编辑" :visible.sync="editView" width="300px">
    <input id="editInput" type="text">
    <span slot="footer" class="dialog-footer">
      <el-button @click="editView = false">取 消</el-button>
      <el-button type="primary" @click="editFun()">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import treeTable from '@/common/components/treeTable.vue'
export default {
  components: { treeTable },
  data () {
    return {
      dialogVisible: false,
      tableData3: [],
      column: [
        { check: true, width: '50px' },
        { text: '序号', prop: 'index', width: '100px' },
        { text: '知识点名称', prop: 'knowledgeName', tree: true },
        {
          text: '操作',
          width: '400px',
          formater:
            "<button name='add' type='button' style='width:216px' class='el-button el-button--warning el-button--mini is-plain'><i class='el-icon-plus'></i><span>新增下级</span></button> <button name='edit' type='button' class='el-button el-button--success el-button--mini is-plain'><i class='el-icon-edit'></i><span>编辑</span></button> <button name='delete' type='button' class='el-button el-button--danger el-button--mini is-plain'><i class='el-icon-delete'></i><span>删除</span></button>",
          click: {
            add: row => {
              this.addView = true
              this.inputdata.type = 'add'
              this.rowdata = row
            },
            edit: row => {
              this.editData = []
              this.editView = true
              this.editData.push(row)
            },
            delete: row => {
              this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  let arr = []
                  arr.push(row)
                  let obj = {
                    type: 'delete',
                    data: arr
                  }
                  this.inputdata = obj
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
            }
          }
        }
      ],
      inputdata: {},
      editData: [],
      outdata: [],
      rowdata: {},
      addView: false,
      editView: false,
      fullscreenLoading: false,
      input5: ''
    }
  },
  mounted () {
    this.fullscreenLoading = true
    this.$api
      .promise({
        method: 'POST',
        url: 'itembank/findKonwledgePoint'
      })
      .then(data => {
        this.fullscreenLoading = false
        if (data.data.code > 0) {
          var array = data.data.list.filter(o => {
            o.id = o.knowledgeId
            return o.knowledgePid === -1
          })
          array.forEach((o, k) => {
            o.index = k + 1
          })
          this.treeSort(array, data.data.list)
          this.$set(this, 'tableData3', array)
          console.log(this.tableData3)
        } else {
          this.$message.error(data.data.desc)
        }
      })
      .catch(err => {
        this.fullscreenLoading = false
        this.$message.error('接口异常：' + err)
      })
  },
  methods: {
    addFun () {
      this.addView = false
      let obj = {
        type: 'add',
        data: [
          // {
          //   'knowledgeId': 13,
          //   'knowledgePid': 1,
          //   'identifyId': null,
          //   'textbookNum': 19,
          //   'k12Id': 10,
          //   'termId': 16,
          //   'courseId': 13,
          //   'knowledgeName': '第一章:吃鸡',
          //   'createrId': 1,
          //   'createrTime': 1511852838000,
          //   'modifyId': null,
          //   'modifyTime': null,
          //   'isDel': 0,
          //   'chapterList': []
          // }
          {
            knowledgeId: 113,
            id: 113,
            knowledgePid: 1,
            identifyId: null,
            textbookNum: 19,
            k12Id: 10,
            termId: 16,
            courseId: 13,
            knowledgeName: '第一章 吃鸡',
            createrId: 1,
            createrTime: 1511852822000,
            modifyId: null,
            modifyTime: null,
            isDel: 0,
            chapterList: []
          },
          {
            knowledgeId: 114,
            id: 114,
            knowledgePid: 1,
            identifyId: null,
            textbookNum: 19,
            k12Id: 10,
            termId: 16,
            courseId: 13,
            knowledgeName: '第二章 lol',
            createrId: 1,
            createrTime: 1511852822000,
            modifyId: null,
            modifyTime: null,
            isDel: 0,
            chapterList: []
          }
        ]
      }
      this.rowdata.children = this.rowdata.children.concat(obj.data)
      this.inputdata = obj
    },
    editFun () {
      this.editView = false
      this.editData[0].knowledgeName = document.querySelector(
        '#editInput'
      ).value
      let obj = {
        type: 'edit',
        data: this.editData
      }
      this.inputdata = obj
    },
    open2 () {
      this.$confirm('确认删除?', '提示', {
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
    search () {
      if (this.input5 !== '') {
        this.fullscreenLoading = true
        this.tableData3 = this.copydata.filter(o => {
          return Object.keys(o).some(d => {
            return typeof o[d] === 'string'
              ? o[d].indexOf(this.input5) > -1
              : o[d].toString().indexOf(this.input5) > -1
          })
        })
      } else {
        this.tableData3 = this.copydata
      }
      this.fullscreenLoading = false
      this.total = this.tableData3.length
    },
    treeSort (inArray, data) {
      inArray.forEach(o => {
        var children = data.filter(d => d.knowledgePid === o.knowledgeId)
        if (children.length > 0) {
          o['children'] = children
          this.treeSort(o['children'], data)
        }
      })
    }
  }
}
</script>


