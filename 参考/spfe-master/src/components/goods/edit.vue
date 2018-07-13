<template>
  <div>
    <h2 v-if="!id">新建货物</h2>
    <h2 v-if="id">编辑货物</h2>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form :model="header" label-width="100px" required >
          <el-form-item label="货物编号">
            <el-input v-model="header.code" placeholder="货物编号"></el-input>
          </el-form-item>
          <el-form-item label="货物描述">
            <el-input v-model="header.description" placeholder="货物描述"></el-input>
          </el-form-item>
        </el-form>
        <el-tabs v-model="tab" type="border-card">
          <el-tab-pane label="货物清单" name="manifest">
            <manifest v-model="manifest" :locked="manifestLocked"
              @change="manifestChanged"
              @locked="manifestLockClicked"
              @unlocked="manifestLocked = false"
              ></manifest>
          </el-tab-pane>
          <el-tab-pane label="装箱信息" name="packingList" v-if="manifestLocked">
            <packing-list v-model="packingList"></packing-list>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>索引属性</span>
            <el-button
              @click="addProperty"
              style="float: right; padding: 3px 0"
              type="text">新增属性</el-button>
          </div>
          <properties-edit v-model="properties" :editable="true"></properties-edit>
        </el-card>
        <el-card style="margin-top: 20px">
          <div slot="header">
            <span>相关单证</span>
            <div style="float: right">
              <el-dropdown @command="createDoc">
                <el-button type="text">
                  新增<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="/asn/new">ASN</el-dropdown-item>
                  <el-dropdown-item>报关单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div v-for="doc in docs" :key="doc.docId" class="text item">
            <router-link :to="'/asn/' + doc.docId" v-if="doc.docType === 'ASN'"> ASN ：单证编号 {{ (doc.refNos && doc.refNos[0]) || doc.docId }}</router-link>
            <router-link :to="'/declaration/' + doc.docId" v-if="doc.docType === 'CHINA_CUSTOMS_DECLARATION'"> 报关单 ：单证编号 {{(doc.refNos && doc.refNos[0]) || doc.docId }}</router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="padding-top: 20px">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import PropertiesEdit from "./properties-edit";
import api from "./api/goods";
export default {
  name: "GoodsEdit",
  components: {
    PropertiesEdit
  },
  props: {
    id: String
  },
  data() {
    return {
      tab: "manifest",
      header: { code: null, description: null },
      manifestLocked: false,
      manifest: [],
      packingList: [],
      properties: {},
      opt: false,
      docs: []
    };
  },
  created() {
    if (this.id && this.id != null) {
      this.manifestLocked = true;
      api.load(this.id).then(data => {
        this.header.code = data.code;
        this.header.description = data.comment;
        this.packingList = data.packingList.items;
        this.properties = data.properties;
        this.opt = !this.opt;
        this.docs = data.docHooks;
        this.manifest = data.manifest.lines;
      });
    }
  },
  methods: {
    addProperty() {
      this.properties[""] = (Array.isArray(this.properties[""])
        ? this.properties[""]
        : []
      ).concat([""]);
      this.opt = !this.opt;
    },
    manifestChanged() {
      this.packingList = this.convertToPackingList(this.manifest);
    },
    manifestLockClicked() {
      this.manifestLocked = true;
      this.tab = "packingList";
    },
    convertToPackingList(manifest) {
      return manifest.map(line => {
        line.type = "SKU";
        return line;
      });
    },
    formatPackingListForSubmit(pl) {
      return pl.map(p => {
        let tmp = JSON.parse(JSON.stringify(p));
        if (p.children && Array.isArray(p.children)) {
          tmp.children = this.formatPackingListForSubmit(p.children);
        } else {
          tmp.children = undefined;
        }
        tmp.id = undefined;
        tmp.max_quantity = undefined;
        return tmp;
      });
    },
    createDoc(doc) {
      if (doc === "/asn/new") {
        this.$router.push(doc + "/" + this.id);
        return false;
      }
      this.$router.push(doc + "/goods=" + this.id);
    },
    cancel() {
      this.$router.back();
    },
    submit() {
      let goods = {
        id: this.id,
        code: this.header.code,
        comment: this.header.description,
        manifest: {
          lines: this.manifest.map(m => {
            return {
              id: m.id,
              sku: m.sku,
              qty: m.qty,
              unit: m.unit,
              nw: m.nw,
              gw: m.gw,
              volume: m.volume,
              properties: m.properties
            };
          })
        },
        packingList: {
          items: this.formatPackingListForSubmit(this.packingList)
        },
        properties: this.properties
      };
      console.debug(goods);
      api.save(goods).then(data => {
        if (data.success) {
          console.log("Save successfully!");
          this.header.id = data.result;
          this.$message("操作成功");
        } else {
          this.$message("操作失败");
        }
      });
    },
    simplifyProperties(property) {
      var key = "" + property.keys.value;
      var value = property.values.value;
      var output = {};
      output[key] = value;
      return output;
    },
    handleManifestProperties(arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].properties.length; j++) {
          arr[i].properties[j] = this.simplifyProperties(arr[i].properties[j]);
        }
        if (arr[i].content !== undefined) {
          for (var k = 0; k < arr[i].content.properties.length; k++) {
            arr[i].content.properties[k] = this.simplifyProperties(
              arr[i].content.properties[k]
            );
          }
        }
      }
    },
    handlePackingListProperties(arr) {
      this.handleManifestProperties(arr);
    }
  }
};
</script>
