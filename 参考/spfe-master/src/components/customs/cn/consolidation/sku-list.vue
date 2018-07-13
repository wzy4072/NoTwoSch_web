<template>
    <div>
        <div v-if="hscode == null || hscode == ''">
            <h3>请选择商品编码</h3>
        </div>
        <div v-if="hscode != null && hscode != ''">
            商品编码：{{hscode}}
            <el-transfer
              v-if="dataReady"
              filterable
              :filter-method="filterOption"
              filter-placeholder=""
              v-model="list"
              :button-texts="['解绑','关联']"
              :titles="['未关联SKU','已关联SKU']"
              :props="{ key: 'key', label: 'title' }"
              :data="localData"
              @change="handleChange">
            </el-transfer>
        </div>
    </div>
</template>

<script>
import api from "../classification/api/sku"; // customs perspective of SKU

export default {
  props: {
    hscode: String,
    value: Array // selected sku keys
  },
  data() {
    return {
      dataReady: false,
      query: null,
      list: this.value,
      localData: []
    };
  },
  watch: {
    hscode(val) {
      console.log("HSCode in SKULIST: " + val);
      this.loadData();
    },
    value(val) {
      this.list = val;
      this.localData = this.localData.map(d => {
        d.checked = this.list.indexOf(d.skuId) >= 0;
        return d;
      });
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    // display(item) {
    //   return item.title;
    // },
    filterOption(inputValue, option) {
      return option.description.indexOf(inputValue) > -1;
    },
    loadData() {
      this.dataReady = false;
      return api
        .list(this.hscode, null, null, null, null)
        .then(data => {
          this.localData = data.result.map(d => {
            // columns: [
            //     { title: "SKU编号", field: 'skuCode' },
            //     { title: "商品编码", field: 'hsCode' },
            //     { title: "商品名称", field: 'name' },
            //     { title: "商品要素", field: 'spec' },
            //     { title: "成交单位", field: 'salesUnit' },
            //     { title: "单价", field: 'unitPrice' },
            //     { title: "净重", field: 'netWeight' },
            //     { title: "毛重", field: 'grossWeight' },
            // ],
            return {
              key: d.skuId,
              title: d.skuCode + " (" + d.skuName + "): " + d.name,
              description:
                d.skuCode + " (" + d.skuName + "): " + d.name + " - " + d.spec
            };
          });
          this.dataReady = true;
          return data;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    handleChange(targetKeys, direction, moveKeys) {
      if (direction === "right") {
        this.list = this.list.concat(moveKeys);
      } else if (direction === "left") {
        for (var i in moveKeys) {
          var key = moveKeys[i];
          var idx = this.list.indexOf(key);
          this.list.splice(idx, 1);
        }
      }
      this.$emit("input", this.list);
    }
  }
};
</script>
