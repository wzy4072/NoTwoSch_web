<template>
  <div>
    <el-table :data="packingList" stripe style="width: 100%" size="mini"
      @selection-change="handleSelectionChange" :row-class-name="checkExpandableClass">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="expand" width="20">
        <template slot-scope="scope" v-if="packingList[scope.$index].type == 'CONTAINER'">
          <div class="sub-item">
            <el-tree :data="packingList[scope.$index].children"
              :props="packingTreeProps"
              default-expand-all>
              <span slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" >
        <template slot-scope="scope">
          <span v-if="packingList[scope.$index].type == 'SKU'">裸货</span>
          <span v-if="packingList[scope.$index].type == 'CONTAINER'">已包装</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="代码">
        <template slot-scope="scope">
          <span>{{showCode(packingList[scope.$index])}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template slot-scope="scope">
          <span>{{showDescription(packingList[scope.$index])}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nw" label="体积重量">
        <template slot-scope="scope">
          <div v-if="packingList[scope.$index].nw!=null">净重: {{packingList[scope.$index].nw.weight}}{{packingList[scope.$index].nw.unit}}</div>
          <div v-if="packingList[scope.$index].gw!=null">毛重: {{packingList[scope.$index].gw.weight}}{{packingList[scope.$index].gw.unit}}</div>
          <div v-if="packingList[scope.$index].volume!=null">体积: {{showVolume(packingList[scope.$index])}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="120">
        <template slot-scope="scope">
          <span>{{packingList[scope.$index].qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80">
        <template slot-scope="scope">
          <span>{{packingList[scope.$index].unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="属性">
        <template slot-scope="scope">
          <properties-show :value="packingList[scope.$index].properties"></properties-show>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="120" v-if="editable">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="packItem(scope.$index)">装箱</el-button>
          <el-button v-if="packingList[scope.$index].type === 'CONTAINER'" type="text" size="mini" @click="unpackItem(scope.$index)">拆箱</el-button>
          <el-button type="text" size="mini" @click="preEdit(scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="selectedPack.length > 0 && editable" type="primary" size="mini" @click="pack">
      <span v-if="selectedPack.length === 1">装箱</span>
      <span v-if="selectedPack.length > 1">混装</span>
    </el-button>
    <pack-dialog v-model="resultPack" :from="editingPack" :visible="showEditPack" @close="showEditPack = false" @change="updateResultPack"></pack-dialog>
    <el-dialog title="编辑装箱单" :visible.sync="editVisible">
      <el-form label-width="100px" size="mini">
        <el-form-item label="毛重">
          <input-weight :defaultUnit="'KG'" v-model="netWeight"></input-weight>
        </el-form-item>
        <el-form-item label="净重">
          <input-weight :defaultUnit="'KG'" v-model="grossWeight"></input-weight>
        </el-form-item>
        <el-form-item label="体积">
          <input-volume :defaultUnit="'CM'" v-model="volume"></input-volume>
        </el-form-item>
        <el-form-item label="属性">
          <properties-edit v-model="editingProperties" :opt="opProps"></properties-edit>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmEditing">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PackDialog from "./pack-dialog";
import PropertiesEdit from "./properties-edit";
import propertiesShow from "./properties-show";
var seq = 0;

export default {
  name: "packingList",
  components: {
    PackDialog,
    PropertiesEdit,
    propertiesShow
  },
  props: {
    value: Array,
    editable: { type: Boolean, default: true }
  },
  data() {
    seq = 0;
    return {
      packingList: this.addIdToPackingList(this.value),
      showEditPack: false,
      selectedPack: [],
      editingPack: null,
      resultPack: {},
      packingTreeProps: {
        children: function(data) {
          return data.type ? data.children : null;
        },
        label: function(data, node) {
          let code = data.type === "SKU" ? data.sku.code : data.typeCode;
          return code + " x " + data.qty + " " + data.unit;
        }
      },
      editVisible: false,
      editingIndex: null,
      opProps: false,
      editingProperties: {},
      netWeight: null,
      grossWeight: null,
      volume: null
    };
  },
  watch: {
    value(val) {
      this.packingList = val;
    }
  },
  methods: {
    showCode(row) {
      return row.type === "SKU" ? row.sku.code : row.typeCode;
    },
    showDescription(row) {
      return row.type === "SKU" ? row.sku.name : row.unit;
    },
    showVolume(row) {
      return `${row.volume.length} * ${row.volume.width} * ${
        row.volume.height
      }`;
    },
    checkExpandableClass(obj) {
      return obj.row.type === "CONTAINER" ? "expand" : "no-expand";
    },
    handleSelectionChange(val) {
      this.selectedPack = val;
    },
    pack() {
      this.editingPack = this.makePack(this.selectedPack);
      this.showEditPack = true;
    },
    packItem(index) {
      this.editingPack = this.makePack([this.packingList[index]]);
      this.showEditPack = true;
    },
    unpackItem(index) {
      var working = this.packingList[index];
      console.log(working);
      if (working && working.type === "CONTAINER") {
        this.packingList.splice(index, 1);
        this.updatePackingListFromUnpackChildren(working.children, working.qty);
        this.$emit("input", this.packingList);
      }
    },
    addIdToPackingList(pl) {
      return pl.map(it => {
        it.id = seq++;
        return it;
      });
    },
    makePack(packs) {
      return packs.map(p => {
        let r = JSON.parse(JSON.stringify(p));
        r.max_quantity = r.qty;
        return r;
      });
    },
    updateResultPack() {
      if (this.resultPack) {
        if (this.resultPack.children) {
          this.updatePackingListFromPackChildren(
            this.resultPack.children,
            this.resultPack.qty
          );
        }
        this.resultPack.id = seq++;
        this.packingList.push(this.resultPack);
        this.$emit("input", this.packingList);
      }
    },
    updatePackingListFromPackChildren(items, qty) {
      console.debug(items);
      // match by id
      var newPacking = this.packingList //
        .filter(p => {
          // keep non-total matched items
          var matched = items.filter(
            i => i.id === p.id && i.qty * qty >= p.qty
          );
          return matched.length === 0;
        })
        .map(p => {
          // fix quantity value
          var matched = items.filter(i => i.id === p.id);
          if (matched.length === 1) {
            let tmp = JSON.parse(JSON.stringify(p));
            tmp.qty = p.qty - matched[0].qty * qty;
            tmp.max_quantity = p.max_quantity - matched[0].qty * qty;
            return tmp;
          } else {
            return p;
          }
        });
      this.packingList = newPacking;
    },
    updatePackingListFromUnpackChildren(children, qty) {
      // no ID matches existing packingList
      var toAppend = children
        .filter(c => this.packingList.filter(p => p.id === c.id).length === 0)
        .map(a => {
          let tmp = JSON.parse(JSON.stringify(a));
          tmp.qty = a.qty * qty;
          tmp.max_quantity = a.qty * qty;
          return tmp;
        });
      var toUpdate = children.filter(
        c => toAppend.filter(a => a.id === c.id).length === 0
      );
      this.packingList = this.packingList
        .map(p => {
          var matched = toUpdate.filter(u => u.id === p.id);
          if (matched.length === 1) {
            let tmp = JSON.parse(JSON.stringify(p));
            tmp.qty = p.qty + matched[0].qty * qty;
            tmp.max_quantity = p.qty * qty;
            return tmp;
          } else {
            return p;
          }
        })
        .concat(toAppend);
    },
    preEdit(index) {
      if (!this.editable) {
        return false;
      }
      this.editingIndex = index;
      this.grossWeight = this.packingList[index].gw;
      this.netWeight = this.packingList[index].nw;
      this.volume = this.packingList[index].volume;
      this.editingProperties = this.packingList[index].properties;
      this.opProps = !this.opProps;
      this.editVisible = true;
    },
    confirmEditing() {
      this.packingList[this.editingIndex].properties = this.editingProperties;
      this.packingList[this.editingIndex].nw =
        this.netWeight && this.netWeight.weight > 0
          ? this.netWeight
          : undefined;
      this.packingList[this.editingIndex].gw =
        this.grossWeight && this.grossWeight.weight > 0
          ? this.grossWeight
          : undefined;
      this.packingList[this.editingIndex].volume =
        this.volume && this.volume.length > 0 && this.volume.width > 0
          ? this.volume
          : undefined;
      this.editVisible = false;
      this.editingIndex = null;
      this.editingProperties = null;
      this.$emit("input", JSON.parse(JSON.stringify(this.packingList)));
    },
    isEditBtnShow(properties) {
      return properties == null || Object.keys(properties).length < 1;
    }
  }
};
</script>
<style scope>
.no-expand .el-icon {
  display: none;
}
.no-expand .el-table__expand-icon {
  pointer-events: none;
}
.sub-item {
  margin-top: -20px;
  padding-left: 50px;
  background-color: rgb(253, 245, 245);
}
</style>
