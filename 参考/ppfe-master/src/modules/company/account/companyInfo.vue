<template>
   <div>
       <company-edit v-if="adminFlag"></company-edit>
       <company-show v-if="!adminFlag"></company-show>
   </div>        
</template>
<script>
import companyInfoShow from '@/components/dataDisplay/companyInfoShow.vue';
import companyInfoEdit from '@/components/dataEntry/companyInfoEdit.vue'
import avatar from '@/components/avatar.vue';
export default {
    components: {
        'companyShow': companyInfoShow,
        'companyEdit':companyInfoEdit
    },   
    data() {
        return {
            adminFlag:false,
        }
    },
    created() {
        this.isAdmin();
    },
    computed: {
        loginContext() {
            return this.$store.getters.loginContext == null ? { currentCorporate: { id: null }, person: '' } : this.$store.getters.loginContext;
        },
    },
    methods: {
        //判断管理员身份
        isAdmin(){
            if (this.loginContext.currStaff.roles) {
                let  rolArr = this.loginContext.currStaff.roles;
                for (let i = 0; i < rolArr.length; i++) {
                    if (rolArr[i].rolecode == 2) { 
                        this.adminFlag = true; 
                        }
                }
            } else {
                this.$message.info('未找到您的信息！' );
                return false;
            }
            //测试用
            // this.adminFlag = false; 
        },

    }
}
</script>
<style scoped>
@import "/static/css/common.css";
.logo-warp {
  text-align: center;
}
.up-btn {
  display: block;
}
</style>

