<template>
    <div>
      <el-select v-model="skuSelectedObj" filterable remote clearable :size="size"
        :remote-method="searchSku" :loading="loading" value-key="value"
        placeholder="搜索" :disabled="readonly" :allow-create="allowCreate" default-first-option
        @input="propagateChange" @change="valueChange" ref="sel">
        <el-option v-for="item in skuOptions" :key="item.value" :label="item.code" :value="item">
          <span style="float: left">{{ item.code }} &nbsp;</span>
          <span style="float: right; color: #8492a6">{{ item.name }}</span>
        </el-option>
      </el-select>
      <el-dialog title="新增物料" :visible.sync="dialogFormVisible">
        <el-form :model="sku" ref="form">
          <el-form-item label="编码">
            <el-input v-model="sku.code" auto-complete="off" required></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="sku.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="净重">
            <input-weight v-model="sku.netWeight"></input-weight>
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="sku.salesUnit" placeholder="台,只，个 ...." auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import skuApi from "./api/sku";
export default {
  name: "SkuSelect",
  props: {
    value: Number,
    readonly: Boolean,
    allowCreate: { type: Boolean, default: true },
    size: String
  },
  data() {
    return {
      skuSelected: null,
      skuSelectedObj: null,
      loading: false,
      skuOptions: [],
      nomatchtext: null,
      sku: {},
      dialogFormVisible: false
    };
  },
  created() {
    this.skuSelected = this.value;
    this.initSkuObject();
  },
  watch: {
    value(val) {
      this.skuSelected = val;
      this.initSkuObject();
    }
  },
  methods: {
    valueChange(val) {
      // If no id to create an new sku
      if (val.length > 0 && !val.value) {
        this.sku.code = val;
        this.dialogFormVisible = true;
      }
    },
    cancel() {
      this.sku = {};
      this.dialogFormVisible = false;
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.sku.virtual = false;
          skuApi.save(this.sku).then(data => {
            if (data.success) {
              skuApi.getOption(null, data.result).then(data => {
                this.skuOptions = data;
                this.skuSelected = this.skuOptions[0];
                this.$emit("input", this.skuSelected.value);
                this.$emit("change", this.skuSelected);
              });
            } else {
              console.error(data);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.dialogFormVisible = false;
    },
    initSkuObject() {
      if (this.skuSelected) {
        this.searchSku(null, this.skuSelected).then(data => {
          if (data.length > 0) {
            this.skuSelectedObj = data[0];
          }
        });
      } else {
        this.skuOptions = [];
        this.skuSelectedObj = null;
      }
    },
    searchSku(q, id) {
      if ((id !== undefined && id !== null) || (q !== null && q !== "")) {
        this.loading = true;
        let _this = this;
        return skuApi.getOption(q, id).then(data => {
          _this.skuOptions = data;
          _this.loading = false;
          return data;
        });
      }
    },
    propagateChange(option) {
      if (option.value != null) {
        this.skuSelected = this.skuSelectedObj
          ? this.skuSelectedObj.value
          : null;
        this.$emit("input", this.skuSelected);
        this.$emit("change", this.skuSelectedObj);
      } else {
        console.debug(option);
      }
    },
    focus() {
      this.$refs["sel"].focus();
    }
  }
};
</script>
