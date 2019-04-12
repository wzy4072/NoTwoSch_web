<template>
  <div>
    <el-input v-model="val" type="textarea"  placeholder="请输入内容" size="small"></el-input>
  </div>
</template>
<script>
export default {
  // type:text
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
  },
  watch: {
    value(nv, ov) {
      this.val = nv;
    },
    val(nv, ov) {
      this.$emit("change", this.val);
    }
  },
  data() {
    return {
      val: null
    };
  },
  methods: {
    // valChange() {
    //   this.$emit("change", this.val);
    // }
  }
};
</script>

