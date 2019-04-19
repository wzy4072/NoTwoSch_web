<template>
  <span>
    <!-- :on-remove="handleRemove" -->
    <span class="uptitle">{{upInfo.name}}附件：</span>
    <el-upload
      class="up-bt"
      action="/api/upload/test"
      multiple
      :file-list="fileList"
      :before-upload="beforeUpload"
      :limit="upInfo.fileCount"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <span
        slot="tip"
        class="upload-limit"
      >最多上传{{upInfo.fileCount}}个附件，支持{{fileTypeLimit.join('、')}}格式，单个附件最大为{{upInfo.singleFileSize}}MB</span>
    </el-upload>
  </span>
</template>
<script>
import eventHub from "./eventHub.js";
export default {
  props: ["upInfo", "name", "where"],
  data() {
    return {
      fileTypeLimit: ["image/jpeg", "image/png"],
      fileList: [],
      subFilesInfo: []
    };
  },
  created() {
    eventHub.$on("submit", a => {
      // 收到广播就丢值出去
      const filesInfo = this.initFilesInfo();
      const promiseFiles = new Promise((rs, rj) => {
        // filesInfo.length > 0 ? rs() : rj();
        rs();
      })
        .then(() => {
          return filesInfo;
        })
        .catch(e => {
          return { msg: "至少应有一个附件！" };
          this.$message.error(e);
        });
      eventHub.$emit("files", promiseFiles, this.where);
    });
  },
  methods: {
    // 根据this.fileList 组装接口需要的数据
    initFilesInfo() {
      this.subFilesInfo = [];
      const keys = [
        "applyRecordId",
        "attName",
        "attSize",
        "attType",
        "attUrl",
        "checkDetailId",
        "checkItemId",
        "checkDetailLine",
        "thumbnaiUrl"
      ];
      this.fileList.map(file => {
        file = Object.assign({}, this.upInfo, file);
        let cFile = {};
        keys.map(k => {
          cFile[k] = file[k];
        });
        this.subFilesInfo.push(cFile);
      });
      return this.subFilesInfo;
    },
    // 上传前验证
    beforeUpload(file) {
      const jsLtType = this.fileTypeLimit.includes(file.type); // 暂时写死
      const isLtSize = file.size / 1024 / 1024 < this.upInfo.singleFileSize;
      if (!jsLtType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLtSize) {
        this.$message.error(`上传头像图片大小不能超过 ${this.upInfo.size}MB!`);
      }
      return jsLtType && isLtSize;
    },
    // 个数超限
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${upInfo.fileCount} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 上传成功
    handleSuccess(res, file) {
      file.response.data.name = file.response.data.attName;
      this.fileList.push(file.response.data);
    }
  }
};
</script>
<style scoped>
.up-bt {
  display: inline;
}
.upload-limit {
  font-size: 14px;
  color: #606266;
  margin-left: 8px;
}
</style>

