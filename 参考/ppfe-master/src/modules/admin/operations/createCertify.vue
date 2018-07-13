<template>
  <div style="padding:20px;">
    <v-card :title="'添加凭证'">
      <v-row>名称:
        <v-input v-model="formData.name"></v-input>
      </v-row>
      <v-row>开关:
        <v-input v-model="formData.optionValues"></v-input>
      </v-row>
      <v-row>
        <v-button type="primary" @click="create">发送</v-button>
      </v-row>
    </v-card>
  </div>

</template>
<script>
import api from '@/api/admin/voucher.js';
export default {
  data() {
    return {
      formData: { name: null, optionValues: null }
    }
  },
  methods: {
    create() {
      api.createVerify(this.formData).then(res => {
        if (res.success) {
          this.$message.info('操作成功！');
        } else {
          this.$message.info('操作失败！');
        }
      }).catch(err => {
        this.$message.info('操作失败！' + err.message);
        console.log(err);
      })
    }
  }
}
</script>

