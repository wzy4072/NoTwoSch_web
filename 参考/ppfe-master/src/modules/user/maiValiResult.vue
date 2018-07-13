<template>
    <div style="padding:30px;">
        <v-spin :spinning="loading" tip="加载中">
                <v-card class ='card'>
                        <div v-show="userinfo.isBindingEmail=='suc'">恭喜您，邮箱绑定成功！</div>
                        <div v-show="userinfo.isBindingEmail=='fail'">抱歉，您的邮箱绑定失败了，请重新尝试！</div>
                        <div v-show="userinfo.isBindingEmail=='init' ">正在获取绑定结果...</div>
                </v-card>
        </v-spin>
    </div>
</template>

<script>
    import perapi from '@/api/person/common';

    export default {
        data() {
            return {
                loading: true,
                userinfo:{
                   //false是初始值，请勿更改
                    isBindingEmail:'init'
                },
            }
        },
        created() {
            let _this = this;
            perapi.bindEmail( this.$route.params.code ).then(
                req => {
                  if(req){
                   _this.userinfo.isBindingEmail = 'suc';
                  }else{
                    _this.userinfo.isBindingEmail = 'fail';
                  }
                  _this.loading = false;
                }
            )
            .catch(message => {
                this.$message.info('数据请求失败！' + message);
                _this.loading = false;
            })
        },
        methods:{
            
        }
    }
</script>
<style>
    .card div{
        font-size: 20px;
        margin: 8px auto;
    }
</style>