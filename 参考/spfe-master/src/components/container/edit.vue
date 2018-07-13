<template>
    <div>
        <h2>{{id == 'new'|| id == null ? '新增容器类型': '修改容器类型'}}</h2>
          <el-form ref="containerTypeForm" :model="containerType" :rules="containerRules" label-width="100px" size="mini">
            <el-form-item label="名称" prop="name"><el-input v-model="containerType.name" placeholder="请输入名称"></el-input></el-form-item>

            <el-form-item label="体积">
                <input-volume v-model="containerType.volume" :showTitle="true"></input-volume>
            </el-form-item>

            <el-form-item label="重量">
              <input-weight v-model="containerType.weight"></input-weight>
            </el-form-item>

            <el-form-item label="编号前缀"><el-input v-model="containerType.seqPrefix" placeholder="请输入编号前缀"></el-input></el-form-item>

            <el-form-item label="">
                <el-button type="primary" :loading="loading" @click="save">确定</el-button>
                <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
          </el-form>
    </div>
</template>

<script>
import api from "./api/container";
export default {
  name: "ContainerEdit",
  props: {
    id: [String, Number]
  },
  data: function() {
    return {
      containerType: {
        id: null,
        name: null,
        volume: { length: null, width: null, height: null, unit: null },
        weight: { weight: null, unit: null }
      },
      containerRules: {
        name: [{ required: true, message: "请输入容器类型名称" }]
      },
      loading: false
    };
  },
  created() {
    this.containerType.id = this.id === "new" ? null : this.id;
    if (this.containerType.id !== null && this.containerType.id !== "") {
      api.load(this.containerType.id).then(data => {
        this.containerType = data;
      });
    }
  },
  methods: {
    save() {
      const _this = this;
      this.$refs.containerTypeForm.validate(function(valid) {
        if (valid) {
          api.save(_this.containerType).then(resp => {
            if (resp.data.success) {
              _this.$router.push("/basic/container");
            } else {
              console.log(resp.data);
            }
          });
        }
      });
    }
  }
};
</script>
