<template>
  <div>
    <h2>数据审阅</h2>
    <hr>
    <div v-for="(val1, key1, idx1) in previewData" :key="idx1">
      <div v-for="(val2, key2, idx2) in val1" :key="idx2">
        <span style="font-size:18px">{{schemaChange(key2)}}</span>
        <el-table v-if="isArray(val2) && val2.length > 0" :data="val2" style="width: 100%">
          <div v-for="(val3, key3, idx3) in val2[0]" :key="idx3">
              <el-table-column :prop="key3" :label="schemaChange(key3)">
                <template slot-scope="scope">
                  <el-table v-if="typeof(scope.row[scope.column.property]) !== 'string'" :data="scope.row[scope.column.property]">
                    <div v-for="(val4, key4, idx4) in scope.row[scope.column.property][0]" :key="idx4">
                      <el-table-column :prop="key4" :label="schemaChange(key4)"></el-table-column>
                    </div>
                  </el-table>
                  <div v-else >
                    {{scope.row[scope.column.property]}}
                  </div>
                </template>
                <!-- tableColumn: xxx递归方式嵌套表未解决 -->
                <!-- <tableColumn v-if="isArray(val3) && val3.length > 0" :model="val3" :field="field"></tableColumn> -->
              </el-table-column>
          </div>
        </el-table>
        <span v-else style="font-size:15px"> : {{val2}}</span>
      </div>
    </div>
    <el-button >取 消</el-button>
    <el-button type="primary" >确 定</el-button>
  </div>
</template>

<script>
import api from "./api";
export default {
  name: "CheckView",
  props: {
    id: String,
    schema: String
  },
  data() {
    return {
      previewData: null,
      field: {}
    };
  },
  methods: {
    schemaChange(name) {
      if (name === this.field.name) {
        return this.field.desc;
      } else {
        return this.createdValue(this.field.subfields, name);
      }
    },
    createdValue(subfields, name) {
      var desc = "";
      if (subfields && subfields.length > 0) {
        for (var i = 0; i < subfields.length; i++) {
          if (subfields[i].name === name) {
            desc = subfields[i].desc;
            break;
          }
          if (subfields[i].subfields && subfields[i].subfields.length > 0) {
            desc = this.createdValue(subfields[i].subfields, name);
          }
        }
      }
      return desc;
    },
    isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
  },
  created() {
    Promise.all([
      api.getExcelPreview(this.id).then(data => (this.previewData = [data])),
      api.getExcelSchema(this.schema).then(data => (this.field = data))
    ]).catch(err => {
      this.$message(err);
    });
  }
};
</script>
