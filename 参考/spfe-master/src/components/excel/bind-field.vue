<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card style="margin-bottom: 10px">
          <div slot="header">
            <b>选择字段</b>
            <span v-if="fieldSelection"><el-tag size="mini">{{fieldSelection.desc}}</el-tag></span>
          </div>
          <el-table :data="remainingFields" highlight-current-row @current-change="fieldSelect" size="mini" border :show-header="false">
            <el-table-column property="desc" label="导入字段">
              <template slot-scope="scope">{{scope.row.desc}} <span v-if="scope.row.required" style="color: red">*</span></template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-button v-if="regionField" @click="bindSettings" size="mini" type="primary">绑定设置</el-button>
        <el-button v-if="simpleField" @click="bindSimple" size="mini" type="primary">绑定</el-button>

      </el-col>
      <el-col :span="20">
        <el-card>
          <div slot="header">
            <b>选择区域</b>
            <span v-if="excelSelectionFlatten.length > 0">
              <el-tag size="mini" v-for="(sel, seq) in excelSelectionFlatten" :key="seq" closable @close="removeSelection(seq)">{{sel.selectionName}}</el-tag>
            </span>
          </div>
          <excel-preview
            :name="name"
            :data="data"
            :region="region"
            :custom-region="customRegion"
            @select="excelSelect"
            style="width: 900px"
            >
          </excel-preview>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :span="24">
        已绑定字段： <el-tag v-for="(s, seq) in bindings" :key="seq" closable @close="unbind(seq)" style="margin-right: 10px">{{s.field.desc}}</el-tag>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-button :disabled="remainingRequiredFields.length > 0" @click="bindDone" size="mini" type="primary">确定</el-button>
        <el-button @click="cancel" size="mini">取消</el-button>
      </el-col>
      <el-col :span="16">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RegionSetting from "./region-setting";

export default {
  name: "BindField",
  components: {
    RegionSetting
  },
  props: {
    fields: Array, // 字段要求
    name: String, // HandsonTable 控件唯一名字
    data: Object, // 预览数据 (see ExcelData structure)
    region: Array, // effective region (special highlight)
    customRegion: Array
  },
  data() {
    return {
      hot: null,
      currentSheet: null,
      fieldSelection: null,
      excelSelection: [],
      excelSelectionFlatten: [],
      currentBinding: null,
      bindings: []
    };
  },
  computed: {
    sheetNames() {
      return this.data ? this.data.sheets.map(s => s.name) : [];
    },
    currentSheetIndex() {
      return this.sheetNames.indexOf(this.currentSheet);
    },
    remainingFields() {
      return this.fields.filter(
        f => this.bindings.map(b => b.field.name).indexOf(f.name) < 0
      );
    },
    remainingRequiredFields() {
      return this.remainingFields.filter(f => f.required);
    },
    regionField() {
      return this.fieldSelection && this.fieldSelection.type === "region";
    },
    simpleField() {
      return this.fieldSelection && this.fieldSelection.type === "simple";
    }
  },
  methods: {
    excelSelect(sel) {
      this.excelSelection = sel;
      this.excelSelectionFlatten = [].concat.apply([], this.excelSelection);
    },
    removeSelection(idx) {
      this.excelSelection.splice(idx, 1);
      this.excelSelectionFlatten = [].concat.apply([], this.excelSelection);
    },
    fieldSelect(field) {
      this.fieldSelection = field;
    },
    bindSettings() {
      this.currentBinding = {
        field: this.fieldSelection,
        region: this.excelSelectionFlatten,
        settings: {}
      };
      this.$emit("bind-setting", this.currentBinding);
    },
    cancel() {
      this.$emit("bind-cancel");
    },
    bindSimple() {
      this.bind({
        field: this.fieldSelection,
        region: this.excelSelectionFlatten
      });
    },
    bindDone() {
      this.$emit("bind", this.bindings);
    },
    bind(binding) {
      this.bindings.push(binding);
    },
    unbind(index) {
      this.bindings.splice(index, 1);
    }
  }
};
</script>
