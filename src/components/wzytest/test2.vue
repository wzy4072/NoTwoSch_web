<template>
  <div>
    <el-row>考核方案：2018级学生高一上学期综合素质考核</el-row>
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

    <!-- 先进个人荣誉称号（可增加/无联类型/二级级） -->
    <div class="lev-wrap">
      <span>{{pConf.blockName}}</span>
      <div>
        <el-row>录入权限：有权限</el-row>
        <el-row>目前表格状态：未录入</el-row>
        <el-row>
          <card-one :tTitle="pConf.values" :tData="[]" :uploadSet="uploadSet" :list="fileList"></card-one>
        </el-row>
        <el-row>
          审核反馈：
          <br>三好学生的荣誉证书照片模糊，请重新上传后再次提交
        </el-row>
      </div>
    </div>

    <el-button @click="submitPage">提交</el-button>
  </div>
</template>
<script>
import newPageConfig from "./common/newPageConfig.js";

import CardOne from "./common/cardOne.vue";
import CardTwo from "./common/cardTwo.vue";

export default {
  name: "mytest2",
  components: {
    CardOne,
    CardTwo
  },
  data() {
    return {
      pConf1: {},
      tTitle1: {},
      tData1: [],
      pConf: {},
      uploadSet:{},
      fileList:[],

      // 数据id 和 关系id转换
      rIdStore: {}
    };
  },
  created() {
    this.pConf1 = newPageConfig[0];
    this.pConf = newPageConfig[1];
    this.getTTitle();
    this.getTData();
    this.uploadSet = this.pConf.uploadValid
    this.uploadSet1 = this.pConf.uploadValid
  },
  methods: {
    submitPage() {},
    getTTitle() {
      // 存储id - rid  关系
      this.rIdStore = {};

      let column = [];
      let columnIds = [];
      this.pConf1.itemList.map(item => {
        item.values.map(valInfo => {
          this.rIdStore[valInfo.id] = valInfo.rId;

          if (valInfo.rId && !columnIds.includes(valInfo.rId)) {
            column.push(valInfo);
            columnIds.push(valInfo.rId);
          }
        });
      });
      this.tTitle1 = column;
    },
    getTData() {
      // 由 原来的 id：val 改为 tid:val
      // let responseRows = [
      //   { id: 111, value: 12 },
      //   { id: 121, value: 13 },
      //   { id: 122, value: 12 },
      //   { id: 131, value: 13 },
      //   { id: 132, value: 13 }
      // ];
      this.tData1 = [
        { "111": "kkk", "111-1": "kkk", "112": 13, "111-2": 13 },
        { "121": "as", "111-1": "as", "122": 15, "111-2": 15 },
        { "131": 12, "111-1": 12, "132": "asdf", "111-2": "asdf" }
      ];
    }
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


