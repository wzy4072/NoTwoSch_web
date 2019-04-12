<template>
  <div>
    <el-button type="primary" size="mini" @click="add">add Brothers</el-button>
    <el-button type="primary" size="mini" @click="add">add Children</el-button>
    <el-button size="mini" @click="edit">edit</el-button>
    <el-button size="mini" type="danger" @click="del">delete</el-button>

    <el-tree :data="menus" :props="defaultProps"   show-checkbox @check-change="handleCheckChange"></el-tree>

    <el-dialog :title="form._id ? '修改' :'新增'" :visible.sync="showEdit" width="30%">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="children" prop="children" disabled>
          <el-input v-model="form.children"></el-input>
        </el-form-item>
        <el-form-item label="route" prop="route">
          <el-input v-model="form.route"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="ensureSave">{{form._id ? '修 改': '新 增' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "./menu.js";
import menuApi from "@/api/common/account.js";
import menu from "./menu.js";

export default {
  name: "menus",
  data() {
    return {
      menus: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentNode: {},
      form: {},
      showEdit: false
    };
  },
  methods: {
    getMenus() {
      menuApi.getMenus().then(res => {
        if (res.success) {
          this.menus = res.data;
        } else {
          this.$message.error(requst.message, 3);
        }
      });
    },
    add() {
      this.showEdit = true;
    },
    del() {},
    edit() { this.showEdit = true;},
    ensureSave() {},
    handleCheckChange(node) {
      this.form = Object.assign({}, node);
    }
  },
  created() {
    this.getMenus();
  }
};
</script>
