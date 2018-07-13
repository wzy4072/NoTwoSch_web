<template>
    <span style="display: inline-block; width: 100%;">
        <div v-if="(clickEdit && !editing)">
            <a @click="editOn">{{displayLabel(number, seqNo) || "未设置"}}</a>
        </div>
        <div v-if="(clickEdit && editing) || !clickEdit">
        <el-row v-if="!display">
            <el-col :span="16">
                手册：
                 <el-select
                  v-if="dataReady"
                  filterable
                  v-model="number"
                  @change="changeNumber"
                  clearable
                  @filter-method="queryNumber"
                  style="width: 80%;"
                  >
                    <el-option
                      v-for="(item, index) in numberOptions"
                      :key="index"
                      :value="item.number"
                      >
                      <span style="display: inline-block; width: 80px">{{item.number}}</span>
                      <span style="display: inline-block; width: 100px">{{item.type}}</span>
                      <span style="display: inline-block; width: 100px">{{item.businessEntity.name}}</span>
                    </el-option>
                  </el-select>
            </el-col>
            <el-col :span="8">
                项号：
                <el-select
                v-if="dataReadySeqNo"
                :disabled="number == null || number == ''"
                clearable
                filterable
                value-key="seqNo"
                v-model="seqNo"
                @change="changeSeqNo"
                style="width: 80%;"
                >
                 <el-option
                  v-for="(item, index) in seqNoOptions"
                  :key="index"
                  :value="item"
                  :label="item.seqNoStr"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <span v-if="display">{{displayLabel(value.number, value.seqNo)}}</span>
        </div>
    </span>
</template>

<script>
import api from "./api/registry";

export default {
  name: "RegistryItemSelect",
  props: {
    value: Object, // registry item identifier { number: "xxx", seqNo: "yyy" }
    display: Boolean,
    hscode: String, // filter select item
    size: String, // sm / lg
    clickEdit: Boolean,
    editMode: Boolean
  },
  data() {
    return {
      editing: this.editMode != null ? this.editMode : !this.clickEdit,
      number: this.value != null ? this.value.number : null,
      seqNo: this.value != null ? this.value.seqNo : null,
      numberOptions: [],
      seqNoOptions: [],
      dataReady: false,
      dataReadySeqNo: false
    };
  },
  methods: {
    editOn() {
      console.log("Change to editing...");
      this.editing = true;
    },
    changeNumber() {
      console.log("Number Changed: " + this.number);
      var obj = {
        number: this.number,
        seqNo: null
      };
      if (this.number === undefined || this.number === null || this.number === "") {
        this.editing = false;
      }
      this.$emit("input", obj);
    },
    changeSeqNo(opt) {
      console.log("SeqNo Changed: " + JSON.stringify(opt));
      if (opt != null) {
        var obj = {
          number: this.number,
          seqNo: opt.seqNo
        };
        this.$emit("input", obj);
        this.$emit("registry-item", opt);
      } else {
        var obj2 = {
          number: this.number,
          seqNo: null
        };
        this.$emit("input", obj2);
        this.$emit("registry-item", null);
      }
      this.editing = false;
    },
    displayLabel(n, s) {
      if (n === undefined || n === null || n === "") {
        return null;
      }
      if (n !== null) {
        if (s !== null && s !== "") {
          return n + "/" + s;
        } else {
          return n + " (项号未选)";
        }
      }
    },
    initVal(value) {
      this.number = value != null ? value.number : null;
      this.seqNo = value != null ? value.seqNo : null;
    },
    queryNumber(q) {
      this.dataReady = false;
      return api.list(q, 1, 30, null).then(data => {
        this.numberOptions = data.result;
        this.dataReady = true;
        return data.result;
      });
    },
    querySeqNo() {
      console.log("Query SeqNo for " + this.number);
      console.log(this.numberOptions);
      let _this = this;
      this.dataReadySeqNo = false;
      var lookup = this.numberOptions.filter(n => n.number === this.number);
      var mylookup = this.numberOptions.filter(n => n.number === _this.number);
      console.log(lookup);
      console.log(mylookup);
      console.log('mylookup');
      if (lookup.length === 0) {
        this.dataReadySeqNo = true;
        return;
      }
      return api.load(lookup[0].id).then(data => {
        console.log("Loaded: ");
        console.log(data.details);
        if (this.hscode === undefined || this.hscode === null || this.hscode === "") {
          this.seqNoOptions = data.details.map(d => {
            d.seqNoStr = "" + d.seqNo;
            return d;
          });
        } else {
          this.seqNoOptions = data.details
            .filter(d => d.hsCode === this.hscode)
            .map(d => {
              d.seqNoStr = "" + d.seqNo;
              return d;
            });
        }
        this.dataReadySeqNo = true;
        return this.seqNoOptions;
      });
    }
  },
  watch: {
    value(val) {
      this.initVal(val);
    },
    hscode(val) {
      this.querySeqNo();
    },
    number(val) {
      this.querySeqNo();
    }
  },
  created() {
    this.queryNumber(null).then(() => {
      this.querySeqNo();
    });
  }
};
</script>
