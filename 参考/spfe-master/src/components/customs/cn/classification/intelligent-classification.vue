<template>
  <div style="padding:0 20px;">
    <el-form :inline="true" label-width="80px" size="mini">
      <el-form-item label="品名搜索">
        <el-autocomplete
              v-model="keyword"
              :fetch-suggestions="searchKeyword"
              placeholder="请输入内容"
              @select="keywordSelect">
          <template slot-scope="props">
            <div>{{ props.item }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="keywordSearch">查询</el-button>
      </el-form-item>
      <div v-if="names.length > 0">
        <el-steps :active="activeStep" finish-status="success">
          <el-step title="品名"></el-step>
          <el-step title="申报要素"></el-step>
          <el-step title="补充信息"></el-step>
        </el-steps>
        <div style="padding-top: 20px">
          <el-tag v-if="name != null" type="success" closable  @close="nameClose" class="selectedTag"> {{name.name}}:{{name.value}}</el-tag>
          <el-tag v-for="(p, idx) in selectElements" :key="p.name" type="success" closable  @close="elementClose(idx, p)" class="selectedTag">{{p.name}}: {{p.value}}</el-tag>
          <el-tag v-for="(p, idx) in selectExtras" :key="p.name" type="success" closable  @close="extrasClose(idx, p)" class="selectedTag">{{p.name}}: {{p.value}}</el-tag>
          <el-tag v-for="(p, idx) in selectSpecElse" :key="p.name" type="success" closable  @close="specClose(idx, p)" class="selectedTag">{{p.name}}: {{p.value}}</el-tag>
        </div>
        <div style="padding-top: 20px" v-loading="loading">
          <div v-if="activeStep === 0">
            <el-row>
              <el-col :span="4">品名</el-col>
              <el-col :span="20"><el-button v-for="tag in names" :key="tag" style="margin-bottom: 6px;" type="success" size="mini" @click="nameClick(tag)">{{tag}}</el-button></el-col>
            </el-row>
          </div>
          <div v-if="activeStep === 1">
            <el-row v-for="(elm, seq) in elements" :key="seq" :gutter="10">
              <el-col :span="4">{{elm.name}}</el-col>
              <el-col :span="16">
                <div v-if="!elements[seq].custom">
                  <el-button v-for="(tag, tagidx) in elm.values" :key="tagidx" style="margin-bottom: 6px;" type="success" size="mini"  @click="elementClick(seq, elm.name, tag.value, tag.hscodes)">{{tag.value}}</el-button>
                </div>
                <div v-if="elements[seq].custom">
                  <el-input v-model="elements[seq].value" size="mini" style="width: 300px"></el-input>
                  <el-button @click="saveCustomElement(seq)" size="mini">保存</el-button>
                  <el-button @click="cancelCustomElement(seq)" size="mini">返回点选</el-button>
                </div>
              </el-col>
              <el-col :span="4"><el-button @click="defineElement(seq)" size="mini">自定义</el-button></el-col>
            </el-row>
          </div>
          <div v-if="activeStep === 2">
            <el-row v-for="(elm, seq) in extras" :key="seq" :gutter="10">
              <el-col :span="4">{{elm.name}}</el-col>
              <el-col :span="16">
                <div v-if="!extras[seq].custom">
                  <el-button v-show="!elm.values.length > 10" v-for="(tag, extidx)  in elm.values" :key="extidx" style="margin-bottom: 6px;" type="success" size="mini" @click="extraClick(seq, elm.name, tag.value, tag.hscodes)">{{tag.value}}</el-button>
                  <el-select  v-show="elm.values.length > 10"  v-model="elm.selValue" filterable placeholder="请选择" size="mini" @change="selectCustomExtra(seq)" style="width:100%;">
                    <el-option
                      v-for="(tag, extidx)  in elm.values"
                      :key="extidx"
                      :label="tag.value"
                      :value="tag.value">
                    </el-option>
                  </el-select>
                </div>
                <div v-if="extras[seq].custom">
                  <el-input v-model="extras[seq].value" size="mini" style="width: 300px"></el-input>
                  <el-button @click="saveCustomExtra(seq)" size="mini">保存</el-button>
                  <el-button @click="cancelCustomExtra(seq)" size="mini">返回点选</el-button>
                </div>
              </el-col>
              <el-col :span="4"><el-button @click="defineExtra(seq)" size="mini">自定义</el-button></el-col>
            </el-row>
          </div>
          <el-row v-for="(spec, spidx) in specElse" :key="spidx" v-show="specElse.length > 0">
              <el-col  :span="4">{{spec.name}}</el-col>
              <el-col  :span="16">
                <span v-if="spec.name == '品牌类型'">
                  <el-select v-model="spec.value" size="mini" style="width: 300px">
                    <el-option label="0-无品牌" value="0"></el-option>
                    <el-option label="1-境内自主品牌" value="1"></el-option>
                    <el-option label="2-境内收购品牌" value="2"></el-option>
                    <el-option label="3-境外品牌(贴牌生产)" value="3"></el-option>
                    <el-option label="4-境外品牌(其他)" value="4"></el-option>
                  </el-select>
                </span>
                <span v-else-if="spec.name == '出口享惠情况'">
                  <el-select v-model="spec.value" size="mini" style="width: 300px">
                    <el-option label="0-出口货物在最终目的国不享惠" value="0"></el-option>
                    <el-option label="1-出口货物在最终目的国享受优惠关税" value="1"></el-option>
                    <el-option label="2-生产销售单位尚未确定货物享惠情况" value="2"></el-option>
                    <el-option label="3-不适用于进口报关单" value="3"></el-option>
                  </el-select>
                </span>
                <span v-else>
                  <el-input  v-model="spec.value" size="mini" style="width: 300px"></el-input>
                </span>
                <el-button @click="saveSpecElse(spidx)" size="mini">保存</el-button>
              </el-col>
            </el-row>
        </div>
        <div v-show="done && activeStep === 3" >
          {{ accountHscodes.length>1 ? '请选择' : '请确认'}}HScode:
          <el-button v-for="(code, codeidx) in accountHscodes" :key="codeidx" type="danger" plain round size="small" @click="ensureHscode(code)">{{code}}</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import api from "./api/sku.js";
export default {
  name: "IntelligentClassification",
  props: {
    initKeyword: String
  },
  data() {
    return {
      loading: false,
      keyword: this.initKeyword,
      done: false,
      activeStep: 0,
      productNameList: [],
      name: null,
      selectElements: [],
      selectExtras: [],
      selectSpecElse: [],
      names: [],
      elements: [],
      extras: [],
      specElse: [],
      accountHscodes: [],
      value8: ""
    };
  },
  methods: {
    init() {
      this.done = false;
      this.names = [];
      this.name = null;
      this.selectElements = [];
      this.elements = [];
      this.selectExtras = [];
      this.activeStep = 0;
      this.selectSpecElse = [];
      this.specElse = [];
    },
    searchKeyword(w, cb) {
      if (w) {
        this.getProducts().then(nameList => {
          cb(nameList);
        });
      } else {
        this.names = [];
        cb(this.names);
      }
    },
    keywordSelect(w) {
      this.keyword = w;
      this.keywordSearch();
    },
    keywordSearch() {
      if (this.keyword) {
        this.getProducts().then(nameList => {
          this.names = nameList;
        });
      } else {
        this.$message("关键词不能为空！");
      }
    },
    getProducts() {
      this.init();
      this.loading = true;
      return api
        .getProductsName(this.keyword)
        .then(resp => {
          this.loading = false;
          if (resp.success) {
            if (resp.result.length === 0) {
              this.$message("查询到0条数据！");
              return [];
            }
            this.productNameList = resp.result;
            return resp.result.map(function(m) {
              return m.productName;
            });
          } else {
            this.$message(resp.error);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(err.message);
        });
    },
    getElementsList(filter, hscodes, specNames) {
      hscodes = hscodes || this.getFrontHSCodes();
      specNames = specNames || this.getAllSpecNames();
      this.loading = true;
      return api
        .getElementsList({
          hscodes: hscodes,
          filter: filter,
          elements: specNames
        })
        .then(resp => {
          this.loading = false;
          if (resp.success) {
            if (filter === "true" && resp.result.length > 0) {
              this.activeStep = 1;
              this.elements = resp.result;
            } else if (filter === "false" && resp.result.length > 0) {
              resp.result.map(item => (item.selValue = null));
              this.extras = resp.result;
              this.activeStep = 2;
            } else if (filter === "true" && resp.result.length === 0) {
              this.elements = [];
              this.activeStep = 2;
              this.getElementsList("false");
            } else {
              this.extras = [];
              this.activeStep = 3;
              this.fillSupplementary();
            }
          } else {
            this.$message(resp.error);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(err.message);
        });
    },
    getFrontHSCodes() {
      return this.selectExtras.length > 0
        ? this.selectExtras[this.selectExtras.length - 1].hscodes
        : this.selectElements.length > 0
          ? this.selectElements[this.selectElements.length - 1].hscodes
          : this.name.hscodes;
    },
    nameClick(value) {
      let proItem = this.productNameList.filter(
        item => item.productName === value
      );
      this.activeStep = 1;
      this.name = { name: "品名", value: value, hscodes: proItem[0].hscodes };
      this.getElementsList("true");
    },
    nameClose() {
      this.init();
      this.keywordSearch();
    },
    elementClick(idx, name, value, hscodes) {
      this.selectElements.push({ name: name, value: value, hscodes: hscodes });
      this.getElementsList("true");
    },
    elementClose(idx, p) {
      this.selectElements.splice(idx);
      this.selectExtras = [];
      this.extras = [];
      this.selectSpecElse = [];
      this.specElse = [];
      this.done = false;
      this.getElementsList("true");
    },
    defineElement(idx) {
      var c = this.elements[idx];
      c.custom = true;
      c.value = "";
      this.$set(this.elements, idx, c);
    },
    saveCustomElement(idx) {
      if (!this.elements[idx].value) {
        this.$message("不能为空！");
        return false;
      }
      this.elements[idx].custom = undefined;
      this.elements[idx].hscodes = this.getFrontHSCodes();
      this.selectElements.push({
        name: this.elements[idx].name,
        value: this.elements[idx].value,
        hscodes: this.elements[idx].hscodes
      });
      this.getElementsList("true");
    },
    cancelCustomElement(idx) {
      var c = this.elements[idx];
      c.custom = undefined;
      c.value = undefined;
      this.$set(this.elements, idx, c);
    },
    extraClick(idx, name, value, hscodes) {
      this.selectExtras.push({ name: name, value: value, hscodes: hscodes });
      this.getElementsList("false");
    },
    extrasClose(idx, p) {
      this.selectExtras.splice(idx);
      this.done = false;
      this.selectSpecElse = [];
      this.specElse = [];
      this.getElementsList("false");
    },
    defineExtra(idx) {
      var c = this.extras[idx];
      c.custom = true;
      c.value = "";
      this.$set(this.extras, idx, c);
    },
    saveCustomExtra(idx) {
      if (!this.extras[idx].value) {
        this.$message("不能为空！");
        return false;
      }
      this.extras[idx].custom = undefined;
      this.extras[idx].hscodes = this.getFrontHSCodes();
      this.selectExtras.push({
        name: this.extras[idx].name,
        value: this.extras[idx].value,
        hscodes: this.extras[idx].hscodes
      });
      this.getElementsList("false");
    },
    cancelCustomExtra(idx) {
      var c = this.extras[idx];
      c.custom = undefined;
      c.value = undefined;
      this.$set(this.extras, idx, c);
    },
    selectCustomExtra(idx) {
      let hsItem = this.extras[idx].values.filter(item => {
        return item.value === this.extras[idx].selValue;
      });
      this.selectExtras.push({
        name: this.extras[idx].name,
        value: this.extras[idx].selValue,
        hscodes: hsItem[0].hscodes
      });
      this.getElementsList("false");
    },
    getAllSpecNames() {
      let specNames = [];
      this.selectElements.concat(this.selectExtras).map(el => {
        specNames.push(el.name);
      });
      return specNames;
    },
    saveSpecElse(idx) {
      if (!this.specElse[idx].value) {
        this.$message("不能为空！");
        return false;
      }
      this.selectSpecElse.push(this.specElse[idx]);
      this.specElse.splice(idx, 1);
      if (this.specElse.length === 0) {
        this.showResult();
      }
    },
    specClose(idx) {
      this.specElse.push(this.selectSpecElse[idx]);
      this.selectSpecElse.splice(idx, 1);
    },
    loadCodeInfo(code, cb) {
      this.loading = true;
      api
        .loadCodeInfo(code)
        .then(response => {
          this.loading = false;
          cb(response.elements);
        })
        .catch(err => {
          this.loading = false;
          this.$message(err.message);
        });
    },
    // 数据库未查找到的 必填申报要素
    fillSupplementary() {
      let reminHs = this.getFrontHSCodes();
      let specNames = this.getAllSpecNames();
      let eleKeyList = [];
      this.specElse = [];
      reminHs.map((code, idx) => {
        this.loadCodeInfo(code, eles => {
          eles.map(ele => {
            if (
              eleKeyList.indexOf(ele.key) === -1 &&
              specNames.indexOf(ele.key) === -1
            ) {
              eleKeyList.push(ele.key);
              this.specElse.push({ name: ele.key, value: "", edit: true });
            }
          });
          if (this.specElse.length === 0 && idx === reminHs.length - 1) {
            // 没有要额外填写的必填元素信息
            this.showResult();
          }
        });
      });
    },

    // 展示归类结果
    showResult() {
      this.$message("筛选完毕，请核归类对结果！");
      this.done = true;
      this.accountHscodes = this.getFrontHSCodes();
    },
    // 确认选择
    ensureHscode(code) {
      let specs = this.selectElements.concat(
        this.selectExtras,
        this.selectSpecElse
      );
      let specsStrArr = [];
      this.loadCodeInfo(code, eles => {
        eles.map(item => {
          let notfond = true;
          for (let i = 0; i < specs.length; i++) {
            if (specs[i].name === item.key) {
              specsStrArr.push(specs[i].value);
              notfond = false;
            }
          }
          if (notfond) {
            specsStrArr.push("");
          }
        });
        let codeInfo = {
          hsCode: code,
          name: this.name.value,
          spec: specsStrArr.join("|")
        };
        this.init();
        this.$emit("getHSCode", codeInfo);
      });
    }
  }
};
</script>
<style scoped>
.el-row {
  margin-bottom: 10px;
}
.selectedTag {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
