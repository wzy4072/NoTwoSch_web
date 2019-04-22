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
          <div>{{scope.row[scope.column.property]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" prop="recordStatus">
        <template slot-scope="scope">
          <div>{{recordStatusLabel[scope.row.recordStatus]}}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- ---{{tableData}}
    ---{{cols}} -->
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      tableData: [...this.rows],
      recordStatusLabel: {
        "0": "草稿",
        "1": "已提交",
        "2": "审核通过",
        "3": "审核不通过"
      }
    };
  },
  watch: {
    inited(nv, ov) {
      this.tableData = [...this.rows];
    }
  },
  created() {
    if (this.tableData.length === 0) {
      this.tableData = [this.getRowByCol()];
    } else {
      this.tableData = JSON.parse(JSON.stringify(this.rows));
    }
  },
  methods: {
    // 删除行
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
        if (/^[0-9]+$/.test(i.prop)) {
          row[i.prop] = types[i.cellInfo.fieldType];
        }
      });
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
            click: () => {
              this.tableData.push(this.getRowByCol());
            }
          }
        },
        "新增"
      );
    }
  }
};
</script>

<style>
</style>
