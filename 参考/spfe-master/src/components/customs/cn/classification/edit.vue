<template>
    <div v-if="dataReady">
        <h2>SKU归类</h2>
        <el-form ref="form" :model="data" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="SKU编号" prop="skuCode">
            <el-input v-model="data.skuCode" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="SKU名称" prop="skuName">
            <el-input v-model="data.skuName" :disabled="true"></el-input>
            <el-button size="mini" @click="openIntelligentDialog">智能归类</el-button>
          </el-form-item>
          <el-form-item label="商品编码" prop="hsCode">
                <product-select v-model="data.hsCode" @product="changeHSCode($event)"></product-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item label="申报要素" prop="spec">
                <element-value-edit :disabled="disableSpec" :hscode="data.hsCode" v-model="data.spec"></element-value-edit>
          </el-form-item>
          <el-form-item label="成交单位" prop="salesUnit">
                <code-select type="unit" v-model="data.salesUnit"></code-select>
          </el-form-item>
          <el-form-item v-if="data.unit1 != null && data.unit1 != ''" label="法1单位">
                <code-select type="unit" display v-model="data.unit1"></code-select>
          </el-form-item>
          <el-form-item  v-if="data.unit2 != null && data.unit2 != ''" label="法2单位" >
                <code-select type="unit" display v-model="data.unit2"></code-select>
          </el-form-item>
          <el-form-item label="单价" prop="unitPrice">
            <el-input v-model="data.unitPrice"></el-input>
          </el-form-item>
          <el-form-item label="币种" prop="currency">
                <code-select type="currency" v-model="data.currency"></code-select>
          </el-form-item>
          <el-form-item label="监管条件"  v-if="data.control != null && data.control != ''" >
            <el-tag v-for="(ctl, seq) in controlDetails" :key="seq" type="danger"> {{ ctl }} </el-tag>
                ({{data.control}})
          </el-form-item>

          <el-form-item label="" prop="">
            <el-button @click.prevent="save">保存</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="智能归类" :visible.sync="intClsDialogVisible">
          <intelligent-classification :initKeyword="intClsKeyword" @getHSCode="getHSCode"></intelligent-classification>
        </el-dialog>
    </div>
</template>

<script>
import api from "./api/sku";
import codeApi from "../code/api/codetable";

export default {
  name: "ClassificationEdit",
  props: {
    id: String // SKU ID
  },
  data() {
    return {
      allDocs: [],
      data: {},
      dataReady: false,
      rules: {
        name: [{ required: true, message: "请输入商品名称" }],
        hsCode: [{ required: true, message: "请输入商品编码" }],
        spec: [{ required: true, message: "请输入申报要素" }],
        salesUnit: [{ required: true, message: "请输入成交单位" }],
        unitPrice: [{ required: true, message: "请输入单价" }],
        currency: [{ required: true, message: "请输入币种" }]
      },
      intClsKeyword: null,
      intClsDialogVisible: false
    };
  },
  computed: {
    disableSpec() {
      return this.data.hsCode === null || this.data.hsCode.length === 0;
    },
    controlDetails() {
      return this.lookupControl(this.data.control);
    }
  },
  methods: {
    changeHSCode(product) {
      if (this.data.name === null || this.data.name === "") {
        this.data.name = product.name;
      }
      this.data.salesUnit = product.unit1;
      this.data.unit1 = product.unit1; // display only
      this.data.unit2 = product.unit2; // display only
      this.data.control = product.control; // display only
    },
    getHSCode(info) {
      this.intClsDialogVisible = false;
      this.data.hsCode = info.hsCode;
      this.data.spec = info.spec;
      this.data.name = info.name;
    },
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          api
            .save(this.id, this.data)
            .then(data => {
              this.$router.push("/customs/cn/classification");
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    lookupControl(control) {
      var t = [];
      for (var i = 0, len = control.length; i < len; i++) {
        var a = control.charAt(i);
        var txt = this.allDocs.filter(c => c.code === a).map(c => c.name);
        if (txt.length > 0) {
          t.push(txt[0]);
        }
      }
      return t;
    },
    openIntelligentDialog() {
      this.intClsKeyword = this.data.skuName;
      this.intClsDialogVisible = true;
    }
  },
  created() {
    Promise.all([
      api.load(this.id).then(data => {
        this.data = data;
        this.dataReady = true;
      }),
      codeApi.codeList("control").then(docs => {
        this.allDocs = docs;
      })
    ]).catch(err => {
      this.$message.error(err);
    });
  }
};
</script>
