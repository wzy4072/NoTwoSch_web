<template>
  <div>
    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column v-for="(col,idx) in cols" :key="idx" :label="col.label" :prop="''+col.prop">
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'name'">
            <any-cell
              :cellInfo="col.cellInfo"
              v-model="scope.row[scope.column.property]"
              @getForm="getFormComponents"
            ></any-cell>
          </div>
          <div v-else>{{scope.row[scope.column.property]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import eventHub from "./eventHub.js";

import anyCell from "./anyCell.vue";
export default {
  props: {
    cols: {
      type: Array,
      required: true,
      default: []
    },
    rows: {
      type: Array,
      required: true,
      default: []
    },
    // rows 初始为[],请求回来整理完毕后更新这里，通知更新
    inited: {
      type: Boolean
    },
    // 通过列id 找 值 id的工具
    colForId: {
      type: Object,
      required: true
    }
  },
  components: { anyCell },
  data() {
    return {
      tableData: [...this.rows],
      forms: []
    };
  },
  watch: {
    inited(nv, ov) {
      this.tableData = [...this.rows];
    }
  },
  created() {
    eventHub.$on("submit", () => {
      // 收到广播 先进行验证
      // 符合的话就丢值出去
      eventHub.$emit("forms", this.checkForm());
    });
  },
  methods: {
    // 表单验证
    checkForm() {
      let allPass = true;
      let promises = this.forms.map(
        f =>
          new Promise((rs, rj) => {
            f.validate(valid => {
              if (valid) {
                rs(valid);
              } else {
                allPass = false;
                rj(valid);
              }
            });
          })
      );
      return Promise.all(promises).then(valids => {
        if (allPass) {
          // 表单全部验证通过 则进行整理数据
          return this.initForms();
        } else {
          return {};
          console.error("please check your form!");
        }
      });
    },
    // 收集form表单
    getFormComponents(formCom) {
      this.forms.push(formCom);
    },
    // 整理数据提交
    initForms() {
      let formValues = {};
      this.tableData.map((row, k) => {
        const keys = Object.keys(row);
        for (let key of keys) {
          if (/^[0-9]+$/.test(key)) {
            const vId = this.colForId[row["checkDetailId"] + "_" + key];
            formValues["checkDetail" + vId] = row[key];
          }
        }
      });
      return formValues;
    }
  }
};
</script>

<style>
</style>
