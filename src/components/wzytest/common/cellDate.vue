<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" style="width:200px;">
    <el-form-item prop="val">
      <el-date-picker v-model="val" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
    </el-form-item>
  </el-form>
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
      type: [String],
      // type: [Date, Number, String],
      required: true
    }
  },
  created() {
    this.ruleForm.val = this.ruleForm.value;
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
      rules: {
        val: [{ required: true, message: "必填！" }]
      }
      // { validator: this.validate, trigger: "blur" }
    };
  },
  methods: {
    // valChange() {
    //   this.$emit("change", this.ruleForm.val);
    // },
    //   validate(rule, value, callback) {
    //   const reg = new RegExp(
    //     "^[" + this.cellInfo.contType.map(r => regInfo[r].regStr).join("") + "]+$"
    //   );
    //   const regTip = this.cellInfo.contType.map(r => regInfo[r].tip).join("或");
    //   // console.log(reg);
    //   if (!reg.test(value)) {
    //     callback(new Error(`请输入${regTip}！`));
    //   } else if (value.length > this.cellInfo.maxLength) {
    //     callback(new Error(`长度不能超过${this.cellInfo.maxLength}！`));
    //   } else {
    //     callback();
    //   }
    // }
  }
};
</script>

