<template>
  <div>
    <el-date-picker v-model="val" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
  </div>
</template>
<script>
export default {
  // type:date
  props: {
    cellInfo: {
      type: Object,
      required: true
    },
    value: {
      type: [ String],
      // type: [Date, Number, String],
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

