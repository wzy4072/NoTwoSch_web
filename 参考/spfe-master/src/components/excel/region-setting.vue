<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :model="localSetting" size="mini" label-width="120px">
          <el-form-item label="垂直或水平循环">
            <el-radio v-model="localSetting.loopDirection" label="vertical">垂直循环</el-radio>
            <el-radio v-model="localSetting.loopDirection" label="horizontal">水平循环</el-radio>
          </el-form-item>
          <el-form-item label="区域头部和尾部">
            <el-checkbox v-model="localSetting.withHeader">区域包括头部</el-checkbox>
            <el-checkbox v-model="localSetting.withFooter">区域包括尾部</el-checkbox>
          </el-form-item>
          <el-form-item label="头部行数" v-if="localSetting.withHeader">
            <el-input-number v-model="localSetting.headerLines"></el-input-number>
          </el-form-item>
          <el-form-item label="尾部行数" v-if="localSetting.withFooter">
            <el-input-number v-model="localSetting.footerLines"></el-input-number>
          </el-form-item>
          <el-form-item label="每个记录行数">
            <el-input-number v-model="localSetting.linesPerRecord"></el-input-number>
          </el-form-item>
          <el-form-item label="可延伸区域">
            <el-switch v-model="localSetting.expandable"></el-switch>
          </el-form-item>
          <el-form-item label="延伸中止标识" v-if="localSetting.expandable">
            <v-input v-model="localSetting.stopper"></v-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <bind-field :fields="field.subfields" :data="data" :name="field.name"
          :region="region"
          :custom-region="customRegion"
          @bind-setting="bindSetting"
          @bind-cancel="bindCancel"
          @bind="bindDone"></bind-field>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    field: Object,
    data: Object,
    region: Array
  },
  data() {
    return {
      subfield: null,
      localSetting: {
        expandable: false,
        loopDirection: "vertical",
        stopper: null,
        withHeader: true,
        withFooter: false,
        linesPerRecord: 1,
        headerLines: 1,
        footerLines: 1
      }
    };
  },
  computed: {
    customRegion() {
      var regions = [];
      if (this.headerRegion) {
        regions.push(this.headerRegion);
      }
      if (this.footerRegion) {
        regions.push(this.footerRegion);
      }
      if (this.bodyRegion) {
        regions.push(this.bodyRegion);
      }
      return regions;
    },
    headerRegion() {
      if (this.region && this.region.length > 0) {
        var origRegion = this.region[0];
        if (this.localSetting.withHeader) {
          var headerRegion = this.createHeaderRegion(
            origRegion,
            this.localSetting,
            "recordHeader"
          );
        }
        return headerRegion;
      }
      return undefined;
    },
    footerRegion() {
      if (this.region && this.region.length > 0) {
        var origRegion = this.region[0];
        if (this.localSetting.withFooter) {
          var footerRegion = this.createFooterRegion(
            origRegion,
            this.localSetting,
            "recordFooter"
          );
        }
        return footerRegion;
      }
      return undefined;
    },
    bodyRegion() {
      if (this.region && this.region.length > 0) {
        var origRegion = this.region[0];
        var bodyRegion = this.createFirstRecord(
          origRegion,
          this.localSetting,
          "recordBody"
        );
        return bodyRegion;
      }
    }
  },
  methods: {
    fieldSelect(subfield) {
      this.subfield = subfield;
    },
    bindSetting(settings) {
      console.log(settings);
      this.$emit("bind-setting", settings);
    },
    bindCancel() {
      this.$emit("bind-cancel");
    },
    bindDone(bindings) {
      var binding = this.changeContextRegion(bindings, this.region[0], this.localSetting)
      var bindSettings = {
        loopDirection: this.localSetting.loopDirection,
        withHeader: this.localSetting.withHeader,
        withFooter: this.localSetting.withFooter,
        linesPerRecord: this.localSetting.linesPerRecord,
        headerLines: this.localSetting.headerLines,
        footerLines: this.localSetting.footerLines,
        subfields: binding
      };
      var bindRegions = this.createExportRegion(this.region[0]);
      var regionBinding = {
        field: this.field,
        region: bindRegions,
        settings: bindSettings
      };
      this.$emit("bind", regionBinding);
    },
    changeContextRegion(bindings, region, setting) {
      var arrayBindings = [];
      for (var i = 0; i <= bindings.length - 1; i++) {
        var bingRegion = bindings[i].region[0];
        var bindingRegion = this.createContextRegion(bingRegion, region, setting);
        var bindingSettings = {
          field: bindings[i].field,
          region: bindingRegion,
          settings: bindings[i].settings
        }
        if (bindings[i].field.type === "region") {
          var childBindings = [];
          if (bindings[i].settings && bindings[i].settings.length > 0) {
            childBindings.push(this.changeContextRegion(bindings[i].settings, region, setting));
          }
          arrayBindings.push(childBindings);
        } else {
          arrayBindings.push(bindingSettings);
        }
      }
      return arrayBindings;
    },
    createContextRegion(bingRegion, region, setting) {
      if (setting.loopDirection === "vertical") {
        return {
          name: region.name,
          type: "context",
          value: {
            start: {
              row: bingRegion.start.row - region.start.row - setting.headerLines,
              col: bingRegion.start.col - region.start.col
            },
            end: {
              row: bingRegion.end.row - region.start.row - setting.headerLines,
              col: bingRegion.end.col - region.start.col
            }
          }
        }
      } else {
        return {
          name: region.name,
          type: "context",
          value: {
            start: {
              row: bingRegion.start.row - region.start.row,
              col: bingRegion.start.col - region.start.col - setting.headerLines
            },
            end: {
              row: bingRegion.end.row - region.start.row,
              col: bingRegion.end.col - region.start.col - setting.headerLines
            }
          }
        }
      }
    },
    createExportRegion(region) {
      return {
        name: region.name,
        type: "absolute",
        value: {
          sheetIndex: region.sheetIndex,
          sheetName: region.selectionName,
          start: {
            row: region.start.row,
            col: region.start.col
          },
          end: {
            row: region.end.row,
            col: region.end.col
          }
        }
      }
    },
    createHeaderRegion(region, setting, className) {
      if (setting.loopDirection === "vertical") {
        return {
          sheetIndex: region.sheetIndex,
          start: { row: region.start.row, col: region.start.col },
          end: {
            row: region.start.row + setting.headerLines - 1,
            col: region.end.col
          },
          className: className
        };
      } else {
        return {
          sheetIndex: region.sheetIndex,
          start: { row: region.start.row, col: region.start.col },
          end: {
            row: region.end.row,
            col: region.start.col + setting.headerLines - 1
          },
          className: className
        };
      }
    },
    createFooterRegion(region, setting, className) {
      if (setting.loopDirection === "vertical") {
        return {
          sheetIndex: region.sheetIndex,
          start: {
            row: region.end.row - setting.footerLines + 1,
            col: region.start.col
          },
          end: { row: region.end.row, col: region.end.col },
          className: className
        };
      } else {
        return {
          sheetIndex: region.sheetIndex,
          start: {
            row: region.start.row,
            col: region.end.col - setting.footerLines + 1
          },
          end: { row: region.end.row, col: region.end.col },
          className: className
        };
      }
    },
    createFirstRecord(region, setting, className) {
      if (setting.loopDirection === "vertical") {
        return {
          sheetIndex: region.sheetIndex,
          start: {
            row:
              region.start.row + (setting.withHeader ? setting.headerLines : 0),
            col: region.start.col
          },
          end: {
            row:
              region.start.row +
              (setting.withHeader ? setting.headerLines : 0) +
              setting.linesPerRecord -
              1,
            col: region.end.col
          },
          className: className
        };
      } else {
        return {
          sheetIndex: region.sheetIndex,
          start: {
            row: region.start.row,
            col:
              region.start.col + (setting.withHeader ? setting.headerLines : 0)
          },
          end: {
            row: region.end.row,
            col:
              region.start.col +
              (setting.withHeader ? setting.headerLines : 0) +
              setting.linesPerRecord -
              1
          },
          className: className
        };
      }
    },
    createBodyRegion(region, setting, className) {
      if (setting.loopDirection === "vertical") {
        return {
          sheetIndex: region.sheetIndex,
          start: {
            row:
              region.start.row + (setting.withHeader ? setting.headerLines : 0),
            col: region.start.col
          },
          end: {
            row:
              region.end.row - (setting.withFooter ? setting.footerLines : 0),
            col: region.end.col
          },
          className: className
        };
      } else {
        return {
          sheetIndex: region.sheetIndex,
          start: {
            row: region.start.row,
            col:
              region.start.col + (setting.withHeader ? setting.headerLines : 0)
          },
          end: {
            row: region.end.row,
            col: region.end.col - (setting.withFooter ? setting.footerLines : 0)
          },
          className: className
        };
      }
    }
  }
};
</script>
