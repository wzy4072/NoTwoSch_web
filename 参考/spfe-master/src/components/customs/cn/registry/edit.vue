<template>
    <div v-if="dataReady">
        <h2 >{{ id==null || id == '' ? '新建手册' : '编辑手册'}}</h2>

        <el-form ref="registryForm" :model="registry" :rules="rules" label-width="150px" size="mini">

            <el-tabs v-model="tabName" >
              <el-tab-pane label="手册表头" name="header">
                  <el-form-item label="手册号" prop="header.number"><el-input v-model="registry.header.number" placeholder="请输入手册号"></el-input></el-form-item>

                  <el-form-item label="进出口" prop="header.type">
                        <el-radio-group v-model="registry.header.type" size="small">
                        <el-radio-button label="IMPORT">进口</el-radio-button>
                        <el-radio-button label="EXPORT">出口</el-radio-button>
                      </el-radio-group>
                  </el-form-item>

                  <el-form-item label="生产销售单位" prop="header.businessEntity">
                      <entity-select v-model="registry.header.businessEntity"></entity-select>
                  </el-form-item>

                  <el-form-item label="收发货人" prop="header.importExportEntity">
                              <entity-select v-model="registry.header.importExportEntity"></entity-select>
                  </el-form-item>

                  <el-form-item label="合同号" prop="header.contractNumber">
                    <el-input v-model="registry.header.contractNumber" placeholder="请输入合同号"></el-input>
                  </el-form-item>

                  <el-form-item label="贸易方式" prop="header.tradeMode">
                      <code-select type="trademode" v-model="registry.header.tradeMode"></code-select>
                  </el-form-item>

                  <el-form-item label="征免性质" prop="header.levyNature">
                              <code-select type="levynature" v-model="registry.header.levyNature"></code-select>
                  </el-form-item>

                  <el-form-item label="国家" prop="header.country">
                    <code-select type="country" v-model="registry.header.country"></code-select>
                  </el-form-item>

                  <el-form-item label="境内货源地" prop="header.origin">
                              <code-select type="region" v-model="registry.header.origin"></code-select>
                  </el-form-item>

              </el-tab-pane>

              <el-tab-pane :label="detailsTabName" name="details">
                    <detail-table v-model="registry.details"></detail-table>
              </el-tab-pane>
            </el-tabs>

            <el-form-item>
              <el-button type="primary" @click.prevent="save">{{ id==null|| id == '' ? '创建' : '保存'}}</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>
import api from "./api/registry";
import detailTable from "./detail.vue";

export default {
  name: "CustomsCnRegistryEdit",
  components: {
    detailTable
  },
  props: {
    id: String
  },
  data: function() {
    return {
      tabName: 'header',
      dataReady: false,
      registry: {
        header: {},
        details: []
      },
      rules: {
        "header.number": [
          {
            required: true,
            message: "请输入"
          }
        ],
        "header.type": [
          {
            required: true,
            message: "请输入"
          }
        ],
        "header.businessEntity": [
          {
            required: true,
            message: "请输入"
          }
        ],
        "header.importExportEntity": [
          {
            required: true,
            message: "请输入"
          }
        ]
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
  },
  methods: {
    save() {
      this.$refs["registryForm"].validate(valid => {
        if (!valid) {
          this.$message.error("请修正表单问题");
        } else {
          api
            .save(this.id, this.registry)
            .then(() => {
              this.$router.push("/customs/cn/registry");
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    cancel() {
      this.$router.push("/customs/cn/registry");
    }
  },
  computed: {
    detailsTabName() {
      if (
        this.registry !== null &&
        this.registry.header !== null &&
        this.registry.header.type === "IMPORT"
      ) {
        return "料件表";
      }
      return "成品表";
    }
  },
  created() {
    if (this.id != null) {
      api
        .load(this.id)
        .then(data => {
          this.registry = data;
          this.dataReady = true;
        })
        .catch(err => {
          if (err.response !== null) {
            if (err.response.status === 404) {
              this.$message.error("Data Not Found", 5000);
            } else {
              this.$message.error(err.response);
            }
          } else {
            this.$message.error(err);
          }
        });
    } else {
      this.registry = {
        header: {
          number: null,
          type: null
        },
        details: []
      };
      this.dataReady = true;
    }
  }
};
</script>
