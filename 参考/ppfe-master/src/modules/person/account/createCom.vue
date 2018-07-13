<template>
    <div style="padding:30px;">
        <v-card title="公司列表" class="card-init">
<div class="com-list">
                <com-list
                :changeFlag="changeFlag"
                ></com-list>
</div>
                <button class="_btn cro-com" @click="showCreateCom=true">创建公司</button>
        </v-card>
         <!-- 创建公司 -->
            <create-com 
            :showCreate="showCreateCom" 
            :isEdit="isEdit" 
            @cancel="showCreateCom = false" 
            @ok="createSuc">
        </create-com>
        <!-- 创建公司申请提交成功 -->
        <msg-model src='/static/images/home/alreadySubmit.png' title='创建公司！' msgTitle="已经提交审核！" msg='请保持电话的畅通，我们正在赶往联系您的路上！' :showFlag="createComState"
            @ensreClick="createComState=false">
        </msg-model>
    </div>

</template>

<script>
    import msgModel from '@/components/msgModel.vue';
    import comList from '@/components/dataDisplay/comList.vue';
    import createCom from '@/components/dataEntry/createCom.vue'
    import comapi from '@/api/company/common';

    export default {
        components: {
            'msgModel': msgModel,
            'createCom': createCom,
            'comList': comList,
        },
        data() {
            return {
            //创建公司
            changeFlag:false,
                showCreateCom: false,
                isEdit: false,
                createComState: false,
            }
        },
        methods: {
            //公司创建成功
            createSuc() {
                this.createComState = true;
                this.changeFlag = ! this.changeFlag;
                // 刷新上下文
            },
    }
}
</script>
<style scoped>
        @import '/static/css/common.css';
    @import '/static/css/modal.css';
    .com-list{
        margin-bottom: 38px;
    }
    .cro-com{
        margin:0;
        margin-left:35px;
    }
</style>