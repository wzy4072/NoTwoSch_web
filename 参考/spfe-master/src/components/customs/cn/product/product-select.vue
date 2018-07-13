<template>
    <span style="display: inline-block; width: 100%;">
        <div v-if="(clickEdit && !editing)">
            <a @click="editOn">{{working || "未设置"}}</a>
        </div>
        <div v-if="(clickEdit && editing) || !clickEdit">
            <el-select v-if="!display && dataReady" :disabled="disabled"
              filterable remote :remote-method="query" :loading="loading" :size="size" clearable
              value-key="hsCode" v-model="workingObj"
              @change="change" ref="sel" @blur="selectBlur" @focus="selectFocus" placeholder="商品编码">
              <el-option
                v-for="item in options"
                :key="item.hsCode"
                :label="item.hsCode"
                :value="item">
                <span style="float: left">{{ item.hsCode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
        </div>
        <span v-if="display && dataReady">{{value}}</span>
    </span>
</template>

<script>
import api from "./api/product";

export default {
  name: "ProductSelect",
  props: {
    type: String,
    value: String,
    display: Boolean,
    disabled: Boolean,
    clickEdit: Boolean,
    editMode: Boolean,
    size: String
  },
  data() {
    return {
      editing: this.editMode != null ? this.editMode : !this.clickEdit,
      workingObj: null,
      working: this.value,
      loading: false,
      options: [],
      dataReady: false
    };
  },
  methods: {
    editOn() {
      console.log("Change to editing...");
      this.editing = true;
      this.initSel();
      setTimeout(() => {
        this.$refs["sel"].focus();
      }, 500);
    },
    change(opt) {
      if (opt != null) {
        this.$emit("input", opt.hsCode);
        this.$emit("change", opt.hsCode);
        this.$emit("product", opt);
      } else {
        this.$emit("input", null);
        this.$emit("change", null);
        this.$emit("product", null);
      }
      this.editing = false;
    },
    displayLabel(code) {
      return code;
    },
    query(q) {
      if (q != null && q.length > 0) {
        this.loading = true;
        return api
          .query(q)
          .then(products => {
            this.options = products;
            this.loading = false;
            return products;
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err);
            throw err;
          });
      } else {
        return Promise.resolve(null);
      }
    },
    initSel() {
      if (
        this.working != null &&
        ((this.clickEdit && this.editing) || !this.clickEdit)
      ) {
        this.dataReady = false;
        return this.query(this.working).then(products => {
          this.workingObj = (products.length === 1) ? products[0] : null;
          this.dataReady = true;
        });
      } else {
        this.dataReady = true;
      }
    },
    selectBlur() {
      setTimeout(() => {
        this.editing = false;
        this.$emit("blur");
      }, 400);
    },
    selectFocus() {
      this.$emit("focus");
    }
  },
  watch: {
    value(val) {
      this.working = val;
      this.initSel();
    }
  },
  created() {
    this.initSel();
  }
};
</script>
