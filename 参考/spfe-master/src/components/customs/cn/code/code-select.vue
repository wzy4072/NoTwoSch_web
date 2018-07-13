<template>
    <span :style="{display: 'inline-block', width: width}">
        <div v-if="!display && (clickEdit && !editing)">
            <a @click="editOn">{{displayLabel(working) || "未设置"}}</a>
        </div>
        <div v-if="!display && (clickEdit && editing) || !clickEdit">
            <el-select v-if="!display && dataReady" :disabled="disabled" clearable
              filterable :data="options" value-key="code" v-model="workingObj"
              @input="change" @focus="selectFocus" @blur="selectBlur" :size="size" ref="sel" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.display"
                :value="item">
                <span style="float: left; width: 50px">{{ item.code }}</span>
                <span style="color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
        </div>
        <span v-if="display && dataReady">{{displayLabel(value)}}</span>
    </span>
</template>

<script>
import shared from "./shared";
import codetable from "./api/codetable";

export default {
  name: "CodeSelect",
  props: {
    type: String,
    value: [String, Object, Array],
    display: Boolean,
    disabled: Boolean,
    clickEdit: Boolean,
    editMode: Boolean,
    size: String,
    width: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      editing: this.editMode != null ? this.editMode : !this.clickEdit,
      working: this.value,
      workingObj: null,
      options: [],
      dataReady: false
    };
  },
  methods: {
    editOn() {
      console.log("Change to editing...");
      this.editing = true;
      setTimeout(() => {
        this.$refs["sel"].focus();
      }, 100);
    },
    change() {
      this.working = this.workingObj ? this.workingObj.code : null;
      this.$emit("input", this.working);
      this.editing = false;
    },
    displayLabel(code) {
      var op = this.options.filter(cn => cn.code === code);
      if (op.length === 0) {
        return null;
      } else {
        return op[0].display;
      }
    },
    selectFocus() {
      this.$emit("focus");
    },
    selectBlur() {
      // waiting for input event to come (if any)
      setTimeout(() => {
        this.editing = false;
        this.$emit("blur");
      }, 400);
    },
    initWorkingObj() {
      var a = this.options.filter(cn => cn.code === this.working);
      this.workingObj = a.length > 0 ? a[0] : null;
    }
  },
  watch: {
    value(val) {
      this.working = val;
      this.initWorkingObj();
    }
  },
  created() {
    shared.Setup(
      this.type,
      data => {
        this.options = data;
        this.dataReady = true;
        this.initWorkingObj();
      },
      () => {
        codetable
          .codeList(this.type)
          .then(data => {
            var options = data.map(d => {
              d.display = d.code + "/" + d.name;
              return d;
            });
            shared.SetupDone(this.type, options);
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    );
  }
};
</script>
