<template>
    <div>
      <el-input-number :disabled="disabled" :min="null" v-model="weight" :controls="false" @input="change"></el-input-number>
      <el-select :disabled="disabled" slot="append" v-model="unit" value-key="id" style="width:85px" @change="change">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
</template>

<script>
export default {
  name: "InputWeight",
  props: {
    value: Object,
    defaultUnit: { type: String, default: "KG" },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      weight: this.value ? this.value.weight : null,
      unit: this.value ? this.value.unit : null,
      options: [
        { id: "G", name: "克" },
        { id: "KG", name: "千克" },
        { id: "LB", name: "磅" },
        { id: "OZ", name: "盎司" }
      ]
    };
  },
  watch: {
    value(val) {
      if (val != null) {
        this.weight = val ? val.weight : null;
        this.unit = val ? val.unit : null;
        this.setDefaultIfNull();
      }
    }
  },
  created() {
    this.setDefaultIfNull();
  },
  methods: {
    change() {
      var val = {
        weight: this.weight,
        unit: this.unit
      };
      this.$emit("input", val);
      this.$emit("change", val);
    },
    setDefaultIfNull() {
      if (this.unit === null) {
        this.unit = this.defaultUnit;
      }
    }
  }
};
</script>
<style scoped>

</style>
