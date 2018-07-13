<template>
    <el-select :disabled="disabled" v-model="containerSelected" :data="containers" value-key="id" @change="containerChanged">
      <el-option v-for="item in containers" :key="item.id" :label="item.name" :value="item">
      </el-option>
    </el-select>
</template>
<script>
import api from "./api/container";
export default {
  name: "ContainerSelect",
  props: {
    value: { type: [Number, String] },
    extras: { type: [Array] },
    disabled: { type: Boolean, default: false }
  },
  data: function() {
    return {
      id: null,
      containerSelected: null,
      containers: []
    };
  },
  watch: {
    value(val) {
      this.id = val;
      this.initSelectedObj();
    }
  },
  created() {
    this.id = this.value;
    this.initSelectedObj();
  },
  methods: {
    initSelectedObj() {
      api.getAll().then(data => {
        if (Array.isArray(this.extras) > 0 && this.extras.length > 0) {
          this.containers = [
            { label: "选择", options: this.extras },
            { label: "新建", options: data }
          ];
        } else {
          this.containers = data;
        }
        var filtered = data.filter(cs => cs.id === this.id);
        this.containerSelected = filtered.length === 1 ? filtered[0] : null;
      });
    },
    containerChanged(option) {
      this.$emit(
        "input",
        this.containerSelected !== null ? this.containerSelected.id : null
      );
      this.$emit("change", option);
    }
  }
};
</script>
