<template>
    <div>
        <h2>容器和包装方式</h2>
        <!-- search -->
         <el-form :inline="true" :model="search" size="mini">
            <el-form-item label="">
                <el-input v-model="search.query" placeholder="搜索容器名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="reload">搜索</el-button>
            </el-form-item>
        </el-form>
        <!-- table -->
         <el-table :data="packingTable" v-loading="loading" border stripe style="width: 100%" size="mini">
            <el-table-column label="容器名称" prop="name" ></el-table-column>
            <el-table-column label="包装方式 (点击修改)" prop="code">
                <template slot-scope="scope">
                    <code-select click-edit type="packing" v-model="scope.row.code" size="sm" @input="submitCode(scope.row.id, $event)"></code-select>
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
import api from "./api/packing-container";

export default {
  name: "ContainerList",
  data() {
    return {
      search: { query: null },
      packingTable: [],
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
          this.packingTable = data.result;
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
    },
    submitCode(id, code) {
      if (code !== "") {
        console.log("Saving container: " + id + " code: " + code);
        api.save(id, code);
      } else {
        console.log("Removing container code: " + id);
        api.remove(id);
      }
    }
  },
  created() {
    this.reload();
  }
};
</script>
