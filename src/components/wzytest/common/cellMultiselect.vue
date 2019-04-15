<template>
  <div>
    <!-- <el-input v-model="val"  placeholder="请输入内容"  size="small"></el-input> -->
    <el-select v-model="val" multiple collapse-tags placeholder="请选择" @change="valChange">
      <el-option v-for="(item,idx) in options" :key="idx" :label="item" :value="item"></el-option>
    </el-select>
  </div>
</template>
<script>
function giVal(v) {
  const vType = Object.prototype.toString.call(v).slice(8, -1);
  if (vType === "Array") {
    return JSON.parse(JSON.stringify(v));
  }
  console.error("多选初始值格式错误！");
  return [];
}

export default {
  // type:multiselect
  props: {
    cellInfo: {
      type: Object,
      required: true
    },
    value: {
      type: [Array],
      required: true
    }
  },
  created() {
    this.val = giVal(this.value);
    if (this.cellInfo.options && this.cellInfo.options.length > 0) {
      this.options = this.cellInfo.options;
    }
  },
  watch: {
    value(nv, ov) {
      this.val = giVal(this.value);
    }
    // val(nv, ov) {
    //   this.$emit("change", this.val);
    // }
  },
  data() {
    return {
      val: [],
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

