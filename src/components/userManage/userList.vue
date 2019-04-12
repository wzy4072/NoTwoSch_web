<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="mini" @click="addStu">新增用户</el-button>
    </el-card>
    <br>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
        <span style="float:right;">
          
        <el-input v-model="query.realName" size="mini" style="width:200px;" placeholder="输入真实姓名"></el-input>
        <el-input v-model="query.age"  size="mini" style="width:200px" placeholder="输入年龄"></el-input>
        <el-button type="primary" size="mini" @click="getTableData">查询</el-button>
        </span>

      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="realName" label="真实姓名" width="180"></el-table-column>
        <el-table-column prop="userName" label="昵称" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别" width="180">
          <template slot-scope="scope">{{sexLabels[scope.row.sex] || ''}}</template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="180"></el-table-column>
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

    <el-dialog :title="(form._id ? '修改' :'新增')  + '学生信息'" :visible.sync="showEdit" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="form.age"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input type="password" auto-complete="off" v-model="form.passWord"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass">
          <el-input type="password" auto-complete="off" v-model="form.checkPass"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="save">{{form._id ? '修 改': '新 增' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "./api/user";

export default {
  name: "userList",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      form: {
        id: null,
        realName: null,
        userName: null,
        passWord: null,
        sex: null,
        age: null,
        email: null
      },
      query: {
        realName: null,
        age: null
      },
      isEdit: {},
      showEdit: false,
      sexLabels: ["女", "男"],
      rules: {
        realName: [{ required: true, message: "必填", trigger: "blur" }],
        userName: [{ required: true, message: "必填", trigger: "blur" }],
        sex: [{ required: true, message: "必填", trigger: "change" }],
        age: [{ required: true, message: "必填", trigger: "blur" }],
        passWord: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [
          { required: true, message: "必填", trigger: "blur" },
          { type: "email", message: "请输入邮箱", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 查
    getTableData() {
      this.loading = true;
      let sendData = {};
      Object.keys(this.query).map(keyNa => {
        this.query[keyNa] && (sendData[keyNa] = this.query[keyNa]);
      });
      this.query;
      api
        .getUserList(sendData)
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
      this.form = Object.assign({}, row);
      this.form.checkPass = this.form.passWord;
      this.showEdit = true;
      this.isEdit = true;
    },

    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          api[this.form._id ? "update" : "save"](this.form)
            .then(resp => {
              if (resp.success) {
                this.$message({ type: "success", message: resp.message });
                this.showEdit = false;
                this.getTableData();
              } else {
                this.$message({ type: "error", message: resp.message });
              }
            })
            .catch(err => {
              this.$message("" + err);
            });
        }
      });
    },
    del(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api
          .del({ id: row._id })
          .then(resp => {
            if (resp.success) {
              this.$message({ type: "success", message: resp.message });
              this.getTableData();
            } else {
              this.$message({ type: "error", message: resp.message });
            }
          })
          .catch(err => {
            this.$message("" + err);
          });
      });
    },
    addStu() {
      this.form = {
        realName: null,
        userName: null,
        passWord: "123",
        checkPass: "123",
        sex: 1,
        age: 53,
        email: "xxx@163.com"
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
