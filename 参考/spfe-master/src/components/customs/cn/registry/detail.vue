<template>
    <div>
        <el-table :data="working" border stripe style="width: 100%" size="mini">
            <el-table-column label="项号" prop="seqNo" width="80">
              <template slot-scope="scope">
                <click-edit-input :edit-mode="isEdit(scope.$index)" click-edit v-model="working[scope.$index].seqNo" @input="change"></click-edit-input>
              </template>
            </el-table-column>
            <el-table-column label="商品编码" prop="hsCode" width="160">
              <template slot-scope="scope">
                <product-select :edit-mode="isEdit(scope.$index)" click-edit v-model="working[scope.$index].hsCode" @product="changeHSCode(scope.$index, $event)"></product-select>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name">
              <template slot-scope="scope">
                <click-edit-input :edit-mode="isEdit(scope.$index)" click-edit v-model="working[scope.$index].name" @input="change"></click-edit-input>
              </template>
            </el-table-column>
            <el-table-column label="商品要素" prop="spec">
              <template slot-scope="scope">
                <element-value-edit :edit-mode="isEdit(scope.$index)" click-edit :hscode="working[scope.$index].hsCode" v-model="working[scope.$index].spec" @input="change"></element-value-edit>
              </template>
            </el-table-column>
            <el-table-column label="成交单位" prop="salesUnit" width="100">
              <template slot-scope="scope">
                <code-select :edit-mode="isEdit(scope.$index)" click-edit type="unit" v-model="working[scope.$index].salesUnit" @input="change"></code-select>
              </template>
            </el-table-column>
            <el-table-column label="法1单位" prop="unit1" width="100">
              <template slot-scope="scope">
                <code-select :edit-mode="isEdit(scope.$index)" click-edit type="unit" v-model="working[scope.$index].unit1" @input="change"></code-select>
              </template>
            </el-table-column>
            <el-table-column label="法2单位" prop="unit2" width="100">
              <template slot-scope="scope">
                <code-select :edit-mode="isEdit(scope.$index)" click-edit type="unit" v-model="working[scope.$index].unit2" @input="change"></code-select>
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="unitPrice">
              <template slot-scope="scope">
                <click-edit-input :edit-mode="isEdit(scope.$index)" click-edit v-model="working[scope.$index].unitPrice" @input="change"></click-edit-input>
              </template>
            </el-table-column>
            <el-table-column label="货币" prop="currency" width="130">
              <template slot-scope="scope">
                <code-select :edit-mode="isEdit(scope.$index)" click-edit type="currency" v-model="working[scope.$index].currency" @input="change"></code-select>
              </template>
            </el-table-column>
            <el-table-column label="国家" prop="country" width="130">
              <template slot-scope="scope">
                <code-select :edit-mode="isEdit(scope.$index)" click-edit type="country" v-model="working[scope.$index].country" @input="change"></code-select>
              </template>
            </el-table-column>
            <el-table-column label="征免" prop="levy"  width="120">
              <template slot-scope="scope">
                <code-select :edit-mode="isEdit(scope.$index)" click-edit type="levy" v-model="working[scope.$index].levy" @input="change"></code-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="seqNo" width="60">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click.prevent="removeDetail(scope.$index)"> - </el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" size="mini" @click.prevent="addDetail">增加</el-button>
    </div>
</template>

<script>
// import productSelect from "../components/product-select.vue";
// import elementValueEdit from "../components/element-value-edit.vue";

export default {
  props: {
    value: Array
  },
  data() {
    return {
      working: JSON.parse(JSON.stringify(this.value)),
      editMode: []
    };
  },
  methods: {

    isEdit(idx) {
      if (this.editMode[idx] == null) {
        return false;
      } else {
        return this.editMode[idx];
      }
    },
    addDetail() {
      this.working.push(this.newDetailRow());
      this.editMode[this.working.length - 1] = true;
      this.$emit("input", this.working);
    },
    removeDetail(idx) {
      this.working.splice(idx, 1);
      this.editMode.splice(idx, 1);
      this.$emit("input", this.working);
    },
    newDetailRow() {
      return {
        seqNo: null,
        hsCode: null,
        name: null,
        spec: null,
        salesUnit: null,
        unit1: null,
        unit2: null,
        unitPrice: null,
        currency: null,
        country: null,
        levy: "3"
      };
    },
    changeHSCode(idx, product) {
      if (product != null) {
        var orig = this.working[idx];
        if (orig.name == null) {
          orig.name = product.name;
        }
        orig.unit1 = product.unit1;
        orig.unit2 = product.unit2;
        this.$set(this.working, idx, orig);
        this.$emit("input", this.working);
      }
    },
    change() {
      this.$emit("input", this.working);
    }
  }
};
</script>
