<template>
  <div>
    <span :gutter="20" v-for="(property,index) in properties" :key="index">
          <el-input v-if="editingIndex!=null && editingIndex=== index" placeholder="属性值" v-model="editing.value" @change="change" class="input-with-select">
             <el-select slot="prepend"
              style="width:130px"
              v-model="editing.key"
              @change="change()"
              filterable
              allow-create
              default-first-option
              placeholder="请输入属性名">
              <el-option
                v-for="item in []"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span slot="append">
              <el-button icon="el-icon-save" @click="saveItem">保存</el-button>
              <el-button icon="el-icon-cancel" @click="cancelItem(index)">取消</el-button>
            </span>
          </el-input>
          <span v-else style="margin-left: 10px;" @dblclick="edit(index)">
            <el-tag closable @close="deleteItem(index)">{{`${property.key}: ${property.value}`}}</el-tag>
          </span>
      </span>
    <el-button v-if="editingIndex == null && editable" class="button-new-tag" size="small" @click="addNew">+ 新增</el-button>
  </div>
</template>

<script>
export default {
  name: "properties",
  props: {
    value: {
      type: [Object, Array]
    },
    editable: {
      type: Boolean,
      default: true
    },
    opt: Boolean
  },
  data() {
    return {
      properties: [],
      editing: {},
      editingIndex: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.properties = !Array.isArray(this.value)
        ? this.convertMapListToArray(this.value)
        : this.value;
      if (
        this.editingIndex != null &&
        this.editingIndex >= this.properties.length
      ) {
        this.editingIndex = null;
      }
    },
    addNew() {
      this.properties.push({ key: "", value: "" });
      this.editing = { key: "", value: "", newItem: true };
      this.editingIndex = this.properties.length - 1;
    },
    edit(index) {
      this.editing = JSON.parse(JSON.stringify(this.properties[index]));
      this.editingIndex = index;
    },
    saveItem() {
      if (this.editing.key != null && this.editing.key.length > 0) {
        this.properties[this.editingIndex] = {
          key: this.editing.key,
          value: this.editing.value
        };
        this.$emit("change", this.convertToMultipleValueMap(this.properties));
        this.$emit("input", this.convertToMultipleValueMap(this.properties));
        this.addNew();
      }
    },
    cancelItem(index) {
      if (this.editing.newItem === true) {
        this.properties.splice(index, 1);
      }
      this.editingIndex = null;
    },
    deleteItem(index) {
      this.properties.splice(index, 1);
      this.editingIndex = null;
      this.$emit("change", this.convertToMultipleValueMap(this.properties));
      this.$emit("input", this.convertToMultipleValueMap(this.properties));
    },
    change() {
      this.$emit("change", this.convertToMultipleValueMap(this.properties));
      this.$emit("input", this.convertToMultipleValueMap(this.properties));
    },
    convertToMultipleValueMap(props) {
      if (Array.isArray(props)) {
        return props.reduce(function(rv, x) {
          (rv[x.key] = rv[x.key] || []).push(x.value);
          return rv;
        }, {});
      } else {
        return {};
      }
    },
    convertMapListToArray(props) {
      console.debug("convertMapListToArray");
      console.debug(props);
      var temp = [];
      for (let key in props) {
        console.debug(key);
        console.debug(props[key]);
        if (Array.isArray(props[key])) {
          temp = temp.concat(
            props[key].map(v => {
              return { key: key, value: v };
            })
          );
        }
      }
      console.debug(temp);
      return temp;
    }
  },
  watch: {
    opt(v) {
      this.init();
    }
  }
};
</script>

<style scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
