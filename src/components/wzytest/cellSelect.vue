<template>
  <div>
    <!-- <el-input v-model="val"  placeholder="请输入内容"  size="small"></el-input> -->
    <el-select v-model="val" placeholder="请选择" @change="valChange">
      <el-option v-for="(item,idx) in options" :key="idx" :label="item" :value="item"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  // type:selected
  props: {
    cellInfo: {
      type: Object,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    }
  },
  created() {
    this.val = this.value;
    if (this.cellInfo.options && this.cellInfo.options.length > 0) {
      this.options = this.cellInfo.options;
    }
  },
  watch: {
    value(nv, ov) {
      this.val = nv;
    }
    // val(nv, ov) {
    //   this.$emit("change", this.val);
    // }
  },
  data() {
    return {
      val: null,
      options: []
    };
  },
  methods: {
    valChange() {
      this.$emit("change", this.val);
    }
  }
};
</script>

