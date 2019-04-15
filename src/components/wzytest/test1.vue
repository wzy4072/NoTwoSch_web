<template>
  <div>
    <el-row>
      <table-type v-model="typeId"></table-type>
      <el-button @click="getTableData">search</el-button>
    </el-row>

    <el-row>
      <var-table :tTitle="tableTitle" :tData="tableData" @selChange="selChange" @iRow="showiCard"></var-table>
    </el-row>

    <el-row>
      <el-dialog :title="iptPageInfo.blockName" :visible.sync="showIptCard" width="80%">
        <el-row>
          <span class="diaspan">当前数据录入学期：{{cRow.xxx}} ??-??学年第二学期</span>
          <span class="diaspan">姓名：{{cRow.name}}</span>
          <span class="diaspan">座号：{{cRow.seatNo}}</span>
        </el-row>
        <!-- <div>{{iptPageInfo}}</div> -->
        <var-page-table :columns="iptPageInfo.columns" :rows="iptPageInfo.rows"></var-page-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="showIptCard = false">取 消</el-button>
          <el-button type="primary" @click="showIptCard = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>

    <el-row>
      证明附件上传：
      <div v-for="(val,idx) in needUploads" :key="idx">
        <cell-upload :fileList="val.fileList" :upInfo="val.upInfo"></cell-upload>
      </div>
    </el-row>
  </div>
</template>
<script>
import TableType from "./common/tableType.vue";
import VarTable from "./common/varTable.vue";
import tableResponse from "./common/tableData.js";
import VarPageTable from "./common/varPageTable.vue";
import pageconfigResponse from "./common/typePageConfig.js";

import CellUpload from "./common/cellUpload.vue";

export default {
  name: "mytest1",
  components: { TableType, VarTable, VarPageTable ,CellUpload},
  data() {
    return {
      typeId: 1,
      tableTitle: [],
      tableData: [],
      pageInfo: {
        page: 1,
        pageSize: 20,
        total: 100
      },
      // 选中的行
      selectedRows: [],
      // 当前操作的行
      cRow: {},
      // 显示输入弹窗
      showIptCard: false,
      // 录入弹窗的页面设置
      iptPageInfo: { columns: [], rows: [] },
      needUploads: [
        {
          id: "1231",
          blockName: "党团活动",
          fileList: [{ name: "党团一活动", url: "xxxxxxx" }],
          upInfo: {}
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.tableTitle = tableResponse["table" + this.typeId].title;
      this.tableData = tableResponse["table" + this.typeId].data;
    },
    // 接收选中的行
    selChange(rows) {
      this.selectedRows = rows;
    },
    // 打开录入面板
    showiCard(i, r) {
      this.cRow = r;
      // 带完善 等后端数据格式 需要将页面设置和页面数据融合后丢给page组件
      this.iptPageInfo = pageconfigResponse["page" + this.typeId] || {
        columns: [],
        rows: []
      };
      this.showIptCard = true;
    }
  }
};
</script>
<style scoped>
span.diaspan {
  margin-right: 28px;
}
</style>


