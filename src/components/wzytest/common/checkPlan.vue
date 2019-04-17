<template>
  <div>
    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column v-for="(col,idx) in cols" :key="idx" :label="col.label" :prop="''+col.prop">
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'name'">
            <any-cell
              :cellInfo="col.cellInfo"
              v-model="scope.row[scope.column.property]"
              @getForm="getFormComponents"
            ></any-cell>
          </div>
          <div v-else>{{scope.row[scope.column.property]}}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- tableData:{{tableData}} -->
    <!-- <br>
    {{rows}}
    {{cols}} -->
  </div>
</template>

<script>
import anyCell from "./anyCell.vue";
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
    nUp: {
      type: Boolean
    }
  },
  components: { anyCell },
  data() {
    return {
      tableData: [
        { "1": "", "2": "", id: 1, name: "党团活动" },
        { "1": "", "2": "", id: 4, name: "社团活动" },
        { "1": "", "2": "", id: 7, name: "志愿服务" },
        { "1": "", "2": "", id: 8, name: "公益服务" }
      ],
      forms: []
    };
  },
  watch: {
    nUp(nv, ov) {
      this.tableData = [...this.rows];
    }
  },
  created() {
    
  },
  methods: {
    getFormComponents(formCom) {
      this.forms.push(formCom);
    }
  }
};
</script>

<style>
</style>
