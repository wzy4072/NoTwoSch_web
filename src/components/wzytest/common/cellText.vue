<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0">
    <el-form-item prop="val">
      <el-input
        v-model="ruleForm.val"
        type="textarea"
        :placeholder="cellInfo.pleaseholder"
        size="small"
      ></el-input>
    </el-form-item>
  </el-form>
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
    this.ruleForm.val = this.value;
  },
  watch: {
    value(nv, ov) {
      this.ruleForm.val = this.value;
    },
    val(nv, ov) {
      this.$emit("change", this.ruleForm.val);
    }
  },
  data() {
    return {
      ruleForm: {
        val: null
      },
      rules: {
        val: [
          {
            validator: this.validate,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    validate(rule, value, callback) {
      if (value.length === 0) {
        callback(new Error("必填"));
      } else if (value.length > this.cellInfo.maxLength) {
        callback(new Error(`长度不能超过${this.cellInfo.maxLength}！`));
      } else {
        callback();
      }
    }
  }
};
</script>

