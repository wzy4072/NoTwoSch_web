<template>
    <div v-if="dataReady">
        <h2>{{ id != null ? '编辑归并规则' : '新建归并规则'}}</h2>
        <el-form ref="consolidationForm" :model="consolidation" :rules="rules" label-width="100px" size="mini">
            <el-tabs v-model="tabName" >

                <el-tab-pane label="归并目标值" name="1">
                  <el-form-item label="手册备案号(如适用)" prop="registry">
                          <registry-item-select v-model="consolidation.registry" :hscode="consolidation.hsCode" @registry-item="registryItemChange"></registry-item-select>
                  </el-form-item>
                  <el-form-item label="商品编码" prop="hsCode">
                        <product-select :disabled="regItemLock" v-model="consolidation.hsCode" @product="changeHSCode($event)"></product-select>
                  </el-form-item>
                  <el-form-item label="商品名称" prop="name">
                    <el-input :disabled="regItemLock" v-model="consolidation.name"></el-input>
                  </el-form-item>
                  <el-form-item label="申报要素" prop="spec">
                    <element-value-edit :disabled="regItemLock" :hscode="consolidation.hsCode" v-model="consolidation.spec"></element-value-edit>
                  </el-form-item>
                  <el-form-item label="成交单位" prop="salesUnit">
                      <code-select :disabled="regItemLock" type="unit" v-model="consolidation.salesUnit"></code-select>
                  </el-form-item>
                  <el-form-item label="备注" prop="remarks">
                      <el-input v-model="consolidation.remarks" placeholder="简短识别说明"></el-input>
                  </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="关联SKU" name="2">
                  <sku-list :hscode="consolidation.hsCode" v-model="consolidation.skuIds"></sku-list>
                </el-tab-pane>

            </el-tabs>
             <el-form-item label="" prop="">
              <el-button type="primary" @click.prevent="save">保存</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from "./api/consolidation";
import skuList from "./sku-list.vue";

export default {
  name: "ConsolidationEdit",
  components: {
    skuList
  },
  props: {
    id: String
  },
  data() {
    return {
      tabName: "1",
      consolidation: {
        hsCode: null,
        name: null,
        spec: null,
        salesUnit: null,
        remarks: null,
        registry: {},
        skuIds: []
      },
      dataReady: false,
      regItemLock: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      rules: {}
    };
  },
  created() {
    if (this.id != null) {
      api.load(this.id).then(data => {
        this.consolidation = data;
        this.lockRegItem();
        this.dataReady = true;
      });
    } else {
      this.dataReady = true;
    }
  },
  methods: {
    filterSKU(val, option) {
      return option.sku === val;
    },
    skuChanged(targetKeys, direction, moveKeys) {
      console.log(targetKeys + ", " + direction + ", " + moveKeys);
    },
    renderSKU(item) {
      return item.name;
    },
    save() {
      api
        .save(this.id, this.consolidation)
        .then(() => {
          this.$router.push("/customs/cn/consolidation");
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    cancel() {
      this.$router.push("/customs/cn/consolidation");
    },
    changeHSCode(product) {
      if (
        this.consolidation.name === undefined ||
        this.consolidation.name === null ||
        this.consolidation.name === ""
      ) {
        this.consolidation.name = product.name;
      }
    },
    lockRegItem() {
      if (this.consolidation.registry != null) {
        this.regItemLock = true;
      } else {
        this.regItemLock = false;
      }
    },
    registryItemChange(regItem) {
      if (regItem != null) {
        this.consolidation.hsCode = regItem.hsCode;
        this.consolidation.name = regItem.name;
        this.consolidation.spec = regItem.spec;
        this.consolidation.salesUnit = regItem.salesUnit;
        this.regItemLock = true;
      } else {
        this.regItemLock = false;
      }
    }
  }
};
</script>
