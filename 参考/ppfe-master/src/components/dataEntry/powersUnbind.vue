<template>
        <v-modal title="凭证解绑"
        :visible="unbindShow"
        @ok="ensureUnbind"
        @cancel="cancel">
        <p>
                <v-checkbox :indeterminate="indeterminate" v-model="allChecked" @click="checkAll">全选</v-checkbox>
            </p>
        <p style="margin-bottom: 16px;">
            <v-checkbox-group 
            :data="voucherList" 
            label='certificateno'
            keyField='certificateid'
            v-model="checkedOpts"
            @change="setState"></v-checkbox-group>
        </p>

</v-modal>

</template>

<script>
     import tool from '@/api/tool';
 export default {
    props:['voucherList','unbindShow'],
     data(){
         return {
            checkedOpts:[],
            indeterminate:false,
            allChecked:false,
         }
     },
     methods:{
        ensureUnbind(){ 
           this.$emit('ok',this.checkedOpts);
         },
        cancel(){ 
            this.$emit('cancel'); 
        },
        checkAll(){
            if (this.checkedOpts.length == this.voucherList.length) {
                    this.checkedOpts = [];
                    this.allChecked = false;
                    this.indeterminate = false;
                } else {
                    this.checkedOpts = tool.getArrItemValues(this.voucherList,'certificateid'); ;
                    this.allChecked = true;
                    this.indeterminate = false;
                }
        },
        setState(){
            this.indeterminate =  this.checkedOpts.length > 0 && this.checkedOpts.length < this.voucherList.length;
            this.allChecked = this.checkedOpts.length == this.voucherList.length;
        },
     }
 }

</script>