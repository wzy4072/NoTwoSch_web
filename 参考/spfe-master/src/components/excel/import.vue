<template>
  <div>
    <el-tabs v-model="editingPane" type="card">
      <el-tab-pane v-for="(item, index) in editing"
        :key="index"
        :label="item.field.desc"
        :name="item.field.name"
        :disabled="item.disabled">
        <bind-field v-if="item.field.type == 'simple'"
            :name="item.field.name"
            :fields="item.field.subfields"
            :data="item.data"
            :ref="item.field.type + ':' + item.field.name"
            @bind-setting="bindSetting"
            @bind-cancel="bindCancel"
            @bind="bindDone"></bind-field>
        <region-setting v-if="item.field.type == 'region'"
            :field="item.field"
            :data="item.data"
            :region="item.region"
            :ref="item.field.type + ':' + item.field.name"
            @bind-setting="bindSetting"
            @bind-cancel="bindCancel"
            @bind="bindDone"></region-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RegionSetting from "./region-setting";
import api from "./api";

export default {
  name: "ImportPreview",
  components: {
    RegionSetting
  },
  props: {
    id: String,
    schema: String
  },
  data() {
    return {
      editingPane: "goods",
      // [ {field: xxx, data: xxx} ]
      editing: [
        {
          field: {},
          region: {},
          data: undefined
        }
      ]
    };
  },
  methods: {
    bindSetting(settings) {
      // {
      //   field: this.fieldSelection,
      //   region: this.excelSelectionFlatten,
      //   settings: {}
      // }
      console.log("setting:" + settings);
      if (settings.field.type === "region") {
        var idx = this.editing.length - 1;
        this.editing[idx].disabled = true;
        this.editing.push({
          disabled: false,
          field: settings.field,
          region: settings.region,
          data: this.extractRegion(this.editing[idx].data, settings.region),
          settings: {}
        });
        this.editingPane = settings.field.name;
      }
    },
    bindCancel() {
      if (this.editing.length > 1) {
        this.editing.pop();
        this.editing[this.editing.length - 1].disabled = false;
        this.editingPane = this.editing[this.editing.length - 1].field.name;
      } else {
        console.log("Cancel editing");
      }
    },
    bindDone(bindings) {
      if (this.editing.length > 1) {
        this.editing.pop();
        var currentBinding = this.editing[this.editing.length - 1];
        var currentFieldName = currentBinding.field.name;
        var currentFieldType = currentBinding.field.type;
        var currentRef = currentFieldType + ":" + currentFieldName;
        currentBinding.disabled = false;
        this.editingPane = currentFieldName;
        var comp = this.$refs[currentRef][0];
        comp.bind(bindings);
      } else {
        // no more bindings, our bindings is the result
        var bindingData = {
          binding: bindings[0],
          resourceId: this.id
        }
        console.log("Bindings: " + JSON.stringify(bindings));
        api.getExcelBinding(bindingData).then(data => (bindingData = data));
        this.open4();
      }
    },
    extractRegion(orig, region) {
      console.log("Extracting " + JSON.stringify(region));
      return orig;
    },
    open4() {
      this.$msgbox({
        title: '确定查阅数据，取消返回',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$router.push(`/excel/checkview/${this.schema}/${this.id}`);
            done();
          } else {
            done();
          }
        }
      })
    }
  },
  created() {
    Promise.all([
      api.getExcelData(this.id).then(data => (this.editing[0].data = data)),
      api
        .getExcelSchema(this.schema)
        .then(data => (this.editing[0].field = data))
    ]).catch(err => {
      this.$message(err);
    });
  }
};
</script>
