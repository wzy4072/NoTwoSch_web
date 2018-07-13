<template>
  <div>
    <transition name="el-fade-in">
      <div v-if="remainingManifest.length > 0">
        <h2>报关货物明细编辑</h2>
        <el-table :data="remainingManifest" stripe border style="width: 100%" size="mini" @selection-change="manifestSelectionChange">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="id" label="行号" width="50">
            <template slot-scope="scope">
              {{remainingManifest[scope.$index].id}}
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="物料编号" width="180">
            <template slot-scope="scope">
              <sku-select :readonly="true" v-model="remainingManifest[scope.$index].sku.id" @change="skuChanged(scope.$index, $event)" :ref="'sku_' + scope.$index"></sku-select>
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="物料名称">
            <template slot-scope="scope">
              {{remainingManifest[scope.$index].sku.name}}
            </template>
          </el-table-column>
          <el-table-column prop="qty" label="数量" width="120">
            <template slot-scope="scope">
              <el-input v-model="remainingManifest[scope.$index].qty"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="max_quantity" label="最大数量" width="120">
            <template slot-scope="scope">
              {{remainingManifest[scope.$index].max_quantity}}
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="80">
            <template slot-scope="scope">
              {{remainingManifest[scope.$index].unit}}
            </template>
          </el-table-column>
          <el-table-column prop="properties" label="属性">
            <template slot-scope="scope">
              {{remainingManifest[scope.$index].properties}}
            </template>
          </el-table-column>
        </el-table>
        <div style="padding-top: 20px">
          <el-button round size="mini" @click="generateDeclarationLines">生成报关项</el-button>
        </div>
      </div>
    </transition>

    <!-- 总价 币种 单价 原产国 目的国 征免 操作 -->
    <transition name="el-fade-in">
      <div v-if="remainDeclarationLine.length > 0">
        <h2>报关项</h2>
        <el-table :data="remainDeclarationLine" stripe border style="width: 100%" size="mini" @selection-change="declarationLineSelectionChange">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="skuId" label="物料编号" width="180">
            <template slot-scope="scope">
              <sku-select :readonly="true" v-model="remainDeclarationLine[scope.$index].skuId" @change="skuChanged(scope.$index, $event)" :ref="'sku_' + scope.$index" size="mini"></sku-select>
              {{remainDeclarationLine[scope.$index].skuName}}<br>
              <el-tag size="mini">清单行号：{{remainDeclarationLine[scope.$index].manifestLineId}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品编码/商品名称/申报要素">
            <template slot-scope="scope">
              <product-select v-model="remainDeclarationLine[scope.$index].hsCode" @product="changeHSCode(scope.$index, $event)" size="mini"></product-select>
              <el-input v-model="remainDeclarationLine[scope.$index].name" size="mini"></el-input>
              <element-value-edit :hscode="remainDeclarationLine[scope.$index].hsCode" v-model="remainDeclarationLine[scope.$index].spec" size="mini"></element-value-edit>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量及单位" width="300">
            <template slot-scope="scope">
              <div class="unit-label">
                <el-tag size="mini">成交</el-tag>
              </div>
              <div class="unit-qty">
                <el-input v-model="remainDeclarationLine[scope.$index].salesUnitQty" size="mini" @input="updateUnitPrice(scope.$index)" @blur="fixQuantity(scope.$index, 'sales')"></el-input>
              </div>
              <div class="unit-name">
                <code-select v-model="remainDeclarationLine[scope.$index].salesUnit" type="unit" size="mini"></code-select>
              </div>
              <br>
              <div class="unit-label">
                <el-tag size="mini">法一</el-tag>
              </div>
              <div class="unit-qty">
                <el-input v-model="remainDeclarationLine[scope.$index].quantity1" size="mini" @blur="fixQuantity(scope.$index, 'unit1')"></el-input>
              </div>
              <div class="unit-name">
                <code-select disabled v-model="remainDeclarationLine[scope.$index].unit1" type="unit" size="mini"></code-select>
              </div>
              <br>
              <div class="unit-label">
                <el-tag size="mini">法二</el-tag>
              </div>
              <div class="unit-qty">
                <el-input v-model="remainDeclarationLine[scope.$index].quantity2" :disabled="!remainDeclarationLine[scope.$index].unit2" size="mini" @blur="fixQuantity(scope.$index, 'unit2')"></el-input>
              </div>
              <div class="unit-name">
                <code-select disabled v-model="remainDeclarationLine[scope.$index].unit2" type="unit" size="mini"></code-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="总价和币种" width="250">
            <template slot-scope="scope">
              <div class="price">
                <el-input v-model="remainDeclarationLine[scope.$index].totalPrice" size="mini" style="width: 120px" @input="updateUnitPrice(scope.$index)" @blur="fixTotalPrice(scope.$index)"></el-input>
              </div>
              <div class="currency">
                <code-select v-model="remainDeclarationLine[scope.$index].currency" type="currency" size="mini"></code-select>
              </div>
              <el-tag size="mini">单价：{{remainDeclarationLine[scope.$index].unitPrice}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </transition>
  </div>
</template>

<script>
import api from "./api";
import numeral from "numeral";

export function fiveDP(value) {
  return numeral(numeral(value).format("0.00000")).value();
}
export function fourDP(value) {
  return numeral(numeral(value).format("0.0000")).value();
}
export function twoDP(value) {
  return numeral(numeral(value).format("0.00")).value();
}
export function fourDPString(value) {
  return numeral(value).format("0.0000");
}
export function twoDPString(value) {
  return numeral(value).format("0.00");
}

export default {
  name: "GoodsDeclarationEdit",
  props: {
    manifest: Array
  },
  data() {
    return {
      remainingManifest: this.convertManifest(this.manifest),
      remainDeclarationLine: [],
      selectedManifestLine: [],
      selectedDeclarationLine: []
    };
  },
  watch: {
    manifest(val) {
      this.remainingManifest = this.convertManifest(val);
      this.remainDeclarationLine = [];
      this.selectedManifestLine = [];
      this.selectedDeclarationLine = [];
    }
  },
  methods: {
    convertManifest(m) {
      return m.map((m, seq) => {
        var cp = JSON.parse(JSON.stringify(m));
        cp.max_quantity = m.qty;
        return cp;
      });
    },
    // return promise of declaration line
    convertDeclarationLine(m) {
      return api.convertManifestToDeclItem(
        m.map(x => {
          // do not send unnecessary fields
          var cp = JSON.parse(JSON.stringify(x));
          cp.max_quantity = undefined;
          return cp;
        })
      );
    },
    manifestSelectionChange(val) {
      this.selectedManifestLine = val;
    },
    declarationLineSelectionChange(val) {
      this.selectedDeclarationLine = val;
    },
    generateDeclarationLines() {
      // run consolidation
      this.convertDeclarationLine(this.selectedManifestLine).then(lines => {
        this.remainDeclarationLine = this.remainDeclarationLine.concat(lines);

        // remove/update quantity
        this.remainingManifest = this.remainingManifest
          .filter(
            line =>
              this.selectedManifestLine.indexOf(line) < 0 ||
              line.qty < line.max_quantity
          )
          .map(remain => {
            if (this.selectedManifestLine.indexOf(remain) >= 0) {
              var toupdate = JSON.parse(JSON.stringify(remain));
              toupdate.qty = toupdate.max_quantity - toupdate.qty;
              toupdate.max_quantity = toupdate.qty;
              return toupdate;
            } else {
              return remain;
            }
          });
      });
    },
    fixQuantity(index, field) {
      if (field === "sales") {
        this.remainDeclarationLine[index].salesUnitQty = fiveDP(
          this.remainDeclarationLine[index].salesUnitQty
        );
        this.updateUnitPrice(index);
      } else if (field === "unit1") {
        this.remainDeclarationLine[index].quantity1 = fiveDP(
          this.remainDeclarationLine[index].quantity1
        );
      } else if (field === "unit2") {
        this.remainDeclarationLine[index].quantity2 = fiveDP(
          this.remainDeclarationLine[index].quantity2
        );
      }
    },
    fixTotalPrice(index) {
      this.remainDeclarationLine[index].totalPrice = twoDP(
        this.remainDeclarationLine[index].totalPrice
      );
      this.remainDeclarationLine[index].unitPrice = fourDP(
        this.remainDeclarationLine[index].totalPrice /
          this.remainDeclarationLine[index].salesUnitQty
      );
    },
    updateUnitPrice(index) {
      this.remainDeclarationLine[index].unitPrice = fourDP(
        this.remainDeclarationLine[index].totalPrice /
          this.remainDeclarationLine[index].salesUnitQty
      );
    },
    changeHSCode(index, product) {
      this.remainDeclarationLine[index].hsCode = product.hsCode;
      this.remainDeclarationLine[index].name = product.name;
      this.remainDeclarationLine[index].unit1 = product.unit1;
      this.remainDeclarationLine[index].unit2 = product.unit2;
    }
  }
};
</script>
<style>
.unit-label {
  display: inline-block;
  width: 40px;
}
.unit-qty {
  display: inline-block;
  width: 120px;
}
.unit-name {
  display: inline-block;
  width: 100px;
}
.price {
  display: inline-block;
  width: 120px;
}
.currency {
  display: inline-block;
  width: 100px;
}
</style>
