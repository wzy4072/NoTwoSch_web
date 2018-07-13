<template>
    <div class="avt avt-l">
        <div class="avt-wrap1">
            <div class="avt-wrap2">
                <simple-avatar 
                    :gotid="true"
                    :id="id" 
                    :isCom="true"
                ></simple-avatar>
            </div>
        </div>
    </div>
</template>

<script>
    import simpleAvatar from '@/components/dataDisplay/_avatar.vue';
    export default {
        props: ['gotId','id',],
        components: {
             'simpleAvatar': simpleAvatar
        },
        data() {
            return {
            }
        },
    }
</script>
<style scoped>
    @import '/static/css/common.css';
    @import '/static/css/modal.css';
      .avt.avt-l {
        padding: 30px;
        background-color: #F5F5F5;
        border: 1px solid #e3e5e8;
        border-right: none;
        border-radius: 300px 0 0 300px;
    }

      .avt-wrap1,
      .avt-wrap2 {
        padding: 8px;
        border: 1px solid #fff;
        border-radius: 50%;
    }

      .avt-wrap1 {
        width: 192px
    }

      .avt-wrap2 {
        width: 176px
    }
</style>