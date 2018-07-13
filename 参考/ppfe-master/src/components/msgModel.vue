<template>
    <v-modal :title="title" closable :width="width" :visible="showFlag" @cancel="ensure">
        <div>
            <img :src="src" alt="" style="display:inline-block;">
            <div class="submitwrap">
                <p class="titlemsg">{{msgTitle}}</p>
                <p class="contmsg">{{msg}}</p>
            </div>
        </div>
        <div slot="footer">
            <button class="_btn" @click="ensure">确 定</button>
        </div>
    </v-modal>
</template>
<script>
    export default {
        props: {
            src: { required: true },
            title: { required: true, default: '' },
            msgTitle: { required: true, default: '' },
            msg: { required: true, default: '' },
            showFlag: { required: true },
            width: { default: 690 },
        },
        methods: {
            ensure() {
                this.$emit("ensreClick");
            }
        }
    }

</script>
<style scoped>
    .submitwrap {
        display: inline-block;
        vertical-align: top;
        padding-left: 35px;
    }

    .submitwrap .titlemsg {
        color: #03a1ea;
        font-size: 22px;
        font-family: '黑体';
    }

    .submitwrap .contmsg {
        font-size: 14px;
        margin-top: 14px;
    }
</style>