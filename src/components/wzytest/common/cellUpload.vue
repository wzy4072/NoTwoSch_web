<template>
  <div>
    证明附件上传：
    <div>
     
      <!-- :on-remove="handleRemove" -->
      <el-upload
        class="upload-demo"
        action
        multiple
        :before-upload="beforeAvatarUpload"
        :limit="upInfo.limit"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">最多上传5个附件，支持jpp、png、doc格式，单个附件最大为10MB</div>
      </el-upload>
    </div>
  </div>
</template>
<script>
export default {
  props: ["fileList", "upInfo"],
  data() {
    return {
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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

