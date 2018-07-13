<template>
    <div>
        <h2>容器管理</h2>
        <!-- search -->
         <el-form :inline="true" :model="search" size="mini">
          <el-form-item label="搜索">
            <el-input v-model="search.query" placeholder="搜索容器"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reload" icon="search"><span>搜索</span></el-button>
            <el-button type="ghost" @click="$router.push('/basic/container/new')" icon="edit">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table :data="containerTable" v-loading="loading" border stripe style="width: 100%" size="mini">
            <el-table-column label="名称" prop="name" ></el-table-column>
            <el-table-column label="测量体积"  prop="volume">
                <template slot-scope="scope">
                    <span v-if ="scope.row.volume != null ">{{scope.row.volume.length}} * {{scope.row.volume.width}} * {{scope.row.volume.height}} &nbsp;&nbsp;(L * W * H){{scope.row.volume.unit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="重量" prop="weight">
                <template slot-scope="scope">
                <span v-if ="scope.row.weight != null ">{{scope.row.weight.weight}} {{scope.row.weight.unit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="编号前缀" prop="seqPrefix" ></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button @click.native.prevent="$router.push('/basic/container/' + scope.row.id)" type="text" size="small" icon="el-icon-edit" >Edit</el-button>
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
import api from "./api/container";
export default {
  name: "ContainerList",
  data: function() {
    return {
      containerTypeId: null,
      search: { query: null },
      containerTable: [],
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
          this.containerTable = data.result;
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
