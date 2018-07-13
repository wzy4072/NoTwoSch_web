<template>
  <div>
    <el-form ref="goodsSearchForm" :inline="true" size="mini">
      <el-form-item label="货物搜索">
        <el-input v-model="goodsQuery" placeholder="货物搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchGoods">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="goodsSearchResult" style="width: 100%" @selection-change="handleGoodsSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="code" label="货物识别号">
      </el-table-column>
      <el-table-column prop="comment" label="货物描述">
      </el-table-column>
    </el-table>
    <div style="padding-top: 20px">
      <el-button type="primary" size="mini" @click="selectDone">确定</el-button>
    </div>
  </div>
</template>

<script>
import api from "./api/goods";

export default {
  name: "GoodsSelect",
  props: {
    value: Array
  },
  data() {
    return {
      goodsQuery: null,
      goodsSearchResult: [],
      goodsSelected: this.value
    };
  },
  watch: {
    value(val) {
      this.goodsSelected = val;
      if (
        val &&
        val.length > 0 &&
        this.goodsSearchResult.filter(r => val.indexOf(r.id) >= 0).length <
          val.length
      ) {
        // search for init data
        this.searchGoodsById(val);
      }
    }
  },
  methods: {
    searchGoods() {
      api.search(this.goodsQuery).then(d => {
        this.goodsSearchResult = d.result;
      });
    },
    searchGoodsById(goodsId) {
      api.search(null, goodsId).then(d => {
        console.log(d);
        this.goodsSearchResult = d.result;
      });
    },
    handleGoodsSelectionChange(sel) {
      this.goodsSelected = sel.map(g => g.id);
    },
    selectDone() {
      this.$emit("input", this.goodsSelected);
      this.$emit("change", this.goodsSelected);
    }
  },
  created() {
    this.searchGoodsById(this.goodsSelected);
  }
};
</script>
