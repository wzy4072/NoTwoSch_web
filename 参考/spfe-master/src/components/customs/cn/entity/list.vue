<template>
    <div>
        <h2>中国关务 - 收发货人管理</h2>
        <!-- search -->
        <el-form :inline="true" :model="search" size="mini">
          <el-form-item >
            <el-input v-model="search.query" placeholder="搜索实体"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reload" icon="search"><span>搜索</span></el-button>
            <el-button type="ghost" @click="$router.push('/customs/cn/entity/new')" icon="edit">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table ref="entTable" :data="entData" v-loading="loading" border stripe style="width:100%" size="mini">
            <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
            <el-table-column label="编码" prop="code" ></el-table-column>
            <el-table-column label="统一社会信用代码" prop="unifiedCode" ></el-table-column>
            <el-table-column label="名称" prop="name" ></el-table-column>
            <el-table-column label="通关期限" prop="validUntil">
                <template slot-scope="scope"><span>{{epochToString(scope.row.validUntil)}}</span></template>
            </el-table-column>
            <el-table-column label="操作" prop="operations">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="$router.push('/customs/cn/entity/' + scope.row.id)" type="text" size="small" icon="el-icon-edit" >Edit</el-button>
                </template>
            </el-table-column>
        </el-table>
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
import api from "./api/entity";
import dateutils from "@/mixins/dateutils";

export default {
  name: "CustomsCnEntityList",
  mixins: [dateutils],
  data: function() {
    return {
      search: { query: null },
      operations: [],
      columns: [
        { title: "编码", field: "code" },
        { title: "统一社会信用代码", field: "unifiedCode" },
        { title: "名称", field: "name" },
        { title: "通关期限", field: "validUntil" },
        { title: "操作", field: "operations" }
      ],
      entData: [],
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
          this.entData = data.result;
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
