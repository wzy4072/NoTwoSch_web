<template>
  <div>
    <h2>货物列表</h2>
    <!-- search -->
    <el-form :inline="true" :model="search" size="mini">
      <el-form-item label="搜索">
        <el-input v-model="search.query" placeholder="搜索物料" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reload" icon="search"><span>搜索</span></el-button>
        <el-button type="ghost" @click="$router.push('/goods/new')" icon="edit">新增</el-button>
        <el-button type="ghost" @click="$router.push('/upload/' + encodeURIComponent('/excel/preview/goods'))" icon="up">导入</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="goodsTable" v-loading="loading" stripe style="width: 100%" size="mini">
          <el-table-column prop="code" label="货物编号" width="180"></el-table-column>
          <el-table-column prop="comment" label="货物描述"></el-table-column>
          <el-table-column prop="properties" label="属性">
            <template slot-scope="scope">
            <properties-show :value="scope.row.properties" :is-color-blue="false"></properties-show>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click.native.prevent="$router.push('/goods/' + scope.row.id)" icon="el-icon-edit" type="text" size="small">
                Edit
              </el-button>
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
import api from "./api/goods";
import propertiesShow from "./properties-show";
export default {
  name: "GoodsList",
  components: {
    propertiesShow
  },
  data() {
    return {
      search: {},
      goodsTable: [],
      loading: false,
      pager: {
        pageNo: 1,
        pageSize: 50,
        total: 1
      }
    };
  },
  created() {
    this.reload();
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
      return api.getPageResult({
        query: this.search.query,
        pageNo: pager.pageNo,
        pageSize: pager.pageSize,
        sortColumns: pager.sortColumns
      });
    },
    reload() {
      this.loading = true;
      this.loadData(this.pager)
        .then(data => {
          this.goodsTable = data.result;
          this.pager.total = data.totalCount;
          this.loading = false;
        })
        .catch(err => {
          this.$message("" + err);
          this.loading = false;
        });
    }
  }
};
</script>
