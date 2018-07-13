<template>
  <div>
    <el-table :data="manifest" stripe style="width: 100%" size="mini">
      <el-table-column type="index" label="行号" width="50">
      </el-table-column>
      <el-table-column prop="skuId" label="物料编号" width="180">
        <template slot-scope="scope">
          <sku-select :readonly="locked" v-model="manifest[scope.$index].sku.id" @change="skuChanged(scope.$index, $event)" :ref="'sku_' + scope.$index"></sku-select>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="物料名称">
        <template slot-scope="scope">
          <span v-if="locked">{{manifest[scope.$index].sku.name}}</span>
          <el-input v-else v-model="manifest[scope.$index].sku.name" placeholder="物料带出 或 录入"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="netWeight" label="物料净重" width="300">
        <template slot-scope="scope">
          <input-weight :disabled="locked" v-model="manifest[scope.$index].nw"></input-weight>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="120">
        <template slot-scope="scope">
          <span v-if="locked">{{manifest[scope.$index].qty}}</span>
          <el-input-number v-else v-model="manifest[scope.$index].qty" :controls="false" style="width: 100%" :ref="'quantity_' + scope.$index"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80">
        <template slot-scope="scope">
          <span v-if="locked">{{manifest[scope.$index].unit}}</span>
          <el-input v-else v-model="manifest[scope.$index].unit"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="properties" label="属性">
        <template slot-scope="scope">
          <div v-if="locked">
            <properties-show
              :value="manifest[scope.$index].properties"
              :is-color-blue="false"></properties-show>
          </div>
          <span v-else-if="Object.keys(manifest[scope.$index].properties).length<1">
            <el-button
              @click="setProperties(scope.$index)"
              type="text"
              size="mini"
              icon="el-icon-edit" >
              Edit
            </el-button>
          </span>
          <div v-else @click="setProperties(scope.$index)">
            <properties-show :value="manifest[scope.$index].properties"></properties-show>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="80">
        <template slot-scope="scope">
          <span v-if="locked"></span>
          <span v-else>
            <el-button
              @click="removeManifestLine(scope.$index)"
              type="text"
              size="mini" >
              删除
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="locked">
      <el-button type="primary" size="mini" @click="unlock">解锁</el-button>
    </div>
    <div v-else>
      <el-button type="primary" size="mini" @click="addManifestLine">增加</el-button>
      <el-button size="mini" @click="lock">锁定</el-button>
    </div>
    <el-dialog title="编辑清单行属性" :visible.sync="propertiesVisible" width="35%">
      <properties-edit v-model="editingProperties" :opt="optProperties"></properties-edit>
      <span slot="footer" class="dialog-footer">
        <el-button @click="propertiesVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmEditingProperties">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PropertiesEdit from "./properties-edit";
import propertiesShow from "./properties-show";

export default {
  name: "Manifest",
  props: {
    value: Array,
    locked: Boolean
  },
  components: {
    PropertiesEdit,
    propertiesShow
  },
  data() {
    return {
      manifest: this.value,
      propertiesVisible: false,
      editingIndex: null,
      editingProperties: {},
      optProperties: false
    };
  },
  watch: {
    value(val) {
      this.manifest = val;
    }
  },
  methods: {
    addManifestLine() {
      this.manifest.push(this.newline());
      var name = "sku_" + (this.manifest.length - 1);
      this.$nextTick(() => {
        this.$refs[name].focus();
      });
    },
    newline() {
      return {
        sku: {},
        properties: {}
      };
    },
    removeManifestLine(index) {
      this.manifest.splice(index, 1);
    },
    skuChanged(index, obj) {
      if (obj) {
        this.manifest[index].sku = {
          id: obj.value,
          code: obj.code,
          name: obj.name,
          corpId: obj.corpId
        };
        this.manifest[index].unit = obj.unit;
        this.manifest[index].nw = obj.netWeight;
        var name = "quantity_" + index;
        this.$refs[name].focus();
      } else {
        this.manifest[index].sku = {};
      }
    },
    lock() {
      this.$emit("input", this.manifest);
      this.$emit("change", this.manifest);
      this.$emit("locked");
    },
    unlock() {
      this.$emit("unlocked");
    },
    setProperties(index) {
      this.editingIndex = index;
      this.editingProperties = this.manifest[index].properties;
      this.optProperties = !this.optProperties;
      this.propertiesVisible = true;
    },
    confirmEditingProperties() {
      this.manifest[this.editingIndex].properties = this.editingProperties;
      this.propertiesVisible = false;
      this.editingIndex = null;
      this.editingProperties = null;
      this.$emit("input", this.manifest);
      this.$emit("change", this.manifest);
    }
  }
};
</script>
