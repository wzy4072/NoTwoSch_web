<template>
  <div>
    <el-table
      :data="tData"
      :span-method="objectSpanMethod"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(v,idx) in tTitle"
        :key="idx + Math.random().toString().substr(2)"
        :prop="''+v.id"
        :label="v.label"
      >
        <el-table-column
          v-for="(cv,cidx) in v.child || []"
          :key="cidx + Math.random().toString().substr(2)"
          :prop="cv.id"
          :label="v.label"
        ></el-table-column>
      </el-table-column>
      <el-table-column prop="handle" label="操作" width="300">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" @click="inputRow(scope.$index, scope.row)">录入</el-button>
            <el-button size="mini" @click="submitRow(scope.$index, scope.row)">再次提交</el-button>
            <el-button size="mini" @click="checkRow(scope.$index, scope.row)">提交审核</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ["tTitle", "tData"],
  data() {
    return {};
  },
  methods: {
    // 抛出选中内容
    handleSelectionChange(rows) {
      this.$emit("selChange", rows);
    },
    // 合并表格内数据单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || column.property === 'handle') {
        if (row.rowspan !== undefined) {
          return {
            rowspan: row.rowspan,
            colspan: row.rowspan === 0 ? 0 : 1
          };
        }
      }
    },
    inputRow(idx, row) {
      this.$emit("iRow", idx, row);
    },
    submitRow() {
      this.$emit("sRow", idx, row);
    },
    checkRow() {
      this.$emit("cRow", idx, row);
    }
  }
};
</script>
