<template>
    <span style="display: inline-block; width: 100%;">
        <span style="display: inline-block">
        <el-select
        :disabled="disabled"
        v-if="dataReady"
        :value="entity.code"
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        value-key="code"
        :remote-method="query"
        @change="searchChange"
        >
          <el-option
          v-for="item in options"
          :key="item.code"
          :value="item">
          <span style="display: inline-block; width: 90px"><span v-if="item.id == null">新建</span> {{item.code}}</span>
          <span style="display: inline-block; width: 130px">{{item.unifiedCode}}</span>
          <span style="display: inline-block; width: 280px">{{item.name}}</span>
        </el-option>
        </el-select>

        </span>
        <span style="display: inline-block">
            <el-input :disabled="disabled || entity.id != null" type="text" v-model="entity.unifiedCode" style="width: 150px" placeholder="统一社会信用代码"></el-input>
        </span>
        <span>
            <el-input :disabled="disabled || entity.id != null" type="text" v-model="entity.name" style="width: 100%" placeholder="单位名称"></el-input>
        </span>
    </span>
</template>

<script>
import api from "./api/entity";

export default {
  name: "EntitySelect",
  props: {
    /**
     * {id: "1", code: "4403942796", unifiedCode: null, name: "日月元科技(深圳)有限公司", validUntil: null}
     */
    value: Object,
    disabled: Boolean
  },
  data() {
    return {
      entity: this.valueToData(this.value),
      dataReady: false,
      options: []
    };
  },
  methods: {
    query(q) {
      if (q != null && q.length > 0) {
        return api.list(q, 1, 10, null).then(data => {
          this.options = data.result;
          if (this.options.filter(o => o.code === q).length === 0) {
            this.options.push({
              id: null,
              code: q,
              unifiedCode: null,
              name: null
            });
          }
          return data.result;
        });
      } else {
        return Promise.resolve();
      }
    },
    searchChange(opt) {
      console.log(opt);
      if (opt != null) {
        this.entity.id = opt.id;
        this.entity.code = opt.code;
        this.entity.unifiedCode = opt.unifiedCode;
        this.entity.name = opt.name;
      } else {
        this.entity.id = null;
        this.entity.code = null;
      }
      this.$emit("input", this.entity);
    },
    valueToData(val) {
      if (val != null) {
        return JSON.parse(JSON.stringify(val));
      } else {
        return {
          code: null,
          unifiedCode: null,
          name: null
        };
      }
    },
    change() {
      this.$emit("input", this.entity);
    }
  },
  watch: {
    value(val) {
      var nv = this.valueToData(val);
      if (nv !== null && nv.code !== null && nv.code !== this.entity.code) {
        this.dataReady = false;
        this.query(nv.code).then(() => {
          this.entity = nv;
          this.dataReady = true;
        });
      } else {
        this.entity = nv;
      }
    }
  },
  created() {
    if (this.entity != null && this.entity.code != null) {
      this.query(this.entity.code).then(() => {
        this.dataReady = true;
      });
    } else {
      this.dataReady = true;
    }
  }
};
</script>
