<template>
    <div>
        <h2>中国关务 - 手册管理</h2>
        <!-- search -->
        <el-form :inline="true" :model="search" size="mini">
          <el-form-item>
            <el-input v-model="search.query" placeholder="搜索手册"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reload" icon="search"><span>搜索</span></el-button>
            <el-button type="ghost" @click="$router.push('/customs/cn/registry/new')" icon="edit">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table :data="regTable" v-loading="loading" border stripe style="width: 100%" size="mini">
            <el-table-column label="手册备案号" prop="number"></el-table-column>
            <el-table-column label="进出口" prop="type"></el-table-column>
            <el-table-column label="经营单位编码" prop="businessEntity.code"></el-table-column>
            <el-table-column label="经营单位名称" prop="businessEntity.name"></el-table-column>
            <el-table-column label="收发货单位编码" prop="importExportEntity.code"></el-table-column>
            <el-table-column label="收发货单位名称" prop="importExportEntity.name"></el-table-column>
            <el-table-column label="合同号" prop="contractNumber"></el-table-column>
            <el-table-column label="贸易方式" prop="tradeMode"></el-table-column>
            <el-table-column label="征免性质" prop="levyNature"></el-table-column>
            <el-table-column label="国家" prop="country"></el-table-column>
            <el-table-column label="境内货源地" prop="origin"></el-table-column>
            <el-table-column label="操作" prop="operations">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="$router.push('/customs/cn/registry/' + scope.row.id)" type="text" icon="el-icon-edit" size="small">Edit</el-button>
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
import api from "./api/registry";

export default {
  name: "CustomsCnRegistryList",
  data: function() {
    return {
      search: { query: null },
      regTable: [],
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
    loadData(pager) {
      let q = this.search.query === "" ? null : this.search.query;
      return api.list(q, pager.pageNo, pager.pageSize, pager.sortColumns);
    },
    reload() {
      this.loading = true;
      this.loadData(this.pager)
        .then(data => {
          this.regTable = data.result;
          this.pager.total = data.totalCount;
          this.loading = false;
        })
        .catch(err => {
          this.$message("" + err);
          this.loading = false;
        });
    }
  },
  created() {
    this.reload();
  }
};
</script>
