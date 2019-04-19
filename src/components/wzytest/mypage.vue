<template>
  <div>
    <el-row v-for="(cCont,idx) in planSet" :key="idx">
      <h3>{{cCont.checkContName}}</h3>
      <div class="lev-wrap" v-for="(cset,cIdx) in cCont.cList" :key="cIdx">
        <span>{{cset.checkItemName}}</span>
        <component
          :is="cset.showAsTable ? 'CheckPlanA': 'CheckPlanB'"
          :cols="cset.cols"
          :rows="cset.rows"
          :colForId="cset.colForId"
          :inited="cset.inited"
          :where="cset.where"
        ></component>
      </div>
    </el-row>
    <!-- @upfileNames="getFilesName" -->
  </div>
</template>
<script>
import api from "./api.js";
import cMixin from "./common/cMixin.js";

import CheckPlanA from "./common/checkPlanA.vue";
import CheckPlanB from "./common/checkPlanB.vue";

export default {
  name: "mypage",
  mixins: [cMixin],
  components: {
    CheckPlanA,
    CheckPlanB
  },
  data() {
    return {
      planInfo: {},
      planSet: [],
      planValSet: []
    };
  },
  created() {
    this.getStudentApplys();
  },
  methods: {
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
                return Object.assign({}, this.initPageBlock(cd), {
                  where: {
                    checkContId: cc.checkContId,
                    checkItemId: cd.checkItemId
                  }
                });
              });
              // cItem.cList = cc.studentCheckItemList.map(ci => {
              //   let iItem = {
              //     checkItemId: ci.checkItemId,
              //     checkItemName: ci.checkItemName,
              //     iList: []
              //   };
              //   iItem.iList = ci.detailList.map(cd => {
              //     return Object.assign({}, this.initPageBlock(cd), {
              //       where: {
              //         checkContId: cc.checkContId,
              //         checkItemId: ci.checkItemId,
              //         checkDetailId: cd.checkDetailId
              //       }
              //     });
              //   });
              //   return iItem;
              // });
              return cItem;
            });
          } else {
            this.$message.error("error!", 3);
          }
        })
        .catch(e => console.error(e));
    }
  }
};
</script>
<style scoped>
</style>


