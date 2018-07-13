<template>
  <div>
    <el-tabs v-if="data" v-model="currentSheet" tab-position="bottom" type="border-card" @tab-click="sheetClick">
      <el-tab-pane v-for="(sheet, seq) in data.sheets" :key="seq" :label="sheet.name" :name="sheet.name" style="margin: -15px">
        <sheet :ref="name+'_sheet_'+seq"
          :root="name+'_sheet_' + seq" :settings="settings[seq]"
          style="height: 400px; width: 100%; overflow: hidden;"
          data-originalstyle="height: 400px; width: 100%; overflow: hidden;"
          @table="gotTable(seq, $event)"></sheet>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HandsonTable from "handsontable";
import { displayRegion } from "./helper";
import Sheet from "./sheet";

export default {
  name: "ExcelPreview",
  props: {
    name: String, // HandsonTable 控件唯一名字
    data: Object, // 预览数据 (see ExcelData structure)
    region: Array, // effective region (special red-border highlight)
    customRegion: Array
  },
  components: {
    Sheet
  },
  data() {
    return {
      currentSheet: null,
      hot: [],
      excelSelection: []
    };
  },
  created() {
    this.currentSheet = this.initSheet;
  },
  mounted() {
    console.log("Mounted");
    if (this.data) {
      console.log("Mounted: with data");
      this.resetSelection();
      this.updateCustomRegion();
    }
  },
  watch: {
    customRegion(val) {
      this.updateCustomRegion();
    },
    data(val) {
      console.log("Data Changed");
      console.log(val);
      if (val) {
        this.currentSheet = this.initSheet;
        this.$nextTick(() => {
          this.resetSelection();
          this.updateCustomRegion();
        });
      }
    }
  },
  computed: {
    initSheet() {
      return this.data && this.data.sheets && this.data.sheets.length > 0
        ? this.data.sheets[0].name
        : null;
    },
    sheetNames() {
      return this.data && this.data.sheets
        ? this.data.sheets.map(s => s.name)
        : [];
    },
    currentSheetIndex() {
      return this.sheetNames.indexOf(this.currentSheet);
    },
    settings() {
      return this.createSettings(this.data);
    }
  },
  methods: {
    gotTable(seq, tab) {
      this.hot[seq] = tab;
      // hook our selection handler
      HandsonTable.hooks.add("afterSelectionEnd", this.excelSelect, tab);
    },
    sheetClick(name) {
      this.$emit("sheet", name);
    },
    excelSelect(r, c, r2, c2, selectionLayerLevel) {
      if (this.excelSelection && this.excelSelection[this.currentSheetIndex]) {
        this.excelSelection[this.currentSheetIndex].splice(selectionLayerLevel);
      } else {
        this.excelSelection[this.currentSheetIndex] = [];
      }
      var obj = {
        sheetIndex: this.currentSheetIndex,
        start: { row: r, col: c },
        end: { row: r2, col: c2 }
      };

      // additional display name
      var name = displayRegion(this.sheetNames, obj);
      obj.selectionName = name;

      this.excelSelection[this.currentSheetIndex].push(obj);

      this.$emit("select", this.excelSelection);
    },
    updateCustomRegion() {
      if (this.hot && this.hot.length > 0) {
        if (this.previousCustomRegion) {
          this.previousCustomRegion.forEach(region => {
            if (this.hot[region.sheetIndex]) {
              for (var row = region.start.row; row <= region.end.row; row++) {
                for (var col = region.start.col; col <= region.end.col; col++) {
                  this.hot[region.sheetIndex].setCellMeta(
                    row,
                    col,
                    "className",
                    ""
                  );
                }
              }
            }
          });
        }
        if (this.customRegion) {
          this.customRegion.forEach(region => {
            if (this.hot[region.sheetIndex]) {
              for (var row = region.start.row; row <= region.end.row; row++) {
                for (var col = region.start.col; col <= region.end.col; col++) {
                  this.hot[region.sheetIndex].setCellMeta(
                    row,
                    col,
                    "className",
                    region.className
                  );
                }
              }
            }
          });
        }
        this.hot.forEach(h => h.render());
        this.previousCustomRegion = this.customRegion;
      }
    },
    resetSelection() {
      this.excelSelection = [];
    },
    createBorders(sheetIdx, regions) {
      if (regions) {
        return regions
          .filter(region => region.sheetIndex === sheetIdx)
          .map(region => {
            return {
              range: {
                from: { row: region.start.row, col: region.start.col },
                to: { row: region.end.row, col: region.end.col }
              },
              top: { width: 2, color: region.color ? region.color : "red" },
              left: { width: 2, color: region.color ? region.color : "red" },
              bottom: { width: 2, color: region.color ? region.color : "red" },
              right: { width: 2, color: region.color ? region.color : "red" }
            };
          });
      } else {
        return undefined;
      }
    },
    createSettings(data) {
      if (data && data.sheets) {
        return data.sheets.map((sheet, idx) => {
          return {
            data: sheet.values,
            mergeCells: sheet.mergedCells,
            colHeaders: true,
            rowHeaders: true,
            readOnly: true,
            outsideClickDeselects: false,
            customBorders: this.createBorders(idx, this.region),
            colWidths: sheet.colWidths,
            manualColumnResize: true,
            manualRowResize: true,
            autoRowSize: true
          };
        });
      } else {
        return [];
      }
    }
  }
};
</script>
<style>
.recordHeader {
  background: #d0d0d0 !important;
}
.recordFooter {
  background: #d0d0d0 !important;
}
.recordBody {
  background: lightgreen !important;
}
</style>
