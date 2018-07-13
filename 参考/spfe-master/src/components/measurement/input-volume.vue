<template>
    <div>
      <el-input-number :disabled="disabled" :min="null" v-model="length" :controls="false" @input="change"></el-input-number>
      <el-input-number :disabled="disabled" :min="null" v-model="width" :controls="false" @input="change"></el-input-number>
      <el-input-number :disabled="disabled" :min="null" v-model="height" :controls="false" @input="change"></el-input-number>
      <el-select :disabled="disabled" v-model="unit" value-key="id" @change="change" style="width:85px">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <span v-if="showTitle">
          (L * W * H)
      </span>
    </div>
</template>

<script>
export default {
  name: "InputVolume",
  props: {
    showTitle: Boolean,
    value: Object,
    defaultUnit: { type: String, default: "CM" },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      length: this.value ? this.value.length : null,
      width: this.value ? this.value.width : null,
      height: this.value ? this.value.height : null,
      unit: this.value ? this.value.unit : null,
      options: [
        { id: "CM", name: "厘米" },
        { id: "M", name: "米" },
        { id: "FT", name: "英尺" },
        { id: "IN", name: "英寸" }
      ]
    };
  },
  watch: {
    value(val) {
      if (val != null) {
        this.length = val ? val.length : null;
        this.width = val ? val.width : null;
        this.height = val ? val.height : null;
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
        length: this.length,
        width: this.width,
        height: this.height,
        unit: this.unit
      };
      this.$emit("input", val);
      this.$emit("change", val);
    },
    setDefaultIfNull() {
      if (this.unit === null && this.defaultUnit) {
        this.unit = this.defaultUnit;
      }
    }
  }
};
</script>
