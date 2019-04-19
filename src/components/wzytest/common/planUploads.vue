<template>
  <div>
    <el-row v-for="(u,i) in list" :key="''+i" class="upload-row">
      <span>{{i + 1 }} .</span>
      <cell-upload :upInfo="u" :where="where"></cell-upload>
    </el-row>
  </div>
</template>
<script>
import CellUpload from "./cellUpload.vue";
export default {
  props: ["list", "where"],
  components: {
    CellUpload
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.upload-row {
  margin: 4px 0;
}
</style>

