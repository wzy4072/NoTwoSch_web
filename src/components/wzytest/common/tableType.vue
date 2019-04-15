<template>
  <div>
    <el-select v-model="val" placeholder="请选择" @change="valChange" width="200">
      <el-option v-for="(item,idx) in options" :key="idx" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  // table类型
  props: {
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
    }
  },
  data() {
    return {
      val: null,
      options: [
        { name: "活动项目", id: 1 },
        { name: "先进个人荣誉", id: 2 },
        { name: "违规违纪", id: 3 },
        { name: "是否有犯罪", id: 4 }
      ]
    };
  },
  methods: {
    valChange() {
      this.$emit("input", this.val);
    }
  }
};
</script>

