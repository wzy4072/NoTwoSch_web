<template>
  <div>
    <!-- <div class="lev-wrap">
      <span>{{pInfo.checkItemName}}</span>
      <div>
        <el-row>录入权限：有权限</el-row>
        <el-row>目前表格状态：未录入</el-row>
        <el-row>
          <check-plan :rows="pRows" :cols="pCols" :colForId="colForId" :inited="inited"></check-plan>
          <plan-uploads :list="pFiles"></plan-uploads>
        </el-row>
        <el-row>
          审核反馈：
          <br>三好学生的荣誉证书照片模糊，请重新上传后再次提交
        </el-row>
      </div>
    </div>-->

    <div class="lev-wrap" v-for="(set,idx) in pSet" :key="idx">
      <span>{{set.checkItemName}}</span>
      <div>
        <el-row>录入权限：有权限</el-row>
        <el-row>目前表格状态：未录入</el-row>
        <el-row>
          <component
            :is="set.showAsTable ? 'CheckPlanA': 'CheckPlanB'"
            :cols="set.cols"
            :rows="set.rows"
            :colForId="set.colForId"
            :inited="set.inited"
          ></component>
          <plan-uploads :list="set.needFiles"></plan-uploads>
          <!-- <check-plan :rows="pRows" :cols="pCols" :colForId="colForId" :inited="inited"></check-plan> -->
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

import eventHub from "./common/eventHub.js";

import CardOne from "./common/cardOne.vue";
import CardTwo from "./common/cardTwo.vue";
import CheckPlanA from "./common/checkPlanA.vue";
import CheckPlanB from "./common/checkPlanB.vue";
import PlanUploads from "./common/planUploads.vue";
import api from "./api.js";

export default {
  name: "mytest2",
  components: {
    CardOne,
    CardTwo,
    CheckPlanA,
    CheckPlanB,
    PlanUploads
  },
  data() {
    return {
      // 当前块的信息
      pInfo: {},
      // 当前块整理得到的
      pCols: [],
      pRows: [],
      colForId: {},
      // 已有的附件数据展示
      pFiles: [],

      // 收集存储 子组件所有组装好的值
      promiseForm: {
        files: [],
        forms: []
      },

      //-----------------------------------
      backUpPageData: {},
      // 整理后的页面数据 如下
      pSet: []
      //  {  cols,
      // rows,
      // colForId,
      // inited,
      // needFiles,
      // showAsTable,
      // checkItemName
      // checkItemId }
    };
  },
  created() {
    this.getStudentApplys();
    eventHub.$on("files", this.getFiles);
    eventHub.$on("forms", this.getForms);
  },
  methods: {
    getStudentApplys() {
      api
        .getStudentApplys()
        .then(rsp => {
          if (rsp.code > 0) {
            // 思想品德
            let pageInfo = rsp.list[0].studentApplyDetailList[0];
            this.backUpPageData = JSON.parse(JSON.stringify(pageInfo));

            // 活动项目 等块信息
            let cItemList = pageInfo.studentCheckItemList;

            this.pSet = cItemList.map(bInfo => {
              return this.initPageBlock(bInfo);
              // console.log(this.initPageBlock(bInfo));
            });

            // this.pInfo = cItemList[0];
            // this.initRes();
          } else {
            this.$message.error("error!", 3);
          }
        })
        .catch(e => console.error(e));
    },
    collectUploadsInfo(i) {
      return {
        checkItemId: "",
        name: i.checkDetailName,
        checkDetailId: i.checkDetailId,
        singleFileSize: i.singleFileSize,
        fileCount: i.fileCount
      };
    },

    // 根据页面判断使用哪一个页面
    initPageBlock(bInfo) {
      // get table title
      // 判断是否是表格
      let showAsTable = false;
      // 用于数据渲染 id显示到col下
      let idToCol = {};
      // 存储 协助统计（表格方式显示时使用）
      let cIdxs = [];
      // 表体 及 单元格格式
      let cols = [];
      // !!! 目前只考虑了 table方式和普通方式 其他方式尚未考虑

      // 附件信息
      let needFiles = [];
      bInfo.detailList.map(detail => {
        detail.needFile && needFiles.push(this.collectUploadsInfo(detail));
        // 假如没有三级数据 // 暂时不考虑 table类型
        const sIdx = detail.rowToColIndex;
        if (!detail.detailList || detail.detailList.length === 0) {
          // if (sIdx) {
          //   showAsTable = true;
          //   idToCol[detail.checkDetailId] = sIdx;
          //   if (!cIdxs.includes(sIdx)) {
          //     cIdxs.push(sIdx);
          //     cols.push({
          //       prop: sIdx,
          //       label: detail.checkDetailName,
          //       cellInfo: detail
          //     });
          //   }
          // }
          // 非 表格方式显示
          cols.push({
            prop: detail.checkDetailId,
            label: detail.checkDetailName,
            cellInfo: detail
          });
        } else {
          //三级的处理
          detail.detailList.map(vInfo => {
            detail.vInfo && needFiles.push(this.collectUploadsInfo(vInfo));
            const cIdx = vInfo.rowToColIndex;
            if (cIdx) {
              showAsTable = true;
              idToCol[vInfo.checkDetailId] = cIdx;
              if (!cIdxs.includes(cIdx)) {
                cIdxs.push(cIdx);
                cols.push({
                  prop: cIdx,
                  label: vInfo.checkDetailName,
                  cellInfo: vInfo
                });
              }
            } else {
              // 非 表格方式显示
              cols.push({
                prop: vInfo.checkDetailId,
                label: vInfo.checkDetailName,
                cellInfo: vInfo
              });
            }
          });
        }
      });
      let rows = [];
      let colForId = {};
      if (showAsTable) {

        cols.unshift({ prop: "name", label: bInfo.checkItemName, cellInfo: {} });

        bInfo.detailList.map(detail => {
          let row = {
            checkDetailId: detail.checkDetailId,
            name: detail.checkDetailName
          }; // 表格首列
          detail.detailList.map(vInfo => {
            row[vInfo.rowToColIndex] = "1"; // 表格内单元格默认值
            // 三级id_列序号 = 值id 为了换算得到id使用
            colForId[detail.checkDetailId + "_" + vInfo.rowToColIndex] =
              vInfo.checkDetailId;
          });
          rows.push(row);
        });
      } 

      let inited = !0;
      // 根据初始数据 整理出 表头、表体 id查找工具 附件信息
      return {
        cols,
        rows,
        colForId,
        inited,
        needFiles,
        showAsTable,
        checkItemName: bInfo.checkItemName,
        checkItemId: bInfo.checkItemId
      };
    },
  
    submitPage() {
      this.promiseForm = {
        files: [],
        forms: []
      };
      eventHub.$emit("submit");
      Promise.all(this.promiseForm.forms)
        .then(([...forms]) => {
          console.log("收集完毕！form", forms);
          Promise.all(this.promiseForm.files)
            .then(([...files]) => {
              console.log("收集完毕！files", files);
              console.log(
                "页面内所有Form和文件上传结果，收集完毕！可以进行提交了！"
              );
            })
            .catch(e => {
              this.$message.error(e.msg);
            });
        })
        .catch(e => {
          this.$message.error(e.msg);
        });
    },
    getFiles(f) {
      this.promiseForm.files.push(f);
    },
    getForms(f) {
      this.promiseForm.forms.push(f);
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


