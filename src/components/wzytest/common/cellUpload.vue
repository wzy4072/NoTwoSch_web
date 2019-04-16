<template>
  <span>
    <!-- :on-remove="handleRemove" -->
    <span class="uptitle">{{name}}附件：</span>
    <el-upload
      class="up-bt"
      action="baseurl+xxxx"
      multiple
      :before-upload="beforeAvatarUpload"
      :limit="upInfo.limit"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <span
        slot="tip"
        class="upload-limit"
      >最多上传{{upInfo.limit}}个附件，支持{{fileTypeLimit.join('、')}}格式，单个附件最大为{{upInfo.size}}MB</span>
    </el-upload>
  </span>
</template>
<script>
// upInfo:{
//   limit:3,
//   fileList:[],
//   size:5
// }

export default {
  props: ["upInfo", "name"],
  data() {
    return {
      fileTypeLimit: ["image/jpeg", "image/png"],
      fileList: []
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const jsLtType = this.fileTypeLimit.includes(file.type); // 暂时写死
      const isLtSize = file.size / 1024 / 1024 < this.upInfo.size;

      if (!jsLtType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLtSize) {
        this.$message.error(`上传头像图片大小不能超过 ${this.upInfo.size}MB!`);
      }
      return jsLtType && isLtSize;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${upInfo.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    }
  }
};
</script>
<style scoped>
.uptitle {
}
.up-bt {
  display: inline;
}
.upload-limit {
  font-size: 14px;
  color: #606266;
  margin-left: 8px;
}
</style>

