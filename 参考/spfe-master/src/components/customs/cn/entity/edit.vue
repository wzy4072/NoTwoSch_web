<template>
    <div v-if="dataReady">
        <h2>{{ id == null || id== '' ? '新建收发货人' : '编辑收发货人'}}</h2>
        <el-form ref="entityForm" :model="entity" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="编码" prop="code"><el-input v-model="entity.code" ></el-input></el-form-item>
          <el-form-item label="统一社会信用代码" prop="unifiedCode"><el-input v-model="entity.unifiedCode" ></el-input></el-form-item>
          <el-form-item label="名称" prop="name"><el-input v-model="entity.name" ></el-input></el-form-item>
          <el-form-item label="合同地址" prop="address"><el-input v-model="entity.address" ></el-input></el-form-item>
          <el-form-item label="合同电话" prop="tel"><el-input v-model="entity.tel" ></el-input></el-form-item>
          <el-form-item label="通关期限" prop="validUntil">
            <el-date-picker v-model="entity.validUntil" type="date" placeholder="选择日期" size="small"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同公章" prop="chop">
            <el-upload
            drag
            :action="action"
            :data="extra"
            :on-change="uploadStatusHook"
            :before-upload="beforeUpload"
            with-credentials
            >
            <avatar :id="entity.chop" name="章" :size="100"></avatar>
             <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.prevent="save">{{ id == null || id == '' ? '创建' : '保存'}}</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from "./api/entity";
import endpoint from "@/api/endpoint.js";
import dateutils from "@/mixins/dateutils";

export default {
  name: "CustomsCnEntityEdit",
  mixins: [dateutils],
  props: {
    id: String,
    action: {
      type: String,
      default: endpoint.url() + "/resource"
    }
  },
  data: function() {
    return {
      dataReady: false,
      entity: {
        code: null,
        unifiedCode: null,
        name: null,
        address: null,
        tel: null,
        validUntil: null,
        chop: null
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入"
          }
        ]
      }
    };
  },
  methods: {
    save() {
      this.$refs["entityForm"].validate(valid => {
        if (!valid) {
          this.$message.error("请修正表单问题");
        } else {
          var data = {
            id: this.id,
            code: this.entity.code,
            unifiedCode: this.entity.unifiedCode,
            name: this.entity.name,
            address: this.entity.address,
            tel: this.entity.tel,
            validUntil: this.jsDateToEpoch(this.entity.validUntil),
            chop: this.entity.chop
          };
          api
            .save(this.id, data)
            .then(() => {
              this.$router.push("/customs/cn/entity");
            })
            .catch(err => {
              this.$message.error(JSON.stringify(err));
            });
        }
      });
    },
    // cancel() {
    //   this.$router.push("/customs/cn/entity");
    // },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadStatusHook(file, fileList) {
      if (file.status && file.status !== "uploading") {
        console.log(file, fileList);
      }
      if (file.status && file.status === "done") {
        console.log(file.name + " 上传成功.");
        console.log("Resource ID: " + file.response.id);
        this.entity.chop = file.response.id;
      } else if (file.status && file.status === "fail") {
        this.$message.error(file.name + "上传失败!");
      }
    }
  },
  computed: {
    extra() {
      return {
        sid: null // endpoint.current_sid()
      };
    }
  },
  created() {
    if (this.id !== undefined && this.id !== null) {
      api
        .load(this.id)
        .then(data => {
          this.entity = data;
          this.entity.validUntil = this.jsDate(data.validUntil);
          this.dataReady = true;
        })
        .catch(err => {
          console.log(err);
          this.$message.error(JSON.stringify(err));
        });
    } else {
      this.entity = {
        code: null,
        unifiedCode: null,
        name: null,
        address: null,
        tel: null,
        validUntil: null,
        chop: null
      };
      this.dataReady = true;
    }
  }
};
</script>
