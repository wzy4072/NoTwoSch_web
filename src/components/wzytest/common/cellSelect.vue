<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" style="width:200px;">
      <el-form-item prop="val" :size="size">
        <el-select v-model="ruleForm.val" placeholder="请选择" @change="valChange">
          <el-option v-for="(item,idx) in options" :key="idx" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
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
    },
    size: {
      type: String
    }
  },
  created() {
    this.ruleForm.val = this.value;
    const opts =
      this.cellInfo.comboOption && this.cellInfo.comboOption.split(";");
    this.options = opts || [];
  },
  watch: {
    value(nv, ov) {
      this.ruleForm.val = nv;
    }
    // val(nv, ov) {
    //   this.$emit("change", this.val);
    // }
  },
  data() {
    return {
      ruleForm: {
        val: null
      },
      // val: null,
      rules: {
        val: [{ required: true, message: "必填！", trigger: "change" }]
      },
      // { validator: this.validate, trigger: "blur"}
      options: []
    };
  },
  methods: {
    valChange() {
      this.$emit("change", this.ruleForm.val);
    },
    validate(rule, value, callback) {
      if (!value) {
        callback(new Error("不能为空！"));
      } else {
        callback();
      }
    }
  }
};
</script>

