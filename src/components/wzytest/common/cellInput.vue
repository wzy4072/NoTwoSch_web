<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" style="width:200px;">
    <el-form-item prop="val">
      <el-input v-model="ruleForm.val" :placeholder="cellInfo.pleaseholder" size="mini" ></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
let regInfo = {
  ch: {
    regStr: "\\u4e00-\\u9fa5",
    tip: "中文"
  },
  en: {
    regStr: "a-zA-Z",
    tip: "大小写字母"
  },
  no: {
    regStr: "0-9",
    tip: "数字"
  }
};

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
      // const reg = new RegExp(
      //   "^[" + this.cellInfo.contType.map(r => regInfo[r].regStr).join("") + "]+$"
      // );
      // const regTip = this.cellInfo.contType.map(r => regInfo[r].tip).join("或");
      // if (!reg.test(value)) {
      //   callback(new Error(`请输入${regTip}！`));
      // } else 
      if (value.length > this.cellInfo.maxLength) {
        callback(new Error(`长度不能超过${this.cellInfo.maxLength}！`));
      } else {
        callback();
      }
    }
  }
};
</script>

