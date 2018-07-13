<template>
    <div>
        <h2>ASN列表</h2>
        <!-- search -->
        <el-form :inline="true" :model="search" size="mini">
          <el-form-item label="搜索">
            <el-input v-model="search.query" placeholder="搜索ASN"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reload" icon="search"><span>搜索</span></el-button>
            <el-button type="ghost" @click="$router.push('/asn/new')" icon="edit">新增</el-button>
            <el-button type="ghost" html-type="submit" icon="up">导入</el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table :data="asnTable" v-loading="loading" stripe style="width: 100%" size="mini" @row-dblclick="editRow">
          <el-table-column prop="warehouseCode" label="仓库"></el-table-column>
          <el-table-column prop="timeToWarehouse" label="到仓时间">
            <template slot-scope="scope">
              <span>{{datePart(scope.row.timeToWarehouse)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span>{{statusName[scope.row.status.toLowerCase()]}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="code" label="SKU编号" width="180"></el-table-column> -->
          <!-- <el-table-column prop="name" label="品名"></el-table-column> -->
          <!-- <el-table-column prop="types" label="类型"></el-table-column> -->
          <el-table-column prop="id" label="操作" width="180">
            <template slot-scope="scope">
              <!-- <el-button @click.native.prevent="$router.push('/sku/' + scope.row.id)" type="primary" size="small">
                Edit
              </el-button> -->
              <el-button @click.native.prevent="inboundAsn(scope.row.id)" type="primary" size="small">
                发送
              </el-button>
              <el-button @click.native.prevent="delAsn(scope.row.id)" type="primary" size="small">
                作废
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
import asnApi from "./api/asn";
import dateutils from "@/mixins/dateutils";

export default {
  name: "AsnList",
  mixins: [dateutils],
  data: function() {
    return {
      search: {
        query: null
      },
      asnTable: [],
      loading: false,
      pager: {
        pageNo: 1,
        pageSize: 50,
        total: 1
      },
      statusName: {
        unsent: "未发送",
        sent: "发送",
        confirmed: "确认",
        rejected: "拒绝",
        processed: "完成",
        cacel: "取消",
        invalid: "作废"
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
      return asnApi.getPageResult({
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
          this.asnTable = data.result;
          this.pager.total = data.totalCount;
          this.loading = false;
        })
        .catch(err => {
          this.$message("" + err);
          this.loading = false;
        });
    },
    editRow(row) {
      this.$router.push("/asn/" + row.id);
    },
    delAsn(id) {
      asnApi.delAsn(id)
        .then(data => {
          if (data) {
            this.reload();
            this.$message("删除成功！");
          }
        })
        .catch(err => {
          this.$message("" + err);
          this.loading = false;
        });
    },
    inboundAsn(id) {
      asnApi.inboundAsn({ids: [id]})
        .then(data => {
          if (data.success) {
            this.reload();
            this.$message("发送成功！");
          }
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
