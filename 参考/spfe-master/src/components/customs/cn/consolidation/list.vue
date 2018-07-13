<template>
    <div>
        <h2>中国关务 - 归并关系管理</h2>
        <!-- search -->
         <el-form :inline="true" :model="search" size="mini">
            <el-form-item label="">
                <el-input v-model="search.query" placeholder="搜索归并关系"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="reload">搜索</el-button>
                <el-button type="primary" @click="$router.push('/customs/cn/consolidation/new')">新建</el-button>
            </el-form-item>
        </el-form>
        <!-- table -->
         <el-table :data="consTable" v-loading="loading" border stripe style="width: 100%" size="mini">
            <el-table-column label="商品编码" prop="hsCode" ></el-table-column>
            <el-table-column label="商品名称" prop="name" ></el-table-column>
            <el-table-column label="商品要素" prop="spec" ></el-table-column>
            <el-table-column label="成交单位" prop="salesUnit" ></el-table-column>
            <el-table-column label="手册备案号" prop="registry.number">
                <template slot-scope="scope">
                    <span v-if="scope.row.registry != null" v-html="scope.row.registry.number"></span>
                </template>
            </el-table-column>
            <el-table-column label="项号" prop="registry.seqNo">
                <template slot-scope="scope">
                    <span v-if="scope.row.registry != null" v-html="scope.row.registry.seqNo"></span>
                </template>
            </el-table-column>
            <el-table-column label="项号" prop="operations">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="$router.push('/customs/cn/consolidation/' + scope.row.id)" type="text" size="small" class="el-icon-edit">Edit</el-button>
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
import api from "./api/consolidation";

export default {
  name: "ConsolidationList",
  data: function() {
    return {
      search: { query: null },
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
      return api.list(
        this.search.query,
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
