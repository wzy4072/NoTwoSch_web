<template>
    <div>
        <el-upload
            class="upload-demo"
            drag
            :action="endpointUrl"
            multiple
            with-credentials
            :on-success="successCallback">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip"></div>
        </el-upload>
    </div>
</template>

<script>
import endpoint from "@/api/endpoint";
export default {
  name: "Upload",
  props: {
    nextUrl: String
  },
  data() {
    return {
      endpointUrl: endpoint.url() + "/resource"
    };
  },
  methods: {
    successCallback(response, file, filelist) {
      var fileId = response.id;
      this.$router.push(`${this.nextUrl}/${fileId}`);
    }
  }
};
</script>
