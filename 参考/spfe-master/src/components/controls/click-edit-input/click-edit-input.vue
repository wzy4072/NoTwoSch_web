<template>
    <span :style="{display: 'inline-block', width: width}">
        <div v-if="(clickEdit && !mode)">
            <a @click="editOn">{{value || "未设置"}}</a>
        </div>
        <div v-if="(clickEdit && mode) || !clickEdit">
            <el-input v-model="working" :disabled="disabled" @input="change" @blur="editOff" ref="inputField" :size="size"></el-input>
        </div>
    </span>
</template>

<script>
export default {
  name: "ClickEditInput",
  props: {
    value: [String, Number, Object],
    clickEdit: Boolean,
    editMode: Boolean,
    disabled: Boolean,
    size: String,
    width: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      mode: this.editMode != null ? this.editMode : !this.clickEdit,
      working: this.value
    };
  },
  watch: {
    value(val) {
      this.working = val;
    }
  },
  methods: {
    editOn() {
      this.mode = true;
      this.$nextTick(() => {
        this.$refs["inputField"].$el.focus();
      });
    },
    editOff() {
      console.log("Turning off");
      this.mode = false;
    },
    change() {
      this.$emit("input", this.working);
      // this.dispatch("FormItem", "form.change", [this.working]);
    }
  }
};
</script>

<style>

</style>
