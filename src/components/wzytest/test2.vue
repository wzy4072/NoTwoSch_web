<template>
  <div>
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
            :where="set.where"
            @upfileNames="getFilesName"
          ></component>
          <plan-uploads :list="set.needFiles" :where="set.where"></plan-uploads>
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
import cMixin from "./common/cMixin.js";

// import CardOne from "./common/cardOne.vue";
import CardTwo from "./common/cardTwo.vue";
import CheckPlanA from "./common/checkPlanA.vue";
import CheckPlanB from "./common/checkPlanB.vue";
import PlanUploads from "./common/planUploads.vue";
import api from "./api.js";

export default {
  name: "mytest2",
  mixins:[cMixin],
  components: {
    // CardOne,
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
      pSet: [],
      vSet: [],
      subResult: []
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
              this.vSet.push({
                where: {
                  checkContId: pageInfo.checkContId, // 存储 思想品德id
                  checkItemId: bInfo.checkItemId // 存储 活动项目id
                },
                formsProms: [], // 文件和输入框的数据promise.......
                filesProms: [] // 文件和输入框的数据promise.......
              });

              return Object.assign({}, this.initPageBlock(bInfo), {
                where: {
                  checkContId: pageInfo.checkContId, // 存储 思想品德id
                  checkItemId: bInfo.checkItemId // 存储 活动项目id
                }
              });
            });
          } else {
            this.$message.error("error!", 3);
          }
        })
        .catch(e => console.error(e));
    },
    async asyncBlock(s) {
      let sIt = Object.assign({}, s.where, { studentId: "" });
      sIt.applyDetailList = await Promise.all(s.formsProms).then(([...f]) => {
        return f[0];
      });
      sIt.applyAttList = await Promise.all(s.filesProms).then(([...f]) => {
        let files = [];
        f.map(f => files.push(...f));
        return files;
      });
      return sIt;
    },
    async submitPage() {
      this.vSet.map(s => {
        s.formsProms = [];
        s.filesProms = [];
      });

      eventHub.$emit("submit");
      const subResult = await Promise.all(
        this.vSet.map(set => this.asyncBlock(set))
      );
      console.log(subResult);
    },
    getFiles(f, where) {
      let set = this.vSet[this.fIdx(this.vSet, where)];
      set.filesProms.push(f);
    },
    getForms(f, where) {
      let set = this.vSet[this.fIdx(this.vSet, where)];
      set.formsProms.push(f);
    },
    // 用于接收 文件上传实时变动的文件名列表
    getFilesName(nameArr, where) {
      let set = this.pSet[this.fIdx(this.pSet, where)];
      let newFiles = [];
      // 这里 仅考虑了
      // 1 name和needfiles 顺序相同
      // 2 needfiles中都是同步名字

      // 先判断是否是需要同步的
      let syncName = false;
      set.needFiles.map((file, idx) => {
        if (file.syncName) {
          syncName = true;
        }
      });
      if (syncName) {
        set.needFiles = nameArr.map((na, ni) => {
          let fNi = Object.assign({}, set.needFiles[ni] || set.needFiles[0]);
          fNi.name = na;
          return fNi;
        });
      }
    },
    // collectUploadsInfo(i) {
    //   return {
    //     fileId: "",
    //     name: i.checkDetailName,
    //     checkDetailId: i.checkDetailId,
    //     singleFileSize: i.singleFileSize,
    //     fileCount: i.fileCount,
    //     // 标记 是否需要同步名字 （如果当前字段没有下一级，有值，那么就需要同步）
    //     syncName: !i.detailList || i.detailList.length === 0
    //   };
    //   // syncName:
    //   //   i.syncName !== undefined
    //   //     ? i.syncName
    //   //     : !i.detailList || i.detailList.length === 0
    // },
    fIdx(arr, where) {
      for (let i = 0; i < arr.length; i++) {
        if (
          arr[i].where.checkContId === where.checkContId &&
          arr[i].where.checkItemId === where.checkItemId
        ) {
          return i;
          break;
        }
      }
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


