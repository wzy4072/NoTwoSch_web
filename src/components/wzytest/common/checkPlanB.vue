<template>
  <div>
    <el-table :data="tableData" :span-method="objectSpanMethod" style="width: 100%">
      <el-table-column
        v-for="(v,idx) in cols"
        :key="idx + Math.random().toString().substr(2)"
        :prop="''+v.prop"
        :label="v.label"
      >
        <template slot-scope="scope">
          <any-cell
            :cellInfo="v.cellInfo"
            v-model="scope.row[scope.column.property]"
            @getForm="getFormComponents"
          ></any-cell>
        </template>
      </el-table-column>
      <el-table-column label="自定义显示字段" :render-header="customFieldColumn" prop="handle">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" @click="delRow(scope.$index, scope.row)">DEL</el-button>
          </div>
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
    if (this.tableData.length === 0) {
      // 普通显示 默认给一个空行
      this.getRowByCol();
    } else {
      this.tableData = JSON.parse(JSON.stringify(this.rows));
    }
    // this.firstProps = this.tTitle[0].id;
    eventHub.$on("submit", () => {
      // 收到广播 先进行验证
      // 符合的话就丢值出去
      eventHub.$emit("forms", this.checkForm());
    });
  },
  methods: {
    delRow(idx, row) {
      if (this.tableData.length > 1) {
        this.tableData.splice(idx, 1);
      } else {
        this.$message.info("不能全部删除！");
      }
    },
    // 通过行信息获取对应的默认值
    getRowByCol() {
      const types = {
        input: "",
        number: "",
        date: "",
        text: "",
        select: "",
        multiselect: []
      };
      let row = {};
      this.cols.map(i => {
        // row[i.prop] = types[i.cellInfo.fieldType];
        row[i.prop] ='';
      });
      this.tableData = [row];
      return row;
    },
    // 合并表格内数据单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || column.property === "handle") {
        if (row.rowspan !== undefined) {
          return {
            rowspan: row.rowspan,
            colspan: row.rowspan === 0 ? 0 : 1
          };
        }
      }
    },
    customFieldColumn(h, { column, $index }) {
      return h(
        "el-button",
        {
          class: { addbtn: true },
          attrs: { id: "elem", size: "mini" },
          on: {
            click: this.getRowByCol
          }
        },
        "新增"
      );
    },
    // 表单验证
    // checkForm() {
    //   let allPass = true;
    //   let promises = this.forms.map(
    //     f =>
    //       new Promise((rs, rj) => {
    //         f.validate(valid => {
    //           if (valid) {
    //             rs(valid);
    //           } else {
    //             allPass = false;
    //             rj(valid);
    //           }
    //         });
    //       })
    //   );
    //   return Promise.all(promises).then(valids => {
    //     if (allPass) {
    //       // 表单全部验证通过 则进行整理数据
    //       return this.initForms();
    //     } else {
    //       return {};
    //       console.error("please check your form!");
    //     }
    //   });
    // },
    // // 收集form表单
    getFormComponents(formCom) {
      this.forms.push(formCom);
    }
    // // 整理数据提交
    // initForms() {
    //   let formValues = {};
    //   this.tableData.map((row, k) => {
    //     const keys = Object.keys(row);
    //     for (let key of keys) {
    //       if (/^[0-9]+$/.test(key)) {
    //         const vId = this.colForId[row["checkDetailId"] + "_" + key];
    //         formValues["checkDetail" + vId] = row[key];
    //       }
    //     }
    //   });
    //   return formValues;
    // }
  }
};
</script>

<style>
</style>
