<template>
  <hot-table ref="hot"
    :root="root"
    :settings="settings">
  </hot-table>
</template>

<script>
import HotTable from "@handsontable/vue";
export default {
  components: {
    HotTable
  },
  props: {
    root: String,
    settings: Object
  },
  data() {
    return {
      table: Object
    };
  },
  mounted() {
    // table obtained after child mounted event
    this.table = this.$refs.hot.table;
    this.$emit("table", this.table);
  }
};
</script>
<style>
@import "handsontable/dist/handsontable.full.css";
</style>
