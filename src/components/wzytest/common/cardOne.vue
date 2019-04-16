<template>
  <div>
    <el-table :data="tableData" :span-method="objectSpanMethod" style="width: 100%">
      <el-table-column
        v-for="(v,idx) in tTitle"
        :key="idx + Math.random().toString().substr(2)"
        :prop="''+v.id"
        :label="v.name"
      >
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'undefined'">
            <any-cell
              :cellInfo="v.valid"
              v-model="scope.row[scope.column.property] "
              @getForm="getFormComponents"
            ></any-cell>
          </div>
          <div v-else>请检查：scope.column.property {{scope.column.property}}</div>
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
    <el-row>证明附件上传：</el-row>
    <el-row>
      <div v-for="(val,idx) in tableData" :key="idx">
        <span style="maring:0 20px;">{{idx +1}}.</span>
        <cell-upload :upInfo="uploadSet" :name="val[firstProps]" :list="list"></cell-upload>
      </div>
    </el-row>
  </div>
</template>


<script>
// upInfo:{
//   name:'',
//   limit:3,
//   fileList:[],
//   size:5
// }
import AnyCell from "./anyCell.vue";
import CellUpload from "./cellUpload.vue";

export default {
  props: ["tTitle", "tData", "uploadSet",'list'],
  components: { AnyCell, CellUpload },

  data() {
    return {
      tableData: [],
      forms: [],
      firstProps: null
    };
  },
  created() {
    if (this.tableData.length === 0) {
      this.tableData = [this.initRow()];
    } else {
      this.tableData = JSON.parse(JSON.stringify(this.tData));
    }
    this.firstProps = this.tTitle[0].id;
  },
  methods: {
    initRow() {
      let row = {};
      this.tTitle.map(v => (row[v.id] = ""));
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
    delRow(idx, row) {
      if (this.tableData.length > 1) {
        this.tableData.splice(idx, 1);
      } else {
        this.$message.info("不能全部删除！");
      }

      //   this.$emit("delRow", idx, row);
    },
    getFormComponents(formCom) {
      this.forms.push(formCom);
    },
    customFieldColumn(h, { column, $index }) {
      return h(
        "el-button",
        {
          class: { addbtn: true },
          attrs: { id: "elem", size: "mini" },
          on: {
            click: this.addEmptyRow
          }
        },
        "新增"
      );
    },
    addEmptyRow() {
      this.tableData.push(this.initRow());
    }
  }
};
</script>
