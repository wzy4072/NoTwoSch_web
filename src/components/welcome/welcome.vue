<template>
  <div class="act-form">
    <el-upload
      class="avatar-uploader"
      action="http://localhost:8080/api/user/avatar"
      name="imgBinary"
      with-credentials
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="userInfo.imgBinary" :src="userInfo.imgBinary" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <hr>
    this is new obj{{testList}}
    <el-button @click="testGive">test</el-button>
  </div>
</template>

<script>
import api from "@/api/common/account";
export default {
  name: "welcome",
  data() {
    return {
      userInfo: { imgBinary: "" },
      testList: []
    };
  },
  methods: {
    testGive() {
      let obj = {};
      // let _this = this
       ({ list: this.testList } = {
        page: 1,
        total: 20,
        list: [{ name: "tom" }, { name: "jerry" }]
      });
      console.log(this.testList);
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
    },
    beforeAvatarUpload(file) {},
    chickLogin() {
      api.checkLogin().then(res => {
        if (res.success) {
          this.userInfo = res.data || { imgBinary: "" };
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
        console.log(res);
      });
    }
  },
  mounted() {
    this.chickLogin();
  }
};
</script>