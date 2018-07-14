<template>
    <div id="login">
         登录的表单
    </div>
</template>

<style>

</style>

<script>
    import api from '@/api/admin/common';
    export default {
        data() {
            return {
                spinning: false,
                username: null,
                password: null,
            }
        },
        methods: {
            login() {
                console.log(api);
                this.spinning = true;
                api.login(this.username,this.password)
                    .then(requst => {
                        this.spinning = false;
                        if(requst.success === true) {
                            this.$router.push('/home');
                        }else {
                            this.$message.error(requst.message, 3);
                        }
                    }).catch(message => {
                    this.spinning = false;
                    this.$message.error(message);
                });
            }
        }
    }
</script>
