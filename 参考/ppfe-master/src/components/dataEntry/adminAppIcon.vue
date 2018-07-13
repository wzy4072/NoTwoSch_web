<template>
    <div>
        <extavatar v-if="src == null" :username="name" :size="size" :rounded="rounded" ></extavatar>
        <extavatar v-else :src="src" :username="name" :size="size" :rounded="rounded"  ></extavatar>
    </div>
</template>

<script>
    import Avatar from 'vue-avatar/dist/vue-avatar.min.js';
    import appResource from '@/api/resource.js';

    export default {
        components: {
            extavatar: Avatar.Avatar,
        },
        props: {
            id: String,
            name: String,
            size: Number,
//            flag
        },
        data() {
            return {
                src: null,
                rounded: false,
            }
        },
        watch: {
            id(val) {
                if (val != null) {
                    appResource.appIconData(val).then(data => {
                        this.src = data;
                    });
                } else {
                    this.src = null;
                }
            }
        },
        created() {
            if (this.id != null) {
                appResource.appIconData(this.id).then(data => {
                    this.src = data;
                });
            } else {
                this.src = null;
            }
        }
    }
</script>
