<template>
    <div class="auto-show">
      <span v-show="!iptShow" @click="getFocus">{{iptValue}}<v-icon type="edit"></v-icon></span></span>
      <v-input v-show="iptShow"  @blur="valueChange"  type="text" v-model="iptValue" ></v-input>
    </div>
</template>
<script>
export default {
    props:{
        value:String
    },
    data: function () { 
        return {
            iptShow:false,
            iptValue:this.value
        };
    },
  
    methods: {
        getFocus(){
            this.iptShow = true;
            let event = window.event || arguments.callee.caller.arguments[0];
            let target = event.srcElement || event.target;
            setTimeout(function () { target.nextElementSibling.focus(); })
        },
        valueChange(){
            this.$emit('input',this.iptValue);
            this.iptShow = false
        }
    },

}
</script>
<style scoped>
.auto-show span,
.auto-show input{
    font-size:14px;
    
}
</style>
