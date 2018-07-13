<template>
  <div>
    <el-dialog :visible.sync="visible" title="装箱详情">
      <el-table :data="editingPack" stripe style="width: 100%" size="mini">
        <el-table-column prop="type" label="类型" >
          <template slot-scope="scope">
            <span v-if="editingPack[scope.$index].type == 'SKU'">裸货</span>
            <span v-if="editingPack[scope.$index].type == 'CONTAINER'">已包装</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="代码">
          <template slot-scope="scope">
            <span>{{showCode(editingPack[scope.$index])}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="scope">
            <span>{{showDescription(editingPack[scope.$index])}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="装入数量" width="120">
          <template slot-scope="scope">
            <el-input-number v-model="editingPack[scope.$index].qty" :controls="false" style="width: 100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
          <template slot-scope="scope">
            <span>{{editingPack[scope.$index].unit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="最大数量" width="120">
          <template slot-scope="scope">
            {{editingPack[scope.$index].max_quantity}}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="使用数量" width="120">
          <template slot-scope="scope">
            {{editingPack[scope.$index].qty * packQuantity}}
          </template>
        </el-table-column>
      </el-table>
      <h3>装进容器</h3>
      <el-form label-width="100px" size="mini">
        <el-form-item label="装进容器">
          <container-select :disabled="usePrepacking" v-model="packContainerId" @change="updateContainerSpec"></container-select>
          <el-tooltip class="item" effect="dark" content="预装箱" placement="top-start">
            <el-radio-group v-model="checkedPrepacking" @change="prepackingChange">
              <el-radio-button v-for="op in prepackingOptions" :key="op.id" :label="op.id">{{op.note}}</el-radio-button>
            </el-radio-group>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="容器数量">
          <el-input-number :disabled="usePrepacking" v-model="packQuantity" placeholder="容器数量" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item v-if="!usePrepacking" label="装箱附加重量">
          <input-weight :defaultUnit="'KG'" v-model="packContainerWeight"></input-weight>
        </el-form-item>
        <el-form-item label="重量">
          <input-weight :defaultUnit="'KG'" :disabled="usePrepacking" v-model="packWeight"></input-weight>
        </el-form-item>
        <el-form-item label="体积">
          <input-volume :disabled="usePrepacking" v-model="packVolume"></input-volume>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import skuApi from "@/components/sku/api/sku";
export default {
  props: {
    value: Object,
    from: Array,
    visible: Boolean
  },
  components: {},
  data() {
    return {
      editingPack: this.from,
      packContainer: null,
      packContainerId: null,
      packQuantity: 1,
      packVolume: {},
      packContainerWeight: {},
      packWeight: {},
      result: {},
      checkedPrepacking: null,
      prepackingOptions: [],
      properties: {}
    };
  },
  watch: {
    from(val) {
      this.editingPack = val;
    }
  },
  computed: {
    usePrepacking() {
      return this.checkedPrepacking != null && this.checkedPrepacking > 0;
    }
  },
  methods: {
    showCode(row) {
      return row.type === "SKU" ? row.sku.code : row.typeCode;
    },
    showDescription(row) {
      return row.type === "SKU" ? row.sku.name : row.unit;
    },
    closeDialog() {
      this.$emit("close");
    },
    confirm() {
      this.result = this.pack();
      this.prepackingOptions = [];
      this.checkedPrepacking = null;
      this.packContainerId = null;
      this.packContainer = null;
      this.packQuantity = null;
      this.packWeight = null;
      this.packVolume = null;
      this.packContainerWeight = null;
      console.log(this.result);
      this.$emit("input", this.result);
      this.$emit("change", this.result);
      this.closeDialog();
    },
    pack() {
      // pack editingPack into result
      return {
        type: "CONTAINER",
        id: null, // to be set by caller
        typeId: this.packContainerId,
        typeCode: this.packContainer.seqPrefix,
        qty: this.packQuantity,
        unit: this.packContainer.name,
        volume: this.packVolume,
        gw: this.packContainerWeight,
        properties: this.properties,
        children: this.editingPack.filter(p => p.qty > 0)
      };
    },
    updateContainerSpec(container) {
      console.log(container);
      this.packContainer = container;
      this.packContainerId = container.id;
      this.packVolume = container.volume;
      this.packContainerWeight = container.weight;
      this.loadPrepacking();
    },
    prepackingChange(val) {
      let prepacking = this.prepackingOptions.find(op => op.id === val);
      console.debug(prepacking);
      this.packContainerId = prepacking.containerTypeId;
      this.packWeight = prepacking.weight;
      this.packVolume = prepacking.volume;
      let skus = this.editingPack.filter(
        p => p.quantity > 0 && p.type === "SKU"
      );
      this.packQuantity = parseInt(skus[0].quantity / prepacking.quantity);
    },
    loadPrepacking() {
      this.prepackingOptions = [];
      this.checkedPrepacking = null;
      let skus = this.editingPack.filter(
        p => p.quantity > 0 && p.type === "SKU"
      );
      if (skus.length === 1 && this.packContainerId != null) {
        skuApi
          .getPrepacking(skus[0].content.skuId, this.packContainerId)
          .then(data => {
            if (data.length > 1) {
              this.prepackingOptions = [
                {
                  note: "自定义",
                  containerTypeId: -1,
                  containerTypeName: null,
                  quantity: null,
                  weight: null,
                  volume: null
                }
              ]
                .concat(data)
                .map((v, index) => {
                  v["id"] = index;
                  return v;
                });
              this.checkedPrepacking = 0;
            }
          });
      }
    }
  }
};
</script>
