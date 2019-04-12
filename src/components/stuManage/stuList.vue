<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="mini" @click="addStu">add stu</el-button>
    </el-card>
    <br>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>学生列表</span>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别" width="180">
          <template slot-scope="scope">{{sexLabels[scope.row.sex] || ''}}</template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="180"></el-table-column>
        <el-table-column prop="grade" label="年级" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <br>

    <el-dialog :title="(form.id ? '修改' :'新增')  + '学生信息'" :visible.sync="showEdit" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grade" placeholder="请选择">
            <el-option label="一" value="1"></el-option>
            <el-option label="二" value="2"></el-option>
            <el-option label="三" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="save">{{form.id ? '修 改': '新 增' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "./api/stumanage";
export default {
  name: "stulist",
  data() {
    return {
      tableData: [],
      form: {
        id: null,
        name: null,
        sex: null,
        age: null,
        grade: null,
        email: null
      },
      isEdit: {},
      showEdit: false,
      sexLabels: ["女", "男"]
    };
  },
  methods: {
    // 查
    getTableData() {
      this.loading = true;
      api
        .getStuList()
        .then(resp => {
          if (resp.success) {
            this.tableData = resp.data;
          }
        })
        .catch(err => {
          this.$message("" + err);
        });
    },
    edit(row) {
      this.form = row;
      this.showEdit = true;
      this.isEdit = true;
    },
    save() {
      var testData = {
        nickname: "测试",
        phoneNumber: "18322223432"
      };

      api
        .addStu(testData)
        .then(resp => {
          if (resp.success) {
            this.$message({ type: "success", message: "操作成功!" });
          }
        })
        .catch(err => {
          this.$message("" + err);
        });
    },
    del(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .delStu({ id: row.id })
          .then(resp => {
            if (resp.success) {
              this.$message({ type: "success", message: "操作成功!" });
            }
          })
          .catch(err => {
            this.$message("" + err);
          });
      });
    },
    addStu() {
      this.form = {
        id: null,
        name: null,
        sex: 1,
        age: null,
        grade: null,
        email: null
      };
      this.showEdit = true;
      this.isEdit = true;
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
