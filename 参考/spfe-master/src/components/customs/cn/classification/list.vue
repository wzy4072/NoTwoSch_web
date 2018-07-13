<template>
    <div>
        <h2>中国关务 - SKU归类管理</h2>
        <!-- search -->
        <el-form :inline="true" :model="search" size="mini">
            <el-form-item :label="classified == 'false' ? '未归类':'已归类' ">
                <el-switch v-model="classified" @change="reload" active-value="true" inactive-value="false"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-input v-model="search.query" placeholder="搜索SKU"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="reload">搜索</el-button>
            </el-form-item>
        </el-form>
        <!-- table -->
        <el-table :data="consTable" v-loading="loading" border stripe style="width: 100%" size="mini">
            <el-table-column label="SKU编码" prop="skuCode" ></el-table-column>
            <el-table-column label="SKU名称" prop="skuName" ></el-table-column>
            <el-table-column label="SKU描述" prop="skuDescription" ></el-table-column>
            <el-table-column label="商品编码" prop="hsCode" ></el-table-column>
            <el-table-column label="商品名称" prop="name" ></el-table-column>
            <el-table-column label="商品要素" prop="spec" ></el-table-column>
            <el-table-column label="成交单位" prop="salesUnit" >
                <template slot-scope="scope">
                    <code-select type="unit" display v-model="scope.row.salesUnit"></code-select>
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="operations" >
                <template slot-scope="scope">
                    <el-button @click.native.prevent="$router.push('/customs/cn/classification/' + scope.row.skuId)" type="text" size="small" class="el-icon-edit">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table page -->
        <el-pagination @size-change="sizeChange" @current-change="pageChange"
          :current-page="pager.pageNo"
          :page-sizes="[50, 100, 500]"
          :page-size="pager.pageSize"
          :total="pager.total"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
import api from "./api/sku";

export default {
  name: "ClassificationList",
  data: function() {
    return {
      search: { query: null },
      classified: false,
      operations: [],
      consTable: [],
      loading: false,
      pager: {
        pageNo: 1,
        pageSize: 50,
        total: 1
      }
    };
  },
  methods: {
    sizeChange(size) {
      this.pager.pageSize = size;
      this.reload();
    },
    pageChange(page) {
      this.pager.pageNo = page;
      this.reload();
    },
    reload() {
      this.loading = true;
      this.loadData(this.pager)
        .then(data => {
          this.consTable = data.result;
          this.pager.total = data.totalCount;
          this.loading = false;
        })
        .catch(err => {
          this.$message("" + err);
          this.loading = false;
        });
    },
    loadData(pager) {
      return api.classificationList(
        this.search.query,
        this.classified,
        pager.pageNo,
        pager.pageSize,
        pager.sortColumns
      );
    }
  },
  created() {
    this.reload();
  }
};
</script>
