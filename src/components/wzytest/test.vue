<template>
  <div>
    <!-- <div>value:{{scope.row[scope.column.property]}}</div>
              <div>info:{{scope.row['info'+scope.column.property]}}</div>
    {{scope.column}} {{scope.row}} {{scope.column}}-->
    <el-table :data="pageConfig[0].rows" style="width: 100%" size="small" ref="topTable">
      <el-table-column
        v-for="(col,idx) in pageConfig[0].columns"
        :key="idx"
        :label="col.colName"
        :prop="''+col.colId"
      >
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'undefined'">
            <any-cell
              :cellInfo="scope.row['info'+scope.column.property]"
              v-model="scope.row[scope.column.property]"
              @getForm="getFormComponents"
            ></any-cell>
          </div>
          <div v-else>{{scope.row.rowName}}</div>
        </template>
      </el-table-column>
    </el-table>

    <el-button @click="checkForm">checkFrom</el-button>
    <!-- forms{{forms}} -->
  </div>
</template>
<script>
import anyCell from "./anyCell.vue";
import pageConfig from "./pageConfig.js";
export default {
  name: "mytest",
  components: { anyCell },
  data() {
    return {
      // 思想品德的页面设置
      pageConfig: pageConfig,

      cellInfo: {
        // input date text select multiselect
        type: "input",
        value: "123",
        options: ["国家", "省", "市", "区", "校"]
      },
      forms: []
    };
  },
  methods: {
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

      Promise.all(promises).then(function(valids) {
        if (allPass) {
        } else {
          console.error("please check your form!");
        }
      });
    },
    getFormComponents(formCom) {
      this.forms.push(formCom);
    }
  }
};
</script>

