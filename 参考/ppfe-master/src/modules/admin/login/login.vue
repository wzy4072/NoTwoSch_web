<template>
    <div id="login">
        <v-spin :spinning="spinning" tip="登入中">
            <v-card title="管理员登录">
                <v-form direction="vertical">
                    <v-form-item label="用户名">
                        <v-input v-model="username" type="text" placeholder="用户名" size="large"></v-input>
                    </v-form-item>
                    <v-form-item label="密码">
                        <v-input v-model="password" type="password" placeholder="密码" size="large"></v-input>
                    </v-form-item>
                    <v-form-item style="margin-top:24px">
                        <v-button type="primary" html-type="submit" @click.prevent="login">登录</v-button>
                    </v-form-item>
                </v-form>
            </v-card>
        </v-spin>
    </div>
</template>

<style>
    #login{
        margin: auto;
        position: absolute;
        min-width: 460px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
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
            },
        }
    }
</script>
