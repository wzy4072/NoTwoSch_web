<template>
    <v-modal title="员工信息" closable :width="690" :visible="infoShow" 
    @cancel="cancel"
    @ok="ok">
            <v-row>
                <v-col span = '6' class="st-avt">

                    <avatar :id="staffInfo.avatar || null " name="staffInfo.accountNo || 'i'" :size="100"></avatar>

                </v-col>
                <v-col span="18" class="st-info">
                    <p><span>账号：{{staffInfo.accountNo}}</span><span> 籍贯：{{staffInfo.birthOrigin}}</span></p>
                    <p><span> 姓名：{{staffInfo.relName}}</span><span>学历：{{staffInfo.eduBg}} </span></p>
                    <p><span> 工号：{{staffInfo.staffNo}}</span><span>资格证书：{{staffInfo.qualifi}}</span></p>
                    <p><span> 电话：{{staffInfo.phone}}</span><span> 能力优势：{{staffInfo.strongPoint}}</span></p>
                    <p><span>  邮箱：{{staffInfo.email}}</span><span></span></p>
                </v-col>
            </v-row>
    </v-modal>
</template>

<script>
        import avatar from '@/components/avatar.vue'

    export default {
        components:{
            'avatar':avatar,
        },
        props: ['staffInfo', 'infoShow'],
        data() {
            return {

            }
        },
        methods: {
            cancel(){ this.$emit('cancel'); },
            ok(){ this.$emit('ok'); }

        }


    }
</script>
<style scoped>
.st-avt{
padding:25px;
padding-top:56px;
}
.st-info{
    padding: 10px 20px;
    border-left: 5px solid #ccc;
}
.st-info p {
    padding: 12px 0;
    font-size: 14px;
}
.st-info p span{
    display: inline-block;
    width: 50%;
}
</style>