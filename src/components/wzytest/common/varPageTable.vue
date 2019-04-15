<template>
  <div>
    <el-table :data="rows" style="width: 100%" size="small" ref="topTable">
      <el-table-column
        v-for="(col,idx) in columns"
        :key="idx"
        :label="col.colName"
        :prop="''+col.colId"
      >
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'undefined'">
            <!-- {{scope.row[scope.column.property]}} -->
            <any-cell
              :cellInfo="scope.row['info'+scope.column.property]"
              v-model="scope.row[scope.column.property]"
              @getForm="getFormComponents"
            ></any-cell>
          </div>
          <div v-else>{{scope.row.rowName}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import anyCell from "./anyCell.vue";

export default {
  props: ["rows", "columns"],
  components: { anyCell },
  data() {
    return {
      forms: []
    };
  },
  methods: {
    getFormComponents(formCom) {
      this.forms.push(formCom);
    }
  }
};
</script>

