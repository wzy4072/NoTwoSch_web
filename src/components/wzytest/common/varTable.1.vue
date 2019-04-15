<template>
  <div>
    <el-table :data="tableData" :span-method="objectSpanMethod" style="width: 100%">
      <el-table-column
        v-for="(v,idx) in tableTitle"
        :key="idx + Math.random().toString().substr(2)"
        :prop="v.id.toString()"
        :label="v.label"
      >
        <el-table-column
          v-for="(cv,cidx) in v.child || []"
          :key="cidx + Math.random().toString().substr(2)"
          :prop="cv.id"
          :label="v.label"
        >
          <!-- 区分颜色与按钮 -->
          <template scope="scope">
            <div v-if="scope.column.property === 'handle'">
              <el-button size="mini" @click="inputRow(scope.$index, scope.row)">录入</el-button>
              <el-button size="mini" @click="submitRow(scope.$index, scope.row)">再次提交</el-button>
              <el-button size="mini" @click="checkRow(scope.$index, scope.row)">提交审核</el-button>
            </div>
            <div v-else>{{scope.row[scope.column.property]}}</div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- tableTitle:{{tableTitle}}
    <br>
    tableData:{{tableData}}-->
    <el-button @click="changeTable('table1')">table1</el-button>
    <el-button @click="changeTable('table2')">table2</el-button>
  </div>
</template>

<script>
import tableDatas from "./tableData.js";

export default {
  data() {
    return {
      tableTitle: tableDatas.table2.title,
      tableData: tableDatas.table2.data,
      tableId: "table1"
    };
  },
  methods: {
    changeTable(na) {
      this.tableId = na;
      this.tableTitle = tableDatas[na].title;
      this.tableData = tableDatas[na].data;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //   return { rowspan: 1, colspan: 1 };
      if (columnIndex === 0) {
        if (row.rowspan !== undefined) {
          console.log(row.rowspan);
          return {
            rowspan: row.rowspan,
            colspan: row.rowspan === 0 ? 0 : 1
          };
        }
      }
    },
    inputRow() {},
    submitRow() {},
    checkRow() {}
  }
};
</script>
