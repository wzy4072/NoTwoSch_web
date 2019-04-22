<template>
  <div>
    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column v-for="(col,idx) in cols" :key="idx" :label="col.label" :prop="''+col.prop">
        <template slot-scope="scope">
          <div v-if="scope.column.property !== 'name'">{{scope.row[scope.column.property]}}</div>
          <div v-else>{{scope.row[scope.column.property]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" prop="status">
        <template slot-scope="scope">
          <div>草稿？？？</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
    // rows 初始为[],请求回来整理完毕后更新这里，通知更新
    inited: {
      type: Boolean
    }
  },
  data() {
    return {
      tableData: [...this.rows],
      forms: []
    };
  },
  watch: {
    inited(nv, ov) {
      this.tableData = [...this.rows];
    }
  },
  created() {},
  methods: {}
};
</script>

<style>
</style>
