<template>
    <span style="display: inline-block; width: 100%;">
        <div v-if="!hscode">
            请设置商品编码
        </div>
        <div v-if="hscode && (clickEdit && !mode)">
            <a @click="editOn">{{editing || "未设置"}}</a>
        </div>
        <div v-if="hscode && ((clickEdit && mode) || !clickEdit)">
            <el-input :disabled="disabled" @focus="showModal" v-model="editing" @mousedown="$event.preventDefault()" placeholder="申报要素" :size="size"></el-input>
        </div>
        <el-dialog title="编辑要素值" :visible.sync="show">
          <el-table :data="product.elements" border stripe style="width: 100%" size="mini" :show-header="false">
            <el-table-column prop="key" width="250">
              <template slot-scope="scope">
                  {{product.elements[scope.$index].key}} <span v-if="product.elements[scope.$index].key != '其他'" style="color: red">*</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                  <div v-if="product.elements[scope.$index].key == '品牌类型'">
                    <el-select v-model="working[scope.$index]" size="mini" style="width: 100%">
                      <el-option label="0-无品牌" value="0"></el-option>
                      <el-option label="1-境内自主品牌" value="1"></el-option>
                      <el-option label="2-境内收购品牌" value="2"></el-option>
                      <el-option label="3-境外品牌(贴牌生产)" value="3"></el-option>
                      <el-option label="4-境外品牌(其他)" value="4"></el-option>
                    </el-select>
                  </div>
                  <div v-else-if="product.elements[scope.$index].key == '出口享惠情况'">
                    <el-select v-model="working[scope.$index]" size="mini" style="width: 100%">
                      <el-option label="0-出口货物在最终目的国不享惠" value="0"></el-option>
                      <el-option label="1-出口货物在最终目的国享受优惠关税" value="1"></el-option>
                      <el-option label="2-生产销售单位尚未确定货物享惠情况" value="2"></el-option>
                      <el-option label="3-不适用于进口报关单" value="3"></el-option>
                    </el-select>
                  </div>
                  <div v-else>
                    <el-input v-model="working[scope.$index]" size="mini"></el-input>
                  </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding-top: 20px">
            <el-button @click="editCancel">取 消</el-button>
            <el-button type="primary" @click="editDone">确 定</el-button>
          </div>
      </el-dialog>
    </span>
</template>

<script>
import api from "./api/product";

export default {
  name: "ElementValueEdit",
  props: {
    hscode: String,
    value: String,
    disabled: Boolean,
    clickEdit: Boolean,
    editMode: Boolean,
    size: String
  },
  data() {
    return {
      mode: this.editMode != null ? this.editMode : !this.clickEdit,
      editing: null,
      working: [],
      show: false,
      elementsReady: false,
      product: {}
    };
  },
  watch: {
    hscode() {
      this.initElements();
    },
    value(val) {
      this.valueChanged(val);
    }
  },
  computed: {
    allValuesPresent() {
      if (this.elementsReady) {
        for (var i = 0; i < this.product.elements.length; i++) {
          if (this.working[i] === undefined || this.working[i] === null || this.working[i].trim() === "") {
            if (this.product.elements[i].key !== "其他") {
              return false;
            }
          }
        }
        return true;
      }
      return false;
    }
  },
  methods: {
    editOn() {
      console.log("Change to editing...");
      this.mode = true;
      this.initElements();
      this.showModal();
    },
    showModal() {
      this.show = true;
    },
    editDone() {
      console.log("All Values Present? " + this.allValuesPresent);
      if (this.allValuesPresent) {
        this.editing = this.working.join("|");
        this.show = false;
        this.mode = false;
        this.$emit("input", this.editing);
      } else {
        this.$message.error("请输入所有非【其他】的要素");
      }
    },
    editCancel() {
      this.valueChanged(this.editing);
      this.show = false;
      this.mode = false;
    },
    initElements() {
      if (this.hscode != null) {
        if ((this.clickEdit && this.mode) || !this.clickEdit) {
          this.elementsReady = false;
          return api.load(this.hscode).then(product => {
            this.product = product;
            this.elementsReady = true;
            // adjust working array to the element size
            this.product.elements.forEach((x, idx) => {
              if (this.working.length <= idx) {
                this.working.push(null);
              }
            });
            this.working = this.working.slice(0, this.product.elements.length);
            return product;
          });
        }
      }
    },
    valueChanged(val) {
      if (val != null) {
        this.working = val.split("|");
        this.editing = val;
      } else {
        this.working = [];
        this.editing = null;
      }
    }
  },
  created() {
    this.initElements();
    this.valueChanged(this.value);
  }
};
</script>
