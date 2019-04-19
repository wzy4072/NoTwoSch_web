<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" style="width:200px;">
    <el-form-item prop="val">
      <el-input v-model="ruleForm.val" :placeholder="cellInfo.pleaseholder" size="mini"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  // type:input
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
      this.ruleForm.val = nv;
    },
    "ruleForm.val"(nv, ov) {
      this.$emit("change", this.ruleForm.val);
      if (this.$refs.ruleForm) {
        this.$emit("getForm", this.$refs.ruleForm);
      }
    }
  },
  data() {
    return {
      ruleForm: {
        val: null
      },
      // val: null,
      rules: {
        val: [
          { required: true, message: "必填！" },
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
      if (!/^[0-9]+$/.test(value)) {
        callback(new Error('请输入数字!'));
      } else {
        callback();
      }
    }
  }
};
</script>

