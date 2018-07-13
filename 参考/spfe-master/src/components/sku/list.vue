<template>
    <div>
        <h2>物料列表</h2>
        <!-- search -->
        <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
          <el-form-item label="搜索">
            <el-input v-model="search.query" clearable placeholder="搜索物料"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button html-type="submit" @click="reload" icon="search"><span>搜索</span></el-button>
            <el-button type="ghost" @click="$router.push('/sku/new')" icon="edit">新增</el-button>
            <el-button type="ghost" icon="up">导入</el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table :data="skuTable" v-loading="loading" stripe style="width: 100%" size="mini">
          <el-table-column prop="code" label="SKU编号" width="180"></el-table-column>
          <el-table-column prop="name" label="品名"></el-table-column>
          <el-table-column prop="types" label="类型"></el-table-column>
          <el-table-column prop="id" label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click.native.prevent="$router.push('/sku/' + scope.row.id)" icon="el-icon-edit" type="text" size="small">
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
import skuApi from "./api/sku";
export default {
  name: "SkuList",
  data: function() {
    return {
      search: {
        query: null
      },
      skuTable: [],
      loading: false,
      columns: [
        { title: "SKU编号", field: "code" },
        { title: "品名", field: "name" },
        { title: "类型", field: "virtual" },
        { title: "进出口", field: "types" },
        { title: "操作", field: "operations" }
      ],
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
      return skuApi.getPageResult(
        this.search.query,
        pager.pageNo,
        pager.pageSize,
        pager.sortColumns
      );
    },
    reload() {
      this.loading = true;
      this.loadData(this.pager)
        .then(data => {
          this.skuTable = data.result;
          this.pager.total = data.totalCount;
          this.loading = false;
        })
        .catch(err => {
          this.$message("" + err);
          this.loading = false;
        });
    },
    typesTransform(types) {
      var options = skuApi.getImportExportTypes();
      return types
        .split(",")
        .map(function(v) {
          var found = options.find(o => o.value === v);
          return found ? found.label : "";
        })
        .join(",");
    }
  },
  created() {
    this.reload();
  }
};
</script>
