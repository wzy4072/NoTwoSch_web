<template>
  <div>
    <el-row v-for="(cCont,idx) in planSet" :key="idx">
      <h3>{{cCont.checkContName}}</h3>
      <div class="lev-wrap" v-for="(cset,cIdx) in cCont.cList" :key="cIdx">
        <span>{{cset.checkItemName}}</span>
        <component
          :is="cset.showAsTable ? 'CheckShowA': 'CheckShowB'"
          :cols="cset.cols"
          :rows="cset.rows"
          :colForId="cset.colForId"
          :inited="cset.inited"
        ></component>
      </div>
    </el-row>
    {{planSet}}
    <!-- @upfileNames="getFilesName" -->
  </div>
</template>
<script>
import api from "./api.js";
import cMixin from "./common/cMixin.js";

import CheckShowB from "./common/checkShowB.vue";
import CheckShowA from "./common/checkShowA.vue";

export default {
  name: "mypage",
  mixins: [cMixin],
  components: {
    CheckShowA,
    CheckShowB
  },
  data() {
    return {
      planInfo: {},
      planSet: [],
      planValSet: [],
      stuData: [],
      stuFileData: []
    };
  },
  created() {
    this.getStudentApplys();
  },
  methods: {
    // 查询表格设置
    getStudentApplys() {
      api
        .getStudentApplys()
        .then(rsp => {
          if (rsp.code > 0) {
            this.planInfo = rsp.list[0];
            // 存储整理好的页面设置信息
            this.planSet = rsp.list[0].studentApplyDetailList.map(cc => {
              let cItem = {
                checkContId: cc.checkContId,
                checkContName: cc.checkContName,
                cList: []
              };

              cItem.cList = cc.studentCheckItemList.map(cd => {
                return Object.assign({}, this.initPageBlock(cd, true), {
                  where: {
                    checkContId: cc.checkContId,
                    checkItemId: cd.checkItemId
                  }
                });
              });
              return cItem;
            });
            this.getStuData();
          } else {
            this.$message.error("error!", 3);
          }
        })
        .catch(e => console.error(e));
    },
    getStuData() {
      api
        .getMyApplyDetails(1)
        .then(rsp => {
          if (rsp.code > 0) {
            let nData = {};
            for (let k in rsp.data) {
              nData[k] = {};
              if (rsp.data[k] && rsp.data[k].detailList) {
                nData[k].detailList = this.initStuRes(
                  rsp.data[k].detailList || []
                );
                nData[k].attList = rsp.data[k].attList;
              }
            }
            this.stuData = nData;
            // 还原数据
            this.restore();
          } else {
            this.$message.error("error!", 3);
          }
        })
        .catch(e => console.error(e));
    },
    initStuRes(arr) {
      let nArr = [];
      arr.map(row => {
        for (let key in row) {
          if (/^(checkDetail)[0-9]+$/.test(key)) {
            row[key.slice(11)] = row[key];
            delete row[key];
          } else {
            row[key] = row[key];
          }
        }
        nArr.push(row);
      });
      return nArr;
    },
    // 还原表数据
    restore() {
      this.planSet.map(cCont => {
        cCont.cList.map(item => {
          let itemTableData = this.stuData[item.checkItemId].detailList;
          // 表格类型
          if (item.showAsTable) {
            const tbVals = itemTableData[0] || {};
            item.rows.map(row => {
              for (let col in row) {
                if (/^[0-9]+$/.test(col)) {
                  const valId = item.colForId[row.checkDetailId + "_" + col];
                  row[col] = tbVals[valId];
                }
              }
              row.recordStatus = tbVals.recordStatus;
            });
          } else {
            item.rows = itemTableData || [];
          }
          item.inited = !item.inited;
        });
      });
    }
  }
};
</script>
<style scoped>
</style>


