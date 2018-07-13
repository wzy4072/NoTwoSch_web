<template>
    <div>
        <h2>{{id ? '修改ASN' : '新增ASN'}}</h2>
        <el-form ref="asnForm" :model="asn" :rules="asnRules" label-width="100px" size="mini">
          <el-form-item label="接收仓库">
            <el-input v-model="asn.warehouse" placeholder="接收仓库"></el-input>
          </el-form-item>
          <el-form-item label="计划到仓日期">
            <el-date-picker v-model="asn.expectedDateOfArrival" type="date" placeholder="计划到仓日期"></el-date-picker>
          </el-form-item>
        </el-form>
        <el-tabs v-model="tab" type="border-card">
          <el-tab-pane label="选择货物" name="goods">
            <goods-select v-model="goodsSelected" @change="goodsConfirmed"></goods-select>
          </el-tab-pane>
          <el-tab-pane label="货物清单" name="manifest">
            <manifest v-model="manifest" :locked="true"></manifest>
          </el-tab-pane>
          <el-tab-pane label="装箱信息" name="packingList">
            <packing-list :editable="false" v-model="packingList"></packing-list>
          </el-tab-pane>
          <el-tab-pane label="报关信息" name="declaration">
            <goods-declaration-edit :manifest="manifest"></goods-declaration-edit>
          </el-tab-pane>
        </el-tabs>
        <br>
        <el-button type="primary" @click="saveAsn">保存asn</el-button>
    </div>
</template>

<script>
import goodsApi from "@/components/goods/api/goods";
import asnApi from "./api/asn";
export default {
  name: "AsnEdit",
  props: {
    id: [String, Number],
    goodsids: String // comma-separated string of goods IDs
  },
  data: function() {
    return {
      tab: "goods",
      asn: {
        warehouse: null,
        expectedDateOfArrival: null
      },
      asnRules: {},
      goodsSelected: ["init-good-id"],
      lockedGoods: [],
      manifest: [],
      packingList: [],
      declaration: []
    };
  },
  created() {
    if (this.id) {
      asnApi
        .getAsn(this.id)
        .then(data => {
          if (data) {
            this.goodsSelected = data.goodsIds;
            this.goodsConfirmed();
            this.asn.warehouse = data.warehouseCode;
            this.asn.expectedDateOfArrival = data.timeToWarehouse;
          }
        })
        .catch(err => {
          this.$message(err);
        });
    }
    if (this.goodsids) {
      this.goodsSelected = this.goodsids.split(",");
      this.goodsConfirmed();
    }
  },
  methods: {
    saveAsn() {
      var data = {
        warehouseCode: this.asn.warehouse,
        timeToWarehouse: this.asn.expectedDateOfArrival,
        goodsIds: this.goodsSelected,
        declarations: null
      };
      asnApi
        .saveAsn(data, this.id)
        .then(data => {
          if (data.success) {
            this.$message("保存成功！");
            this.$router.push("/asn");
          } else {
            this.$message(data.message);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    goodsConfirmed() {
      if (this.$route.fullPath === "/asn/new") {
        this.$router.push("/asn/new/" + this.goodsSelected.join(","));
      }
      let loadGoodsPromises = this.goodsSelected.map(goodsId => {
        return goodsApi.load(goodsId);
      });
      Promise.all(loadGoodsPromises).then(data => {
        this.lockedGoods = data;
        this.manifest = [];
        this.packingList = [];
        this.lockedGoods.forEach(gd => {
          this.manifest = this.manifest.concat(gd.manifest.lines);
          this.packingList = this.packingList.concat(gd.packingList.items);
        });
      });
      this.tab = "manifest";
    }
  }
};
</script>
