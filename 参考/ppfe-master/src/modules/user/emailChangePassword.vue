<template>
    <div style="padding:30px;">
        <div class="form-title">修改密码</div>
        <change-password 
        isinit="1" 
        :ecode="emialCode" 
        apiname="changePasswordByEmail"
        ></change-password>
    </div>
</template>

<script>
import perapi from '@/api/person';
import changePassword from '@/components/dataEntry/changePassword.vue';
export default {
    components: {
        'changePassword': changePassword
    },
    data() {
        return {
            emialCode: this.$route.params.code,
        }
    },
    methods: {
    },
}
</script>
<style scoped>
.form-title {
  text-align: center;
  font-size: 18px;
  margin: 28px;
}
</style>
