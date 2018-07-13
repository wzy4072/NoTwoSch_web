<template>
    <div>
        <h2>{{id === 'new' ? '新增SKU': '修改SKU'}}</h2>
        <el-form ref="skuForm" :model="sku" :rules="skuRules" label-width="100px" size="mini">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="SKU编号">
                <el-input v-model="sku.code" placeholder="SKU编号"></el-input>
              </el-form-item>
              <el-form-item label="商品名称">
                <el-input v-model="sku.name" placeholder="商品名称"></el-input>
              </el-form-item>
              <el-form-item label="成交单位">
                <el-input v-model="sku.salesUnit" placeholder="成交单位"></el-input>
              </el-form-item>
              <el-form-item label="商品描述">
                <el-input type="textarea" v-model="sku.description" placeholder="商品描述"></el-input>
              </el-form-item>
              <el-form-item label="复合商品">
                <el-switch v-model="sku.virtual"></el-switch>
                <transition name="el-fade-in">
                <div v-if="sku.virtual">
                      <el-button-group style="float: right">
                        <el-button type="primary" icon="el-icon-plus" @click='addBom'>添加</el-button>
                        <el-button type="primary" icon="el-icon-edit" :disabled="!bomEditable" @click="bomModalVisible = true">修改</el-button>
                        <el-button type="primary" icon="el-icon-close" :disabled="!bomEditable" @click="delBom">删除</el-button>
                      </el-button-group>
                    <el-tree :data="bom" :props="bomProps" @node-click="bomSelected"></el-tree>
                </div>
              </transition>
              </el-form-item>
              <el-form-item label="商品类型">
                <el-checkbox-group v-model="sku.types" size="medium">
                  <el-checkbox-button v-for="ty in importExportTypes" :label="ty.label" :key="ty.value">{{ty.label}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="净重">
                <input-weight :defaultUnit="'G'" :initValue="sku.netWeight" v-model="sku.netWeight"></input-weight>
              </el-form-item>
              <el-form-item label="毛重">
                <input-weight :defaultUnit="'G'" :initValue="sku.grossWeight" v-model="sku.grossWeight"></input-weight>
              </el-form-item>
              <el-form-item label="毛体积">
                <input-volume :defaultUnit="'CM'" v-model="sku.volume"></input-volume>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="预装箱">
                <el-button @click="addPrepacking" style="float: left">增加</el-button>
                <el-table :data='sku.prePackings' :columns='columnsPrepacking' stripe border size="small" ref="packingTable">
                  <el-table-column prop="note" label="说明" width="180"></el-table-column>
                  <el-table-column prop="containerTypeName" label="容器类型" width="180"></el-table-column>
                  <el-table-column prop="quantity" label="数量"></el-table-column>
                  <el-table-column label="单位">
                    <template slot-scope="scope">
                      {{sku.salesUnit}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="volume" label="测量体积">
                    <template slot-scope="scope">
                      <span v-if="scope.row.volume != null ">
                          {{scope.row.volume.length}} * {{scope.row.volume.width}} * {{scope.row.volume.height}} &nbsp;&nbsp; (L * W * H) {{scope.row.volume.unit}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="毛重">
                    <template slot-scope="scope">
                      <span v-if="scope.row.weight != null ">
                          {{scope.row.weight.weight}} {{scope.row.weight.unit}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button @click="editPacking(scope.$index)" icon="el-icon-edit" ></el-button>
                      <el-button @click="delPacking(scope.$index)" icon="el-icon-delete"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" @click="save">确定</el-button>
                <el-button @click="$router.push('/sku')">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-dialog title="BOM 编辑" :visible.sync="bomModalVisible">
          <el-form label-width="100px" size="mini" :model="editingBom">
              <el-form-item label="SKU" required>
                  <sku-select v-model="editingBom.skuId" :allowCreate="false" @change="bomChanged"></sku-select>
              </el-form-item>
              <el-form-item label="数量" required>
                  <el-input-number :min="0" v-model="editingBom.quantity"></el-input-number>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="bomModalVisible = false">取 消</el-button>
            <el-button type="primary" @click="editBom">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="预装箱" :visible.sync="packingModalVisible" :width="perPackingModalWidth">
          <el-form label-width="140px" size="mini" :model="editingPrepacking" :rules="prepackingFormRules" ref="prepackingForm">
              <el-form-item label="用途说明" required prop="note">
                <el-input v-model="editingPrepacking.note"></el-input>
              </el-form-item>
              <el-form-item label="容器规格" required prop="containerTypeId">
                <container-select v-model="editingPrepacking.containerTypeId" @change="containerChanged"></container-select>
              </el-form-item>
              <el-form-item label="物料数量" required prop="quantity">
                <el-input-number :min="0" v-model="editingPrepacking.quantity"></el-input-number> {{sku.salesUnit}}
              </el-form-item>
              <el-form-item label="毛重" required prop="weight">
                <input-weight :defaultUnit="'KG'" v-model="editingPrepacking.weight"></input-weight>
              </el-form-item>
              <el-form-item label="毛体积" required prop="volume">
                <input-volume v-model="editingPrepacking.volume"></input-volume>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="packingModalVisible = false">取 消</el-button>
            <el-button type="primary" @click="editPrepacking">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import skuData from "./api/sku";
export default {
  name: "SkuEdit",
  props: {
    id: [String, Number]
  },
  data: function() {
    const checkWeight = (rule, value, callback) => {
      value = this.editingPrepacking.weight;
      if (!value || value == null) {
        callback(new Error("请输入重量"));
      } else if (value.unit === null || value.unit === "") {
        callback(new Error("请选择重量单位"));
      } else if (
        value.weight === null ||
        value.weight === "" ||
        value.weight < 0
      ) {
        callback(new Error("请输入有效重量"));
      }
      callback();
    };

    const checkVolume = (rule, value, callback) => {
      value = this.editingPrepacking.volume;
      if (!value || value === null) {
        callback(new Error("请输入体积"));
      } else if (value.unit === null || value.unit === "") {
        callback(new Error("请选择体积单位"));
      } else if (
        value.length === null ||
        value.length === "" ||
        value.length < 0
      ) {
        callback(new Error("请输入有效的长度"));
      } else if (
        value.width === null ||
        value.width === "" ||
        value.width < 0
      ) {
        callback(new Error("请输入有效的宽度"));
      } else if (
        value.height === null ||
        value.height === "" ||
        value.height < 0
      ) {
        callback(new Error("请输入有效的高度"));
      }
      callback();
    };

    const checkQuantity = (rule, value, callback) => {
      const quantity = this.editingPrepacking.quantity;
      const containerTypeId = this.editingPrepacking.containerTypeId;
      if (containerTypeId === null || containerTypeId === "") {
        callback(new Error("请选择预装箱容器"));
      } else if (quantity === null || quantity === "" || quantity <= 0) {
        callback(new Error("请输入有效的数量"));
      } else {
        callback();
      }
    };

    const checkSkuNetWeight = (rule, value, callback) => {
      value = this.sku.netWeight;
      if (!value || value === null) {
        callback(new Error("请输入重量"));
      } else if (value.unit === null || value.unit === "") {
        callback(new Error("请选择重量单位"));
      } else if (
        value.weight === null ||
        value.weight === "" ||
        value.weight < 0
      ) {
        callback(new Error("请输入有效重量"));
      }
      callback();
    };

    return {
      sku: {},
      showRegistrySearch: false,
      importExportTypes: [],
      bom: [
        {
          id: 0,
          title: "SKU-BOM",
          expanded: true,
          children: []
        }
      ],
      bomProps: {
        children: "children",
        label: "title"
      },
      editingBom: {},
      editingPrepacking: this.createEmptyPrepacking(),
      volume: {},
      weight: {},
      columnsPrepacking: [
        { title: "说明", field: "note" },
        { title: "容器类型", field: "containerTypeName" },
        { title: "数量", field: "quantity" },
        { title: "单位", field: "salesUnit" },
        { title: "测量体积", field: "volume" },
        { title: "毛重", field: "weight" },
        { title: "操作", field: "operations" }
      ],
      skuRules: {
        code: [
          {
            required: true,
            message: "请输入SKU编码"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入商品名称"
          }
        ],
        salesUnit: [
          {
            required: true,
            message: "请输入单位"
          }
        ],
        netWeight: [{ validator: checkSkuNetWeight }]
      },
      prepackingFormRules: {
        quantity: [
          {
            validator: checkQuantity
          }
        ],
        weight: [
          {
            validator: checkWeight
          }
        ],
        volume: [
          {
            validator: checkVolume
          }
        ]
      },
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
      loading: false,
      bomModalVisible: false,
      bomEditable: false,
      packingModalVisible: false,
      perPackingModalWidth: "600"
    };
  },
  created() {
    this.importExportTypes = skuData.getImportExportTypes();
    let _this = this;
    var id = this.$route.params.id;
    if (id === undefined || id === null || id === "new") {
      this.sku = skuData.create();
      this.editingPrepacking = this.createEmptyPrepacking();
    } else {
      skuData.getBom(id).then(data => {
        data.forEach(function(v) {
          _this.bom[0].children.push({
            id: v.skuId,
            code: v.code,
            quantity: v.quantity,
            salesUnit: v.salesUnit,
            title: v.code + " X " + v.quantity + " " + v.salesUnit
          });
        });
      });
      skuData.get(id).then(data => {
        _this.sku = data;
      });
    }
  },
  methods: {
    createEmptyPrepacking() {
      return {
        index: null,
        note: null,
        containerTypeId: null,
        containerTypeName: null,
        quantity: null,
        volume: { length: null, width: null, height: null, unit: null },
        weight: { weight: null, unit: null }
      };
    },
    loadPrepacking() {
      let _this = this;
      return Promise.resolve({
        result: Array.isArray(_this.sku.prePackings)
          ? _this.sku.prePackings
          : []
      });
    },
    bomSelected(node) {
      console.log(node);
      if (node !== null) {
        console.info(node);
        this.bomEditable = true;
        this.editingBom.skuId = node.id;
        this.editingBom.skuCode = node.code;
        this.editingBom.quantity = node.quantity;
        this.editingBom.salesUnit = node.salesUnit;
      } else {
        this.bomEditable = false;
      }
    },
    editBom() {
      if (this.editingBom.skuId === null || this.editingBom.quantity === null) {
        return;
      }
      let _this = this;
      var exists = this.bom[0].children.find(
        n => n.id === this.editingBom.skuId
      );
      if (exists !== undefined) {
        exists.skuId = _this.editingBom.skuId;
        exists.code = _this.editingBom.code;
        exists.quantity = _this.editingBom.quantity;
        exists.salesUnit = _this.editingBom.salesUnit;
        exists.title =
          _this.editingBom.skuCode +
          " X " +
          _this.editingBom.quantity +
          " " +
          _this.editingBom.salesUnit;
      } else {
        this.bom[0].children.push({
          id: this.editingBom.skuId,
          code: this.editingBom.code,
          quantity: this.editingBom.quantity,
          salesUnit: this.editingBom.salesUnit,
          title:
            this.editingBom.skuCode +
            " X " +
            this.editingBom.quantity +
            " " +
            this.editingBom.salesUnit
        });
      }
      this.bomModalVisible = false;
    },
    delBom() {
      var index = this.bom[0].children.findIndex(
        n => n.id === this.editingBom.skuId
      );
      let _this = this;
      if (index >= 0) {
        this.$modal.confirm({
          title: "您是否确认要删除这项内容",
          content: "是否删除 " + this.editingBom.skuCode + " 的BOM 关系",
          onOk: function() {
            _this.bom[0].children.splice(index, 1);
            _this.editingBom = {};
            _this.bomEditable = false;
          },
          onCancel: function() {}
        });
      }
    },
    addBom() {
      this.bomModalVisible = true;
      this.editingBom = {};
    },
    addPrepacking() {
      this.editingPrepacking = this.createEmptyPrepacking();
      this.$refs["prepackingForm"] &&
        this.$refs["prepackingForm"].clearValidate();
      this.packingModalVisible = true;
    },
    editPrepacking() {
      let _this = this;
      this.$refs["prepackingForm"].validate(valid => {
        if (valid) {
          let editingIndex = _this.editingPrepacking.index;
          var exists =
            editingIndex != null
              ? _this.sku.prePackings[editingIndex]
              : undefined;
          if (exists !== undefined) {
            exists.containerTypeId = _this.editingPrepacking.containerTypeId;
            exists.containerTypeName =
              _this.editingPrepacking.containerTypeName;
            exists.quantity = _this.editingPrepacking.quantity;
            exists.volume = _this.editingPrepacking.volume;
            exists.weight = _this.editingPrepacking.weight;
            exists.note = _this.editingPrepacking.note;
          } else {
            _this.sku.prePackings.push({
              note: this.editingPrepacking.note,
              containerTypeId: this.editingPrepacking.containerTypeId,
              containerTypeName: this.editingPrepacking.containerTypeName,
              quantity: this.editingPrepacking.quantity,
              volume: this.editingPrepacking.volume,
              weight: this.editingPrepacking.weight
            });
          }
          _this.editingPrepacking = this.createEmptyPrepacking();
          _this.packingModalVisible = false;
        }
      });
    },
    editPacking(index) {
      this.editingPrepacking = JSON.parse(
        JSON.stringify(this.sku.prePackings[index])
      );
      this.editingPrepacking.index = index;
      this.packingModalVisible = true;
    },
    delPacking(index) {
      let _this = this;
      this.$modal.confirm({
        title: "您是否确认要删除这项内容",
        content: "容器的预装箱设置",
        onOk: function() {
          _this.sku.prePackings.splice(index, 1);
        },
        onCancel: function() {}
      });
    },
    containerChanged(option) {
      if (option) {
        this.editingPrepacking.containerTypeName = option.name;
      }
    },
    bomChanged(option) {
      this.editingBom.skuId = option.value;
      this.editingBom.skuCode = option.code;
      this.editingBom.quantity = option.quantity;
      this.editingBom.salesUnit = option.unit;
    },
    save() {
      this.loading = true;
      let _this = this;
      // set bom
      this.sku.skuBom = this.bom[0].children.map(function(v) {
        return { skuId: parseInt(v.id), quantity: v.quantity };
      });

      this.$refs["skuForm"].validate(valid => {
        if (valid) {
          skuData.save(this.sku).then(resp => {
            if (resp.success) {
              _this.$router.push("/sku");
            } else {
              this.$message["error"]("操作失败: " + resp.message);
            }
            _this.loading = false;
          });
        } else {
          console.log("error submit!!");
          _this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>
