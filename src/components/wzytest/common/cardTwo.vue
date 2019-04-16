<template>
  <div>
       <!-- // {
      //                   id: 111,
      //                   rId: '111-1', // 关联id 可以无关联
      //                   name: '累计次数',
      //                   valid: {
      //                       type: 'input',
      //                       pleaseholder: '温馨提示，请输入汉字中文英文和数字！',
      //                       contType: ['ch', 'en', 'no'],
      //                       maxLength: 8
      //                   }
      //               } -->
    <el-table :data="tData" style="width: 100%" size="small" ref="topTable">
      <el-table-column v-for="(col,idx) in tTitle" :key="idx" :label="col.name" :prop="''+col.rId">
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'undefined'">
            <any-cell
              :cellInfo="col.valid"
              v-model="scope.row[scope.column.property]"
              @getForm="getFormComponents"
            ></any-cell>
          </div>
          <div v-else>error : scope.column.property is:{{scope.column.property}}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      证明附件上传：
      <div v-for="(val,idx) in needUploads" :key="idx">
        <span style="maring:0 20px;">{{idx +1}}.</span>
        <cell-upload :upInfo="val"></cell-upload>
      </div>
    </el-row>
  </div>
</template>
<script>
import anyCell from "./anyCell.vue";
import CellUpload from "./cellUpload.vue";
export default {
  props: ["tData", "tTitle"],
  components: { anyCell, CellUpload },
  data() {
    return {
      forms: [],
      needUploads: []
      // needUploads: [
      //   {
      //     id: "1231",
      //     blockName: "党团活动",
      //     fileList: [{ name: "党团一活动", url: "xxxxxxx" }],
      //     valid: {
      //       limit: 5,
      //       size: 5
      //     }
      //   },
      //   {
      //     id: "1231",
      //     blockName: "社团活动附件",
      //     fileList: [],
      //     valid: {
      //       limit: 5,
      //       size: 5
      //     }
      //   },
      //   {
      //     id: "1231",
      //     blockName: "志愿服务",
      //     fileList: [],
      //     valid: {
      //       limit: 5,
      //       size: 5
      //     }
      //   },
      //   {
      //     id: "1231",
      //     blockName: "公益劳动",
      //     fileList: [],
      //     valid: {
      //       limit: 5,
      //       size: 5
      //     }
      //   }
      // ]
    };
  },
  methods: {
    getFormComponents(formCom) {
      this.forms.push(formCom);
    }
  }
};
</script>

