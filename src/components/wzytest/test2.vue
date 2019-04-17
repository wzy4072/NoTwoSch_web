<template>
  <div>
    <div class="lev-wrap">
      <span>{{pInfo.checkItemName}}</span>
      <div>
        <el-row>录入权限：有权限</el-row>
        <el-row>目前表格状态：未录入</el-row>
        <el-row>
          <check-plan :rows="pRows" :cols="pCols" :nUp="needUp"></check-plan>
          <!-- <card-two :tTitle="tTitle1" :tData="tData1" :pConf1="pConf"></card-two> -->
        </el-row>
        <el-row>
          审核反馈：
          <br>三好学生的荣誉证书照片模糊，请重新上传后再次提交
        </el-row>
      </div>
    </div>

    <!-- <el-row>考核方案：2018级学生高一上学期综合素质考核</el-row>
    <el-row>当前数据录入学期：2018-2019学年第二学期 姓名：张某某 座号：01</el-row>

    <div class="lev-wrap">
      <span>{{pConf1.blockName}}</span>
      <div>
        <el-row>录入权限：有权限</el-row>
        <el-row>目前表格状态：未录入</el-row>
        <el-row>
          <card-two :tTitle="tTitle1" :tData="tData1" :pConf1="pConf"></card-two>
        </el-row>
        <el-row>
          审核反馈：
          <br>三好学生的荣誉证书照片模糊，请重新上传后再次提交
        </el-row>
      </div>
    </div>

    <el-button @click="submitPage">提交</el-button>-->
  </div>
</template>
<script>
import newPageConfig from "./common/newPageConfig.js";

import CardOne from "./common/cardOne.vue";
import CardTwo from "./common/cardTwo.vue";
import CheckPlan from "./common/checkPlan.vue";
import api from "./api.js";

export default {
  name: "mytest2",
  components: {
    CardOne,
    CardTwo,
    CheckPlan
  },
  data() {
    return {
      pInfo: {},
      pCols: [],
      pRows: [],
      needUp:!0

      // pConf1: {},
      // tTitle1: {},
      // tData1: [],
      // pConf: {},
      // uploadSet:{},
      // fileList:[],
      // // 数据id 和 关系id转换
      // rIdStore: {}
    };
  },
  created() {
    this.getCheckPlanInfoById();
  },
  methods: {
    getCheckPlanInfoById() {
      api
        .getCheckPlanInfoById(1)
        .then(rsp => {
          if (rsp.code > 0) {
            this.pInfo = rsp.data;
            this.initRes();
          } else {
            this.$message.error("error!", 3);
          }
        })
        .catch(e => console.error(e));
    },
    initRes() {
      // get table title
      // 判断是否是表格
      let needShowAdTable = false;
      // 用于数据渲染 id显示到col下
      let idToCol = {};
      // 存储 协助统计
      let cIdxs = [];
      // 表体 及 单元格格式
      let cols = [];
      cols.push({ prop: "name", label: this.pInfo.checkItemName });
      this.pInfo.checkDetailList.map(detail => {
        detail.detailList.map(vInfo => {
          const cIdx = vInfo.rowToColIndex;
          if (cIdx) {
            needShowAdTable = true;
            idToCol[vInfo.checkDetailId] = cIdx;
            if (!cIdxs.includes(cIdx)) {
              cIdxs.push(cIdx);
              cols.push({
                prop: cIdx,
                label: vInfo.checkDetailName,
                cellInfo: vInfo
              });
            }
          }
        });
      });
      let rows = [];
      this.pInfo.checkDetailList.map(detail => {
        // rows.push({ name: detail.checkDetailName [idToCol[detail.]]});
        let row = { id: detail.checkDetailId, name: detail.checkDetailName }; // 表格首列
        detail.detailList.map(vInfo => {
          row[vInfo.rowToColIndex] = ""; // 表格内单元格默认值
        });
        rows.push(row);
      });

      this.pCols = cols;
      this.pRows = rows;
      this.needUp = !this.needUp
    }
    // submitPage() {},
    // getTTitle() {
    //   // 存储id - rid  关系
    //   this.rIdStore = {};
    //   let column = [];
    //   let columnIds = [];
    //   this.pConf1.itemList.map(item => {
    //     item.values.map(valInfo => {
    //       this.rIdStore[valInfo.id] = valInfo.rId;
    //       if (valInfo.rId && !columnIds.includes(valInfo.rId)) {
    //         column.push(valInfo);
    //         columnIds.push(valInfo.rId);
    //       }
    //     });
    //   });
    //   this.tTitle1 = column;
    // },
    // getTData() {
    //   this.tData1 = [
    //     { "111": "kkk", "111-1": "kkk", "112": 13, "111-2": 13 },
    //     { "121": "as", "111-1": "as", "122": 15, "111-2": 15 },
    //     { "131": 12, "111-1": 12, "132": "asdf", "111-2": "asdf" }
    //   ];
    // }
  }
};
</script>
<style scoped>
.lev-wrap {
  padding: 20px;
  border: 1px solid #ccc;
  margin: 8px 0;
}
</style>


