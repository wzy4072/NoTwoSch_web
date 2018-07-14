<template>
    <div id="login">
        this is login page
    </div>
</template>

<style>

</style>

<script>
    import api from '@/api/common/loginout';
    export default {
        name:'login',
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
